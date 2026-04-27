/**
 * Pathway lesson hub scaling — targets and safe bounds.
 *
 * - Public hubs use **offset pagination** with a hard max page size so each request stays O(pageSize).
 * - **Marketing hub totals** equal the normalized renderable list length (same pipeline as cards), not raw SQL/catalog row counts
 *   (see {@link getPathwayLessonsPageImpl} / {@link countPathwayLessonsPublic} in pathway-lesson-loader).
 * - Progress APIs are unchanged: they key off `lessonId` / synthetic pathway ids, not hub pages.
 * - Subscriber and API lists use {@link maxSafeOffsetPage} from `api-pagination-limits` so deep page numbers
 *   cannot force huge `skip` values (scales to 500+ lessons without unbounded offsets).
 * - Exam **domain** tagging for editorial planning: `lib/lessons/lesson-exam-domain.ts` (`inferLessonExamDomains`).
 *   Rationale→lesson matching uses `topicSlug` + ranking in `rationale-lesson-link-resolve`.
 */

/** Content plan: minimum published-effective lessons per country/tier pathway before "scale-ready". */
export const MIN_PATHWAY_LESSONS_SCALE_TARGET = 150;
/** Upper planning horizon — architecture (pagination + bounded selects) supports this without loading full sets. */
export const PATHWAY_LESSONS_SCALE_CEILING = 500;

/** Absolute safety cap: catalog pathways with more lessons are truncated for list/hub pagination math. */
export const PATHWAY_CATALOG_LIST_HARD_CAP = 2_000;

/** Default rows per marketing pathway hub page (URL `pageSize` default; first paint stays bounded). */
export const PATHWAY_HUB_PAGE_SIZE_DEFAULT = 60;
/**
 * Max unique slugs to run {@link verifyMarketingHubLessonRowsResolve} detail checks per hub request.
 * Remaining prepared rows are kept as inventory (degraded) so the grid + totals stay aligned without N detail reads.
 * Override with `NN_MARKETING_HUB_VERIFY_SLUG_CAP` (integer, clamped 60–2000).
 */
export const PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP = 400;
/**
 * Upper bound for marketing hub pagination slices + single-request metadata lists.
 * Hub cards are metadata-only (`sections: []`); align with {@link PATHWAY_CATALOG_LIST_HARD_CAP} for URL caps.
 * The curriculum grid still paginates at {@link PATHWAY_HUB_PAGE_SIZE_DEFAULT} by default so each paint stays bounded.
 */
export const PATHWAY_HUB_PAGE_SIZE_MAX = PATHWAY_CATALOG_LIST_HARD_CAP;

/** Subscriber app `/app/lessons` default page size when `limit` is omitted (max 50 via {@link parseLessonLibraryLimit}). */
export const LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT = 20;
/** @deprecated Use {@link LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT} or per-request `limit`. */
export const LEARNER_APP_LESSONS_PAGE_SIZE = LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT;

/** When hub has more pages than this, show First/Last links (see pathway-lesson-pagination). */
export const PATHWAY_HUB_PAGINATION_SHOW_ENDLINKS_MIN_PAGES = 3;

/**
 * Max raw `pathway_lessons` rows scanned when building subscriber `/app/lessons` from a Prisma filter.
 * Rows must pass the same {@link getPathwayLesson} contract as `/app/lessons/[id]`; the scan stays bounded.
 */
export const PATHWAY_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP = 8_000;

/**
 * Max `content_items` rows scanned when building subscriber `/app/lessons` from Prisma — each survivor must
 * pass the same detail contract as `/app/lessons/[id]` (see {@link evaluateAppLessonsHubContentItemRowRenderability}).
 */
export const CONTENT_ITEMS_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP = 8_000;
