import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { DEFAULT_MARKETING_LOCALE, isMarketingLocaleCode } from "@/lib/i18n/marketing-locale-policy";

/**
 * Maps `/exams/{segment}` URL segments (after optional `/{locale}`) to {@link GlobalRegionSlug}
 * for {@link isRegionPublishedForPublicSite}. Must stay aligned with regional hub `page.tsx`
 * `robotsForRegionalMarketingHub(...)` slugs.
 */
/** Exported for sitemap + link eligibility (same rules as Edge proxy). */
export const EXAMS_MARKETING_SEGMENT_TO_REGION: Record<string, GlobalRegionSlug> = {
  canada: "canada",
  japan: "japan",
  china: "china",
  korea: "south-korea",
  germany: "germany",
  france: "france",
  italy: "italy",
  hungary: "hungary",
  portugal: "portugal",
  mexico: "mexico",
  india: "india",
  australia: "aus",
  philippines: "philippines",
  uk: "uk",
  "middle-east": "uae",
};

/** Reverse map: region slug → first URL segment under `/exams/{segment}` (canonical shipped hub). */
export const EXAMS_REGION_TO_MARKETING_SEGMENT: Partial<Record<GlobalRegionSlug, string>> = (() => {
  const out: Partial<Record<GlobalRegionSlug, string>> = {};
  for (const [segment, region] of Object.entries(EXAMS_MARKETING_SEGMENT_TO_REGION) as [string, GlobalRegionSlug][]) {
    if (out[region] === undefined) out[region] = segment;
  }
  return out;
})();

/**
 * Returns the global region slug for an expansion exam marketing URL, or `null` if the path
 * is not a single-segment `/exams/…` hub (e.g. `/exams` alone or unknown segment).
 */
export function globalRegionSlugFromExpansionExamsPathname(pathname: string): GlobalRegionSlug | null {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = p.split("/").filter(Boolean);
  let i = 0;
  const maybeLocale = parts[0];
  if (maybeLocale && isMarketingLocaleCode(maybeLocale) && maybeLocale !== DEFAULT_MARKETING_LOCALE) {
    i = 1;
  }
  if (parts[i] !== "exams") return null;
  const segment = parts[i + 1];
  if (!segment) return null;
  return EXAMS_MARKETING_SEGMENT_TO_REGION[segment] ?? null;
}

/** Public fallback when a regional exam marketing hub is not published (see proxy gate). */
export const REGIONAL_EXAM_MARKETING_FALLBACK_PATH = "/lessons" as const;
