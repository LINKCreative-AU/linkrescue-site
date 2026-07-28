"use client";

import { useMemo, useState } from "react";
import { SITE } from "@/lib/site";

// SBR outcome estimator: what a restructuring plan could look like, anchored
// to the 20-40c in the dollar range of plans the LINK team has supported.
// Pure client-side maths, nothing leaves the page. Estimates only - every
// output is framed as historical range, never a promise.

const PLAN_MONTHS = 36; // plans run up to three years
const LOW = 0.2;
const HIGH = 0.4;

const fmt = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

const GATES = [
  "Employee entitlements, including super, are paid up to date",
  "Tax lodgments are up to date, or at least lodged",
  "The company has not used SBR or simplified liquidation in the last 7 years",
];

export function SbrCalculator() {
  const [debt, setDebt] = useState(300000);
  const [monthly, setMonthly] = useState(4000);
  const [gates, setGates] = useState<boolean[]>(Array(GATES.length).fill(false));

  const r = useMemo(() => {
    const low = debt * LOW;
    const high = debt * HIGH;
    return {
      low,
      high,
      lowMonthly: low / PLAN_MONTHS,
      highMonthly: high / PLAN_MONTHS,
      writtenOffLow: debt - high,
      writtenOffHigh: debt - low,
      overCap: debt > 1000000,
      capacityShort: monthly > 0 && monthly < low / PLAN_MONTHS,
    };
  }, [debt, monthly]);

  const gatesTicked = gates.filter(Boolean).length;

  return (
    <div className="rounded-xl2 border-2 border-rescue/30 bg-white p-6 sm:p-8">
      <p className="eyebrow guide-line-inline text-rescue">
        <span className="text-neutral-500">SBR outcome estimator</span>
      </p>
      <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink">
        What could a restructure look like for your debt?
      </h2>
      <p className="mt-2 text-sm text-ink/60">
        Based on the 20 to 40 cents in the dollar range of plans the LINK team
        has supported. Estimates only, nothing you enter leaves this page.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <SliderField
          label="Total unsecured debts (including ATO)"
          value={debt}
          onChange={setDebt}
          min={50000}
          max={1200000}
          step={10000}
        />
        <SliderField
          label="What the business can afford each month"
          value={monthly}
          onChange={setMonthly}
          min={0}
          max={30000}
          step={250}
        />
      </div>

      <div aria-live="polite" className="mt-6 rounded-lg border border-line bg-cloud/50 p-5">
        {r.overCap ? (
          <>
            <p className="font-display text-lg font-extrabold text-rescue-dark">
              Over the $1 million SBR ceiling.
            </p>
            <p className="mt-2 text-sm text-ink/75">
              SBR is capped at $1 million in total liabilities, excluding
              employee entitlements. Above that line the rescue tools are
              voluntary administration and a deed of company arrangement, which
              can achieve a similar compromise at larger scale. Worth a
              conversation either way.
            </p>
          </>
        ) : (
          <>
            <p className="font-display text-lg font-extrabold text-ink">
              A plan in the range of {fmt(r.low)} to {fmt(r.high)}, with{" "}
              {fmt(r.writtenOffLow)} to {fmt(r.writtenOffHigh)} written off.
            </p>
            <p className="mt-2 text-sm text-ink/75">
              Spread over up to {PLAN_MONTHS} months, that is roughly{" "}
              {fmt(r.lowMonthly)} to {fmt(r.highMonthly)} a month, and no
              interest accrues on a plan the way it does on the debt.
              {r.capacityShort
                ? " Your monthly figure sits under that range, which does not end the conversation: plan length, contributions and what the business can genuinely fund are exactly what gets worked through on the call."
                : monthly > 0
                  ? " Your monthly figure covers that range, which is the shape of a credible proposal."
                  : ""}
            </p>
          </>
        )}
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold text-ink/60">
          Quick eligibility gates, tick what is true today:
        </p>
        <div className="mt-2 grid gap-2">
          {GATES.map((g, i) => (
            <label
              key={g}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-2.5 text-sm transition ${
                gates[i] ? "border-rescue bg-rescue-light/40" : "border-line bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={gates[i]}
                onChange={() => {
                  const next = [...gates];
                  next[i] = !next[i];
                  setGates(next);
                }}
                className="mt-0.5 h-4 w-4 accent-[#7B1E3A]"
              />
              <span className="text-ink/80">{g}</span>
            </label>
          ))}
        </div>
        {!r.overCap && (
          <p className="mt-3 text-sm text-ink/75">
            {gatesTicked === GATES.length
              ? "All gates ticked and under the debt ceiling: on these answers, SBR looks open to you."
              : "Unticked gates are jobs, not dead ends. Catching up lodgments and entitlements is usually the first stage of the engagement."}
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <a href="/assessment" className="btn btn-rescue">
          See where you stand in two minutes
        </a>
        <a href={SITE.phoneHref} className="btn btn-ghost">
          Talk it through: {SITE.phone}
        </a>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink/45">
        The 20 to 40 cent range reflects historical plans the LINK team has
        supported on debts between $200,000 and $500,000. Every plan is voted
        by creditors on your company's real numbers, results vary and no
        outcome is guaranteed.
      </p>
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="text-xs font-semibold text-ink/60">{label}</span>
        <span className="font-display text-lg font-extrabold text-ink">{fmt(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[#7B1E3A]"
      />
    </label>
  );
}
