import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

/**
 * Optional server-side learner-state envelope (privacy-safe, no PII beyond pathway).
 * Client merges with localStorage; educator/cohort analytics can subscribe later.
 */
export type LearnerStateServerEnvelope = {
  version: 1;
  updatedAt: string;
  pathwayId: string | null;
  snapshot: RnLearnerStateSnapshot;
  /** Hash for drift detection — not reversible to raw answers. */
  stateFingerprint: string;
};

export function fingerprintLearnerState(state: RnLearnerStateSnapshot): string {
  const payload = JSON.stringify({
    v: state.version,
    pathwayId: state.pathwayId,
    trajectoryLen: state.readinessTrajectory.length,
    competencyIds: state.competencyStates.map((c) => c.competencyId).sort(),
    measurement: state.measurementWeaknesses.slice(0, 8),
  });
  let h = 0;
  for (let i = 0; i < payload.length; i++) h = (h * 31 + payload.charCodeAt(i)) >>> 0;
  return `rn_ls_${h.toString(16)}`;
}

export function wrapLearnerStateForServer(state: RnLearnerStateSnapshot): LearnerStateServerEnvelope {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    pathwayId: state.pathwayId,
    snapshot: state,
    stateFingerprint: fingerprintLearnerState(state),
  };
}

export function mergeServerLearnerState(
  local: RnLearnerStateSnapshot | null,
  remote: RnLearnerStateSnapshot | null,
): RnLearnerStateSnapshot | null {
  if (!remote) return local;
  if (!local) return remote;
  if (remote.updatedAt >= local.updatedAt) return remote;
  return local;
}
