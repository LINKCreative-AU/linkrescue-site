"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

// The solvency indicator checklist: the warning signs courts and ASIC look
// at, turned into a self-check. Companion to the main assessment, not a
// rival: this one is the technical lens, the assessment is the triage.
// Answers stay on the page.

const INDICATORS = [
  "Losses have continued over more than one period",
  "The business could not pay all its debts if they were called on today",
  "Tax lodgments or payments are overdue, or super is behind",
  "The bank will not extend facilities, or relations with the bank have soured",
  "No realistic access to new finance or new equity",
  "Suppliers have moved you to cash on delivery, or demand special terms",
  "Creditors are being paid outside their trading terms",
  "Part payments or rounded-sum payments are being made to hold creditors off",
  "Some creditors get paid ahead of others just to keep the doors open",
  "Letters of demand, statutory demands or judgments have arrived",
  "Up-to-date financial information is hard to produce quickly",
  "Wages, rent or key payments have been late in the last three months",
];

function reading(count: number) {
  if (count <= 2)
    return {
      label: "Low signal",
      tone: "text-emerald-700",
      text: "Few indicators are present. Solvency is a legal test rather than a checklist, but at this level the sensible move is strengthening cash flow and keeping lodgments current while decisions are unforced.",
    };
  if (count <= 5)
    return {
      label: "Warning signs",
      tone: "text-amber-600",
      text: "Several indicators courts treat as warning signs are present. Businesses at this stage still hold the widest range of options, and directors who get advice now are also building the record that protects them later.",
    };
  return {
    label: "Serious signal",
    tone: "text-rescue-dark",
    text: "This many indicators together is the pattern courts associate with insolvency, and trading on while insolvent can make you personally liable for new debts. Safe harbour exists for exactly this moment, and it only protects directors who act. Talk to us this week.",
  };
}

export function InsolvencyTest() {
  const [checked, setChecked] = useState<boolean[]>(Array(INDICATORS.length).fill(false));
  const count = checked.filter(Boolean).length;
  const r = reading(count);

  return (
    <div className="rounded-xl2 border border-line bg-white p-6 sm:p-8">
      <p className="eyebrow guide-line-inline text-rescue">
        <span className="text-neutral-500">Solvency indicator check</span>
      </p>
      <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink">
        Tick what is true for your business right now.
      </h2>
      <p className="mt-2 text-sm text-ink/60">
        These are the indicators drawn from what courts and ASIC look at. Your answers stay on
        this page and are not stored or sent anywhere.
      </p>

      <div className="mt-6 grid gap-2.5">
        {INDICATORS.map((ind, i) => (
          <label
            key={ind}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm transition ${
              checked[i] ? "border-rescue bg-rescue-light/40" : "border-line bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={() => {
                const next = [...checked];
                next[i] = !next[i];
                setChecked(next);
              }}
              className="mt-0.5 h-4 w-4 accent-[#7B1E3A]"
            />
            <span className="text-ink/80">{ind}</span>
          </label>
        ))}
      </div>

      <div aria-live="polite" className="mt-6 rounded-lg border border-line bg-cloud/50 p-5">
        <p className={`font-display text-lg font-extrabold ${r.tone}`}>
          {count} of {INDICATORS.length} indicators: {r.label}.
        </p>
        <p className="mt-2 text-sm text-ink/70">{r.text}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <a href="/assessment" className="btn btn-rescue">
          Take the two-minute assessment
        </a>
        <a href={SITE.phoneHref} className="btn btn-ghost">
          Call {SITE.phone}
        </a>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink/45">
        This check is general information, not a legal opinion on solvency. Whether a company is
        insolvent is a question of fact decided on the whole picture, which is what the
        conversation is for.
      </p>
    </div>
  );
}
