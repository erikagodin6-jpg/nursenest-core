import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { EduGraphStep, GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import {
  telemetryPayloadForGraphStep,
  type GraphTelemetryEventName,
  type GraphTelemetryPayload,
} from "@/lib/educational-graph/graph-telemetry";

export function captureGovernedGraphTelemetryServer(input: {
  event: GraphTelemetryEventName;
  step?: EduGraphStep;
  topicSlug?: string;
  sourceSurface?: GraphSourceSurface;
  pathwayId?: string | null;
  competencyId?: string | null;
}): void {
  const payload: GraphTelemetryPayload = input.step
    ? telemetryPayloadForGraphStep(input.step)
    : {
        topic_slug: input.topicSlug ?? "unknown",
        source_surface: input.sourceSurface ?? "unknown",
        pathway_id: input.pathwayId ?? undefined,
        competency_id: input.competencyId ?? undefined,
      };
  safeServerLog("educational_graph", input.event, payload);
}
