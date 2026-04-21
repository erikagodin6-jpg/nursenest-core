/**
 * Pathway lesson hub scaling — targets and safe bounds.
 *
 * - Public hubs use **offset pagination** with a hard max page size so each request stays O(pageSize).
 * - **Total counts** for a pathway come from DB when any published row exists; otherwise catalog.json length
 *   (see {@link countPathwayLessons} in pathway-lesson-loader).
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

/** Default rows per marketing pathway hub page (tunable; keep ≤ max for predictable memory). */
export const PATHWAY_HUB_PAGE_SIZE_DEFAULT = 72;
/**
 * Upper bound for a single hub request — raised to match the architecture scale ceiling so the
 * lessons hub can render all hub-metadata rows in a single page (no full lesson bodies are loaded).
 * Hub-list rows are metadata-only (no section bodies); loading up to 500 is safe.
 * Deep pagination is still supported when a pathway eventually exceeds this count.
 */
export const PATHWAY_HUB_PAGE_SIZE_MAX = PATHWAY_LESSONS_SCALE_CEILING; // 500

/** Subscriber app `/app/lessons` default page size when `limit` is omitted (max 50 via {@link parseLessonLibraryLimit}). */
export const LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT = 20;
/** @deprecated Use {@link LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT} or per-request `limit`. */
export const LEARNER_APP_LESSONS_PAGE_SIZE = LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT;

/** When hub has more pages than this, show First/Last links (see pathway-lesson-pagination). */
export const PATHWAY_HUB_PAGINATION_SHOW_ENDLINKS_MIN_PAGES = 3;

/** Absolute safety cap: catalog pathways with more lessons are truncated for list/hub pagination math. */
export const PATHWAY_CATALOG_LIST_HARD_CAP = 2_000;
