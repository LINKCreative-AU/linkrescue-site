import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icons";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { DISCLAIMER, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact LINK Rescue - Confidential, Free, No Obligation",
  description:
    "Talk to someone about ATO debt, a director penalty notice or creditor pressure. Call 07 3899 8311, ask for a call back, or run the free six-question assessment first. Confidential and no obligation.",
  alternates: { canonical: "/contact" },
};

// The page for people who are not ready to fill in a funnel - they want to
// talk to a person. Three routes, ordered by how much commitment each asks
// for: call now (none, instant), ask for a call back (two fields), run the
// assessment (two minutes, gives us a head start).
//
// The assessment is deliberately last rather than first. Someone who has
// navigated to "contact" has already decided they want a human; putting a
// questionnaire in front of that is answering a question they did not ask.

const FAQS = [
  {
    q: "Does it cost anything to call?",
    a: "No. The first conversation is free and carries no obligation. If the sensible answer is something you can arrange yourself - a payment plan you qualify for without help, for instance - we will say so and you pay nothing.",
  },
  {
    q: "Is what I tell you confidential?",
    a: "Yes. What you tell us stays with the LINK Rescue team. We are not going to contact the ATO, your bank or your creditors off the back of a phone call - nothing happens without your say-so.",
  },
  {
    q: "I have a director penalty notice with a date on it. What do I do right now?",
    a: "Call 07 3899 8311 and say the word DPN, and you will be put straight through rather than into the general queue. The options available to a director depend on whether the notice is lockdown or non-lockdown and on the date it was issued, so the date matters more than anything else you can tell us.",
  },
  {
    q: "How quickly will someone get back to me?",
    a: "A director penalty notice or a deadline goes to the top of the queue. Anything urgent is called back the same business day, and everything else within one business day.",
  },
  {
    q: "Do I have to run the assessment before I can talk to someone?",
    a: "No. The assessment is there because some people would rather see where they stand before they say it out loud, and it gives whoever calls you a head start. If you would rather just talk, call or use the form and skip it entirely.",
  },
  {
    q: "Will you tell me to liquidate?",
    a: "Only if that is genuinely the answer, and it usually is not the first one. Most of what we do sits well before that point: ATO negotiations, catching up lodgments, restructuring, safe harbour. Liquidation is one option on a list, not the destination.",
  },
];

const ROUTES = [
  {
    icon: Icon.phone,
    eyebrow: "Fastest",
    title: "Call us",
    body: "Straight to a person. If you have a notice with a date on it, say the word DPN and you will be put through ahead of the queue.",
  },
  {
    icon: Icon.clipboardCheck,
    eyebrow: "Two fields",
    title: "Ask us to call you",
    body: "A name and a number is all we need. Tell us how urgent it is and the right person calls you back, matched to that.",
  },
  {
    icon: Icon.compass,
    eyebrow: "Two minutes",
    title: "Run the assessment first",
    body: "Six questions and an instant read on how urgent your position looks. Some people would rather see it before they say it out loud.",
  },
];

export default function ContactPage() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          faqSchema(FAQS),
        ]}
      />

      {/* Hero: the phone number is the hero, because for the urgent half of
          this audience it is the only thing on the page that matters. */}
      <section className="border-b border-line bg-white">
        <div className="container-x py-14 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow guide-line-inline text-rescue">
              <span className="text-neutral-500">Contact</span>
            </p>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl">
              Talk to someone who has <span className="marker">seen this before</span>.
            </h1>
            <p className="mt-5 text-lg text-ink/75">
              Most people who call us have been putting it off for months. The
              conversation is free, confidential and carries no obligation, and
              nobody on this end is going to be shocked by your numbers.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href={SITE.phoneHref} className="btn btn-rescue text-base">
                Call {SITE.phone}
              </a>
              <a href="#call-back" className="btn btn-ghost text-base">
                Ask us to call you
              </a>
            </div>

            <p className="mt-5 text-sm text-ink/55">
              Level 1, 57 Berwick Street, Fortitude Valley QLD 4006 · we work
              with directors Australia-wide, and most of this happens by phone.
            </p>
          </div>
        </div>
      </section>

      {/* Three routes in, ordered by commitment. */}
      <section className="bg-cloud/50 py-14 lg:py-20">
        <div className="container-x">
          <div className="grid gap-5 lg:grid-cols-3">
            {ROUTES.map((r, i) => (
              <div key={r.title} className="rounded-xl2 border border-line bg-white p-7">
                <div className="flex items-center justify-between">
                  <r.icon className="h-7 w-7 text-rescue" />
                  <span className="section-no">0{i + 1}</span>
                </div>
                <p className="eyebrow mt-5">{r.eyebrow}</p>
                <h2 className="mt-2 font-display text-xl font-extrabold text-ink">{r.title}</h2>
                <p className="mt-3 text-sm text-ink/75">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The form, and the assessment offered beside it rather than instead. */}
      <section id="call-back" className="scroll-mt-20 py-14 lg:py-20">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <ContactForm />

            <div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                What happens after you get in touch.
              </h2>
              <ol className="mt-6 space-y-5">
                {[
                  {
                    t: "Someone calls you back",
                    d: "Matched to how urgent your situation is. A notice with a date on it goes to the top of the queue, ahead of everything else.",
                  },
                  {
                    t: "A confidential conversation",
                    d: "You talk through the real numbers with someone who has seen it before, judgement-free. No sales pitch, and nothing leaves the room.",
                  },
                  {
                    t: "You get a path forward",
                    d: "The options genuinely open to you, the order to take them in, and who does what. If one of them costs nothing, we will tell you that too. You stay in control of the decision.",
                  },
                ].map((s, i) => (
                  <li key={s.t} className="flex gap-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rescue text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-display font-extrabold text-ink">{s.t}</p>
                      <p className="mt-1 text-sm text-ink/75">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-xl2 border border-line bg-cloud/50 p-6">
                <p className="eyebrow">Not ready to talk yet?</p>
                <h3 className="mt-2 font-display text-lg font-extrabold text-ink">
                  Six questions, instant result.
                </h3>
                <p className="mt-2 text-sm text-ink/75">
                  The assessment gives you a read on how urgent your position
                  looks and what the sensible next moves are, without speaking
                  to anyone. Two minutes, and it tells whoever calls you what
                  they are walking into.
                </p>
                <Link href="/assessment" className="btn btn-rescue mt-5 w-full sm:w-auto">
                  Start the assessment
                </Link>
              </div>

              <div className="mt-6 rounded-xl2 border border-rescue/30 bg-rescue-light/40 p-6">
                <p className="text-sm font-semibold text-rescue-dark">
                  Holding a director penalty notice? Do not use the form. Call{" "}
                  <a href={SITE.phoneHref} className="underline underline-offset-2">
                    {SITE.phone}
                  </a>{" "}
                  and say the word DPN. What is still available to you depends
                  on the date on that notice, and the window is measured in
                  days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ: the questions people are actually too embarrassed to ask. */}
      <section className="border-t border-line bg-cloud/50 py-14 lg:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              The questions people ask before they call.
            </h2>
            <dl className="mt-8 divide-y divide-line border-y border-line">
              {FAQS.map((f) => (
                <div key={f.q} className="py-5">
                  <dt className="font-display font-extrabold text-ink">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink/75">{f.a}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-xs leading-relaxed text-ink/45">{DISCLAIMER}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
