import type { PersistedGraphContinuity } from "@/lib/educational-cognition/cognition-snapshot-types";
import {
  pruneStaleGraphContinuity,
  validateGraphContinuityReplay,
} from "@/lib/educational-cognition/graph-next-step-continuity";
import { GRAPH_VERSION } from "@/lib/educational-cognition/cognition-version-governance";

export type GraphContinuityReplayResult = {
  continuity: PersistedGraphContinuity;
  restored: boolean;
  warnings: string[];
  checkpointHref: string | null;
};

/**
 * Restores continuity checkpoints after ontology/graph version drift.
 */
export function replayGraphContinuityCheckpoint(
  stored: PersistedGraphContinuity | undefined,
  options?: { forceOntologyMigration?: boolean },
): GraphContinuityReplayResult {
  const warnings: string[] = [];
  if (!stored) {
    return {
      continuity: {
        currentTopicSlug: null,
        remediationPathwayIds: [],
        glossaryContinuityKeys: [],
        interpretationContinuityKeys: [],
        lastGraphStepId: null,
        lastGraphHref: null,
        graphVersion: GRAPH_VERSION,
        graphCheckpointAt: new Date().toISOString(),
      },
      restored: false,
      warnings: ["no_stored_continuity"],
      checkpointHref: null,
    };
  }

  let continuity = { ...stored };
  const validation = validateGraphContinuityReplay(continuity);
  warnings.push(...validation.warnings);

  if (options?.forceOntologyMigration || continuity.graphVersion !== GRAPH_VERSION) {
    warnings.push("ontology_checkpoint_migration");
    continuity = {
      ...continuity,
      graphVersion: GRAPH_VERSION,
      graphCheckpointAt: new Date().toISOString(),
    };
  }

  continuity = pruneStaleGraphContinuity(continuity);

  const checkpointHref =
    continuity.remediationReturnHref ??
    continuity.dashboardContinuationHref ??
    continuity.adaptiveAnchorHref ??
    continuity.lastGraphHref ??
    null;

  return {
    continuity,
    restored: validation.valid && checkpointHref != null,
    warnings,
    checkpointHref,
  };
}
