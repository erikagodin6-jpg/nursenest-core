/**
 * Deteriorating Patient Physiology Monitor Engine
 *
 * Tick-based simulation engine. Each tick advances the simulation by
 * SIM_SECONDS_PER_TICK seconds of clinical time.
 *
 * Usage (React):
 *   const engineRef = useRef(new MonitorEngine("sepsis"));
 *   useEffect(() => {
 *     const id = setInterval(() => {
 *       engineRef.current.tick();
 *       setState(engineRef.current.getState());
 *     }, REAL_MS_PER_TICK);
 *     return () => clearInterval(id);
 *   }, []);
 */

import {
  type PhysiologyState,
  type PhysiologySnapshot,
  type ActiveIntervention,
  BASELINE_PHYSIOLOGY_STATE,
  PHYSIOLOGY_CLAMPS,
  computeMap,
  clampVital,
} from "./physiology-state";
import {
  type DeteriorationPattern,
  type ConditionStageDefinition,
  getDeteriorationPattern,
} from "./deterioration-patterns";
import {
  type Intervention,
  getIntervention,
} from "./intervention-catalog";

// ─── Engine configuration ─────────────────────────────────────────────────────

export const SIM_SECONDS_PER_TICK = 30; // 30 clinical seconds per engine tick
export const REAL_MS_PER_TICK = 2000;   // 2 real-seconds per tick (15× speedup)
export const MAX_HISTORY_TICKS = 120;   // 120 ticks = 60 sim-minutes of trend data

const STAGE_ORDER: PhysiologyState["conditionStage"][] = ["early", "developing", "severe", "critical"];

// ─── Engine scoring types ─────────────────────────────────────────────────────

export interface ScoringEvent {
  type: "recognition" | "intervention" | "escalation";
  tick: number;
  simSeconds: number;
  detail: string;
  score: number;
}

export interface SimulationScore {
  recognitionTimeSec: number | null;
  firstInterventionTimeSec: number | null;
  interventionCount: number;
  criticalAlarmHandled: boolean;
  events: ScoringEvent[];
}

// ─── Monitor Engine ───────────────────────────────────────────────────────────

export class MonitorEngine {
  private state: PhysiologyState;
  private history: PhysiologySnapshot[] = [];
  private pattern: DeteriorationPattern;
  private interventionCooldowns: Map<string, number> = new Map();
  private scoringEvents: ScoringEvent[] = [];
  private recognitionTick: number | null = null;
  private firstInterventionTick: number | null = null;

  constructor(conditionKey: string) {
    const pattern = getDeteriorationPattern(conditionKey);
    if (!pattern) throw new Error(`Unknown condition key: ${conditionKey}`);
    this.pattern = pattern;
    this.state = this.buildInitialState(pattern);
    this.snapshot();
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /** Advance simulation by one tick. */
  tick(): void {
    const currentState = { ...this.state };
    const stage = currentState.conditionStage;
    const stageDef = this.pattern.stages[stage];

    // Age active interventions, expire finished ones
    const stillActive: ActiveIntervention[] = [];
    const expiredKeys: string[] = [];

    for (const ai of currentState.activeInterventions) {
      const elapsed = currentState.tick - ai.appliedAtTick;
      if (elapsed < ai.durationTicks) {
        stillActive.push(ai);
      } else {
        expiredKeys.push(ai.key);
      }
    }

    // Apply deterioration deltas (modified by active interventions)
    const nextState = this.applyDeteriorationDeltas(currentState, stageDef, stillActive);

    // Apply sustained intervention deltas
    for (const ai of stillActive) {
      const intervention = getIntervention(ai.key);
      if (!intervention) continue;
      const deltas = intervention.effect.sustainedDeltasPerTick;
      this.applyDeltasToState(nextState, deltas);
    }

    nextState.activeInterventions = stillActive;
    nextState.tick += 1;
    nextState.ticksInCurrentStage += 1;

    // Recompute MAP from SBP/DBP
    nextState.map = computeMap(nextState.systolicBP, nextState.diastolicBP);

    // Sync ECG rate to HR unless rhythm is fixed (VF, asystole)
    if (!["ventricular_fibrillation", "asystole"].includes(nextState.ecgRhythmKey)) {
      nextState.ecgRate = nextState.heartRate;
    } else {
      nextState.ecgRate = 0;
    }

    // Advance condition stage if stage duration exceeded
    const stageIndex = STAGE_ORDER.indexOf(stage);
    if (
      nextState.ticksInCurrentStage >= stageDef.durationTicks &&
      stageIndex < STAGE_ORDER.length - 1
    ) {
      const nextStage = STAGE_ORDER[stageIndex + 1]!;
      nextState.conditionStage = nextStage;
      nextState.ticksInCurrentStage = 0;

      // Apply ECG transition for new stage
      const nextStageDef = this.pattern.stages[nextStage];
      nextState.ecgRhythmKey = nextStageDef.ecgRhythmKey;
      nextState.ecgFeatures = { ...nextStageDef.ecgFeatures };
      nextState.ecgQrsWidth = nextStageDef.ecgQrsWidth;
    }

    // Clamp all numeric vitals
    this.clampState(nextState);

    this.state = nextState;
    this.snapshot();

    // Cool down intervention cooldowns
    for (const [key, cooldownUntil] of this.interventionCooldowns.entries()) {
      if (this.state.tick >= cooldownUntil) {
        this.interventionCooldowns.delete(key);
      }
    }
  }

  /** Apply an intervention immediately and begin sustained effects. */
  applyIntervention(interventionKey: string): { ok: boolean; message: string } {
    const intervention = getIntervention(interventionKey);
    if (!intervention) return { ok: false, message: `Unknown intervention: ${interventionKey}` };

    // Check cooldown
    const cooldownUntil = this.interventionCooldowns.get(interventionKey) ?? 0;
    if (this.state.tick < cooldownUntil) {
      return { ok: false, message: `${intervention.label} is on cooldown.` };
    }

    // Check if already active (for non-repeatable)
    if (!intervention.repeatable) {
      const alreadyActive = this.state.activeInterventions.some((ai) => ai.key === interventionKey);
      if (alreadyActive) return { ok: false, message: `${intervention.label} is already active.` };
    }

    const next = { ...this.state };

    // Apply immediate deltas
    this.applyDeltasToState(next, intervention.effect.immediateDeltas);

    // Apply rhythm change
    if (intervention.effect.rhythmChange) {
      next.ecgRhythmKey = intervention.effect.rhythmChange;
    }

    // Apply ECG feature overrides
    if (intervention.effect.ecgFeaturesSet) {
      next.ecgFeatures = { ...next.ecgFeatures, ...intervention.effect.ecgFeaturesSet };
    }

    // Stage rollback
    if (intervention.effect.stageRollback) {
      const idx = STAGE_ORDER.indexOf(next.conditionStage);
      if (idx > 0) {
        const prevStage = STAGE_ORDER[idx - 1]!;
        next.conditionStage = prevStage;
        next.ticksInCurrentStage = 0;
        const prevStageDef = this.pattern.stages[prevStage];
        next.ecgRhythmKey = intervention.effect.rhythmChange ?? prevStageDef.ecgRhythmKey;
        next.ecgFeatures = intervention.effect.ecgFeaturesSet
          ? { ...prevStageDef.ecgFeatures, ...intervention.effect.ecgFeaturesSet }
          : { ...prevStageDef.ecgFeatures };
        next.ecgQrsWidth = prevStageDef.ecgQrsWidth;
      }
    }

    // Register as active intervention for sustained effects
    if (intervention.effect.durationTicks > 0) {
      next.activeInterventions = [
        ...next.activeInterventions.filter((ai) => ai.key !== interventionKey),
        {
          key: interventionKey,
          label: intervention.label,
          appliedAtTick: next.tick,
          durationTicks: intervention.effect.durationTicks,
        },
      ];
    }

    // Recompute MAP
    next.map = computeMap(next.systolicBP, next.diastolicBP);
    if (!["ventricular_fibrillation", "asystole"].includes(next.ecgRhythmKey)) {
      next.ecgRate = next.heartRate;
    }

    // Set cooldown
    if (intervention.repeatable && intervention.repeatCooldownTicks) {
      this.interventionCooldowns.set(interventionKey, next.tick + intervention.repeatCooldownTicks);
    }

    this.clampState(next);
    this.state = next;
    this.snapshot();

    // Record scoring event
    if (this.firstInterventionTick === null) {
      this.firstInterventionTick = next.tick;
    }
    this.scoringEvents.push({
      type: "intervention",
      tick: next.tick,
      simSeconds: next.tick * SIM_SECONDS_PER_TICK,
      detail: intervention.label,
      score: intervention.effect.stageRollback ? 10 : 5,
    });

    return { ok: true, message: `Applied: ${intervention.label}` };
  }

  /** Mark that the learner has recognized / acknowledged a critical finding. */
  recordRecognition(detail: string): void {
    if (this.recognitionTick === null) {
      this.recognitionTick = this.state.tick;
    }
    this.scoringEvents.push({
      type: "recognition",
      tick: this.state.tick,
      simSeconds: this.state.tick * SIM_SECONDS_PER_TICK,
      detail,
      score: 10,
    });
  }

  // ── Accessors ───────────────────────────────────────────────────────────────

  getState(): Readonly<PhysiologyState> {
    return this.state;
  }

  /**
   * Returns snapshots for a given trend window.
   * @param windowMinutes  5 | 15 | 30 | 60  (default all)
   */
  getHistory(windowMinutes?: 5 | 15 | 30 | 60): PhysiologySnapshot[] {
    if (!windowMinutes) return [...this.history];
    const ticksNeeded = (windowMinutes * 60) / SIM_SECONDS_PER_TICK;
    return this.history.slice(-ticksNeeded);
  }

  /** Scoring summary at current point in simulation. */
  getScore(): SimulationScore {
    const firstSec = this.recognitionTick !== null
      ? this.recognitionTick * SIM_SECONDS_PER_TICK
      : null;
    const firstIntSec = this.firstInterventionTick !== null
      ? this.firstInterventionTick * SIM_SECONDS_PER_TICK
      : null;

    const criticalAlarmHandled = this.scoringEvents.some(
      (e) => e.type === "intervention" && this.state.conditionStage !== "critical",
    );

    return {
      recognitionTimeSec: firstSec,
      firstInterventionTimeSec: firstIntSec,
      interventionCount: this.scoringEvents.filter((e) => e.type === "intervention").length,
      criticalAlarmHandled,
      events: [...this.scoringEvents],
    };
  }

  /** Reset the engine to the beginning of this condition. */
  reset(): void {
    this.state = this.buildInitialState(this.pattern);
    this.history = [];
    this.interventionCooldowns.clear();
    this.scoringEvents = [];
    this.recognitionTick = null;
    this.firstInterventionTick = null;
    this.snapshot();
  }

  /** Switch to a different condition (keeps current tick counter). */
  switchCondition(conditionKey: string): void {
    const pattern = getDeteriorationPattern(conditionKey);
    if (!pattern) throw new Error(`Unknown condition key: ${conditionKey}`);
    this.pattern = pattern;
    this.state = this.buildInitialState(pattern);
    this.history = [];
    this.interventionCooldowns.clear();
    this.snapshot();
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private buildInitialState(pattern: DeteriorationPattern): PhysiologyState {
    const base = { ...BASELINE_PHYSIOLOGY_STATE };
    const overrides = pattern.initialOverrides;

    return {
      ...base,
      ...overrides,
      ecgFeatures: overrides.ecgFeatures ? { ...overrides.ecgFeatures } : {},
      tick: 0,
      activeConditionKey: pattern.key,
      conditionStage: "early",
      ticksInCurrentStage: 0,
      activeInterventions: [],
    };
  }

  private applyDeteriorationDeltas(
    state: PhysiologyState,
    stageDef: ConditionStageDefinition,
    activeInterventions: ActiveIntervention[],
  ): PhysiologyState {
    const next = { ...state };

    // Collect suppression multiplier from active interventions
    // (interventions with stageRollback slow deterioration by 50%)
    const suppressionMultiplier = activeInterventions.some((ai) => {
      const inv = getIntervention(ai.key);
      return inv?.effect.stageRollback === true;
    }) ? 0.25 : 1.0;

    for (const [key, delta] of Object.entries(stageDef.vitalDeltas)) {
      if (delta === undefined) continue;
      const k = key as keyof PhysiologyState;
      const current = next[k] as number | undefined;
      if (typeof current !== "number") continue;
      (next[k] as number) = current + (delta as number) * suppressionMultiplier;
    }

    return next;
  }

  private applyDeltasToState(state: PhysiologyState, deltas: Partial<Record<keyof PhysiologyState, number>>): void {
    for (const [key, delta] of Object.entries(deltas)) {
      if (delta === undefined) continue;
      const k = key as keyof PhysiologyState;
      const current = state[k] as number | undefined;
      if (typeof current !== "number") continue;
      (state[k] as number) = current + (delta as number);
    }
  }

  private clampState(state: PhysiologyState): void {
    for (const [key, range] of Object.entries(PHYSIOLOGY_CLAMPS)) {
      if (!range) continue;
      const k = key as keyof PhysiologyState;
      const value = state[k];
      if (typeof value === "number") {
        (state[k] as number) = Math.max(range.min, Math.min(range.max, value));
      }
    }
    // Hard floor on GCS
    if (state.gcs < 3) state.gcs = 3;
    if (state.gcs > 15) state.gcs = 15;
    // MAP must be non-negative
    if (state.map < 0) state.map = 0;
  }

  private snapshot(): void {
    this.history.push({
      tick: this.state.tick,
      simSeconds: this.state.tick * SIM_SECONDS_PER_TICK,
      state: Object.freeze({ ...this.state, ecgFeatures: { ...this.state.ecgFeatures } }),
    });
    // Keep ring buffer bounded
    if (this.history.length > MAX_HISTORY_TICKS) {
      this.history.shift();
    }
  }
}

// ─── Hook-friendly factory ────────────────────────────────────────────────────

/** Creates a new engine and returns it. Suitable for useRef initialization. */
export function createMonitorEngine(conditionKey: string): MonitorEngine {
  return new MonitorEngine(conditionKey);
}
