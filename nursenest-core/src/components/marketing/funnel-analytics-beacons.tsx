"use client";

import { useEffect, useRef } from "react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { pathwayAnalyticsDimensions, trackProductEvent } from "@/lib/observability/product-analytics";

/** One lightweight capture per homepage load (marketing region = US | CA). */
export function FunnelHomepageViewBeacon({
  marketingRegion,
  marketingLocale,
}: {
  marketingRegion: "US" | "CA";
  /** BCP-47 marketing UI locale (overlay). */
  marketingLocale?: string;
}) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackProductEvent(PH.funnelHomepageViewed, {
      actor: "anonymous",
      marketing_region: marketingRegion,
      marketing_locale: marketingLocale ?? "en",
    });
  }, [marketingRegion, marketingLocale]);
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
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackProductEvent(PH.funnelExamHubViewed, {
      actor: "anonymous",
      hub_path: hubPath,
      ...pathwayAnalyticsDimensions(pathway),
    });
  }, [pathway, hubPath]);
  return null;
}
