import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "ATO Payment Plan - How to Set One Up That Actually Holds",
  description:
    "You can put most ATO debt on a payment plan, and the ATO accepts plans it believes in. How to set one up, what the ATO looks for, what interest costs you, and what to do when a plan is not the right tool.",
  alternates: { canonical: "/ato-payment-plan" },
};

export default function Page() {
  return (
    <InfoPage
      path="/ato-payment-plan"
      crumb="ATO payment plans"
      eyebrow="ATO payment plans"
      title="A payment plan the ATO believes. Not one built on hope."
      mark="believes"
      intro="An ATO payment plan is the most common way out of tax debt, and the most commonly botched. Plans built on optimistic numbers default, and every default makes the next negotiation harder. Built properly, a plan buys the business room to trade its way back."
      serviceName="ATO payment plan negotiation"
      serviceDescription="Help setting up and negotiating ATO payment plans for Australian business tax debt, including defaulted and repeat plans."
      sections={[
        {
          heading: "How ATO payment plans work.",
          paragraphs: [
            "A payment plan spreads a tax debt over instalments, usually weekly, fortnightly or monthly, while the ATO holds off firmer collection action. Smaller debts can generally be set up through ATO online services in minutes. Larger or more complicated positions are negotiated directly, and that is where preparation decides the outcome.",
            "Two things stay true on every plan. Interest keeps running on the unpaid balance, and lodgments must stay current, a plan does not pause your obligation to lodge and pay new liabilities on time. Miss either and the plan can default.",
          ],
          table: {
            headers: ["Your position", "How the plan usually gets set up"],
            rows: [
              ["Smaller debt, lodgments current", "Self-serve through ATO online services or your agent, often approved automatically"],
              ["Larger debt, or a defaulted plan behind you", "Negotiated with the ATO with a cash flow case: proposed instalments backed by real numbers"],
              ["Debt with garnishee, DPN or legal action started", "Payment plan alone is rarely enough, the response has to deal with the enforcement step first"],
              ["Debt the business can never realistically repay", "A plan delays the problem. Restructuring options usually serve you better"],
            ],
          },
        },
        {
          heading: "What the ATO looks for before saying yes.",
          paragraphs: ["The ATO publishes its expectations, and plans that meet them get approved. In practice it wants to see:"],
          bullets: [
            "Lodgments up to date, an unlodged return is the fastest way to a no",
            "Instalments the cash flow can actually support, evidenced for larger debts",
            "The debt paid off in the shortest realistic timeframe, not stretched for comfort",
            "New obligations paid on time while the plan runs",
            "A history that shows effort, part payments and early contact both help",
          ],
        },
        {
          heading: "The interest problem.",
          paragraphs: [
            "The general interest charge compounds daily on the unpaid balance, and from 1 July 2025 it is no longer tax deductible, which made every dollar of ATO debt more expensive to carry. A payment plan does not stop interest, it only stops enforcement.",
            "That changes the maths. Where the business can refinance or fund the debt more cheaply, paying the ATO out can beat a long plan. Where it cannot, remission of interest is worth pursuing alongside the plan, the ATO can and does remit interest in the right circumstances. We run both numbers before recommending either.",
          ],
        },
        {
          heading: "When a payment plan is the wrong tool.",
          paragraphs: [
            "A plan repays one hundred cents in the dollar plus interest. If the debt is large against the size of the business, if this is the second or third plan on the same debt, or if new liabilities keep piling up behind the old ones, the plan is treating the symptom. Small business restructuring can compromise the same debt to a fraction of its face value while you keep trading, and the ATO accepts credible restructuring plans routinely. The right answer depends on your numbers, which is what the assessment and the first call are for.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How long can an ATO payment plan run?",
          a: "Most plans run up to two years, and the ATO prefers the shortest timeframe the cash flow supports. Longer arrangements exist for the right circumstances but need a stronger case. A plan you cannot sustain is worse than a shorter honest conversation about what the business can afford.",
        },
        {
          q: "Will the ATO accept my payment plan proposal?",
          a: "The ATO accepts proposals it considers credible: lodgments current, realistic instalments, the debt cleared in a sensible timeframe, and new obligations paid as they arise. Larger debts need supporting evidence. Prepared properly, most first-time proposals succeed. No approval is guaranteed.",
        },
        {
          q: "What happens if I default on an ATO payment plan?",
          a: "The plan is cancelled, the full balance falls due, and the ATO's next step is usually firmer: garnishee notices, Director Penalty Notices or legal action. A renegotiation is still possible after a default, but the bar rises each time. If a default is coming, contact before it happens changes the conversation.",
        },
        {
          q: "Does a payment plan stop a Director Penalty Notice?",
          a: "No. A payment plan does not remit director penalties, and the ATO can issue a DPN while a plan is running. If you hold a DPN, the 21-day response comes first and the payment question second. Our Director Penalty Notice page covers the clocks and options.",
        },
        {
          q: "Can interest on my ATO debt be reduced?",
          a: "The ATO can remit general interest charge where circumstances justify it, and well-prepared requests with genuine grounds succeed often enough to be worth making, especially alongside a payment plan. Since interest stopped being deductible from 1 July 2025, remission is worth more than it used to be. No remission is guaranteed.",
        },
      ]}
      related={[
        { label: "ATO debt help", href: "/ato-debt-help" },
        { label: "Director Penalty Notices", href: "/director-penalty-notice" },
        { label: "Small business restructuring", href: "/small-business-restructuring" },
      ]}
    />
  );
}
