"use client";

import { useEffect, useMemo, useState } from "react";
import { QUESTIONS, score, type Outcome } from "@/lib/assessment";
import { SITE } from "@/lib/site";

// The hero feature: six questions, an instant result BEFORE any contact
// details are requested, then lead capture with the result attached.

const UTM_KEY = "rescue_attribution";

type Attribution = {
  utm: Record<string, string>;
  referrer: string;
  landing: string;
};

function readAttribution(): Attribution {
  try {
    const stored = sessionStorage.getItem(UTM_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { utm: {}, referrer: "", landing: "" };
}

/** Drop-in capture: stores UTM params + referrer on first page load. */
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(UTM_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach(
      (k) => {
        const v = params.get(k);
        if (v) utm[k] = v;
      }
    );
    const data: Attribution = {
      utm,
      referrer: document.referrer || "",
      landing: window.location.pathname + window.location.search,
    };
    sessionStorage.setItem(UTM_KEY, JSON.stringify(data));
  } catch {}
}

// Semantic status colours for the four outcomes. These are result signals,
// not brand accents - the burgundy stays the site's only brand accent.
const OUTCOME_STYLE: Record<string, { chip: string; ring: string }> = {
  green: { chip: "bg-emerald-700", ring: "border-emerald-700/30" },
  amber: { chip: "bg-amber-600", ring: "border-amber-600/30" },
  red: { chip: "bg-red-700", ring: "border-red-700/30" },
  "dpn-urgent": { chip: "bg-rescue-dark", ring: "border-rescue/40" },
};

export function Assessment({ compact = false }: { compact?: boolean }) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0); // index into QUESTIONS; === length → result
  const done = answers.length === QUESTIONS.length && step >= QUESTIONS.length;
  const result = useMemo(() => (done ? score(answers) : null), [done, answers]);

  useEffect(() => {
    captureAttribution();
  }, []);

  function choose(optionIndex: number) {
    const next = [...answers];
    next[step] = optionIndex;
    setAnswers(next);
    setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  if (result) {
    return (
      <Result
        outcome={result.outcome}
        total={result.total}
        answers={answers}
        onRestart={() => {
          setAnswers([]);
          setStep(0);
        }}
      />
    );
  }

  const q = QUESTIONS[step];
  return (
    <div
      aria-live="polite"
      className={`rounded-xl2 border border-line bg-white ${compact ? "p-6" : "p-6 sm:p-8"}`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="eyebrow">
          Question {step + 1} of {QUESTIONS.length} · {q.topic}
        </p>
        <div
          className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-cloud sm:block"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={QUESTIONS.length}
          aria-label="Assessment progress"
        >
          <div
            className="h-full rounded-full bg-rescue transition-all"
            style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
        {q.text}
      </h3>

      <div className="mt-5 grid gap-2.5">
        {q.options.map((opt, i) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => choose(i)}
            className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition hover:border-rescue hover:bg-rescue-light/40 ${
              answers[step] === i ? "border-rescue bg-rescue-light/40" : "border-line bg-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-ink/50">
        {step > 0 ? (
          <button type="button" onClick={back} className="font-semibold text-ink/60 hover:text-ink">
            ← Back
          </button>
        ) : (
          <span />
        )}
        <span>Confidential. No contact details needed to see your result.</span>
      </div>
    </div>
  );
}

function Result({
  outcome,
  total,
  answers,
  onRestart,
}: {
  outcome: Outcome;
  total: number;
  answers: number[];
  onRestart: () => void;
}) {
  const style = OUTCOME_STYLE[outcome.id];
  const urgent = outcome.priority !== "standard";

  return (
    <div className={`rounded-xl2 border-2 bg-white p-6 sm:p-8 ${style.ring}`}>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white ${style.chip}`}
        >
          {outcome.label}
        </span>
        <p className="eyebrow">Your result</p>
      </div>

      <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {outcome.headline}
      </h3>
      <p className="mt-3 text-ink/70">{outcome.meaning}</p>

      <ul className="mt-5 space-y-2.5">
        {outcome.steps.map((s) => (
          <li key={s} className="flex gap-3 text-sm text-ink/80">
            <span aria-hidden className="mt-2 h-[2px] w-4 shrink-0 bg-rescue" />
            {s}
          </li>
        ))}
      </ul>

      {urgent && (
        <a
          href={SITE.phoneHref}
          className="btn btn-rescue mt-6 w-full sm:hidden"
          aria-label={`Call ${SITE.phone} now`}
        >
          Call {SITE.phone} now
        </a>
      )}

      <LeadForm outcome={outcome} total={total} answers={answers} />

      <p className="mt-4 text-xs leading-relaxed text-ink/45">
        Your result is general information, not financial, legal or insolvency
        advice, and no outcome is guaranteed. Talking to us is confidential and
        free, with no obligation.
      </p>

      <button
        type="button"
        onClick={onRestart}
        className="mt-3 text-xs font-semibold text-ink/50 underline-offset-2 hover:text-ink hover:underline"
      >
        Start the assessment again
      </button>
    </div>
  );
}

function LeadForm({
  outcome,
  total,
  answers,
}: {
  outcome: Outcome;
  total: number;
  answers: number[];
}) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", business: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          answers,
          clientScore: total,
          clientOutcome: outcome.id,
          attribution: readAttribution(),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      window.location.href = `/thank-you?outcome=${outcome.id}`;
    } catch {
      setError(true);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 border-t border-line pt-6">
      <p className="font-display text-lg font-extrabold text-ink">{outcome.cta}.</p>
      <p className="mt-1 text-sm text-ink/60">
        Leave your details and the right person calls you back
        {outcome.priority === "urgent"
          ? " as a priority, DPN enquiries go straight to the top of the queue"
          : outcome.priority === "high"
            ? " the same business day"
            : " within one business day"}
        .
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required autoComplete="name" />
        <Field label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required autoComplete="tel" />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required autoComplete="email" />
        <Field label="Business name (optional)" value={form.business} onChange={(v) => setForm({ ...form, business: v })} autoComplete="organization" />
      </div>
      <button type="submit" disabled={busy} className="btn btn-rescue mt-4 w-full sm:w-auto">
        {busy ? "Sending…" : outcome.cta}
      </button>
      {error && (
        <p className="mt-3 text-sm font-medium text-red-700">
          That did not go through. Try again, or call {SITE.phone} and we will
          take it from there.
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink/60">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-rescue focus:outline-none"
      />
    </label>
  );
}
