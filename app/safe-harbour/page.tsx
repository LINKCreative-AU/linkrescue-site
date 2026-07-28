import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Safe Harbour - Insolvent Trading Protection While You Turn Around",
  description:
    "Safe harbour protects directors from insolvent trading liability while they pursue a credible turnaround plan with proper advice. What it covers, the conditions, and how to enter it before the option expires.",
  alternates: { canonical: "/safe-harbour" },
};

export default function Page() {
  return (
    <InfoPage
      path="/safe-harbour"
      crumb="Safe harbour"
      eyebrow="Safe harbour"
      title="Legal cover for directors who fight for the business."
      mark="fight for"
      intro="Australia's insolvent trading rules can make you personally liable for debts the company incurs while insolvent. Safe harbour is the statutory exception: directors who start developing a credible turnaround plan, with the right advice and the right housekeeping, are protected while they work the plan. It rewards exactly the directors this site is built for, the ones who act early."
      serviceName="Safe harbour advisory"
      serviceDescription="Guidance for Australian company directors on entering and maintaining safe harbour protection from insolvent trading liability during a turnaround."
      sections={[
        {
          heading: "What safe harbour actually protects.",
          paragraphs: [
            "Safe harbour, section 588GA of the Corporations Act, suspends personal liability for insolvent trading on debts incurred while you pursue a course of action reasonably likely to lead to a better outcome for the company than immediate administration or liquidation.",
            "It is protection with edges. It covers insolvent trading exposure and nothing else: Director Penalty Notices, personal guarantees and unpaid super obligations all sit outside it. That is why safe harbour is a component of a rescue strategy, not the whole strategy.",
          ],
        },
        {
          heading: "The conditions, in plain language.",
          paragraphs: ["Protection starts when you start, and holds only while the housekeeping holds:"],
          bullets: [
            "You suspect insolvency and start developing a course of action promptly, waiting erodes the protection",
            "The plan is reasonably likely to produce a better outcome than immediate administration or liquidation",
            "You take advice from an appropriately qualified adviser who has the information to advise properly",
            "Employee entitlements, including super, are being paid when due",
            "Tax lodgments and records stay current, the same discipline the ATO rewards everywhere else",
            "The plan is documented and progress is minuted, protection you cannot evidence is protection you do not have",
          ],
        },
        {
          heading: "How it works in practice.",
          paragraphs: [
            "A genuine safe harbour engagement looks like a working turnaround: a restructuring plan with numbers behind it, a 13-week cash flow that gets updated, advisers in the room, and a board minute trail showing decisions made against the plan. The protection runs while the course of action runs, and ends when the plan is achieved, abandoned or stops being reasonably likely to deliver the better outcome.",
            "If the turnaround cannot get there, safe harbour hands off cleanly to the formal tools: small business restructuring or voluntary administration, entered on your timeline rather than a creditor's. Starting safe harbour early is what keeps those choices yours.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Do I need to be insolvent to use safe harbour?",
          a: "You need to suspect the company may be or may become insolvent, which is a lower bar than being insolvent. The protection is strongest when entered early, at suspicion rather than at crisis, because it covers debts incurred from when the course of action starts.",
        },
        {
          q: "Does safe harbour protect me from a Director Penalty Notice?",
          a: "No. Safe harbour covers insolvent trading liability only. Director penalties for PAYG, GST and super run on their own rules and their own clocks, and unpaid super also breaks a safe harbour condition. The two strategies have to run together, which is what the first call maps out.",
        },
        {
          q: "Who counts as an appropriately qualified adviser?",
          a: "The law looks at whether the adviser is fit for the company's size and situation: qualified, experienced in turnaround, independent enough to advise properly, and given real information to work with. For most small companies that means an accountant or advisor with restructuring capability, working alongside insolvency practitioners where needed.",
        },
        {
          q: "How long does safe harbour protection last?",
          a: "As long as the course of action is being genuinely pursued and remains reasonably likely to deliver a better outcome, with the employee entitlement and lodgment conditions holding throughout. It is not a set period, it is a discipline. Documented reviews keep both the plan and the protection alive.",
        },
      ]}
      related={[
        { label: "Alternatives to liquidation", href: "/liquidation-alternatives" },
        { label: "Small business restructuring", href: "/small-business-restructuring" },
        { label: "Voluntary administration", href: "/voluntary-administration" },
      ]}
    />
  );
}
