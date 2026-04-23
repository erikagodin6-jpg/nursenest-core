/**
 * Canonical marketing “lessons hub” policy — one primary browse surface per exam pathway.
 *
 * - **Nursing (RN / PN / NP):** exactly one hub per published pathway: `/{country}/{role}/{exam}/lessons`.
 *   Topic/body-system scoping uses `?topicSlug=` (and search via `?q=`) on that same URL — never a second hub route.
 * - **Allied Health:** one hub per country pathway (`us-allied-core` / `ca-allied-core`). Profession-scoped lists
 *   use `?alliedProfession={professionKey}` on that same pathway URL. Legacy `/allied-health/{key}/lessons` 301s here.
 * - **New grad / pre-nursing:** `PRE_NURSING_LESSONS_INDEX_PATH` (separate product module; not mixed with exam pathways).
 * - **`/lessons`:** directory of pathway hubs (not a tier-scoped lesson library); links from here must land on
 *   a specific pathway hub above, not duplicate hub chrome.
 *
 * Use {@link isAlliedMarketingCorePathwayId} in loaders or audits to prevent new parallel allied lesson index routes.
 */

export const ALLIED_MARKETING_CORE_PATHWAY_IDS = ["us-allied-core", "ca-allied-core"] as const;

export type AlliedMarketingCorePathwayId = (typeof ALLIED_MARKETING_CORE_PATHWAY_IDS)[number];

export function isAlliedMarketingCorePathwayId(pathwayId: string): pathwayId is AlliedMarketingCorePathwayId {
  return (ALLIED_MARKETING_CORE_PATHWAY_IDS as readonly string[]).includes(pathwayId);
}

/** Query key for profession-scoped allied lists on the single allied pathway lessons hub. */
export const ALLIED_PROFESSION_QUERY_PARAM = "alliedProfession" as const;
