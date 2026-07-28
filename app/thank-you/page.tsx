import type { Metadata } from "next";
import { OUTCOMES, type OutcomeId } from "@/lib/assessment";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thanks - Your Callback Is Booked",
  description: "Your assessment is with the team and the right person will call you back.",
  robots: { index: false },
  alternates: { canonical: "/thank-you" },
};

const TIMING: Record<OutcomeId, string> = {
  green: "within one business day",
  amber: "within one business day",
  red: "the same business day",
  "dpn-urgent": "as a priority, ahead of the queue",
};

export default async function ThankYou({
  searchParams,
}: {
  searchParams: Promise<{ outcome?: string }>;
}) {
  const { outcome } = await searchParams;
  const id = (outcome && outcome in OUTCOMES ? outcome : "amber") as OutcomeId;
  const urgent = OUTCOMES[id].priority === "urgent";

  return (
    <main className="bg-cloud/50">
      <div className="container-x py-16 lg:py-24">
        <div className="mx-auto max-w-2xl rounded-xl2 border border-line bg-white p-8 sm:p-12">
          <p className="guide-line text-rescue text-sm font-semibold uppercase tracking-wider">
            You are on the list
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Done. The next move is ours.
          </h1>
          <p className="mt-4 text-lg text-ink/70">
            Your assessment is with the team and the right person will call you
            back {TIMING[id]}. Keep your phone close, the call will come from a
            number you do not recognise.
          </p>

          {urgent && (
            <div className="mt-6 rounded-lg border border-rescue/30 bg-rescue-light/40 p-5">
              <p className="text-sm font-semibold text-rescue-dark">
                Because a Director Penalty Notice is involved, do not wait if
                the clock is tight. Call {SITE.phone} now and say the word DPN,
                you will be put straight through.
              </p>
            </div>
          )}

          <div className="mt-7 grid gap-3 text-sm text-ink/70">
            <p className="font-semibold text-ink">While you wait, three things that help:</p>
            <p>1. Pull together your ATO portal position, or your portal login.</p>
            <p>2. Find any letters of demand, default notices or ATO notices.</p>
            <p>3. Note your rough aged payables: who is owed, how much, how old.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {process.env.NEXT_PUBLIC_BOOKING_URL && (
              <a
                href={process.env.NEXT_PUBLIC_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-rescue"
              >
                Book a time now
              </a>
            )}
            <a href={SITE.phoneHref} className={process.env.NEXT_PUBLIC_BOOKING_URL ? "btn btn-ghost" : "btn btn-rescue"}>
              Call {SITE.phone}
            </a>
            <a href="/" className="btn btn-ghost">
              Back to the site
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
