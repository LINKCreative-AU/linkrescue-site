# rescue.link.com.au

Lead engine for business rescue enquiries. Standalone Next.js app, deliberately
outside the regular LINK.com.au family tree: LINK V1.5 monochrome base with a
single burgundy accent (#7B1E3A / light #F3DEE4 / dark #3D0F1E).

The hero feature is the six-question rescue assessment (`lib/assessment.ts`):
instant Green / Amber / Red / DPN Urgent result BEFORE contact details are
requested, then lead capture with the result, answers and attribution attached.
A confirmed Director Penalty Notice bypasses scoring and produces the
highest-priority outcome. The API recomputes the score server-side from the
raw answers; the client's copy is display-only.

## Deploy (Vercel)

Create a new Vercel project pointed at this repo with **Root Directory set to
`rescue-site`**, then attach the `rescue.link.com.au` domain. No other build
settings needed.

## Environment variables

All optional. Every lead delivery channel degrades gracefully; if none are
configured, leads are logged to the function console so nothing is silently
dropped. Configure at least one before going live.

| Var | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL. Run `supabase/migrations/001_rescue_leads.sql` first. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only, never exposed to the client). |
| `SLACK_LEADS_WEBHOOK` | Incoming-webhook URL for the leads channel. Red/DPN leads post with urgent markers. |
| `RESEND_API_KEY` | Resend key for lead emails. |
| `LEADS_TO` | Comma-separated recipients (default rescue@link.com.au - TODO confirm). |
| `RESEND_FROM` | Verified sender (defaults to resend.dev sender until the domain is verified). |

## Before launch (humans)

- James: confirm dedicated rescue phone line + inbox (lib/site.ts TODOs),
  entity ABN, and the assessment weightings/bands in `lib/assessment.ts`
  (flagged DRAFT).
- James / Kyle / Dave: confirm roles + bios, supply headshots
  (`public/team/*.jpg`, referenced from `lib/site.ts`).
- Legal/compliance pass over outcome copy, DPN page and disclaimers.
- Point `rescue.link.com.au` DNS at the Vercel project.

## Gotchas (inherited from the LINK builds)

- Never `next build` while the dev server runs (corrupts `.next`).
- Copy rules: no em dashes, never "honest/honestly", no "very/really",
  lead with "you".
