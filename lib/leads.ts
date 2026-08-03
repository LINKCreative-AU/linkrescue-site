// Lead delivery, cart-style (the gstregister funnel pattern): one row per
// assessment "cart", created the moment business + email land, updated on
// every answered question, finalised on completion. Abandoned carts stay in
// the table with their progress attached, ready for follow-up.
//
// Storage is a Supabase upsert keyed on the client cart id. Slack and email
// fire only on completion. Every channel is env-driven with graceful
// fallback; worst case the lead is logged so it is never silently dropped.
//
// Env:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  → rows in rescue_leads (REST, no SDK)
//   SLACK_LEADS_WEBHOOK                      → incoming-webhook post on completed leads
//   RESEND_API_KEY, RESEND_FROM, LEADS_TO    → email via Resend (LEADS_TO = comma list)

import type { Outcome } from "./assessment";

export type LeadStage = "started" | "progress" | "completed";

export type CartRecord = {
  id: string;
  stage: LeadStage;
  email?: string;
  business?: string;
  abn?: string;
  entityType?: string;
  entityLocation?: string;
  name?: string;
  phone?: string;
  rawAnswers?: number[];
  answers?: { topic: string; answer: string }[];
  score?: number;
  outcome?: Outcome;
  flags?: string[];
  attribution?: { utm: Record<string, string>; referrer: string; landing: string };
};

export type CompletedCart = CartRecord &
  Required<Pick<CartRecord, "name" | "phone" | "email" | "answers" | "score" | "outcome">>;

export async function upsertCart(rec: CartRecord): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log(`[lead - supabase not configured] stage=${rec.stage} id=${rec.id}`);
    return false;
  }
  const row: Record<string, unknown> = {
    id: rec.id,
    stage: rec.stage,
    updated_at: new Date().toISOString(),
  };
  if (rec.email !== undefined) row.email = rec.email;
  if (rec.business !== undefined) row.business = rec.business || null;
  if (rec.abn !== undefined) row.abn = rec.abn || null;
  if (rec.entityType !== undefined) row.entity_type = rec.entityType || null;
  if (rec.entityLocation !== undefined) row.entity_location = rec.entityLocation || null;
  if (rec.name !== undefined) row.name = rec.name;
  if (rec.phone !== undefined) row.phone = rec.phone;
  if (rec.rawAnswers !== undefined) row.raw_answers = rec.rawAnswers;
  if (rec.answers !== undefined) row.answers = rec.answers;
  if (rec.score !== undefined) row.score = rec.score;
  if (rec.outcome !== undefined) {
    row.outcome = rec.outcome.id;
    row.priority = rec.outcome.priority;
  }
  if (rec.flags !== undefined) row.flags = rec.flags;
  if (rec.attribution !== undefined) {
    row.utm = rec.attribution.utm;
    row.referrer = rec.attribution.referrer || null;
    row.landing_path = rec.attribution.landing || null;
  }
  try {
    const res = await fetch(`${url}/rest/v1/rescue_leads?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      console.error("[lead supabase failed]", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[lead supabase failed]", e);
    return false;
  }
}

/**
 * The visitor's copy: their result, what it means and the next step, sent the
 * moment they complete. Not a mailing list, a deliverable. Requires
 * RESEND_API_KEY; BOOKING_URL adds a book-a-time button when configured.
 */
export async function emailVisitor(rec: CompletedCart): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log("[visitor email - resend not configured]");
    return false;
  }
  // Deliberately NOT RESEND_FROM: that carries the shared leads@ sender, which
  // is send-only and would bounce any reply from the visitor. This one goes to a
  // real person, so it sends from the verified link.com.au domain on an address
  // that can take a reply.
  const from = "LINK Rescue <noreply@link.com.au>";
  const booking = process.env.BOOKING_URL;
  const firstName = rec.name.split(" ")[0];
  const subject = `Your business rescue result: ${rec.outcome.label}`;
  const steps = rec.outcome.steps.map((s) => `• ${s}`).join("\n");
  const text = [
    `Hi ${firstName},`,
    ``,
    `Here is the result of the assessment you just ran${rec.business ? ` for ${rec.business}` : ""}:`,
    ``,
    `${rec.outcome.label.toUpperCase()}: ${rec.outcome.headline}`,
    ``,
    rec.outcome.meaning,
    ``,
    `The sensible next moves:`,
    steps,
    ``,
    `The right person is already lined up to call you. If you would rather not wait, call 07 3899 8311${booking ? ` or book a time that suits you: ${booking}` : ""}.`,
    ``,
    `James, Kyle and David`,
    `LINK Rescue · rescue.link.com.au`,
    ``,
    `This email is your assessment result, not a mailing list. The result is general information, not financial, legal or insolvency advice, and no outcome is guaranteed.`,
  ].join("\n");
  const html = text
    .split("\n\n")
    .map((p) => `<p style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#000000">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [rec.email], subject, text, html }),
    });
    if (!res.ok) {
      console.error("[visitor email failed]", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[visitor email failed]", e);
    return false;
  }
}

const PRIORITY_PREFIX: Record<string, string> = {
  urgent: ":rotating_light: *URGENT - DPN* :rotating_light:",
  high: ":red_circle: *High priority*",
  standard: ":large_green_circle:",
};

export async function notifySlack(rec: CompletedCart): Promise<boolean> {
  const hook = process.env.SLACK_LEADS_WEBHOOK;
  if (!hook) {
    console.log("[lead - slack not configured]");
    return false;
  }
  const utm = Object.entries(rec.attribution?.utm ?? {})
    .map(([k, v]) => `${k}=${v}`)
    .join(" ");
  const summary = rec.answers.map((a) => `• *${a.topic}:* ${a.answer}`).join("\n");
  const text = [
    `${PRIORITY_PREFIX[rec.outcome.priority]} New rescue lead - *${rec.outcome.label}* (score ${rec.score})`,
    `*Name:* ${rec.name}`,
    `*Phone:* ${rec.phone}`,
    `*Email:* ${rec.email}`,
    rec.business ? `*Business:* ${rec.business}${rec.abn ? ` (ABN ${rec.abn})` : ""}` : "",
    rec.entityLocation ? `*Location:* ${rec.entityLocation}` : "",
    summary,
    utm ? `*Source:* ${utm}` : rec.attribution?.referrer ? `*Referrer:* ${rec.attribution.referrer}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  try {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      console.error("[lead slack failed]", res.status);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[lead slack failed]", e);
    return false;
  }
}

export async function emailLead(rec: CompletedCart): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  // Rescue has no entry of its own in the group register
  // (SLACK-EMAIL-INTEGRATIONS.md in the linkhq repo); James's call 2026-07-30 is
  // that it delivers to the same place as Advisors. The previous fallback,
  // rescue@link.com.au, was never confirmed to exist.
  const to = (process.env.LEADS_TO ?? "k1q9k5c8u4v2o2l6@linkcohq.slack.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  // link.com.au is verified in Resend, so the shared leads@ sender works; it is
  // SEND-ONLY and must never appear as a recipient.
  const from = process.env.RESEND_FROM ?? "LINK Rescue <leads@link.com.au>";
  const subject = `[${rec.outcome.label}] Rescue lead - ${rec.name}`;
  const lines: [string, string][] = [
    ["Outcome", `${rec.outcome.label} (${rec.outcome.priority} priority, score ${rec.score})`],
    ["Name", rec.name],
    ["Phone", rec.phone],
    ["Email", rec.email],
    ["Business", rec.business ? `${rec.business}${rec.abn ? ` (ABN ${rec.abn})` : ""}` : "-"],
    ["Location", rec.entityLocation || "-"],
    ...rec.answers.map((a) => [a.topic, a.answer] as [string, string]),
    ["Source", JSON.stringify(rec.attribution?.utm ?? {})],
    ["Referrer", rec.attribution?.referrer || "-"],
  ];
  const text = lines.map(([k, v]) => `${k}: ${v}`).join("\n");
  if (!key) {
    console.log(`[lead - email not configured] ${subject}\n${text}`);
    return false;
  }
  const html =
    `<h2 style="font-family:sans-serif">${subject}</h2>` +
    `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">` +
    lines
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><strong>${v}</strong></td></tr>`
      )
      .join("") +
    `</table>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, text, html }),
    });
    if (!res.ok) {
      console.error("[lead email failed]", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[lead email failed]", e);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Direct enquiries from /contact.
//
// Deliberately NOT written to rescue_leads: that table's shape is the
// assessment cart (answers, score, outcome, priority), and an enquiry has
// none of those. Rather than write half-empty rows against a schema this repo
// cannot see, enquiries go straight to the two channels a human actually
// watches - Slack and the leads inbox - with a console fallback so nothing is
// ever silently dropped. If enquiries need to land in the database later, add
// a table of their own rather than bending this one.
//
// Urgency is the caller's own words, not a score. A director who says the
// notice is dated is not something to grade.

export type Enquiry = {
  name: string;
  phone: string;
  email?: string;
  business?: string;
  urgency: string;
  message?: string;
  /** Self-reported "how did you hear about us" (Brad's ask, 2026-07-31). */
  heard?: string;
  attribution?: { utm: Record<string, string>; referrer: string; landing: string };
};

const URGENCY_PREFIX: Record<string, string> = {
  "dpn": ":rotating_light: *DPN / deadline* :rotating_light:",
  "urgent": ":red_circle: *This week*",
  "soon": ":large_yellow_circle: *Weeks, not days*",
  "planning": ":large_green_circle: *Planning ahead*",
};

export async function notifyEnquiry(rec: Enquiry): Promise<boolean> {
  const lines: [string, string][] = [
    ["Name", rec.name],
    ["Phone", rec.phone],
    ["Email", rec.email || "-"],
    ["Business", rec.business || "-"],
    ["Urgency", rec.urgency],
    ["Message", rec.message || "-"],
    // Self-reported, and worth more than the UTM line under it: no analytics
    // tool can see an accountant's recommendation or an AI assistant's answer.
    ["Heard about us", rec.heard || "-"],
    ["Source", JSON.stringify(rec.attribution?.utm ?? {})],
    ["Referrer", rec.attribution?.referrer || "-"],
  ];
  const text = lines.map(([k, v]) => `${k}: ${v}`).join("\n");
  const subject = `[Enquiry] Rescue contact - ${rec.name}`;

  const hook = process.env.SLACK_LEADS_WEBHOOK;
  const slack = hook
    ? fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: [
            `${URGENCY_PREFIX[rec.urgency] ?? ":speech_balloon:"} New contact enquiry (not an assessment)`,
            `*Name:* ${rec.name}`,
            `*Phone:* ${rec.phone}`,
            rec.email ? `*Email:* ${rec.email}` : "",
            rec.business ? `*Business:* ${rec.business}` : "",
            rec.message ? `*What is happening:* ${rec.message}` : "",
            rec.heard ? `*Heard about us:* ${rec.heard}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      })
        .then((r) => r.ok)
        .catch(() => false)
    : Promise.resolve(false);

  const key = process.env.RESEND_API_KEY;
  // Same routing as assessment leads: the Advisors channel address, per
  // James 2026-07-30. leads@ is SEND-ONLY and must never be a recipient.
  const to = (process.env.LEADS_TO ?? "k1q9k5c8u4v2o2l6@linkcohq.slack.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.RESEND_FROM ?? "LINK Rescue <leads@link.com.au>";
  const mail = key
    ? fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to,
          subject,
          text,
          // reply_to only when they gave an address - replying to nothing is worse
          // than no reply button at all.
          ...(rec.email ? { reply_to: rec.email } : {}),
          html:
            `<h2 style="font-family:sans-serif">${subject}</h2>` +
            `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">` +
            lines
              .map(
                ([k, v]) =>
                  `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><strong>${v}</strong></td></tr>`
              )
              .join("") +
            `</table>`,
        }),
      })
        .then((r) => r.ok)
        .catch(() => false)
    : Promise.resolve(false);

  const [slacked, emailed] = await Promise.all([slack, mail]);
  if (!slacked && !emailed) {
    console.error(`[enquiry - all channels unconfigured or failed] ${subject}\n${text}`);
    return false;
  }
  return true;
}
