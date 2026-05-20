import type { EduGraphStep, GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";

export type GraphTelemetryEventName =
  | "remediation_path_started"
  | "graph_step_clicked"
  | "graph_step_viewed"
  | "next_best_action_clicked"
  | "interpretation_path_opened"
  | "reassessment_route_opened"
  | "glossary_node_opened";

export type GraphTelemetryPayload = {
  topic_slug: string;
  source_surface: GraphSourceSurface;
  pathway_id?: string;
  competency_id?: string;
  step_id?: string;
  step_kind?: string;
  graph_depth?: number;
  step_count?: number;
  remediation_priority?: string;
};

export function telemetryPayloadForGraphStep(step: EduGraphStep): GraphTelemetryPayload {
  return {
    topic_slug: step.topicSlug,
    source_surface: step.sourceSurface,
    pathway_id: step.pathwayId ?? undefined,
    competency_id: step.competencyId ?? undefined,
    step_id: step.stepId,
    step_kind: step.stepKind,
    graph_depth: step.depth,
    remediation_priority: step.remediationPriority,
  };
}

export function remediationPathStartedPayload(input: {
  topicSlug: string;
  sourceSurface: GraphSourceSurface;
  stepCount: number;
  competencyId?: string | null;
}): GraphTelemetryPayload & { competencyId: string | null } {
  return {
    topic_slug: input.topicSlug,
    source_surface: input.sourceSurface,
    step_count: input.stepCount,
    competency_id: input.competencyId ?? undefined,
    competencyId: input.competencyId ?? null,
  };
}
