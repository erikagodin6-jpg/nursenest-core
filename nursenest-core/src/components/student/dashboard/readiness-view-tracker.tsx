"use client";

import { useEffect, useRef } from "react";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import type { ReadinessBand, ReadinessTrend } from "@/lib/learner/readiness-score";

/**
 * Fires a single PostHog event when the readiness card enters the viewport.
 * Invisible wrapper; renders children as-is.
 */
export function ReadinessViewTracker({
  score,
  band,
  trend,
  children,
}: {
  score: number | null;
  band: ReadinessBand;
  trend: ReadinessTrend | null;
  children: React.ReactNode;
}) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackClientEvent("readiness_viewed", {
      score: score ?? undefined,
      band,
      trend: trend ?? undefined,
    });
  }, [score, band, trend]);

  return <>{children}</>;
}
