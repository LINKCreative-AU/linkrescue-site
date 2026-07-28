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

// Header nav: five short labels that hold one line at laptop widths.
// "How it works" and the long-form labels live in the footer instead.
export const NAV = [
  { label: "ATO debt", href: "/ato-debt-help" },
  { label: "Director penalties", href: "/director-penalty-notice" },
  { label: "Restructuring", href: "/small-business-restructuring" },
  { label: "Liquidation", href: "/liquidation-alternatives" },
  { label: "What it costs", href: "/what-it-costs" },
] as const;

// The people behind the page. TODO with James: confirm roles, bios and real
// headshots for all three before launch.
// The frontline: growth accountant + insolvency lawyer + restructuring
// specialist. TODO James: confirm roles, firm affiliations and bios with Kyle
// and David before launch; their headshots drop into public/team/.
export const TEAM = [
  {
    name: "James Webb",
    role: "Co-Founder, LINK", // TODO confirm title
    bio: "James co-founded the LINK group and leads its growth engines. His lens on a rescue is a growth accountant's: fix the model, fix the cash, then make the business worth saving.", // TODO James to confirm
    photo: "/team/james.jpg",
  },
  {
    name: "Kyle Macmillan",
    role: "Insolvency Lawyer", // TODO confirm title + firm line
    bio: "Kyle brings the legal firepower: director penalties, safe harbour, creditor disputes and the formal tools, used early enough to change the ending.", // TODO Kyle to confirm
    photo: "/team/kyle.jpg",
  },
  {
    name: "David Evans",
    role: "Restructuring Specialist", // TODO confirm title + firm line
    bio: "David has spent more than twenty years inside restructures and turnarounds, from ATO negotiations to formal appointments, and knows which lever to pull first.", // TODO David to confirm
    photo: "/team/david.jpg",
  },
] as const;

// The founder quote that sits under the comfort strip. TODO James: confirm
// or reword, this is drafted from your brief.
export const FOUNDER_QUOTE = {
  text: "We are accountants, but not the stuffy compliance kind. We look at how your business makes money, what will genuinely get you out of this, and then we use the law and the best specialists in the country to save your backside from destruction.",
  name: "James Webb",
  role: "Co-Founder, LINK",
  photo: "/team/james.jpg",
} as const;

// Compliance line used near every result and lead form. Positioning per the
// brief: no guaranteed outcomes, LINK as trusted advisors who guide clients
// toward suitable restructuring and insolvency solutions.
export const DISCLAIMER =
  "The assessment and everything on this site is general information, not financial, legal or insolvency advice. Your result is a guide to how urgent your situation looks, not a formal opinion on solvency. Outcomes depend on your circumstances and no outcome is guaranteed. Formal insolvency appointments are made by registered practitioners we work alongside.";
