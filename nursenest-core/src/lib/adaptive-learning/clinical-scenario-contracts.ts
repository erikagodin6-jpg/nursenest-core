/**
 * Clinical scenario foundation — **contracts only** (no DB, no migrations).
 * Future OSCE / branching lab flows can implement these shapes without changing
 * learner lesson/CAT routes in this phase.
 */

/** Learner-visible rationale depth (progression), not question bank rationale text. */
export type ClinicalRationaleProgression =
  | "none"
  | "hint_only"
  | "partial_rationale"
  | "full_rationale_after_commit";

/** Single node in a branching scenario graph (stub — no runtime interpreter here). */
export interface ClinicalScenarioNodeContract {
  id: string;
  title: string;
  /** Optional narrative / prompt reference id (content layer, not stored here). */
  promptRef?: string;
  choices: readonly ClinicalScenarioChoiceContract[];
}

export interface ClinicalScenarioChoiceContract {
  id: string;
  label: string;
  /** Target node id — graph integrity validated by future authoring tools. */
  nextNodeId: string | null;
  /** Tags for analytics aggregation (non-PII). */
  outcomeTags?: readonly string[];
}

export interface ClinicalBranchingScenarioContract {
  version: 1;
  scenarioId: string;
  pathwayId: string;
  entryNodeId: string;
  nodes: readonly ClinicalScenarioNodeContract[];
}

/**
 * Timed step hooks — callers attach timers in UI/runtime; this contract names phases only.
 */
export interface ClinicalTimedStepHookContract {
  stepId: string;
  /** Soft warning before hard cutoff (seconds from step start). */
  warnAtSec?: number;
  hardCapSec?: number;
  /** What to reveal when time elapses without a committed answer. */
  onExpireProgression: ClinicalRationaleProgression;
}

/**
 * Stub analytics event — **not** wired to PostHog/product analytics in this phase.
 * Shape is stable for future server-side emitters (still entitlement-scoped).
 */
export type ClinicalScenarioAnalyticsEventName =
  | "clinical_scenario_started"
  | "clinical_scenario_choice"
  | "clinical_scenario_completed"
  | "clinical_scenario_abandoned";

export interface ClinicalScenarioAnalyticsEventStub {
  name: ClinicalScenarioAnalyticsEventName;
  scenarioId: string;
  pathwayId: string;
  /** Anonymous step/choice ids only — no free-text learner input. */
  stepOrChoiceId?: string;
  elapsedMs?: number;
}
