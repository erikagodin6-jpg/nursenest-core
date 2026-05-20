/**
 * Phase 12 — observability **intelligence contracts** (signal taxonomy + severity; no emitters).
 *
 * Use with existing logs/metrics sinks; aggregate before paging to avoid alert noise.
 *
 * See reports/phase-12-platform-intelligence.md
 */

export const OperationalSignalKind = {
  releaseGateFailure: "ops.release_gate.failure",
  mobileLayoutOverflow: "ops.mobile.layout_overflow",
  flashcardsInventoryMismatch: "ops.flashcards.inventory_mismatch",
  lessonNormalizationDrift: "ops.lesson.normalization_drift",
  entitlementResolveSpike: "ops.entitlement.resolve_spike",
  stripeWebhookLag: "ops.stripe.webhook_lag",
  adaptiveRecommendationEmptyFallback: "ops.adaptive.empty_fallback_spike",
  buildRegression: "ops.build.regression",
  runtimeErrorRate: "ops.runtime.error_rate",
} as const;

export type OperationalSignalKind = (typeof OperationalSignalKind)[keyof typeof OperationalSignalKind];

export const AnomalySeverity = {
  info: "info",
  warn: "warn",
  page: "page",
  critical: "critical",
} as const;

export type AnomalySeverity = (typeof AnomalySeverity)[keyof typeof AnomalySeverity];

/** Explainable slice for triage — never include raw PII or secrets. */
export type OperationalAnomalyExplanation = {
  signal: OperationalSignalKind;
  severity: AnomalySeverity;
  pathwayId?: string;
  /** Opaque cohort or release bucket id (hashed prefix acceptable). */
  cohortOrReleaseKey?: string;
  summary: string;
  /** Feature dimensions used in scoring (names only, no values if sensitive). */
  contributingDimensions: readonly string[];
};
