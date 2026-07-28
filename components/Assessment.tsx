"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QUESTIONS, score, type Outcome } from "@/lib/assessment";
import { SITE } from "@/lib/site";

// The hero feature, cart-style (the gstregister funnel pattern):
//   1. Business (ABR lookup) + email first - the cart opens here, so an
//      abandoned assessment is still a followable lead
//   2. Six questions, each answer updating the cart in the background
//   3. Instant result on screen, then name + phone to finalise
// The ABR search degrades to a plain business-name field until ABR_GUID is
// configured server-side.

const UTM_KEY = "rescue_attribution";
const CART_KEY = "rescue_cart_id";

type Attribution = {
  utm: Record<string, string>;
  referrer: string;
  landing: string;
};

type AbrResult = { abn: string; name: string; type: string; location: string };

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

function cartId(): string {
  try {
    let id = sessionStorage.getItem(CART_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(CART_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

/** Fire-and-forget cart update; the UI never waits on it. */
function pushCart(body: Record<string, unknown>) {
  fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId: cartId(), ...body }),
    keepalive: true,
  }).catch(() => {});
}

// Semantic status colours for the four outcomes. These are result signals,
// not brand accents - the burgundy stays the site's only brand accent.
const OUTCOME_STYLE: Record<string, { chip: string; ring: string }> = {
  green: { chip: "bg-emerald-700", ring: "border-emerald-700/30" },
  amber: { chip: "bg-amber-600", ring: "border-amber-600/30" },
  red: { chip: "bg-red-700", ring: "border-red-700/30" },
  "dpn-urgent": { chip: "bg-rescue-dark", ring: "border-rescue/40" },
};

type Entity = { abn: string; name: string; type: string; location: string } | null;

export function Assessment({ compact = false }: { compact?: boolean }) {
  const [intro, setIntro] = useState(true);
  const [email, setEmail] = useState("");
  const [businessText, setBusinessText] = useState("");
  const [entity, setEntity] = useState<Entity>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const done = !intro && answers.length === QUESTIONS.length && step >= QUESTIONS.length;
  const result = useMemo(() => (done ? score(answers) : null), [done, answers]);

  useEffect(() => {
    captureAttribution();
  }, []);

  function begin(e: React.FormEvent) {
    e.preventDefault();
    pushCart({
      stage: "started",
      email,
      business: entity?.name ?? businessText,
      abn: entity?.abn ?? "",
      entityType: entity?.type ?? "",
      entityLocation: entity?.location ?? "",
      attribution: readAttribution(),
    });
    setIntro(false);
  }

  function choose(optionIndex: number) {
    const next = [...answers];
    next[step] = optionIndex;
    setAnswers(next);
    setStep(step + 1);
    pushCart({ stage: "progress", answers: next });
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  if (intro) {
    return (
      <IntroStep
        compact={compact}
        email={email}
        setEmail={setEmail}
        businessText={businessText}
        setBusinessText={setBusinessText}
        entity={entity}
        setEntity={setEntity}
        onBegin={begin}
      />
    );
  }

  if (result) {
    return (
      <Result
        outcome={result.outcome}
        total={result.total}
        answers={answers}
        email={email}
        business={entity?.name ?? businessText}
        abn={entity?.abn ?? ""}
        entityType={entity?.type ?? ""}
        entityLocation={entity?.location ?? ""}
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
        <span>Confidential. Your result appears instantly.</span>
      </div>
    </div>
  );
}

function IntroStep({
  compact,
  email,
  setEmail,
  businessText,
  setBusinessText,
  entity,
  setEntity,
  onBegin,
}: {
  compact: boolean;
  email: string;
  setEmail: (v: string) => void;
  businessText: string;
  setBusinessText: (v: string) => void;
  entity: Entity;
  setEntity: (e: Entity) => void;
  onBegin: (e: React.FormEvent) => void;
}) {
  const [results, setResults] = useState<AbrResult[]>([]);
  const [abrEnabled, setAbrEnabled] = useState(true);
  const [searching, setSearching] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onBusinessInput(v: string) {
    setBusinessText(v);
    setEntity(null);
    if (!abrEnabled || v.trim().length < 3) {
      setResults([]);
      return;
    }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/abr?q=${encodeURIComponent(v.trim())}`);
        const d = await res.json();
        if (d.configured === false) {
          setAbrEnabled(false);
          setResults([]);
          return;
        }
        setResults(d.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }

  const ready = email.includes("@") && (entity !== null || businessText.trim().length > 1);

  return (
    <form
      onSubmit={onBegin}
      className={`rounded-xl2 border border-line bg-white ${compact ? "p-6" : "p-6 sm:p-8"}`}
    >
      <p className="eyebrow">Before the six questions</p>
      <h3 className="mt-2 font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
        First, who are we helping?
      </h3>

      <div className="relative mt-5">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink/60">
            Business name or ABN
          </span>
          <input
            type="text"
            value={entity ? entity.name : businessText}
            onChange={(e) => onBusinessInput(e.target.value)}
            required
            autoComplete="organization"
            placeholder={abrEnabled ? "Start typing to search the ABR" : "Your business name"}
            className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-rescue focus:outline-none"
          />
        </label>
        {entity && (
          <p className="mt-1.5 text-xs font-medium text-emerald-700">
            ABN {entity.abn}
            {entity.location ? ` · ${entity.location}` : ""} · matched on the ABR
          </p>
        )}
        {!entity && results.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-line bg-white shadow-lg">
            {results.map((r) => (
              <li key={`${r.abn}-${r.name}`}>
                <button
                  type="button"
                  onClick={() => {
                    setEntity(r);
                    setResults([]);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm transition hover:bg-rescue-light/40"
                >
                  <span className="font-medium text-ink">{r.name}</span>
                  <span className="ml-2 text-xs text-ink/50">
                    ABN {r.abn}
                    {r.location ? ` · ${r.location}` : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {searching && <p className="mt-1.5 text-xs text-ink/45">Searching the ABR…</p>}
      </div>

      <label className="mt-4 block">
        <span className="mb-1 block text-xs font-semibold text-ink/60">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-rescue focus:outline-none"
        />
      </label>

      <button type="submit" disabled={!ready} className="btn btn-rescue mt-5 w-full disabled:opacity-50">
        Start the six questions
      </button>

      <p className="mt-4 text-xs leading-relaxed text-ink/45">
        Confidential, free and judgement-free. Your email saves your result so a
        human can follow up with help; nothing goes further than the LINK Rescue
        team and there is no spam, ever.
        {abrEnabled && " Business search powered by ABN Lookup."}
      </p>
    </form>
  );
}

function Result({
  outcome,
  total,
  answers,
  email,
  business,
  abn,
  entityType,
  entityLocation,
  onRestart,
}: {
  outcome: Outcome;
  total: number;
  answers: number[];
  email: string;
  business: string;
  abn: string;
  entityType: string;
  entityLocation: string;
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
        <p className="eyebrow">{business ? `Result for ${business}` : "Your result"}</p>
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

      <LeadForm
        outcome={outcome}
        total={total}
        answers={answers}
        email={email}
        business={business}
        abn={abn}
        entityType={entityType}
        entityLocation={entityLocation}
      />

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
  email: initialEmail,
  business,
  abn,
  entityType,
  entityLocation,
}: {
  outcome: Outcome;
  total: number;
  answers: number[];
  email: string;
  business: string;
  abn: string;
  entityType: string;
  entityLocation: string;
}) {
  const [form, setForm] = useState({ name: "", phone: "", email: initialEmail });
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
          cartId: (() => {
            try {
              return sessionStorage.getItem("rescue_cart_id") ?? crypto.randomUUID();
            } catch {
              return crypto.randomUUID();
            }
          })(),
          stage: "completed",
          ...form,
          business,
          abn,
          entityType,
          entityLocation,
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
        Add a name and number and the right person calls you back
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
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={busy} className="btn btn-rescue w-full sm:w-auto">
          {busy ? "Sending…" : outcome.cta}
        </button>
        {process.env.NEXT_PUBLIC_BOOKING_URL && (
          <a
            href={process.env.NEXT_PUBLIC_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost w-full sm:w-auto"
          >
            Or book a time now
          </a>
        )}
      </div>
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
