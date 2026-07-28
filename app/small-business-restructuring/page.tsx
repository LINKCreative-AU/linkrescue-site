import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Small Business Restructuring (SBR) - Keep Control, Cut Debt",
  description:
    "Small business restructuring lets companies with debts under $1 million compromise debt, often to a fraction of face value, while you keep trading and stay in control. Eligibility, process and trade-offs explained.",
  alternates: { canonical: "/small-business-restructuring" },
};

export default function Page() {
  return (
    <InfoPage
      path="/small-business-restructuring"
      crumb="Small business restructuring"
      eyebrow="Small business restructuring"
      title="Cut the debt. Keep the business. Stay in control."
      mark="Stay in control"
      intro="Small business restructuring, SBR, is the formal process built for exactly the businesses this site serves: viable companies buried under debt, most often ATO debt. You keep trading, you stay in control, and creditors vote on a plan that usually compromises debt to a fraction of its face value."
      serviceName="Small business restructuring"
      serviceDescription="Guidance on the small business restructuring process for eligible Australian companies with debts under $1 million."
      sections={[
        {
          heading: "How SBR works.",
          paragraphs: [
            "A small business restructuring practitioner is appointed and works with you to put a plan to creditors: a single pool of money, contributed over up to three years, shared among unsecured creditors in full settlement of their debts. While the plan is developed, you keep running the business day to day, unlike administration or liquidation where control passes to an external party.",
            "Creditors vote, and if creditors holding more than half the value of responding claims accept, the plan binds all unsecured creditors including the ATO. The ATO votes on the large majority of plans put forward, and accepts far more than it rejects when the plan is credible and lodgments are current.",
          ],
        },
        {
          heading: "Who is eligible.",
          paragraphs: ["The gateway tests, roughly:"],
          bullets: [
            "Total liabilities under $1 million, excluding employee entitlements",
            "The company is insolvent or likely to become insolvent",
            "Employee entitlements that are due, including super, are paid before the plan is proposed",
            "Tax lodgments are up to date, or at least lodged, another reason lodgments come first",
            "The company and its directors have not used SBR or simplified liquidation within the last seven years",
          ],
        },
        {
          heading: "What SBR does to a Director Penalty Notice.",
          paragraphs: [
            "Appointing a restructuring practitioner within the 21-day window of a non-lockdown DPN is one of the actions that can lead to the director penalty being remitted. For directors holding a fresh DPN, SBR is often the move that deals with the company debt and the personal exposure in one process. Timing is everything, which is why DPN results on the assessment go to the top of the queue.",
          ],
        },
        {
          heading: "The trade-offs, stated plainly.",
          paragraphs: [
            "SBR appears on the public record, and some suppliers and financiers will notice. Secured creditors and employee entitlements sit outside the plan. The company must be able to fund the plan it proposes and keep current obligations paid as they arise, a plan the business cannot afford helps nobody. Where those trade-offs do not fit, the alternatives page covers the other paths.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How much of the debt gets written off in an SBR?",
          a: "Every plan is different and nothing is guaranteed. Accepted plans commonly return creditors a fraction of face value, with the remainder written off when the plan completes. What a credible number looks like for your company depends on what the business can genuinely fund.",
        },
        {
          q: "Do I lose control of my company during restructuring?",
          a: "No. You keep trading and keep making day-to-day decisions while the practitioner helps develop the plan. That is the core difference between SBR and voluntary administration.",
        },
        {
          q: "Will the ATO vote against my plan?",
          a: "The ATO is the major creditor in most SBRs and supports well-built plans more often than not. It expects lodgments to be current, the plan to beat the likely liquidation outcome, and future obligations to be met. That is the standard we build to.",
        },
        {
          q: "How long does small business restructuring take?",
          a: "The plan proposal phase runs to a tight statutory timetable measured in weeks: broadly 20 business days to develop the plan and 15 business days for creditors to vote, with limited extensions. The plan itself then runs for up to three years.",
        },
      ]}
      related={[
        { label: "ATO debt help", href: "/ato-debt-help" },
        { label: "Director Penalty Notices", href: "/director-penalty-notice" },
        { label: "Alternatives to liquidation", href: "/liquidation-alternatives" },
      ]}
    />
  );
}
