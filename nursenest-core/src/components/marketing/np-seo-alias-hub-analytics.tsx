"use client";

import { useEffect, useRef } from "react";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";

/**
 * Fires once per NP SEO alias hub mount so funnels can segment by `np_seo_alias_segment` without relying on URL parsing in PostHog alone.
 */
export function NpSeoAliasHubAnalytics({
  pathwayId,
  aliasSegment,
}: {
  pathwayId: string;
  aliasSegment: string;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackClientEvent(PH.marketingNpSeoAliasHubView, {
      pathway_id: pathwayId,
      np_seo_alias_segment: aliasSegment,
      from_np_seo_alias: true,
    });
  }, [pathwayId, aliasSegment]);
  return null;
}
