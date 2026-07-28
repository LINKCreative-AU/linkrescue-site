"use client";

import { useState } from "react";
import { Logo } from "./Logo";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <a href="/" aria-label="LINK Rescue home" className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="whitespace-nowrap text-sm font-medium text-ink/60 transition hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <a
            href={SITE.phoneHref}
            className="hidden whitespace-nowrap text-sm font-semibold text-ink/75 hover:text-ink xl:block"
          >
            {SITE.phone}
          </a>
          <a href="/assessment" className="btn btn-rescue whitespace-nowrap">
            Start the assessment
          </a>
        </div>

        <div className="flex items-center gap-5 lg:hidden">
          {/* Urgent callers are the highest-value mobile visitors - keep the phone one tap away */}
          <a href={SITE.phoneHref} aria-label={`Call ${SITE.phone}`} className="text-rescue">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" />
            </svg>
          </a>
          <button aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <div className="space-y-1.5">
              <span className="block h-0.5 w-6 bg-ink" />
              <span className="block h-0.5 w-6 bg-ink" />
              <span className="block h-0.5 w-6 bg-ink" />
            </div>
          </button>
        </div>
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
