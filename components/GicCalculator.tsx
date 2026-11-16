"use client";

import { useMemo, useState } from "react";
import { SITE } from "@/lib/site";

// ATO debt calculator: what the debt costs to carry and whether a proposed
// payment actually clears it. Pure client-side maths, no data leaves the page.
//
// GIC compounds daily and the ATO resets the annual rate quarterly.
// TODO update GIC_ANNUAL_PCT and GIC_QUARTER each quarter from ato.gov.au
// (rates page: "General interest charge") - both are deliberately surfaced in
// the UI so a stale value is visible rather than silent.
const GIC_ANNUAL_PCT = 11.51;
const GIC_QUARTER = "October to December 2026";
const DAILY_RATE = GIC_ANNUAL_PCT / 100 / 365;
const AVG_DAYS_PER_MONTH = 365 / 12;
const MAX_MONTHS = 240;
const MONTHLY_RATE = Math.pow(1 + DAILY_RATE, AVG_DAYS_PER_MONTH) - 1;

// The level monthly payment that clears `debt` in `months` instalments with
// interest compounding at the GIC rate (standard amortisation).
function paymentToClear(debt: number, months: number) {
  return (debt * MONTHLY_RATE) / (1 - Math.pow(1 + MONTHLY_RATE, -months));
}

function project(debt: number, monthly: number) {
  const firstMonthInterest = debt * MONTHLY_RATE;
  let balance = debt;
  let months = 0;
  let totalInterest = 0;
  while (balance > 0 && months < MAX_MONTHS) {
    const interest = balance * MONTHLY_RATE;
    totalInterest += interest;
    balance = balance + interest - monthly;
    months += 1;
  }
  return {
    firstMonthInterest,
    neverClears: balance > 0,
    months,
    totalInterest,
    totalPaid: debt + totalInterest,
  };
}

const fmt = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

export function GicCalculator() {
  const [debt, setDebt] = useState(100000);
  const [monthly, setMonthly] = useState(3000);
  const r = useMemo(() => project(debt, monthly), [debt, monthly]);
  const interestOnly = monthly > 0 && monthly <= r.firstMonthInterest;

  return (
    <div className="rounded-xl2 border border-line bg-white p-6 sm:p-8">
      <p className="eyebrow guide-line-inline text-rescue">
        <span className="text-neutral-500">ATO debt calculator</span>
      </p>
      <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink">
        What is your tax debt costing you?
      </h2>
      <p className="mt-2 text-sm text-ink/60">
        Using the general interest charge at {GIC_ANNUAL_PCT}% a year ({GIC_QUARTER}),
        compounding daily. Estimates only, and GIC stopped being tax deductible on 1 July 2025.
        Nothing you enter leaves this page.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <SliderField
          label="ATO debt today"
          value={debt}
          onChange={setDebt}
          min={5000}
          max={1000000}
          step={5000}
          inputMax={5000000}
        />
        <SliderField
          label="What you can pay each month"
          value={monthly}
          onChange={setMonthly}
          min={0}
          max={50000}
          step={250}
          inputMax={500000}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {(debt > 0 ? [12, 24] : []).map((m) => (
          <div key={m} className="rounded-lg border border-line px-4 py-3">
            <p className="text-xs font-semibold text-ink/60">To clear it in {m} months</p>
            <p className="mt-1 font-display text-lg font-semibold text-ink">
              About {fmt(paymentToClear(debt, m))} a month
            </p>
          </div>
        ))}
      </div>

      <div aria-live="polite" className="mt-6 rounded-lg border border-line bg-cloud/50 p-5">
        {debt <= 0 ? (
          <p className="text-sm text-ink/75">Enter your ATO debt above to see the numbers.</p>
        ) : interestOnly || r.neverClears ? (
          <>
            <p className="font-display text-lg font-semibold text-rescue-dark">
              At {fmt(monthly)} a month, this debt never clears.
            </p>
            <p className="mt-2 text-sm text-ink/75">
              Interest alone is about {fmt(r.firstMonthInterest)} in the first month
              {interestOnly
                ? ", which is more than the payment. The balance grows every month you stay on this path."
                : ", and the balance is still there after twenty years."}{" "}
              This is exactly the position small business restructuring exists for: eligible
              companies compromise the debt to what the business can genuinely fund, and the ATO
              accepts credible plans routinely.
            </p>
          </>
        ) : (
          <>
            <p className="font-display text-lg font-semibold text-ink">
              About {r.months} months to clear, {fmt(r.totalInterest)} of it interest.
            </p>
            <p className="mt-2 text-sm text-ink/75">
              You would pay roughly {fmt(r.totalPaid)} in total, with interest of about{" "}
              {fmt(r.firstMonthInterest)} in the first month falling as the balance drops.
              {r.months > 24
                ? " A plan this long is past what the ATO usually accepts, so the proposal needs building properly, or the debt needs a different tool."
                : " Inside the timeframe the ATO commonly accepts, provided lodgments stay current and the instalments hold."}
            </p>
          </>
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
  inputMax,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  /** Typed amounts may go past the slider's range, up to this. */
  inputMax: number;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-ink/60">
        {label}
      </label>
      <div className="mt-1.5 flex items-center rounded-lg border border-line focus-within:border-rescue">
        <span className="pl-3 font-display text-lg font-semibold text-ink/50">$</span>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          max={inputMax}
          step={step}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            onChange(Number.isFinite(n) ? Math.min(Math.max(n, 0), inputMax) : 0);
          }}
          className="w-full rounded-lg bg-transparent px-2 py-2 font-display text-lg font-semibold text-ink focus:outline-none"
        />
      </div>
      <input
        type="range"
        aria-label={`${label} slider`}
        min={min}
        max={max}
        step={step}
        value={Math.min(Math.max(value, min), max)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[#7B1E3A]"
      />
    </div>
  );
}
