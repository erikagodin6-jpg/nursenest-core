import { buildLessonCategoryProgress } from "@/lib/lessons/build-lesson-category-progress";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

export type PathwayProgressCounts = {
  completedCount: number;
  inProgressCount: number;
  totalCount: number;
};

export { buildLessonCategoryProgress } from "@/lib/lessons/build-lesson-category-progress";

export function aggregatePathwayLessonProgress(
  lessons: readonly Pick<PathwayLessonRecord, "slug">[],
  progressMap: Record<string, PathwayLessonProgressStatus>,
): PathwayProgressCounts {
  const snap = buildLessonCategoryProgress({ lessons, progressMap });
  return {
    completedCount: snap.completedCount,
    inProgressCount: snap.inProgressCount,
    totalCount: snap.totalCount,
  };
}
