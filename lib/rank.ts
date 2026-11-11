import { SITE } from "./site";

// rank (rank.link.com.au): this site's two connections to it.
//
//   1. Every enquiry the site accepts is ALSO recorded in rank's leads panel.
//      The existing email / Slack handling is untouched and stays the path a
//      person acts on; this is a second record, sent after the response.
//   2. Articles approved in rank are read from its feed and rendered here.
//
// Env (see docs/rank.md). Nothing is hardcoded and nothing here reaches a
// browser: this module is only ever imported by route handlers and server
// components.
//   RANK_SITE_TOKEN   this site's token in rank. Unset = both halves are off.
//   RANK_INGEST_URL   optional, defaults to rank's lead endpoint
//   RANK_FEED_URL     optional, defaults to the feed on the same origin
//   RANK_LEAD_DETAIL  optional; "full" also sends what a person told us about
//                     their situation. Off by default - see docs/rank.md.
//
// NOTHING IN HERE MAY BREAK AN ENQUIRY OR A BUILD. Every call is bounded by a
// timeout, every failure is logged and swallowed, and with no token the site
// behaves exactly as it did before this file existed.

const DEFAULT_INGEST_URL = "https://rank.link.com.au/api/leads/ingest";
const LEAD_TIMEOUT_MS = 3000;
const FEED_TIMEOUT_MS = 8000;
/** How long a rendered article page and the feed response are reused. */
export const RANK_REVALIDATE = 3600;

const token = () => (process.env.RANK_SITE_TOKEN ?? "").trim();
const ingestUrl = () => (process.env.RANK_INGEST_URL ?? "").trim() || DEFAULT_INGEST_URL;

function feedUrl(): string | null {
  const explicit = (process.env.RANK_FEED_URL ?? "").trim();
  if (explicit) return explicit;
  try {
    return new URL("/api/feed/articles", ingestUrl()).href;
  } catch {
    return null;
  }
}

// ── Leads ────────────────────────────────────────────────────────────────────

/**
 * Whether rank may be sent the detail of someone's situation (the contact
 * message; the assessment answers, score, flags and ABN) as well as who they
 * are. The site tells visitors that detail stays with the LINK Rescue team, so
 * this is off unless RANK_LEAD_DETAIL is exactly "full" - a decision somebody
 * makes on purpose, once access to this site's leads in rank matches that
 * promise.
 */
export const rankFullDetail = () => (process.env.RANK_LEAD_DETAIL ?? "").trim().toLowerCase() === "full";

/** The attribution the forms already capture in the browser, in rank's shape. */
export function rankAttribution(a?: { utm: Record<string, string>; referrer: string; landing: string }) {
  return {
    utm: a?.utm,
    referrer: a?.referrer,
    // `landing` is a path and query on this site; rank wants a URL.
    source_url: a?.landing?.startsWith("/") ? `${SITE.url}${a.landing}` : undefined,
  };
}

export type RankFieldValue = string | number | boolean | string[];

export type RankLead = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  /** The path of the page the form was submitted from. */
  source_path?: string;
  /** Which form this was, e.g. "contact". */
  form_id: string;
  /** The full URL the visitor was on (or landed on), query string included:
      rank reads utm_* and click ids out of it. */
  source_url?: string;
  referrer?: string;
  utm?: Record<string, string>;
  /** The form's own answers, kept as separate values rank can filter on. */
  fields?: Record<string, RankFieldValue | null | undefined>;
  /** Stable for one enquiry. Omit it and rank derives one itself. */
  idempotencyKey?: string;
};

let warnedNoToken = false;

/**
 * Record an accepted enquiry in rank. Resolves when it is done or has given
 * up; never throws. Call it AFTER the form guard has passed, and run it with
 * `after()` from next/server so the visitor's response does not wait on it.
 */
export async function forwardLeadToRank(lead: RankLead): Promise<void> {
  const t = token();
  if (!t) {
    // Once per server instance, not once per enquiry: an unset token is the
    // expected state until the site is switched on in rank.
    if (!warnedNoToken) {
      warnedNoToken = true;
      console.warn("[rank] RANK_SITE_TOKEN is not set - enquiries are not being recorded in rank");
    }
    return;
  }

  // Empty answers are dropped rather than sent as blanks: a row of dashes in
  // the leads panel is noise somebody has to learn to ignore.
  const fields: Record<string, RankFieldValue> = {};
  for (const [k, v] of Object.entries(lead.fields ?? {})) {
    if (v === null || v === undefined || v === "" || v === "-") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    fields[k] = v;
  }
  const utm = Object.fromEntries(
    Object.entries(lead.utm ?? {}).filter(([k, v]) => k && typeof v === "string" && v.trim()),
  );

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), LEAD_TIMEOUT_MS);
  try {
    const res = await fetch(ingestUrl(), {
      method: "POST",
      signal: ctrl.signal,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
        ...(lead.idempotencyKey ? { "Idempotency-Key": lead.idempotencyKey.slice(0, 200) } : {}),
      },
      body: JSON.stringify({
        name: lead.name || null,
        email: lead.email || null,
        phone: lead.phone || null,
        company: lead.company || null,
        message: lead.message || null,
        source_path: lead.source_path || null,
        source_url: lead.source_url || null,
        referrer: lead.referrer || null,
        utm: Object.keys(utm).length ? utm : null,
        form_id: lead.form_id,
        fields,
      }),
    });
    if (!res.ok) console.error("[rank] lead not recorded", res.status);
  } catch (e) {
    console.error("[rank] lead not recorded", e instanceof Error ? e.message : e);
  } finally {
    clearTimeout(timer);
  }
}

// ── Articles ─────────────────────────────────────────────────────────────────

export type RankArticle = {
  title: string;
  slug: string;
  summary: string;
  body_md: string;
  /** ISO timestamp. */
  published_at: string;
};

const SLUG_OK = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Published articles, newest first. An empty list when the token is unset, the
 * feed is down or the response is not what we expect: the caller renders
 * nothing and the site carries on.
 */
export async function rankArticles(): Promise<RankArticle[]> {
  const t = token();
  const url = feedUrl();
  if (!t || !url) return [];
  try {
    const res = await fetch(`${url}${url.includes("?") ? "&" : "?"}token=${encodeURIComponent(t)}`, {
      next: { revalidate: RANK_REVALIDATE },
      signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error("[rank] article feed answered", res.status);
      return [];
    }
    const body = (await res.json()) as { articles?: unknown };
    if (!Array.isArray(body?.articles)) return [];
    const seen = new Set<string>();
    const out: RankArticle[] = [];
    for (const raw of body.articles as Record<string, unknown>[]) {
      const slug = typeof raw?.slug === "string" ? raw.slug : "";
      const title = typeof raw?.title === "string" ? raw.title.trim() : "";
      const body_md = typeof raw?.body_md === "string" ? raw.body_md : "";
      const published_at = typeof raw?.published_at === "string" ? raw.published_at : "";
      if (!SLUG_OK.test(slug) || !title || !body_md.trim()) continue;
      if (Number.isNaN(Date.parse(published_at))) continue;
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push({
        title,
        slug,
        summary: typeof raw.summary === "string" ? raw.summary.replace(/\s+/g, " ").trim() : "",
        body_md,
        published_at,
      });
    }
    return out.sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
  } catch (e) {
    console.error("[rank] article feed unreachable", e instanceof Error ? e.message : e);
    return [];
  }
}

/** A meta description from the summary, cut at a word boundary. */
export function rankDescription(a: RankArticle): string {
  const s = a.summary || a.title;
  return s.length <= 160 ? s : `${s.slice(0, 157).replace(/\s+\S*$/, "")}...`;
}
