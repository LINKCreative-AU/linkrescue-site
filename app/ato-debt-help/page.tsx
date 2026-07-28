import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "ATO Debt Help - Payment Plans & Tax Debt Negotiation",
  description:
    "You can deal with ATO debt before the ATO deals with you. Payment plans, remission requests and restructuring options for Australian businesses, explained in plain language with a free two-minute assessment.",
  alternates: { canonical: "/ato-debt-help" },
};

export default function Page() {
  return (
    <InfoPage
      path="/ato-debt-help"
      crumb="ATO debt help"
      eyebrow="ATO debt help"
      title="Deal with the ATO before the ATO deals with you."
      mark="before"
      intro="ATO debt is the most common pressure point for the businesses that reach us, and the one where early engagement changes the most. The options below are open to almost every business, and they narrow the longer the debt runs."
      serviceName="ATO debt help"
      serviceDescription="Payment plan negotiation, remission requests and restructuring options for Australian business tax debt."
      sections={[
        {
          heading: "Why ATO debt behaves differently.",
          paragraphs: [
            "The ATO is not an ordinary creditor. It has collection powers no supplier has: garnishee notices that take money straight from your bank account or your debtors, Director Penalty Notices that make you personally liable for company debts, and disclosure of business tax debts over $100,000 to credit reporting agencies.",
            "The same system also rewards engagement. Directors who front up with lodgments current and a credible payment proposal get treated differently to directors who go quiet. Silence is the one strategy that reliably makes ATO debt worse.",
          ],
        },
        {
          heading: "The options, in the order we usually explore them.",
          paragraphs: [
            "Which options fit depends on the size of the debt, whether lodgments are current, and whether the underlying business is viable. In rough order of escalation:",
          ],
          bullets: [
            "Catch up lodgments. Unlodged returns block every other option and start penalty clocks of their own.",
            "Payment plan. The ATO accepts plans it believes in: realistic instalments built from a real cash flow, not optimism.",
            "Remission of interest and penalties. In the right circumstances the general interest charge and penalties can be reduced, which can shrink the debt meaningfully.",
            "Small business restructuring. For companies with total debts under $1 million, a formal plan can compromise ATO debt to a fraction of its face value while you stay in control.",
            "Formal insolvency options. Where the business is not viable in its current shape, voluntary administration or liquidation ends the bleeding, and doing it on your timeline beats doing it on the ATO's.",
          ],
        },
        {
          heading: "When the letters have already started.",
          paragraphs: [
            "A garnishee notice, a Director Penalty Notice or a statutory demand moves you out of the slow lane. Each runs on its own clock and each has a correct response. If one of these has arrived, take the assessment now or call us today rather than this week, the difference matters.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Will the ATO accept a payment plan for my business?",
          a: "The ATO accepts plans it considers credible: lodgments up to date, a realistic instalment amount backed by cash flow, and a history of keeping to commitments where possible. Plans fail when they are built on hope, which is why we build them from the numbers first.",
        },
        {
          q: "Can ATO interest and penalties be reduced?",
          a: "In some circumstances, yes. The ATO can remit general interest charge and penalties, and well-prepared remission requests with genuine grounds succeed often enough to be worth making. No reduction is guaranteed.",
        },
        {
          q: "What happens if my business tax debt goes over $100,000?",
          a: "Business tax debts over $100,000 that are not being managed through a payment plan can be disclosed to credit reporting agencies, which affects your ability to get finance and trade credit. It is one more reason engagement beats silence.",
        },
        {
          q: "Is it better to pay the ATO or my suppliers first?",
          a: "There is no universal answer, and the wrong choice can create personal liability. Unpaid super and PAYG withholding expose directors personally through the penalty regime, which changes the usual ordering. This is exactly the conversation to have with us before deciding.",
        },
      ]}
      related={[
        { label: "ATO payment plans", href: "/ato-payment-plan" },
        { label: "Director Penalty Notices", href: "/director-penalty-notice" },
        { label: "Small business restructuring", href: "/small-business-restructuring" },
      ]}
    />
  );
}
