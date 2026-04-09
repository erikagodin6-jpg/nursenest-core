/**
 * Pathway lesson hub scaling — targets and safe bounds.
 *
 * - Public hubs use **offset pagination** with a hard max page size so each request stays O(pageSize).
 * - **Total counts** for a pathway come from DB when any published row exists; otherwise catalog.json length
 *   (see {@link countPathwayLessons} in pathway-lesson-loader).
 * - Progress APIs are unchanged: they key off `lessonId` / synthetic pathway ids, not hub pages.
 */
/** Default rows per marketing pathway hub page (tunable; keep ≤ max for predictable memory). */
export const PATHWAY_HUB_PAGE_SIZE_DEFAULT = 48;
/** Upper bound for a single hub request — larger lists should paginate, not raise this arbitrarily. */
export const PATHWAY_HUB_PAGE_SIZE_MAX = 96;
/** Subscriber app `/app/lessons` list — small pages + indexed skip/take. */
export const LEARNER_APP_LESSONS_PAGE_SIZE = 24;
/** Content plan: minimum published-effective lessons per country/tier pathway before “scale-ready”. */
export const MIN_PATHWAY_LESSONS_SCALE_TARGET = 150;
/** Upper planning horizon — architecture (pagination + bounded selects) supports this without loading full sets. */
export const PATHWAY_LESSONS_SCALE_CEILING = 500;
/** When hub has more pages than this, show First/Last links (see pathway-lesson-pagination). */
export const PATHWAY_HUB_PAGINATION_SHOW_ENDLINKS_MIN_PAGES = 3;
