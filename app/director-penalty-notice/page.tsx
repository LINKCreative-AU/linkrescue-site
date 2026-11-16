import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";
import { DpnDeadline } from "@/components/DpnDeadline";
import { CONFIDENTIALITY, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Director Penalty Notice Help: Know Your 21 Days",
  description:
    "Got a director penalty notice? Check if it is lockdown or non-lockdown, count your 21 days and see what removes the penalty. Then get a priority call back.",
  alternates: { canonical: "/director-penalty-notice" },
};

function DpnCallToAction() {
  return (
    <div className="rounded-xl2 border-2 border-rescue/30 bg-rescue-light/25 p-6 sm:p-8">
      <p className="eyebrow guide-line-inline text-rescue">
        <span className="text-neutral-500">Director penalty notice help</span>
      </p>
      <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink">
        Have the notice in front of you? Call now.
      </h2>
      <p className="mt-3 leading-relaxed text-ink/75">
        Call {SITE.phone} and say the word DPN, and you will be put straight through rather than
        into the general queue. Would you rather we called you? Leave your number and a DPN goes to the top
        of the callback list. The first conversation is free.
      </p>
      <p className="mt-4 border-l-2 border-rescue pl-4 text-sm font-medium leading-relaxed text-ink/80">
        {CONFIDENTIALITY}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a href={SITE.phoneHref} className="btn btn-rescue">
          Call {SITE.phone} now
        </a>
        <Link href="/contact" className="btn btn-ghost">
          Ask for a priority call back
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <InfoPage
      path="/director-penalty-notice"
      crumb="Director Penalty Notices"
      eyebrow="Director penalty notice help"
      title="Got a director penalty notice? Your clock may already be ticking."
      mark="clock"
      intro="A Director Penalty Notice is the ATO's way of making you personally liable for the company's unpaid PAYG withholding, GST and super. What you can do about it depends on which type you hold and the date printed on it, so the first job is reading the notice properly. This page walks you through it, and we can read it with you today."
      serviceName="Director Penalty Notice response"
      serviceDescription="Urgent guidance for Australian company directors who have received a Director Penalty Notice from the ATO."
      afterHero={<DpnDeadline />}
      sections={[
        {
          heading: "What a director penalty notice is.",
          paragraphs: [
            "Company tax debts normally belong to the company. The director penalty regime is the exception: if the company does not pay certain amounts, each director becomes liable for a penalty equal to the unpaid amount, and the ATO can recover that penalty from you personally, from your own assets and income, rather than from the company.",
            "Before it can start proceedings to recover the penalty, the ATO has to give you a Director Penalty Notice and wait 21 days. That is the 21-day window people talk about. It runs from the date of the notice, and the notice is sent to your address on ASIC's register.",
            "A DPN can cover these company debts:",
          ],
          bullets: [
            "PAYG withholding: tax the company deducted from wages but did not pay to the ATO",
            "GST, along with luxury car tax and wine equalisation tax where they apply, brought into the regime from 1 April 2020",
            "Super guarantee charge: what the company owes when employee super was not paid in full and on time",
          ],
        },
        {
          heading: "Lockdown and non-lockdown: the difference that decides your options.",
          paragraphs: [
            "A non-lockdown DPN covers amounts the company reported on time but did not pay. Within 21 days of the date on the notice, the penalty is remitted if the company pays the debt, appoints a small business restructuring practitioner, appoints a voluntary administrator, or goes into liquidation. A payment plan is not on that list: it does not remit the penalty.",
            "A lockdown DPN covers amounts that were not reported on time. For PAYG withholding and GST, that means reported more than three months after the due date. For super, it means the super guarantee charge was not reported by the date the SGC statement was due. Here the penalty can only be removed by paying the debt. Restructuring, administration or liquidation does not remove it, so the 21 days buy you time to plan rather than a way out.",
            "One notice can include both lockdown and non-lockdown amounts for different periods. It needs to be read line by line, against the company's lodgment dates, before anything is decided.",
          ],
          table: {
            headers: ["", "Non-lockdown DPN", "Lockdown DPN"],
            rows: [
              ["When it applies", "Company reported on time but did not pay", "PAYG withholding or GST reported more than 3 months late, or super guarantee charge not reported by its due date"],
              ["The 21 days", "Your window to remit the penalty", "Time before recovery can start, not a way out"],
              ["What removes the penalty", "Pay the debt, or appoint an SBR practitioner, administrator or liquidator within the 21 days", "Paying the debt"],
              ["Does a payment plan help?", "No, a plan does not remit the penalty", "No, a plan does not remit the penalty"],
              ["The right first move", "Get the notice read today, every option is live", "Strategy on what to pay, in what order, from what source"],
            ],
          },
        },
        {
          heading: "What to do now.",
          paragraphs: ["The order of operations matters more here than anywhere else on this site:"],
          bullets: [
            "Find the notice and check the date printed on it. The 21 days run from that date, even if the letter sat in a mailbox.",
            "Work out which amounts are lockdown and which are not. The notice and the company's lodgment history tell you.",
            "Check your address on ASIC's register and the company's position in ATO online services, so you know nothing else is on its way to an old address.",
            "Do not resign as director expecting it to help. Resignation does not remove liability for existing penalties.",
            "Do not rely on a payment plan to fix it. A plan deals with the company's debt, not your personal penalty.",
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
        {
          heading: "If the 21 days have already passed.",
          paragraphs: [
            "You still have moves, they are just different moves. Statutory defences exist for directors who were ill, who took all reasonable steps, or who could not take part in management, and they turn on evidence. The size of the penalty, your personal asset position and the company's future all shape what a negotiation with the ATO looks like, and the ATO negotiates with directors who engage. What you do not have is time to spend deciding alone. An expired clock makes the conversation more urgent, not less worth having.",
          ],
        },
      ]}
      closing={<DpnCallToAction />}
      faqs={[
        {
          q: "How long do I have to respond to a Director Penalty Notice?",
          a: "Generally 21 days from the date printed on the notice. For non-lockdown amounts, that is the window in which the penalty can be remitted. For lockdown amounts, the liability has already locked in and the 21 days are time to plan how the debt gets dealt with. Either way, the useful window is now.",
        },
        {
          q: "What is the difference between a lockdown and a non-lockdown DPN?",
          a: "It comes down to reporting. If the company reported the amounts on time but did not pay, the DPN is non-lockdown and paying the debt or appointing a restructuring practitioner, administrator or liquidator within 21 days remits the penalty. If PAYG withholding or GST was reported more than three months late, or the super guarantee charge was not reported on time, the DPN is lockdown and only payment removes the penalty.",
        },
        {
          q: "Can I avoid personal liability under a DPN?",
          a: "Under a non-lockdown DPN, the penalty can be remitted if, within the 21 days, the company pays the debt or enters small business restructuring, voluntary administration or liquidation. Statutory defences also exist in limited circumstances, such as illness or taking all reasonable steps. What fits depends on your facts, and no outcome is guaranteed.",
        },
        {
          q: "Does an ATO payment plan stop a Director Penalty Notice?",
          a: "No. A payment plan does not remit director penalties, and the ATO can issue a DPN while a plan is running. If you hold a DPN, the response to the notice comes first and the payment plan second.",
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
        { label: "Small business restructuring", href: "/small-business-restructuring" },
        { label: "Voluntary administration", href: "/voluntary-administration" },
        { label: "ATO debt help", href: "/ato-debt-help" },
        { label: "ATO payment plan calculator", href: "/ato-payment-plan-calculator" },
      ]}
    />
  );
}
