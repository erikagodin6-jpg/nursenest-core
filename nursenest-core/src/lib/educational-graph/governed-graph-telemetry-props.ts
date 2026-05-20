/**
 * Server-safe graph telemetry property normalization (no client PostHog).
 */
import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import type { GraphTelemetryPayload } from "@/lib/educational-graph/graph-telemetry";
import { EDUCATIONAL_ONTOLOGY_NAMESPACE } from "@/lib/educational-graph/unified-educational-substrate";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";

function cognitionCapabilityCsv(ctx: EducationalCognitionContext | null | undefined): string {
  if (!ctx) return "";
  return Object.entries(ctx.capabilities)
    .filter(([, on]) => on)
    .map(([k]) => k)
    .join(",");
}

export function toGovernedGraphCaptureProps(
  payload: GraphTelemetryPayload,
  ctx?: EducationalCognitionContext | null,
): Record<string, string | number | boolean | undefined> {
  const pathwayId = payload.pathwayId ?? ctx?.pathwayId ?? undefined;
  return {
    competency_id: payload.competencyId ?? undefined,
    topic_slug: payload.topicSlug,
    step_kind: payload.stepKind,
    source_surface: payload.sourceSurface,
    remediation_priority: payload.remediationPriority,
    learner_state_reason: payload.learnerStateReason ?? undefined,
    graph_depth: payload.graphDepth,
    step_id: payload.stepId,
    pathway_id: pathwayId,
    testing_model: ctx?.psychometric.model ?? getTestingModelForPathwayId(pathwayId),
    cognition_capabilities: cognitionCapabilityCsv(ctx),
    ontology_namespace: payload.ontologyNamespace ?? payload.ontology_namespace ?? EDUCATIONAL_ONTOLOGY_NAMESPACE,
    remediation_pathway: ctx?.ontology.remediationPathwayIds[0],
    event: payload.event,
  };
}
