/**
 * Shared lesson-loader constants that should not pull the full lesson loader graph.
 * Import from here when a module only needs config, not lesson data access.
 */

/** Related lessons block on lesson detail — small bounded list. */
export const RELATED_PATHWAY_LESSONS_LIMIT = 8;
/** Topic-filtered question hub / cross-links: same numeric cap as {@link RELATED_PATHWAY_LESSONS_LIMIT}. */
export const RELATED_LESSONS_FOR_TOPIC_CAP = RELATED_PATHWAY_LESSONS_LIMIT;
/** Pass to `getRelatedPathwayLessons` when no lesson should be excluded (hub / topic-only views). */
export const RELATED_LESSONS_EXCLUDE_SLUG_SENTINEL = "__related_lessons_exclude_none__";

/** Hub lesson search: ignore single-character noise; cap length for safety. */
export const PATHWAY_HUB_SEARCH_MIN_LEN = 2;
export const PATHWAY_HUB_SEARCH_MAX_LEN = 80;

/** Normalized search string for pathway lesson hubs (catalog + DB lists), or `undefined` when inactive. */
export function normalizePathwayHubSearchQuery(raw: string | undefined): string | undefined {
  if (typeof raw !== "string") return undefined;
  const t = raw.trim();
  if (t.length < PATHWAY_HUB_SEARCH_MIN_LEN) return undefined;
  return t.slice(0, PATHWAY_HUB_SEARCH_MAX_LEN);
}

export const PATHWAY_LESSON_DB_TIMEOUT_MS = 1000;

/**
 * Marketing lessons hub runs {@link verifyMarketingHubLessonRowsResolve} with one Prisma read per slug.
 *
 * Previously 15 000 ms: with 400 slugs at concurrency=8, the worst case was 50 rounds × 15 s = 750 s.
 * Now 4 000 ms: the hub verify scope is also capped to the current page size (see hub page.tsx), so
 * page 1 at concurrency=8 means at most 8 rounds × 4 s = 32 s worst-case (all time out). Normal
 * latency is well under 500 ms per query, giving 8 rounds × 500 ms = 4 s per page.
 *
 * If a slug's DB row takes longer than 4 s, the verify returns `detail_loader_miss` and the row is
 * kept as `hubMarketingDegraded` via the soft-recovery path — the hub still renders, just with that
 * lesson's card link suppressed until the next request succeeds.
 */
export const PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS = 4_000;
