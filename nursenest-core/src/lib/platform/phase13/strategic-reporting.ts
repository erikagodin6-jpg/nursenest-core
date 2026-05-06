/**
 * Phase 13 — strategic / executive **report kinds** (summaries only; human review before external distribution).
 *
 * See reports/phase-13-strategic-intelligence.md
 */

export const StrategicReportKind = {
  executiveAnalyticsSummary: "strategic.exec_analytics_summary",
  institutionalTrend: "strategic.institutional_trend",
  remediationImpact: "strategic.remediation_impact",
  cohortRiskSummary: "strategic.cohort_risk_summary",
  contentEffectiveness: "strategic.content_effectiveness",
  pathwayHealth: "strategic.pathway_health",
} as const;

export type StrategicReportKind = (typeof StrategicReportKind)[keyof typeof StrategicReportKind];

export type StrategicReportEnvelope = {
  kind: StrategicReportKind;
  institutionKey?: string;
  generatedAtIso: string;
  /** Redacted title for logs — full body stored in secure blob store only. */
  titleSlug: string;
  /** Deterministic template version for audit. */
  templateVersion: string;
};
