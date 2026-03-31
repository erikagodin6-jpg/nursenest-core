import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

/** When `topicSlugsIn` is set, lesson must match; empty array matches nothing; undefined matches all. */
export function alliedLessonMatchesProfessionFilter(
  lesson: Pick<PathwayLessonRecord, "topicSlug">,
  topicSlugsIn?: string[],
): boolean {
  if (topicSlugsIn === undefined) return true;
  if (topicSlugsIn.length === 0) return false;
  return topicSlugsIn.includes(lesson.topicSlug);
}
