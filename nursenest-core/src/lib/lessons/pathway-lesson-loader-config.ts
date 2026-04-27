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
 * Marketing lessons hub runs {@link verifyMarketingHubLessonRowsResolve} with one full-row Prisma read per slug.
 * The default 1s cap races large `sections` JSON and cold DB latency, returns fallback `null`, and collapses the hub
 * to a handful of “lucky” fast rows. Keep this bounded but high enough for production lesson payloads.
 */
export const PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS = 15_000;
