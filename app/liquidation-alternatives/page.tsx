import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Company Liquidation & The Alternatives - The Full Menu",
  description:
    "Before you liquidate a company, see the full menu. Payment plans, informal workouts, safe harbour, small business restructuring and voluntary administration compared against liquidation, so you choose a path instead of defaulting into one.",
  alternates: { canonical: "/liquidation-alternatives" },
};

export default function Page() {
  return (
    <InfoPage
      path="/liquidation-alternatives"
      crumb="Alternatives to liquidation"
      eyebrow="Alternatives to liquidation"
      title="Liquidation is a door, not the hallway."
      mark="a door"
      intro="Directors under pressure often assume liquidation is the only ending, usually because the loudest voices they hear profit from appointments. The full menu is wider, and the earlier you look at it, the more of it is available."
      serviceName="Liquidation alternatives advisory"
      serviceDescription="Comparison and guidance across informal workouts, safe harbour, small business restructuring, voluntary administration and liquidation for Australian companies."
      sections={[
        {
          heading: "The menu, from lightest to heaviest.",
          paragraphs: ["Each step down the list trades flexibility for protection:"],
          bullets: [
            "Informal workout. Renegotiated terms with the ATO and key creditors, no formal process, no public record. Works while goodwill and time remain.",
            "Safe harbour. Statutory protection from insolvent trading liability for directors pursuing a credible turnaround plan with proper advice. The business keeps trading while the plan runs.",
            "Small business restructuring. Debts under $1 million compromised by a creditor-voted plan while you stay in control. The purpose-built rescue tool for small companies.",
            "Voluntary administration. An administrator takes control and creditors decide between a deed of company arrangement and liquidation. Heavier, but it can rescue larger or more contested businesses.",
            "Liquidation. The orderly end of a company that has no viable future in its current form. Sometimes it is the right call, and choosing it deliberately, on your timeline, beats being forced into it.",
          ],
        },
        {
          heading: "Safe harbour deserves more attention than it gets.",
          paragraphs: [
            "Australia's insolvent trading rules make directors personally liable for debts incurred while a company trades insolvent. Safe harbour suspends that exposure for directors who, suspecting trouble, start developing a course of action reasonably likely to lead to a better outcome than immediate administration or liquidation, with employee entitlements and tax lodgments kept current.",
            "In practice that means getting advice early, building a real turnaround plan and documenting the journey. It is the legal mechanism that buys a viable business the time to fix itself, and it only works if you start before the position becomes hopeless.",
          ],
        },
        {
          heading: "How to choose.",
          paragraphs: [
            "Two questions do most of the work. First, is the underlying business viable if the historical debt were dealt with? Second, how much time and trust remain with the ATO and your creditors? Viable plus time points to workouts, safe harbour or SBR. Viable minus time points to the formal rescue tools. Not viable points to an orderly, planned ending that protects you personally as far as the law allows.",
            "The assessment takes two minutes and maps your answers to where you likely sit. The call that follows tests it against the real numbers.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Can I just start a new company and leave the debts behind?",
          a: "Illegal phoenix activity, moving assets to a new entity to defeat creditors, carries serious personal consequences for directors and advisors. Legitimate restructures that achieve a fresh start exist, and the line between the two is exactly why you want proper advice before moving anything.",
        },
        {
          q: "Do these options stop me trading?",
          a: "Informal workouts, safe harbour and small business restructuring all keep you trading and in control. Voluntary administration passes control to the administrator, usually briefly. Liquidation ends trading except where the liquidator continues it to sell the business.",
        },
        {
          q: "What happens to my personal guarantees?",
          a: "Personal guarantees to landlords, suppliers and financiers sit outside every company process, which is why they belong on the table from the first conversation. Part of choosing a path is managing what it does and does not fix.",
        },
        {
          q: "What does getting help cost?",
          a: "The assessment and the first conversation are free. Beyond that, cost depends on the path, and we put numbers on it before you commit to anything. A credible plan includes its own cost, anything else is not a credible plan.",
        },
      ]}
      related={[
        { label: "Small business restructuring", href: "/small-business-restructuring" },
        { label: "ATO debt help", href: "/ato-debt-help" },
        { label: "Director Penalty Notices", href: "/director-penalty-notice" },
      ]}
    />
  );
}
