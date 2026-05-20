"use client";

import { useEffect, useRef } from "react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { useMarketingMobilePerfIsMobile } from "@/lib/ui/marketing-mobile-perf-context";

type AnalyticsProps = Record<string, string | number | boolean | undefined>;

function scheduleMarketingAnalyticsCapture(event: string, props: AnalyticsProps): void {
  if (typeof window === "undefined") return;

  const run = () => {
    void import("@/lib/observability/product-analytics")
      .then(({ trackProductEvent }) => {
        trackProductEvent(event, props);
      })
      .catch(() => {});
  };

  const scheduleIdle =
    window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 500));
  scheduleIdle(run, { timeout: 2500 });
}

function pathwayAnalyticsDimensionsLocal(
  p: Pick<ExamPathwayDefinition, "id" | "countrySlug" | "roleTrack" | "examCode" | "examKey" | "stripeTier">,
): Record<string, string> {
  return {
    pathway_id: p.id,
    country_slug: p.countrySlug,
    role_track: p.roleTrack,
    exam_code: p.examCode,
    exam_key: p.examKey,
    stripe_tier: String(p.stripeTier),
  };
}

/** One lightweight capture per homepage load (marketing region = US | CA). */
export function FunnelHomepageViewBeacon({
  marketingRegion,
  marketingLocale,
}: {
  marketingRegion: "US" | "CA";
  /** BCP-47 marketing UI locale (overlay). */
  marketingLocale?: string;
}) {
  const marketingNarrow = useMarketingMobilePerfIsMobile() === true;
  const sent = useRef(false);

  useEffect(() => {
    if (marketingNarrow) return;
    if (sent.current) return;
    sent.current = true;
    scheduleMarketingAnalyticsCapture(PH.funnelHomepageViewed, {
      actor: "anonymous",
      marketing_region: marketingRegion,
      marketing_locale: marketingLocale ?? "en",
    });
  }, [marketingNarrow, marketingRegion, marketingLocale]);

  return null;
}

/** Exam pathway marketing hub overview — once per mount. */
export function FunnelExamHubViewBeacon({
  pathway,
  hubPath,
}: {
  pathway: Pick<ExamPathwayDefinition, "id" | "countrySlug" | "roleTrack" | "examCode" | "examKey" | "stripeTier">;
  hubPath: string;
}) {
  const marketingNarrow = useMarketingMobilePerfIsMobile() === true;
  const sent = useRef(false);

  useEffect(() => {
    if (marketingNarrow) return;
    if (sent.current) return;
    sent.current = true;
    scheduleMarketingAnalyticsCapture(PH.funnelExamHubViewed, {
      actor: "anonymous",
      hub_path: hubPath,
      ...pathwayAnalyticsDimensionsLocal(pathway),
    });
  }, [marketingNarrow, pathway, hubPath]);

  return null;
}
