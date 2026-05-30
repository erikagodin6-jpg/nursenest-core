/**
 * Competency Clearance System
 *
 * Formal gated clearance logic for four clinical readiness designations.
 * Each clearance has explicit, evidence-based requirements that must all be met.
 *
 * Clearances:
 *   - Telemetry Ready      — supervised bedside telemetry monitoring
 *   - ICU Ready            — supervised ICU-level haemodynamic monitoring
 *   - RT Critical Care Ready — ventilator management in supervised ICU
 *   - New Grad Safe Practice — safe escalation and documentation competency
 */

import type { LearnerGrowthProfile } from "./learner-profile";
import type { NcjmmDomain } from "./clinical-judgment-engine";
import type { MonitorCompetencyPassport } from "./monitor-competency-tracker";
import { COMPETENCY_LEVEL_ORDER } from "./monitor-competency-tracker";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ClearanceId =
  | "telemetry_ready"
  | "icu_ready"
  | "rt_critical_care_ready"
  | "new_grad_safe_practice";

export interface ClearanceRequirement {
  id: string;
  description: string;
  category: "score" | "safety" | "coverage" | "timing" | "sessions";
  evaluate: (profile: LearnerGrowthProfile, passport?: MonitorCompetencyPassport) => boolean;
  currentValue: (profile: LearnerGrowthProfile, passport?: MonitorCompetencyPassport) => string;
  target: string;
}

export interface ClearanceDefinition {
  id: ClearanceId;
  label: string;
  description: string;
  colour: string;
  requirements: ClearanceRequirement[];
  /** Conditions that must have been practiced. */
  requiredConditions: string[];
  /** Simulations that must have been passed (score ≥ 65). */
  requiredSimulationsPassed: string[];
}

export interface ClearanceResult {
  clearanceId: ClearanceId;
  label: string;
  achieved: boolean;
  requirementsMet: RequirementResult[];
  blockers: string[];
  progress: number;    // 0–100 percentage of requirements met
  nearestGap: string;  // Most actionable next step
}

export interface RequirementResult {
  requirementId: string;
  description: string;
  met: boolean;
  currentValue: string;
  target: string;
}

// ─── Clearance definitions ────────────────────────────────────────────────────

export const CLEARANCE_DEFINITIONS: ClearanceDefinition[] = [

  // ── Telemetry Ready ────────────────────────────────────────────────────────
  {
    id: "telemetry_ready",
    label: "Telemetry Ready",
    description: "Competent to independently monitor and interpret telemetry in a supervised clinical environment.",
    colour: "#00e676",
    requirements: [
      {
        id: "tr-rhythm-score",
        description: "Rhythm recognition rolling average ≥ 75/100",
        category: "score",
        evaluate: (p) => p.ncjmmTrends.recognize_cues.rollingAverage >= 75,
        currentValue: (p) => `${Math.round(p.ncjmmTrends.recognize_cues.rollingAverage)}/100`,
        target: "≥ 75/100",
      },
      {
        id: "tr-alarm-score",
        description: "Take Action rolling average ≥ 70/100 (alarm response proxy)",
        category: "score",
        evaluate: (p) => p.ncjmmTrends.take_action.rollingAverage >= 70,
        currentValue: (p) => `${Math.round(p.ncjmmTrends.take_action.rollingAverage)}/100`,
        target: "≥ 70/100",
      },
      {
        id: "tr-harm-green",
        description: "Harm Index green in ≥ 3 of last 5 sessions",
        category: "safety",
        evaluate: (p) => p.telemetryReadySessions >= 3,
        currentValue: (p) => `${p.telemetryReadySessions} green sessions`,
        target: "≥ 3 of last 5",
      },
      {
        id: "tr-no-unsafe",
        description: "No recurring unsafe clinical trends",
        category: "safety",
        evaluate: (p) => p.unsafeTrends.filter((u) => u.severity === "critical").length === 0,
        currentValue: (p) => p.unsafeTrends.length === 0 ? "No unsafe trends" : `${p.unsafeTrends.length} unsafe trend(s)`,
        target: "Zero critical unsafe trends",
      },
      {
        id: "tr-sessions",
        description: "Minimum 5 sessions completed",
        category: "sessions",
        evaluate: (p) => p.sessionCount >= 5,
        currentValue: (p) => `${p.sessionCount} sessions`,
        target: "≥ 5 sessions",
      },
      {
        id: "tr-conditions",
        description: "Practiced AFib, STEMI, and sepsis",
        category: "coverage",
        evaluate: (p) => {
          const covered = p.conditionsCovered.join(" ").toLowerCase();
          return covered.includes("afib") && covered.includes("stemi") && covered.includes("sepsis");
        },
        currentValue: (p) => `Covered: ${p.conditionsCovered.slice(0, 3).join(", ")}`,
        target: "AFib + STEMI + Sepsis",
      },
      {
        id: "tr-escalation",
        description: "Escalation documented in ≥ 3 sessions (prioritize_hypotheses ≥ 65)",
        category: "score",
        evaluate: (p) => p.ncjmmTrends.prioritize_hypotheses.rollingAverage >= 65,
        currentValue: (p) => `${Math.round(p.ncjmmTrends.prioritize_hypotheses.rollingAverage)}/100`,
        target: "≥ 65/100",
      },
    ],
    requiredConditions: ["Atrial Fibrillation with RVR", "Anterior STEMI", "Sepsis"],
    requiredSimulationsPassed: ["rn-sepsis-early", "rn-stemi", "rpn-afib-monitoring"],
  },

  // ── ICU Ready ──────────────────────────────────────────────────────────────
  {
    id: "icu_ready",
    label: "ICU Ready",
    description: "Cleared for advanced haemodynamic monitoring in a supervised ICU environment.",
    colour: "#40c4ff",
    requirements: [
      {
        id: "icu-composite",
        description: "Composite score ≥ 80/100 (5-session rolling)",
        category: "score",
        evaluate: (p) => p.compositeTrend.rollingAverage >= 80,
        currentValue: (p) => `${Math.round(p.compositeTrend.rollingAverage)}/100`,
        target: "≥ 80/100",
      },
      {
        id: "icu-recognize",
        description: "Recognize Cues ≥ 80/100",
        category: "score",
        evaluate: (p) => p.ncjmmTrends.recognize_cues.rollingAverage >= 80,
        currentValue: (p) => `${Math.round(p.ncjmmTrends.recognize_cues.rollingAverage)}/100`,
        target: "≥ 80/100",
      },
      {
        id: "icu-take-action",
        description: "Take Action ≥ 75/100",
        category: "score",
        evaluate: (p) => p.ncjmmTrends.take_action.rollingAverage >= 75,
        currentValue: (p) => `${Math.round(p.ncjmmTrends.take_action.rollingAverage)}/100`,
        target: "≥ 75/100",
      },
      {
        id: "icu-harm",
        description: "No severe or preventable-arrest harm events in last 5 sessions",
        category: "safety",
        evaluate: (p) => p.harmPatterns.every(
          (h) => h.harmLevel !== "severe" && h.harmLevel !== "preventable_arrest",
        ),
        currentValue: (p) => {
          const severe = p.harmPatterns.filter((h) => h.harmLevel === "severe" || h.harmLevel === "preventable_arrest");
          return severe.length === 0 ? "No severe harm" : `${severe.length} severe harm pattern(s)`;
        },
        target: "Zero severe/arrest harm",
      },
      {
        id: "icu-sessions",
        description: "≥ 10 sessions completed",
        category: "sessions",
        evaluate: (p) => p.sessionCount >= 10,
        currentValue: (p) => `${p.sessionCount} sessions`,
        target: "≥ 10 sessions",
      },
      {
        id: "icu-shock-coverage",
        description: "Sepsis, cardiogenic shock, and respiratory failure practiced",
        category: "coverage",
        evaluate: (p) => {
          const covered = p.conditionsCovered.join(" ").toLowerCase();
          return covered.includes("sepsis") && (covered.includes("stemi") || covered.includes("shock")) && covered.includes("ards");
        },
        currentValue: (p) => `${p.conditionsCovered.length} conditions covered`,
        target: "Sepsis + Shock + ARDS",
      },
      {
        id: "icu-telemetry-first",
        description: "Telemetry Ready clearance achieved first",
        category: "sessions",
        evaluate: (p) => p.telemetryReadySessions >= 3,
        currentValue: (p) => p.telemetryReadySessions >= 3 ? "Telemetry Ready ✓" : `${p.telemetryReadySessions}/3 sessions`,
        target: "Telemetry Ready prerequisite",
      },
    ],
    requiredConditions: ["Sepsis", "Anterior STEMI", "ARDS", "Cardiac Tamponade"],
    requiredSimulationsPassed: ["rn-septic-shock", "rn-respiratory-failure", "rn-code-blue"],
  },

  // ── RT Critical Care Ready ─────────────────────────────────────────────────
  {
    id: "rt_critical_care_ready",
    label: "RT Critical Care Ready",
    description: "Competent for ventilator management in a supervised ICU environment.",
    colour: "#ea80fc",
    requirements: [
      {
        id: "rt-waveform",
        description: "Recognize Cues ≥ 75/100 (waveform recognition proxy)",
        category: "score",
        evaluate: (p) => p.ncjmmTrends.recognize_cues.rollingAverage >= 75,
        currentValue: (p) => `${Math.round(p.ncjmmTrends.recognize_cues.rollingAverage)}/100`,
        target: "≥ 75/100",
      },
      {
        id: "rt-action",
        description: "Take Action ≥ 70/100",
        category: "score",
        evaluate: (p) => p.ncjmmTrends.take_action.rollingAverage >= 70,
        currentValue: (p) => `${Math.round(p.ncjmmTrends.take_action.rollingAverage)}/100`,
        target: "≥ 70/100",
      },
      {
        id: "rt-vent-coverage",
        description: "ARDS, auto-PEEP, and accidental extubation practiced",
        category: "coverage",
        evaluate: (p) => {
          const covered = p.conditionsCovered.join(" ").toLowerCase();
          return covered.includes("ards") && (covered.includes("auto") || covered.includes("peep")) && covered.includes("extubation");
        },
        currentValue: (p) => `${p.conditionsCovered.length} conditions covered`,
        target: "ARDS + Auto-PEEP + Extubation",
      },
      {
        id: "rt-safety",
        description: "No recurring harm in ventilator-related simulations",
        category: "safety",
        evaluate: (p) => !p.harmPatterns.some((h) => h.isRecurring && h.harmLevel === "severe"),
        currentValue: (p) => p.harmPatterns.some((h) => h.isRecurring && h.harmLevel === "severe") ? "Recurring severe harm" : "No recurring severe harm",
        target: "No recurring severe harm",
      },
      {
        id: "rt-sessions",
        description: "≥ 6 RT-mode sessions completed",
        category: "sessions",
        evaluate: (p) => p.sessionCount >= 6,
        currentValue: (p) => `${p.sessionCount} sessions`,
        target: "≥ 6 sessions",
      },
    ],
    requiredConditions: ["ARDS", "rt_auto_peep", "rt_vent_asynchrony", "rt_accidental_extubation"],
    requiredSimulationsPassed: ["rt-ards", "rt-auto-peep", "rt-accidental-extubation"],
  },

  // ── New Grad Safe Practice ─────────────────────────────────────────────────
  {
    id: "new_grad_safe_practice",
    label: "New Grad Safe Practice",
    description: "Demonstrates safe escalation, documentation, and rapid response competency for supervised clinical practice.",
    colour: "#ffd740",
    requirements: [
      {
        id: "ng-escalation",
        description: "Prioritize Hypotheses ≥ 60/100 (escalation decisions)",
        category: "score",
        evaluate: (p) => p.ncjmmTrends.prioritize_hypotheses.rollingAverage >= 60,
        currentValue: (p) => `${Math.round(p.ncjmmTrends.prioritize_hypotheses.rollingAverage)}/100`,
        target: "≥ 60/100",
      },
      {
        id: "ng-documentation",
        description: "Evaluate Outcomes ≥ 55/100 (documentation proxy)",
        category: "score",
        evaluate: (p) => p.ncjmmTrends.evaluate_outcomes.rollingAverage >= 55,
        currentValue: (p) => `${Math.round(p.ncjmmTrends.evaluate_outcomes.rollingAverage)}/100`,
        target: "≥ 55/100",
      },
      {
        id: "ng-no-arrest",
        description: "No preventable arrest events",
        category: "safety",
        evaluate: (p) => !p.harmPatterns.some((h) => h.harmLevel === "preventable_arrest" && h.occurrenceCount > 0),
        currentValue: (p) => {
          const arrests = p.harmPatterns.find((h) => h.harmLevel === "preventable_arrest");
          return arrests ? `${arrests.occurrenceCount} arrest event(s)` : "No arrests";
        },
        target: "Zero preventable arrests",
      },
      {
        id: "ng-rapid-response",
        description: "Rapid Response scenario completed",
        category: "coverage",
        evaluate: (p) => p.simulationsPassed.some((s) => s.toLowerCase().includes("rapid")),
        currentValue: (p) => p.simulationsPassed.some((s) => s.toLowerCase().includes("rapid")) ? "Completed ✓" : "Not yet completed",
        target: "Rapid Response simulation passed",
      },
      {
        id: "ng-sessions",
        description: "≥ 3 sessions completed",
        category: "sessions",
        evaluate: (p) => p.sessionCount >= 3,
        currentValue: (p) => `${p.sessionCount} sessions`,
        target: "≥ 3 sessions",
      },
    ],
    requiredConditions: ["Sepsis"],
    requiredSimulationsPassed: ["ng-rapid-response", "ng-deteriorating-patient"],
  },
];

// ─── Clearance evaluator ──────────────────────────────────────────────────────

export function evaluateClearance(
  clearanceId: ClearanceId,
  profile: LearnerGrowthProfile,
  passport?: MonitorCompetencyPassport,
): ClearanceResult {
  const definition = CLEARANCE_DEFINITIONS.find((c) => c.id === clearanceId);
  if (!definition) throw new Error(`Unknown clearance: ${clearanceId}`);

  const requirementResults: RequirementResult[] = definition.requirements.map((req) => ({
    requirementId: req.id,
    description: req.description,
    met: req.evaluate(profile, passport),
    currentValue: req.currentValue(profile, passport),
    target: req.target,
  }));

  const metCount = requirementResults.filter((r) => r.met).length;
  const totalCount = requirementResults.length;
  const progress = Math.round((metCount / totalCount) * 100);
  const achieved = metCount === totalCount;

  const blockers = requirementResults
    .filter((r) => !r.met)
    .map((r) => r.description);

  const nearestGap = blockers[0] ?? "All requirements met";

  return {
    clearanceId,
    label: definition.label,
    achieved,
    requirementsMet: requirementResults,
    blockers,
    progress,
    nearestGap,
  };
}

/** Evaluate all clearances for a learner. */
export function evaluateAllClearances(
  profile: LearnerGrowthProfile,
  passport?: MonitorCompetencyPassport,
): Record<ClearanceId, ClearanceResult> {
  return Object.fromEntries(
    CLEARANCE_DEFINITIONS.map((def) => [
      def.id,
      evaluateClearance(def.id, profile, passport),
    ]),
  ) as Record<ClearanceId, ClearanceResult>;
}
