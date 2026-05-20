/**
 * Deterministic graph-runtime replay snapshots — dashboard, remediation, adaptive, interpretation.
 */
import type { DashboardGraphAction } from "@/lib/educational-graph/dashboard-graph-actions";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import {
  buildGraphLineageEnvelope,
  graphLineageTelemetryProps,
  type GraphLineageEnvelope,
} from "@/lib/educational-graph/graph-lineage-envelope";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";

export type GraphRuntimeReplaySnapshot = {
  kind:
    | "dashboard_actions"
    | "remediation_ladder"
    | "adaptive_next_action"
    | "interpretation_entry"
    | "glossary_traversal";
  pathwayId: string;
  steps: readonly EduGraphStep[];
  lineage: GraphLineageEnvelope;
  capturedAtMs: number;
};

export function captureGraphRuntimeReplay(args: {
  kind: GraphRuntimeReplaySnapshot["kind"];
  pathwayId: string;
  steps: readonly EduGraphStep[];
  sourceSurface: string;
}): GraphRuntimeReplaySnapshot {
  const primary = args.steps[0];
  const lineage = buildGraphLineageEnvelope({
    pathwayId: args.pathwayId,
    sourceSurface: args.sourceSurface,
    educationalIntent: primary?.educationalIntent ?? null,
    testingModel: getTestingModelForPathwayId(args.pathwayId),
    topicSlug: primary?.topicSlug,
    stepId: primary?.stepId,
  });
  return {
    kind: args.kind,
    pathwayId: args.pathwayId,
    steps: args.steps,
    lineage,
    capturedAtMs: Date.now(),
  };
}

export function replayDashboardActions(
  actions: DashboardGraphAction[],
  pathwayId: string,
): GraphRuntimeReplaySnapshot {
  return captureGraphRuntimeReplay({
    kind: "dashboard_actions",
    pathwayId,
    steps: actions.map((a) => a.step),
    sourceSurface: "dashboard_feed",
  });
}

export function assertReplayDeterminism(
  prior: GraphRuntimeReplaySnapshot,
  next: GraphRuntimeReplaySnapshot,
): string | null {
  if (prior.pathwayId !== next.pathwayId) return "replay_divergent:pathway";
  if (prior.lineage.ontologyRevision !== next.lineage.ontologyRevision) {
    return "replay_divergent:ontology";
  }
  if (prior.steps.length !== next.steps.length) return "replay_divergent:step_count";
  for (let i = 0; i < prior.steps.length; i++) {
    if (prior.steps[i]!.stepId !== next.steps[i]!.stepId) return "replay_divergent:step_order";
    if (prior.steps[i]!.href !== next.steps[i]!.href) return "replay_divergent:href";
  }
  return null;
}

export function replayTelemetryProps(
  snapshot: GraphRuntimeReplaySnapshot,
): Record<string, string | number | boolean | undefined> {
  return {
    ...graphLineageTelemetryProps(snapshot.lineage),
    replay_kind: snapshot.kind,
    replay_step_count: snapshot.steps.length,
    replay_captured_at_ms: snapshot.capturedAtMs,
  };
}
