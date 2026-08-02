import { NextResponse } from "next/server";
import { QUESTIONS, score, summarise } from "@/lib/assessment";
import { emailLead, emailVisitor, notifySlack, upsertCart, type CartRecord, type CompletedCart, type LeadStage } from "@/lib/leads";

// Cart-style lead intake (gstregister funnel pattern):
//   started   → business + email captured, cart row created
//   progress  → fired after each answered question, cart row updated
//   completed → full contact details; score recomputed server-side (the
//               client's copy is display-only and never trusted), Slack +
//               email notifications fire
// Every stage upserts on the client cart id, so abandoned assessments stay
// in the table with their progress attached.

const MAX_LEN = 300;
const clean = (v: unknown) => String(v ?? "").trim().slice(0, MAX_LEN);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STAGES: LeadStage[] = ["started", "progress", "completed"];

function cleanAnswers(v: unknown, requireFull: boolean): number[] | null {
  if (!Array.isArray(v)) return null;
  const arr = v.slice(0, QUESTIONS.length).map((n) => Number(n));
  if (requireFull && arr.length !== QUESTIONS.length) return null;
  const valid = arr.every(
    (n, i) => Number.isInteger(n) && n >= 0 && n < QUESTIONS[i].options.length
  );
  return valid ? arr : null;
}

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ ok: false }, { status: 400 });

  const id = clean(data.cartId);
  const stage = clean(data.stage) as LeadStage;
  if (!UUID_RE.test(id) || !STAGES.includes(stage)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const attribution = {
    utm: Object.fromEntries(
      Object.entries((data.attribution?.utm as Record<string, unknown>) ?? {})
        .slice(0, 10)
        .map(([k, v]) => [clean(k), clean(v)])
    ),
    referrer: clean(data.attribution?.referrer),
    landing: clean(data.attribution?.landing),
  };

  const email = clean(data.email);
  const business = clean(data.business);
  const abn = clean(data.abn).replace(/[^\d]/g, "").slice(0, 11);

  if (stage === "started") {
    if (!email.includes("@") || (!business && !abn)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await upsertCart({
      id,
      stage,
      email,
      business,
      abn,
      entityType: clean(data.entityType),
      entityLocation: clean(data.entityLocation),
      attribution,
    });
    return NextResponse.json({ ok: true });
  }

  if (stage === "progress") {
    const rawAnswers = cleanAnswers(data.answers, false);
    if (!rawAnswers) return NextResponse.json({ ok: false }, { status: 400 });
    await upsertCart({ id, stage, rawAnswers });
    return NextResponse.json({ ok: true });
  }

  // completed
  const name = clean(data.name);
  const phone = clean(data.phone);
  const rawAnswers = cleanAnswers(data.answers, true);
  if (!name || !phone || !email.includes("@") || !rawAnswers) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { total, outcome, flags } = score(rawAnswers);

  const rec: CompletedCart = {
    id,
    stage,
    name,
    phone,
    email,
    business,
    abn,
    entityType: clean(data.entityType),
    entityLocation: clean(data.entityLocation),
    rawAnswers,
    answers: summarise(rawAnswers),
    score: total,
    outcome,
    flags,
    attribution,
  } satisfies CartRecord as CompletedCart;

  const [stored, slacked, emailed] = await Promise.all([
    upsertCart(rec),
    notifySlack(rec),
    emailLead(rec),
    emailVisitor(rec), // the visitor's copy of their result
  ]);
  // Three independent channels, so one failing is survivable. All three failing
  // means the assessment exists nowhere durable, and this is the one form on
  // the site where the person filling it in is in genuine trouble. Sending them
  // to a result page that implies we have their details would be the worst
  // possible outcome, so fail loudly and let the form offer the phone number.
  if (!stored && !slacked && !emailed) {
    console.error("[lead NOT DELIVERED - every channel unconfigured or failed]", JSON.stringify(rec));
    return NextResponse.json({ ok: false, error: "not-delivered" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, outcome: outcome.id });
}
