/**
 * Clinical Skills Adapter
 *
 * Maps Clinical Skills module scenarios to a live PhysiologyState, allowing
 * any clinical skills assessment to launch a live patient monitor.
 *
 * Integration pattern:
 *   1. A Clinical Skills page imports getMonitorPropsForSkill(skillKey)
 *   2. The returned MonitorWorkstationProps are spread into <MonitorWorkstation>
 *   3. The monitor runs live alongside the skill assessment
 *
 * Each skill mapping defines:
 *   - Which deterioration condition to simulate
 *   - Which monitor mode is appropriate
 *   - Whether interventions should be visible (some skills test pure assessment)
 *   - Assessment cues the learner should identify from the live monitor
 */

import type { MonitorMode } from "./physiology-state";
import type { MonitorWorkstationProps } from "@/components/physiology-monitor/monitor-workstation";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClinicalSkillMonitorMapping {
  skillKey: string;
  skillTitle: string;
  conditionKey: string;
  mode: MonitorMode;
  /** Stage the condition opens at for this skill scenario. */
  openingStage?: "early" | "developing" | "severe";
  /** Whether to show intervention panel during skill assessment. */
  showInterventions: boolean;
  /** Whether to show educational overlay by default. */
  defaultOverlay: boolean;
  /** Whether to show trend panel. */
  showTrend: boolean;
  /** Clinical context sentence displayed above the monitor. */
  scenarioContext: string;
  /** Specific monitor findings the learner should identify. */
  assessmentCues: string[];
  /** Expected learner actions for this skill. */
  expectedActions: string[];
}

export type MonitorWorkstationProps = {
  initialCondition: string;
  initialMode: MonitorMode;
  hideControls: boolean;
  hideTrend: boolean;
  hideInterventions: boolean;
  defaultOverlay: boolean;
};

// ─── Skill → monitor mapping registry ────────────────────────────────────────

export const CLINICAL_SKILL_MONITOR_MAPPINGS: ClinicalSkillMonitorMapping[] = [
  {
    skillKey: "chest_pain_assessment",
    skillTitle: "Chest Pain Assessment",
    conditionKey: "stemi",
    mode: "general",
    openingStage: "early",
    showInterventions: false,
    defaultOverlay: false,
    showTrend: true,
    scenarioContext: "68-year-old male presenting with acute substernal chest pain radiating to the jaw, onset 45 minutes ago.",
    assessmentCues: [
      "ST elevation on ECG monitor",
      "Tachycardia with elevated pain score",
      "Hypotension developing",
      "Diaphoresis (clinical finding — not on monitor)",
    ],
    expectedActions: [
      "12-lead ECG acquisition",
      "Supplemental oxygen if SpO₂ < 94%",
      "IV access establishment",
      "Aspirin administration",
      "Immediate provider notification",
      "Cath lab activation",
    ],
  },

  {
    skillKey: "shock_assessment",
    skillTitle: "Shock Assessment",
    conditionKey: "sepsis",
    mode: "icu",
    openingStage: "developing",
    showInterventions: true,
    defaultOverlay: false,
    showTrend: true,
    scenarioContext: "54-year-old female post-urologic procedure with fever, altered mental status, and falling blood pressure.",
    assessmentCues: [
      "Tachycardia > 100",
      "MAP < 65 mmHg",
      "Fever > 38.3°C",
      "Rising lactate",
      "Reduced urine output",
    ],
    expectedActions: [
      "Blood cultures × 2 before antibiotics",
      "Broad-spectrum antibiotics within 1 hour",
      "30 mL/kg IV crystalloid bolus",
      "Norepinephrine if MAP remains < 65 after fluids",
      "Rapid response / ICU notification",
    ],
  },

  {
    skillKey: "respiratory_assessment",
    skillTitle: "Respiratory Failure Assessment",
    conditionKey: "ards",
    mode: "rt",
    openingStage: "early",
    showInterventions: true,
    defaultOverlay: false,
    showTrend: true,
    scenarioContext: "43-year-old male, post-ARDS day 2. Ventilated on AC/VC. SpO₂ declining despite FiO₂ 0.6.",
    assessmentCues: [
      "SpO₂ < 90% on high FiO₂",
      "Rising peak inspiratory pressure",
      "Falling lung compliance",
      "Tachycardia from hypoxemia",
    ],
    expectedActions: [
      "Titrate PEEP upward for alveolar recruitment",
      "Reduce tidal volume to 4–6 mL/kg IBW",
      "Verify plateau pressure < 30 cmH₂O",
      "Consider prone positioning",
      "Respiratory therapy consult",
    ],
  },

  {
    skillKey: "sepsis_assessment",
    skillTitle: "Sepsis Recognition and Response",
    conditionKey: "sepsis",
    mode: "general",
    openingStage: "early",
    showInterventions: true,
    defaultOverlay: true,
    showTrend: true,
    scenarioContext: "72-year-old nursing home resident admitted with urinary tract infection and new confusion.",
    assessmentCues: [
      "Heart rate > 100",
      "Respiratory rate > 22",
      "Temperature > 38°C",
      "Systolic BP < 100 or drop > 40",
      "Rising lactate on repeat labs",
    ],
    expectedActions: [
      "Sepsis screening tool activation",
      "Blood cultures before antibiotics",
      "IV antibiotics within 1 hour",
      "IV fluid challenge 30 mL/kg",
      "Reassessment at 1 and 3 hours",
    ],
  },

  {
    skillKey: "neurologic_assessment",
    skillTitle: "Neurologic Deterioration Assessment",
    conditionKey: "increased_icp",
    mode: "icu",
    openingStage: "developing",
    showInterventions: true,
    defaultOverlay: false,
    showTrend: true,
    scenarioContext: "28-year-old with traumatic brain injury (GCS 9 post-resus). ICP monitor in place.",
    assessmentCues: [
      "ICP > 20 mmHg",
      "Falling GCS",
      "Cushing's triad: bradycardia + hypertension + irregular breathing",
      "Pupil changes (described clinically)",
    ],
    expectedActions: [
      "HOB 30° elevation",
      "Osmotic therapy: mannitol 1 g/kg IV",
      "Avoid hypotension (MAP > 80)",
      "Avoid hypoxia (SpO₂ > 95%)",
      "Neurosurgery emergency notification",
    ],
  },

  {
    skillKey: "anaphylaxis_response",
    skillTitle: "Anaphylaxis Recognition and Treatment",
    conditionKey: "anaphylaxis",
    mode: "general",
    openingStage: "early",
    showInterventions: true,
    defaultOverlay: false,
    showTrend: false,
    scenarioContext: "31-year-old receiving IV contrast dye. Suddenly complains of throat tightness and dizziness.",
    assessmentCues: [
      "Rapid tachycardia onset",
      "Sudden hypotension",
      "SpO₂ dropping",
      "Bronchospasm pattern on vent (if intubated)",
    ],
    expectedActions: [
      "Stop offending agent immediately",
      "Epinephrine 0.3 mg IM right lateral thigh",
      "Position supine unless respiratory distress",
      "IV diphenhydramine + methylprednisolone",
      "IV fluid bolus 1–2 L",
      "Prepare for intubation if stridor",
    ],
  },

  {
    skillKey: "telemetry_alarm_management",
    skillTitle: "Telemetry Alarm Management",
    conditionKey: "afib_rvr",
    mode: "general",
    openingStage: "developing",
    showInterventions: true,
    defaultOverlay: false,
    showTrend: true,
    scenarioContext: "58-year-old post-cardiac catheterization. Telemetry alarms for heart rate 162, irregular rhythm.",
    assessmentCues: [
      "Irregularly irregular rhythm",
      "Rapid ventricular rate > 150",
      "Hypotension developing",
      "Patient symptomatic (palpitations, dizziness)",
    ],
    expectedActions: [
      "Rate vs rhythm control decision",
      "12-lead ECG",
      "Provider notification",
      "Rate control: IV amiodarone or metoprolol",
      "Cardioversion if hemodynamically unstable",
    ],
  },

  {
    skillKey: "hyperkalemia_recognition",
    skillTitle: "Hyperkalemia ECG Recognition",
    conditionKey: "hyperkalemia",
    mode: "general",
    openingStage: "developing",
    showInterventions: true,
    defaultOverlay: true,
    showTrend: false,
    scenarioContext: "67-year-old with ESRD, missed dialysis. Lab: K⁺ 6.8 mEq/L. ECG changes noted on monitor.",
    assessmentCues: [
      "Peaked narrow T-waves",
      "QRS widening",
      "Bradycardia",
      "Sine-wave morphology (if untreated)",
    ],
    expectedActions: [
      "Calcium gluconate 2 g IV (membrane stabilisation)",
      "Insulin 10 units IV + Dextrose 50%",
      "Sodium bicarbonate (if metabolic acidosis)",
      "Emergency dialysis consult",
      "Cardiac monitoring — continuous",
    ],
  },
];

// ─── Lookup ───────────────────────────────────────────────────────────────────

export function getSkillMapping(skillKey: string): ClinicalSkillMonitorMapping | null {
  return CLINICAL_SKILL_MONITOR_MAPPINGS.find((m) => m.skillKey === skillKey) ?? null;
}

/**
 * Returns MonitorWorkstation props ready to spread into the component.
 */
export function getMonitorPropsForSkill(skillKey: string): MonitorWorkstationProps | null {
  const mapping = getSkillMapping(skillKey);
  if (!mapping) return null;

  return {
    initialCondition: mapping.conditionKey,
    initialMode: mapping.mode,
    hideControls: true,
    hideTrend: !mapping.showTrend,
    hideInterventions: !mapping.showInterventions,
    defaultOverlay: mapping.defaultOverlay,
  };
}

/** All skills that have a live monitor available. */
export function getSkillsWithMonitor(): Array<{ skillKey: string; skillTitle: string }> {
  return CLINICAL_SKILL_MONITOR_MAPPINGS.map(({ skillKey, skillTitle }) => ({ skillKey, skillTitle }));
}
