// GET /api/worklog - this site's work log, for rank. only.
//
// rank. calls it nightly with this site's token (RANK_SITE_TOKEN, the same one
// lib/rank-lead.ts uses to send enquiries) and files each new entry in the
// site's work log. The list itself is lib/worklog.ts.
//
// Token-gated rather than public: it is a record of what we did to the site and
// when, not something for a competitor to read. A missing or wrong token gets a
// bare 404, so the route does not advertise itself.

import { WORKLOG } from "@/lib/worklog";

export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const token = process.env.RANK_SITE_TOKEN;
  const auth = req.headers.get("authorization") ?? "";
  if (!token || auth !== `Bearer ${token}`) {
    return new Response("Not found", { status: 404 });
  }
  return Response.json({ entries: WORKLOG }, { headers: { "Cache-Control": "no-store" } });
}
