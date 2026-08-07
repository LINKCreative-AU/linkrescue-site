import type { Metadata } from "next";
import Link from "next/link";
import { Assessment } from "@/components/Assessment";
import { SectionHead } from "@/components/SectionHead";
import { Icon } from "@/components/Icons";
import { JsonLd, faqSchema } from "@/components/Schema";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { CONFIDENTIALITY, DISCLAIMER, FOUNDER_QUOTE, SITE, TEAM } from "@/lib/site";
import jamesPhoto from "@/public/team/james.jpg";
import jamesQuotePhoto from "@/public/team/james-quote.jpg";
import kylePhoto from "@/public/team/kyle.jpg";
import davidPhoto from "@/public/team/david.jpg";

// Static imports so next/image optimises them; keyed by name so lib/site.ts
// stays the single source of truth for who appears.
const PHOTOS: Record<string, StaticImageData> = {
  "James Webb": jamesPhoto,
  "Kyle Macmillan": kylePhoto,
  "David Evans": davidPhoto,
};

export const metadata: Metadata = {
  title: "Business Rescue Assessment | ATO Debt & Director Penalty Help",
  description:
    "You can see where your business stands in two minutes. A free, confidential rescue assessment covering ATO debt, director penalties, creditor pressure and solvency, with an instant result and a clear next step.",
  alternates: { canonical: "/" },
};

const SIGNS = [
  { icon: Icon.clock, text: "The ATO debt keeps rolling forward and the payment plan keeps slipping" },
  { icon: Icon.alert, text: "Letters of demand, default notices or a statutory demand have arrived" },
  { icon: Icon.doc, text: "There is ATO mail you have not opened because you know what is in it" },
  { icon: Icon.lock, text: "Super or PAYG is behind, which is where director penalties start" },
  { icon: Icon.trendingUp, text: "Sales are fine but the cash never catches up to the debt" },
  { icon: Icon.users, text: "You are carrying it alone and nobody around you knows the full picture" },
];

const PATHS = [
  {
    title: "ATO debt help",
    text: "Most ATO debt positions can be engaged with, and engagement changes how the ATO treats you. You get the full playbook, from lodgments to remission to restructure.",
    href: "/ato-debt-help",
  },
  {
    title: "ATO payment plans",
    text: "The ATO accepts plans it believes in: realistic instalments built from a real cash flow, not hope. You get one that holds, or a straight answer that a plan is the wrong tool.",
    href: "/ato-payment-plan",
  },
  {
    title: "Director Penalty Notice response",
    text: "A DPN runs on fixed clocks and the response depends on the notice type. You get the notice read properly and the options laid out the same day.",
    href: "/director-penalty-notice",
  },
  {
    title: "Small business restructuring",
    text: "Companies with debts under $1 million can restructure while you stay in control, often compromising debt to a fraction of its face value.",
    href: "/small-business-restructuring",
  },
  {
    title: "Voluntary administration",
    text: "Breathing space with a deadline attached: a moratorium, an independent administrator, and a creditor vote on a rescue deal. Heavier, and sometimes exactly right.",
    href: "/voluntary-administration",
  },
  {
    title: "Alternatives to liquidation",
    text: "Liquidation is one option among several, and rarely the first. You see the full menu, from informal workouts to safe harbour to formal appointments.",
    href: "/liquidation-alternatives",
  },
];

const FAQS = [
  {
    q: "Is the assessment free and confidential?",
    a: `Yes. The six questions are free, the result is instant and nothing you enter is shared outside the LINK Rescue team. ${CONFIDENTIALITY} We ask for an email up front so your result is saved and a human can check in, and your business name if you want to give it - both can be skipped, and adding your phone number for a callback stays your call.`,
  },
  {
    q: "Will you tell me to liquidate my company?",
    a: "No option is pre-decided. Liquidation is one path among several, and for most businesses that come to us earlier options exist: ATO payment plans, informal workouts, safe harbour protection or small business restructuring. You get the full picture and the trade-offs of each.",
  },
  {
    q: "What happens after I leave my details?",
    a: "The right person calls you back, within one business day for green and amber results, the same business day for red results, and as a priority for anything involving a Director Penalty Notice. The call is confidential, free and carries no obligation.",
  },
  {
    q: "Are you liquidators?",
    a: "We are advisors backed by the LINK group of accounting and advisory businesses. Where a formal appointment is the right path, registered insolvency practitioners we work alongside handle the appointment, and we stay in your corner through it.",
  },
  {
    q: "Is it too late if I have already received a Director Penalty Notice?",
    a: "It is not too late to get advice, and speed matters. Non-lockdown DPNs generally give you 21 days from the date on the notice to act before personal liability locks in, so a DPN result goes to the top of our callback queue.",
  },
  {
    q: "Will talking to you make things worse with the ATO?",
    a: "The opposite is the pattern. The ATO responds better to directors who engage early with a credible plan than to silence. Getting advice is confidential and does not notify the ATO or your creditors of anything.",
  },
];

export default function Home() {
  return (
    <main>
      <JsonLd data={faqSchema(FAQS)} />

      {/* Hero: the assessment IS the hero feature */}
      <section className="border-b border-line bg-cloud/50">
        <div className="container-x grid items-start gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div>
            <p className="eyebrow guide-line-inline text-rescue">
              <span className="text-neutral-500">Business rescue assessment</span>
            </p>
            <h1 className="mt-5 font-display text-4xl font-normal leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Under pressure? See where your business stands{" "}
              <span className="marker">in two minutes</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink/75">
              Tell us your business, then answer six questions about cash flow,
              ATO debt and creditor pressure. You get an instant result and a
              clear next step. Confidential, free and built for directors who
              want options while they still have them.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-ink/60">
              <span className="inline-flex items-center gap-2">
                <Icon.shieldCheck className="h-5 w-5 text-rescue" /> Confidential
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon.clock className="h-5 w-5 text-rescue" /> Two minutes
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon.bolt className="h-5 w-5 text-rescue" /> Instant result
              </span>
            </div>
            <p className="mt-7 text-sm text-ink/60">
              Prefer to talk it through now?{" "}
              <a href={SITE.phoneHref} className="font-semibold text-rescue hover:text-rescue-dark">
                Call {SITE.phone}
              </a>
            </p>
          </div>

          <div id="assessment">
            <Assessment />
          </div>
        </div>
      </section>

      {/* Comfort strip: the first thing after the hero is reassurance, not a pitch */}
      <section className="border-b border-line bg-rescue-light/25 py-12 lg:py-16">
        <div className="container-x">
          <h2 className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            First, breathe. <span className="marker">This is fixable</span>, and you found the
            right place to start.
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "No judgement, at all",
                text: "Tax debt and cash pressure happen to good businesses run by good people. We have seen every version of this, and you will be talked to like a human, never a case number.",
              },
              {
                title: "Nothing happens without you",
                text: `${CONFIDENTIALITY} It notifies nobody, not the ATO, not your bank, not your creditors. Every decision stays yours, at every step.`,
              },
              {
                title: "You are not carrying this alone",
                text: "From the first call there is a team beside you, backed by the LINK group. Most directors tell us the weight lifts the day someone else finally knows the full picture.",
              },
            ].map((c) => (
              <div key={c.title}>
                <p className="guide-line text-rescue text-sm font-semibold uppercase tracking-wider">
                  {c.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{c.text}</p>
              </div>
            ))}
          </div>

          {/* Founder quote: a face and a voice before any selling */}
          <figure className="mt-10 flex flex-col items-start gap-6 rounded-xl2 border border-line bg-white p-7 sm:flex-row sm:items-center sm:p-8">
            {/* Self-circled asset with rescue-tint stripes - no rounding needed */}
            <Image
              src={jamesQuotePhoto}
              alt={FOUNDER_QUOTE.name}
              width={112}
              height={112}
              className="h-28 w-28 shrink-0"
            />
            <div>
              <blockquote className="font-display text-lg font-bold leading-snug tracking-tight text-ink sm:text-xl">
                “{FOUNDER_QUOTE.text}”
              </blockquote>
              <figcaption className="mt-3 text-sm text-ink/60">
                <span className="font-semibold text-ink">{FOUNDER_QUOTE.name}</span> ·{" "}
                {FOUNDER_QUOTE.role}
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      {/* The signs */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <SectionHead
            eyebrow="Sound familiar"
            title="The pressure has patterns."
            mark="patterns"
            intro="Directors rarely arrive here overnight. The signals below build for months, and each one you recognise is a reason to look now rather than later."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SIGNS.map((s) => (
              <div key={s.text} className="rounded-xl2 border border-line bg-white p-6">
                <s.icon className="h-6 w-6 text-rescue" />
                <p className="mt-4 text-sm text-ink/75">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-cloud/50 py-16 lg:py-24">
        <div className="container-x">
          <SectionHead
            eyebrow="How it works"
            title="Three steps, no runaround."
            mark="no runaround"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              {
                icon: Icon.clipboardCheck,
                title: "Take the assessment",
                text: "Six questions, two minutes, instant result. You see how urgent your situation looks and what the sensible next moves are.",
              },
              {
                icon: Icon.phone,
                title: "Have a confidential call",
                text: "The right person calls you back, matched to your result's urgency. You talk through the real numbers with someone who has seen it before, judgement-free.",
              },
              {
                icon: Icon.compass,
                title: "Get a path forward",
                text: "You leave with a plan: the options open to you, the order to take them in, and who does what. You stay in control of the decision.",
              },
            ].map((s, i) => (
              <div key={s.title} className="rounded-xl2 border border-line bg-white p-7">
                <div className="flex items-center justify-between">
                  <s.icon className="h-7 w-7 text-rescue" />
                  <span className="section-no">0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">{s.title}</h3>
                <p className="mt-3 text-sm text-ink/75">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paths */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <SectionHead
            eyebrow="The options"
            title="Liquidation is a last resort, not a starting point."
            mark="last resort"
            intro="The earlier you act, the more of these doors are open. Every path below has saved businesses that looked finished from the inside."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {PATHS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group rounded-xl2 border border-line bg-white p-7 transition hover:border-rescue"
              >
                <h3 className="font-display text-xl font-semibold text-ink">{p.title}</h3>
                <p className="mt-3 text-sm text-ink/75">{p.text}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-rescue group-hover:text-rescue-dark">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>

          {/* Free tools promo */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Link
              href="/ato-payment-plan-calculator"
              className="group rounded-xl2 border border-rescue/25 bg-rescue-light/25 p-7 transition hover:border-rescue"
            >
              <p className="eyebrow !text-rescue">Free tool</p>
              <h3 className="mt-6 font-display text-xl font-semibold text-ink">
                ATO payment plan calculator
              </h3>
              <p className="mt-3 text-sm text-ink/75">
                Two sliders show what your tax debt costs to carry, and whether your payment
                clears it or just feeds the interest.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-rescue group-hover:text-rescue-dark">
                Run the numbers →
              </span>
            </Link>
            <Link
              href="/am-i-insolvent"
              className="group rounded-xl2 border border-rescue/25 bg-rescue-light/25 p-7 transition hover:border-rescue"
            >
              <p className="eyebrow !text-rescue">Free tool</p>
              <h3 className="mt-6 font-display text-xl font-semibold text-ink">
                Am I insolvent? The 12-sign check
              </h3>
              <p className="mt-3 text-sm text-ink/75">
                The warning signs courts and ASIC actually weigh, turned into a two-minute
                self-check. Answers never leave the page.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-rescue group-hover:text-rescue-dark">
                Check the signs →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why LINK */}
      <section className="bg-ink py-16 text-white lg:py-24">
        <div className="container-x grid items-start gap-10 lg:grid-cols-2">
          <SectionHead
            eyebrow="Why LINK Rescue"
            title="Growth accountants, with a rescue toolkit."
            dark
            intro="LINK is an accounting firm, a bookkeeping practice and a marketing agency, all started by James. That matters because a rescue is more than a debt deal: the books, the lodgments, the tax and the revenue all have to work again, and one team can pull every lever."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Books up to speed",
                text: "Messy books hide your real position and stall every negotiation. The LINK bookkeeping team rebuilds them fast, so every decision runs on facts.",
              },
              {
                title: "Lodgments up to scratch",
                text: "Unlodged returns block payment plans, restructuring and safe harbour alike. We catch you up, and save you as much tax as the law allows on the way through.",
              },
              {
                title: "Marketing that finds the leak",
                text: "Debt is usually a revenue story too. The LINK marketing team looks at where the sales went and what brings them back: offer, pricing, pipeline.",
              },
              {
                title: "Protection while you fix it",
                text: "While the business heals, the law and specialist practitioners keep you safe: director penalties handled, safe harbour running, creditors managed.",
              },
            ].map((c) => (
              <div key={c.title}>
                <p className="guide-line text-rescue-bright text-sm font-semibold uppercase tracking-wider">
                  {c.title}
                </p>
                <p className="mt-3 text-sm text-white/70">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-16 lg:py-24">
        <div className="container-x">
          <SectionHead
            eyebrow="Who you talk to"
            title="Real people, on the phone, fast."
            mark="Real people"
            intro="No call centres and no forms that vanish. A growth accountant, an insolvency lawyer and a restructuring specialist: your situation gets all three lenses, and your enquiry lands with a person, not a queue."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {TEAM.map((t) => (
              <div key={t.name} className="rounded-xl2 border border-line bg-white p-7">
                {PHOTOS[t.name] ? (
                  <Image
                    src={PHOTOS[t.name]}
                    alt={t.name}
                    width={80}
                    height={80}
                    className="mb-5 h-20 w-20 rounded-full bg-cloud object-cover"
                  />
                ) : (
                  // TODO headshot from David - grey placeholder holds the layout
                  <div className="mb-5 h-20 w-20 rounded-full bg-cloud" aria-hidden />
                )}
                <h3 className="font-display text-lg font-semibold text-ink">{t.name}</h3>
                <p className="text-sm font-semibold text-rescue">{t.role}</p>
                <p className="mt-3 text-sm text-ink/75">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track record: real aggregate outcomes + group reviews.
          TODO James: swap in named case studies when the SBR client stories are pulled together. */}
      <section className="bg-cloud/50 py-16 lg:py-24">
        <div className="container-x">
          <SectionHead
            eyebrow="The track record"
            title="Real rescues. Real reviews."
            mark="Real rescues"
            intro="LINK Rescue is a new front door on a group that has done this work for years."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              {
                stat: "20 to 40c",
                label: "in the dollar",
                text: "Typical accepted plans in small business restructures we have supported, with the balance written off on completion.",
              },
              {
                stat: "$200k to $500k",
                label: "typical debts walking in",
                text: "The businesses we help are not lost causes. They are viable operations buried under tax debt that built up faster than it could clear.",
              },
              {
                stat: "520+ reviews",
                label: "4.9 average across the LINK group",
                text: "The accountants behind this site are the same team clients rate on Google every week, year after year.",
              },
            ].map((s) => (
              <div key={s.stat} className="rounded-xl2 border border-line bg-white p-7">
                <p className="font-display text-3xl font-semibold tracking-tight text-rescue">
                  {s.stat}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{s.label}</p>
                <p className="mt-3 text-sm text-ink/75">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              {
                quote:
                  "Kelly has taken immense pressure off my husband and myself. We have confidence, going forward, that we will be compliant and certain of the financial situation of our business.",
                tag: "Google review · LINK Advisors",
              },
              {
                quote:
                  "Since working with LINK my business is thriving. I no longer have to chase corrections or beg for work to be done, everything is handled professionally and promptly.",
                tag: "Google review · LINK Advisors",
              },
              {
                quote:
                  "They took the stress out of the process and made everything simple.",
                tag: "Google review · LINK Advisors",
              },
            ].map((r) => (
              <figure key={r.quote} className="rounded-xl2 border border-line bg-white p-7">
                <div className="flex gap-0.5 text-rescue" aria-label="5 stars">
                  {"★★★★★"}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-ink/75">
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-3 text-xs font-semibold text-ink/50">{r.tag}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-ink/45">
            Plan outcomes are historical results from matters the LINK team has
            supported, every situation differs and past results are not a
            promise. Reviews relate to services across the LINK group.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cloud/50 py-16 lg:py-24">
        <div className="container-x">
          <SectionHead eyebrow="Questions" title="Asked every week." />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-xl2 border border-line bg-white p-7">
                <h3 className="font-display text-lg font-semibold text-ink">{f.q}</h3>
                <p className="mt-3 text-sm text-ink/75">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <div className="rescue-gradient rounded-xl2 p-10 text-white sm:p-14">
            <h2 className="max-w-2xl font-display text-3xl font-normal leading-tight tracking-tight sm:text-4xl">
              The best time to check was six months ago. The second best time is
              now.
            </h2>
            <p className="mt-4 max-w-xl text-white/85">
              Two minutes, six questions, instant result. You lose nothing by
              knowing where you stand.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/assessment" className="btn bg-white text-rescue-dark hover:bg-white/90">
                Start the assessment
              </a>
              <a
                href={SITE.phoneHref}
                className="btn border border-white/40 text-white hover:border-white"
              >
                Call {SITE.phone}
              </a>
            </div>
          </div>
          <p className="mt-8 max-w-4xl text-xs leading-relaxed text-ink/45">{DISCLAIMER}</p>
        </div>
      </section>
    </main>
  );
}
