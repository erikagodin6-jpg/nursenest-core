/**
 * Educator-safe graph intelligence projections — aggregates only.
 */

import type { EducatorGraphMetricSummary } from "@/lib/breadcrumbs/governance/educator-graph-analytics";
import type { SemanticRouteCoverageReport } from "@/lib/breadcrumbs/governance/semantic-route-coverage";

export type EducatorGraphInsight = {
  id: string;
  label: string;
  value: number | string;
  trend: "stable" | "watch" | "action";
  narrative: string;
};

export type EducatorGraphInsightsReport = {
  summary: EducatorGraphMetricSummary;
  insights: EducatorGraphInsight[];
  semanticCoverageScore: number;
};

export function buildEducatorGraphInsights(
  metrics: EducatorGraphMetricSummary,
  coverage?: SemanticRouteCoverageReport,
): EducatorGraphInsightsReport {
  const insights: EducatorGraphInsight[] = [
    {
      id: "remediation_abandonment",
      label: "Remediation abandonment rate",
      value: metrics.remediationAbandonmentRate,
      trend: metrics.remediationAbandonmentRate > 0.35 ? "action" : "stable",
      narrative: "Share of started remediation ladders not completed.",
    },
    {
      id: "glossary_depth",
      label: "Glossary traversal depth (avg)",
      value: metrics.reasoningChainAvgDepth,
      trend: metrics.reasoningChainAvgDepth < 2 ? "watch" : "stable",
      narrative: "Average reasoning-chain depth linked from glossary nodes.",
    },
    {
      id: "graph_next_step",
      label: "Graph next-step completion",
      value: metrics.graphNextStepCompletionRate,
      trend: metrics.graphNextStepCompletionRate < 0.5 ? "watch" : "stable",
      narrative: "Learners completing orchestrated graph next actions.",
    },
    {
      id: "pathway_recovery",
      label: "Pathway continuation recovery",
      value: metrics.pathwayContinuationRecoveryRate,
      trend: "stable",
      narrative: "Recovery rate after interrupted pathway traversal.",
    },
    {
      id: "focus_velocity",
      label: "Focus-area progression velocity",
      value: metrics.focusAreaProgressionVelocity,
      trend: metrics.focusAreaProgressionVelocity < 0.25 ? "watch" : "stable",
      narrative: "Weak-topic focus surfaces leading to completion.",
    },
    {
      id: "ontology_conflicts",
      label: "Ontology conflict frequency",
      value: metrics.ontologyConflictRate,
      trend: metrics.ontologyConflictRate > 0 ? "action" : "stable",
      narrative: "Namespace collisions detected in graph telemetry.",
    },
    {
      id: "hydration_fallback",
      label: "Hydration fallback frequency",
      value: metrics.hydrationFallbackRate,
      trend: metrics.hydrationFallbackRate > 0.1 ? "watch" : "stable",
      narrative: "Client hydration normalization fallbacks observed.",
    },
    {
      id: "tutoring_continuity",
      label: "Tutoring continuity adherence",
      value: metrics.tutoringContinuityAdherence,
      trend: metrics.tutoringContinuityAdherence < 0.5 ? "watch" : "stable",
      narrative: "Share of tutoring continuations that complete graph steps.",
    },
    {
      id: "glossary_depth",
      label: "Glossary traversal depth (avg)",
      value: metrics.glossaryTraversalDepthAvg,
      trend: metrics.glossaryTraversalDepthAvg < 2 ? "watch" : "stable",
      narrative: "Average depth of governed glossary graph traversals.",
    },
    {
      id: "continuity_recovery",
      label: "Continuity interruption recovery",
      value: 1 - metrics.continuityInterruptionRate,
      trend: "stable",
      narrative: "Estimated recovery after graph continuity breaks.",
    },
  ];

  return {
    summary: metrics,
    insights,
    semanticCoverageScore: coverage?.semanticCoverageScore ?? 100,
  };
}
