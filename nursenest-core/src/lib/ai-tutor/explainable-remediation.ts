import type { PathwayLessonRelatedRef } from "@/lib/lessons/pathway-lesson-types";

/** Opaque analytic signal ids (weak topic score, CAT theta band, etc.) — not raw metrics with PHI. */
export type ExplanationSignalRef = {
  id: string;
  /** Optional normalized weight for UI ordering only. */
  weight?: number;
};

export type AdaptiveRemediationSurface =
  | "adaptive_teaching_loop"
  | "adaptive_engine_coach"
  | "adaptive_recommendations"
  | "questions"
  | "flashcards"
  | "cat";

/**
 * Serializable trace for “why this next step” — ties into adaptive outputs without
 * embedding full question payloads. Prerequisite links reuse linked-learning shapes.
 */
export type ExplanationTrace = {
  pathwayId: string;
  topicKey: string;
  topicDisplayLabel?: string;
  signalsUsed: ExplanationSignalRef[];
  prerequisiteLessons?: PathwayLessonRelatedRef[];
  adaptiveSurface?: AdaptiveRemediationSurface;
};
