import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Voluntary Administration - Process, Timeline & Alternatives",
  description:
    "Voluntary administration gives an insolvent company breathing space while creditors decide its future: a deed of company arrangement, liquidation, or a return to the directors. The process, the timeline and how it compares to restructuring.",
  alternates: { canonical: "/voluntary-administration" },
};

export default function Page() {
  return (
    <InfoPage
      path="/voluntary-administration"
      crumb="Voluntary administration"
      eyebrow="Voluntary administration"
      title="Breathing space with a deadline attached."
      mark="Breathing space"
      intro="Voluntary administration is the formal rescue process for companies in serious trouble: an independent administrator takes control, a moratorium freezes most creditor claims, and within weeks creditors vote on the company's future. It can save a business. It is also heavier than most directors expect, which is why the comparison at the bottom of this page matters."
      serviceName="Voluntary administration guidance"
      serviceDescription="Plain-language guidance on the voluntary administration process for Australian companies, including deeds of company arrangement and alternatives."
      sections={[
        {
          heading: "How the process runs.",
          paragraphs: [
            "The directors resolve the company is insolvent or likely to become insolvent and appoint a voluntary administrator, a registered insolvency practitioner. From that moment the administrator controls the company, and a moratorium stops most creditors, lessors and guarantee claims from being enforced while the process runs.",
            "The timetable is tight by design. A first creditors meeting happens within about eight business days. The administrator then investigates and reports, and a second meeting around five weeks in decides the company's future by creditor vote.",
          ],
          bullets: [
            "Outcome one: a deed of company arrangement, a binding deal that compromises debts and returns the company to its directors",
            "Outcome two: liquidation, where creditors decide the company has no viable future",
            "Outcome three: hand the company back to the directors, rare in practice",
          ],
        },
        {
          heading: "The deed of company arrangement is the point.",
          paragraphs: [
            "A DOCA is the rescue mechanism inside voluntary administration: a proposal, usually funded by the directors or a third party, that pays creditors a better return than liquidation would in exchange for compromising their debts. If creditors holding a majority in number and value vote yes, it binds all unsecured creditors, and the business comes out the other side trading, restructured and clear of the compromised debt.",
            "The quality of the DOCA proposal decides the outcome, and it is being written while the administrator investigates. Directors who arrive at administration with a funded, credible proposal shaped in advance get better results than directors who improvise one under the statutory clock.",
          ],
        },
        {
          heading: "What it means for you personally.",
          paragraphs: [
            "Appointing an administrator within the 21-day window of a non-lockdown Director Penalty Notice is one of the actions that can lead to the penalty being remitted. Insolvent trading exposure also generally stops accruing once the administrator is in. Personal guarantees are the catch: the moratorium delays guarantee enforcement during the administration, but the guarantees survive the process and need their own strategy.",
          ],
        },
        {
          heading: "Administration, restructuring or liquidation.",
          paragraphs: [
            "For companies under $1 million in debt, small business restructuring often achieves the same debt compromise while the directors keep control, at materially lower cost. Voluntary administration earns its weight where the debts are larger, the creditor position is contested, or the business needs the moratorium's protection to survive the negotiation.",
          ],
          table: {
            headers: ["", "Small business restructuring", "Voluntary administration", "Liquidation"],
            rows: [
              ["Who controls the company", "Directors keep trading control", "Administrator takes control", "Liquidator takes control"],
              ["Debt ceiling", "Under $1m total liabilities", "No limit", "No limit"],
              ["Built for", "Viable small companies with tax debt", "Larger or contested rescues", "Companies with no viable future"],
              ["Debt outcome", "Plan compromises unsecured debt", "DOCA compromises unsecured debt", "Assets realised, company ends"],
              ["Typical timeframe to decision", "About seven weeks", "About five to six weeks", "Months to years to finalise"],
              ["Relative cost", "Lowest of the formal options", "Higher", "Depends on the estate"],
            ],
          },
        },
      ]}
      faqs={[
        {
          q: "Does voluntary administration mean the business is finished?",
          a: "No. Administration exists to rescue businesses, and companies come through it trading under a deed of company arrangement. It becomes liquidation only if creditors vote that way, usually because no credible rescue proposal was put to them.",
        },
        {
          q: "Can I keep trading during voluntary administration?",
          a: "The business can keep trading, but the administrator runs it, not you. That is the core trade-off against small business restructuring, where you stay in control. Which fits depends on the company's size, creditors and how much protection the situation needs.",
        },
        {
          q: "What does voluntary administration cost?",
          a: "Administrator remuneration depends on the size and complexity of the company, and is approved by creditors. It is meaningfully more than small business restructuring for most small companies, which is why eligibility for restructuring is worth checking first. We put numbers on both before you commit to anything.",
        },
        {
          q: "Does appointing an administrator deal with a Director Penalty Notice?",
          a: "Appointing an administrator within the 21 days on a non-lockdown DPN is one of the steps that can lead to remission of the penalty. Lockdown penalties are not removed by an appointment. The notice type decides the strategy, so the notice gets read first.",
        },
      ]}
      related={[
        { label: "Small business restructuring", href: "/small-business-restructuring" },
        { label: "Alternatives to liquidation", href: "/liquidation-alternatives" },
        { label: "Director Penalty Notices", href: "/director-penalty-notice" },
      ]}
    />
  );
}
