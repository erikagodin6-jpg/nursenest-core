import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

/**
 * Preview-only slice for SSR. Does not encode entitlement; callers must pass `fullAccess`
 * from {@link canViewFullPathwayLesson}.
 */
export function visibleSectionsForLesson(
  lesson: PathwayLessonRecord,
  fullAccess: boolean,
): PathwayLessonRecord["sections"] {
  if (fullAccess) return lesson.sections;
  const total = lesson.sections.length;
  if (total === 0) return [];
  const n = Math.min(Math.max(lesson.previewSectionCount, 1), total);
  return lesson.sections.slice(0, n);
}
