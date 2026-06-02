/**
 * Replay Engine
 *
 * Provides full session replay capability from a PhysiologySnapshot[] history
 * and ScoringEvent[] log. Allows learners to scrub through their session,
 * pause at any point, and compare their actual decisions to the optimal pathway.
 *
 * Replay supports:
 *   - Timeline scrubbing (by tick or simulation-seconds)
 *   - Step-by-step event playback
 *   - Missed opportunity markers (critical actions not taken in time)
 *   - Optimal pathway overlay (what should have happened)
 *   - Alarm replay (which alarms were active at each tick)
 *   - Rhythm progression playback (ECG changes over time)
 *   - Decision review annotations (coaching on each intervention)
 */

import type { PhysiologySnapshot, PhysiologyState } from "./physiology-state";
import type { ScoringEvent } from "./monitor-engine";
import { deriveAlarms } from "./physiology-state";
import { getDeteriorationPattern } from "./deterioration-patterns";
import { getPathwayForCondition, type ClinicalPathway } from "./clinical-pathways";
import { SIM_SECONDS_PER_TICK } from "./monitor-engine";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReplayFrame {
  tick: number;
  simSeconds: number;
  state: Readonly<PhysiologyState>;
  activeAlarms: string[];
  eventsAtTick: ScoringEvent[];
  /** Whether a missed-opportunity marker applies at this tick. */
  missedOpportunity: MissedOpportunity | null;
  /** Optimal action that should have occurred at or before this tick. */
  optimalActionDue: OptimalAction | null;
}

export interface MissedOpportunity {
  type: "delayed_recognition" | "missed_intervention" | "delayed_escalation" | "no_reassessment";
  description: string;
  interventionKey?: string;
  expectedByTick: number;
  actualTick: number | null;
  delaySeconds: number;
  severity: "minor" | "moderate" | "critical";
}

export interface OptimalAction {
  tick: number;
  simSeconds: number;
  action: string;
  interventionKey?: string;
  rationale: string;
  wasCompleted: boolean;
  completedAtTick?: number;
}

export interface PathwayComparison {
  conditionKey: string;
  optimalActions: OptimalAction[];
  missedOpportunities: MissedOpportunity[];
  completionRate: number;   // 0–1 of optimal actions completed
  averageDelaySeconds: number;
  overallRating: "excellent" | "good" | "needs_improvement" | "unsafe";
}

export interface ReplaySession {
  conditionKey: string;
  totalTicks: number;
  totalSimSeconds: number;
  frames: ReplayFrame[];
  pathwayComparison: PathwayComparison;
  keyMoments: KeyMoment[];
}

export interface KeyMoment {
  tick: number;
  simSeconds: number;
  type: "rhythm_change" | "stage_advance" | "intervention_applied" | "alarm_onset" | "missed_opportunity" | "stabilisation";
  label: string;
  description: string;
}

// ─── Replay Engine ────────────────────────────────────────────────────────────

export class ReplayEngine {
  private readonly history: PhysiologySnapshot[];
  private readonly events: ScoringEvent[];
  private readonly conditionKey: string;
  private readonly pathway: ClinicalPathway | null;

  private currentFrameIndex = 0;
  private playing = false;
  private playbackSpeedMs = 500; // real-ms between frames

  constructor(
    history: PhysiologySnapshot[],
    events: ScoringEvent[],
    conditionKey: string,
  ) {
    this.history = history;
    this.events = events;
    this.conditionKey = conditionKey;
    this.pathway = getPathwayForCondition(conditionKey);
  }

  // ── Session building ─────────────────────────────────────────────────────

  buildSession(): ReplaySession {
    const frames = this.buildFrames();
    const pathwayComparison = this.buildPathwayComparison(frames);
    const keyMoments = this.extractKeyMoments(frames);

    return {
      conditionKey: this.conditionKey,
      totalTicks: this.history.length,
      totalSimSeconds: this.history.length * SIM_SECONDS_PER_TICK,
      frames,
      pathwayComparison,
      keyMoments,
    };
  }

  private buildFrames(): ReplayFrame[] {
    const missedOpportunities = this.computeMissedOpportunities();
    const optimalActions = this.computeOptimalActions();

    return this.history.map((snap, i) => {
      const eventsAtTick = this.events.filter((e) => e.tick === snap.tick);
      const activeAlarms = deriveAlarms(snap.state as PhysiologyState).map((a) => a.message);

      const missed = missedOpportunities.find(
        (m) => m.expectedByTick === snap.tick || (m.actualTick === null && snap.tick === m.expectedByTick),
      ) ?? null;

      const optimalDue = optimalActions.find(
        (a) => a.tick === snap.tick,
      ) ?? null;

      return {
        tick: snap.tick,
        simSeconds: snap.simSeconds,
        state: snap.state,
        activeAlarms,
        eventsAtTick,
        missedOpportunity: missed,
        optimalActionDue: optimalDue,
      };
    });
  }

  // ── Playback controls ────────────────────────────────────────────────────

  getCurrentFrame(): ReplayFrame | null {
    const snap = this.history[this.currentFrameIndex];
    if (!snap) return null;
    const eventsAtTick = this.events.filter((e) => e.tick === snap.tick);
    const activeAlarms = deriveAlarms(snap.state as PhysiologyState).map((a) => a.message);
    return {
      tick: snap.tick,
      simSeconds: snap.simSeconds,
      state: snap.state,
      activeAlarms,
      eventsAtTick,
      missedOpportunity: null,
      optimalActionDue: null,
    };
  }

  seekToTick(tick: number): void {
    const idx = this.history.findIndex((s) => s.tick >= tick);
    this.currentFrameIndex = idx >= 0 ? idx : this.history.length - 1;
  }

  seekToPercent(percent: number): void {
    const idx = Math.round((percent / 100) * (this.history.length - 1));
    this.currentFrameIndex = Math.max(0, Math.min(this.history.length - 1, idx));
  }

  stepForward(steps = 1): void {
    this.currentFrameIndex = Math.min(this.history.length - 1, this.currentFrameIndex + steps);
  }

  stepBack(steps = 1): void {
    this.currentFrameIndex = Math.max(0, this.currentFrameIndex - steps);
  }

  seekToKeyMoment(session: ReplaySession, index: number): void {
    const moment = session.keyMoments[index];
    if (moment) this.seekToTick(moment.tick);
  }

  get totalFrames(): number { return this.history.length; }
  get frameIndex(): number { return this.currentFrameIndex; }
  get progressPercent(): number {
    return this.history.length <= 1 ? 0 : (this.currentFrameIndex / (this.history.length - 1)) * 100;
  }

  // ── Optimal pathway comparison ───────────────────────────────────────────

  private computeOptimalActions(): OptimalAction[] {
    if (!this.pathway) return [];

    const pattern = getDeteriorationPattern(this.conditionKey);
    if (!pattern) return [];

    const actions: OptimalAction[] = [];
    let cumulativeTick = 0;

    for (const stage of ["early", "developing", "severe", "critical"] as const) {
      const stageDef = pattern.stages[stage];
      const pathwayStage = this.pathway.stages[stage];

      for (const interventionKey of pathwayStage.optimalInterventions) {
        const dueByTick = cumulativeTick + pathwayStage.harmIfMissedTicks;
        const completedEvent = this.events.find(
          (e) => e.type === "intervention" && e.detail.toLowerCase().includes(interventionKey.replace(/_/g, " ")),
        );

        actions.push({
          tick: dueByTick,
          simSeconds: dueByTick * SIM_SECONDS_PER_TICK,
          action: `Apply ${interventionKey.replace(/_/g, " ")}`,
          interventionKey,
          rationale: pathwayStage.stabilisationOutcome,
          wasCompleted: !!completedEvent,
          completedAtTick: completedEvent?.tick,
        });
      }

      cumulativeTick += stageDef.durationTicks;
    }

    return actions;
  }

  private computeMissedOpportunities(): MissedOpportunity[] {
    if (!this.pathway) return [];

    const pattern = getDeteriorationPattern(this.conditionKey);
    if (!pattern) return [];

    const missed: MissedOpportunity[] = [];
    let cumulativeTick = 0;

    for (const stage of ["early", "developing", "severe", "critical"] as const) {
      const stageDef = pattern.stages[stage];
      const pathwayStage = this.pathway.stages[stage];

      for (const interventionKey of pathwayStage.optimalInterventions) {
        const dueByTick = cumulativeTick + pathwayStage.harmIfMissedTicks;
        const completedEvent = this.events.find(
          (e) =>
            e.type === "intervention" &&
            e.detail.toLowerCase().includes(interventionKey.replace(/_/g, " ")),
        );

        if (!completedEvent) {
          missed.push({
            type: "missed_intervention",
            description: `${interventionKey.replace(/_/g, " ")} not applied in ${stage} stage.`,
            interventionKey,
            expectedByTick: dueByTick,
            actualTick: null,
            delaySeconds: Infinity,
            severity: stage === "critical" || stage === "severe" ? "critical" : "moderate",
          });
        } else if (completedEvent.tick > dueByTick) {
          const delayTicks = completedEvent.tick - dueByTick;
          missed.push({
            type: "delayed_recognition",
            description: `${interventionKey.replace(/_/g, " ")} was delayed by ${delayTicks * SIM_SECONDS_PER_TICK}s.`,
            interventionKey,
            expectedByTick: dueByTick,
            actualTick: completedEvent.tick,
            delaySeconds: delayTicks * SIM_SECONDS_PER_TICK,
            severity: delayTicks > 6 ? "critical" : delayTicks > 3 ? "moderate" : "minor",
          });
        }
      }

      cumulativeTick += stageDef.durationTicks;
    }

    // Check for missing recognition events
    const recognitionEvents = this.events.filter((e) => e.type === "recognition");
    if (recognitionEvents.length === 0) {
      missed.push({
        type: "delayed_recognition",
        description: "No clinical recognition documented throughout session.",
        expectedByTick: 2,
        actualTick: null,
        delaySeconds: Infinity,
        severity: "critical",
      });
    }

    // Check for missing reassessment
    const postInterventionRec = recognitionEvents.filter((e) => {
      const firstInt = this.events.find((ev) => ev.type === "intervention");
      return firstInt ? e.tick > firstInt.tick : false;
    });
    if (postInterventionRec.length === 0 && this.events.some((e) => e.type === "intervention")) {
      missed.push({
        type: "no_reassessment",
        description: "No post-intervention reassessment documented.",
        expectedByTick: 8,
        actualTick: null,
        delaySeconds: Infinity,
        severity: "moderate",
      });
    }

    return missed;
  }

  private buildPathwayComparison(frames: ReplayFrame[]): PathwayComparison {
    const optimalActions = this.computeOptimalActions();
    const missedOpportunities = this.computeMissedOpportunities();

    const completedCount = optimalActions.filter((a) => a.wasCompleted).length;
    const completionRate = optimalActions.length > 0 ? completedCount / optimalActions.length : 1;

    const delayedMissed = missedOpportunities.filter((m) => m.delaySeconds !== Infinity);
    const averageDelaySeconds = delayedMissed.length > 0
      ? delayedMissed.reduce((acc, m) => acc + m.delaySeconds, 0) / delayedMissed.length
      : 0;

    const hasCriticalMissed = missedOpportunities.some((m) => m.severity === "critical");
    const completionPct = completionRate * 100;

    const overallRating: PathwayComparison["overallRating"] =
      hasCriticalMissed ? "unsafe"
      : completionPct >= 90 && averageDelaySeconds < 60 ? "excellent"
      : completionPct >= 70 ? "good"
      : "needs_improvement";

    return {
      conditionKey: this.conditionKey,
      optimalActions,
      missedOpportunities,
      completionRate,
      averageDelaySeconds,
      overallRating,
    };
  }

  private extractKeyMoments(frames: ReplayFrame[]): KeyMoment[] {
    const moments: KeyMoment[] = [];
    let prevRhythm: string | null = null;
    let prevStage: string | null = null;

    for (const frame of frames) {
      const s = frame.state;

      // Rhythm change
      if (prevRhythm && s.ecgRhythmKey !== prevRhythm) {
        moments.push({
          tick: frame.tick,
          simSeconds: frame.simSeconds,
          type: "rhythm_change",
          label: `Rhythm → ${s.ecgRhythmKey.replace(/_/g, " ")}`,
          description: `ECG rhythm changed from ${prevRhythm.replace(/_/g, " ")} to ${s.ecgRhythmKey.replace(/_/g, " ")}.`,
        });
      }

      // Stage advance
      if (prevStage && s.conditionStage !== prevStage) {
        moments.push({
          tick: frame.tick,
          simSeconds: frame.simSeconds,
          type: "stage_advance",
          label: `Stage → ${s.conditionStage.toUpperCase()}`,
          description: `Condition advanced from ${prevStage} to ${s.conditionStage} stage.`,
        });
      }

      // Intervention events
      for (const event of frame.eventsAtTick) {
        if (event.type === "intervention") {
          moments.push({
            tick: frame.tick,
            simSeconds: frame.simSeconds,
            type: "intervention_applied",
            label: event.detail.split(" ").slice(0, 3).join(" "),
            description: `Intervention: ${event.detail}`,
          });
        }
      }

      // Missed opportunities
      if (frame.missedOpportunity && frame.missedOpportunity.actualTick === null) {
        moments.push({
          tick: frame.tick,
          simSeconds: frame.simSeconds,
          type: "missed_opportunity",
          label: `Missed: ${frame.missedOpportunity.interventionKey?.replace(/_/g, " ") ?? "Action"}`,
          description: frame.missedOpportunity.description,
        });
      }

      prevRhythm = s.ecgRhythmKey;
      prevStage = s.conditionStage;
    }

    return moments;
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createReplaySession(
  history: PhysiologySnapshot[],
  events: ScoringEvent[],
  conditionKey: string,
): ReplaySession {
  const engine = new ReplayEngine(history, events, conditionKey);
  return engine.buildSession();
}

// ─── Serialisable replay data (for persistence / sharing) ────────────────────

export interface SerializedReplayData {
  conditionKey: string;
  sessionId: string;
  capturedAt: string;
  history: Array<{
    tick: number;
    simSeconds: number;
    heartRate: number;
    systolicBP: number;
    spo2: number;
    respiratoryRate: number;
    map: number;
    ecgRhythmKey: string;
    conditionStage: string;
  }>;
  events: ScoringEvent[];
}

/** Compact serialisation for storage — strips redundant fields. */
export function serializeReplayData(
  history: PhysiologySnapshot[],
  events: ScoringEvent[],
  conditionKey: string,
  sessionId: string,
): SerializedReplayData {
  return {
    conditionKey,
    sessionId,
    capturedAt: new Date().toISOString(),
    history: history.map((s) => ({
      tick: s.tick,
      simSeconds: s.simSeconds,
      heartRate: Math.round(s.state.heartRate),
      systolicBP: Math.round(s.state.systolicBP),
      spo2: Math.round(s.state.spo2),
      respiratoryRate: Math.round(s.state.respiratoryRate),
      map: Math.round(s.state.map),
      ecgRhythmKey: s.state.ecgRhythmKey,
      conditionStage: s.state.conditionStage,
    })),
    events,
  };
}
