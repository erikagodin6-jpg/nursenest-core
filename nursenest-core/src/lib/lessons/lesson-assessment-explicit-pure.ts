import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";

/** Prefer non-empty explicit bank-backed lists; otherwise use merged catalog+bank results. */
export function preferExplicitAssessmentSide(
  explicit: PathwayLessonQuizItem[] | null | undefined,
  merged: PathwayLessonQuizItem[],
): PathwayLessonQuizItem[] {
  return explicit && explicit.length > 0 ? explicit : merged;
}
