/**
 * Server-side CAT state persisted in `PracticeTest.adaptiveState` (and exam sessions).
 * Versioned so migrations can evolve shape safely.
 */
export const CAT_STATE_VERSION = 2 as const;
/** Legacy sessions still parse when `v === 1`. */
export const CAT_STATE_VERSION_LEGACY = 1 as const;

export type CatIncident = {
  code: string;
  detail?: string;
  at: string;
};

export type CatAnswerResult = {
  questionId: string;
  correct: boolean;
  categoryKey: string;
  difficulty: number;
  /** Effective discrimination used for this item (defaults to 1). */
  discrimination?: number;
  /** Fisher information contributed at scoring theta (for audit). */
  itemInformation?: number;
};

export type CatStoppedReason =
  | "max_length_reached"
  /** @deprecated use max_length_reached */
  | "max_length"
  | "confidence_pass"
  | "confidence_fail"
  | "pool_exhausted"
  | "user_completed";

export type CatPresentationMode = "practice" | "exam_simulation";

export type CatConfidenceLevel = "low" | "medium" | "high";

export type CatAdaptiveState = {
  v: typeof CAT_STATE_VERSION | typeof CAT_STATE_VERSION_LEGACY;
  theta: number;
  targetDifficulty: number;
  /** Standard error of theta (from accumulated information + weak prior). */
  se: number;
  /** Sum of item information contributions (Fisher-style, lightweight). */
  totalInformation: number;
  results: CatAnswerResult[];
  difficultyHistory: number[];
  /** Recent theta values for trend display (capped). */
  thetaHistory: number[];
  incidents: CatIncident[];
  stoppedReason: CatStoppedReason | null;
  /** Final classification after enough evidence. */
  decision: "pass" | "fail" | "uncertain" | null;
  /** How the learner chose to run CAT (affects UI only; server still scores the same). */
  catPresentationMode?: CatPresentationMode;
};

export type CatExamReport = {
  decision: "pass" | "fail" | "uncertain";
  theta: number;
  se: number;
  totalQuestions: number;
  correctCount: number;
  stoppedReason: Exclude<CatStoppedReason, "max_length"> | "completed";
  categoryBreakdown: Array<{
    category: string;
    correct: number;
    total: number;
    strength: "strong" | "weak" | "mixed";
  }>;
  weakAreas: string[];
  suggestedNextSteps: string[];
  readinessScore: number;
  confidenceLevel: CatConfidenceLevel;
  confidenceText: string;
  trajectory: "improving" | "slipping" | "steady" | "insufficient";
  /** Short headline for results card. */
  readinessHeadline: string;
};
