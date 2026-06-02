/**
 * Client-side gate for the smart exam selector.
 *
 * Public marketing SSR stays static; auth and cookie checks happen in the browser.
 */
"use client";

import { useSession } from "next-auth/react";
import { ExamSelector } from "./exam-selector";

export function ExamSelectorGate() {
  const { data: session, status } = useSession();
  if (status === "loading") return null;
  if (session?.user) return null;
  return <ExamSelector geoRegion={null} />;
}
