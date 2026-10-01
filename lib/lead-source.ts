// WHERE A LEAD CAME FROM, taken from the request rather than from configuration.
//
// Dimitri E enquired on 1 Oct 2026 and the email in #leads could not say which
// site he had been on. Every LINK site posts leads into the same Slack channel
// through the same leads@link.com.au address, and the ONLY thing distinguishing
// them was the sender's display name - which is a RESEND_FROM environment
// variable, set by hand, per project, and identical in shape across eleven
// repos. If one is unset the lead arrives as whatever that repo's default
// happens to be; if one is copy-pasted between projects it arrives wearing the
// wrong site's name and nothing looks wrong. Neither case is detectable from
// the email.
//
// So the source is no longer declared - it is OBSERVED, from the inbound
// request, at the moment the lead is sent:
//
//   site  the Host header Vercel routed on. Cannot disagree with reality: if
//         the email says marketing.link.com.au, the visitor was on
//         marketing.link.com.au.
//   page  the path they submitted from, including query, so UTM tags survive.
//         Taken from Referer, and ONLY when it is the same host - an off-site
//         or absent Referer tells us nothing and is recorded as nothing rather
//         than guessed at.
//   form  the API route, passed by the caller. The one part that cannot be
//         observed, which is why the mail helpers take it as a REQUIRED
//         argument: a new lead route that forgets it does not compile.
//
// Not every lead begins in a browser. A Stripe webhook has no Referer and no
// visitor, and says so plainly rather than inventing a page.

export type LeadSource = { site: string; page: string; form: string; label?: string };

// A hostname, and nothing but. This value reaches an email subject line, and
// hostile input must never be able to put a newline or a comma in there.
const HOST_OK = /^[a-z0-9.-]+$/;

function hostOf(req: Request): string {
  const h = req.headers;
  // x-forwarded-host is what Vercel sets for the public hostname; host is the
  // internal one. Prefer the public. Both can be comma-joined by a proxy chain.
  const raw = (h.get("x-forwarded-host") ?? h.get("host") ?? "")
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
  if (raw && HOST_OK.test(raw)) return raw;
  try {
    return new URL(req.url).hostname.toLowerCase();
  } catch {
    return "unknown-host";
  }
}

// The subject tag: short enough to live in front of a subject line without
// pushing the name out of view in a Slack notification. "marketing" beats
// "marketing.link.com.au" when the full host is one row further down anyway.
function labelOf(site: string): string {
  const parts = site.replace(/^www\./, "").split(".");
  const first = parts[0] ?? site;
  // An apex like link.com.au labels as "link"; a subdomain labels as itself.
  return first || site;
}

function pageOf(req: Request, site: string): string {
  const ref = req.headers.get("referer");
  if (!ref) return "";
  try {
    const u = new URL(ref);
    // A Referer pointing somewhere else is not evidence of where this person
    // was on OUR site, so it is discarded rather than reported.
    if (u.hostname.toLowerCase() !== site) return "";
    const path = `${u.pathname}${u.search}`;
    return path.length > 300 ? `${path.slice(0, 300)}...` : path;
  } catch {
    return "";
  }
}

/**
 * `publicBase` is for an app served under SOMEONE ELSE'S domain, and only then.
 *
 * LINK Coworking and LINK Culture are separate Next apps reached at
 * link.com.au/coworking and link.com.au/culture through EXTERNAL rewrites in
 * linkhq's next.config.mjs. Vercel's proxy makes a fresh request to the
 * destination deployment, so those apps observe their own internal host
 * (linkcowork-site.vercel.app) and a Referer on link.com.au that does not match
 * it. Observed, they would report the wrong Site and no Page at all.
 *
 * So these two - and only these two - pass the public base they are really
 * reached on, from the ORIGIN/BASE_PATH constants already in their own
 * lib/site.ts. That IS a declared value rather than an observed one, which is
 * the thing this module otherwise exists to avoid; the honest trade is that for
 * a proxied app there is nothing truthful to observe, and a constant in the
 * app's own source is reviewable in a way a proxy header is not. Every other
 * site passes nothing and keeps the observed host.
 */
export function leadSource(req: Request, form: string, publicBase?: string): LeadSource {
  if (publicBase) {
    try {
      const u = new URL(publicBase);
      const site = u.hostname.toLowerCase();
      const seg = u.pathname.split("/").filter(Boolean)[0] ?? "";
      return { site, page: pageOf(req, site), form, label: seg || undefined };
    } catch {
      // A malformed constant falls through to the observed host rather than
      // throwing on a live lead.
    }
  }
  const site = hostOf(req);
  return { site, page: pageOf(req, site), form };
}

/** Provenance rows, appended to every lead email. */
export function sourceRows(src: LeadSource): [string, string][] {
  return [
    ["Site", src.site],
    ["Page", src.page || "not supplied (no same-site referer)"],
    ["Form", src.form],
  ];
}

/** "[marketing] Website lead - Dimitri E" */
export function tagSubject(src: LeadSource, subject: string): string {
  // A proxied app labels by its own section - [coworking], not [link] - because
  // the host it shares with the hub would make its leads indistinguishable from
  // every linkhq lead, which is the fault this whole module exists to fix.
  return `[${src.label ?? labelOf(src.site)}] ${subject}`;
}
