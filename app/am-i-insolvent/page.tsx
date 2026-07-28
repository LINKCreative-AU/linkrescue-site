import type { Metadata } from "next";
import Link from "next/link";
import { InsolvencyTest } from "@/components/InsolvencyTest";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { DISCLAIMER } from "@/lib/site";

export const metadata: Metadata = {
  title: "Am I Insolvent? The 12 Warning Signs Courts Look At",
  description:
    "A free insolvency test built on the indicators courts and ASIC use: continuing losses, overdue tax, creditors outside terms and more. Check your business against all 12 and see what your count means.",
  alternates: { canonical: "/am-i-insolvent" },
};

const FAQS = [
  {
    q: "What is the legal test for insolvency in Australia?",
    a: "A company is insolvent when it cannot pay all its debts as and when they fall due. It is a cash flow test decided on the whole picture, not a single ratio, and courts weigh indicator patterns like the twelve on this page when deciding it.",
  },
  {
    q: "Why does it matter exactly when a company became insolvent?",
    a: "Because directors can be personally liable for debts the company incurs while trading insolvent. The earlier the insolvency date, the bigger the exposure window. Acting at the warning-sign stage, and documenting it, is what keeps directors on the right side of that line.",
  },
  {
    q: "I ticked a lot of these boxes. Is it over?",
    a: "No. A high count means the window for the widest options is closing, not closed. Safe harbour protection, small business restructuring and voluntary administration all exist for companies at exactly this point, and each rewards moving early. The result to fear is the one you never looked at.",
  },
  {
    q: "Does being insolvent mean the company must be liquidated?",
    a: "No. Insolvent or near-insolvent companies restructure and recover through payment arrangements, small business restructuring and deeds of company arrangement regularly. Liquidation is the right ending only for a company with no viable future in its current form.",
  },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Am I insolvent?", path: "/am-i-insolvent" },
          ]),
          faqSchema(FAQS),
        ]}
      />

      <div className="border-b border-line bg-cloud/50">
        <div className="container-x py-12 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ink/50">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>{" "}
            / <span className="text-ink/70">Am I insolvent?</span>
          </nav>
          <h1 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl">
            Am I insolvent? Check the <span className="marker">twelve signs</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink/70">
            Insolvency is a legal test with a plain-language core: can the business pay its debts
            as they fall due. The indicators below are the ones courts and ASIC actually weigh.
            Asking the question early is a strength, not an admission.
          </p>
        </div>
      </div>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_320px] lg:py-20">
        <div className="max-w-3xl">
          <InsolvencyTest />

          <article className="mt-12">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
              Why these twelve.
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">
              The list comes from decades of insolvency case law, the pattern a court assembles
              when it decides, after the fact, when a company crossed the line. Directors get no
              such hindsight, which is why the law judges the pattern, not any single tick.
              Overdue tax sits high on the list for a reason: the ATO is usually the creditor a
              struggling business stretches first, and the one with the sharpest collection
              powers when it stops waiting.
            </p>
            <h2 className="mt-10 font-display text-2xl font-extrabold tracking-tight text-ink">
              What to do with your count.
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">
              A low count is a maintenance job: keep lodgments current and cash flow visible. A
              middle count is the moment{" "}
              <Link href="/safe-harbour" className="font-semibold text-rescue hover:text-rescue-dark">
                safe harbour
              </Link>{" "}
              was written for, protection while you run a real turnaround. A high count means the
              formal tools,{" "}
              <Link
                href="/small-business-restructuring"
                className="font-semibold text-rescue hover:text-rescue-dark"
              >
                small business restructuring
              </Link>{" "}
              or{" "}
              <Link
                href="/voluntary-administration"
                className="font-semibold text-rescue hover:text-rescue-dark"
              >
                voluntary administration
              </Link>
              , should be on the table this week, chosen on your timeline rather than a
              creditor's.
            </p>

            <h2 className="mt-10 font-display text-2xl font-extrabold tracking-tight text-ink">
              Common questions.
            </h2>
            <div className="mt-6 space-y-6">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <h3 className="font-display text-lg font-extrabold text-ink">{f.q}</h3>
                  <p className="mt-2 leading-relaxed text-ink/75">{f.a}</p>
                </div>
              ))}
            </div>

            <p className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-ink/45">
              {DISCLAIMER}
            </p>
          </article>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl2 border border-line bg-cloud/60 p-6">
            <p className="guide-line text-rescue text-sm font-semibold uppercase tracking-wider">
              Where do you stand
            </p>
            <p className="mt-3 text-sm text-ink/70">
              The indicator test is the technical lens. The two-minute assessment is the triage:
              instant result, clear next step.
            </p>
            <Link href="/assessment" className="btn btn-rescue mt-4 w-full">
              Start the assessment
            </Link>
          </div>
          <div className="rounded-xl2 border border-line p-6">
            <p className="eyebrow">Related</p>
            <ul className="mt-3 space-y-2.5">
              <li>
                <Link href="/safe-harbour" className="text-sm font-medium text-ink/70 transition hover:text-rescue">
                  Safe harbour →
                </Link>
              </li>
              <li>
                <Link href="/ato-payment-plan-calculator" className="text-sm font-medium text-ink/70 transition hover:text-rescue">
                  ATO payment plan calculator →
                </Link>
              </li>
              <li>
                <Link href="/liquidation-alternatives" className="text-sm font-medium text-ink/70 transition hover:text-rescue">
                  Alternatives to liquidation →
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
