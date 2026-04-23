"use client";

import { useLayoutEffect } from "react";
import { setAdminLearnerQaClientAnalyticsSuppress } from "@/lib/observability/posthog-client";

/** Suppresses PostHog capture while admin staff run signed learner QA simulation (no production billing writes). */
export function AdminLearnerQaPosthogSuppressor({ active }: { active: boolean }) {
  useLayoutEffect(() => {
    setAdminLearnerQaClientAnalyticsSuppress(active);
    return () => setAdminLearnerQaClientAnalyticsSuppress(false);
  }, [active]);
  return null;
}
