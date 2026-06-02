import type { PathwayLessonStructuralGate } from "@/lib/lessons/pathway-lesson-types";

/**
 * Incomplete lessons are blocked at the route layer; this notice is intentionally inert
 * so older imports do not surface internal authoring states to learners.
 */
export function LessonStructuralQualityNotice(_props: { gate: PathwayLessonStructuralGate | undefined }) {
  return null;
}
