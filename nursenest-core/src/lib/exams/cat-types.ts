/**
 * Server-side CAT state persisted in `ExamSession.adaptiveState`.
 * Versioned so migrations can evolve shape safely.
 */
export const CAT_STATE_VERSION = 1 as const;

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
};

export type CatAdaptiveState = {
  v: typeof CAT_STATE_VERSION;
  theta: number;
  targetDifficulty: number;
  /** Standard error of theta estimate (shrinks with n). */
  se: number;
  results: CatAnswerResult[];
  difficultyHistory: number[];
  incidents: CatIncident[];
  /** Set when exam completes (early or max length). */
  stoppedReason: "max_length" | "confidence_pass" | "confidence_fail" | "pool_exhausted" | null;
  /** Final classification after enough evidence. */
  decision: "pass" | "fail" | "uncertain" | null;
};

export type CatExamReport = {
  decision: "pass" | "fail" | "uncertain";
  theta: number;
  se: number;
  totalQuestions: number;
  correctCount: number;
  stoppedReason: NonNullable<CatAdaptiveState["stoppedReason"]> | "completed";
  categoryBreakdown: Array<{
    category: string;
    correct: number;
    total: number;
    strength: "strong" | "weak" | "mixed";
  }>;
  weakAreas: string[];
  suggestedNextSteps: string[];
};
