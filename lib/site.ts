// LINK Rescue - single source of truth for brand, contact and trust data.
// Built on LINK Brand Strategy & Style Guide V1.5: monochrome master brand
// with ONE accent. Rescue burgundy (#7B1E3A) is deliberately outside the
// regular LINK.com.au family tree - this site stands beside LINK as a
// dedicated lead engine for business rescue enquiries.

export const SITE = {
  name: "LINK Rescue",
  descriptor: "Rescue",
  tagline: "Forward from here.",
  url: "https://rescue.link.com.au",
  phone: "07 3899 8311", // TODO confirm dedicated rescue line with James
  phoneHref: "tel:0738998311",
  email: "rescue@link.com.au", // TODO confirm rescue inbox with James
  abn: "63 620 787 742", // TODO confirm entity ABN for the rescue offering
  color: "#7B1E3A",
  colorBright: "#A34D63",
  colorLight: "#F3DEE4",
  colorDark: "#3D0F1E",
  group: {
    name: "LINK",
    url: "https://link.com.au",
    line: "Backed by the LINK group - accounting, bookkeeping, finance, wealth and property, one connected team.",
  },
} as const;

export const NAV = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "ATO debt", href: "/ato-debt-help" },
  { label: "Director penalties", href: "/director-penalty-notice" },
  { label: "Restructuring", href: "/small-business-restructuring" },
  { label: "Alternatives to liquidation", href: "/liquidation-alternatives" },
] as const;

// The people behind the page. TODO with James: confirm roles, bios and real
// headshots for all three before launch.
export const TEAM = [
  {
    name: "James Webb",
    role: "Director", // TODO confirm title
    bio: "James leads the LINK group's digital and advisory engines and makes sure every rescue enquiry lands with the right person the same day.", // TODO James to confirm
    photo: "/team/james.jpg", // TODO real headshot
  },
  {
    name: "Kyle Macmillan",
    role: "Advisor", // TODO confirm title
    bio: "Kyle works with directors under pressure to map the numbers, the options and the order to take them in.", // TODO Kyle to confirm
    photo: "/team/kyle.jpg", // TODO real headshot
  },
  {
    name: "Dave Evans",
    role: "Advisor", // TODO confirm title
    bio: "Dave brings the restructuring and turnaround lens, from ATO negotiations through to formal appointments where they are the right call.", // TODO Dave to confirm
    photo: "/team/dave.jpg", // TODO real headshot
  },
] as const;

// Compliance line used near every result and lead form. Positioning per the
// brief: no guaranteed outcomes, LINK as trusted advisors who guide clients
// toward suitable restructuring and insolvency solutions.
export const DISCLAIMER =
  "The assessment and everything on this site is general information, not financial, legal or insolvency advice. Your result is a guide to how urgent your situation looks, not a formal opinion on solvency. Outcomes depend on your circumstances and no outcome is guaranteed. Formal insolvency appointments are made by registered practitioners we work alongside.";
