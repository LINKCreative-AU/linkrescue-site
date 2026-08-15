// Push a copy of every enquiry into the Engine Room (engine.link.com.au).
//
// Additive, never authoritative. The site's own lead email is still the
// record of the enquiry and still decides whether the visitor is told it
// sent - that contract is unchanged. This is a second copy, so the group has
// one desk showing every lead from every site with its attribution intact.
//
// Two rules follow from "additive", and both are load-bearing:
//
//   1. It runs in after(), so the push happens once the response is already
//      on its way. A slow or dead Engine Room cannot delay a form submit.
//      Without after() a fire-and-forget promise would just be killed when
//      the serverless function froze, which silently loses the copy.
//   2. It cannot throw. A failure here must never turn a delivered lead into
//      an error the visitor sees - they would submit again, or give up.
//
// No LINKLEADS_INGEST_KEY set -> no-op. That is the intended deploy order:
// ship the wiring now, set the key when this site's key is minted into the
// Engine Room's LEADS_INGEST_KEYS. Until then this costs nothing and the
// existing email path is untouched.

import { after } from "next/server";

const ENDPOINT =
  process.env.LINKLEADS_INGEST_URL ?? "https://engine.link.com.au/api/ingest";

type Src = Record<string, unknown>;

const str = (v: unknown) => {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s === "" || s === "-" ? undefined : s;
};

export function pushLead(input: {
  /** Which form on this site - matches the routing rules' `form` column. */
  form: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  /** Anything else worth keeping; stored verbatim as jsonb. */
  details?: Record<string, unknown>;
  /** The raw request body. Attribution fields are lifted off it. */
  src?: Src;
}): void {
  const key = process.env.LINKLEADS_INGEST_KEY;
  if (!key) return;

  const s: Src = input.src ?? {};
  // Landing page is the one worth crediting (see lib/attribution.ts), so it
  // travels with the lead rather than being recomputed from page_url later.
  const landing = str(s.landing);
  const body = {
    form: input.form,
    name: str(input.name),
    email: str(input.email),
    phone: str(input.phone),
    message: str(input.message),
    details: { ...(input.details ?? {}), ...(landing ? { landing } : {}) },
    page_url: str(s.page_url),
    referrer: str(s.referrer),
    utm_source: str(s.utm_source),
    utm_medium: str(s.utm_medium),
    utm_campaign: str(s.utm_campaign),
    utm_term: str(s.utm_term),
    utm_content: str(s.utm_content),
    session_id: str(s.session_id),
  };

  // Ingest needs at least one of name/email/phone or it 400s. Nothing to send
  // is not an error worth logging on every spam submission.
  if (!body.name && !body.email && !body.phone) return;

  after(async () => {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(body),
        // A hung Engine Room should not hold the function open to its limit.
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) {
        console.error(
          "[linkleads] ingest rejected",
          res.status,
          await res.text().catch(() => "")
        );
      }
    } catch (e) {
      // Logged, not thrown: the lead is already delivered by email.
      console.error("[linkleads] ingest failed:", (e as Error).message);
    }
  });
}
