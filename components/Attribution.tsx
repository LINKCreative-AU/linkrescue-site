"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/components/Assessment";

// Mounted once in the root layout. captureAttribution already existed but was
// only called from inside the assessment, so a visitor who landed on a paid
// ad and went straight to the contact form arrived with nothing attached.
// Mounting it here records the landing page and campaign params on the first
// page of any session, whichever page that is.

export function Attribution() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
