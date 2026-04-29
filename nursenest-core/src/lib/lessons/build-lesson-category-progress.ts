import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

export type LessonSlugRef = { slug: string };

export type LessonCategoryProgressSnapshot = {
  completedCount: number;
  inProgressCount: number;
  totalCount: number;
  /** Rounded percentage of *completed* lessons over total (0–100). In-progress does not increase this value. */
  percentComplete: number;
};

/**
 * Pure aggregation for hub/category cards: counts per slug list + strict completion percentage.
 * Safe to call from server components and tests (no I/O).
 */
export function buildLessonCategoryProgress(input: {
  lessons: readonly LessonSlugRef[];
  progressMap: Record<string, PathwayLessonProgressStatus | undefined>;
}): LessonCategoryProgressSnapshot {
  let completedCount = 0;
  let inProgressCount = 0;
  for (const lesson of input.lessons) {
    const status = input.progressMap[lesson.slug];
    if (status === "completed") completedCount += 1;
    if (status === "in_progress") inProgressCount += 1;
  }
  const totalCount = input.lessons.length;
  const percentComplete =
    totalCount === 0 ? 0 : Math.min(100, Math.round((100 * completedCount) / totalCount));
  return { completedCount, inProgressCount, totalCount, percentComplete };
}
