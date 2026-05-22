"use client";

/**
 * Governed graph telemetry — normalized payloads, dedupe, psychometric-safe capture.
 */
import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import {
  graphTelemetryPayload,
  type GraphTelemetryEventName,
  type GraphTelemetryPayload,
} from "@/lib/educational-graph/graph-telemetry";
import type { EduGraphStep, GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import { EDUCATIONAL_ONTOLOGY_NAMESPACE } from "@/lib/educational-graph/educational-ontology-constants";
import { logGraphGovernanceViolation } from "@/lib/educational-graph/graph-governance-observability";
import { toGovernedGraphCaptureProps } from "@/lib/educational-graph/governed-graph-telemetry-props";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";

export { toGovernedGraphCaptureProps } from "@/lib/educational-graph/governed-graph-telemetry-props";

const DEDUPE_PREFIX = "nn_graph_telemetry:";
const MAX_GRAPH_DEPTH = 12;

function dedupeKey(event: string, stepId: string | undefined): string {
  return `${DEDUPE_PREFIX}${event}:${stepId ?? "path"}`;
}

function shouldSuppressDuplicate(event: string, stepId: string | undefined): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = dedupeKey(event, stepId);
    if (sessionStorage.getItem(key)) return true;
    sessionStorage.setItem(key, "1");
    return false;
  } catch {
    return false;
  }
}

function validatePayload(
  payload: GraphTelemetryPayload,
  pathwayId: string | null | undefined,
): boolean {
  if (payload.graphDepth != null && payload.graphDepth > MAX_GRAPH_DEPTH) {
    logGraphGovernanceViolation({
      code: "graph_depth.overflow",
      surface: payload.sourceSurface,
      pathwayId: pathwayId ?? null,
      topicSlug: payload.topicSlug,
      detail: `graphDepth ${payload.graphDepth} exceeds cap ${MAX_GRAPH_DEPTH}`,
    });
    return false;
  }
  if (!payload.sourceSurface?.trim()) {
    logGraphGovernanceViolation({
      code: "telemetry_payload.violation",
      surface: "unknown",
      pathwayId: pathwayId ?? null,
      detail: "Missing sourceSurface on graph telemetry payload",
    });
    return false;
  }
  const model = getTestingModelForPathwayId(pathwayId);
  if (model === "LOFT" && /^cat_/i.test(payload.stepKind)) {
    logGraphGovernanceViolation({
      code: "graph_governance.violation",
      surface: payload.sourceSurface,
      pathwayId: pathwayId ?? null,
      detail: `LOFT pathway blocked CAT stepKind telemetry: ${payload.stepKind}`,
    });
    return false;
  }
  return true;
}

export async function captureGovernedGraphTelemetry(args: {
  event: GraphTelemetryEventName;
  step?: EduGraphStep;
  pathwayId?: string | null;
  topicSlug?: string;
  sourceSurface?: GraphSourceSurface;
  competencyId?: string | null;
  learnerStateReason?: string | null;
  remediationPriority?: number;
  graphDepth?: number;
  stepCount?: number;
  cognition?: EducationalCognitionContext | null;
  suppressDedupe?: boolean;
}): Promise<void> {
  const step = args.step;
  const sourceSurface = args.sourceSurface ?? step?.sourceSurface ?? "app_remediation";
  const base = step
    ? graphTelemetryPayload(args.event, step, {
        pathwayId: args.pathwayId ?? step.pathwayId,
      })
    : ({
        event: args.event,
        competencyId: args.competencyId ?? null,
        stepKind: "remediation_review",
        topicSlug: args.topicSlug ?? "unknown",
        sourceSurface,
        learnerStateReason: args.learnerStateReason ?? null,
        remediationPriority: args.remediationPriority ?? 1,
        pathwayId: args.pathwayId ?? null,
        graphDepth: args.graphDepth ?? 0,
      } satisfies GraphTelemetryPayload);

  const payload: GraphTelemetryPayload = {
    ...base,
    sourceSurface,
    graphDepth: args.graphDepth ?? step?.graphDepth ?? 0,
    ontologyNamespace: EDUCATIONAL_ONTOLOGY_NAMESPACE,
  };

  if (!validatePayload(payload, args.pathwayId ?? step?.pathwayId)) return;

  if (!args.suppressDedupe && shouldSuppressDuplicate(args.event, payload.stepId)) return;

  const props = toGovernedGraphCaptureProps(payload, args.cognition);
  if (args.stepCount != null) props.step_count = args.stepCount;

  await trackClientEvent(args.event, props);
}

export function captureGraphStepViewed(
  step: EduGraphStep,
  cognition?: EducationalCognitionContext | null,
): void {
  void captureGovernedGraphTelemetry({
    event: "graph_step_viewed",
    step,
    cognition,
    suppressDedupe: true,
  });
}

export function captureGraphStepClicked(
  step: EduGraphStep,
  cognition?: EducationalCognitionContext | null,
): void {
  void captureGovernedGraphTelemetry({ event: "graph_step_clicked", step, cognition });
}
