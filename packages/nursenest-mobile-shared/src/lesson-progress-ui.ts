import type { MobilePathwayLessonListRow, PathwayLessonProgressStatus } from "./lesson-types.js";

/** Stable key aligned with `progressByPathwaySlug` from pathway-lessons API. */
export function pathwayLessonProgressKey(row: Pick<MobilePathwayLessonListRow, "pathwayMeta">): string {
  return `${row.pathwayMeta.pathwayId}:${row.pathwayMeta.slug}`;
}

/**
 * Progress pill label for list rows — mirrors previous inline `progressLabel` logic.
 * Returns null when not started or map missing.
 */
export function lessonListProgressPillText(
  row: MobilePathwayLessonListRow,
  map: Record<string, PathwayLessonProgressStatus> | null | undefined,
): string | null {
  if (!map) return null;
  const s = map[pathwayLessonProgressKey(row)];
  if (!s || s === "not_started") return null;
  if (s === "completed") return "Done";
  return "In progress";
}
