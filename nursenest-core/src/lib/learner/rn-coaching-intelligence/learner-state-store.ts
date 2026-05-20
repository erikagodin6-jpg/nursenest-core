import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

const STORAGE_KEY = (userId: string) => `nn_rn_learner_state_v1_${userId}`;

export function readLearnerState(userId: string): RnLearnerStateSnapshot | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const raw = window.localStorage.getItem(STORAGE_KEY(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RnLearnerStateSnapshot;
    if (parsed?.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeLearnerState(userId: string, state: RnLearnerStateSnapshot): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    state.readinessTrajectory = state.readinessTrajectory.slice(-12);
    state.reasoningPatterns = state.reasoningPatterns.slice(-8);
    state.measurementWeaknesses = state.measurementWeaknesses.slice(-6);
    state.competencyStates = state.competencyStates.slice(0, 16);
    window.localStorage.setItem(STORAGE_KEY(userId), JSON.stringify(state));
  } catch {
    /* quota */
  }
}

export function mergeLearnerState(
  userId: string,
  incoming: RnLearnerStateSnapshot,
): RnLearnerStateSnapshot {
  const existing = readLearnerState(userId) ?? EMPTY_LEARNER_STATE(incoming.pathwayId);
  const trajectory = [...existing.readinessTrajectory, ...incoming.readinessTrajectory].slice(-12);
  const patterns = [...new Set([...existing.reasoningPatterns, ...incoming.reasoningPatterns])].slice(-8);
  const measurement = [...new Set([...existing.measurementWeaknesses, ...incoming.measurementWeaknesses])].slice(-6);

  const competencyById = new Map(existing.competencyStates.map((c) => [c.competencyId, c]));
  for (const c of incoming.competencyStates) {
    const prev = competencyById.get(c.competencyId);
    if (!prev || c.lastUpdatedAt >= prev.lastUpdatedAt) competencyById.set(c.competencyId, c);
  }

  return {
    ...existing,
    ...incoming,
    updatedAt: incoming.updatedAt,
    readinessTrajectory: trajectory,
    reasoningPatterns: patterns,
    measurementWeaknesses: measurement,
    competencyStates: [...competencyById.values()],
    remediationFatigueScore: Math.min(
      1,
      Math.max(existing.remediationFatigueScore, incoming.remediationFatigueScore),
    ),
    confidenceInstability: Math.max(existing.confidenceInstability, incoming.confidenceInstability),
    readinessMomentum: incoming.readinessMomentum || existing.readinessMomentum,
  };
}

export function persistLearnerState(userId: string, state: RnLearnerStateSnapshot): void {
  writeLearnerState(userId, mergeLearnerState(userId, state));
  persistLearnerStateToSession(state);
}

const SESSION_STATE_KEY = "nn_rn_learner_state_session_v1";

/** Session mirror for dashboard orchestration (no userId required on read). */
export function persistLearnerStateToSession(state: RnLearnerStateSnapshot): void {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    window.sessionStorage.setItem(SESSION_STATE_KEY, JSON.stringify(state));
  } catch {
    /* quota */
  }
}

export function readLearnerStateFromSession(): RnLearnerStateSnapshot | null {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return null;
    const raw = window.sessionStorage.getItem(SESSION_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RnLearnerStateSnapshot;
    return parsed?.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}
