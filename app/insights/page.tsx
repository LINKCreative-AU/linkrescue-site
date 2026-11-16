import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHead } from "@/components/SectionHead";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { SITE } from "@/lib/site";
import { rankArticles } from "@/lib/rank";
import { formatInsightDate } from "@/lib/insights";

// The index of articles published from rank. It only exists while there is at
// least one: with no RANK_SITE_TOKEN, or nothing published, this is a 404, is
// not in the sitemap and is not linked from the footer - an empty index is a
// thin page, and this is not a site that can afford one. See docs/rank.md.

// A literal: Next reads segment config statically.
export const revalidate = 3600;

const PATH = "/insights";
const DESCRIPTION =
  "Plain-English articles on ATO debt, director penalties, restructuring and what to do when a business is under pressure, from the LINK Rescue team.";

export const metadata: Metadata = {
  title: "Insights for Business Owners Under Pressure",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
};

export default async function Page() {
  const articles = await rankArticles();
  if (articles.length === 0) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Insights", path: PATH },
  ];
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "LINK Rescue Insights",
            description: DESCRIPTION,
            url: `${SITE.url}${PATH}`,
            publisher: { "@id": `${SITE.url}/#firm` },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: articles.length,
              itemListElement: articles.map((a, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: a.title,
                url: `${SITE.url}${PATH}/${a.slug}`,
              })),
            },
          },
        ]}
      />

      <div className="border-b border-line bg-cloud/50">
        <div className="container-x py-12 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ink/50">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>{" "}
            / <span className="text-ink/75">Insights</span>
          </nav>
          <SectionHead
            as="h1"
            eyebrow="Insights"
            title="Straight answers, before it gets worse."
            mark="before it gets worse."
            intro="What the notices mean, what the options are and what each one costs, written for directors rather than for lawyers."
            accent
          />
        </div>
      </div>

      <div className="container-x py-14 lg:py-20">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link
                href={`${PATH}/${a.slug}`}
                className="group flex h-full flex-col rounded-xl2 border border-line p-6 transition hover:border-ink/30"
              >
                <p className="text-xs text-ink/50">{formatInsightDate(a.published_at)}</p>
                <h2 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink">
                  {a.title}
                </h2>
                {a.summary && (
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink/75">{a.summary}</p>
                )}
                <span className="mt-auto pt-5 text-sm font-medium text-ink/75 transition group-hover:text-rescue">
                  Read the article →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
