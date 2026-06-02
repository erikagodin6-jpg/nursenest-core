/**
 * Clinical simulation **contracts only** — no UI, persistence, or scoring engine.
 * Future implementations own state machines and entitlements; these types are integration seams.
 */

export type SimulationBranchId = string;

export type SimulationTimedStep = {
  id: string;
  /** Wall-clock budget for learner action at this node. */
  durationMs: number;
  /** Optional pointer to instructional copy key / CMS id — not inline clinical text. */
  contentRef?: string;
};

export type SimulationEvent =
  | { type: "started"; atMs: number }
  | { type: "branch_selected"; atMs: number; branchId: SimulationBranchId }
  | { type: "step_completed"; atMs: number; stepId: string; score?: number }
  | { type: "timed_out"; atMs: number; stepId: string }
  | { type: "ended"; atMs: number; outcome: "pass" | "retry" | "abort" };

export type SimulationScoringHookPayload = {
  simulationId: string;
  pathwayId: string;
  events: SimulationEvent[];
};

/** Hook surface for analytics / future rubric engines — keep payloads bounded. */
export type SimulationScoringHook = (payload: SimulationScoringHookPayload) => void;

export type SimulationState = {
  simulationId: string;
  pathwayId: string;
  currentBranchId: SimulationBranchId | null;
  /** Monotonic server clock for ordering only. */
  startedAtMs: number;
  /** Completed + pending step ids for the active branch. */
  stepTimeline: SimulationTimedStep[];
  /** Append-only event log (bounded by caller before persistence). */
  events: SimulationEvent[];
};
