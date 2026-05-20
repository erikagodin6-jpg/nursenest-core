/**
 * In-memory graph OS event aggregation for educator summaries and nightly diagnostics.
 */

import {
  aggregateEducatorGraphMetrics,
  type EducatorGraphAnalyticsInput,
  type EducatorGraphMetricSummary,
} from "@/lib/breadcrumbs/governance/educator-graph-analytics";
import type { SemanticRouteCoverageReport } from "@/lib/breadcrumbs/governance/semantic-route-coverage";

type MutableBucket = EducatorGraphAnalyticsInput & {
  reasoningChainDepths: number[];
};

const bucket: MutableBucket = {
  reasoningChainDepths: [],
};

export function recordGraphOsEvent(
  event:
    | "glossary_traversal"
    | "remediation_start"
    | "remediation_abandon"
    | "reasoning_chain"
    | "focus_area_view"
    | "focus_area_complete"
    | "ontology_conflict"
    | "graph_next_step"
    | "graph_next_step_complete"
    | "pathway_continue"
    | "pathway_recovery"
    | "semantic_route_view"
    | "continuity_interrupt",
  meta?: { depth?: number },
): void {
  switch (event) {
    case "glossary_traversal":
      bucket.glossaryTraversals = (bucket.glossaryTraversals ?? 0) + 1;
      break;
    case "remediation_start":
      bucket.remediationStarts = (bucket.remediationStarts ?? 0) + 1;
      break;
    case "remediation_abandon":
      bucket.remediationAbandons = (bucket.remediationAbandons ?? 0) + 1;
      break;
    case "reasoning_chain":
      bucket.reasoningChainDepths.push(meta?.depth ?? 1);
      break;
    case "focus_area_view":
      bucket.focusAreaViews = (bucket.focusAreaViews ?? 0) + 1;
      break;
    case "focus_area_complete":
      bucket.focusAreaCompletions = (bucket.focusAreaCompletions ?? 0) + 1;
      break;
    case "ontology_conflict":
      bucket.ontologyConflicts = (bucket.ontologyConflicts ?? 0) + 1;
      break;
    case "graph_next_step":
      bucket.graphNextSteps = (bucket.graphNextSteps ?? 0) + 1;
      break;
    case "graph_next_step_complete":
      bucket.graphNextStepCompletions = (bucket.graphNextStepCompletions ?? 0) + 1;
      break;
    case "pathway_continue":
      bucket.pathwayContinuations = (bucket.pathwayContinuations ?? 0) + 1;
      break;
    case "pathway_recovery":
      bucket.pathwayRecoveries = (bucket.pathwayRecoveries ?? 0) + 1;
      break;
    case "semantic_route_view":
      bucket.semanticRouteViews = (bucket.semanticRouteViews ?? 0) + 1;
      break;
    case "continuity_interrupt":
      bucket.continuityInterruptions = (bucket.continuityInterruptions ?? 0) + 1;
      break;
    default:
      break;
  }
}

export function getEducatorGraphSummary(): EducatorGraphMetricSummary {
  return aggregateEducatorGraphMetrics(bucket);
}

export function mergeCoverageWithEducatorMetrics(
  coverage: SemanticRouteCoverageReport,
): EducatorGraphMetricSummary & { semanticCoverageScore: number } {
  const educator = getEducatorGraphSummary();
  return {
    ...educator,
    semanticCoverageScore: coverage.semanticCoverageScore,
    ontologyConflictRate: Math.max(
      educator.ontologyConflictRate,
      coverage.ontologyConflictCount > 0 ? 0.01 : 0,
    ),
  };
}

export function resetGraphOsAggregationForTests(): void {
  bucket.glossaryTraversals = 0;
  bucket.remediationStarts = 0;
  bucket.remediationAbandons = 0;
  bucket.reasoningChainDepths = [];
  bucket.focusAreaViews = 0;
  bucket.focusAreaCompletions = 0;
  bucket.ontologyConflicts = 0;
  bucket.graphNextSteps = 0;
  bucket.graphNextStepCompletions = 0;
  bucket.pathwayContinuations = 0;
  bucket.pathwayRecoveries = 0;
  bucket.semanticRouteViews = 0;
  bucket.continuityInterruptions = 0;
}
