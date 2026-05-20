/**
 * Replayable graph telemetry — deterministic continuity checkpoints.
 */

import type { PsychometricLineageStamp } from "@/lib/breadcrumbs/governance/psychometric-lineage-validation";
import { resolvePsychometricLineageStamp } from "@/lib/breadcrumbs/governance/psychometric-lineage-validation";
import { normalizeEducationalPathname } from "@/lib/breadcrumbs/pathname-normalization";

export type GraphTelemetryReplayKind =
  | "glossary_traversal"
  | "remediation_chain"
  | "dashboard_graph_action"
  | "tutoring_continuation"
  | "adaptive_next_action"
  | "hydration_normalization_fallback"
  | "remediation_return_recovery";

export type GraphTelemetryReplayFrame = {
  kind: GraphTelemetryReplayKind;
  pathname: string;
  pathwayId: string | null;
  topicSlug?: string;
  remediationPathwayId?: string;
  graphStepId?: string;
  stamp: PsychometricLineageStamp;
  capturedAt: string;
};

export type GraphTelemetryReplaySnapshot = {
  frames: GraphTelemetryReplayFrame[];
  continuityCheckpoint: string;
  ontologyRevision: string;
  graphVersion: string;
};

export function captureGraphTelemetryReplayFrame(args: {
  kind: GraphTelemetryReplayKind;
  pathname: string;
  pathwayId?: string | null;
  topicSlug?: string;
  remediationPathwayId?: string;
  graphStepId?: string;
  educationalIntent?: string;
}): GraphTelemetryReplayFrame {
  const stamp = resolvePsychometricLineageStamp({
    pathwayId: args.pathwayId,
    educationalIntent: args.educationalIntent,
  });
  return {
    kind: args.kind,
    pathname: normalizeEducationalPathname(args.pathname),
    pathwayId: args.pathwayId ?? null,
    topicSlug: args.topicSlug,
    remediationPathwayId: args.remediationPathwayId,
    graphStepId: args.graphStepId,
    stamp,
    capturedAt: new Date().toISOString(),
  };
}

export function buildGraphTelemetryReplaySnapshot(
  frames: readonly GraphTelemetryReplayFrame[],
): GraphTelemetryReplaySnapshot {
  const last = frames[frames.length - 1];
  const stamp = last?.stamp ?? resolvePsychometricLineageStamp();
  const continuityCheckpoint = [
    last?.remediationPathwayId ?? "",
    last?.graphStepId ?? "",
    last?.pathname ?? "",
  ].join(":");

  return {
    frames: [...frames],
    continuityCheckpoint,
    ontologyRevision: stamp.ontologyRevision,
    graphVersion: stamp.graphVersion,
  };
}

export function replayGlossaryTraversal(
  frames: readonly GraphTelemetryReplayFrame[],
): GraphTelemetryReplaySnapshot {
  const glossary = frames.filter((f) => f.kind === "glossary_traversal");
  return buildGraphTelemetryReplaySnapshot(glossary);
}

export function replayRemediationChain(
  frames: readonly GraphTelemetryReplayFrame[],
): GraphTelemetryReplaySnapshot {
  const chain = frames.filter(
    (f) => f.kind === "remediation_chain" || f.kind === "remediation_return_recovery",
  );
  return buildGraphTelemetryReplaySnapshot(chain);
}

export function assertReplayLineageConsistent(snapshot: GraphTelemetryReplaySnapshot): string[] {
  const issues: string[] = [];
  for (const frame of snapshot.frames) {
    if (frame.stamp.graphVersion !== snapshot.graphVersion) {
      issues.push(`frame_drift:${frame.kind}:${frame.pathname}`);
    }
  }
  return issues;
}
