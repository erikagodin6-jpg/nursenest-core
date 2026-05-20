import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import { captureGovernedLearnerProductEvent } from "@/lib/observability/governed-learner-analytics";
import type { GraphTelemetryEventName, GraphTelemetryPayload } from "@/lib/educational-graph/graph-telemetry";
import type { EduGraphStep, GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import { graphTelemetryPayload } from "@/lib/educational-graph/graph-telemetry";
import { toGovernedGraphCaptureProps } from "@/lib/educational-graph/governed-graph-telemetry-props";
import { EDUCATIONAL_ONTOLOGY_NAMESPACE } from "@/lib/educational-graph/unified-educational-substrate";

/**
 * Server-side governed graph telemetry — entitlement-aware, cognition-normalized.
 */
export function captureGovernedGraphTelemetryServer(args: {
  userId: string;
  entitlement: AccessScope;
  event: GraphTelemetryEventName;
  step?: EduGraphStep;
  pathwayId?: string | null;
  topicSlug?: string;
  sourceSurface: GraphSourceSurface;
  cognition: EducationalCognitionContext;
  stepCount?: number;
}): void {
  const step = args.step;
  const base = step
    ? graphTelemetryPayload(args.event, step, { pathwayId: args.pathwayId ?? step.pathwayId })
    : ({
        event: args.event,
        competencyId: null,
        stepKind: "remediation_review",
        topicSlug: args.topicSlug ?? "unknown",
        sourceSurface: args.sourceSurface,
        learnerStateReason: null,
        remediationPriority: 1,
        graphDepth: 0,
        pathwayId: args.pathwayId ?? args.cognition.pathwayId,
      } satisfies GraphTelemetryPayload);

  const payload: GraphTelemetryPayload = {
    ...base,
    graphDepth: step?.graphDepth ?? base.graphDepth ?? 0,
    ontologyNamespace: EDUCATIONAL_ONTOLOGY_NAMESPACE,
  };

  const props = toGovernedGraphCaptureProps(payload, args.cognition);
  props.remediation_pathway = args.cognition.ontology.remediationPathwayIds[0];
  if (args.stepCount != null) props.step_count = args.stepCount;

  captureGovernedLearnerProductEvent(args.userId, args.entitlement, args.event, props);
}
