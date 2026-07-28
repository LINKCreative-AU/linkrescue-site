import { NextResponse } from "next/server";

// ABN Lookup proxy. Keeps the ABR web-services GUID server-side and strips
// the JSONP wrapper the ABR endpoints return. Without ABR_GUID configured the
// client degrades to a plain business-name field, so nothing breaks pre-setup.
//
// Env: ABR_GUID - register at abr.business.gov.au (web services) for a GUID.

const ABR_BASE = "https://abr.business.gov.au/json";

function stripJsonp(text: string) {
  const start = text.indexOf("(");
  const end = text.lastIndexOf(")");
  if (start === -1 || end === -1) throw new Error("unexpected ABR response");
  return JSON.parse(text.slice(start + 1, end));
}

export async function GET(req: Request) {
  const guid = process.env.ABR_GUID;
  if (!guid) return NextResponse.json({ configured: false, results: [] });

  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) return NextResponse.json({ configured: true, results: [] });

  const digits = q.replace(/\s/g, "");
  try {
    if (/^\d{11}$/.test(digits)) {
      const res = await fetch(
        `${ABR_BASE}/AbnDetails.aspx?abn=${digits}&guid=${guid}&callback=cb`,
        { next: { revalidate: 3600 } }
      );
      const d = stripJsonp(await res.text());
      if (!d.Abn) return NextResponse.json({ configured: true, results: [] });
      return NextResponse.json({
        configured: true,
        results: [
          {
            abn: d.Abn,
            name: d.EntityName || d.BusinessName?.[0] || "",
            type: d.EntityTypeName || "",
            location: [d.AddressState, d.AddressPostcode].filter(Boolean).join(" "),
          },
        ],
      });
    }

    const res = await fetch(
      `${ABR_BASE}/MatchingNames.aspx?name=${encodeURIComponent(q)}&maxSearchResults=6&guid=${guid}&callback=cb`,
      { next: { revalidate: 3600 } }
    );
    const d = stripJsonp(await res.text());
    const results = (d.Names ?? []).map(
      (n: { Abn: string; Name: string; NameType?: string; State?: string; Postcode?: string }) => ({
        abn: n.Abn,
        name: n.Name,
        type: n.NameType || "",
        location: [n.State, n.Postcode].filter(Boolean).join(" "),
      })
    );
    return NextResponse.json({ configured: true, results });
  } catch (e) {
    console.error("[abr lookup failed]", e);
    return NextResponse.json({ configured: true, results: [] });
  }
}
