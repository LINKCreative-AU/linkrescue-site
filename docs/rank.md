# rank

This site is connected to rank (rank.link.com.au) in two ways. Both are switched
on by one environment variable and both are off, with no other effect on the
site, until it is set.

## Environment variables

Set on the Vercel project. Never commit a value and never expose one to the
browser (no `NEXT_PUBLIC_` prefix): they are read only by server code in
`lib/rank.ts`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `RANK_SITE_TOKEN` | Yes, to switch either half on | This site's token from its client record in rank. |
| `RANK_INGEST_URL` | No | Lead endpoint. Defaults to `https://rank.link.com.au/api/leads/ingest`. |
| `RANK_FEED_URL` | No | Article feed. Defaults to `/api/feed/articles` on the same origin as the ingest URL. |
| `RANK_LEAD_DETAIL` | No | Leave unset. `full` also sends the detail of a person's situation; read "What is not sent" first. |

## 1. Enquiries are recorded in rank

Both forms record the enquiry in rank as well as the existing Supabase row,
Slack post and emails, none of which change. Those are still what the team acts
on; rank is a second record.

| `form_id` | Form | Route |
| --- | --- | --- |
| `contact` | Call-back form on `/contact` (`components/ContactForm.tsx`) | `app/api/contact/route.ts` |
| `assessment` | The rescue assessment on `/assessment` and the home page (`components/Assessment.tsx`), **completed stage only** | `app/api/lead/route.ts` |

- Sent server-side with `Authorization: Bearer <RANK_SITE_TOKEN>`, after the
  response has gone to the visitor (`after()`), with a 3 second timeout.
- Only after the form guard and the honeypot have passed.
- A failure is logged and swallowed. It can never fail or slow an enquiry.
- With no token nothing is sent, and one `console.warn` per server instance
  says so.
- A completed assessment carries its cart id as the `Idempotency-Key`, so a
  double submit is one lead.

### What is sent

- Contact: name, phone, email, business name, and as `fields` the urgency and
  the "how did you hear about us" answer.
- Assessment: name, phone, email, business name, and as `fields` the result
  band (for example "Amber") and its priority.
- Both: the page the form was on and the attribution the forms already capture
  (referrer, landing URL, UTM tags, gclid).

### What is not sent, and why

The site tells visitors that "nothing you enter is shared outside the LINK
Rescue team" (home page FAQ) and that "what you tell us stays with the LINK
Rescue team" (contact page). rank is a LINK platform, but its leads panel can
be read by whoever is a member of this site's client record there, which is not
necessarily the Rescue team. So by default the detail of a person's situation
stays out of rank:

- the free-text message on the contact form;
- the six assessment answers, the score and the DPN / legal-action flags;
- the ABN, entity type and location from the ABN lookup;
- assessments that were started but not completed (`started` and `progress`
  stages);
- the spam-guard fields, the visitor's IP address and user agent.

The site has no document upload, so no financial documents exist to send.

`RANK_LEAD_DETAIL=full` adds the message, the answers, the score, the flags, the
ABN and the entity type. Only set it once access to this site's leads in rank is
limited to the people the confidentiality wording covers, or the wording has
been changed to match.

## 2. Articles approved in rank are published here

`lib/rank.ts` reads `GET <feed>?token=<RANK_SITE_TOKEN>`. Each published article
renders at `/insights/<slug>`, with an index at `/insights`, a footer link and
entries in `sitemap.xml`.

- Pages are re-checked hourly (ISR), so approving an article in rank publishes
  it without a deploy, and unpublishing it removes it.
- The body is Markdown, rendered by `lib/markdown.ts`. All source text is
  escaped first, so HTML in an article cannot become markup, and links are
  limited to same-site paths and `https://`.
- With no token, no published articles, or the feed down: `/insights` and every
  `/insights/<slug>` are 404s, nothing is added to the sitemap and the footer
  link is absent. The build does not depend on the feed.
- The footer checks the feed (cached for an hour), so every page is now
  revalidated hourly instead of being fixed at build time.
- The feed's `pages` list is not used.
