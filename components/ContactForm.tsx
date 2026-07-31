"use client";

import { useState } from "react";
import { CONFIDENTIALITY, SITE } from "@/lib/site";

// The callback request on /contact. Deliberately short: name and phone are
// the only required fields, because the person filling this in is usually
// having a bad week and every extra required box is a reason to close the
// tab. Business name, email and the free-text box are optional and most
// people fill them anyway once they have started.
//
// Urgency is asked in the caller's own words rather than scored - "the notice
// is dated" is not something to grade, it is something to act on. It drives
// the Slack prefix so a DPN never sits behind a general enquiry in the queue.

const URGENCY = [
  { id: "dpn", label: "I have a notice with a date on it" },
  { id: "urgent", label: "This week - it is coming to a head" },
  { id: "soon", label: "Weeks, not days" },
  { id: "planning", label: "Nothing is on fire, I want to plan" },
];

type State = "idle" | "sending" | "sent" | "sent-undelivered" | "error";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    business: "",
    // Deliberately unselected. Pre-ticking "weeks, not days" would quietly
    // mis-triage anyone who skims past it, and this is the one answer that
    // decides how fast a human calls back. Unanswered defaults to "soon"
    // server-side rather than blocking the submit.
    urgency: "",
    message: "",
    company: "", // honeypot
  });
  const [state, setState] = useState<State>("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      let attribution = {};
      try {
        attribution = JSON.parse(sessionStorage.getItem("rescue_attribution") ?? "{}");
      } catch {}
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, attribution }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json().catch(() => ({ delivered: true }));
      setState(data.delivered === false ? "sent-undelivered" : "sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent" || state === "sent-undelivered") {
    const urgent = form.urgency === "dpn" || form.urgency === "urgent";
    return (
      <div className="rounded-xl2 border-2 border-rescue/30 bg-white p-6 sm:p-8" aria-live="polite">
        <p className="eyebrow text-rescue">Received</p>
        <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink">
          {form.name.split(" ")[0]}, we have your number.
        </h3>
        {state === "sent-undelivered" ? (
          <p className="mt-4 text-ink/75">
            Your details are logged, but our notification channel did not
            confirm. Please do not wait on us - call{" "}
            <a href={SITE.phoneHref} className="font-semibold text-rescue hover:text-rescue-dark">
              {SITE.phone}
            </a>{" "}
            and quote your name, and we will pick it up straight away.
          </p>
        ) : (
          <p className="mt-4 text-ink/75">
            {urgent
              ? "You are at the top of the queue. Keep your phone close - the call will come from a number you do not recognise."
              : "The right person will call you back within one business day. The call will come from a number you do not recognise."}
          </p>
        )}
        {urgent && state === "sent" && (
          <div className="mt-6 rounded-lg border border-rescue/30 bg-rescue-light/40 p-5">
            <p className="text-sm font-semibold text-rescue-dark">
              If the clock is genuinely tight, do not wait for us to call. Ring{" "}
              <a href={SITE.phoneHref} className="underline underline-offset-2">
                {SITE.phone}
              </a>{" "}
              and say the word DPN - you will be put straight through.
            </p>
          </div>
        )}
        <div className="mt-7 grid gap-3 text-sm text-ink/75">
          <p className="font-semibold text-ink">While you wait, three things that help:</p>
          <p>1. Pull together your ATO portal position, or your portal login.</p>
          <p>2. Find any letters of demand, default notices or ATO notices.</p>
          <p>3. Note your rough aged payables: who is owed, how much, how old.</p>
        </div>
        <p className="mt-6 text-sm text-ink/60">
          Want a read on where you stand before the call?{" "}
          <a href="/assessment" className="font-semibold text-rescue hover:text-rescue-dark">
            Run the six-question assessment
          </a>{" "}
          - it takes two minutes and gives the person calling you a head start.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative rounded-xl2 border border-line bg-white p-6 sm:p-8">
      <p className="eyebrow">Ask for a call back</p>
      <h3 className="mt-2 font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
        Two fields. We will call you.
      </h3>
      <p className="mt-3 text-sm text-ink/65">
        A name and a number is genuinely all we need to start. Everything else
        below is optional.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          required
          autoComplete="name"
        />
        <Field
          label="Phone"
          type="tel"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
          required
          autoComplete="tel"
        />
        <Field
          label="Email"
          hint="optional"
          type="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          autoComplete="email"
        />
        <Field
          label="Business name"
          hint="optional"
          value={form.business}
          onChange={(v) => setForm({ ...form, business: v })}
          autoComplete="organization"
        />
      </div>

      <fieldset className="mt-6">
        <legend className="mb-2 block text-xs font-semibold text-ink/60">
          How urgent is it? <span className="font-normal text-ink/40">optional</span>
        </legend>
        <div className="grid gap-2.5">
          {URGENCY.map((u) => (
            <label
              key={u.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition hover:border-rescue hover:bg-rescue-light/40 ${
                form.urgency === u.id ? "border-rescue bg-rescue-light/40" : "border-line bg-white"
              }`}
            >
              <input
                type="radio"
                name="urgency"
                value={u.id}
                checked={form.urgency === u.id}
                onChange={() => setForm({ ...form, urgency: u.id })}
                className="h-4 w-4 accent-rescue"
              />
              {u.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-6 block">
        <span className="mb-1 block text-xs font-semibold text-ink/60">
          What is happening? <span className="font-normal text-ink/40">optional</span>
        </span>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          maxLength={2000}
          placeholder="As much or as little as you like. It saves you explaining twice."
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-rescue focus:outline-none"
        />
      </label>

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn btn-rescue mt-6 w-full disabled:opacity-50"
      >
        {state === "sending" ? "Sending…" : "Ask us to call"}
      </button>

      {state === "error" && (
        <p className="mt-3 text-sm font-medium text-red-700">
          That did not go through. Try again, or call{" "}
          <a href={SITE.phoneHref} className="underline underline-offset-2">
            {SITE.phone}
          </a>{" "}
          and we will take it from there.
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-ink/55">{CONFIDENTIALITY}</p>
      <p className="mt-2 text-xs leading-relaxed text-ink/45">
        Free and judgement-free. Nothing goes further than the LINK Rescue
        team, and there is no spam, ever.
      </p>
    </form>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink/60">
        {label} {hint && <span className="font-normal text-ink/40">{hint}</span>}
      </span>
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
