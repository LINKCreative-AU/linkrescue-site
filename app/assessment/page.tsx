import type { Metadata } from "next";
import { Assessment } from "@/components/Assessment";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { DISCLAIMER, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Business Rescue Assessment - Instant Result",
  description:
    "Tell us your business, answer six questions about cash flow, ATO debt, creditor pressure and solvency, and get an instant result with a clear next step. Free and confidential.",
  alternates: { canonical: "/assessment" },
};

export default function AssessmentPage() {
  return (
    <main className="bg-cloud/50">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Assessment", path: "/assessment" },
        ])}
      />
      <div className="container-x py-14 lg:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow guide-line-inline text-rescue">
            <span className="text-neutral-500">Business rescue assessment</span>
          </p>
          <h1 className="mt-5 font-display text-4xl font-normal leading-[1.02] tracking-tight text-ink sm:text-5xl">
            Six questions. <span className="marker">Instant result</span>.
          </h1>
          <p className="mt-5 text-lg text-ink/75">
            Your result appears the moment the last question is answered. If
            you would rather talk first,{" "}
            <a href={SITE.phoneHref} className="font-semibold text-rescue hover:text-rescue-dark">
              call {SITE.phone}
            </a>
            .
          </p>

          <div className="mt-8">
            <Assessment />
          </div>

          <p className="mt-8 text-xs leading-relaxed text-ink/45">{DISCLAIMER}</p>
        </div>
      </div>
    </main>
  );
}
