/**
 * Published-only regional marketing URLs for sitemaps and link eligibility.
 * Aligns with Edge `proxy.ts` (unpublished → redirect) and `robotsForRegionalMarketingHub` (noindex).
 */
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { EXAMS_MARKETING_SEGMENT_TO_REGION } from "@/lib/marketing/expansion-exams-path-gate";
import { globalRegionSlugFromRegionalMarketingPublicPath } from "@/lib/marketing/regional-marketing-public-gate";
import { isRegionPublishedForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";

/** `/exams/{segment}` paths allowed in sitemaps when the region is published. */
export function listPublishedExpansionExamMarketingPaths(): string[] {
  const out: string[] = [];
  for (const [segment, region] of Object.entries(EXAMS_MARKETING_SEGMENT_TO_REGION) as [string, GlobalRegionSlug][]) {
    if (isRegionPublishedForPublicSite(region)) {
      out.push(`/exams/${segment}`);
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
}

/**
 * True when a root-relative path (or absolute URL) is safe to list in sitemaps / marketing links.
 * Paths tied to an unpublished expansion region return false.
 */
export function isRegionalMarketingUrlPublished(pathOrUrl: string): boolean {
  try {
    const path = pathOrUrl.includes("://") ? new URL(pathOrUrl).pathname : pathOrUrl;
    const region = globalRegionSlugFromRegionalMarketingPublicPath(path);
    if (!region) return true;
    return isRegionPublishedForPublicSite(region);
  } catch {
    return true;
  }
}

/** Home “global regions” cards: expansion rows map to `/exams/…` paths (see `home-global-regions-section`). */
const HOME_EXPANSION_CARD_ID_TO_PATH: Record<string, string> = {
  ph: "/exams/philippines",
  me: "/exams/middle-east",
  cn: "/exams/china",
};

/** Card ids (`us`, `ca`, …) safe to show on the marketing homepage. */
let publishedHomeGlobalRegionCardIdsCache: string[] | null = null;

export function listPublishedHomeGlobalRegionCardIds(): string[] {
  if (publishedHomeGlobalRegionCardIdsCache) return publishedHomeGlobalRegionCardIdsCache;
  const out: string[] = ["us", "ca"];
  for (const [id, p] of Object.entries(HOME_EXPANSION_CARD_ID_TO_PATH)) {
    if (isRegionalMarketingUrlPublished(p)) out.push(id);
  }
  publishedHomeGlobalRegionCardIdsCache = out;
  return out;
}
