// The work log for this site, as it reads in rank. (rank.link.com.au).
//
// Every change made to the site adds ONE entry here, in the same commit as the
// change. rank. reads this list nightly through /api/worklog and files each new
// entry in the site's work log, so the history keeps up without anyone
// retyping it.
//
// Rules for an entry:
//   id      stable and unique, never reused or edited after it ships: rank.
//           de-duplicates on it. Convention: YYYY-MM-DD-short-slug.
//   date    the day the change went live, YYYY-MM-DD, Brisbane.
//   title   what changed, as the business owner would say it. No jargon: not
//           "schema", "canonical", "CSP", "ISR", "env var". At most 100 characters.
//   detail  optional. One or two plain sentences on what it does for the business.
// Newest first. Articles approved in rank. are NOT listed here: rank. logs
// those itself.

export type WorklogEntry = { id: string; date: string; title: string; detail?: string };

export const WORKLOG: WorklogEntry[] = [
  {
    id: "2026-11-17-payment-plan-calculator",
    date: "2026-11-17",
    title: "ATO payment plan calculator expanded, with the current ATO interest rate and clearer guidance",
    detail:
      "You can now type exact amounts and see the monthly payment that clears the debt in 12 or 24 months, with plain guidance on how payment plans work and when one is the right tool.",
  },
  {
    id: "2026-11-17-dpn-page",
    date: "2026-11-17",
    title: "Director penalty notice page now fully explains the notice, the two types and the 21 days",
    detail:
      "Directors with a notice in hand get a clear list of what to do now and a direct way to call or ask for a priority call back.",
  },
  {
    id: "2026-11-17-search-titles",
    date: "2026-11-17",
    title: "Clearer Google listings for seven pages people already find in search",
    detail:
      "The page names and summaries shown in Google now match what people search for, and the key pages link to each other more.",
  },
  {
    id: "2026-11-17-visitor-analytics",
    date: "2026-11-17",
    title: "Visitor counting now set up the same way as LINK.com.au's other websites",
  },
  {
    id: "2026-11-16-enquiries-in-rank",
    date: "2026-11-16",
    title: "Every website enquiry is now also recorded in rank.",
    detail:
      "Enquiries still reach Slack as before; a copy now lands in rank. too, with obvious spam filed separately, so every enquiry can be counted and followed up.",
  },
  {
    id: "2026-10-04-founder-bio",
    date: "2026-10-04",
    title: "Founder bio now says he founded LINK.com.au, matching the business record",
    detail: "The earlier wording said co-founded, which was out of date.",
  },
  {
    id: "2026-10-04-link-name",
    date: "2026-10-04",
    title: "The site now calls the business LINK.com.au, never \"the LINK group\"",
    detail: "Every mention across the site was reworded so the business is named consistently.",
  },
  {
    id: "2026-10-01-bing-indexnow",
    date: "2026-10-01",
    title: "Bing and other search engines can now be told the moment a page changes",
    detail: "Updated pages get picked up by these engines sooner instead of waiting for them to come back and look.",
  },
  {
    id: "2026-10-01-enquiry-source",
    date: "2026-10-01",
    title: "Every enquiry now says which website and page it came from",
    detail: "Enquiry notifications start with a short site tag, so the team can tell at a glance where each one originated.",
  },
  {
    id: "2026-09-14-spam-protection",
    date: "2026-09-14",
    title: "Contact and assessment forms now do more to turn away bots and spam",
    detail: "Real people filling in the assessment are not slowed down; automated junk is stopped before it reaches the team.",
  },
  {
    id: "2026-09-04-privacy-policy",
    date: "2026-09-04",
    title: "Privacy page now sends visitors to the single LINK.com.au privacy policy",
    detail: "One policy to keep up to date instead of several that could drift apart.",
  },
  {
    id: "2026-09-01-privacy-page",
    date: "2026-09-01",
    title: "Privacy page rewritten to point to the main policy and to claim only what is true",
    detail: "Keeps the confidentiality promises that matter to people in difficulty, and corrects a claim about anonymity that overstated things.",
  },
  {
    id: "2026-08-07-new-design",
    date: "2026-08-07",
    title: "Site updated to the new LINK look: new typeface, underlines, buttons and menu",
    detail: "Headings, buttons and spacing were tidied so the site matches the rest of LINK.com.au. The words and the assessment are unchanged.",
  },
  {
    id: "2026-08-03-true-black-text",
    date: "2026-08-03",
    title: "Text switched to true black with clearer body copy, so pages are easier to read",
  },
  {
    id: "2026-08-02-assessment-error",
    date: "2026-08-02",
    title: "Assessment now shows an error and the phone number if details could not be saved",
    detail: "Previously it could show a success page when nothing had been recorded, which is the worst outcome for someone in distress.",
  },
  {
    id: "2026-07-31-how-heard",
    date: "2026-07-31",
    title: "Forms now ask how people heard about us, with options suited to referrals",
    detail: "Accountant, lawyer and AI assistant referrals can now be counted, which web tracking alone cannot see.",
  },
  {
    id: "2026-07-31-confidentiality",
    date: "2026-07-31",
    title: "The confidentiality promise now appears in full, in the same words, beside every call to action",
    detail: "It answers the fear that stops many directors picking up the phone: that ringing for advice starts something they cannot stop.",
  },
  {
    id: "2026-07-31-contact-page",
    date: "2026-07-31",
    title: "New contact page: call now, ask for a call back, or take the assessment first",
    detail: "People who already want to talk to someone are no longer handed a questionnaire first.",
  },
  {
    id: "2026-07-31-llms-txt",
    date: "2026-07-31",
    title: "AI assistants now get a plain summary of what we do, and the privacy contact details are correct",
    detail: "The privacy page no longer points to a contact form that did not exist; it gives the phone number and postal address.",
  },
  {
    id: "2026-07-30-email-addresses-removed",
    date: "2026-07-30",
    title: "Email addresses removed from the public site so scrapers cannot harvest them",
    detail: "Visitors contact us by phone or the forms instead.",
  },
  {
    id: "2026-07-30-result-email-sender",
    date: "2026-07-30",
    title: "Result emails to visitors now come from LINK's own verified domain",
    detail: "They are more likely to arrive in the inbox rather than being treated as untrusted mail.",
  },
  {
    id: "2026-07-30-enquiry-delivery",
    date: "2026-07-30",
    title: "Assessment and enquiry notifications now go to the same team address as LINK Advisors",
    detail: "Enquiries have a confirmed place to land and are not sent to an address nobody had checked.",
  },
  {
    id: "2026-07-30-footer",
    date: "2026-07-30",
    title: "Footer headings and links made brighter and easier to read",
  },
  {
    id: "2026-07-28-sbr-estimator",
    date: "2026-07-28",
    title: "Small business restructuring page now has an outcome estimator",
    detail: "Visitors can see an indicative plan range, monthly payments and the debt written off, along with the eligibility checks.",
  },
  {
    id: "2026-07-28-conversion-release",
    date: "2026-07-28",
    title: "Added a track record section, a what-it-costs page and result emails to visitors",
    detail: "Real outcomes and reviews build trust on the homepage, the costs page explains how billing is staged, and people get a copy of their result by email.",
  },
  {
    id: "2026-07-28-team-and-story",
    date: "2026-07-28",
    title: "Added the founder story, the frontline team and their photos, with growth accountants positioning",
    detail: "Shows visitors who they would be dealing with and why a firm that also does books, tax and marketing can help.",
  },
  {
    id: "2026-07-28-header-fix",
    date: "2026-07-28",
    title: "Header menu no longer wraps or crowds the logo on laptop screens",
  },
  {
    id: "2026-07-28-assessment-funnel",
    date: "2026-07-28",
    title: "Assessment now starts with a business lookup and email so unfinished ones can be followed up",
    detail: "Each answer is saved as people go, so someone who gets interrupted partway is still a lead the team can call back.",
  },
  {
    id: "2026-07-28-free-tools",
    date: "2026-07-28",
    title: "Added free tools: ATO interest calculator, DPN deadline checker and an insolvency self-check",
    detail: "Useful in their own right and a way for people searching for these topics to find the site. A reassurance strip on the homepage tells visitors there is no judgement.",
  },
  {
    id: "2026-07-28-ux-seo-pass",
    date: "2026-07-28",
    title: "Added pages for payment plans, voluntary administration and safe harbour, plus a mobile call bar",
    detail: "Comparison tables help visitors choose between options, and phones now show call and assessment buttons at all times.",
  },
  {
    id: "2026-07-28-faster-images",
    date: "2026-07-28",
    title: "Logo and brand images now load faster",
  },
  {
    id: "2026-07-28-launch",
    date: "2026-07-28",
    title: "LINK Rescue launched: the rebuilt site with a six-question assessment that gives an instant result",
    detail: "Visitors answer six questions and see a clear rating on screen, with four information pages on the main rescue topics. Enquiries reach the team and nothing is silently dropped.",
  },
];
