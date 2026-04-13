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
  /** How `categoryKey` was derived (diagnostics; omitted on legacy persisted rows). */
  blueprintMappingSource?: "nclex_client_needs" | "aanp_blueprint" | "fallback";
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

/** Audit trail for client-needs vs fallback coverage in the pool and this session. */
export type CatBlueprintDiagnostics = {
  examConfigId: string;
  poolCountsByBlueprintKey: Record<string, number>;
  sessionCountsByBlueprintKey: Record<string, number>;
  /** Share of pool rows tagged with this exam config’s blueprint category ids. */
  poolMappedFraction: number;
  /** Share of scored items that used blueprint tags (not topic/system fallback). */
  sessionMappedFraction: number;
};

/** Per fallback blueprint key in the delivered session (excludes NCLEX/AANP-mapped items). */
export type CatFallbackDistributionEntry = {
  blueprintKey: string;
  count: number;
  /** Percent of items that used any fallback key (0–100). */
  percentOfFallbackItems: number;
  /** Percent of all scored items in the session (0–100). */
  percentOfTotalScored: number;
};

/** Admin / ops: explicit counts, fallback keys, and non-blocking mapping quality warnings. Omitted in learner UI. */
export type CatBlueprintAdminDiagnostics = {
  poolMappedFraction: number;
  sessionMappedFraction: number;
  deliveredMappedCount: number;
  deliveredFallbackCount: number;
  /** Top fallback keys (legacy compact list). */
  topFallbackBlueprintKeysDelivered: Array<{ blueprintKey: string; count: number }>;
  /** Sorted fallback keys with counts and percentages (up to 30 rows). */
  fallbackDistributionDelivered: CatFallbackDistributionEntry[];
  /** Threshold constants echoed for admin tools (same as logging; never blocks sessions). */
  qualityThresholds: {
    poolMappedFractionWarning: number;
    sessionMappedFractionWarning: number;
    practicePoolLogFraction: number;
  };
  /** Mapped vs fallback as percent of scored items (0–100 each; sums to ~100). */
  deliveredPercentMapped: number;
  deliveredPercentFallback: number;
  mappingQualityWarnings: Array<{ code: string; detail: string }>;
};

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
  /** Ability cutoff used for pass/fail boundary in this session. */
  passingThreshold?: number;
  /** How the learner chose to run CAT (affects UI only; server still scores the same). */
  catPresentationMode?: CatPresentationMode;
  /**
   * Study-mode CAT: after scoring an item, wait for learner to review rationale before picking the next item.
   * Cleared when the next item is appended.
   */
  catStudyAwaitingContinue?: boolean;
  /** Blueprint pool + running session distribution (exam + practice when mapping exists). */
  catBlueprintDiagnostics?: CatBlueprintDiagnostics;
};

export type CatExamReport = {
  decision: "pass" | "fail" | "uncertain";
  theta: number;
  se: number;
  totalQuestions: number;
  correctCount: number;
  stoppedReason: Exclude<CatStoppedReason, "max_length"> | "completed";
  categoryBreakdown: Array<{
    /** Display label (NCLEX client-needs name when mapped). */
    category: string;
    /** Internal blueprint key (client-needs id or legacy topic/system key). */
    blueprintKey: string;
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
  /** Present when blueprint diagnostics were captured on the adaptive state. */
  blueprintDiagnostics?: CatBlueprintDiagnostics | null;
  /** Admin-facing blueprint audit (learner clients should ignore). */
  blueprintAdminDiagnostics?: CatBlueprintAdminDiagnostics | null;
};
