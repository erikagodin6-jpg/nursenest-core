/**
 * Phase 12 — predictive learner analytics **planning types** (no model weights, no public export of scores).
 *
 * - All outputs are **pathway-scoped** and **explainable**; never assert clinical outcomes.
 * - Deterministic rules from `@/lib/adaptive-learning` remain the fallback when ML is absent or low-confidence.
 *
 * See reports/phase-12-platform-intelligence.md
 */

export const LearnerPredictionFamily = {
  dropoutRisk: "learner.dropout_risk",
  remediationRisk: "learner.remediation_risk",
  readinessForecast: "learner.readiness_forecast",
  streakEngagement: "learner.streak_engagement",
  weakTopicProgression: "learner.weak_topic_progression",
  cohortRiskAggregate: "learner.cohort_risk_aggregate",
} as const;

export type LearnerPredictionFamily = (typeof LearnerPredictionFamily)[keyof typeof LearnerPredictionFamily];

/** Bounded contribution hints for human review — not medical advice. */
export type PredictionExplainabilityArtifact = {
  family: LearnerPredictionFamily;
  pathwayId: string;
  confidence01: number;
  /** Ordered human-readable reasons (no free-form LLM prose in critical path). */
  structuredReasons: readonly string[];
  /** Feature keys only; values live in secure aggregates, not in public APIs. */
  topFeatureKeys: readonly string[];
};
