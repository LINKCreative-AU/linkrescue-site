import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "What It Costs - Straight Numbers, No Surprises",
  description:
    "The first conversation is free. After that, every path has a cost and you deserve to see it before you commit. Indicative ranges for ATO negotiations, small business restructuring, safe harbour and voluntary administration.",
  alternates: { canonical: "/what-it-costs" },
};

// DRAFT cost bands - market-calibrated placeholders in the linkadvisors fee
// estimator tradition. TODO James/Kyle/David: review and confirm every band
// before paid traffic.

export default function Page() {
  return (
    <InfoPage
      path="/what-it-costs"
      crumb="What it costs"
      eyebrow="What it costs"
      title="Straight numbers, before you commit to anything."
      mark="Straight numbers"
      intro="Nobody in distress needs a fee surprise. The first conversation is free and carries no obligation. Beyond that, every path has a cost, and a credible rescue plan includes its own cost from day one. The ranges below are indicative and get confirmed as a fixed quote before you say yes to anything."
      serviceName="Business rescue engagement pricing"
      serviceDescription="Indicative pricing for business rescue services: ATO negotiations, small business restructuring support, safe harbour advisory and formal appointments."
      sections={[
        {
          heading: "The free part, and what it includes.",
          paragraphs: [
            "The assessment, the tools on this site and the first call cost nothing. On that call you get a read on your position, the options genuinely open to you, and the order to take them in. If the sensible answer is a payment plan you can arrange yourself, we say so and you pay nothing.",
          ],
        },
        {
          heading: "Indicative ranges by path.",
          paragraphs: [
            "Real quotes depend on the state of your books, the number of creditors and how contested things are. These ranges are a guide so nothing later is a surprise:",
          ],
          table: {
            headers: ["Path", "Indicative range", "What drives the price"],
            rows: [
              ["ATO engagement: payment plan + remission case", "$2k to $6k", "Lodgment backlog, evidence pack, negotiation rounds"],
              ["Lodgment catch-up + books rebuild", "$3k to $15k", "How many periods behind, state of the records"],
              ["Safe harbour engagement", "$5k to $15k initial", "Turnaround plan depth, ongoing review cadence"],
              ["Small business restructuring", "$20k to $35k all-in", "Practitioner fees plus proposal preparation, paid in stages"],
              ["Voluntary administration", "$30k+", "Set by the administrator and approved by creditors"],
            ],
          },
        },
        {
          heading: "How paying for a rescue actually works.",
          paragraphs: [
            "Fees are staged and agreed in writing before each stage starts, so you never fund the whole journey up front. Where a restructure compromises debt at 20 to 40 cents in the dollar, the fee is a fraction of the debt that gets written off, which is the arithmetic that matters. And where the numbers say a path cannot pay for itself, we tell you that before you spend a dollar on it.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Why do you publish prices when nobody else does?",
          a: "Because fee fear keeps directors from getting help early, and late help costs more. Publishing ranges means you walk into the first call knowing roughly what each path costs, and the exact quote is fixed in writing before anything starts.",
        },
        {
          q: "Can fees be paid from the business rather than personally?",
          a: "Usually the company pays for its own rescue, and staged billing is designed around real cash flow. Where the company cannot fund a step, that is a fact that belongs in the plan, not a surprise after it. Payment timing is agreed before each stage.",
        },
        {
          q: "Is the first call a sales call?",
          a: "It is a triage call. You leave it knowing your options and their order whether or not you engage us, and if the right answer is something you can do yourself, that is what you hear.",
        },
        {
          q: "Are these prices fixed quotes?",
          a: "No, they are indicative ranges. Your fixed quote comes in writing after the first call, before anything begins, and it does not move without your agreement on a changed scope.",
        },
      ]}
      related={[
        { label: "Small business restructuring", href: "/small-business-restructuring" },
        { label: "ATO payment plans", href: "/ato-payment-plan" },
        { label: "Safe harbour", href: "/safe-harbour" },
      ]}
    />
  );
}
