import "server-only";

import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import { captureGovernedGraphTelemetryServer } from "@/lib/educational-graph/capture-governed-graph-telemetry-server";
import type { GraphTelemetryEventName } from "@/lib/educational-graph/graph-telemetry";
import type { EduGraphStep, GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import {
  buildGraphLineageEnvelope,
  graphLineageTelemetryProps,
  type GraphLineageEnvelope,
} from "@/lib/educational-graph/graph-lineage-envelope";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";
import type { CognitionReliabilityTier } from "@/lib/educational-cognition/cognition-snapshot-types";

export type GovernedServerTelemetryInput = {
  userId: string;
  entitlement: AccessScope;
  event: GraphTelemetryEventName;
  cognition: EducationalCognitionContext;
  sourceSurface: GraphSourceSurface;
  step?: EduGraphStep;
  topicSlug?: string;
  stepCount?: number;
  cognitionReliabilityTier?: CognitionReliabilityTier;
};

export function emitGovernedServerGraphTelemetry(
  input: GovernedServerTelemetryInput,
): GraphLineageEnvelope {
  const pathwayId = input.cognition.pathwayId;
  const lineage = buildGraphLineageEnvelope({
    pathwayId,
    sourceSurface: input.sourceSurface,
    educationalIntent: input.step?.educationalIntent ?? null,
    testingModel:
      input.cognition.psychometric.model ?? getTestingModelForPathwayId(pathwayId),
    cognitionReliabilityTier: input.cognitionReliabilityTier ?? "inferred",
    topicSlug: input.step?.topicSlug ?? input.topicSlug,
    stepId: input.step?.stepId,
  });

  captureGovernedGraphTelemetryServer({
    userId: input.userId,
    entitlement: input.entitlement,
    event: input.event,
    step: input.step,
    pathwayId,
    topicSlug: input.topicSlug ?? input.step?.topicSlug,
    sourceSurface: input.sourceSurface,
    cognition: input.cognition,
    stepCount: input.stepCount,
    lineageProps: graphLineageTelemetryProps(lineage),
  });

  return lineage;
}
