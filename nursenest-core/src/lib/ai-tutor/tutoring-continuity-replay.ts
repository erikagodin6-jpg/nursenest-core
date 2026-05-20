import type { TutoringGraphContinuitySnapshot } from "@/lib/ai-tutor/ai-tutor-substrate-governance";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import {
  captureGraphRuntimeReplay,
  assertReplayDeterminism,
  type GraphRuntimeReplaySnapshot,
} from "@/lib/educational-graph/graph-runtime-replay";

export type TutoringContinuityReplay = {
  sessionCheckpointId: string;
  snapshot: TutoringGraphContinuitySnapshot;
  graphReplay: GraphRuntimeReplaySnapshot;
};

export function captureTutoringContinuityReplay(
  snapshot: TutoringGraphContinuitySnapshot,
): TutoringContinuityReplay {
  const graphReplay = captureGraphRuntimeReplay({
    kind: "remediation_ladder",
    pathwayId: snapshot.pathwayId,
    steps: snapshot.graphSteps,
    sourceSurface: "ai_tutor",
  });
  return {
    sessionCheckpointId: snapshot.lineage.continuityCheckpointId,
    snapshot,
    graphReplay,
  };
}

export function recoverTutoringContinuation(
  prior: TutoringContinuityReplay,
  currentSteps: readonly EduGraphStep[],
): { steps: readonly EduGraphStep[]; diverged: boolean } {
  const nextReplay = captureGraphRuntimeReplay({
    kind: "remediation_ladder",
    pathwayId: prior.snapshot.pathwayId,
    steps: currentSteps,
    sourceSurface: "ai_tutor",
  });
  const drift = assertReplayDeterminism(prior.graphReplay, nextReplay);
  if (!drift) return { steps: currentSteps, diverged: false };
  return { steps: prior.snapshot.graphSteps, diverged: true };
}
