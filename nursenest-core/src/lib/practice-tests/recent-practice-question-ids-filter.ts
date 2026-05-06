import { STUDY_DIVERSITY_PRACTICE_RECENT_MIN_REMAINING_DEFAULT } from "@/lib/study/study-diversity-config";

/** Narrow the pool by excluding recent ids when enough items remain; otherwise keep the full pool. */
export function filterPoolRemovingRecentQuestions<T extends { id: string }>(
  pool: T[],
  recent: Set<string>,
  minRemaining = STUDY_DIVERSITY_PRACTICE_RECENT_MIN_REMAINING_DEFAULT,
): { pool: T[]; applied: boolean; skipReason?: string } {
  if (recent.size === 0) return { pool, applied: false };
  const filtered = pool.filter((p) => !recent.has(p.id));
  if (filtered.length >= minRemaining) return { pool: filtered, applied: true };
  return { pool, applied: false, skipReason: "pool_too_small_after_recent_exclusion" };
}
