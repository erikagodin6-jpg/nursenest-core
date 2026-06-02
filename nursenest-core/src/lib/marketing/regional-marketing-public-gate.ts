import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { DEFAULT_MARKETING_LOCALE, isMarketingLocaleCode } from "@/lib/i18n/marketing-locale-policy";
import { globalRegionSlugFromExpansionExamsPathname } from "@/lib/marketing/expansion-exams-path-gate";

/**
 * First URL segment (after optional marketing locale) for regional SEO topic trees
 * (`/japan/...`, `/india/...`, …) → {@link GlobalRegionSlug} used by launch readiness.
 * Must align with `src/app/(marketing)/(default)/{segment}/[topic]/`.
 */
const REGIONAL_TOPIC_TREE_FIRST_SEGMENT_TO_SLUG: Record<string, GlobalRegionSlug> = {
  japan: "japan",
  india: "india",
  china: "china",
  korea: "south-korea",
  germany: "germany",
  france: "france",
  italy: "italy",
  hungary: "hungary",
  portugal: "portugal",
  mexico: "mexico",
  australia: "aus",
  "middle-east": "uae",
};

/**
 * First URL segment for regional topic trees (`/japan/...`, `/india/...`, …).
 * Used by the Edge proxy matcher so locale-prefixed marketing URLs (`/fr/japan/...`) get the same
 * unpublished-region redirect as unprefixed routes.
 */
export const REGIONAL_MARKETING_TOPIC_PATH_SEGMENTS: readonly string[] = Object.keys(
  REGIONAL_TOPIC_TREE_FIRST_SEGMENT_TO_SLUG,
);

/**
 * Next.js `matcher` entries: `/:locale/{segment}` and `/:locale/{segment}/:path*` for each regional tree.
 */
export const REGIONAL_MARKETING_LOCALE_PREFIX_MATCHERS: readonly string[] = REGIONAL_MARKETING_TOPIC_PATH_SEGMENTS.flatMap(
  (segment) => [`/:locale/${segment}`, `/:locale/${segment}/:path*`] as const,
);

/**
 * Returns the expansion/global region for a marketing URL that should be gated the same way as
 * `/exams/…` hubs: regional exam hubs **or** country-topic SEO trees. `null` if this path is not
 * part of those surfaces (e.g. `/blog`, `/us/rn/…`).
 */
export function globalRegionSlugFromRegionalMarketingPublicPath(pathname: string): GlobalRegionSlug | null {
  const fromExams = globalRegionSlugFromExpansionExamsPathname(pathname);
  if (fromExams) return fromExams;

  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = p.split("/").filter(Boolean);
  let i = 0;
  const maybeLocale = parts[0];
  if (maybeLocale && isMarketingLocaleCode(maybeLocale) && maybeLocale !== DEFAULT_MARKETING_LOCALE) {
    i += 1;
  }
  const seg = parts[i];
  if (!seg) return null;
  return REGIONAL_TOPIC_TREE_FIRST_SEGMENT_TO_SLUG[seg] ?? null;
}
