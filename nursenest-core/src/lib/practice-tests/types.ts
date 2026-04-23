import type { CatExamReport, CatPresentationMode } from "@/lib/exams/cat-types";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { CatResultsCoachSnapshot } from "@/lib/practice-tests/cat-results-coach";

export type { CatPresentationMode };
export type { CatResultsCoachSnapshot } from "@/lib/practice-tests/cat-results-coach";

/**
 * CAT session feedback policy (UI only). Does not change item selection, scoring, or stopping rules.
 * - `study`: show correctness + rationales after each item before the next adaptive item.
 * - `test`: exam-style — no live rationales; teaching review after completion.
 */
export type CatExamFeedbackMode = "study" | "test";

/**
 * When `selectionMode === "cat"`: strict adaptive CAT vs guided practice on the same CAT pool + filters.
 * - `cat`: adaptive length, atomic advance on latest item only, test/study feedback per `catExamFeedbackMode`.
 * `practice`: fixed-length seeded shuffle, rationales after each item, advance allowed on any item index.
 */
export type CatAdaptiveSessionType = "cat" | "practice";

/** Sections built from DB rationale fields (CAT Study Mode). */
export type CatStudyFeedbackSection = { heading: string; body: string };

/** Layered teaching (Study Mode): short → full → strategy; optional micro-lesson links. */
export type CatStudyFeedbackLayers = {
  level1Short: string;
  level2Sections: CatStudyFeedbackSection[];
  level3Strategy: string;
  relatedLessons: Array<{ title: string; href: string }>;
  /** Exam identity — presentation only; does not change scoring. */
  examFramingNote?: string;
};

/** Serializable teaching payload for CAT Study Mode (after each item). */
export type CatStudyFeedbackPayload = {
  questionId: string;
  isCorrect: boolean;
  correctKeys: string[];
  sections: CatStudyFeedbackSection[];
  topic: string | null;
  subtopic: string | null;
  /** When set, the study panel uses accordion layers + lesson links. */
  layers?: CatStudyFeedbackLayers;
};

export type PracticeTestSelectionMode = "random" | "targeted" | "weak" | "cat";

/** Serialized pathway row for the practice-test builder (server → client). */
export type PracticeTestPathwayOption = {
  id: string;
  label: string;
  examFamily: string;
  /**
   * Mirrors {@link catPathwayExamCodeLabel} / `shortName` so hub UI can disambiguate CAT tracks
   * without importing the exam catalog client-side.
   */
  examCodeLabel: string;
  /** Server-computed regional disambiguation line for CAT ambiguity UI. */
  regionalExamLine?: string;
};

/**
 * Minimal pathway fields for learner chrome (CAT start, practice run) without the full catalog.
 */
export type PracticeTestPathwayClientShell = Pick<
  ExamPathwayDefinition,
  "id" | "countrySlug" | "roleTrack" | "examCode" | "shortName" | "examFamily"
>;

/** Pool basis when `selectionMode === "cat"` (how items are filtered before adaptive selection). */
export type CatSelectionBasis = "random" | "targeted" | "weak";
export type CatEngineType = "CAT" | "SIMULATION";
export type CatEngineMode = "production_ready" | "beta" | "mini_adaptive" | "simulation" | "unavailable";

/**
 * Linear-only delivery policy (ignored when `selectionMode === "cat"`).
 * - `practice`: submit/lock per item, immediate rationale + correct/incorrect highlights.
 * - `exam`: submit locks response; rationales only after session completes (same runner completion UI).
 * - Omitted / undefined: legacy linear — free prev/next without per-question lock (older sessions).
 */
export type LinearDeliveryMode = "practice" | "exam";
export type LinearRationaleVisibility = "after_each" | "end_of_exam";

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
  /** Linear sessions: rationale timing policy. */
  linearRationaleVisibility?: LinearRationaleVisibility;
  /** When mode is CAT: which pool strategy to use for tier-scoped draws. */
  catSelectionBasis?: CatSelectionBasis;
  catMinQuestions?: number;
  catMaxQuestions?: number;
  catPassingThreshold?: number;
  catEngineType?: CatEngineType;
  catEngineMode?: CatEngineMode;
  /** DB topic strings matching weak areas — pool filter + legacy boost label list. */
  catWeakCategories?: string[];
  /** Canonical topic key → 0–1 weak priority for proportional CAT boosting. */
  catWeakPriorityByCanonical?: Record<string, number>;
  /** Practice CAT vs NCLEX-style exam simulation (bounds, copy, pool validation). */
  catPresentationMode?: CatPresentationMode;
  /**
   * Instant rationales vs end-only explanations for CAT (`selectionMode === "cat"`).
   * Exam simulation coerces to `test` on the server.
   */
  catExamFeedbackMode?: CatExamFeedbackMode;
  /** Strict adaptive vs guided practice (same pool build as CAT). */
  catAdaptiveSessionType?: CatAdaptiveSessionType;
  /** Blueprint used for weights + diagnostics (e.g. nclex-rn-us). */
  catExamConfigId?: string | null;
  /**
   * Opaque per-session randomness (hex) for CAT tie-breaks, option display shuffle, and
   * linear pool ordering — persisted on `PracticeTest.config`.
   */
  sessionPickSalt?: string;
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
  readinessResult?: "PASS" | "BORDERLINE" | "FAIL";
  readinessLevel?: "Likely Pass" | "Borderline" | "At Risk";
  confidenceLevel?: "High" | "Moderate" | "Low";
  passProbability?: number;
  passProbabilityBand?: "Very likely to pass" | "Likely to pass" | "Borderline" | "At risk";
  readinessLabel?: string;
  /** Echo of config for analytics / review UI when session was CAT. */
  catExamFeedbackMode?: CatExamFeedbackMode;
  /** Study mode: every scored item had an in-session rationale step before continuing. */
  catStudyRationaleSteps?: number;
  /** Premium coach card: pass outlook, study-next links, patterns (no psychometric changes). */
  catCoach?: CatResultsCoachSnapshot | null;
};
