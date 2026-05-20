/**
 * Educational Graph OS observability — schema drift, ontology conflicts, traversal health.
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";
import { recordGraphOsEvent } from "@/lib/breadcrumbs/governance/graph-os-aggregation";
import { resolvePsychometricLineageStamp } from "@/lib/breadcrumbs/governance/psychometric-lineage-validation";

export type GraphObservabilityMetric =
  | "educational_navigation.schema_drift"
  | "ontology_namespace.conflict"
  | "remediation_path.abandonment"
  | "glossary_entity.orphaned"
  | "reasoning_chain.invalid"
  | "breadcrumb_runtime.duplication"
  | "graph_depth.overflow"
  | "navigation_telemetry.leakage"
  | "graph_continuity.recovered"
  | "graph_traversal.interrupted"
  | "remediation_return.success"
  | "normalization.fallback";

export type GraphObservabilityPayload = {
  metric: GraphObservabilityMetric;
  pathname?: string;
  ontologyNamespace?: string;
  remediationPathwayId?: string;
  graphDepth?: number;
  detail?: string;
  testing_model?: string;
  graphVersion?: string;
  ontologyRevision?: string;
  educationalIntent?: string;
  cognitionReliabilityTier?: string;
};

export function recordGraphObservability(payload: GraphObservabilityPayload): void {
  const psych = resolvePsychometricLineageStamp({
    pathwayId: payload.remediationPathwayId ?? null,
    educationalIntent: payload.educationalIntent,
  });
  safeServerLog("educational_graph_os", payload.metric, {
    pathname: payload.pathname?.slice(0, 200),
    ontology_namespace: payload.ontologyNamespace?.slice(0, 80),
    remediation_pathway_id: payload.remediationPathwayId?.slice(0, 120),
    graph_depth: payload.graphDepth != null ? String(payload.graphDepth) : undefined,
    detail: payload.detail?.slice(0, 200),
    testing_model: (payload.testing_model ?? psych.testing_model).slice(0, 40),
    graph_version: (payload.graphVersion ?? psych.graphVersion).slice(0, 40),
    ontology_revision: (payload.ontologyRevision ?? psych.ontologyRevision).slice(0, 80),
    cognition_reliability: payload.cognitionReliabilityTier ?? psych.cognitionReliabilityTier,
  });
}

export function recordSchemaDrift(pathname: string, breadcrumbListCount: number): void {
  if (breadcrumbListCount <= 1) return;
  recordGraphObservability({
    metric: "breadcrumb_runtime.duplication",
    pathname,
    detail: `breadcrumb_list_count=${breadcrumbListCount}`,
  });
}

export function recordOntologyNamespaceConflict(
  pathname: string,
  expected: string,
  actual: string,
): void {
  recordGraphObservability({
    metric: "ontology_namespace.conflict",
    pathname,
    ontologyNamespace: actual,
    detail: `expected=${expected}`,
  });
}

export function recordReasoningChainInvalid(pathname: string, reason: string): void {
  recordGraphObservability({
    metric: "reasoning_chain.invalid",
    pathname,
    detail: reason,
  });
}

export function recordRemediationAbandonment(
  remediationPathwayId: string,
  graphDepth: number,
): void {
  recordGraphObservability({
    metric: "remediation_path.abandonment",
    remediationPathwayId,
    graphDepth,
  });
}

export function recordGlossaryOrphan(termSlug: string): void {
  recordGraphObservability({
    metric: "glossary_entity.orphaned",
    pathname: `/nursing-glossary/${termSlug}`,
    detail: termSlug,
  });
}

export function recordGraphContinuityRecovered(pathname: string, remediationPathwayId?: string): void {
  recordGraphObservability({
    metric: "graph_continuity.recovered",
    pathname,
    remediationPathwayId,
    detail: "interrupted_traversal_recovery",
  });
}

export function recordGraphTraversalInterrupted(pathname: string, graphDepth: number): void {
  recordGraphObservability({
    metric: "graph_traversal.interrupted",
    pathname,
    graphDepth,
  });
}

export function recordRemediationReturnSuccess(remediationPathwayId: string): void {
  recordGraphObservability({
    metric: "remediation_return.success",
    remediationPathwayId,
    detail: "glossary_to_remediation",
  });
}

export function recordNormalizationFallbackTriggered(pathname: string, declared?: string, derived?: string): void {
  recordGraphOsEvent("hydration_fallback");
  recordGraphObservability({
    metric: "normalization.fallback",
    pathname,
    detail: `declared=${declared ?? ""};derived=${derived ?? ""}`,
    educationalIntent: "hydration_replay",
  });
}

export function recordGlossaryRemediationTransition(from: string, to: string): void {
  recordGraphObservability({
    metric: "remediation_return.success",
    pathname: to,
    detail: `from_glossary=${from}`,
  });
}

export function recordPathwayAbandonment(pathname: string, graphDepth: number): void {
  recordGraphObservability({
    metric: "graph_traversal.interrupted",
    pathname,
    graphDepth,
    detail: "pathway_abandonment",
  });
}

export function recordReasoningChainReplayContinuity(pathname: string, depth: number): void {
  recordGraphObservability({
    metric: "graph_continuity.recovered",
    pathname,
    graphDepth: depth,
    detail: "reasoning_chain_replay",
  });
}
