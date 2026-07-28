"use client";

import { useMemo, useState } from "react";
import { SITE } from "@/lib/site";

// ATO debt calculator: what the debt costs to carry and whether a proposed
// payment actually clears it. Pure client-side maths, no data leaves the page.
//
// GIC compounds daily and the ATO resets the annual rate quarterly.
// TODO update GIC_ANNUAL_PCT each quarter from ato.gov.au (rates page:
// "General interest charge") - it is deliberately surfaced in the UI so a
// stale value is visible rather than silent.
const GIC_ANNUAL_PCT = 10.78;
const DAILY_RATE = GIC_ANNUAL_PCT / 100 / 365;
const AVG_DAYS_PER_MONTH = 365 / 12;
const MAX_MONTHS = 240;

function project(debt: number, monthly: number) {
  const monthlyFactor = Math.pow(1 + DAILY_RATE, AVG_DAYS_PER_MONTH);
  const firstMonthInterest = debt * (monthlyFactor - 1);
  let balance = debt;
  let months = 0;
  let totalInterest = 0;
  while (balance > 0 && months < MAX_MONTHS) {
    const interest = balance * (monthlyFactor - 1);
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
      <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink">
        What is your tax debt costing you?
      </h2>
      <p className="mt-2 text-sm text-ink/60">
        Using the general interest charge at {GIC_ANNUAL_PCT}% a year, compounding daily.
        Estimates only, and GIC stopped being tax deductible on 1 July 2025.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <SliderField
          label="ATO debt today"
          value={debt}
          onChange={setDebt}
          min={5000}
          max={1000000}
          step={5000}
        />
        <SliderField
          label="What you can pay each month"
          value={monthly}
          onChange={setMonthly}
          min={0}
          max={50000}
          step={250}
        />
      </div>

      <div aria-live="polite" className="mt-6 rounded-lg border border-line bg-cloud/50 p-5">
        {interestOnly || r.neverClears ? (
          <>
            <p className="font-display text-lg font-extrabold text-rescue-dark">
              At {fmt(monthly)} a month, this debt never clears.
            </p>
            <p className="mt-2 text-sm text-ink/70">
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
            <p className="font-display text-lg font-extrabold text-ink">
              About {r.months} months to clear, {fmt(r.totalInterest)} of it interest.
            </p>
            <p className="mt-2 text-sm text-ink/70">
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
