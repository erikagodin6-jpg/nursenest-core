import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

/**
 * Learner study inventory (flashcards, lesson-linked practice) must only use lessons that pass the
 * structural publish gate — never draft / incomplete catalog rows.
 */
export function pathwayLessonEligibleForLearnerStudyInventory(lesson: PathwayLessonRecord): boolean {
  return lesson.structuralQuality?.publicComplete === true;
}
