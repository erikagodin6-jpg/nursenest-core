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
  | "new_grad_safe_practice"
  | "rn_entry_to_practice_ready"
  | "rpn_entry_to_practice_ready"
  | "nclex_rn_ready"
  | "nclex_pn_ready"
  | "rex_pn_ready"
  | "cnple_ready"
  | "medication_safety_ready"
  | "delegation_ready"
  | "clinical_judgment_ready"
  | "emergency_ready"
  | "medical_surgical_ready"
  | "community_practice_ready";

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

function scoreRequirement(
  id: string,
  description: string,
  domain: NcjmmDomain | "composite",
  targetScore: number,
): ClearanceRequirement {
  return {
    id,
    description,
    category: "score",
    evaluate: (p) => (domain === "composite" ? p.compositeTrend.rollingAverage : p.ncjmmTrends[domain].rollingAverage) >= targetScore,
    currentValue: (p) => `${Math.round(domain === "composite" ? p.compositeTrend.rollingAverage : p.ncjmmTrends[domain].rollingAverage)}/100`,
    target: `≥ ${targetScore}/100`,
  };
}

function sessionRequirement(id: string, count: number): ClearanceRequirement {
  return {
    id,
    description: `Minimum ${count} simulation sessions completed`,
    category: "sessions",
    evaluate: (p) => p.sessionCount >= count,
    currentValue: (p) => `${p.sessionCount} sessions`,
    target: `≥ ${count} sessions`,
  };
}

function noSevereHarmRequirement(id: string): ClearanceRequirement {
  return {
    id,
    description: "No severe or preventable-arrest harm events",
    category: "safety",
    evaluate: (p) => !p.harmPatterns.some((h) => h.harmLevel === "severe" || h.harmLevel === "preventable_arrest"),
    currentValue: (p) => {
      const severe = p.harmPatterns.filter((h) => h.harmLevel === "severe" || h.harmLevel === "preventable_arrest");
      return severe.length === 0 ? "No severe harm" : `${severe.length} severe harm pattern(s)`;
    },
    target: "Zero severe/arrest harm",
  };
}

function coverageRequirement(id: string, description: string, terms: string[]): ClearanceRequirement {
  return {
    id,
    description,
    category: "coverage",
    evaluate: (p) => {
      const covered = [...p.conditionsCovered, ...p.simulationsPassed].join(" ").toLowerCase();
      return terms.every((term) => covered.includes(term.toLowerCase()));
    },
    currentValue: (p) => `${p.conditionsCovered.length} condition(s) covered`,
    target: terms.join(" + "),
  };
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

  // ── Entry-to-practice and exam readiness clearances ───────────────────────
  {
    id: "rn_entry_to_practice_ready",
    label: "RN Entry-To-Practice Ready",
    description: "Demonstrates entry-level RN clinical judgment, escalation, and safe patient deterioration recognition through simulation.",
    colour: "var(--semantic-success)",
    requirements: [
      scoreRequirement("rn-etp-composite", "Composite simulation average ≥ 72/100", "composite", 72),
      scoreRequirement("rn-etp-recognize", "Recognize Cues average ≥ 70/100", "recognize_cues", 70),
      scoreRequirement("rn-etp-action", "Take Action average ≥ 68/100", "take_action", 68),
      sessionRequirement("rn-etp-sessions", 6),
      noSevereHarmRequirement("rn-etp-safety"),
      coverageRequirement("rn-etp-coverage", "Medical-surgical, cardiac, respiratory, and deterioration cases practiced", ["sepsis", "stemi", "respiratory"]),
    ],
    requiredConditions: ["Sepsis", "STEMI", "Respiratory Failure"],
    requiredSimulationsPassed: ["rn-sepsis-early", "rn-stemi", "rn-respiratory-failure"],
  },
  {
    id: "rpn_entry_to_practice_ready",
    label: "RPN Entry-To-Practice Ready",
    description: "Demonstrates foundational RPN recognition, reporting, documentation, and stable/common presentation management.",
    colour: "var(--semantic-chart-2)",
    requirements: [
      scoreRequirement("rpn-etp-composite", "Composite simulation average ≥ 66/100", "composite", 66),
      scoreRequirement("rpn-etp-prioritize", "Prioritize Hypotheses average ≥ 62/100", "prioritize_hypotheses", 62),
      scoreRequirement("rpn-etp-evaluate", "Evaluate Outcomes average ≥ 60/100", "evaluate_outcomes", 60),
      sessionRequirement("rpn-etp-sessions", 5),
      noSevereHarmRequirement("rpn-etp-safety"),
      coverageRequirement("rpn-etp-coverage", "Stable respiratory, cardiac, and escalation cases practiced", ["respiratory", "afib", "sepsis"]),
    ],
    requiredConditions: ["Respiratory Failure", "Atrial Fibrillation", "Sepsis"],
    requiredSimulationsPassed: ["rpn-afib-monitoring", "rpn-respiratory-distress", "rpn-sepsis-recognition"],
  },
  {
    id: "nclex_rn_ready",
    label: "NCLEX-RN Ready",
    description: "Simulation evidence supports NCLEX-RN-style clinical judgment across cue recognition, action, and outcome evaluation.",
    colour: "var(--semantic-brand)",
    requirements: [
      scoreRequirement("nclex-rn-composite", "Composite simulation average ≥ 76/100", "composite", 76),
      scoreRequirement("nclex-rn-cues", "Recognize Cues average ≥ 74/100", "recognize_cues", 74),
      scoreRequirement("nclex-rn-prioritize", "Prioritize Hypotheses average ≥ 72/100", "prioritize_hypotheses", 72),
      scoreRequirement("nclex-rn-evaluate", "Evaluate Outcomes average ≥ 70/100", "evaluate_outcomes", 70),
      sessionRequirement("nclex-rn-sessions", 8),
      coverageRequirement("nclex-rn-coverage", "NGN-style sepsis, cardiac, respiratory, neuro, and medication-safety simulations practiced", ["sepsis", "stemi", "respiratory", "stroke"]),
    ],
    requiredConditions: ["Sepsis", "STEMI", "Respiratory Failure", "Stroke"],
    requiredSimulationsPassed: ["rn-sepsis-early", "rn-stemi", "rn-respiratory-failure", "rn-stroke"],
  },
  {
    id: "nclex_pn_ready",
    label: "NCLEX-PN Ready",
    description: "Simulation evidence supports PN-level safe practice, cue recognition, reporting, and common patient priorities.",
    colour: "var(--semantic-chart-5)",
    requirements: [
      scoreRequirement("nclex-pn-composite", "Composite simulation average ≥ 68/100", "composite", 68),
      scoreRequirement("nclex-pn-cues", "Recognize Cues average ≥ 65/100", "recognize_cues", 65),
      scoreRequirement("nclex-pn-action", "Take Action average ≥ 63/100", "take_action", 63),
      sessionRequirement("nclex-pn-sessions", 6),
      noSevereHarmRequirement("nclex-pn-safety"),
      coverageRequirement("nclex-pn-coverage", "Foundational respiratory, cardiac, safety, and medication cases practiced", ["respiratory", "afib", "medication"]),
    ],
    requiredConditions: ["Respiratory Failure", "Atrial Fibrillation", "Medication Safety"],
    requiredSimulationsPassed: ["rpn-respiratory-distress", "rpn-afib-monitoring", "rpn-medication-safety"],
  },
  {
    id: "rex_pn_ready",
    label: "REx-PN Ready",
    description: "Simulation evidence supports Canadian PN entry-to-practice judgment, escalation, and safe care decisions.",
    colour: "var(--semantic-info)",
    requirements: [
      scoreRequirement("rex-pn-composite", "Composite simulation average ≥ 68/100", "composite", 68),
      scoreRequirement("rex-pn-prioritize", "Prioritize Hypotheses average ≥ 64/100", "prioritize_hypotheses", 64),
      scoreRequirement("rex-pn-action", "Take Action average ≥ 64/100", "take_action", 64),
      sessionRequirement("rex-pn-sessions", 6),
      noSevereHarmRequirement("rex-pn-safety"),
      coverageRequirement("rex-pn-coverage", "Common deterioration, medication, delegation, and communication cases practiced", ["sepsis", "medication", "delegation"]),
    ],
    requiredConditions: ["Sepsis", "Medication Safety", "Delegation"],
    requiredSimulationsPassed: ["rpn-sepsis-recognition", "rpn-medication-safety", "rpn-delegation"],
  },
  {
    id: "cnple_ready",
    label: "CNPLE Ready",
    description: "Simulation evidence supports NP-level diagnostic reasoning, management planning, prescribing safety, and LOFT-style endurance.",
    colour: "var(--semantic-chart-4)",
    requirements: [
      scoreRequirement("cnple-composite", "Composite simulation average ≥ 78/100", "composite", 78),
      scoreRequirement("cnple-analyze", "Analyze Cues average ≥ 76/100", "analyze_cues", 76),
      scoreRequirement("cnple-solutions", "Generate Solutions average ≥ 76/100", "generate_solutions", 76),
      scoreRequirement("cnple-evaluate", "Evaluate Outcomes average ≥ 74/100", "evaluate_outcomes", 74),
      sessionRequirement("cnple-sessions", 8),
      coverageRequirement("cnple-coverage", "Urgent, chronic disease, prescribing, and professional-practice simulations practiced", ["urgent", "diabetes", "prescribing"]),
    ],
    requiredConditions: ["Urgent Care", "Diabetes", "Prescribing Safety"],
    requiredSimulationsPassed: ["np-urgent-care", "np-diabetes-management", "np-prescribing-safety"],
  },
  {
    id: "medication_safety_ready",
    label: "Medication Safety Ready",
    description: "Demonstrates medication-risk recognition, monitoring, escalation, and outcome evaluation across high-risk scenarios.",
    colour: "var(--semantic-warning)",
    requirements: [
      scoreRequirement("med-safety-cues", "Recognize medication safety cues ≥ 72/100", "recognize_cues", 72),
      scoreRequirement("med-safety-action", "Take Action average ≥ 72/100", "take_action", 72),
      scoreRequirement("med-safety-evaluate", "Evaluate Outcomes average ≥ 70/100", "evaluate_outcomes", 70),
      sessionRequirement("med-safety-sessions", 5),
      noSevereHarmRequirement("med-safety-no-harm"),
      coverageRequirement("med-safety-coverage", "Insulin, anticoagulant, opioid, and cardiac-medication scenarios practiced", ["insulin", "anticoagulant", "opioid"]),
    ],
    requiredConditions: ["Insulin Safety", "Anticoagulation", "Opioid Toxicity"],
    requiredSimulationsPassed: ["rn-insulin-safety", "rn-anticoagulation", "np-opioid-overdose"],
  },
  {
    id: "delegation_ready",
    label: "Delegation Ready",
    description: "Demonstrates safe task assignment, supervision, reassessment, and escalation decisions.",
    colour: "var(--semantic-chart-6)",
    requirements: [
      scoreRequirement("delegation-prioritize", "Prioritize Hypotheses average ≥ 70/100", "prioritize_hypotheses", 70),
      scoreRequirement("delegation-action", "Take Action average ≥ 68/100", "take_action", 68),
      sessionRequirement("delegation-sessions", 4),
      noSevereHarmRequirement("delegation-safety"),
      coverageRequirement("delegation-coverage", "Delegation and multi-patient prioritization scenarios practiced", ["delegation", "assignment"]),
    ],
    requiredConditions: ["Delegation", "Multi-Patient Assignment"],
    requiredSimulationsPassed: ["rn-delegation", "ng-multi-patient-assignment"],
  },
  {
    id: "clinical_judgment_ready",
    label: "Clinical Judgment Ready",
    description: "Demonstrates balanced NCJMM performance across cue recognition, hypothesis prioritization, action, and outcome evaluation.",
    colour: "var(--semantic-brand)",
    requirements: [
      scoreRequirement("cj-composite", "Composite simulation average ≥ 78/100", "composite", 78),
      scoreRequirement("cj-recognize", "Recognize Cues average ≥ 75/100", "recognize_cues", 75),
      scoreRequirement("cj-analyze", "Analyze Cues average ≥ 72/100", "analyze_cues", 72),
      scoreRequirement("cj-prioritize", "Prioritize Hypotheses average ≥ 72/100", "prioritize_hypotheses", 72),
      scoreRequirement("cj-action", "Take Action average ≥ 72/100", "take_action", 72),
      scoreRequirement("cj-evaluate", "Evaluate Outcomes average ≥ 70/100", "evaluate_outcomes", 70),
    ],
    requiredConditions: ["Sepsis", "STEMI", "Respiratory Failure"],
    requiredSimulationsPassed: ["rn-sepsis-early", "rn-stemi", "rn-respiratory-failure"],
  },
  {
    id: "emergency_ready",
    label: "Emergency Ready",
    description: "Demonstrates early recognition, stabilization, escalation, and reassessment in time-sensitive emergency presentations.",
    colour: "var(--semantic-danger)",
    requirements: [
      scoreRequirement("emergency-composite", "Composite simulation average ≥ 76/100", "composite", 76),
      scoreRequirement("emergency-cues", "Recognize Cues average ≥ 75/100", "recognize_cues", 75),
      scoreRequirement("emergency-action", "Take Action average ≥ 75/100", "take_action", 75),
      sessionRequirement("emergency-sessions", 6),
      noSevereHarmRequirement("emergency-safety"),
      coverageRequirement("emergency-coverage", "STEMI, stroke, anaphylaxis, shock, and overdose cases practiced", ["stemi", "stroke", "anaphylaxis", "shock"]),
    ],
    requiredConditions: ["STEMI", "Stroke", "Anaphylaxis", "Shock"],
    requiredSimulationsPassed: ["rn-stemi", "rn-stroke", "rn-anaphylaxis", "rn-shock"],
  },
  {
    id: "medical_surgical_ready",
    label: "Medical-Surgical Ready",
    description: "Demonstrates recognition and management of common med-surg deterioration patterns and post-acute risks.",
    colour: "var(--semantic-success)",
    requirements: [
      scoreRequirement("medsurg-composite", "Composite simulation average ≥ 72/100", "composite", 72),
      scoreRequirement("medsurg-cues", "Recognize Cues average ≥ 70/100", "recognize_cues", 70),
      scoreRequirement("medsurg-evaluate", "Evaluate Outcomes average ≥ 68/100", "evaluate_outcomes", 68),
      sessionRequirement("medsurg-sessions", 6),
      coverageRequirement("medsurg-coverage", "Sepsis, heart failure, GI bleed, falls, delirium, and respiratory cases practiced", ["sepsis", "heart", "respiratory"]),
    ],
    requiredConditions: ["Sepsis", "Heart Failure", "Respiratory Failure", "GI Bleed"],
    requiredSimulationsPassed: ["rn-sepsis-early", "rn-chf-exacerbation", "rn-respiratory-failure", "rn-gi-bleed"],
  },
  {
    id: "community_practice_ready",
    label: "Community Practice Ready",
    description: "Demonstrates safe outpatient/community judgment, deterioration recognition, education, and escalation planning.",
    colour: "var(--semantic-chart-7)",
    requirements: [
      scoreRequirement("community-composite", "Composite simulation average ≥ 70/100", "composite", 70),
      scoreRequirement("community-analyze", "Analyze Cues average ≥ 68/100", "analyze_cues", 68),
      scoreRequirement("community-solutions", "Generate Solutions average ≥ 68/100", "generate_solutions", 68),
      sessionRequirement("community-sessions", 4),
      coverageRequirement("community-coverage", "Diabetes, infection, mental health, and patient-education scenarios practiced", ["diabetes", "infection", "education"]),
    ],
    requiredConditions: ["Diabetes", "Infection", "Patient Education"],
    requiredSimulationsPassed: ["np-diabetes-management", "np-cellulitis", "rn-discharge-education"],
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
