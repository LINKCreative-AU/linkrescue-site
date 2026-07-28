import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Director Penalty Notice (DPN) Help - Act Within 21 Days",
  description:
    "You generally have 21 days from the date on a non-lockdown Director Penalty Notice before personal liability locks in. What DPNs mean, the two types, and the responses that protect you, explained fast.",
  alternates: { canonical: "/director-penalty-notice" },
};

export default function Page() {
  return (
    <InfoPage
      path="/director-penalty-notice"
      crumb="Director Penalty Notices"
      eyebrow="Director Penalty Notices"
      title="A DPN runs on a clock. Yours may already be ticking."
      mark="clock"
      intro="A Director Penalty Notice is the ATO's mechanism for making you personally liable for the company's unpaid PAYG withholding, GST and super. The response depends on which type you hold and the date printed on it, so the first job is reading the notice properly."
      serviceName="Director Penalty Notice response"
      serviceDescription="Urgent guidance for Australian company directors who have received a Director Penalty Notice from the ATO."
      sections={[
        {
          heading: "The two types, and why the difference matters.",
          paragraphs: [
            "A non-lockdown DPN is issued when the company reported its obligations on time but did not pay. You generally have 21 days from the date on the notice, not the day it arrived, to act. Within that window the penalty can be remitted if the company pays the debt or enters a formal process such as small business restructuring, voluntary administration or liquidation.",
            "A lockdown DPN is issued when the company's lodgments were more than three months late. The personal liability has already locked in, and paying the debt is the path that removes it. That makes the surrounding strategy, what to pay, in what order, from what source, the conversation that matters.",
            "Directors often hold both types across different periods at once. The notice needs to be read line by line before anything is decided.",
          ],
        },
        {
          heading: "What to do in the first 24 hours.",
          paragraphs: ["The order of operations matters more here than anywhere else on this site:"],
          bullets: [
            "Find the notice and check the issue date. The 21-day clock on a non-lockdown DPN runs from that date, even if the letter sat in a mailbox.",
            "Do not resign as director expecting it to help. Resignation does not remove liability for existing penalties.",
            "Do not pay anyone anything large until you have advice. Payments made under pressure can be the wrong payments.",
            "Get the notice in front of us today. DPN enquiries go to the top of the callback queue, and the assessment flags them automatically.",
          ],
        },
        {
          heading: "The mail you have not opened counts too.",
          paragraphs: [
            "The ATO sends DPNs to your address on record with ASIC. A notice you never opened, or that went to an old address, is still running its clock. If there is ATO mail you have been avoiding, opening it with someone beside you is a better plan than not opening it at all.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How long do I have to respond to a Director Penalty Notice?",
          a: "For a non-lockdown DPN, generally 21 days from the date printed on the notice. For a lockdown DPN, the liability has already locked in and the question becomes how the debt gets dealt with. Either way, the useful window is now.",
        },
        {
          q: "Can I avoid personal liability under a DPN?",
          a: "Under a non-lockdown DPN, the penalty can be remitted if, within the 21 days, the company pays the debt or enters small business restructuring, voluntary administration or liquidation. Statutory defences also exist in limited circumstances, such as illness or taking all reasonable steps. What fits depends on your facts, and no outcome is guaranteed.",
        },
        {
          q: "Does resigning as a director cancel a DPN?",
          a: "No. Resignation does not remove liability for penalties that relate to your time as director, and new directors can become liable for existing company debts after a grace period. Decisions about directorships need advice, not instinct.",
        },
        {
          q: "I think a DPN may have gone to an old address. What now?",
          a: "The notice is generally effective when sent to your address on record, whether or not you saw it. Check your ASIC address today, check the ATO portal for the company's position, and treat the situation as urgent until you know otherwise.",
        },
      ]}
      related={[
        { label: "ATO debt help", href: "/ato-debt-help" },
        { label: "Small business restructuring", href: "/small-business-restructuring" },
        { label: "Alternatives to liquidation", href: "/liquidation-alternatives" },
      ]}
    />
  );
}
