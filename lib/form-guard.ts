// ONE GUARD FOR EVERY FORM ENDPOINT.
//
// PORTED FROM linkadvisors, 14 Sep 2026, unchanged except for this note. It is
// deliberately a copy rather than a shared package: there is no private
// registry across the LINK repos, and a vendored file somebody can read in
// place beats an import nobody can follow. If it changes, it changes in
// linkadvisors first and the copies follow.
//
// WHAT WAS HERE BEFORE: nothing. The form routes in this repo delivered leads
// to Slack and to email behind, at best,
//
//     if (!data?.email) return 400
//
// which is a truthiness test - the string "x" passes it. No origin check, no
// rate limit, no honeypot, no captcha.
//
// WHAT THIS DOES AND DOES NOT CLAIM. This stops unsophisticated automation:
// scripts that POST straight at the endpoint, bots that fill every field they
// find, and floods from one address. It will not stop a determined human or a
// headless browser driven properly. That needs a challenge - Cloudflare
// Turnstile is the obvious next step, invisible to most visitors and free - and
// this module is deliberately shaped so that slots in beside it rather than
// being replaced by it.
//
// EVERY CHECK FAILS OPEN WHEN ITS EVIDENCE IS ABSENT. The honeypot and the
// timing check only fire when the client actually sent those fields. That is
// what lets the server-side guard ship across every route today, ahead of the
// form components being updated one at a time, without breaking a single
// working form in the meantime. A check that cannot see its input abstains; it
// does not guess.

/** Why a submission was refused. Returned to the caller for logging, never to
 *  the client - telling a bot which check caught it is free tuning advice. */
export type GuardFailure = {
  ok: false;
  /** What to answer the client with. Deliberately not 403 for every case - see
   *  the note on rate limiting below. */
  status: number;
  /** Short machine-readable tag for the server log. */
  reason: string;
};
export type GuardResult = { ok: true } | GuardFailure;

/** The hidden field name. Chosen to look like something a form would plausibly
 *  have, because a bot that fills "honeypot" is not the bot worth catching. */
export const HONEYPOT_FIELD = "companyWebsite";

/** The field carrying when the form was rendered, as epoch milliseconds. */
export const RENDERED_AT_FIELD = "renderedAt";

/** Nobody reads a form, decides to enquire and types their details in under
 *  this. Bots routinely submit in double figures of milliseconds. */
const MIN_FILL_MS = 2_500;

/** A form left open for a day and then submitted is far more likely to be a
 *  replayed capture than a very slow typist. Generous on purpose. */
const MAX_FORM_AGE_MS = 72 * 60 * 60 * 1000; // 72h: an overnight-open contact tab is normal, not spam (launch review)

/** Requests per IP per window, across all form endpoints combined. A real
 *  person submits one enquiry, occasionally two if the first seemed not to
 *  send. Six is far beyond that and still well short of catching an office
 *  behind one NAT address in a normal day. */
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/**
 * In-memory sliding window, and an honest note about what that means here.
 *
 * On serverless this map lives in one instance and dies with it, so a flood
 * spread across many cold starts is throttled less than the numbers suggest,
 * and the counter resets on deploy. It is still worth having: real floods come
 * fast from one source and land on a warm instance, which is exactly the case
 * this catches.
 *
 * If it needs to be airtight, the shape below is the same one a shared store
 * (Vercel KV, Upstash, Redis) takes - swap the Map for the client and keep the
 * call sites unchanged.
 */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  const recent = (hits.get(ip) ?? []).filter((t) => t > cutoff);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic sweep so the map cannot grow without bound on a long-lived
  // instance. Cheap because it only runs when the map is already large.
  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => t > cutoff)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT;
}

/** Best available caller address behind Vercel's proxy. */
function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  // First entry is the original client; the rest are proxies.
  return (fwd?.split(",")[0] ?? "").trim() || req.headers.get("x-real-ip") || "unknown";
}

/**
 * Is this POST coming from one of our own pages?
 *
 * Browsers attach `Origin` to every POST, same-origin included, so a missing
 * Origin AND missing Referer means the request did not come from a page at all.
 * That is the signature of a script pointed straight at /api/contact, which is
 * the cheapest and most common way these endpoints get abused.
 *
 * The comparison is against the request's own Host rather than a hardcoded
 * list, so preview deployments, localhost and every domain in the estate work
 * without configuration - and no future domain gets locked out because someone
 * forgot to add it here.
 *
 * BEHIND AN EXTERNAL REWRITE, COMPARING AGAINST HOST LOCKS THE SITE OUT.
 *
 * link.com.au/coworking is an EXTERNAL rewrite in linkhq's next.config.mjs to
 * https://linkcowork-site.vercel.app/coworking/*. Vercel's proxy makes a FRESH
 * request to that deployment, so the coworking app's own Host is
 * linkcowork-site.vercel.app - while the visitor's browser, correctly, sends
 * Origin: https://link.com.au. Host never equals Origin, so every genuine tour
 * enquiry was refused 403 "We could not accept that submission."
 *
 * Verified against production, 1 Oct 2026, empty body so nothing could be
 * created: Origin link.com.au -> 403; Origin linkcowork-site.vercel.app -> 400,
 * which is the route's own missing-email check and is only reachable if the
 * guard passed. The same probe against /culture/api/lead -> 400, so the proxy
 * is fine; it was this comparison.
 *
 * `alsoAllow` is for exactly that case: an app served under another domain
 * passes the public origin it is really reached on. It is a CONSTANT in that
 * app's own source (lib/site.ts ORIGIN), reviewable in a diff - deliberately
 * not an environment variable and not a proxy header, because a proxy header is
 * attacker-supplied and an env var cannot be reviewed. An app that passes
 * nothing is unchanged: the default is an empty list, so nothing is loosened
 * anywhere it is not explicitly asked for.
 */
function sameOrigin(req: Request, alsoAllow: string[] = []): boolean {
  const host = req.headers.get("host");
  if (!host) return true; // Cannot judge; abstain rather than guess.

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  if (!origin && !referer) return false;

  // The request's own Host, plus any public origin this app declares it is
  // legitimately served on. See the note above `alsoAllow`.
  const allowed = new Set([host]);
  for (const extra of alsoAllow) {
    try {
      allowed.add(new URL(extra).host);
    } catch {
      // A malformed constant must never silently widen what is accepted.
    }
  }

  for (const value of [origin, referer]) {
    if (!value) continue;
    try {
      if (allowed.has(new URL(value).host)) return true;
    } catch {
      // Malformed header. Not evidence of good faith.
    }
  }
  return false;
}

/** A real address, not merely a non-empty string. */
export const isEmail = (v: unknown): v is string =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()) && v.length <= 254;

/**
 * Fields the SITE fills in, never the visitor. Excluded from the scan below.
 *
 * THIS LIST EXISTS BECAUSE ITS ABSENCE REFUSED REAL LEADS. The scan used to
 * join every string in the body, and a form body carries our own attribution
 * alongside what the person typed. A visitor arriving from a Google search
 * sent `referrer: "https://www.google.com/"` - which is TWO matches, the
 * scheme and the `www.` - plus an absolute `page_url`, for three. Three is the
 * threshold. So an ordinary person, arriving the ordinary way, filling in
 * nothing but their name and number, was refused as a link spammer and shown
 * the failure state, while the site logged `link-spam` and moved on.
 *
 * It refused selectively, which is why it went unnoticed: a referrer without
 * `www.` (l.facebook.com, duckduckgo.com) scores one and passes, so paid
 * social traffic converted and organic search did not.
 *
 * ANYTHING ADDED TO THE SUBMIT BODY THAT THE VISITOR DOES NOT TYPE BELONGS
 * HERE. The default is to scan, so a new question on a form is covered
 * automatically; a new machine-set field is not, and forgetting one puts the
 * bug straight back. These names match lib/attribution.ts's SubmitAttribution
 * where the site has one.
 */
const NOT_TYPED_BY_VISITOR = new Set([
  "landing",
  "referrer",
  "path",
  "page_url",
  "session_id",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
]);

/** Free-text spam signal: link stuffing.
 *
 *  Two links in a message is unusual but happens - someone pasting their site
 *  and their LinkedIn. Three or more in an enquiry to an accounting firm is
 *  effectively always an advert, and BBCode markup is never a human on a
 *  React form.
 *
 *  Counted across what the VISITOR wrote, not across the whole body - see
 *  NOT_TYPED_BY_VISITOR. Still counted across their fields together rather
 *  than per field, because a name, a message and a phone box with one link
 *  each is the same advert split three ways. */
function looksLikeLinkSpam(data: Record<string, unknown>): boolean {
  const text = Object.entries(data)
    .filter(([k, v]) => typeof v === "string" && !NOT_TYPED_BY_VISITOR.has(k))
    .map(([, v]) => v as string)
    .join(" ");
  const urls = text.match(/https?:\/\/|www\./gi)?.length ?? 0;
  const bbcode = /\[url[=\]]|\[link[=\]]/i.test(text);
  return urls >= 3 || bbcode;
}

/**
 * Run every check against one form POST.
 *
 * Call it first in the route, before any delivery, subscription or logging that
 * costs money or reaches a human.
 */
export function guardFormPost(
  req: Request,
  body: unknown,
  /** Public origins this app is legitimately reached on - see sameOrigin. */
  opts: { alsoAllow?: string[] } = {}
): GuardResult {
  const data = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  // 1. Did this come from one of our pages at all?
  if (!sameOrigin(req, opts.alsoAllow ?? [])) {
    return { ok: false, status: 403, reason: "off-origin" };
  }

  // 2. The hidden field, if the form sent one. Only a filled honeypot is
  //    evidence - an absent one means the form has not been updated yet.
  const trap = data[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim() !== "") {
    return { ok: false, status: 400, reason: "honeypot" };
  }

  // 3. Fill time, if the form sent it.
  const rendered = Number(data[RENDERED_AT_FIELD]);
  if (Number.isFinite(rendered) && rendered > 0) {
    const age = Date.now() - rendered;
    if (age < MIN_FILL_MS) return { ok: false, status: 400, reason: "too-fast" };
    if (age > MAX_FORM_AGE_MS) return { ok: false, status: 400, reason: "stale-form" };
  }

  // 4. Link stuffing in the free text.
  if (looksLikeLinkSpam(data)) {
    return { ok: false, status: 400, reason: "link-spam" };
  }

  // 5. Flood control, last because it has a side effect: every call counts, and
  //    a request already refused above should not consume someone's budget.
  //
  //    429 rather than 403 on purpose. This is the one failure a real person
  //    can hit - by double-submitting a form that seemed not to send - and it
  //    is temporary, so it deserves the status that says "try again later"
  //    rather than the one that says "you are not allowed".
  if (rateLimited(clientIp(req))) {
    return { ok: false, status: 429, reason: "rate-limit" };
  }

  return { ok: true };
}

/**
 * The origin check on its own, for endpoints a person hits more than once.
 *
 * WHY THIS EXISTS SEPARATELY. guardFormPost's rate limit assumes one submission
 * per visitor, which is right for a contact form and wrong for three kinds of
 * endpoint that also need protecting:
 *
 *   - a multi-step funnel that POSTs after every answered question, where a
 *     complete run is a dozen requests from one honest person;
 *   - a free tool somebody may legitimately run two or three times;
 *   - a browsing signal that fires on reaching a page rather than on a submit.
 *
 * Putting the full guard on those does not harden them, it breaks them - and a
 * check that fires on real people gets removed, which leaves nothing. So this
 * is the half that always applies: it still refuses a script pointed straight
 * at the endpoint with no Origin and no Referer, which is the cheapest and
 * commonest abuse, and it costs an honest visitor nothing however many times
 * they use the thing.
 *
 * Anything that is a single submit from a person should use guardFormPost.
 */
export function guardOrigin(req: Request): GuardResult {
  if (!sameOrigin(req)) return { ok: false, status: 403, reason: "off-origin" };
  return { ok: true };
}

/**
 * The standard refusal.
 *
 * Deliberately vague to the client and specific in the log. A bot told
 * "honeypot" learns which field to leave alone next time; a developer reading
 * the log needs to know which check fired and whether it is catching real
 * people.
 */
export function guardResponse(fail: GuardFailure, route: string): Response {
  console.warn(`[form-guard] ${route} refused: ${fail.reason}`);
  return Response.json(
    {
      ok: false,
      error:
        fail.status === 429
          ? "Too many submissions - please wait a few minutes and try again."
          : "We could not accept that submission.",
    },
    { status: fail.status },
  );
}

/**
 * The same flood control, tuned for a password box.
 *
 * WHY IT IS SEPARATE. A password endpoint is not a form: there is no honeypot
 * to hide in a single input, no fill-time worth measuring, and the failure mode
 * is guessing rather than advertising. What it shares is the need to stop
 * repetition from one source - and it needs a tighter limit than a contact
 * form, because ten attempts at a short password is a very different thing from
 * ten enquiries.
 *
 * app/api/kit-unlock already carried this comment:
 *
 *   "A short pause on failure. The password is short enough that an
 *    unthrottled endpoint is a real invitation to guess at it."
 *
 * - and then answered it with a 600ms sleep, which costs an attacker running
 * requests in parallel almost nothing. This is the throttle that note was
 * asking for. The sleep stays: it is still the right answer for a single
 * sequential guesser, and the two compose.
 *
 * A separate bucket so a burst of enquiries cannot lock someone out of the kit,
 * and a wrong password cannot burn their enquiry budget.
 */
const authHits = new Map<string, number[]>();
const AUTH_LIMIT = 8;
const AUTH_WINDOW_MS = 15 * 60 * 1000;

export function guardAuthPost(req: Request): GuardResult {
  if (!sameOrigin(req)) return { ok: false, status: 403, reason: "off-origin" };

  const ip = clientIp(req);
  const now = Date.now();
  const cutoff = now - AUTH_WINDOW_MS;
  const recent = (authHits.get(ip) ?? []).filter((t) => t > cutoff);
  recent.push(now);
  authHits.set(ip, recent);

  if (authHits.size > 5_000) {
    for (const [key, times] of authHits) {
      if (!times.some((t) => t > cutoff)) authHits.delete(key);
    }
  }
  if (recent.length > AUTH_LIMIT) return { ok: false, status: 429, reason: "auth-rate-limit" };
  return { ok: true };
}
