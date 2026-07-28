// The six-question business rescue assessment. Pure data + pure scoring so
// the client wizard and the API route share one source of truth: the server
// recomputes the score from the raw answers rather than trusting the client.
//
// Weighting notes (flagged DRAFT for James/Kyle/Dave to calibrate):
// - ATO debt, creditor pressure and solvency carry the heaviest options
//   because they are the strongest predictors of formal insolvency risk.
// - A confirmed Director Penalty Notice bypasses scoring entirely and
//   produces the highest-priority outcome (non-lockdown DPNs run on a
//   21-day clock from the date on the notice).
// - A statutory demand or court action forces at least a RED outcome.

export type OutcomeId = "green" | "amber" | "red" | "dpn-urgent";

export type Option = {
  label: string;
  points: number;
  /** dpn: confirmed DPN → instant top priority. legal: forces at least RED. */
  flag?: "dpn" | "legal";
};

export type Question = {
  id: string;
  topic: string;
  text: string;
  options: Option[];
};

export const QUESTIONS: Question[] = [
  {
    id: "cashflow",
    topic: "Cash flow",
    text: "How is cash flow right now?",
    options: [
      { label: "Comfortable, everything gets paid on time", points: 0 },
      { label: "Tight, but wages, super and suppliers all get paid", points: 1 },
      { label: "Some payments run late most months", points: 2 },
      { label: "Wages, super or rent are at risk this month", points: 4 },
    ],
  },
  {
    id: "ato",
    topic: "ATO debt",
    text: "Where does your tax debt sit with the ATO?",
    options: [
      { label: "Nothing owing and lodgments are up to date", points: 0 },
      { label: "Under $50k, or a payment plan that is on track", points: 1 },
      { label: "$50k to $200k, or a payment plan in default", points: 3 },
      { label: "Over $200k, or lodgments are behind", points: 4 },
    ],
  },
  {
    id: "creditors",
    topic: "Creditor pressure",
    text: "How much pressure are creditors and suppliers applying?",
    options: [
      { label: "None to speak of", points: 0 },
      { label: "Chasing calls and emails", points: 1 },
      { label: "Letters of demand, or supply on hold", points: 3 },
      { label: "Statutory demand, judgment or court action", points: 5, flag: "legal" },
    ],
  },
  {
    id: "dpn",
    topic: "Director Penalty Notice",
    text: "Has the ATO issued you a Director Penalty Notice?",
    options: [
      { label: "No", points: 0 },
      { label: "Not sure, there is ATO mail I have not opened", points: 3 },
      { label: "Yes, dated within the last 21 days", points: 0, flag: "dpn" },
      { label: "Yes, dated more than 21 days ago", points: 0, flag: "dpn" },
    ],
  },
  {
    id: "solvency",
    topic: "Solvency",
    text: "Can the business pay its debts as they fall due?",
    options: [
      { label: "Yes, comfortably", points: 0 },
      { label: "Yes, but only by delaying other payments", points: 2 },
      { label: "I am not sure", points: 3 },
      { label: "No", points: 5 },
    ],
  },
  {
    id: "urgency",
    topic: "Urgency",
    text: "How quickly do you need a path forward?",
    options: [
      { label: "Planning ahead, no pressure yet", points: 0 },
      { label: "In the next few months", points: 1 },
      { label: "In the next few weeks", points: 2 },
      { label: "This week, there is a deadline", points: 4 },
    ],
  },
];

/** Maximum possible score without a DPN flag: 25. DRAFT bands below. */
export const MAX_SCORE = QUESTIONS.reduce(
  (sum, q) => sum + Math.max(...q.options.map((o) => o.points)),
  0
);

export type Outcome = {
  id: OutcomeId;
  label: string;
  priority: "standard" | "high" | "urgent";
  headline: string;
  meaning: string;
  steps: string[];
  cta: string;
};

export const OUTCOMES: Record<OutcomeId, Outcome> = {
  green: {
    id: "green",
    label: "Green",
    priority: "standard",
    headline: "You are in reasonable shape.",
    meaning:
      "Your answers point to a business under normal pressure rather than one in distress. The best time to strengthen cash flow, structures and ATO standing is while you have room to move.",
    steps: [
      "Keep lodgments current, an up-to-date ATO account keeps every option open",
      "Build a 13-week cash flow view so pressure never arrives as a surprise",
      "Talk to us about structure and planning while decisions are unforced",
    ],
    cta: "Book a planning conversation",
  },
  amber: {
    id: "amber",
    label: "Amber",
    priority: "standard",
    headline: "Warning signs worth acting on.",
    meaning:
      "Your answers show real pressure building. Businesses at this stage still have the widest range of options, from ATO payment plans to informal workouts, and the options narrow the longer the pressure runs.",
    steps: [
      "Get a clear picture of what is owed, to whom, and what is overdue",
      "Deal with the ATO before the ATO deals with you, engagement changes everything",
      "Speak with us this week so you choose your path rather than have it chosen",
    ],
    cta: "Book a confidential call",
  },
  red: {
    id: "red",
    label: "Red",
    priority: "high",
    headline: "Your business needs help now.",
    meaning:
      "Your answers point to serious distress: the kind of pressure that leads to statutory demands, director penalties and forced outcomes when it is left to run. Acting this week protects options that disappear quickly, and directors who move early are also best placed to show they acted properly.",
    steps: [
      "Stop new personal guarantees and large payments until you have advice",
      "Gather your ATO portal position, aged payables and any legal letters",
      "Talk to us today, a priority callback is how this page is meant to be used",
    ],
    cta: "Request a priority callback",
  },
  "dpn-urgent": {
    id: "dpn-urgent",
    label: "DPN Urgent",
    priority: "urgent",
    headline: "A Director Penalty Notice means act today.",
    meaning:
      "A DPN can make you personally liable for company tax debts. With a non-lockdown DPN you generally have 21 days from the date on the notice, not the day you opened it, to act before personal liability locks in. The right response depends on the notice type and dates, so the notice needs eyes on it now.",
    steps: [
      "Find the notice and check the issue date, the clock runs from that date",
      "Do not ignore it or wait for a second letter, there is not one coming",
      "Call us now or send the form, DPN enquiries go straight to the top of the queue",
    ],
    cta: "Get urgent DPN help",
  },
};

/** answers[i] = chosen option index for QUESTIONS[i]. */
export function score(answers: number[]): {
  total: number;
  outcome: Outcome;
  flags: string[];
} {
  let total = 0;
  const flags: string[] = [];
  QUESTIONS.forEach((q, i) => {
    const opt = q.options[answers[i]];
    if (!opt) return;
    total += opt.points;
    if (opt.flag) flags.push(opt.flag);
  });

  let id: OutcomeId;
  if (flags.includes("dpn")) id = "dpn-urgent";
  else if (total >= 13 || flags.includes("legal")) id = "red";
  else if (total >= 6) id = "amber";
  else id = "green";

  return { total, outcome: OUTCOMES[id], flags };
}

/** Human-readable answer summary for Slack/email/database. */
export function summarise(answers: number[]): { topic: string; answer: string }[] {
  return QUESTIONS.map((q, i) => ({
    topic: q.topic,
    answer: q.options[answers[i]]?.label ?? "(not answered)",
  }));
}
