/**
 * Phase 13 — workforce-readiness **intelligence planning types** (explainable; no exam-pass or clinical guarantees).
 *
 * Pair with deterministic adaptive outputs; high-uncertainty surfaces fall back to structured hints only.
 *
 * See reports/phase-13-strategic-intelligence.md
 */

export const WorkforceReadinessSignalFamily = {
  readinessTrend: "workforce.readiness_trend",
  competencyProgression: "workforce.competency_progression",
  examReadinessConfidence: "workforce.exam_readiness_confidence",
  remediationIntensity: "workforce.remediation_intensity",
  institutionalOutcome: "workforce.institutional_outcome",
  cohortRisk: "workforce.cohort_risk",
} as const;

export type WorkforceReadinessSignalFamily =
  (typeof WorkforceReadinessSignalFamily)[keyof typeof WorkforceReadinessSignalFamily];

export type WorkforceReadinessExplanation = {
  family: WorkforceReadinessSignalFamily;
  pathwayId: string;
  institutionKey: string;
  confidence01: number;
  /** Structured reasons only — avoid LLM free text on compliance-sensitive exports. */
  structuredReasons: readonly string[];
  /** Explicit: not a medical diagnosis or licensure prediction. */
  nonDiagnosticDisclaimer: true;
};
