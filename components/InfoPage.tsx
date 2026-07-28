// Shared layout for the SEO info pages: breadcrumbs, H1, editorial body
// sections, FAQ block with schema, and the assessment CTA. Pages supply data;
// the layout stays consistent and the schema stays correct.

import Link from "next/link";
import { SectionHead } from "./SectionHead";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "./Schema";
import { DISCLAIMER, SITE } from "@/lib/site";

export type InfoSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  /** Optional comparison table rendered after the bullets. */
  table?: { headers: string[]; rows: string[][] };
};

export function InfoPage({
  path,
  crumb,
  eyebrow,
  title,
  mark,
  intro,
  serviceName,
  serviceDescription,
  sections,
  faqs,
  related,
}: {
  path: string;
  crumb: string;
  eyebrow: string;
  title: string;
  mark?: string;
  intro: string;
  serviceName: string;
  serviceDescription: string;
  sections: InfoSection[];
  faqs: { q: string; a: string }[];
  related: { label: string; href: string }[];
}) {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: crumb, path },
          ]),
          serviceSchema(serviceName, serviceDescription, path),
          faqSchema(faqs),
        ]}
      />

      <div className="border-b border-line bg-cloud/50">
        <div className="container-x py-12 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ink/50">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>{" "}
            / <span className="text-ink/70">{crumb}</span>
          </nav>
          <SectionHead as="h1" eyebrow={eyebrow} title={title} mark={mark} intro={intro} accent />
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/assessment" className="btn btn-rescue">
              Take the two-minute assessment
            </Link>
            <a href={SITE.phoneHref} className="btn btn-ghost">
              Call {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_320px] lg:py-20">
        <article className="max-w-3xl">
          {sections.map((s) => (
            <section key={s.heading} className="mb-10">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                {s.heading}
              </h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-ink/75">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-4 space-y-2.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-ink/75">
                      <span aria-hidden className="mt-2.5 h-[2px] w-4 shrink-0 bg-rescue" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {s.table && (
                <div className="mt-5 overflow-x-auto rounded-xl2 border border-line">
                  <table className="w-full min-w-[480px] border-collapse text-sm">
                    <thead>
                      <tr className="bg-cloud/70 text-left">
                        {s.table.headers.map((h) => (
                          <th key={h} className="px-4 py-3 font-display font-extrabold text-ink">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((row) => (
                        <tr key={row[0]} className="border-t border-line align-top">
                          {row.map((cell, i) => (
                            <td
                              key={i}
                              className={`px-4 py-3 ${i === 0 ? "font-semibold text-ink" : "text-ink/75"}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}

          <section className="mb-4">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
              Common questions.
            </h2>
            <div className="mt-6 space-y-6">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-display text-lg font-extrabold text-ink">{f.q}</h3>
                  <p className="mt-2 leading-relaxed text-ink/75">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <p className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-ink/45">
            {DISCLAIMER}
          </p>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl2 border border-line bg-cloud/60 p-6">
            <p className="guide-line text-rescue text-sm font-semibold uppercase tracking-wider">
              Where do you stand
            </p>
            <p className="mt-3 text-sm text-ink/70">
              Six questions, two minutes, instant result. You see how urgent
              your situation looks before anyone asks who you are.
            </p>
            <Link href="/assessment" className="btn btn-rescue mt-4 w-full">
              Start the assessment
            </Link>
          </div>
          <div className="rounded-xl2 border border-line p-6">
            <p className="eyebrow">Related</p>
            <ul className="mt-3 space-y-2.5">
              {related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="text-sm font-medium text-ink/70 transition hover:text-rescue"
                  >
                    {r.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
