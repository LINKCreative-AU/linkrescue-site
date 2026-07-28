import { NextResponse } from "next/server";
import { QUESTIONS, score, summarise } from "@/lib/assessment";
import { emailLead, notifySlack, storeLead, type Lead } from "@/lib/leads";

// Lead intake. The score and outcome are recomputed server-side from the raw
// answers - the client's copy is display-only and never trusted.

const MAX_LEN = 300;
const clean = (v: unknown) => String(v ?? "").trim().slice(0, MAX_LEN);

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ ok: false }, { status: 400 });

  const name = clean(data.name);
  const phone = clean(data.phone);
  const email = clean(data.email);
  if (!name || !phone || !email) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const rawAnswers: number[] = Array.isArray(data.answers)
    ? data.answers.slice(0, QUESTIONS.length).map((n: unknown) => Number(n))
    : [];
  const valid =
    rawAnswers.length === QUESTIONS.length &&
    rawAnswers.every((n, i) => Number.isInteger(n) && n >= 0 && n < QUESTIONS[i].options.length);
  if (!valid) return NextResponse.json({ ok: false }, { status: 400 });

  const { total, outcome, flags } = score(rawAnswers);

  const attribution = {
    utm: Object.fromEntries(
      Object.entries((data.attribution?.utm as Record<string, unknown>) ?? {})
        .slice(0, 10)
        .map(([k, v]) => [clean(k), clean(v)])
    ),
    referrer: clean(data.attribution?.referrer),
    landing: clean(data.attribution?.landing),
  };

  const lead: Lead = {
    name,
    phone,
    email,
    business: clean(data.business),
    answers: summarise(rawAnswers),
    rawAnswers,
    score: total,
    outcome,
    flags,
    attribution,
  };

  // All three channels run; any can be unconfigured or fail without losing
  // the lead. If every channel misses, the console log in each helper is the
  // last line of defence.
  const [stored, slacked, emailed] = await Promise.all([
    storeLead(lead),
    notifySlack(lead),
    emailLead(lead),
  ]);
  if (!stored && !slacked && !emailed) {
    console.error("[lead - all channels unconfigured or failed]", JSON.stringify(lead));
  }

  return NextResponse.json({ ok: true, outcome: outcome.id });
}
