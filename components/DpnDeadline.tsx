"use client";

import { useMemo, useState } from "react";
import { SITE } from "@/lib/site";

// DPN deadline checker: makes the 21-day clock visceral. Embedded on the
// DPN page rather than published as its own page - it exists to convert the
// visitors already here, not to rank. No data leaves the page.

const WINDOW_DAYS = 21;

export function DpnDeadline() {
  const [dateStr, setDateStr] = useState("");
  const [type, setType] = useState<"non-lockdown" | "lockdown" | "unsure">("non-lockdown");

  const state = useMemo(() => {
    if (!dateStr) return null;
    const noticeDate = new Date(dateStr + "T00:00:00");
    if (isNaN(noticeDate.getTime())) return null;
    const elapsed = Math.floor((Date.now() - noticeDate.getTime()) / 86400000);
    return { elapsed, remaining: WINDOW_DAYS - elapsed };
  }, [dateStr]);

  return (
    <div className="mt-8 rounded-xl2 border-2 border-rescue/30 bg-white p-6 sm:p-8">
      <p className="eyebrow guide-line-inline text-rescue">
        <span className="text-neutral-500">DPN deadline checker</span>
      </p>
      <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink">
        How much clock do you have left?
      </h2>
      <p className="mt-2 text-sm text-ink/60">
        The 21 days run from the date printed on the notice, not the day you opened it.
        Nothing you enter here is stored or sent anywhere.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink/60">
            Date printed on the notice
          </span>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-rescue focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink/60">Notice type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm focus:border-rescue focus:outline-none"
          >
            <option value="non-lockdown">Non-lockdown (company lodged on time)</option>
            <option value="lockdown">Lockdown (lodgments were late)</option>
            <option value="unsure">Not sure which one I have</option>
          </select>
        </label>
      </div>

      {state && (
        <div aria-live="polite" className="mt-5 rounded-lg bg-cloud/60 p-5">
          {type === "lockdown" ? (
            <>
              <p className="font-display text-lg font-semibold text-rescue-dark">
                A lockdown DPN has no 21-day escape window.
              </p>
              <p className="mt-2 text-sm text-ink/75">
                The personal liability locked in when the lodgments ran late, so the work now is
                strategy: what gets paid, in what order, from what source, and what the company
                does next. That is a conversation to have this week, not this month.
              </p>
            </>
          ) : type === "unsure" ? (
            <>
              <p className="font-display text-lg font-semibold text-rescue-dark">
                Treat it as {Math.max(state.remaining, 0)} day{state.remaining === 1 ? "" : "s"}{" "}
                remaining until someone reads the notice.
              </p>
              <p className="mt-2 text-sm text-ink/75">
                The notice type changes everything and it is stated in the wording. Send it to us
                or read it with us on the phone today, DPN enquiries go straight to the top of the
                queue.
              </p>
            </>
          ) : state.remaining > 0 ? (
            <>
              <p className="font-display text-lg font-semibold text-rescue-dark">
                About {state.remaining} day{state.remaining === 1 ? "" : "s"} left on the clock.
              </p>
              <p className="mt-2 text-sm text-ink/75">
                Inside the window, every option is still live: payment, small business
                restructuring, voluntary administration or liquidation can each lead to the
                penalty being remitted. The earlier in the window you act, the more of them are
                genuinely usable.
              </p>
            </>
          ) : (
            <>
              <p className="font-display text-lg font-semibold text-rescue-dark">
                The 21-day window looks closed.
              </p>
              <p className="mt-2 text-sm text-ink/75">
                You still have moves, they are different moves: statutory defences, negotiation
                with the ATO, and protecting your position from here. An expired clock makes the
                call more urgent, not less worth making.
              </p>
            </>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <a href={SITE.phoneHref} className="btn btn-rescue">
          Call {SITE.phone} now
        </a>
        <a href="/assessment" className="btn btn-ghost">
          Take the two-minute assessment
        </a>
      </div>
    </div>
  );
}
