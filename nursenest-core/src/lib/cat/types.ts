/**
 * Core types for the NurseNest CAT (Computerized Adaptive Testing) engine
 * and readiness scoring system.
 *
 * These types are framework-agnostic pure data shapes — no Prisma, no Next.js.
 * The scoring and selection logic operates purely on these structures.
 */

// ─── Taxonomy ────────────────────────────────────────────────────────────────

/** Clinical priority axis from the NP advanced practice blueprint. */
export type ClinicalPriority = "core" | "high-risk" | "special-population" | "supporting";

/**
 * Three-tier cognitive layer from the question schema.
 * L1 = recognition, L2 = interpretation, L3 = clinical action/decision.
 */
export type CognitiveLayer = "L1" | "L2" | "L3";

/** Clinical risk severity of a question topic. */
export type RiskLevel = "low" | "moderate" | "high";

/** Disposition category applied to high-risk questions. */
export type DispositionTag =
  | "outpatient"
  | "urgent-same-day"
  | "ED-referral"
  | "immediate-escalation";

// ─── Weight Constants ─────────────────────────────────────────────────────────

export const COGNITIVE_WEIGHTS: Record<CognitiveLayer, number> = {
  L1: 1.0,
  L2: 1.5,
  L3: 2.2,
} as const;

export const RISK_WEIGHTS: Record<RiskLevel, number> = {
  low: 1.0,
  moderate: 1.5,
  high: 2.5,
} as const;

/**
 * Maximum possible weight for a single question answer (L3 × high).
 * Used to normalise raw weighted scores to 0–100.
 */
export const MAX_ITEM_WEIGHT = COGNITIVE_WEIGHTS.L3 * RISK_WEIGHTS.high; // 5.5

// ─── Question Metadata ────────────────────────────────────────────────────────

/** Minimal question shape the CAT engine operates on. */
export interface CatQuestion {
  /** Unique question identifier. */
  id: string;
  /** Topic/domain slug matching blueprint slugs (e.g. "knee-pain-differential"). */
  topicSlug: string;
  /** Body system or clinical system tag (e.g. "musculoskeletal", "cardiovascular"). */
  systemTag: string;
  cognitiveLayer: CognitiveLayer;
  riskLevel: RiskLevel;
  /** Numeric difficulty 1–5 (may be derived from cognitiveLayer + riskLevel if absent). */
  difficulty: 1 | 2 | 3 | 4 | 5;
  populationTags?: string[];
  dispositionTag?: DispositionTag;
  /** Lesson slug(s) that this question directly supports. */
  lessonSlugs?: string[];
}

// ─── Answer Record ────────────────────────────────────────────────────────────

/** A single answered question in a session or history. */
export interface AnswerRecord {
  questionId: string;
  topicSlug: string;
  systemTag: string;
  cognitiveLayer: CognitiveLayer;
  riskLevel: RiskLevel;
  correct: boolean;
  /** Unix timestamp (ms) when the answer was recorded. */
  answeredAt: number;
  /** Milliseconds taken to answer (optional, used in future confidence modelling). */
  responseTimeMs?: number;
}

// ─── Performance Dimension ────────────────────────────────────────────────────

/** Aggregated performance for a single dimensional slice. */
export interface DimensionPerformance {
  /** Total questions attempted in this dimension. */
  attempted: number;
  /** Correct answers. */
  correct: number;
  /** Raw accuracy (0–1). */
  accuracy: number;
  /**
   * Recency-weighted accuracy (0–1): exponentially discounts older answers.
   * More reflective of current ability than raw accuracy.
   */
  recentAccuracy: number;
  /**
   * Weighted accuracy incorporating cognitive and risk weights.
   * Higher values mean the learner is performing well on harder items.
   */
  weightedAccuracy: number;
  /** Total number of unique question IDs seen in this dimension. */
  uniqueQuestionsSeen: number;
}

/** Performance broken down by all dimensions. */
export interface PerformanceProfile {
  /** Per-system performance (keyed by systemTag). */
  bySystem: Record<string, DimensionPerformance>;
  /** Per-risk-level performance. */
  byRisk: Record<RiskLevel, DimensionPerformance>;
  /** Per-cognitive-layer performance. */
  byLayer: Record<CognitiveLayer, DimensionPerformance>;
  /** Per-topic performance (keyed by topicSlug). */
  byTopic: Record<string, DimensionPerformance>;
  /** Aggregate across all dimensions. */
  overall: DimensionPerformance;
}

// ─── Readiness Score ──────────────────────────────────────────────────────────

/** Full readiness score output for a learner. */
export interface ReadinessScore {
  /** Final 0–100 score. */
  score: number;
  /**
   * Confidence band indicating reliability of the score.
   * Requires ≥20 weighted answers for "high".
   */
  confidence: "low" | "medium" | "high";
  /** Number of questions contributing to the score. */
  sampleSize: number;
  /**
   * Consistency modifier applied (0.85–1.1).
   * High consistency → scores close to 1.1; high variance → approaches 0.85.
   */
  consistencyModifier: number;
  /** Recency-weighted raw percentage (pre-modifier). */
  rawWeightedPercent: number;
  /** Breakdown by dimension. */
  dimensions: {
    byLayer: Record<CognitiveLayer, number>;
    byRisk: Record<RiskLevel, number>;
    bySystem: Record<string, number>;
  };
  /** ISO timestamp of when this score was computed. */
  computedAt: string;
}

// ─── CAT State ────────────────────────────────────────────────────────────────

/** Per-session state managed by the CAT engine. */
export interface CatSessionState {
  sessionId: string;
  /** Unix timestamp (ms) when the session started. */
  startedAt: number;
  /** Current estimated ability (logit scale, nominally –3 to +3). */
  abilityEstimate: number;
  /** IDs of questions answered this session (ordered). */
  answeredIds: string[];
  /** IDs of questions seen recently across sessions (excluded from selection). */
  recentlySeenIds: Set<string>;
  /** Answer records for this session only. */
  sessionAnswers: AnswerRecord[];
  /** Current performance profile (live-updated after each answer). */
  performance: PerformanceProfile;
  /** Number of consecutive correct answers (streak tracking). */
  correctStreak: number;
  /** Number of consecutive incorrect answers. */
  incorrectStreak: number;
}

/** Configuration for a CAT session. */
export interface CatSessionConfig {
  /** Question pool available for selection. */
  questionPool: CatQuestion[];
  /** Historical answers from previous sessions (for baseline performance). */
  historicalAnswers: AnswerRecord[];
  /**
   * IDs to exclude from selection (recently seen across sessions).
   * Defaults to all IDs in historicalAnswers within the last 24h.
   */
  excludeIds?: string[];
  /**
   * Maximum session length in questions.
   * @default 40
   */
  maxQuestions?: number;
  /**
   * Minimum target accuracy band for stopping criterion.
   * Session terminates when ability estimate confidence is sufficiently high.
   * @default 0.7
   */
  targetAccuracy?: number;
  /**
   * Force a minimum number of questions per risk level for balanced coverage.
   * @default { low: 4, moderate: 6, high: 8 }
   */
  riskFloors?: Partial<Record<RiskLevel, number>>;
  /**
   * Force a minimum number of questions per cognitive layer.
   * @default { L1: 4, L2: 10, L3: 8 }
   */
  layerFloors?: Partial<Record<CognitiveLayer, number>>;
}

// ─── Question Selection ───────────────────────────────────────────────────────

/** Output of the CAT engine's next-question selection. */
export interface NextQuestionResult {
  /** The selected question, or null if the pool is exhausted. */
  question: CatQuestion | null;
  /** Reason for termination when question is null. */
  terminationReason?: "pool_exhausted" | "max_questions_reached" | "confidence_achieved";
  /**
   * Diagnostic info about why this question was selected.
   * Useful for debugging and admin transparency tools.
   */
  selectionDiagnostics: {
    abilityEstimate: number;
    targetDifficulty: number;
    candidateCount: number;
    weakestSystem: string | null;
    weakestRisk: RiskLevel | null;
    weakestLayer: CognitiveLayer | null;
    selectionScore: number;
  };
}

// ─── Session Analysis ─────────────────────────────────────────────────────────

/** A single weak area identified by the session analyzer. */
export interface WeakArea {
  dimension: "system" | "risk" | "layer" | "topic";
  key: string;
  label: string;
  accuracy: number;
  recentAccuracy: number;
  attempted: number;
  /** 0–1 priority score for remediation (higher = needs more attention). */
  remediationPriority: number;
}

/** A lesson recommendation generated from weak area analysis. */
export interface LessonRecommendation {
  lessonSlug: string;
  lessonTitle: string;
  topicSlug: string;
  reason: string;
  /**
   * Priority rank (1 = highest priority).
   */
  rank: number;
  /** Weak areas this lesson addresses. */
  addressesWeakAreas: string[];
}

/** A targeted follow-up question set for remediation. */
export interface FollowUpQuestionSet {
  /** Unique ID for this follow-up set. */
  setId: string;
  /** Questions selected for remediation, ordered by priority. */
  questions: CatQuestion[];
  /** The weak areas this set is targeting. */
  targetingWeakAreas: WeakArea[];
  /** Estimated session length in minutes. */
  estimatedMinutes: number;
}

/** Full session analysis output from the session analyzer. */
export interface SessionAnalysis {
  sessionId: string;
  /** When the analysis was generated. */
  analyzedAt: string;
  /** Summary of the session. */
  summary: {
    totalAnswered: number;
    totalCorrect: number;
    sessionAccuracy: number;
    readinessScore: ReadinessScore;
    /** Change in readiness score vs pre-session baseline (null if no baseline). */
    scoreDelta: number | null;
  };
  /** Ordered list of weak areas (highest remediation priority first). */
  weakAreas: WeakArea[];
  /** Lesson recommendations (up to 5). */
  lessonRecommendations: LessonRecommendation[];
  /** Follow-up question set targeting the top 3 weak areas. */
  followUpQuestions: FollowUpQuestionSet;
  /**
   * Dimensional performance snapshot at session end.
   */
  performanceSnapshot: PerformanceProfile;
}

// ─── Lesson Catalog Entry (minimal shape for recommendations) ─────────────────

/** Minimal lesson metadata needed for the session analyzer to generate recommendations. */
export interface LessonCatalogEntry {
  lessonSlug: string;
  lessonTitle: string;
  topicSlug: string;
  systemTag: string;
  riskLevel?: RiskLevel;
  populationTags?: string[];
}
