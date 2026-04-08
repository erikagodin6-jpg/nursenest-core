import type { CatExamReport, CatPresentationMode } from "@/lib/exams/cat-types";

export type { CatPresentationMode };

export type PracticeTestSelectionMode = "random" | "targeted" | "weak" | "cat";

/** Serialized pathway row for the practice-test builder (server → client). */
export type PracticeTestPathwayOption = {
  id: string;
  label: string;
  examFamily: string;
};

/** Pool basis when `selectionMode === "cat"` (how items are filtered before adaptive selection). */
export type CatSelectionBasis = "random" | "targeted" | "weak";

/**
 * Linear-only delivery policy (ignored when `selectionMode === "cat"`).
 * - `practice`: submit/lock per item, immediate rationale + correct/incorrect highlights.
 * - `exam`: submit locks response; rationales only after session completes (same runner completion UI).
 * - Omitted / undefined: legacy linear — free prev/next without per-question lock (older sessions).
 */
export type LinearDeliveryMode = "practice" | "exam";

export type PracticeTestConfigJson = {
  questionCount: number;
  topicNames: string[];
  difficultyMin: number | null;
  difficultyMax: number | null;
  selectionMode: PracticeTestSelectionMode;
  pathwayId: string | null;
  timedMode: boolean;
  timeLimitSec: number | null;
  /** Linear sessions only — see {@link LinearDeliveryMode}. */
  linearDeliveryMode?: LinearDeliveryMode;
  /** When mode is CAT: which pool strategy to use for tier-scoped draws. */
  catSelectionBasis?: CatSelectionBasis;
  catMinQuestions?: number;
  catMaxQuestions?: number;
  /** DB topic strings matching weak areas — pool filter + legacy boost label list. */
  catWeakCategories?: string[];
  /** Canonical topic key → 0–1 weak priority for proportional CAT boosting. */
  catWeakPriorityByCanonical?: Record<string, number>;
  /** Practice CAT vs NCLEX-style exam simulation (bounds, copy, pool validation). */
  catPresentationMode?: CatPresentationMode;
  /** Blueprint used for weights + diagnostics (e.g. nclex-rn-us). */
  catExamConfigId?: string | null;
};

export type PracticeTestResultsJson = {
  scoreCorrect: number;
  scoreTotal: number;
  accuracyPct: number;
  byTopic: Record<string, { correct: number; total: number }>;
  weakAreas: string[];
  /** Question ids answered incorrectly (subset of session ids). */
  incorrectQuestionIds?: string[];
  /** Present when the session used computer-adaptive testing. */
  catReport?: CatExamReport | null;
  /** Internal ability estimate (theta), roughly −3…+3. */
  estimatedAbility?: number;
  abilityStdError?: number;
  readinessLabel?: string;
};
