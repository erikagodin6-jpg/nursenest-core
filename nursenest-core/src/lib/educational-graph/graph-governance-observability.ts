/**
 * Educational graph observability — violations, namespace conflicts, orphan chains.
 */
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type GraphGovernanceMetricCode =
  | "graph_governance.violation"
  | "educational_graph.telemetry_violation"
  | "graph_namespace.conflict"
  | "cognition_graph.namespace_conflict"
  | "remediation_path.duplication"
  | "glossary_entity.orphaned"
  | "glossary_graph.orphaned"
  | "telemetry_payload.violation"
  | "graph_depth.overflow"
  | "reassessment_route.invalid"
  | "ai_prompt.graph_drift"
  | "dashboard_graph.divergence"
  | "glossary_traversal.abandoned";

export type GraphGovernanceViolation = {
  code: GraphGovernanceMetricCode;
  surface: string;
  pathwayId: string | null;
  topicSlug?: string;
  detail: string;
};

let graphViolationCount = 0;

export function getGraphGovernanceViolationCount(): number {
  return graphViolationCount;
}

export function resetGraphGovernanceCounters(): void {
  graphViolationCount = 0;
}

export function logGraphGovernanceViolation(v: GraphGovernanceViolation): void {
  graphViolationCount += 1;
  safeServerLog("educational_graph", v.code, {
    surface: v.surface,
    pathway_id: v.pathwayId ?? "unknown",
    topic_slug: v.topicSlug ?? null,
    detail: v.detail,
  });
  if (process.env.NODE_ENV === "development") {
    console.warn("[educational-graph]", v.code, v.detail);
  }
}
