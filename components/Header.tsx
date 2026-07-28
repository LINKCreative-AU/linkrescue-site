"use client";

import { useState } from "react";
import { Logo } from "./Logo";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <a href="/" aria-label="LINK Rescue home">
          <Logo />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-ink/60 transition hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={SITE.phoneHref} className="text-sm font-semibold text-ink/70 hover:text-ink">
            {SITE.phone}
          </a>
          <a href="/assessment" className="btn btn-rescue">
            Start the assessment
          </a>
        </div>

        <button className="lg:hidden" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-ink" />
            <span className="block h-0.5 w-6 bg-ink" />
            <span className="block h-0.5 w-6 bg-ink" />
          </div>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-white px-6 py-4 lg:hidden">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-ink/80"
            >
              {n.label}
            </a>
          ))}
          <a
            href="/assessment"
            onClick={() => setOpen(false)}
            className="btn btn-rescue mt-3 w-full"
          >
            Start the assessment
          </a>
          <a href={SITE.phoneHref} className="btn btn-ghost mt-2 w-full">
            Call {SITE.phone}
          </a>
        </nav>
      )}
    </header>
  );
}
