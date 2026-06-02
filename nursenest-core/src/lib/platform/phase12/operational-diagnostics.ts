/**
 * Phase 12 — AI-assisted operational diagnostics **report kinds** (read-only summaries).
 *
 * No autonomous destructive actions — outputs are recommendations for human or runbook review.
 *
 * See reports/phase-12-platform-intelligence.md
 */

export const OperationalDiagnosticReportKind = {
  deploymentAnomalySummary: "ops_diag.deployment_anomaly",
  releaseGateFailureCluster: "ops_diag.release_gate_cluster",
  mobileOverflowHotspot: "ops_diag.mobile_overflow_hotspot",
  buildRuntimeRegression: "ops_diag.build_runtime_regression",
  envConfigDrift: "ops_diag.env_config_drift",
  cacheInconsistency: "ops_diag.cache_inconsistency",
} as const;

export type OperationalDiagnosticReportKind =
  (typeof OperationalDiagnosticReportKind)[keyof typeof OperationalDiagnosticReportKind];

export type OperationalDiagnosticSummary = {
  kind: OperationalDiagnosticReportKind;
  generatedAtIso: string;
  /** High-level narrative for operators — must not include secrets. */
  headline: string;
  /** Actionable bullets; destructive actions require explicit human approval. */
  suggestedNextSteps: readonly string[];
};
