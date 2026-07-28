# rescue.link.com.au

Lead engine for business rescue enquiries. Standalone Next.js app, deliberately
outside the regular LINK.com.au family tree: LINK V1.5 monochrome base with a
single burgundy accent (#7B1E3A / light #F3DEE4 / dark #3D0F1E).

The hero feature is the six-question rescue assessment (`lib/assessment.ts`),
run cart-style (the gstregister funnel pattern):

1. Business (ABR lookup) + email first - the cart row is created here, so an
   abandoned assessment is still a followable lead
2. Six questions, each answer upserting the cart in the background
3. Instant Green / Amber / Red / DPN Urgent result on screen, then name +
   phone to finalise; Slack/email notifications fire on completion only

A confirmed Director Penalty Notice bypasses scoring and produces the
highest-priority outcome. The API recomputes the score server-side from the
raw answers; the client's copy is display-only. Abandoned carts are queryable
via the `rescue_abandoned_carts` view in Supabase.

Free tools: `/ato-payment-plan-calculator` (GIC maths - the rate constant in
`components/GicCalculator.tsx` needs a quarterly update from ato.gov.au),
`/am-i-insolvent` (12-indicator check), and the DPN deadline checker embedded
on `/director-penalty-notice`.

## Deploy (Vercel)

Project `linkrescue-site` on the LINK HQ team deploys from `main` via the Git
integration. Attach the `rescue.link.com.au` domain when ready.

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
| `ABR_GUID` | ABN Lookup web-services GUID (register at abr.business.gov.au). Without it the business field degrades to plain text. |

## Before launch (humans)

- James: confirm dedicated rescue phone line + inbox (lib/site.ts TODOs),
  entity ABN, and the assessment weightings/bands in `lib/assessment.ts`
  (flagged DRAFT).
- James / Kyle / Dave: confirm roles + bios, supply headshots
  (`public/team/*.jpg`, referenced from `lib/site.ts`).
- Legal/compliance pass over outcome copy, DPN/GIC/insolvency tool copy and
  disclaimers; confirm the GIC rate constant is current.
- Point `rescue.link.com.au` DNS at the Vercel project.

## Gotchas (inherited from the LINK builds)

- Never `next build` while the dev server runs (corrupts `.next`).
- Copy rules: no em dashes, never "honest/honestly", no "very/really",
  lead with "you".
