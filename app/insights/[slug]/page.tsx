import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { DISCLAIMER, SITE } from "@/lib/site";
import { rankArticles, rankDescription } from "@/lib/rank";
import { markdownToHtml } from "@/lib/markdown";
import { formatInsightDate } from "@/lib/insights";

// One article published from rank, in the info-page layout. Re-checked hourly,
// so approving an article in rank publishes it here without a deploy and
// unpublishing it turns this URL back into a 404. See docs/rank.md.

// A literal: Next reads segment config statically.
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await rankArticles()).map((a) => ({ slug: a.slug }));
}

type Params = { params: Promise<{ slug: string }> };

async function find(slug: string) {
  return (await rankArticles()).find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await find(slug);
  if (!article) return {};
  const path = `/insights/${article.slug}`;
  const description = rankDescription(article);
  return {
    title: article.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: article.title,
      description,
      url: path,
      type: "article",
      publishedTime: article.published_at,
      // Declaring openGraph replaces the root layout's, so the site card is
      // passed again or the article shares as a bare link.
      images: [{ url: "/opengraph-image" }],
      siteName: SITE.name,
      locale: "en_AU",
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const article = await find(slug);
  if (!article) notFound();
  const path = `/insights/${article.slug}`;
  const others = (await rankArticles()).filter((a) => a.slug !== article.slug).slice(0, 5);
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: article.title, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: rankDescription(article),
            url: `${SITE.url}${path}`,
            mainEntityOfPage: `${SITE.url}${path}`,
            datePublished: article.published_at,
            dateModified: article.published_at,
            inLanguage: "en-AU",
            author: { "@type": "Organization", name: SITE.name, "@id": `${SITE.url}/#firm` },
            publisher: { "@id": `${SITE.url}/#firm` },
          },
        ]}
      />

      <div className="border-b border-line bg-cloud/50">
        <div className="container-x py-12 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ink/50">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/insights" className="hover:text-ink">
              Insights
            </Link>{" "}
            / <span className="text-ink/75">{article.title}</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-normal leading-[1.02] tracking-tight text-ink sm:text-5xl">
              {article.title}
            </h1>
            {article.summary && <p className="mt-5 text-lg text-ink/65">{article.summary}</p>}
            <p className="mt-5 text-sm text-ink/50">
              <time dateTime={article.published_at}>{formatInsightDate(article.published_at)}</time>
            </p>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_320px] lg:py-20">
        <article className="max-w-3xl">
          {/* markdownToHtml escapes the whole source before it writes a tag,
              so this is the renderer's own markup and nothing from the feed. */}
          <div
            className="prose-insight"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(article.body_md, SITE.url) }}
          />
          <p className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-ink/45">
            {DISCLAIMER}
          </p>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl2 border border-line bg-cloud/60 p-6">
            <p className="guide-line text-sm font-semibold uppercase tracking-wider text-rescue">
              Where do you stand
            </p>
            <p className="mt-3 text-sm text-ink/75">
              Six questions, two minutes, instant result. You see how urgent
              your situation looks and the sensible next move.
            </p>
            <Link href="/assessment" className="btn btn-rescue mt-4 w-full">
              Start the assessment
            </Link>
            <a href={SITE.phoneHref} className="btn btn-ghost mt-2 w-full">
              Call {SITE.phone}
            </a>
          </div>
          {others.length > 0 && (
            <div className="rounded-xl2 border border-line p-6">
              <p className="eyebrow">More insights</p>
              <ul className="mt-6 space-y-2.5">
                {others.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/insights/${a.slug}`}
                      className="text-sm font-medium text-ink/75 transition hover:text-rescue"
                    >
                      {a.title} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
