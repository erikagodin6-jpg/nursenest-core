/**
 * Deterioration Patterns
 *
 * Each condition is modeled as a staged progression. Every tick the engine
 * applies the current stage's deltas to PhysiologyState. Stage advances
 * automatically when ticksInCurrentStage reaches stageTickDuration, or can
 * be accelerated by withheld treatment.
 *
 * Tick rate is configurable in the engine (default: 1 tick = 30 sim-seconds).
 * A stageTickDuration of 4 means the condition worsens after ~2 sim-minutes.
 */

import type { ConditionStage, EcgFeatureFlags, PhysiologyState } from "./physiology-state";

// ─── Types ────────────────────────────────────────────────────────────────────

export type VitalDelta = Partial<Record<keyof PhysiologyState, number>>;

export interface ConditionStageDefinition {
  /** How many ticks this stage persists before auto-advancing (if untreated). */
  durationTicks: number;
  /** Per-tick deltas applied to PhysiologyState numerics. */
  vitalDeltas: VitalDelta;
  /** ECG rhythm key active during this stage. */
  ecgRhythmKey: string;
  /** ECG feature flags for this stage. */
  ecgFeatures: EcgFeatureFlags;
  /** QRS width in seconds for this stage. */
  ecgQrsWidth: number;
  /** Educational explanation for this stage. */
  explanation: string;
}

export interface DeteriorationPattern {
  key: string;
  label: string;
  category: string;
  description: string;
  /** Starting state overrides applied when the condition is initialized. */
  initialOverrides: Partial<Pick<PhysiologyState,
    "heartRate" | "systolicBP" | "diastolicBP" | "map" |
    "respiratoryRate" | "spo2" | "etco2" | "temperature" |
    "cvp" | "cardiacOutput" | "lactate" | "potassium" | "glucose" |
    "urineOutputPerHour" | "gcs" | "icp" | "painScore" |
    "isVentilated" | "peep" | "tidalVolume" | "peakInspiratoryPressure" |
    "plateauPressure" | "lungCompliance" | "airwayResistance" |
    "ecgRhythmKey" | "ecgQrsWidth" | "ecgFeatures" | "fio2"
  >>;
  stages: Record<ConditionStage, ConditionStageDefinition>;
  /** Clinical tags for filtering / search. */
  tags: string[];
}

// ─── Patterns ─────────────────────────────────────────────────────────────────

export const DETERIORATION_PATTERNS: DeteriorationPattern[] = [

  // ── 1. Sepsis / Septic Shock ────────────────────────────────────────────────
  {
    key: "sepsis",
    label: "Sepsis",
    category: "infectious",
    description: "Systemic infection progressing to septic shock with distributive hemodynamic failure.",
    initialOverrides: {
      heartRate: 106, systolicBP: 108, diastolicBP: 60, map: 76,
      respiratoryRate: 22, spo2: 96, temperature: 38.9,
      lactate: 2.8, urineOutputPerHour: 38, cvp: 4,
      ecgRhythmKey: "sinus_tachycardia",
    },
    stages: {
      early: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 2, systolicBP: -2, diastolicBP: -1, respiratoryRate: 1, temperature: 0.15, lactate: 0.2, urineOutputPerHour: -2 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.08,
        explanation: "Heart rate rising and blood pressure falling — early vasodilation from systemic inflammatory response.",
      },
      developing: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 3, systolicBP: -4, diastolicBP: -2, respiratoryRate: 2, spo2: -0.8, map: -2, lactate: 0.5, urineOutputPerHour: -4, cvp: -1 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.08,
        explanation: "Worsening sepsis: falling MAP reflects progressive vasodilation and myocardial depression. Lactate rising signals tissue hypoperfusion.",
      },
      severe: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 4, systolicBP: -5, diastolicBP: -3, respiratoryRate: 2.5, spo2: -1.5, map: -3, lactate: 0.8, urineOutputPerHour: -5, gcs: -0.5, cardiacOutput: -0.3 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Severe sepsis: organ perfusion critically compromised. Falling GCS indicates cerebral hypoperfusion. Worsening hypoxemia from sepsis-associated ARDS.",
      },
      critical: {
        durationTicks: 6,
        vitalDeltas: { heartRate: 3, systolicBP: -4, diastolicBP: -2, respiratoryRate: 1.5, spo2: -1, map: -2.5, lactate: 0.5, urineOutputPerHour: -3, gcs: -0.5, cardiacOutput: -0.2 },
        ecgRhythmKey: "atrial_fibrillation",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Septic shock: vasopressor-dependent. New atrial fibrillation from myocardial inflammatory stress. Anuria developing — multiorgan failure imminent.",
      },
    },
    tags: ["sepsis", "infection", "shock", "icu", "emergency"],
  },

  // ── 2. STEMI ────────────────────────────────────────────────────────────────
  {
    key: "stemi",
    label: "Anterior STEMI",
    category: "cardiac",
    description: "Acute ST-elevation myocardial infarction with progressive cardiogenic hemodynamic deterioration.",
    initialOverrides: {
      heartRate: 88, systolicBP: 128, diastolicBP: 78, map: 95,
      respiratoryRate: 18, spo2: 97, painScore: 8,
      ecgRhythmKey: "stemi_pattern",
      ecgFeatures: { stElevation: true },
      ecgQrsWidth: 0.08,
    },
    stages: {
      early: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 2, systolicBP: -2, respiratoryRate: 1, painScore: 0.3, spo2: -0.3 },
        ecgRhythmKey: "stemi_pattern",
        ecgFeatures: { stElevation: true },
        ecgQrsWidth: 0.09,
        explanation: "ST elevation reflects transmural ischemia. Compensatory tachycardia from pain and catecholamine release.",
      },
      developing: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 2, systolicBP: -4, diastolicBP: -2, map: -3, respiratoryRate: 1.5, spo2: -0.8, cardiacOutput: -0.2 },
        ecgRhythmKey: "stemi_pattern",
        ecgFeatures: { stElevation: true, widenedQrs: true },
        ecgQrsWidth: 0.11,
        explanation: "Expanding infarct zone: cardiac output falling. QRS widening from conduction delay through ischemic myocardium.",
      },
      severe: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 3, systolicBP: -5, diastolicBP: -3, map: -4, spo2: -1.5, respiratoryRate: 2, cardiacOutput: -0.3, urineOutputPerHour: -5 },
        ecgRhythmKey: "ventricular_tachycardia",
        ecgFeatures: { avDissociation: true },
        ecgQrsWidth: 0.16,
        explanation: "Cardiogenic shock: ventricular tachycardia from ischemic irritability. Pulmonary edema driving SpO₂ decline.",
      },
      critical: {
        durationTicks: 6,
        vitalDeltas: { heartRate: 2, systolicBP: -3, map: -2, spo2: -1, cardiacOutput: -0.2, urineOutputPerHour: -4 },
        ecgRhythmKey: "ventricular_fibrillation",
        ecgFeatures: {},
        ecgQrsWidth: 0.0,
        explanation: "Ventricular fibrillation — cardiac arrest. Immediate defibrillation required. Cardiogenic shock leading to terminal arrhythmia.",
      },
    },
    tags: ["stemi", "acs", "cardiac", "arrhythmia", "emergency", "acls"],
  },

  // ── 3. Atrial Fibrillation with RVR ─────────────────────────────────────────
  {
    key: "afib_rvr",
    label: "Atrial Fibrillation with RVR",
    category: "cardiac",
    description: "Atrial fibrillation with rapid ventricular response causing hemodynamic compromise.",
    initialOverrides: {
      heartRate: 148, systolicBP: 108, diastolicBP: 65, map: 79,
      respiratoryRate: 20, spo2: 95,
      ecgRhythmKey: "atrial_fibrillation",
      ecgFeatures: {},
      ecgQrsWidth: 0.09,
    },
    stages: {
      early: {
        durationTicks: 5,
        vitalDeltas: { heartRate: 1.5, systolicBP: -1.5, spo2: -0.3, respiratoryRate: 0.5 },
        ecgRhythmKey: "atrial_fibrillation",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Irregularly irregular rhythm with loss of atrial kick reduces cardiac output. Ventricular rate > 150 impairs diastolic filling.",
      },
      developing: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 2, systolicBP: -2.5, diastolicBP: -1.5, spo2: -0.5, respiratoryRate: 1, cardiacOutput: -0.15 },
        ecgRhythmKey: "atrial_fibrillation",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Sustained RVR: tachycardia-induced cardiomyopathy developing. Falling BP from reduced CO.",
      },
      severe: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 1.5, systolicBP: -3, spo2: -1, respiratoryRate: 1.5, cardiacOutput: -0.2, urineOutputPerHour: -3 },
        ecgRhythmKey: "atrial_fibrillation",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Hemodynamically unstable AFib. Pulmonary congestion worsening. Consider electrical cardioversion if hemodynamics deteriorate further.",
      },
      critical: {
        durationTicks: 5,
        vitalDeltas: { heartRate: 2, systolicBP: -4, spo2: -1.5, respiratoryRate: 2, cardiacOutput: -0.25, urineOutputPerHour: -5, gcs: -0.3 },
        ecgRhythmKey: "atrial_fibrillation",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Critical hemodynamic instability from uncontrolled AFib. Emergent rate control or cardioversion required.",
      },
    },
    tags: ["afib", "arrhythmia", "cardiac", "telemetry"],
  },

  // ── 4. SVT ──────────────────────────────────────────────────────────────────
  {
    key: "svt",
    label: "Supraventricular Tachycardia",
    category: "cardiac",
    description: "Sudden-onset narrow-complex tachycardia at 180–220 bpm with rapid hemodynamic compromise.",
    initialOverrides: {
      heartRate: 196, systolicBP: 95, diastolicBP: 58, map: 70,
      respiratoryRate: 24, spo2: 94,
      ecgRhythmKey: "svt",
      ecgFeatures: {},
      ecgQrsWidth: 0.07,
    },
    stages: {
      early: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 1, systolicBP: -2, spo2: -0.5, respiratoryRate: 1 },
        ecgRhythmKey: "svt",
        ecgFeatures: {},
        ecgQrsWidth: 0.07,
        explanation: "SVT at 196 bpm: extremely short diastolic filling time reduces stroke volume. Palpitations, dizziness, and near-syncope.",
      },
      developing: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 1.5, systolicBP: -3, spo2: -1, respiratoryRate: 1.5, cardiacOutput: -0.2 },
        ecgRhythmKey: "svt",
        ecgFeatures: {},
        ecgQrsWidth: 0.07,
        explanation: "Ongoing SVT reducing cerebral perfusion. Presyncope from hypotension.",
      },
      severe: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 2, systolicBP: -4, spo2: -1.5, respiratoryRate: 2, gcs: -0.5, cardiacOutput: -0.3 },
        ecgRhythmKey: "svt",
        ecgFeatures: {},
        ecgQrsWidth: 0.07,
        explanation: "Hemodynamically unstable SVT. Altered consciousness from cerebral hypoperfusion. Synchronized cardioversion indicated.",
      },
      critical: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 1.5, systolicBP: -3, spo2: -1, gcs: -0.5, cardiacOutput: -0.2 },
        ecgRhythmKey: "ventricular_tachycardia",
        ecgFeatures: { avDissociation: true },
        ecgQrsWidth: 0.14,
        explanation: "Degeneration to ventricular tachycardia. Pulseless state imminent without immediate intervention.",
      },
    },
    tags: ["svt", "tachycardia", "arrhythmia", "cardiac", "emergency", "acls"],
  },

  // ── 5. Ventricular Tachycardia → VF ─────────────────────────────────────────
  {
    key: "vt_to_vf",
    label: "Ventricular Tachycardia → VF",
    category: "cardiac",
    description: "Monomorphic VT degenerating to ventricular fibrillation and cardiac arrest.",
    initialOverrides: {
      heartRate: 175, systolicBP: 82, diastolicBP: 45, map: 57,
      respiratoryRate: 26, spo2: 90, gcs: 12,
      ecgRhythmKey: "ventricular_tachycardia",
      ecgFeatures: { avDissociation: true },
      ecgQrsWidth: 0.17,
    },
    stages: {
      early: {
        durationTicks: 2,
        vitalDeltas: { heartRate: 2, systolicBP: -3, spo2: -1, respiratoryRate: 1.5, gcs: -0.5 },
        ecgRhythmKey: "ventricular_tachycardia",
        ecgFeatures: { avDissociation: true },
        ecgQrsWidth: 0.17,
        explanation: "Monomorphic VT: wide-complex rapid rhythm. BP falling from loss of organized ventricular contraction.",
      },
      developing: {
        durationTicks: 2,
        vitalDeltas: { heartRate: 3, systolicBP: -5, spo2: -2, gcs: -1, cardiacOutput: -0.5, urineOutputPerHour: -8 },
        ecgRhythmKey: "ventricular_tachycardia",
        ecgFeatures: { avDissociation: true, polymorphicTwisting: false },
        ecgQrsWidth: 0.18,
        explanation: "Pulseless VT: no effective cardiac output. Immediate defibrillation and CPR required.",
      },
      severe: {
        durationTicks: 2,
        vitalDeltas: { systolicBP: -6, spo2: -3, gcs: -2, cardiacOutput: -0.5 },
        ecgRhythmKey: "ventricular_fibrillation",
        ecgFeatures: {},
        ecgQrsWidth: 0.0,
        explanation: "Ventricular fibrillation: chaotic depolarization, no cardiac output. ACLS required — defibrillate 200J, initiate CPR.",
      },
      critical: {
        durationTicks: 6,
        vitalDeltas: { spo2: -2, gcs: -1 },
        ecgRhythmKey: "asystole",
        ecgFeatures: {},
        ecgQrsWidth: 0.0,
        explanation: "Asystole following untreated VF. Irreversible anoxic brain injury begins at 4–6 minutes without CPR.",
      },
    },
    tags: ["vt", "vf", "arrest", "acls", "defibrillation", "emergency", "icu"],
  },

  // ── 6. Pulmonary Embolism ───────────────────────────────────────────────────
  {
    key: "pulmonary_embolism",
    label: "Pulmonary Embolism",
    category: "pulmonary",
    description: "Massive pulmonary embolism with obstructive shock and right ventricular failure.",
    initialOverrides: {
      heartRate: 118, systolicBP: 104, diastolicBP: 65, map: 78,
      respiratoryRate: 28, spo2: 88, etco2: 22,
      cvp: 14, cardiacOutput: 3.2,
      ecgRhythmKey: "sinus_tachycardia",
      ecgFeatures: {},
      ecgQrsWidth: 0.09,
    },
    stages: {
      early: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 3, systolicBP: -3, spo2: -1.5, respiratoryRate: 2, etco2: -1, cvp: 1 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "PE obstructing pulmonary vasculature: rising RV afterload. Tachycardia and hypoxemia despite supplemental O₂.",
      },
      developing: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 3, systolicBP: -4, diastolicBP: -2, spo2: -2, respiratoryRate: 2, etco2: -1.5, cvp: 1.5, cardiacOutput: -0.3 },
        ecgRhythmKey: "right_bundle_branch_block",
        ecgFeatures: { rsrPrime: true },
        ecgQrsWidth: 0.13,
        explanation: "New RBBB from RV strain as the right heart dilates under pressure load. EtCO₂ falls as dead space increases.",
      },
      severe: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 3, systolicBP: -5, diastolicBP: -3, spo2: -2, map: -4, cvp: 1.5, cardiacOutput: -0.4, urineOutputPerHour: -6, gcs: -0.5 },
        ecgRhythmKey: "right_bundle_branch_block",
        ecgFeatures: { rsrPrime: true, stDepression: true },
        ecgQrsWidth: 0.14,
        explanation: "Obstructive shock: RV failing against massively elevated pulmonary pressures. Systemic perfusion collapsing.",
      },
      critical: {
        durationTicks: 5,
        vitalDeltas: { heartRate: 2, systolicBP: -4, spo2: -1.5, map: -3, cardiacOutput: -0.3, gcs: -0.5, urineOutputPerHour: -5 },
        ecgRhythmKey: "pea",
        ecgFeatures: { hasOrganizedQrs: true },
        ecgQrsWidth: 0.14,
        explanation: "PEA arrest from massive PE. Systemic thrombolysis or surgical embolectomy is the only definitive treatment.",
      },
    },
    tags: ["pe", "pulmonary", "embolism", "shock", "obstructive", "emergency"],
  },

  // ── 7. ARDS ─────────────────────────────────────────────────────────────────
  {
    key: "ards",
    label: "ARDS",
    category: "pulmonary",
    description: "Acute respiratory distress syndrome with progressive hypoxemia refractory to increasing oxygen.",
    initialOverrides: {
      heartRate: 110, systolicBP: 118, diastolicBP: 70, map: 86,
      respiratoryRate: 30, spo2: 88, etco2: 30, fio2: 0.6,
      isVentilated: true,
      tidalVolume: 420, peep: 10, peakInspiratoryPressure: 32,
      plateauPressure: 28, lungCompliance: 28, airwayResistance: 12,
      ecgRhythmKey: "sinus_tachycardia",
      ecgFeatures: {},
      ecgQrsWidth: 0.09,
    },
    stages: {
      early: {
        durationTicks: 4,
        vitalDeltas: { spo2: -1, respiratoryRate: 1.5, peakInspiratoryPressure: 1.5, lungCompliance: -2, heartRate: 2 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Increasing ventilator pressures needed as alveolar flooding progresses. SpO₂ falling despite rising FiO₂.",
      },
      developing: {
        durationTicks: 4,
        vitalDeltas: { spo2: -1.5, respiratoryRate: 1, peakInspiratoryPressure: 2, plateauPressure: 1.5, lungCompliance: -3, heartRate: 2, cardiacOutput: -0.2 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Worsening lung compliance. Plateau pressure rising — lung-protective strategy essential (TV 4–6 mL/kg IBW). Consider prone positioning.",
      },
      severe: {
        durationTicks: 4,
        vitalDeltas: { spo2: -2, peakInspiratoryPressure: 2.5, plateauPressure: 2, lungCompliance: -3, heartRate: 2, cardiacOutput: -0.25, urineOutputPerHour: -4 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Severe ARDS (PaO₂/FiO₂ < 100). PEEP titration required. ECMO consultation indicated if conventional ventilation fails.",
      },
      critical: {
        durationTicks: 5,
        vitalDeltas: { spo2: -1.5, peakInspiratoryPressure: 1.5, heartRate: 1.5, cardiacOutput: -0.2, urineOutputPerHour: -3, gcs: -0.5 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Critical ARDS: SpO₂ < 80% despite maximal FiO₂. Multiorgan dysfunction. ECMO may be last available intervention.",
      },
    },
    tags: ["ards", "respiratory", "ventilator", "icu", "rt"],
  },

  // ── 8. Hyperkalemia ─────────────────────────────────────────────────────────
  {
    key: "hyperkalemia",
    label: "Hyperkalemia",
    category: "electrolyte",
    description: "Progressive hyperkalemia with sequential ECG changes from peaked T-waves to cardiac arrest.",
    initialOverrides: {
      heartRate: 68, systolicBP: 118, diastolicBP: 72, map: 87,
      respiratoryRate: 16, spo2: 97, potassium: 5.8,
      ecgRhythmKey: "normal_sinus_rhythm",
      ecgFeatures: { peakedT: true },
      ecgQrsWidth: 0.09,
    },
    stages: {
      early: {
        durationTicks: 4,
        vitalDeltas: { heartRate: -1, potassium: 0.3 },
        ecgRhythmKey: "hyperkalemia_pattern",
        ecgFeatures: { peakedT: true },
        ecgQrsWidth: 0.10,
        explanation: "K⁺ 5.8–6.4: peaked, narrow-based T-waves as first ECG sign. Mild bradycardia from slowed conduction.",
      },
      developing: {
        durationTicks: 3,
        vitalDeltas: { heartRate: -2, systolicBP: -2, potassium: 0.4 },
        ecgRhythmKey: "hyperkalemia_pattern",
        ecgFeatures: { peakedT: true, widenedQrs: true },
        ecgQrsWidth: 0.14,
        explanation: "K⁺ 6.5–7.2: QRS widening from slowed intraventricular conduction. PR interval prolonging. Calcium gluconate indicated immediately.",
      },
      severe: {
        durationTicks: 3,
        vitalDeltas: { heartRate: -3, systolicBP: -4, potassium: 0.4 },
        ecgRhythmKey: "sinus_bradycardia",
        ecgFeatures: { peakedT: true, widenedQrs: true },
        ecgQrsWidth: 0.18,
        explanation: "K⁺ 7.2–8.0: Extreme QRS widening approaching sine-wave pattern. Severe bradycardia. Emergent insulin/glucose + calcium required.",
      },
      critical: {
        durationTicks: 4,
        vitalDeltas: { heartRate: -4, systolicBP: -5, potassium: 0.3 },
        ecgRhythmKey: "pea",
        ecgFeatures: { widenedQrs: true },
        ecgQrsWidth: 0.22,
        explanation: "K⁺ > 8.0: sine-wave QRS, PEA, then VF/asystole. Hemodialysis is definitive treatment. Temporize with calcium, insulin, bicarbonate.",
      },
    },
    tags: ["hyperkalemia", "electrolyte", "renal", "ecg", "emergency"],
  },

  // ── 9. DKA ──────────────────────────────────────────────────────────────────
  {
    key: "dka",
    label: "Diabetic Ketoacidosis",
    category: "metabolic",
    description: "DKA with profound dehydration, Kussmaul breathing, and metabolic acidosis.",
    initialOverrides: {
      heartRate: 112, systolicBP: 102, diastolicBP: 60, map: 74,
      respiratoryRate: 28, spo2: 97, temperature: 37.6,
      glucose: 520, lactate: 3.2, potassium: 5.2,
      urineOutputPerHour: 25, etco2: 20,
      ecgRhythmKey: "sinus_tachycardia",
      ecgFeatures: { peakedT: true },
      ecgQrsWidth: 0.09,
    },
    stages: {
      early: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 2, systolicBP: -3, diastolicBP: -2, respiratoryRate: 1.5, glucose: 15, lactate: 0.3, etco2: -1.5, potassium: 0.1, urineOutputPerHour: -3 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: { peakedT: true },
        ecgQrsWidth: 0.09,
        explanation: "Kussmaul breathing: deep rapid respirations compensating for metabolic acidosis. Osmotic diuresis causing dehydration and tachycardia.",
      },
      developing: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 3, systolicBP: -4, diastolicBP: -2, respiratoryRate: 2, glucose: 10, lactate: 0.4, etco2: -2, potassium: 0.2, urineOutputPerHour: -4, gcs: -0.5 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: { peakedT: true },
        ecgQrsWidth: 0.10,
        explanation: "Worsening DKA: profound hypovolemia from glucosuria and osmotic diuresis. Pseudo-hyperkalemia from transcellular shift — true K⁺ is depleted.",
      },
      severe: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 3, systolicBP: -5, diastolicBP: -3, respiratoryRate: 1, glucose: 8, lactate: 0.5, etco2: -1, potassium: 0.3, urineOutputPerHour: -5, gcs: -0.8 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: { peakedT: true, widenedQrs: true },
        ecgQrsWidth: 0.12,
        explanation: "Severe DKA: altered consciousness from hyperosmolarity. Hyperkalemia causing ECG changes. Aggressive fluid resuscitation with insulin required.",
      },
      critical: {
        durationTicks: 5,
        vitalDeltas: { heartRate: 2, systolicBP: -4, diastolicBP: -2, respiratoryRate: 0.5, gcs: -1, potassium: 0.2, urineOutputPerHour: -4 },
        ecgRhythmKey: "hyperkalemia_pattern",
        ecgFeatures: { peakedT: true, widenedQrs: true },
        ecgQrsWidth: 0.16,
        explanation: "Critical DKA: cerebral edema risk with aggressive fluid resuscitation. Cardiac arrest from severe hyperkalemia and acidosis.",
      },
    },
    tags: ["dka", "diabetes", "metabolic", "electrolyte", "emergency"],
  },

  // ── 10. Anaphylaxis ─────────────────────────────────────────────────────────
  {
    key: "anaphylaxis",
    label: "Anaphylaxis",
    category: "immunologic",
    description: "Severe anaphylaxis with rapid distributive shock and bronchospasm.",
    initialOverrides: {
      heartRate: 138, systolicBP: 78, diastolicBP: 40, map: 53,
      respiratoryRate: 32, spo2: 87, temperature: 37.2,
      etco2: 55, airwayResistance: 25,
      ecgRhythmKey: "sinus_tachycardia",
      ecgFeatures: {},
      ecgQrsWidth: 0.08,
    },
    stages: {
      early: {
        durationTicks: 2,
        vitalDeltas: { heartRate: 5, systolicBP: -6, diastolicBP: -3, spo2: -2, respiratoryRate: 2, airwayResistance: 3, etco2: 2 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.08,
        explanation: "Massive histamine release: vasodilation collapsing blood pressure. Bronchospasm worsening oxygen saturation. IM epinephrine required immediately.",
      },
      developing: {
        durationTicks: 2,
        vitalDeltas: { heartRate: 6, systolicBP: -8, diastolicBP: -5, spo2: -3, respiratoryRate: 2, airwayResistance: 4, map: -5 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.08,
        explanation: "Progressive anaphylactic shock. Epinephrine 0.3–0.5 mg IM to right lateral thigh is first-line. Every minute of delay worsens outcome.",
      },
      severe: {
        durationTicks: 2,
        vitalDeltas: { heartRate: 5, systolicBP: -8, spo2: -3, respiratoryRate: 1.5, gcs: -1, map: -5 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Impending airway loss and cardiac arrest. Intubation if stridor present. IV epinephrine if unresponsive to IM. Adjuncts: diphenhydramine, IV fluids, corticosteroids.",
      },
      critical: {
        durationTicks: 3,
        vitalDeltas: { systolicBP: -6, spo2: -2, gcs: -1, heartRate: 3 },
        ecgRhythmKey: "pea",
        ecgFeatures: { hasOrganizedQrs: true },
        ecgQrsWidth: 0.12,
        explanation: "PEA arrest from anaphylactic shock. High-dose epinephrine infusion. Vasopressin as second-line vasopressor.",
      },
    },
    tags: ["anaphylaxis", "allergy", "shock", "distributive", "emergency", "airway"],
  },

  // ── 11. Increased ICP / Herniation ──────────────────────────────────────────
  {
    key: "increased_icp",
    label: "Increased ICP / Herniation",
    category: "neurologic",
    description: "Progressive intracranial hypertension evolving to herniation with Cushing's triad.",
    initialOverrides: {
      heartRate: 58, systolicBP: 168, diastolicBP: 92, map: 117,
      respiratoryRate: 14, spo2: 96, gcs: 11,
      icp: 24, cvp: 8,
      ecgRhythmKey: "sinus_bradycardia",
      ecgFeatures: {},
      ecgQrsWidth: 0.09,
    },
    stages: {
      early: {
        durationTicks: 4,
        vitalDeltas: { heartRate: -1.5, systolicBP: 3, gcs: -0.8, icp: 2 },
        ecgRhythmKey: "sinus_bradycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Rising ICP: Cushing's reflex causes hypertension and reflex bradycardia. Head-of-bed elevation to 30°, mannitol, and neurosurgery consult.",
      },
      developing: {
        durationTicks: 4,
        vitalDeltas: { heartRate: -2, systolicBP: 4, diastolicBP: 2, gcs: -1, icp: 3, spo2: -0.5, respiratoryRate: -1 },
        ecgRhythmKey: "sinus_bradycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Progressive herniation: GCS falling rapidly. Ipsilateral fixed dilated pupil. Hypertonic saline or mannitol to reduce ICP urgently.",
      },
      severe: {
        durationTicks: 3,
        vitalDeltas: { heartRate: -2.5, systolicBP: 5, gcs: -1.5, icp: 4, respiratoryRate: -1.5, spo2: -1 },
        ecgRhythmKey: "sinus_bradycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Uncal herniation: bilateral fixed dilated pupils, decerebrate posturing. Emergent neurosurgical decompression is only option.",
      },
      critical: {
        durationTicks: 4,
        vitalDeltas: { heartRate: -2, systolicBP: 3, gcs: -1, icp: 2, respiratoryRate: -2, spo2: -1.5 },
        ecgRhythmKey: "third_degree_av_block",
        ecgFeatures: { avDissociation: true },
        ecgQrsWidth: 0.16,
        explanation: "Brain death pattern: Cushing's triad complete. Brainstem herniation causing complete heart block from loss of vagal tone regulation.",
      },
    },
    tags: ["icp", "neurologic", "stroke", "herniation", "icu", "neuro"],
  },

  // ── 12. Cardiac Tamponade ───────────────────────────────────────────────────
  {
    key: "cardiac_tamponade",
    label: "Cardiac Tamponade",
    category: "cardiac",
    description: "Pericardial effusion with increasing tamponade physiology and obstructive shock.",
    initialOverrides: {
      heartRate: 124, systolicBP: 92, diastolicBP: 76, map: 81,
      respiratoryRate: 22, spo2: 94,
      cvp: 18, cardiacOutput: 2.8,
      ecgRhythmKey: "sinus_tachycardia",
      ecgFeatures: {},
      ecgQrsWidth: 0.07,
    },
    stages: {
      early: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 2, systolicBP: -2, diastolicBP: 1, cvp: 0.8, cardiacOutput: -0.15, spo2: -0.5 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.07,
        explanation: "Beck's triad developing: muffled heart sounds, rising JVP (CVP), hypotension. Narrow pulse pressure from constrained ventricular filling.",
      },
      developing: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 2.5, systolicBP: -3, diastolicBP: 1.5, cvp: 1, cardiacOutput: -0.2, spo2: -1, map: -2 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.06,
        explanation: "Electrical alternans: alternating QRS amplitude as the heart swings in the pericardial fluid. Emergent pericardiocentesis required.",
      },
      severe: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 3, systolicBP: -5, cvp: 1.5, cardiacOutput: -0.3, spo2: -1.5, map: -4, gcs: -0.5 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.06,
        explanation: "Critical tamponade: diastolic equalization of pressures. Right ventricular diastolic collapse. Urgent bedside pericardiocentesis.",
      },
      critical: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 2, systolicBP: -4, cvp: 1, cardiacOutput: -0.25, gcs: -0.8, urineOutputPerHour: -5 },
        ecgRhythmKey: "pea",
        ecgFeatures: { hasOrganizedQrs: true },
        ecgQrsWidth: 0.08,
        explanation: "PEA from tamponade: organized electrical activity, no pulse. Emergency pericardiocentesis is definitive. Start with US-guided approach.",
      },
    },
    tags: ["tamponade", "pericardial", "cardiac", "obstructive", "emergency"],
  },

  // ── 13. Tension Pneumothorax ─────────────────────────────────────────────────
  {
    key: "tension_pneumothorax",
    label: "Tension Pneumothorax",
    category: "pulmonary",
    description: "Progressive tension pneumothorax with mediastinal shift and obstructive shock.",
    initialOverrides: {
      heartRate: 128, systolicBP: 88, diastolicBP: 52, map: 64,
      respiratoryRate: 36, spo2: 82, etco2: 18,
      isVentilated: true, peakInspiratoryPressure: 48, plateauPressure: 42,
      lungCompliance: 12, airwayResistance: 20, cvp: 16,
      ecgRhythmKey: "sinus_tachycardia",
      ecgFeatures: {},
      ecgQrsWidth: 0.09,
    },
    stages: {
      early: {
        durationTicks: 2,
        vitalDeltas: { heartRate: 4, systolicBP: -4, spo2: -3, respiratoryRate: 2, peakInspiratoryPressure: 4, lungCompliance: -3, cvp: 2, map: -3 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Tension pneumothorax: positive-pressure air trapping compresses lung and shifts mediastinum. Vent alarm HIGH PRESSURE — absent breath sounds on affected side.",
      },
      developing: {
        durationTicks: 2,
        vitalDeltas: { heartRate: 5, systolicBP: -6, spo2: -4, peakInspiratoryPressure: 5, lungCompliance: -4, cvp: 2, map: -5, cardiacOutput: -0.5 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Mediastinal shift compressing contralateral lung and great vessels. Tracheal deviation AWAY from tension side. Needle decompression 2nd ICS MCL immediately.",
      },
      severe: {
        durationTicks: 2,
        vitalDeltas: { heartRate: 5, systolicBP: -8, spo2: -4, cvp: 2, cardiacOutput: -0.6, gcs: -1, urineOutputPerHour: -10 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.10,
        explanation: "Obstructive shock from tension PTX. Immediate needle thoracostomy then tube thoracostomy. Don't wait for CXR.",
      },
      critical: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 3, systolicBP: -6, spo2: -3, gcs: -1, cardiacOutput: -0.4 },
        ecgRhythmKey: "pea",
        ecgFeatures: { hasOrganizedQrs: true },
        ecgQrsWidth: 0.12,
        explanation: "PEA arrest from tension PTX: reversible cause — IMMEDIATE needle decompression followed by finger thoracostomy in arrest.",
      },
    },
    tags: ["pneumothorax", "tension", "pulmonary", "trauma", "obstructive", "emergency"],
  },

  // ── 14. Heart Failure Decompensation ────────────────────────────────────────
  {
    key: "heart_failure",
    label: "Acute Decompensated Heart Failure",
    category: "cardiac",
    description: "Acute-on-chronic heart failure with progressive pulmonary edema and respiratory failure.",
    initialOverrides: {
      heartRate: 102, systolicBP: 162, diastolicBP: 96, map: 118,
      respiratoryRate: 26, spo2: 90, etco2: 36,
      cvp: 16, cardiacOutput: 3.4, urineOutputPerHour: 22,
      ecgRhythmKey: "atrial_fibrillation",
      ecgFeatures: {},
      ecgQrsWidth: 0.09,
    },
    stages: {
      early: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 2, respiratoryRate: 2, spo2: -1.5, cvp: 1, cardiacOutput: -0.15, urineOutputPerHour: -2 },
        ecgRhythmKey: "atrial_fibrillation",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Pulmonary venous hypertension: bilateral crackles, worsening orthopnea. Sit upright, IV furosemide, oxygen supplementation.",
      },
      developing: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 2.5, respiratoryRate: 2.5, spo2: -2, cvp: 1.5, cardiacOutput: -0.2, urineOutputPerHour: -3, etco2: -1 },
        ecgRhythmKey: "atrial_fibrillation",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Worsening pulmonary edema: frothy pink-tinged sputum. BiPAP to reduce work of breathing and improve oxygenation.",
      },
      severe: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 2, respiratoryRate: 2, spo2: -2, cvp: 1.5, cardiacOutput: -0.25, urineOutputPerHour: -4, gcs: -0.5, systolicBP: -3 },
        ecgRhythmKey: "atrial_fibrillation",
        ecgFeatures: { stDepression: true },
        ecgQrsWidth: 0.10,
        explanation: "Cardiogenic flash pulmonary edema: intubation may be required. Vasodilators if SBP adequate. Inotropes if cardiogenic shock developing.",
      },
      critical: {
        durationTicks: 5,
        vitalDeltas: { heartRate: 1.5, respiratoryRate: 1, spo2: -1.5, cardiacOutput: -0.2, gcs: -0.5, systolicBP: -4, urineOutputPerHour: -4 },
        ecgRhythmKey: "atrial_fibrillation",
        ecgFeatures: { stDepression: true },
        ecgQrsWidth: 0.10,
        explanation: "Cardiogenic shock from decompensated HF. Mechanical circulatory support (IABP) or emergent cardiac transplant evaluation.",
      },
    },
    tags: ["heart-failure", "chf", "pulmonary-edema", "cardiac", "telemetry"],
  },

  // ── 15. GI Bleed / Hypovolemia ───────────────────────────────────────────────
  {
    key: "gi_bleed",
    label: "GI Bleed / Hypovolemia",
    category: "hemorrhagic",
    description: "Active upper GI hemorrhage with progressive hypovolemic shock.",
    initialOverrides: {
      heartRate: 108, systolicBP: 104, diastolicBP: 62, map: 76,
      respiratoryRate: 22, spo2: 96, lactate: 2.5,
      urineOutputPerHour: 28, cvp: 2,
      ecgRhythmKey: "sinus_tachycardia",
      ecgFeatures: {},
      ecgQrsWidth: 0.09,
    },
    stages: {
      early: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 3, systolicBP: -3, diastolicBP: -2, respiratoryRate: 1.5, lactate: 0.3, urineOutputPerHour: -4, cvp: -0.5 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Compensated hypovolemic shock: tachycardia maintains CO despite volume loss. 15–30% blood volume lost. Postural hypotension present.",
      },
      developing: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 4, systolicBP: -5, diastolicBP: -3, respiratoryRate: 2, lactate: 0.5, urineOutputPerHour: -5, cvp: -0.8, map: -4 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Progressive hemorrhage: 30–40% volume loss. Compensatory mechanisms overwhelmed. Aggressive fluid resuscitation and emergent endoscopy.",
      },
      severe: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 4, systolicBP: -6, diastolicBP: -3, spo2: -1, lactate: 0.7, urineOutputPerHour: -5, gcs: -0.5, map: -4, cvp: -0.5 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: { stDepression: true },
        ecgQrsWidth: 0.10,
        explanation: "Hemorrhagic shock: cardiac ischemia from demand exceeding supply. Massive transfusion protocol. Interventional endoscopy or surgery.",
      },
      critical: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 3, systolicBP: -5, spo2: -1.5, lactate: 0.6, gcs: -0.8, cardiacOutput: -0.3, urineOutputPerHour: -4 },
        ecgRhythmKey: "ventricular_tachycardia",
        ecgFeatures: { avDissociation: true },
        ecgQrsWidth: 0.16,
        explanation: "Irreversible hypovolemic shock with cardiac arrest. Traumatic coagulopathy and acidosis form the lethal triad with hypothermia.",
      },
    },
    tags: ["hemorrhage", "gi-bleed", "hypovolemia", "shock", "emergency"],
  },

  // ── 16. Opioid Toxicity ──────────────────────────────────────────────────────
  {
    key: "opioid_toxicity",
    label: "Opioid Toxicity / Respiratory Depression",
    category: "toxicology",
    description: "Progressive opioid-induced respiratory depression leading to hypoxic respiratory failure and arrest.",
    initialOverrides: {
      heartRate: 54, systolicBP: 98, diastolicBP: 58, map: 71,
      respiratoryRate: 8, spo2: 92, etco2: 56, gcs: 11,
      painScore: 1,
      ecgRhythmKey: "sinus_bradycardia",
      ecgFeatures: {},
      ecgQrsWidth: 0.09,
    },
    stages: {
      early: {
        durationTicks: 3,
        vitalDeltas: { respiratoryRate: -0.5, spo2: -1, etco2: 2, heartRate: -1, gcs: -0.5 },
        ecgRhythmKey: "sinus_bradycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Opioid toxicity: classic triad — pinpoint pupils, unconsciousness, respiratory depression. EtCO₂ rising = hypoventilation. Naloxone required.",
      },
      developing: {
        durationTicks: 3,
        vitalDeltas: { respiratoryRate: -1, spo2: -2, etco2: 3, heartRate: -1.5, gcs: -1, systolicBP: -3 },
        ecgRhythmKey: "sinus_bradycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Worsening hypercapnia: CO₂ narcosis potentiating opioid sedation. Airway positioning + jaw-thrust + naloxone 0.4 mg IV/IM.",
      },
      severe: {
        durationTicks: 3,
        vitalDeltas: { respiratoryRate: -1, spo2: -3, etco2: 3, gcs: -1.5, heartRate: -2, systolicBP: -4 },
        ecgRhythmKey: "sinus_bradycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.10,
        explanation: "Apneic episodes. Bag-valve-mask ventilation. Repeated naloxone doses (0.4 mg q2–3 min). Prepare for intubation.",
      },
      critical: {
        durationTicks: 5,
        vitalDeltas: { respiratoryRate: -0.5, spo2: -2, gcs: -1, heartRate: -2 },
        ecgRhythmKey: "asystole",
        ecgFeatures: {},
        ecgQrsWidth: 0.0,
        explanation: "Hypoxic cardiac arrest from untreated opioid toxicity. Naloxone infusion. ACLS. Anoxic brain injury risk.",
      },
    },
    tags: ["opioid-toxicity", "respiratory", "toxicology", "naloxone", "emergency"],
  },

  // ── 17. Ischemic Stroke ──────────────────────────────────────────────────────
  {
    key: "stroke",
    label: "Ischemic Stroke",
    category: "neurologic",
    description: "Acute ischemic stroke with evolving neurologic deficit and blood pressure dysregulation.",
    initialOverrides: {
      heartRate: 82, systolicBP: 184, diastolicBP: 102, map: 129,
      respiratoryRate: 18, spo2: 95, gcs: 12,
      icp: 12, temperature: 37.4,
      ecgRhythmKey: "atrial_fibrillation",
      ecgFeatures: {},
      ecgQrsWidth: 0.09,
    },
    stages: {
      early: {
        durationTicks: 4,
        vitalDeltas: { gcs: -0.5, systolicBP: 2, heartRate: 1, spo2: -0.5 },
        ecgRhythmKey: "atrial_fibrillation",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Stroke onset: FAST criteria (Face drooping, Arm weakness, Speech difficulty, Time to call). Permissive hypertension ≤ 220/120 if no tPA eligible.",
      },
      developing: {
        durationTicks: 4,
        vitalDeltas: { gcs: -1, systolicBP: 3, spo2: -1, icp: 1.5, respiratoryRate: 1 },
        ecgRhythmKey: "atrial_fibrillation",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Evolving infarct: penumbra at risk. tPA window 3–4.5 h from onset. CT head to exclude hemorrhage. Neurology stat.",
      },
      severe: {
        durationTicks: 4,
        vitalDeltas: { gcs: -1.5, systolicBP: 4, spo2: -1, icp: 2, respiratoryRate: 1.5 },
        ecgRhythmKey: "atrial_fibrillation",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Large vessel occlusion: consider mechanical thrombectomy up to 24 h. Worsening ICP from cytotoxic edema. Monitor swallow function.",
      },
      critical: {
        durationTicks: 5,
        vitalDeltas: { gcs: -1, systolicBP: 3, spo2: -1, icp: 2, respiratoryRate: -1 },
        ecgRhythmKey: "sinus_bradycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.10,
        explanation: "Malignant MCA infarct: massive cerebral edema, herniation risk. Hemicraniectomy in eligible patients < 60 y. Neurocritical care.",
      },
    },
    tags: ["stroke", "neurologic", "tpa", "afib", "emergency"],
  },

  // ── 18. RT: Auto-PEEP / Air Trapping ────────────────────────────────────────
  {
    key: "rt_auto_peep",
    label: "Auto-PEEP / Dynamic Hyperinflation",
    category: "rt",
    description: "Severe air trapping from COPD or asthma causing intrinsic PEEP, rising airway pressures, and hemodynamic compromise.",
    initialOverrides: {
      heartRate: 118, systolicBP: 108, diastolicBP: 65, map: 79,
      respiratoryRate: 28, spo2: 88, etco2: 58,
      isVentilated: true,
      tidalVolume: 520, peep: 5, peakInspiratoryPressure: 36,
      plateauPressure: 30, lungCompliance: 38, airwayResistance: 28,
      ecgRhythmKey: "sinus_tachycardia",
      ecgFeatures: {},
      ecgQrsWidth: 0.09,
    },
    stages: {
      early: {
        durationTicks: 3,
        vitalDeltas: { peakInspiratoryPressure: 2, airwayResistance: 2, spo2: -1, etco2: 2, heartRate: 2 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Auto-PEEP developing: expiratory flow not returning to zero. Reduce RR, increase I:E ratio, allow complete exhalation.",
      },
      developing: {
        durationTicks: 3,
        vitalDeltas: { peakInspiratoryPressure: 3, airwayResistance: 2, spo2: -2, etco2: 3, heartRate: 3, systolicBP: -3, cvp: 2 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Dynamic hyperinflation: increasing intrinsic PEEP compresses pulmonary vasculature. Reduce RR to 10–12. Consider apnoeic oxygenation pause.",
      },
      severe: {
        durationTicks: 3,
        vitalDeltas: { peakInspiratoryPressure: 3, spo2: -2, heartRate: 3, systolicBP: -5, map: -4, cvp: 2 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Tension from hyperinflation: haemodynamic compromise from obstructed venous return. Disconnect from ventilator briefly to decompress. Bronchodilators.",
      },
      critical: {
        durationTicks: 4,
        vitalDeltas: { heartRate: 3, systolicBP: -5, spo2: -2, map: -4, gcs: -0.5, cardiacOutput: -0.4 },
        ecgRhythmKey: "pea",
        ecgFeatures: { hasOrganizedQrs: true },
        ecgQrsWidth: 0.12,
        explanation: "PEA from tension hyperinflation: disconnect from ventilator, allow passive exhalation. ACLS if pulseless. Exclude pneumothorax.",
      },
    },
    tags: ["auto-peep", "copd", "asthma", "ventilator", "rt"],
  },

  // ── 19. RT: Mucus Plug / Airway Obstruction ───────────────────────────────────
  {
    key: "rt_mucus_plug",
    label: "Mucus Plug / Airway Obstruction",
    category: "rt",
    description: "Sudden airway obstruction from mucus plug in ventilated patient — high-pressure alarm and acute hypoxemia.",
    initialOverrides: {
      heartRate: 102, systolicBP: 122, diastolicBP: 74, map: 90,
      respiratoryRate: 16, spo2: 96,
      isVentilated: true,
      tidalVolume: 500, peep: 5, peakInspiratoryPressure: 22,
      plateauPressure: 18, lungCompliance: 58, airwayResistance: 10,
      ecgRhythmKey: "normal_sinus_rhythm",
      ecgFeatures: {},
      ecgQrsWidth: 0.08,
    },
    stages: {
      early: {
        durationTicks: 1,
        vitalDeltas: { peakInspiratoryPressure: 8, airwayResistance: 12, spo2: -4, heartRate: 8, tidalVolume: -80 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "HIGH PRESSURE ALARM: sudden PIP spike, reduced delivered TV. Unilateral absent breath sounds. Suction ETT immediately.",
      },
      developing: {
        durationTicks: 2,
        vitalDeltas: { peakInspiratoryPressure: 5, spo2: -5, heartRate: 8, tidalVolume: -60 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Partial obstruction: breath sounds unequal. Pass suction catheter — if resistance met, confirm mucus plug. Consider bronchoscopy.",
      },
      severe: {
        durationTicks: 2,
        vitalDeltas: { peakInspiratoryPressure: 8, spo2: -8, heartRate: 10, systolicBP: -8, tidalVolume: -100 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Complete obstruction: no TV delivery, desaturation. DOPE mnemonic: Displacement? Obstruction? Pneumothorax? Equipment? Bag-valve manually.",
      },
      critical: {
        durationTicks: 3,
        vitalDeltas: { spo2: -5, heartRate: 5, systolicBP: -6, gcs: -1 },
        ecgRhythmKey: "ventricular_fibrillation",
        ecgFeatures: {},
        ecgQrsWidth: 0.0,
        explanation: "Hypoxic arrest from unrelieved obstruction. ACLS. Emergency bronchoscopy or ETT exchange.",
      },
    },
    tags: ["mucus-plug", "airway", "ventilator", "rt", "suction"],
  },

  // ── 20. RT: Patient-Ventilator Asynchrony ──────────────────────────────────────
  {
    key: "rt_vent_asynchrony",
    label: "Patient-Ventilator Asynchrony",
    category: "rt",
    description: "Severe patient-ventilator dyssynchrony causing increased WOB, autoPEEP, and worsening gas exchange.",
    initialOverrides: {
      heartRate: 112, systolicBP: 132, diastolicBP: 78, map: 96,
      respiratoryRate: 32, spo2: 90, etco2: 48,
      isVentilated: true,
      tidalVolume: 480, peep: 8, peakInspiratoryPressure: 35,
      plateauPressure: 28, lungCompliance: 35, airwayResistance: 14,
      painScore: 6,
      ecgRhythmKey: "sinus_tachycardia",
      ecgFeatures: {},
      ecgQrsWidth: 0.09,
    },
    stages: {
      early: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 2, respiratoryRate: 2, spo2: -1, peakInspiratoryPressure: 2, etco2: 2 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Dyssynchrony: patient's respiratory drive mismatched to ventilator timing. Double-triggering or flow starvation. Adjust flow rate, switch to pressure-controlled mode.",
      },
      developing: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 3, respiratoryRate: 2, spo2: -1.5, peakInspiratoryPressure: 3, etco2: 2, painScore: 0.5 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Worsening asynchrony: visible patient effort against ventilator, accessory muscle use, agitation. Optimise sedation/analgesia, reassess vent settings.",
      },
      severe: {
        durationTicks: 3,
        vitalDeltas: { heartRate: 3, spo2: -2, peakInspiratoryPressure: 3, etco2: 3, painScore: 0.5, gcs: -0.5 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Severe asynchrony: consider neuromuscular blockade to allow lung-protective ventilation. Prone positioning. ECMO evaluation.",
      },
      critical: {
        durationTicks: 4,
        vitalDeltas: { spo2: -2, heartRate: 2, peakInspiratoryPressure: 2, etco2: 2, gcs: -0.5 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Refractory asynchrony with barotrauma risk. Plateau pressure > 35. Volutrauma and VILI risk.",
      },
    },
    tags: ["patient-ventilator-asynchrony", "ventilator", "rt", "ards", "sedation"],
  },

  // ── 21. RT: Accidental Extubation ────────────────────────────────────────────
  {
    key: "rt_accidental_extubation",
    label: "Accidental Extubation",
    category: "rt",
    description: "Unplanned extubation in a ventilator-dependent patient with rapid respiratory decompensation.",
    initialOverrides: {
      heartRate: 118, systolicBP: 142, diastolicBP: 82, map: 102,
      respiratoryRate: 36, spo2: 84, etco2: 12,
      isVentilated: false,  // No longer connected
      peakInspiratoryPressure: 0, peep: 0, tidalVolume: 0,
      fio2: 0.21,
      ecgRhythmKey: "sinus_tachycardia",
      ecgFeatures: {},
      ecgQrsWidth: 0.09,
    },
    stages: {
      early: {
        durationTicks: 1,
        vitalDeltas: { heartRate: 6, spo2: -4, respiratoryRate: 4, etco2: -2, systolicBP: 6 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Accidental extubation: loss of ventilatory support. BVM immediately. Assess: Is patient breathing adequately? Stridor? GCS?",
      },
      developing: {
        durationTicks: 2,
        vitalDeltas: { heartRate: 8, spo2: -6, respiratoryRate: 4, etco2: -2, systolicBP: 4, gcs: -1 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Rapid desaturation: BVM ventilation with 100% O₂. Prepare for emergency reintubation. Anesthesia/RT to bedside stat.",
      },
      severe: {
        durationTicks: 2,
        vitalDeltas: { heartRate: 8, spo2: -6, gcs: -2, systolicBP: -5, etco2: -2 },
        ecgRhythmKey: "sinus_tachycardia",
        ecgFeatures: {},
        ecgQrsWidth: 0.09,
        explanation: "Hypoxic crisis: RSI (rapid sequence intubation). Medications: succinylcholine/rocuronium + etomidate. Difficult airway cart at bedside.",
      },
      critical: {
        durationTicks: 3,
        vitalDeltas: { spo2: -4, heartRate: 4, systolicBP: -5, gcs: -2 },
        ecgRhythmKey: "ventricular_fibrillation",
        ecgFeatures: {},
        ecgQrsWidth: 0.0,
        explanation: "Hypoxic cardiac arrest from failed re-intubation. Surgical airway: cricothyrotomy. ACLS concurrently.",
      },
    },
    tags: ["accidental-extubation", "airway-emergency", "rt", "intubation", "emergency"],
  },
];

// ─── Lookup ───────────────────────────────────────────────────────────────────

export function getDeteriorationPattern(key: string): DeteriorationPattern | null {
  return DETERIORATION_PATTERNS.find((p) => p.key === key) ?? null;
}

export const DETERIORATION_PATTERN_KEYS = DETERIORATION_PATTERNS.map((p) => p.key);
