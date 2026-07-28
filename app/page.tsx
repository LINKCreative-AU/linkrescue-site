import type { Metadata } from "next";
import Link from "next/link";
import { Assessment } from "@/components/Assessment";
import { SectionHead } from "@/components/SectionHead";
import { Icon } from "@/components/Icons";
import { JsonLd, faqSchema } from "@/components/Schema";
import { DISCLAIMER, SITE, TEAM } from "@/lib/site";

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
    title: "ATO payment plans and debt negotiation",
    text: "Most ATO debt positions can be engaged with, and engagement changes how the ATO treats you. You get a realistic plan built on real numbers, not hope.",
    href: "/ato-debt-help",
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
    title: "Alternatives to liquidation",
    text: "Liquidation is one option among several, and rarely the first. You see the full menu, from informal workouts to safe harbour to formal appointments.",
    href: "/liquidation-alternatives",
  },
];

const FAQS = [
  {
    q: "Is the assessment really free and confidential?",
    a: "Yes. The six questions are free, the result is instant and nothing you enter is shared outside the LINK Rescue team. You see your result before we ask for any contact details, and leaving your details is your call.",
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
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Under pressure? See where your business stands{" "}
              <span className="marker">in two minutes</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink/70">
              You answer six questions about cash flow, ATO debt and creditor
              pressure. You get an instant result and a clear next step, before
              anyone asks for your details. Confidential, free and built for
              directors who want options while they still have them.
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

      {/* The signs */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <SectionHead
            no="01"
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
            no="02"
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
                <h3 className="mt-5 font-display text-xl font-extrabold text-ink">{s.title}</h3>
                <p className="mt-3 text-sm text-ink/70">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paths */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <SectionHead
            no="03"
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
                <h3 className="font-display text-xl font-extrabold text-ink">{p.title}</h3>
                <p className="mt-3 text-sm text-ink/70">{p.text}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-rescue group-hover:text-rescue-dark">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why LINK */}
      <section className="bg-ink py-16 text-white lg:py-24">
        <div className="container-x grid items-start gap-10 lg:grid-cols-2">
          <SectionHead
            no="04"
            eyebrow="Why LINK Rescue"
            title="Advisors first. Judgement never."
            dark
            intro={SITE.group.line}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Backed by LINK",
                text: "Accounting, bookkeeping, finance, wealth and property under one group. Whatever the path, the team around you already exists.",
              },
              {
                title: "You stay in control",
                text: "You get options and trade-offs, laid out in plain language. The decision stays yours at every step.",
              },
              {
                title: "Early beats urgent",
                text: "Most rescue options reward speed. A conversation this week keeps doors open that a statutory demand closes.",
              },
              {
                title: "Confidential by default",
                text: "Talking to us notifies nobody. Not the ATO, not your bank, not your creditors, not your competitors.",
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
            no="05"
            eyebrow="Who you talk to"
            title="Real people, on the phone, fast."
            mark="Real people"
            intro="No call centres and no forms that vanish. Your enquiry lands with one of these three."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {TEAM.map((t) => (
              <div key={t.name} className="rounded-xl2 border border-line bg-white p-7">
                {/* TODO real headshots - grey placeholder holds the layout */}
                <div className="mb-5 h-20 w-20 rounded-full bg-cloud" aria-hidden />
                <h3 className="font-display text-lg font-extrabold text-ink">{t.name}</h3>
                <p className="text-sm font-semibold text-rescue">{t.role}</p>
                <p className="mt-3 text-sm text-ink/70">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cloud/50 py-16 lg:py-24">
        <div className="container-x">
          <SectionHead no="06" eyebrow="Questions" title="Asked every week." />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-xl2 border border-line bg-white p-7">
                <h3 className="font-display text-lg font-extrabold text-ink">{f.q}</h3>
                <p className="mt-3 text-sm text-ink/70">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <div className="rescue-gradient rounded-xl2 p-10 text-white sm:p-14">
            <h2 className="max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
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
