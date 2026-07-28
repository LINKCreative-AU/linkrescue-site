"use client";

import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

// Fixed bottom action bar on small screens: distressed owners browse on
// phones, and the two actions that matter should never be more than one
// thumb-tap away. Hidden on the assessment flow and thank-you page, where
// the page itself is the action.
export function MobileCta() {
  const pathname = usePathname();
  if (pathname === "/assessment" || pathname === "/thank-you") return null;
  return (
    <>
      <div aria-hidden className="h-16 md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-2.5 backdrop-blur md:hidden">
        <div className="flex gap-2.5">
          <a href={SITE.phoneHref} className="btn btn-ghost flex-1 !py-2.5">
            Call {SITE.phone}
          </a>
          <a href="/assessment" className="btn btn-rescue flex-1 !py-2.5">
            Start the assessment
          </a>
        </div>
      </div>
    </>
  );
}
