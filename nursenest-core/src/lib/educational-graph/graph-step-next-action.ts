import type { EduGraphStepKind } from "@/lib/educational-graph/graph-step-contract";
import type { GraphTelemetryEventName } from "@/lib/educational-graph/graph-telemetry";

export function graphStepForTelemetryEvent(kind: EduGraphStepKind): GraphTelemetryEventName {
  if (kind === "reassessment" || kind === "mixed_reassessment" || kind === "cat") {
    return "reassessment_route_opened";
  }
  if (kind === "interpretation") return "interpretation_path_opened";
  return "graph_step_clicked";
}
