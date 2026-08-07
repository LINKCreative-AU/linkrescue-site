import type { Metadata } from "next";
import Link from "next/link";
import { GicCalculator } from "@/components/GicCalculator";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { DISCLAIMER, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "ATO Payment Plan Calculator - GIC Interest & Time to Clear",
  description:
    "Free ATO payment plan calculator. Enter your tax debt and monthly payment to see general interest charge accruing daily, how long the debt takes to clear, and when a payment plan is the wrong tool.",
  alternates: { canonical: "/ato-payment-plan-calculator" },
};

const FAQS = [
  {
    q: "What is the ATO general interest charge rate?",
    a: "The general interest charge (GIC) is set quarterly at the 90-day bank bill rate plus a 7% uplift, and it compounds daily. It has sat above 10% a year in recent quarters. The calculator on this page shows the rate it is using, and the current rate is published on the ATO website.",
  },
  {
    q: "Is ATO interest tax deductible?",
    a: "Not any more. GIC and shortfall interest charge stopped being tax deductible from 1 July 2025, which raised the real cost of carrying tax debt for every business. Debt that was tolerable when the interest was deductible often stops making sense after that change.",
  },
  {
    q: "How does the ATO calculate payment plan instalments?",
    a: "The ATO does not set your instalment, you propose it, and the ATO accepts proposals it considers credible: lodgments current, instalments the cash flow supports, and the debt cleared in the shortest realistic timeframe, usually within two years. Interest keeps accruing on the balance for the life of the plan.",
  },
  {
    q: "What if my payment barely covers the interest?",
    a: "Then the plan is not a plan, it is a treadmill. When the balance cannot realistically clear, eligible companies with total debts under $1 million can use small business restructuring to compromise the debt to what the business can genuinely fund, and the ATO accepts credible restructuring plans routinely.",
  },
  {
    q: "Is this calculator accurate to the cent?",
    a: "No, and nothing public can be: your exact GIC depends on the daily rate in each quarter, when payments land, and any remissions. This calculator uses the flat annual rate shown, compounding daily, to give you a fair-sized picture. Your ATO portal shows the exact balance.",
  },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "ATO payment plan calculator", path: "/ato-payment-plan-calculator" },
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
            / <span className="text-ink/75">ATO payment plan calculator</span>
          </nav>
          <h1 className="font-display text-4xl font-normal leading-[1.02] tracking-tight text-ink sm:text-5xl">
            See what the debt <span className="marker">actually costs</span> to carry.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink/75">
            The general interest charge compounds daily and no longer comes off your tax. Two
            sliders show you whether your payment plan clears the debt or just feeds it.
          </p>
        </div>
      </div>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_320px] lg:py-20">
        <div className="max-w-3xl">
          <GicCalculator />

          <article className="mt-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              How the general interest charge works.
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">
              GIC is the ATO's price for unpaid tax. The rate resets every quarter at the 90-day
              bank bill rate plus a 7% uplift, and it compounds daily, so the debt grows every
              single day it is unpaid. Since 1 July 2025 the interest is no longer tax
              deductible, which means a business now needs to earn the interest in pre-tax
              profit just to stand still.
            </p>
            <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-ink">
              What the number should tell you.
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">
              If the calculator shows the debt clearing inside about two years at a payment your
              cash flow genuinely supports, a well-prepared{" "}
              <Link href="/ato-payment-plan" className="font-semibold text-rescue hover:text-rescue-dark">
                ATO payment plan
              </Link>{" "}
              is usually the move. If it shows the debt never clearing, or clearing over many
              years, the interest is telling you the tool is wrong:{" "}
              <Link
                href="/small-business-restructuring"
                className="font-semibold text-rescue hover:text-rescue-dark"
              >
                small business restructuring
              </Link>{" "}
              compromises eligible debt to what the business can fund, and the{" "}
              <Link href="/assessment" className="font-semibold text-rescue hover:text-rescue-dark">
                two-minute assessment
              </Link>{" "}
              maps which path fits your answers.
            </p>

            <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-ink">
              Common questions.
            </h2>
            <div className="mt-6 space-y-6">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <h3 className="font-display text-lg font-semibold text-ink">{f.q}</h3>
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
            <p className="mt-3 text-sm text-ink/75">
              Six questions, two minutes, instant result, judgement-free.
            </p>
            <Link href="/assessment" className="btn btn-rescue mt-4 w-full">
              Start the assessment
            </Link>
          </div>
          <div className="rounded-xl2 border border-line p-6">
            <p className="eyebrow">Related</p>
            <ul className="mt-6 space-y-2.5">
              <li>
                <Link href="/ato-payment-plan" className="text-sm font-medium text-ink/75 transition hover:text-rescue">
                  ATO payment plans →
                </Link>
              </li>
              <li>
                <Link href="/am-i-insolvent" className="text-sm font-medium text-ink/75 transition hover:text-rescue">
                  Am I insolvent? The indicator test →
                </Link>
              </li>
              <li>
                <Link href="/ato-debt-help" className="text-sm font-medium text-ink/75 transition hover:text-rescue">
                  ATO debt help →
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
