/**
 * Harm Index — Patient Safety Analytics
 *
 * Evaluates a monitor session for patient harm events: near-misses,
 * moderate harm, severe harm, and preventable cardiac arrest.
 *
 * The Harm Index drives:
 *   - Session report card (Green / Yellow / Red badge)
 *   - Adaptive remediation routing
 *   - Competency gating (learner cannot advance to next level with Red Harm Index)
 *   - Institutional reporting for simulation programs
 */

import type { PhysiologySnapshot, PhysiologyState } from "./physiology-state";
import type { ScoringEvent } from "./monitor-engine";
import { SIM_SECONDS_PER_TICK } from "./monitor-engine";
import { getDeteriorationPattern } from "./deterioration-patterns";
import { getInterventionsForCondition } from "./intervention-catalog";

// ─── Types ────────────────────────────────────────────────────────────────────

export type HarmLevel = "none" | "near_miss" | "moderate" | "severe" | "preventable_arrest";

export type HarmIndexColor = "green" | "yellow" | "red";

export interface HarmEvent {
  level: HarmLevel;
  description: string;
  simSeconds: number;
  /** Tick at which the harm event was detected. */
  tick: number;
  /** Whether the learner took corrective action before irreversible harm. */
  correctedByLearner: boolean;
}

export interface HarmIndexResult {
  /** 0–100 — lower is worse. */
  score: number;
  color: HarmIndexColor;
  level: HarmLevel;
  events: HarmEvent[];
  summary: string;
  /** Specific coaching guidance based on harm events. */
  safetyCoaching: string[];
}

// ─── Thresholds ───────────────────────────────────────────────────────────────

/** State thresholds that constitute clinical harm. */
const HARM_THRESHOLDS = {
  // Near-miss
  CRITICAL_SPO2_NEAR_MISS:  88,   // SpO2 < 88 without O2 applied
  CRITICAL_MAP_NEAR_MISS:   55,   // MAP < 55 without vasopressor
  CRITICAL_HR_NEAR_MISS:    160,  // HR > 160 without rate control
  CRITICAL_HR_LOW_NEAR_MISS: 30,  // HR < 30 without pacing

  // Moderate harm
  SEVERE_HYPOXIA:    82,
  SHOCK_MAP:         50,
  CRITICAL_HR_HIGH:  175,

  // Severe harm
  CRITICAL_HYPOXIA:  75,
  ARREST_MAP:        40,

  // Preventable arrest indicators
  ARREST_RHYTHM_KEYS: ["ventricular_fibrillation", "asystole", "pea"],
  GCS_UNRESPONSIVE:   5,
} as const;

/** Ticks an alarm can ring before action is required (beyond this = harm). */
const RESPONSE_TIME_THRESHOLDS = {
  NEAR_MISS_TICKS:   2,   // 1 min sim-time
  MODERATE_HARM_TICKS: 4,  // 2 min sim-time
  SEVERE_HARM_TICKS:  7,   // 3.5 min sim-time
} as const;

// ─── Analyser ─────────────────────────────────────────────────────────────────

export function computeHarmIndex(
  history: PhysiologySnapshot[],
  events: ScoringEvent[],
  conditionKey: string,
): HarmIndexResult {
  const harmEvents: HarmEvent[] = [];
  const interventionEvents = events.filter((e) => e.type === "intervention");

  // ── 1. Scan history for harm-threshold crossings ───────────────────────────
  for (let i = 1; i < history.length; i++) {
    const snap = history[i]!;
    const s = snap.state;
    const prevS = history[i - 1]!.state;

    // ── Near misses ──

    // SpO2 drop below 88 without O2
    if (s.spo2 < HARM_THRESHOLDS.CRITICAL_SPO2_NEAR_MISS && prevS.spo2 >= HARM_THRESHOLDS.CRITICAL_SPO2_NEAR_MISS) {
      const o2Applied = interventionEvents.some((e) => e.tick <= snap.tick && e.detail.toLowerCase().includes("o2"));
      harmEvents.push({
        level: s.spo2 < HARM_THRESHOLDS.CRITICAL_HYPOXIA ? "severe" : "near_miss",
        description: `SpO₂ dropped to ${Math.round(s.spo2)}%${o2Applied ? "" : " without oxygen therapy"}.`,
        simSeconds: snap.simSeconds,
        tick: snap.tick,
        correctedByLearner: o2Applied,
      });
    }

    // MAP < 55 without vasopressor
    if (s.map < HARM_THRESHOLDS.CRITICAL_MAP_NEAR_MISS && prevS.map >= HARM_THRESHOLDS.CRITICAL_MAP_NEAR_MISS) {
      const vasopressorApplied = interventionEvents.some(
        (e) => e.tick <= snap.tick && (e.detail.includes("Norepinephrine") || e.detail.includes("Epinephrine") || e.detail.includes("CPR"))
      );
      harmEvents.push({
        level: s.map < HARM_THRESHOLDS.ARREST_MAP ? "severe" : "moderate",
        description: `MAP fell to ${Math.round(s.map)} mmHg${vasopressorApplied ? "" : " without vasopressor support"}.`,
        simSeconds: snap.simSeconds,
        tick: snap.tick,
        correctedByLearner: vasopressorApplied,
      });
    }

    // VT/VF/Asystole without defibrillation/CPR
    const arrestKeys = HARM_THRESHOLDS.ARREST_RHYTHM_KEYS as readonly string[];
    if (
      arrestKeys.includes(s.ecgRhythmKey) &&
      !arrestKeys.includes(prevS.ecgRhythmKey)
    ) {
      const defibOrCpr = interventionEvents.some(
        (e) => e.tick <= snap.tick + 2 && (e.detail.includes("Defibrillation") || e.detail.includes("CPR"))
      );
      harmEvents.push({
        level: defibOrCpr ? "moderate" : "preventable_arrest",
        description: `${s.ecgRhythmKey.replace(/_/g, " ")} occurred${defibOrCpr ? " and was treated" : " without defibrillation or CPR"}.`,
        simSeconds: snap.simSeconds,
        tick: snap.tick,
        correctedByLearner: defibOrCpr,
      });
    }

    // GCS ≤ 5 without airway management
    if (s.gcs <= HARM_THRESHOLDS.GCS_UNRESPONSIVE && prevS.gcs > HARM_THRESHOLDS.GCS_UNRESPONSIVE) {
      const airwayMgmt = interventionEvents.some(
        (e) => e.tick <= snap.tick + 2 && (e.detail.includes("BiPAP") || e.detail.includes("O2"))
      );
      harmEvents.push({
        level: "severe",
        description: `GCS ${Math.round(s.gcs)} — unresponsive without airway protection.`,
        simSeconds: snap.simSeconds,
        tick: snap.tick,
        correctedByLearner: airwayMgmt,
      });
    }

    // Critical stage reached without any intervention
    if (s.conditionStage === "critical" && prevS.conditionStage !== "critical") {
      const anyIntervention = interventionEvents.some((e) => e.tick < snap.tick);
      if (!anyIntervention) {
        harmEvents.push({
          level: "severe",
          description: "Patient reached critical stage without any intervention applied.",
          simSeconds: snap.simSeconds,
          tick: snap.tick,
          correctedByLearner: false,
        });
      }
    }

    // ── Delayed response harm ─────────────────────────────────────────────────
    // If critical alarm persisted for > SEVERE_HARM_TICKS with no response
    if (
      (s.spo2 < 90 || s.map < 60 || s.heartRate > 150) &&
      i >= RESPONSE_TIME_THRESHOLDS.SEVERE_HARM_TICKS
    ) {
      const criticalStartTick = Math.max(0, snap.tick - RESPONSE_TIME_THRESHOLDS.SEVERE_HARM_TICKS);
      const responseInWindow = interventionEvents.some(
        (e) => e.tick >= criticalStartTick && e.tick <= snap.tick
      );
      if (!responseInWindow && i % RESPONSE_TIME_THRESHOLDS.SEVERE_HARM_TICKS === 0) {
        // Don't flood — add at most one delayed-response event per window
        const alreadyRecorded = harmEvents.some(
          (h) => h.description.includes("delayed response") && Math.abs(h.tick - snap.tick) < RESPONSE_TIME_THRESHOLDS.MODERATE_HARM_TICKS
        );
        if (!alreadyRecorded) {
          harmEvents.push({
            level: "moderate",
            description: `Sustained critical vital signs for ${RESPONSE_TIME_THRESHOLDS.SEVERE_HARM_TICKS * SIM_SECONDS_PER_TICK}s without intervention — delayed response harm.`,
            simSeconds: snap.simSeconds,
            tick: snap.tick,
            correctedByLearner: false,
          });
        }
      }
    }
  }

  // ── 2. Compute score ──────────────────────────────────────────────────────

  const LEVEL_PENALTIES: Record<HarmLevel, number> = {
    none: 0,
    near_miss: 8,
    moderate: 18,
    severe: 35,
    preventable_arrest: 60,
  };

  // Corrected harm events reduce the penalty
  const totalPenalty = harmEvents.reduce((acc, h) => {
    const penalty = LEVEL_PENALTIES[h.level];
    return acc + (h.correctedByLearner ? penalty * 0.3 : penalty);
  }, 0);

  const score = Math.max(0, Math.min(100, Math.round(100 - totalPenalty)));

  // ── 3. Determine colour ───────────────────────────────────────────────────

  const worstLevel = harmEvents.reduce<HarmLevel>((worst, h) => {
    const order: HarmLevel[] = ["none", "near_miss", "moderate", "severe", "preventable_arrest"];
    return order.indexOf(h.level) > order.indexOf(worst) ? h.level : worst;
  }, "none");

  const color: HarmIndexColor =
    worstLevel === "preventable_arrest" || worstLevel === "severe" ? "red"
    : worstLevel === "moderate" || (worstLevel === "near_miss" && !harmEvents.every((h) => h.correctedByLearner)) ? "yellow"
    : "green";

  // ── 4. Safety coaching ─────────────────────────────────────────────────────

  const safetyCoaching = buildSafetyCoaching(harmEvents, conditionKey);

  const summary = buildSummary(color, score, harmEvents, conditionKey);

  return {
    score,
    color,
    level: worstLevel,
    events: harmEvents,
    summary,
    safetyCoaching,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildSafetyCoaching(events: HarmEvent[], conditionKey: string): string[] {
  const coaching: string[] = [];

  const hasArrest = events.some((e) => e.level === "preventable_arrest");
  const hasSevere = events.some((e) => e.level === "severe");
  const hasModerate = events.some((e) => e.level === "moderate");
  const hasUncorrectedNearMiss = events.some((e) => e.level === "near_miss" && !e.correctedByLearner);

  if (hasArrest) {
    coaching.push(
      "Preventable arrest occurred. Review when to activate Rapid Response and escalate to ACLS protocols.",
    );
    coaching.push("Prioritize defibrillation (< 2 min) for VF/pulseless VT. Begin CPR without delay for any pulseless arrest.");
  }

  if (hasSevere && !hasArrest) {
    coaching.push("Severe harm events occurred. Earlier intervention is required — do not wait for the 'perfect time' to act.");
  }

  if (hasModerate || hasUncorrectedNearMiss) {
    coaching.push(
      "Critical alarms require response within 2 minutes. Set personal response-time targets for deteriorating patients.",
    );
  }

  // Condition-specific coaching
  if (conditionKey === "stemi") {
    coaching.push("STEMI protocols: door-to-balloon < 90 min. Notify interventional cardiology simultaneously with ECG acquisition.");
  }
  if (conditionKey === "sepsis") {
    coaching.push("Surviving Sepsis Campaign: antibiotics and fluid resuscitation within 1 hour of sepsis recognition.");
  }
  if (conditionKey === "anaphylaxis") {
    coaching.push("Epinephrine IM is first-line for anaphylaxis — no delay for antihistamines or steroids as initial treatment.");
  }
  if (conditionKey === "tension_pneumothorax") {
    coaching.push("Tension pneumothorax is a clinical diagnosis — do NOT wait for CXR. Needle decompression immediately.");
  }

  if (coaching.length === 0) {
    coaching.push("No significant patient safety events. Continue to maintain response-time targets.");
  }

  return coaching;
}

function buildSummary(color: HarmIndexColor, score: number, events: HarmEvent[], conditionKey: string): string {
  const pattern = getDeteriorationPattern(conditionKey);
  const condLabel = pattern?.label ?? conditionKey;

  if (color === "green") {
    return `No patient harm events in the ${condLabel} scenario. All critical findings were addressed within safe time windows.`;
  }
  if (color === "yellow") {
    const nearMissCount = events.filter((e) => e.level === "near_miss" || e.level === "moderate").length;
    return `${nearMissCount} near-miss or moderate harm event(s) in the ${condLabel} scenario. Response times should be shortened.`;
  }
  return `Severe harm or preventable arrest in the ${condLabel} scenario. Fundamental safety competencies require targeted remediation before clinical progression.`;
}
