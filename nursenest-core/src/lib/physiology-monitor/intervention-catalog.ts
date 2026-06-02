/**
 * Intervention Catalog
 *
 * Describes every intervention the learner can apply during a simulation.
 * Each intervention has:
 *   - immediateEffects: single large delta applied on the tick it's given
 *   - sustainedEffectsPerTick: smaller delta applied each subsequent tick
 *   - durationTicks: how many ticks the sustained effect lasts
 *   - rhythmChange: optional ECG rhythm key the intervention may cause
 *   - stageRollback: whether the intervention can reverse condition stage
 *
 * The engine calls applyIntervention() which records the intervention and
 * begins applying effects on the next tick.
 */

import type { PhysiologyState } from "./physiology-state";

// ─── Types ────────────────────────────────────────────────────────────────────

export type VitalDelta = Partial<Record<keyof PhysiologyState, number>>;

export type InterventionCategory =
  | "hemodynamic"
  | "respiratory"
  | "antiarrhythmic"
  | "metabolic"
  | "neurologic"
  | "analgesic"
  | "resuscitation";

export interface InterventionEffect {
  immediateDeltas: VitalDelta;
  sustainedDeltasPerTick: VitalDelta;
  durationTicks: number;
  /** If set, the ECG rhythm transitions to this key after the intervention. */
  rhythmChange?: string;
  /** ECG features to set immediately after the intervention. */
  ecgFeaturesSet?: Partial<PhysiologyState["ecgFeatures"]>;
  /** Whether this intervention can push the condition one stage earlier. */
  stageRollback?: boolean;
}

export interface Intervention {
  key: string;
  label: string;
  shortLabel: string;
  category: InterventionCategory;
  description: string;
  /** Clinical indications for this intervention. */
  indicatedFor: string[];
  /** Conditions this intervention is contraindicated in. */
  contraindicatedFor: string[];
  effect: InterventionEffect;
  /** Can be repeated (e.g. fluid boluses). */
  repeatable: boolean;
  /** Sim-seconds before a repeat is allowed. */
  repeatCooldownTicks?: number;
}

// ─── Catalog ──────────────────────────────────────────────────────────────────

export const INTERVENTION_CATALOG: Intervention[] = [

  // ── Hemodynamic ─────────────────────────────────────────────────────────────

  {
    key: "fluid_bolus",
    label: "IV Fluid Bolus (500 mL NS)",
    shortLabel: "Fluid Bolus",
    category: "hemodynamic",
    description: "Rapid infusion of 500 mL normal saline to expand intravascular volume.",
    indicatedFor: ["sepsis", "gi_bleed", "anaphylaxis", "dka", "tension_pneumothorax"],
    contraindicatedFor: ["heart_failure", "ards"],
    effect: {
      immediateDeltas: { systolicBP: 8, diastolicBP: 5, map: 6, heartRate: -8, cvp: 2, urineOutputPerHour: 5 },
      sustainedDeltasPerTick: { systolicBP: 2, diastolicBP: 1, heartRate: -2, urineOutputPerHour: 2 },
      durationTicks: 3,
      stageRollback: true,
    },
    repeatable: true,
    repeatCooldownTicks: 2,
  },

  {
    key: "norepinephrine",
    label: "Norepinephrine (vasopressor)",
    shortLabel: "Norepinephrine",
    category: "hemodynamic",
    description: "Vasopressor increasing SVR and MAP. First-line for septic and distributive shock.",
    indicatedFor: ["sepsis", "anaphylaxis", "cardiac_tamponade"],
    contraindicatedFor: [],
    effect: {
      immediateDeltas: { systolicBP: 14, diastolicBP: 10, map: 11, heartRate: 4 },
      sustainedDeltasPerTick: { systolicBP: 3, diastolicBP: 2, map: 2 },
      durationTicks: 6,
    },
    repeatable: false,
  },

  {
    key: "epinephrine_im",
    label: "Epinephrine 0.3 mg IM",
    shortLabel: "Epi IM",
    category: "hemodynamic",
    description: "Intramuscular epinephrine — first-line treatment for anaphylaxis.",
    indicatedFor: ["anaphylaxis"],
    contraindicatedFor: [],
    effect: {
      immediateDeltas: { heartRate: 12, systolicBP: 20, diastolicBP: 8, map: 12, spo2: 6, airwayResistance: -8, respiratoryRate: -4 },
      sustainedDeltasPerTick: { systolicBP: 4, heartRate: -3, spo2: 2, airwayResistance: -2 },
      durationTicks: 4,
      stageRollback: true,
    },
    repeatable: true,
    repeatCooldownTicks: 3,
  },

  {
    key: "blood_transfusion",
    label: "Packed Red Blood Cells (2 units pRBC)",
    shortLabel: "Blood Transfusion",
    category: "hemodynamic",
    description: "Transfusion of 2 units PRBCs for hemorrhagic shock. Improves oxygen-carrying capacity.",
    indicatedFor: ["gi_bleed"],
    contraindicatedFor: [],
    effect: {
      immediateDeltas: { systolicBP: 12, diastolicBP: 6, heartRate: -10, spo2: 3, map: 8, urineOutputPerHour: 8 },
      sustainedDeltasPerTick: { systolicBP: 3, heartRate: -2, lactate: -0.4 },
      durationTicks: 4,
      stageRollback: true,
    },
    repeatable: true,
    repeatCooldownTicks: 2,
  },

  // ── Respiratory ─────────────────────────────────────────────────────────────

  {
    key: "supplemental_o2",
    label: "Supplemental O₂ (15 L NRB)",
    shortLabel: "O₂ NRB",
    category: "respiratory",
    description: "High-flow oxygen via non-rebreather mask targeting SpO₂ > 94%.",
    indicatedFor: ["sepsis", "afib_rvr", "svt", "pulmonary_embolism", "gi_bleed", "anaphylaxis", "heart_failure"],
    contraindicatedFor: [],
    effect: {
      immediateDeltas: { spo2: 5, fio2: 0.4 },
      sustainedDeltasPerTick: { spo2: 1 },
      durationTicks: 4,
    },
    repeatable: false,
  },

  {
    key: "bipap",
    label: "BiPAP / NIV",
    shortLabel: "BiPAP",
    category: "respiratory",
    description: "Non-invasive positive pressure ventilation. Reduces work of breathing and improves oxygenation.",
    indicatedFor: ["heart_failure", "ards", "dka"],
    contraindicatedFor: ["tension_pneumothorax"],
    effect: {
      immediateDeltas: { spo2: 8, respiratoryRate: -5, fio2: 0.4, heartRate: -6 },
      sustainedDeltasPerTick: { spo2: 2, respiratoryRate: -1 },
      durationTicks: 5,
      stageRollback: true,
    },
    repeatable: false,
  },

  {
    key: "increase_peep",
    label: "Increase PEEP (+2 cmH₂O)",
    shortLabel: "↑ PEEP",
    category: "respiratory",
    description: "Increases PEEP to improve alveolar recruitment in ARDS.",
    indicatedFor: ["ards"],
    contraindicatedFor: ["tension_pneumothorax"],
    effect: {
      immediateDeltas: { spo2: 3, peep: 2, plateauPressure: 2 },
      sustainedDeltasPerTick: { spo2: 0.5 },
      durationTicks: 4,
    },
    repeatable: true,
    repeatCooldownTicks: 2,
  },

  {
    key: "needle_decompression",
    label: "Needle Thoracostomy",
    shortLabel: "Needle Decomp",
    category: "respiratory",
    description: "Emergency needle decompression for tension pneumothorax. 2nd ICS, midclavicular line.",
    indicatedFor: ["tension_pneumothorax"],
    contraindicatedFor: [],
    effect: {
      immediateDeltas: { spo2: 12, systolicBP: 16, heartRate: -20, peakInspiratoryPressure: -20, lungCompliance: 18, cvp: -6, map: 12, respiratoryRate: -8 },
      sustainedDeltasPerTick: { spo2: 3, systolicBP: 4, heartRate: -4, lungCompliance: 5 },
      durationTicks: 4,
      stageRollback: true,
    },
    repeatable: false,
  },

  // ── Antiarrhythmic ──────────────────────────────────────────────────────────

  {
    key: "amiodarone",
    label: "Amiodarone 150 mg IV",
    shortLabel: "Amiodarone",
    category: "antiarrhythmic",
    description: "Antiarrhythmic for VT, VF, and rate control in AFib. Class III mechanism.",
    indicatedFor: ["afib_rvr", "vt_to_vf", "stemi"],
    contraindicatedFor: [],
    effect: {
      immediateDeltas: { heartRate: -12, systolicBP: -4 },
      sustainedDeltasPerTick: { heartRate: -3 },
      durationTicks: 5,
      rhythmChange: "atrial_fibrillation",
    },
    repeatable: false,
  },

  {
    key: "adenosine",
    label: "Adenosine 6 mg rapid IV push",
    shortLabel: "Adenosine",
    category: "antiarrhythmic",
    description: "Terminates re-entrant SVT by transiently blocking the AV node. Must be given as rapid IV push.",
    indicatedFor: ["svt"],
    contraindicatedFor: [],
    effect: {
      immediateDeltas: { heartRate: -100, systolicBP: 12, spo2: 4 },
      sustainedDeltasPerTick: { heartRate: 2 },
      durationTicks: 1,
      rhythmChange: "normal_sinus_rhythm",
      ecgFeaturesSet: {},
      stageRollback: true,
    },
    repeatable: true,
    repeatCooldownTicks: 2,
  },

  {
    key: "synchronized_cardioversion",
    label: "Synchronized Cardioversion 200J",
    shortLabel: "Cardioversion",
    category: "antiarrhythmic",
    description: "Synchronized DC cardioversion for hemodynamically unstable AFib, flutter, or SVT.",
    indicatedFor: ["afib_rvr", "svt", "stemi"],
    contraindicatedFor: [],
    effect: {
      immediateDeltas: { heartRate: -60, systolicBP: 18, spo2: 4 },
      sustainedDeltasPerTick: { systolicBP: 2 },
      durationTicks: 3,
      rhythmChange: "normal_sinus_rhythm",
      ecgFeaturesSet: {},
      stageRollback: true,
    },
    repeatable: true,
    repeatCooldownTicks: 2,
  },

  {
    key: "defibrillation",
    label: "Defibrillation 200J (Unsynchronized)",
    shortLabel: "Defib",
    category: "resuscitation",
    description: "Unsynchronized defibrillation for VF or pulseless VT. Immediately followed by CPR.",
    indicatedFor: ["vt_to_vf", "stemi", "pulmonary_embolism"],
    contraindicatedFor: [],
    effect: {
      immediateDeltas: { heartRate: -80, systolicBP: 20 },
      sustainedDeltasPerTick: { heartRate: -3, systolicBP: 3 },
      durationTicks: 2,
      rhythmChange: "normal_sinus_rhythm",
      ecgFeaturesSet: {},
      stageRollback: true,
    },
    repeatable: true,
    repeatCooldownTicks: 1,
  },

  // ── Metabolic ────────────────────────────────────────────────────────────────

  {
    key: "insulin_glucose",
    label: "Insulin 10 units + Dextrose 50%",
    shortLabel: "Insulin + D50",
    category: "metabolic",
    description: "Drives potassium intracellularly. Temporizing measure for hyperkalemia ECG changes.",
    indicatedFor: ["hyperkalemia", "dka"],
    contraindicatedFor: [],
    effect: {
      immediateDeltas: { potassium: -1.0, heartRate: 6, glucose: -80 },
      sustainedDeltasPerTick: { potassium: -0.3, heartRate: -2 },
      durationTicks: 4,
      rhythmChange: "normal_sinus_rhythm",
      ecgFeaturesSet: { peakedT: false, widenedQrs: false },
      stageRollback: true,
    },
    repeatable: false,
  },

  {
    key: "calcium_gluconate",
    label: "Calcium Gluconate 2 g IV",
    shortLabel: "Calcium",
    category: "metabolic",
    description: "Cardiac membrane stabilization for hyperkalemia. Does not reduce serum potassium.",
    indicatedFor: ["hyperkalemia"],
    contraindicatedFor: [],
    effect: {
      immediateDeltas: { heartRate: 4 },
      sustainedDeltasPerTick: {},
      durationTicks: 3,
      ecgFeaturesSet: { widenedQrs: false },
    },
    repeatable: false,
  },

  {
    key: "furosemide",
    label: "Furosemide 80 mg IV",
    shortLabel: "Furosemide",
    category: "metabolic",
    description: "Loop diuretic for acute decompensated heart failure. Reduces preload and pulmonary congestion.",
    indicatedFor: ["heart_failure", "ards"],
    contraindicatedFor: ["gi_bleed", "dka", "sepsis"],
    effect: {
      immediateDeltas: { urineOutputPerHour: 60, cvp: -3 },
      sustainedDeltasPerTick: { spo2: 1.5, respiratoryRate: -1.5, heartRate: -2, urineOutputPerHour: 15 },
      durationTicks: 5,
      stageRollback: true,
    },
    repeatable: false,
  },

  // ── Neurologic ───────────────────────────────────────────────────────────────

  {
    key: "mannitol",
    label: "Mannitol 1 g/kg IV",
    shortLabel: "Mannitol",
    category: "neurologic",
    description: "Osmotic agent to reduce ICP through plasma osmolality gradient.",
    indicatedFor: ["increased_icp"],
    contraindicatedFor: [],
    effect: {
      immediateDeltas: { icp: -6, gcs: 1.5 },
      sustainedDeltasPerTick: { icp: -1.5, urineOutputPerHour: 20 },
      durationTicks: 4,
      stageRollback: true,
    },
    repeatable: false,
  },

  // ── Resuscitation ────────────────────────────────────────────────────────────

  {
    key: "cpr",
    label: "CPR — High-quality compressions",
    shortLabel: "CPR",
    category: "resuscitation",
    description: "High-quality chest compressions at 100–120/min with minimal interruptions.",
    indicatedFor: ["vt_to_vf", "stemi", "pulmonary_embolism", "tension_pneumothorax", "anaphylaxis", "cardiac_tamponade"],
    contraindicatedFor: [],
    effect: {
      immediateDeltas: { systolicBP: 28, map: 18, heartRate: 100, spo2: 6 },
      sustainedDeltasPerTick: { spo2: 1, lactate: -0.2, urineOutputPerHour: 5 },
      durationTicks: 6,
    },
    repeatable: true,
    repeatCooldownTicks: 1,
  },

  {
    key: "pericardiocentesis",
    label: "Pericardiocentesis",
    shortLabel: "Pericard.",
    category: "hemodynamic",
    description: "Needle drainage of pericardial effusion. Immediate relief of tamponade physiology.",
    indicatedFor: ["cardiac_tamponade"],
    contraindicatedFor: [],
    effect: {
      immediateDeltas: { heartRate: -22, systolicBP: 25, diastolicBP: -8, map: 14, cvp: -8, cardiacOutput: 1.5, spo2: 5 },
      sustainedDeltasPerTick: { heartRate: -3, systolicBP: 3, cvp: -1.5 },
      durationTicks: 4,
      stageRollback: true,
    },
    repeatable: false,
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getIntervention(key: string): Intervention | null {
  return INTERVENTION_CATALOG.find((i) => i.key === key) ?? null;
}

export function getInterventionsForCondition(conditionKey: string): Intervention[] {
  return INTERVENTION_CATALOG.filter((i) => i.indicatedFor.includes(conditionKey));
}
