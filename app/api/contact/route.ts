import { NextResponse } from "next/server";
import { notifyEnquiry, type Enquiry } from "@/lib/leads";

// Direct enquiries from /contact - people who want to talk rather than run
// the assessment first. Name and phone are the only required fields: this
// audience is stressed and every extra required box is a reason to close the
// tab. Everything else is optional and still useful when it arrives.

const MAX_LEN = 300;
const MAX_MESSAGE = 2000;
const clean = (v: unknown, max = MAX_LEN) => String(v ?? "").trim().slice(0, max);

const URGENCY = ["dpn", "urgent", "soon", "planning"];

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ ok: false }, { status: 400 });

  // Honeypot: a field hidden from people, irresistible to bots. Return 200 so
  // the bot logs a success and does not come back looking for the real path.
  if (clean(data.company)) return NextResponse.json({ ok: true });

  const name = clean(data.name);
  const phone = clean(data.phone);
  const email = clean(data.email);
  const urgency = clean(data.urgency);

  // A phone number with fewer than eight digits cannot be called back, which
  // is the entire point of this form.
  const digits = phone.replace(/\D/g, "");
  if (!name || digits.length < 8) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (email && !email.includes("@")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const rec: Enquiry = {
    name,
    phone,
    email,
    business: clean(data.business),
    urgency: URGENCY.includes(urgency) ? urgency : "soon",
    message: clean(data.message, MAX_MESSAGE),
    heard: clean(data.heard),
    attribution: {
      utm: Object.fromEntries(
        Object.entries((data.attribution?.utm as Record<string, unknown>) ?? {})
          .slice(0, 10)
          .map(([k, v]) => [clean(k), clean(v)])
      ),
      referrer: clean(data.attribution?.referrer),
      landing: clean(data.attribution?.landing),
    },
  };

  // `delivered` is honest about whether a human was actually alerted. If every
  // channel is down the enquiry is only in the server log, and the form says
  // so and pushes the phone number rather than showing a clean confirmation
  // over a lead nobody will see.
  const delivered = await notifyEnquiry(rec);
  return NextResponse.json({ ok: true, delivered });
}
