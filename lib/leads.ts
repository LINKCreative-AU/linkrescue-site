// Lead delivery: Supabase storage + Slack notification + Resend email, all
// env-driven with graceful fallback. Any channel can be unconfigured or fail
// and the lead still lands through the others; worst case it is logged so a
// lead is never silently dropped.
//
// Env:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  → row in rescue_leads (REST, no SDK)
//   SLACK_LEADS_WEBHOOK                      → incoming-webhook post to the leads channel
//   RESEND_API_KEY, RESEND_FROM, LEADS_TO    → email via Resend (LEADS_TO = comma list)

import type { Outcome } from "./assessment";

export type Lead = {
  name: string;
  phone: string;
  email: string;
  business: string;
  answers: { topic: string; answer: string }[];
  rawAnswers: number[];
  score: number;
  outcome: Outcome;
  flags: string[];
  attribution: { utm: Record<string, string>; referrer: string; landing: string };
};

export async function storeLead(lead: Lead): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log("[lead - supabase not configured]");
    return false;
  }
  try {
    const res = await fetch(`${url}/rest/v1/rescue_leads`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        business: lead.business || null,
        answers: lead.answers,
        raw_answers: lead.rawAnswers,
        score: lead.score,
        outcome: lead.outcome.id,
        priority: lead.outcome.priority,
        flags: lead.flags,
        utm: lead.attribution.utm,
        referrer: lead.attribution.referrer || null,
        landing_path: lead.attribution.landing || null,
      }),
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

const PRIORITY_PREFIX: Record<string, string> = {
  urgent: ":rotating_light: *URGENT - DPN* :rotating_light:",
  high: ":red_circle: *High priority*",
  standard: ":large_green_circle:",
};

export async function notifySlack(lead: Lead): Promise<boolean> {
  const hook = process.env.SLACK_LEADS_WEBHOOK;
  if (!hook) {
    console.log("[lead - slack not configured]");
    return false;
  }
  const utm = Object.entries(lead.attribution.utm)
    .map(([k, v]) => `${k}=${v}`)
    .join(" ");
  const summary = lead.answers.map((a) => `• *${a.topic}:* ${a.answer}`).join("\n");
  const text = [
    `${PRIORITY_PREFIX[lead.outcome.priority]} New rescue lead - *${lead.outcome.label}* (score ${lead.score})`,
    `*Name:* ${lead.name}`,
    `*Phone:* ${lead.phone}`,
    `*Email:* ${lead.email}`,
    lead.business ? `*Business:* ${lead.business}` : "",
    summary,
    utm ? `*Source:* ${utm}` : lead.attribution.referrer ? `*Referrer:* ${lead.attribution.referrer}` : "",
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

export async function emailLead(lead: Lead): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = (process.env.LEADS_TO ?? "rescue@link.com.au") // TODO confirm rescue inbox
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.RESEND_FROM ?? "LINK Rescue <onboarding@resend.dev>";
  const subject = `[${lead.outcome.label}] Rescue lead - ${lead.name}`;
  const lines: [string, string][] = [
    ["Outcome", `${lead.outcome.label} (${lead.outcome.priority} priority, score ${lead.score})`],
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Business", lead.business || "-"],
    ...lead.answers.map((a) => [a.topic, a.answer] as [string, string]),
    ["Source", JSON.stringify(lead.attribution.utm)],
    ["Referrer", lead.attribution.referrer || "-"],
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
