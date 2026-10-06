import { NextResponse } from "next/server";
import { pushLead } from "@/lib/linkleads";
import { QUESTIONS, score, summarise } from "@/lib/assessment";
import { emailLead, emailVisitor, notifySlack, upsertCart, type CartRecord, type CompletedCart, type LeadStage } from "@/lib/leads";
import { leadSource } from "@/lib/lead-source";
import { guardFormPost, guardOrigin, guardResponse } from "@/lib/form-guard";

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
  const leadSrc = leadSource(req, "/api/lead");
  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ ok: false }, { status: 400 });

  // ORIGIN CHECK ON EVERY STAGE, THE FULL GUARD ON `completed` ONLY.
  //
  // This route is not a form, it is a funnel: `progress` fires after every
  // answered question, so one honest person completing the assessment is a
  // dozen POSTs from one address. guardFormPost allows six in ten minutes
  // across all endpoints, so putting it here wholesale would refuse real
  // people in the middle of the assessment - and a check that fires on real
  // people gets taken out, which leaves nothing.
  //
  // So the half that costs an honest visitor nothing applies throughout, and
  // the full guard waits for the stage that actually reaches a human: see
  // below, just before the Slack and email notifications fire.
  const originOk = guardOrigin(req);
  if (!originOk.ok) return guardResponse(originOk, "/api/lead");

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

  // completed - the stage that notifies a human and sends email, so it takes
  // the whole guard: honeypot, fill time, link stuffing and flood control.
  const guard = guardFormPost(req, data);
  if (!guard.ok) return guardResponse(guard, "/api/lead");

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

  // A second copy into the Engine Room, on top of the three channels below.
  // Only the completed stage: `started` and `progress` are an abandoned-cart
  // trail with partial details, and pushing those would fill the group lead
  // desk with half-finished assessments and fire the unclaimed-lead siren on
  // people who never asked to be contacted.
  pushLead({
    form: "assessment",
    name: rec.name,
    email: rec.email || undefined,
    phone: rec.phone || undefined,
    details: {
      business: rec.business,
      abn: rec.abn,
      entity_type: rec.entityType,
      entity_location: rec.entityLocation,
      score: rec.score,
      outcome: rec.outcome,
      flags: rec.flags,
    },
    src: {
      ...rec.attribution?.utm,
      referrer: rec.attribution?.referrer,
      landing: rec.attribution?.landing,
    },
  });

  const [stored, slacked, emailed] = await Promise.all([
    upsertCart(rec),
    notifySlack(rec, leadSrc),
    emailLead(rec, leadSrc),
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
