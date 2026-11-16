import type { LeadSource } from "./lead-source";

// A copy of every website enquiry for rank. (rank.link.com.au), so it lands in
// this site's Enquiries tab as well as in Slack. James, 16 Nov 2026: "wire up".
//
// Until now LINK's own sites sent enquiries to Slack and nowhere else, so
// rank. could not count them, chase them or report on them, while every client
// site we build posts into rank. as standard. This puts LINK on the same footing.
//
// THE SLACK EMAIL STAYS THE LEAD. This copy is sent after it and never decides
// the answer the visitor gets: no token, rank. down, slow or saying no all end
// in a log line, never in an error to someone who has just asked us for help.
//
// THE SAME ROWS AS THE EMAIL. A route hands over exactly what it put in the
// email, so the two can never disagree. Name, email, phone, business and
// message go into rank.'s own columns; every other row is kept as an answer.
//
// rank. files obvious junk as spam on arrival (lib/lead-spam.ts in
// rank-platform). Nothing is filtered here.
//
// Env: RANK_SITE_TOKEN, this site's token from rank. admin (Engines).

const INGEST = "https://rank.link.com.au/api/leads/ingest";
const TIMEOUT_MS = 4000;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Row labels that are rank. columns, matched case-insensitively. */
const COLUMN: Record<string, "name" | "email" | "phone" | "company" | "message"> = {
  name: "name",
  "full name": "name",
  "your name": "name",
  email: "email",
  "email address": "email",
  phone: "phone",
  mobile: "phone",
  "phone number": "phone",
  business: "company",
  "business name": "company",
  company: "company",
  message: "message",
  "how can we help": "message",
  "how can we help?": "message",
  "biggest challenge": "message",
};

/** Rows some forms add with where the visitor came from. When the value is a
 *  web address it is also sent as the referrer, which rank. reads to label the
 *  enquiry Organic, Google Ads, Business Profile and so on. */
const REFERRER = new Set(["referrer", "source", "came from"]);

/** Provenance rows the email adds itself; rank. has columns for these. */
const SKIP = new Set(["site", "page", "form"]);

const blank = (v: string) => !v.trim() || v.trim() === "-";

export async function sendLeadToRank(rows: [string, string][], source: LeadSource): Promise<void> {
  const token = process.env.RANK_SITE_TOKEN;
  if (!token) {
    console.warn(`[rank. copy skipped - RANK_SITE_TOKEN not set] ${source.form}`);
    return;
  }

  const lead: Record<string, string> = {};
  const fields: Record<string, string> = {};
  let referrer: string | null = null;
  for (const [label, value] of rows) {
    if (blank(value)) continue;
    const key = label.trim().toLowerCase();
    if (SKIP.has(key)) continue;
    if (REFERRER.has(key) && /^https?:\/\//i.test(value.trim())) referrer = value.trim().slice(0, 500);
    const col = COLUMN[key];
    if (col && !lead[col]) lead[col] = value.trim();
    else fields[label.trim().slice(0, 60)] = value.slice(0, 2000);
  }
  // rank. turns away a lead whose email is malformed. Keep what they typed as
  // an answer instead of losing the whole enquiry over it.
  if (lead.email && !EMAIL_RE.test(lead.email)) {
    fields["Email (as typed)"] = lead.email;
    delete lead.email;
  }

  const page = source.page && source.page.startsWith("/") ? source.page : "";
  try {
    const res = await fetch(INGEST, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        ...lead,
        source_path: page || null,
        source_url: page ? `https://${source.site}${page}` : null,
        form_id: source.form.slice(0, 60),
        referrer,
        fields,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error("[rank. copy NOT stored]", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[rank. copy NOT stored]", err instanceof Error ? err.message : err);
  }
}
