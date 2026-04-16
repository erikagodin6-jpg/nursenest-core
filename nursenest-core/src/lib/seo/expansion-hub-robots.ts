/**
 * Robots policy for regional marketing hubs (`/exams/…`).
 * Non-**published** regions (see launch readiness) are **noindex** so unfinished markets do not compete in search.
 */
import type { Metadata } from "next";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { isRegionPublishedForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";

export function robotsForRegionalMarketingHub(region: GlobalRegionSlug): NonNullable<Metadata["robots"]> {
  if (isRegionPublishedForPublicSite(region)) {
    return { index: true, follow: true };
  }
  return { index: false, follow: true };
}
