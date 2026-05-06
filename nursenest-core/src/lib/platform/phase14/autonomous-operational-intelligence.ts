/**
 * Phase 14 — **autonomous operational intelligence** report kinds (recommendations only; no auto-execute).
 *
 * Human or runbook approval required before any destructive action. Pair with deterministic fallbacks.
 *
 * See reports/phase-14-governance-autonomous-network.md
 */

export const AutonomousOpsIntelligenceKind = {
  deploymentAnomalySummary: "auto_ops.deployment_anomaly_summary",
  releaseRegressionCluster: "auto_ops.release_regression_cluster",
  selfHealingRecommendation: "auto_ops.self_healing_recommendation",
  entitlementDriftSignal: "auto_ops.entitlement_drift_signal",
  recommendationQualityMonitor: "auto_ops.recommendation_quality_monitor",
  contentQualityAnomaly: "auto_ops.content_quality_anomaly",
  mobileRuntimeInstabilityPattern: "auto_ops.mobile_runtime_instability_pattern",
} as const;

export type AutonomousOpsIntelligenceKind =
  (typeof AutonomousOpsIntelligenceKind)[keyof typeof AutonomousOpsIntelligenceKind];

/** Every autonomous intel artifact must declare human review requirement. */
export type AutonomousOpsArtifactBase = {
  kind: AutonomousOpsIntelligenceKind;
  requiresHumanApproval: true;
  explainabilitySummary: string;
  deterministicFallbackHint?: string;
};
