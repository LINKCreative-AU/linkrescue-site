import { SITE } from "@/lib/site";

// JSON-LD structured data for the rescue site: FinancialService (a
// LocalBusiness subtype) as the sitewide entity, plus FAQPage and Service
// per page and BreadcrumbList on inner pages.

export function firmSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${SITE.url}/#firm`,
    name: "LINK Rescue",
    url: SITE.url,
    telephone: "+61 7 3899 8311", // TODO update when the dedicated rescue line is confirmed
    logo: `${SITE.url}/link-logo.png`,
    description:
      "Confidential business rescue guidance for Australian company directors: ATO debt, Director Penalty Notices, creditor pressure, restructuring and alternatives to liquidation.",
    areaServed: { "@type": "Country", name: "Australia" },
    parentOrganization: {
      // By @id as well as by name. The hub publishes this exact node at
      // link.com.au/#organization.
      //
      // Be honest about what this buys: Google does not dereference an @id
      // across documents - JSON-LD is parsed per document, and Google's
      // documented cross-site entity mechanisms are `url` and `sameAs`, not
      // @id or parentOrganization. So this is a correctness and consistency
      // measure, not a ranking one. It costs nothing (name and url are kept,
      // so a parser that ignores the IRI sees exactly what it saw before) and
      // it is right in linked-data terms. The signal that actually ties this
      // estate together is the group listing in the hub's sameAs.
      //
      // Keep the string identical across the estate.
      "@id": "https://link.com.au/#organization",
      "@type": "Organization",
      name: "LINK",
      url: SITE.group.url,
    },
    knowsAbout: [
      "Business rescue",
      "ATO debt negotiation",
      "Director Penalty Notices",
      "Small business restructuring",
      "Safe harbour",
      "Insolvency options",
      "Turnaround advisory",
    ],
  };
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE.url}${c.path}`,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url: `${SITE.url}${path}`,
    provider: { "@id": `${SITE.url}/#firm` },
    areaServed: { "@type": "Country", name: "Australia" },
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
