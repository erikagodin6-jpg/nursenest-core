"use client";

import { useEffect } from "react";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";

const storageKey = (pathwayId: string, aliasSegment: string) =>
  `ph_np_alias_hub_view_v1:${pathwayId}:${aliasSegment}`;

/**
 * Fires once per browser tab session per (pathway, alias) for `marketing_np_seo_alias_hub_view`.
 *
 * `useRef` alone is insufficient: React 18 Strict Mode remounts dev components and resets refs. SessionStorage
 * dedupes across remounts; production single-mount still fires exactly once per session visit.
 */
export function NpSeoAliasHubAnalytics({
  pathwayId,
  aliasSegment,
  canonicalPathwayHubPath,
  countrySlug,
  examFamily,
}: {
  pathwayId: string;
  aliasSegment: string;
  canonicalPathwayHubPath: string;
  countrySlug: string;
  examFamily: string;
}) {
  useEffect(() => {
    const key = storageKey(pathwayId, aliasSegment);
    try {
      if (typeof window !== "undefined" && sessionStorage.getItem(key)) {
        return;
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem(key, "1");
      }
    } catch {
      /* private mode / quota — still track once this mount */
    }

    trackClientEvent(PH.marketingNpSeoAliasHubView, {
      pathway_id: pathwayId,
      np_alias_slug: aliasSegment,
      np_seo_alias_segment: aliasSegment,
      from_np_seo_alias: true,
      canonical_pathway_hub_path: canonicalPathwayHubPath,
      pathway_country_slug: countrySlug,
      exam_family: examFamily,
      destination_type: "np_alias_hub_entry",
    });
  }, [pathwayId, aliasSegment, canonicalPathwayHubPath, countrySlug, examFamily]);
  return null;
}
