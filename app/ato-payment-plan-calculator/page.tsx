import type { Metadata } from "next";
import Link from "next/link";
import { GicCalculator } from "@/components/GicCalculator";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { DISCLAIMER, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "ATO Payment Plan Calculator: Free GIC Estimate",
  description:
    "Enter your ATO debt and monthly payment to see how long it takes to clear, what interest adds, and what it takes to clear in 12 or 24 months. Free.",
  alternates: { canonical: "/ato-payment-plan-calculator" },
};

const FAQS = [
  {
    q: "How do I use the ATO payment plan calculator?",
    a: "Enter what the business owes the ATO today and what it can genuinely pay each month, after new GST, PAYG withholding and super are covered. The calculator shows how many months the debt takes to clear, how much of what you pay is interest, and the monthly payment that would clear it in 12 or 24 months. You can type exact amounts or use the sliders.",
  },
  {
    q: "What is the ATO general interest charge rate?",
    a: "The general interest charge (GIC) is set quarterly at the 90-day bank bill rate plus a 7% uplift, and it compounds daily. It has sat above 10% a year in recent quarters. The calculator on this page shows the rate and the quarter it is using, and the current rate is published on the ATO website.",
  },
  {
    q: "Does interest stop once I am on a payment plan?",
    a: "No. A payment plan stops the ATO taking firmer collection action while you keep to it, but GIC keeps compounding on the unpaid balance for the life of the plan. That is why the calculator counts interest month by month rather than dividing the debt by your payment.",
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
    q: "Does a payment plan stop a Director Penalty Notice?",
    a: "No. A payment plan does not remit director penalties, and the ATO can issue a DPN while a plan is running. If you hold a DPN, the response to the notice comes first and the payment plan second.",
  },
  {
    q: "Is this calculator accurate to the cent?",
    a: "No, and nothing public can be: your exact GIC depends on the daily rate in each quarter, when payments land, and any remissions. This calculator uses the flat annual rate shown, compounding daily, to give you a fair-sized picture. Your ATO online services account shows the exact balance.",
  },
];

const RIGHT_TOOL = [
  "The calculator shows the debt clearing inside about two years at a payment the business can keep making",
  "Lodgments are up to date, or can be brought up to date before you apply",
  "New GST, PAYG withholding and super are being paid on time alongside the old debt",
  "The debt came from a one-off hit, a slow season or a big customer paying late, rather than a business that loses money every month",
];

const WRONG_TOOL = [
  "The payment you can afford barely covers the interest, or the calculator says the debt never clears",
  "This would be the second or third plan on the same debt",
  "New liabilities keep building up behind the old ones",
  "You already hold a Director Penalty Notice, a garnishee notice or a statutory demand",
];

const STEPS = [
  {
    title: "Lodge everything outstanding.",
    text: "Unlodged BAS and returns are the fastest way to a no. The ATO generally wants lodgments current before it agrees to a plan, and the debt figure is not final until they are in.",
  },
  {
    title: "Work out a payment from the cash flow, not from hope.",
    text: "Start from what is left after wages, rent, suppliers and the new GST, PAYG withholding and super that will fall due while the plan runs. Put that number into the calculator above. If it does not clear the debt in a sensible time, that is worth knowing before you commit to it.",
  },
  {
    title: "Set the plan up the right way for the size of the debt.",
    text: "Smaller debts can generally be set up through ATO online services or by your registered agent, often approved straight away. Larger or more complicated positions are negotiated with the ATO, and a proposal backed by real numbers is what gets accepted.",
  },
  {
    title: "Ask about interest, then keep to the plan.",
    text: "The ATO can remit GIC where circumstances justify it, so a well-grounded request is worth making alongside the plan. Once the plan is in place, every instalment and every new obligation has to be met. If a payment is going to be missed, making contact before the default changes the conversation.",
  },
];

const linkCls = "font-semibold text-rescue hover:text-rescue-dark";

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
          <p className="eyebrow guide-line-inline text-rescue">
            <span className="text-neutral-500">Free tool</span>
          </p>
          <h1 className="mt-6 font-display text-4xl font-normal leading-[1.02] tracking-tight text-ink sm:text-5xl">
            ATO payment plan calculator: see what the debt{" "}
            <span className="marker">actually costs</span> to carry.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink/75">
            Put in what you owe and what you can pay each month. You will see how long the debt
            takes to clear, how much of it is interest, and what it takes to clear it in 12 or 24
            months. Free, instant, and nothing you enter leaves the page.
          </p>
          <a href="#calculator" className="btn btn-rescue mt-7">
            Go to the calculator
          </a>
        </div>
      </div>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_320px] lg:py-20">
        <div className="max-w-3xl">
          <div id="calculator" className="scroll-mt-24">
            <GicCalculator />
          </div>

          <article className="mt-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              How ATO payment plans work.
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">
              An ATO payment plan spreads a tax debt over regular instalments, weekly,
              fortnightly or monthly, while the ATO holds off firmer collection action. You propose
              the instalment and the ATO decides whether it is credible. In practice it wants
              lodgments up to date, an amount the cash flow can carry, the debt cleared in the
              shortest realistic timeframe, usually within two years, and new obligations paid on
              time while the plan runs.
            </p>
            <p className="mt-4 leading-relaxed text-ink/75">
              Two things catch people out. First, a plan does not stop interest: the general
              interest charge keeps compounding daily on whatever is unpaid. Second, a plan only
              holds while you keep to it. Miss instalments or let new debts build and the plan can
              be cancelled, with the full balance falling due. Our guide to{" "}
              <Link href="/ato-payment-plan" className={linkCls}>
                setting up an ATO payment plan that holds
              </Link>{" "}
              goes through what the ATO looks for in more detail.
            </p>

            <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-ink">
              How the general interest charge works.
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">
              GIC is the ATO&apos;s price for unpaid tax. The rate resets every quarter at the
              90-day bank bill rate plus a 7% uplift, and it compounds daily, so the debt grows
              every single day it is unpaid. Since 1 July 2025 the interest is no longer tax
              deductible, which means a business now needs to earn the interest in pre-tax profit
              just to stand still. That is why the calculator shows the interest separately: on a
              long plan it can add a large slice to what you repay.
            </p>

            <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-ink">
              When a payment plan is the right tool.
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">
              A plan repays the debt in full plus interest, so it suits a business that can
              afford to do that. It is usually the right move when:
            </p>
            <ul className="mt-4 space-y-2.5">
              {RIGHT_TOOL.map((b) => (
                <li key={b} className="flex gap-3 text-ink/75">
                  <span aria-hidden className="mt-2.5 h-[2px] w-4 shrink-0 bg-rescue" />
                  {b}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-ink">
              When the number is telling you something else.
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">
              A plan treats the symptom when any of these are true:
            </p>
            <ul className="mt-4 space-y-2.5">
              {WRONG_TOOL.map((b) => (
                <li key={b} className="flex gap-3 text-ink/75">
                  <span aria-hidden className="mt-2.5 h-[2px] w-4 shrink-0 bg-rescue" />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-4 leading-relaxed text-ink/75">
              In that position,{" "}
              <Link href="/small-business-restructuring" className={linkCls}>
                small business restructuring
              </Link>{" "}
              can compromise eligible debt to what the business can genuinely fund while you keep
              trading. If a notice has already arrived, start with{" "}
              <Link href="/director-penalty-notice" className={linkCls}>
                director penalty notice help
              </Link>{" "}
              or{" "}
              <Link href="/ato-debt-help" className={linkCls}>
                ATO debt help
              </Link>
              , because the enforcement step needs dealing with before the payment question.
            </p>

            <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-ink">
              Before you set one up.
            </h2>
            <ol className="mt-6 space-y-6">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="font-display text-2xl font-semibold text-rescue/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-ink/75">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-12 rounded-xl2 border-2 border-rescue/30 bg-rescue-light/25 p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Numbers not adding up?
              </h2>
              <p className="mt-3 leading-relaxed text-ink/75">
                Tell us what the calculator showed. We will tell you whether a plan is the right
                tool, what a credible proposal looks like, and what else is on the table. The first
                conversation is free and confidential, and nothing is set in motion by having it.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/contact" className="btn btn-rescue">
                  Ask for a call back
                </Link>
                <a href={SITE.phoneHref} className="btn btn-ghost">
                  Call {SITE.phone}
                </a>
                <Link href="/assessment" className="btn btn-ghost">
                  Take the two-minute assessment
                </Link>
              </div>
            </div>

            <h2 className="mt-12 font-display text-2xl font-semibold tracking-tight text-ink">
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
                <Link href="/director-penalty-notice" className="text-sm font-medium text-ink/75 transition hover:text-rescue">
                  Director penalty notice help →
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
