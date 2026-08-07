import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How LINK Rescue collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <main className="container-x py-14 lg:py-20">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl font-normal tracking-tight text-ink">
          Privacy policy.
        </h1>
        <div className="mt-8 space-y-6 leading-relaxed text-ink/75">
          <p>
            Confidentiality is the foundation of what this site does, so this
            policy is written to be read. LINK Rescue (ABN {SITE.abn}) collects
            personal information in line with the Privacy Act 1988 (Cth) and
            the Australian Privacy Principles.
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">What we collect.</h2>
          <p>
            Your assessment answers are collected anonymously and are not
            linked to you unless you choose to leave your contact details. If
            you do, we collect your name, phone number, email address, business
            name if provided, your assessment result, and how you found the
            site (referrer and campaign parameters).
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">How we use it.</h2>
          <p>
            Your information is used for one purpose: contacting you about your
            enquiry and helping you with it. Enquiries are stored securely,
            shared within the LINK Rescue team, and passed to trusted
            professionals such as registered insolvency practitioners only with
            your knowledge as part of helping you. We never sell your
            information and we never use a rescue enquiry for unrelated
            marketing.
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">Storage and security.</h2>
          <p>
            Enquiries are stored in access-controlled systems used by the LINK
            group. We keep information only as long as needed to help you and
            to meet our legal obligations, then delete it.
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">Analytics.</h2>
          <p>
            The site uses privacy-friendly analytics to understand how pages
            perform. Assessment answers are not sent to analytics tools.
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Access, correction and questions.
          </h2>
          <p>
            You can ask what we hold about you, ask us to correct it, or ask us
            to delete it by calling{" "}
            <a href={SITE.phoneHref} className="font-semibold text-rescue">
              {SITE.phone}
            </a>{" "}
            and asking for the privacy officer, through the{" "}
            <a href="/contact" className="font-semibold text-rescue">
              contact page
            </a>
            , or by writing to us at Level 1, 57 Berwick Street, Fortitude
            Valley QLD 4006. If you are not satisfied with our response you can
            contact the Office of the Australian Information Commissioner at
            oaic.gov.au.
          </p>
        </div>
      </div>
    </main>
  );
}
