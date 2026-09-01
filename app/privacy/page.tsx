import type { Metadata } from "next";
import { SITE } from "@/lib/site";

// CUT DOWN TO A POINTER, 31 Aug 2026, on the client's instruction: each
// division site's /privacy should open, say the complete policy is at
// link.com.au, and give you a link to click.
//
// This one was a full standalone mini-policy rather than a thin layer - it
// never had the treatment the other divisions got in August - so this is a
// rewrite, not a trim.
//
// THIS PAGE KEEPS MORE THAN ITS SIBLINGS, and the reason is the audience. The
// people reading this are in financial distress and deciding whether it is
// safe to type anything at all. Confidentiality is the product here, so the
// specific promises stay even though the general handling goes.
//
// THREE THINGS ARE KEPT, all checked against the group policy on 31 Aug 2026:
//
//   1. THE ASSESSMENT IS ANONYMOUS unless you choose to leave contact details.
//      Nothing in the group policy says this, and it is the single fact most
//      likely to decide whether someone uses the tool.
//   2. A RESCUE ENQUIRY IS NEVER USED FOR UNRELATED MARKETING. This is a
//      STRONGER commitment than the group policy, whose direct marketing
//      clause permits sending information about LINK services "where you would
//      reasonably expect us to". Deleting this sentence would quietly weaken a
//      promise made to people at their worst moment. It must not be removed
//      without someone deciding, on the record, to withdraw the promise.
//   3. DISCLOSURE TO INSOLVENCY PRACTITIONERS, only with your knowledge. The
//      word "insolvency" does not appear in the group policy at all.
//
// Also kept, briefly: what runs on the site. Vercel Analytics only, no tag
// manager and no advertising pixel - checked across app/, components/ and
// lib/ - and assessment answers are never sent to it.
//
// REMOVED because the group policy carries it: collection, use, storage,
// retention, security, access and correction, the Privacy Officer's contact
// details and the OAIC escalation route.
//
// THE ABN IS DELIBERATELY NOT STATED HERE. lib/site.ts carries it with a
// "TODO confirm entity ABN for the rescue offering" against it, and an
// unconfirmed ABN is not something to assert on a privacy page. The group
// policy names the responsible entities under the Privacy Act, so this page
// points there instead. Put it back once the entity is confirmed.
//
// CORRECTED 1 Sep 2026, after an audit checked the page against the code.
//
//   - THE ANONYMITY CLAIM WAS FALSE and had been inherited from the page this
//     replaced, then made stronger in the rewrite without anyone checking it.
//     components/Assessment.tsx asks for email on the FIRST screen as a
//     required field, and lib/leads.ts creates the cart "the moment business +
//     email land", then pushes {stage:"progress", answers} on every single
//     question. So on the default path the answers are tied to an email from
//     question one and a half-finished assessment sits on the server, which is
//     the opposite of what the page promised. The copy now describes that, and
//     names the skip link as the way to actually stay unlinked. If the flow
//     changes, this paragraph changes with it.
//   - THE DELETION RIGHT came back. The page this replaced promised deletion
//     on request; the group policy promises access and correction and says
//     nothing about deletion, so cutting it withdrew a published right by
//     accident.
//   - THE COVERAGE CLAIM was softened. The group policy's "Who this policy
//     covers" list names Advisors, Books, Advance, Living, Wealth, Creative,
//     Marketing, Cowork, Recruitment and Culture - NOT Rescue - and no entity
//     in it is listed as operating Rescue. Saying it "covers LINK Rescue" was
//     asserting something the document does not support. The real fix is on
//     link.com.au: add Rescue to the division and entity lists. Until that
//     happens this page points at the group policy without claiming to be
//     named in it.
//
// NOT LEGAL REVIEW. The group policy has been through its own process; this
// page's site-specific wording has not.

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "The complete LINK privacy policy is at link.com.au. What the assessment saves and when, and our promise that a rescue enquiry is never used for marketing.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <main className="container-x py-14 lg:py-20">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl font-normal tracking-tight text-ink">Privacy.</h1>

        <p className="mt-6 leading-relaxed text-ink/75">
          We have a complete privacy policy available at link.com.au. It is the LINK group policy
          and it is how the group handles your personal information - what we collect, why, who we
          disclose it to, how it is held and how long for, and how to access it, correct it or
          complain.
        </p>

        <div className="mt-8">
          <a
            href="https://link.com.au/privacy"
            target="_blank"
            rel="noopener"
            className="btn btn-primary"
          >
            Read the LINK Privacy Policy
          </a>
          <p className="mt-3 text-sm text-ink/55">
            One policy for the whole group, kept in one place - so it is always the current
            version.
          </p>
        </div>

        <div className="mt-10 space-y-6 leading-relaxed text-ink/75">
          <h2 className="font-display text-2xl font-semibold text-ink">
            What that policy does not say, and this page does.
          </h2>
          <p>
            Confidentiality is the whole point of this site, so three things are worth saying
            plainly rather than leaving you to find them in a group document.
          </p>
          <p>
            <strong className="font-semibold text-ink">What the assessment saves, and when.</strong>{" "}
            The first screen asks for your email, and if you give it, your answers are saved
            against it as you go - not at the end. That is so we can pick the conversation up
            with you if you stop partway, which people in this position often do. If you would
            rather not, the &ldquo;I would rather not say yet&rdquo; link on that screen skips it
            and nothing you answer is linked to you at all.
          </p>
          <p>
            <strong className="font-semibold text-ink">
              A rescue enquiry is never used for marketing.
            </strong>{" "}
            Not for our services, not for another LINK division&rsquo;s. You came here about one
            thing and it is used for that one thing.
          </p>
          <p>
            <strong className="font-semibold text-ink">
              Nothing goes to an insolvency practitioner behind your back.
            </strong>{" "}
            Where it helps to bring in a registered practitioner or another professional, that
            happens as part of helping you and with your knowledge, not quietly.
          </p>

          <h2 className="font-display text-2xl font-semibold text-ink">
            What runs on this website.
          </h2>
          <p>
            Privacy-friendly analytics that counts pages, and nothing else - no tag manager, no
            advertising pixel, no tracking between sites. Your assessment answers are never sent
            to it.
          </p>
          <p>
            <strong className="font-semibold text-ink">You can ask us to delete it.</strong> Not
            just to see it or correct it - if you want what we hold about you gone, ask and we
            will delete it.
          </p>

          <p>
            If you would rather talk to a person about any of this, call{" "}
            <a href={SITE.phoneHref} className="font-semibold text-rescue">
              {SITE.phone}
            </a>{" "}
            or use the{" "}
            <a href="/contact" className="font-semibold text-rescue">
              contact page
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
