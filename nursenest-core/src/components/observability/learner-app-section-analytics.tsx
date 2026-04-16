"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isLearnerShell } from "@/lib/navigation/learner-shell";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { appSectionFromPathname, PH } from "@/lib/observability/posthog-conversion-events";
import { isClientDurabilityNonCriticalDisabled } from "@/lib/durability/client-durability-flags";

/** Emits `app_section_view` on learner-shell routes (see {@link isLearnerShell}) — feature usage breakdown. */
export function LearnerAppSectionAnalytics() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (isClientDurabilityNonCriticalDisabled()) return;
    if (!pathname || !isLearnerShell(pathname)) return;
    const section = appSectionFromPathname(pathname);
    const key = `${section}:${pathname}`;
    if (last.current === key) return;
    last.current = key;
    trackClientEvent(PH.appSectionView, { actor: "authenticated", section, path: pathname });
  }, [pathname]);

  return null;
}
