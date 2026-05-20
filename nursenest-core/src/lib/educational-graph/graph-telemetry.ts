import type { EduGraphStep, GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";

export type GraphTelemetryEventName =
  | "graph_step_viewed"
  | "graph_step_clicked"
  | "remediation_path_started"
  | "remediation_path_completed"
  | "competency_traversal"
  | "interpretation_path_opened"
  | "glossary_node_opened"
  | "reassessment_route_opened"
  | "next_best_action_clicked";

export type GraphTelemetryPayload = {
  event: GraphTelemetryEventName;
  competencyId: string | null;
  stepKind: string;
  topicSlug: string;
  sourceSurface: GraphSourceSurface;
  learnerStateReason: string | null;
  remediationPriority: number;
  graphDepth: number;
  testing_model?: string;
  cognition_capabilities?: string;
  ontology_namespace?: string;
  /** Alias used by capture layer */
  ontologyNamespace?: string;
  stepId?: string;
  pathwayId?: string | null;
};

/** Governed analytics envelope — consumers send via PostHog/product analytics when wired. */
export function graphTelemetryPayload(
  event: GraphTelemetryEventName,
  step: EduGraphStep,
  extra?: Partial<GraphTelemetryPayload>,
): GraphTelemetryPayload {
  return {
    event,
    competencyId: step.competencyId,
    stepKind: step.stepKind,
    topicSlug: step.topicSlug,
    sourceSurface: step.sourceSurface,
    learnerStateReason: step.learnerStateReason,
    remediationPriority: step.remediationPriority,
    graphDepth: step.graphDepth,
    stepId: step.stepId,
    pathwayId: step.pathwayId,
    ...extra,
  };
}

export function remediationPathStartedPayload(args: {
  topicSlug: string;
  sourceSurface: GraphSourceSurface;
  stepCount: number;
  competencyId: string | null;
}): GraphTelemetryPayload {
  return {
    event: "remediation_path_started",
    competencyId: args.competencyId,
    stepKind: "remediation_review",
    topicSlug: args.topicSlug,
    sourceSurface: args.sourceSurface,
    learnerStateReason: null,
    remediationPriority: 1,
    graphDepth: 0,
  };
}
