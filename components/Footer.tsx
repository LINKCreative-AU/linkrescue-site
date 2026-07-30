import Image from "next/image";
import { Logo } from "./Logo";
import { DISCLAIMER, SITE } from "@/lib/site";
import symbol from "@/public/link-symbol-reversed.png";

const HELP = [
  { label: "Business rescue assessment", href: "/assessment" },
  { label: "ATO debt help", href: "/ato-debt-help" },
  { label: "ATO payment plans", href: "/ato-payment-plan" },
  { label: "Director Penalty Notices", href: "/director-penalty-notice" },
  { label: "Small business restructuring", href: "/small-business-restructuring" },
  { label: "Voluntary administration", href: "/voluntary-administration" },
  { label: "Safe harbour", href: "/safe-harbour" },
  { label: "Alternatives to liquidation", href: "/liquidation-alternatives" },
  { label: "What it costs", href: "/what-it-costs" },
];

const TOOLS = [
  { label: "ATO payment plan calculator", href: "/ato-payment-plan-calculator" },
  { label: "Am I insolvent? 12-sign check", href: "/am-i-insolvent" },
  { label: "DPN deadline checker", href: "/director-penalty-notice" },
];

const COMPANY = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Who you talk to", href: "/#team" },
  { label: "Privacy", href: "/privacy" },
  { label: "The LINK group", href: SITE.group.url, external: true },
];

export function Footer() {
  return (
    <footer className="bg-ink py-16 text-white">
      <div className="container-x">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo onDark height={22} />
            <p className="mt-5 max-w-sm text-sm text-white/70">
              Confidential help for business owners under pressure: ATO debt,
              director penalties, creditor stress and the paths through them.{" "}
              {SITE.group.line}
            </p>
            <p className="mt-5 text-sm text-white/70">
              <a href={SITE.phoneHref} className="hover:text-white">
                {SITE.phone}
              </a>
              <br />
              <a href={`mailto:${SITE.email}`} className="hover:text-white">
                {SITE.email}
              </a>
            </p>
          </div>

          <FooterCol title="How we help" links={HELP} />
          <FooterCol title="Free tools" links={TOOLS} />
          <FooterCol title="Company" links={COMPANY} />
        </div>

        <p className="mt-10 max-w-4xl border-t border-white/10 pt-6 text-xs leading-relaxed text-white/55">
          {DISCLAIMER}
        </p>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 text-xs text-white/55 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} LINK Rescue · ABN {SITE.abn}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p>
              Backed by{" "}
              <a href={SITE.group.url} className="underline hover:text-white/80">
                LINK
              </a>
              . Power forward.
            </p>
            <a href={SITE.group.url} aria-label="LINK group">
              <Image src={symbol} alt="LINK symbol" height={26} className="opacity-90" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <p className="font-semibold text-white">
        {title}
        <span className="text-rescue-bright">.</span>
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-sm text-white/60 transition hover:text-white"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
