/**
 * Defense-in-depth limits for Prisma `take` / list sizes.
 * Prefer route-level {@link parseBoundedPageSize} and domain constants (e.g. {@link LESSON_API_OFFSET_LIMIT}) first;
 * use these when a query needs a simple numeric ceiling.
 */
export const DEFAULT_LIST_TAKE = 20;

/** Aligns with list API max page sizes (questions/lessons/decks). */
export const HARD_CAP_FIND_MANY = 100;

/**
 * Clamps a requested page size to `[1, HARD_CAP_FIND_MANY]`, with a default when missing/invalid.
 */
export function clampListTake(requested: number | undefined, fallback: number = DEFAULT_LIST_TAKE): number {
  if (requested === undefined || !Number.isFinite(requested)) {
    return Math.max(1, Math.min(HARD_CAP_FIND_MANY, fallback));
  }
  const n = Math.floor(Math.abs(requested));
  return Math.max(1, Math.min(HARD_CAP_FIND_MANY, n || fallback));
}
