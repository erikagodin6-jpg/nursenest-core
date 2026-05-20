"use client";

import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import type { EduGraphStep, GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import {
  telemetryPayloadForGraphStep,
  type GraphTelemetryEventName,
  type GraphTelemetryPayload,
} from "@/lib/educational-graph/graph-telemetry";

type CaptureGovernedGraphTelemetryInput = {
  event: GraphTelemetryEventName;
  step?: EduGraphStep;
  topicSlug?: string;
  sourceSurface?: GraphSourceSurface;
  pathwayId?: string | null;
  competencyId?: string | null;
  stepCount?: number;
  graphDepth?: number;
  remediationPriority?: string;
  cognition?: EducationalCognitionContext | null;
  suppressDedupe?: boolean;
};

const seen = new Set<string>();

function payloadFromInput(input: CaptureGovernedGraphTelemetryInput): GraphTelemetryPayload {
  if (input.step) return telemetryPayloadForGraphStep(input.step);
  return {
    topic_slug: input.topicSlug ?? "unknown",
    source_surface: input.sourceSurface ?? "unknown",
    pathway_id: input.pathwayId ?? undefined,
    competency_id: input.competencyId ?? undefined,
    step_count: input.stepCount,
    graph_depth: input.graphDepth,
    remediation_priority: input.remediationPriority,
  };
}

export async function captureGovernedGraphTelemetry(input: CaptureGovernedGraphTelemetryInput): Promise<void> {
  const payload = payloadFromInput(input);
  if (!input.suppressDedupe) {
    const key = `${input.event}:${payload.topic_slug}:${payload.source_surface}:${payload.step_id ?? payload.graph_depth ?? ""}`;
    if (seen.has(key)) return;
    seen.add(key);
  }
  await trackClientEvent(input.event, payload);
}

export function captureGraphStepClicked(step: EduGraphStep, cognition?: EducationalCognitionContext | null): void {
  void captureGovernedGraphTelemetry({ event: "graph_step_clicked", step, cognition });
}

export function captureGraphStepViewed(step: EduGraphStep, cognition?: EducationalCognitionContext | null): void {
  void captureGovernedGraphTelemetry({ event: "graph_step_viewed", step, cognition });
}
