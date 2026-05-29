/**
 * Deteriorating Patient Physiology Monitor Engine — Core State Types
 *
 * Ground truth for the entire monitor: one PhysiologyState per tick, stored in
 * a snapshot ring buffer for trend view. All monitor components derive their
 * display values from this structure.
 */

// ─── Professions / monitor modes ─────────────────────────────────────────────

export type MonitorMode = "new_grad" | "general" | "icu" | "rt" | "np";

// ─── Alarm severity ───────────────────────────────────────────────────────────

export type AlarmLevel = "critical" | "warning" | null;

// ─── Condition stage ──────────────────────────────────────────────────────────

export type ConditionStage = "early" | "developing" | "severe" | "critical";

// ─── ECG feature flags (mirrors EcgStripMediaConfig.features) ────────────────

export interface EcgFeatureFlags {
  hasOrganizedQrs?: boolean;
  hasRecurringQrs?: boolean;
  avDissociation?: boolean;
  progressivePr?: boolean;
  polymorphicTwisting?: boolean;
  peakedT?: boolean;
  widenedQrs?: boolean;
  stElevation?: boolean;
  stDepression?: boolean;
  pacerSpikes?: boolean;
  rsrPrime?: boolean;
  broadNotchedR?: boolean;
  retrogradeP?: boolean;
}

// ─── Active intervention record ───────────────────────────────────────────────

export interface ActiveIntervention {
  key: string;
  label: string;
  appliedAtTick: number;
  durationTicks: number;
}

// ─── Monitor alarm ────────────────────────────────────────────────────────────

export interface MonitorAlarm {
  vital: string;
  level: AlarmLevel;
  message: string;
}

// ─── Full physiologic state ───────────────────────────────────────────────────

export interface PhysiologyState {
  // Simulation time
  tick: number;

  // ── Cardiovascular ──────────────────────────────────────
  heartRate: number;             // bpm
  systolicBP: number;            // mmHg
  diastolicBP: number;           // mmHg
  map: number;                   // mmHg  = (SBP + 2·DBP) / 3
  cvp: number;                   // cmH₂O  (ICU/advanced)
  cardiacOutput: number;         // L/min  (ICU/advanced)

  // ── Respiratory ─────────────────────────────────────────
  respiratoryRate: number;       // breaths/min
  spo2: number;                  // %
  etco2: number;                 // mmHg  (normal 35–45)
  fio2: number;                  // fraction 0.21–1.0

  // ── Ventilator (when ventilated) ─────────────────────────
  isVentilated: boolean;
  tidalVolume: number;           // mL
  peep: number;                  // cmH₂O
  peakInspiratoryPressure: number; // cmH₂O
  plateauPressure: number;       // cmH₂O
  lungCompliance: number;        // mL/cmH₂O  (normal ~50–100)
  airwayResistance: number;      // cmH₂O/L/s  (normal 5–10)

  // ── Metabolic / Labs ─────────────────────────────────────
  temperature: number;           // °C
  glucose: number;               // mg/dL
  lactate: number;               // mmol/L  (normal < 2)
  potassium: number;             // mEq/L   (normal 3.5–5.0)

  // ── Renal ────────────────────────────────────────────────
  urineOutputPerHour: number;    // mL/hr   (adequate ≥ 0.5 mL/kg/hr)

  // ── Neurologic ───────────────────────────────────────────
  gcs: number;                   // 3–15
  icp: number;                   // mmHg  (normal < 15)

  // ── Pain ─────────────────────────────────────────────────
  painScore: number;             // 0–10

  // ── ECG ──────────────────────────────────────────────────
  ecgRhythmKey: string;          // key from ecg-rhythm-templates
  ecgRate: number;               // bpm rendered on strip (may differ from HR in block)
  ecgQrsWidth: number;           // seconds (0.04–0.22)
  ecgFeatures: EcgFeatureFlags;

  // ── Simulation metadata ───────────────────────────────────
  activeConditionKey: string;
  conditionStage: ConditionStage;
  ticksInCurrentStage: number;
  activeInterventions: ActiveIntervention[];
}

// ─── Snapshot for trend history ───────────────────────────────────────────────

export interface PhysiologySnapshot {
  tick: number;
  /** Simulation seconds elapsed (1 tick = 30 sim-seconds by default). */
  simSeconds: number;
  state: Readonly<PhysiologyState>;
}

// ─── Physiologic value clamps ─────────────────────────────────────────────────

export const PHYSIOLOGY_CLAMPS: Partial<Record<keyof PhysiologyState, { min: number; max: number }>> = {
  heartRate:                { min: 0,   max: 300  },
  systolicBP:               { min: 30,  max: 290  },
  diastolicBP:              { min: 15,  max: 170  },
  map:                      { min: 15,  max: 200  },
  cvp:                      { min: -5,  max: 35   },
  cardiacOutput:            { min: 0.3, max: 15   },
  respiratoryRate:          { min: 0,   max: 65   },
  spo2:                     { min: 40,  max: 100  },
  etco2:                    { min: 5,   max: 95   },
  fio2:                     { min: 0.21, max: 1.0 },
  tidalVolume:              { min: 0,   max: 900  },
  peep:                     { min: 0,   max: 30   },
  peakInspiratoryPressure:  { min: 5,   max: 80   },
  plateauPressure:          { min: 5,   max: 70   },
  lungCompliance:           { min: 5,   max: 120  },
  airwayResistance:         { min: 3,   max: 50   },
  temperature:              { min: 32,  max: 43   },
  glucose:                  { min: 20,  max: 1000 },
  lactate:                  { min: 0,   max: 22   },
  potassium:                { min: 1.5, max: 9.5  },
  urineOutputPerHour:       { min: 0,   max: 600  },
  gcs:                      { min: 3,   max: 15   },
  icp:                      { min: 0,   max: 60   },
  painScore:                { min: 0,   max: 10   },
  ecgQrsWidth:              { min: 0.04, max: 0.28 },
};

// ─── Baseline (normal) physiologic state ──────────────────────────────────────

export const BASELINE_PHYSIOLOGY_STATE: Omit<PhysiologyState, "tick" | "activeConditionKey" | "conditionStage" | "ticksInCurrentStage" | "activeInterventions"> = {
  heartRate: 76,
  systolicBP: 122,
  diastolicBP: 74,
  map: 90,
  cvp: 5,
  cardiacOutput: 5.2,

  respiratoryRate: 14,
  spo2: 98,
  etco2: 38,
  fio2: 0.21,

  isVentilated: false,
  tidalVolume: 500,
  peep: 5,
  peakInspiratoryPressure: 18,
  plateauPressure: 16,
  lungCompliance: 60,
  airwayResistance: 8,

  temperature: 37.0,
  glucose: 92,
  lactate: 1.1,
  potassium: 4.0,

  urineOutputPerHour: 45,
  gcs: 15,
  icp: 8,
  painScore: 2,

  ecgRhythmKey: "normal_sinus_rhythm",
  ecgRate: 76,
  ecgQrsWidth: 0.08,
  ecgFeatures: {},
};

// ─── Alarm derivation from state ──────────────────────────────────────────────

export function deriveAlarms(state: PhysiologyState): MonitorAlarm[] {
  const alarms: MonitorAlarm[] = [];

  if (state.heartRate >= 150) alarms.push({ vital: "HR", level: "critical", message: `HR ${Math.round(state.heartRate)} — Severe tachycardia` });
  else if (state.heartRate >= 100) alarms.push({ vital: "HR", level: "warning", message: `HR ${Math.round(state.heartRate)} — Tachycardia` });
  else if (state.heartRate < 30) alarms.push({ vital: "HR", level: "critical", message: `HR ${Math.round(state.heartRate)} — Severe bradycardia` });
  else if (state.heartRate < 50) alarms.push({ vital: "HR", level: "warning", message: `HR ${Math.round(state.heartRate)} — Bradycardia` });

  if (state.systolicBP < 70) alarms.push({ vital: "BP", level: "critical", message: `SBP ${Math.round(state.systolicBP)} — Critical hypotension` });
  else if (state.systolicBP < 90) alarms.push({ vital: "BP", level: "warning", message: `SBP ${Math.round(state.systolicBP)} — Hypotension` });
  else if (state.systolicBP > 200) alarms.push({ vital: "BP", level: "critical", message: `SBP ${Math.round(state.systolicBP)} — Hypertensive emergency` });
  else if (state.systolicBP > 180) alarms.push({ vital: "BP", level: "warning", message: `SBP ${Math.round(state.systolicBP)} — Hypertension` });

  if (state.map < 50) alarms.push({ vital: "MAP", level: "critical", message: `MAP ${Math.round(state.map)} — Organ perfusion threatened` });
  else if (state.map < 65) alarms.push({ vital: "MAP", level: "warning", message: `MAP ${Math.round(state.map)} — Below target` });

  if (state.spo2 < 85) alarms.push({ vital: "SpO₂", level: "critical", message: `SpO₂ ${Math.round(state.spo2)}% — Severe hypoxemia` });
  else if (state.spo2 < 92) alarms.push({ vital: "SpO₂", level: "warning", message: `SpO₂ ${Math.round(state.spo2)}% — Hypoxemia` });

  if (state.respiratoryRate >= 35) alarms.push({ vital: "RR", level: "critical", message: `RR ${Math.round(state.respiratoryRate)} — Respiratory distress` });
  else if (state.respiratoryRate >= 25) alarms.push({ vital: "RR", level: "warning", message: `RR ${Math.round(state.respiratoryRate)} — Tachypnea` });
  else if (state.respiratoryRate < 6) alarms.push({ vital: "RR", level: "critical", message: `RR ${Math.round(state.respiratoryRate)} — Apnea / agonal` });
  else if (state.respiratoryRate < 10) alarms.push({ vital: "RR", level: "warning", message: `RR ${Math.round(state.respiratoryRate)} — Bradypnea` });

  if (state.temperature > 40.5) alarms.push({ vital: "Temp", level: "critical", message: `Temp ${state.temperature.toFixed(1)}°C — Hyperpyrexia` });
  else if (state.temperature > 38.5) alarms.push({ vital: "Temp", level: "warning", message: `Temp ${state.temperature.toFixed(1)}°C — Fever` });
  else if (state.temperature < 35.0) alarms.push({ vital: "Temp", level: "critical", message: `Temp ${state.temperature.toFixed(1)}°C — Hypothermia` });
  else if (state.temperature < 36.0) alarms.push({ vital: "Temp", level: "warning", message: `Temp ${state.temperature.toFixed(1)}°C — Low temp` });

  if (state.gcs <= 8) alarms.push({ vital: "GCS", level: "critical", message: `GCS ${Math.round(state.gcs)} — Severely impaired consciousness` });
  else if (state.gcs <= 12) alarms.push({ vital: "GCS", level: "warning", message: `GCS ${Math.round(state.gcs)} — Impaired consciousness` });

  if (state.icp > 30) alarms.push({ vital: "ICP", level: "critical", message: `ICP ${Math.round(state.icp)} mmHg — Refractory intracranial hypertension` });
  else if (state.icp > 20) alarms.push({ vital: "ICP", level: "warning", message: `ICP ${Math.round(state.icp)} mmHg — Elevated ICP` });

  if (state.etco2 < 20) alarms.push({ vital: "EtCO₂", level: "critical", message: `EtCO₂ ${Math.round(state.etco2)} — Hyperventilation / no perfusion` });
  else if (state.etco2 > 60) alarms.push({ vital: "EtCO₂", level: "critical", message: `EtCO₂ ${Math.round(state.etco2)} — Severe hypercapnia` });
  else if (state.etco2 > 50) alarms.push({ vital: "EtCO₂", level: "warning", message: `EtCO₂ ${Math.round(state.etco2)} — Hypercapnia` });

  if (state.urineOutputPerHour < 15) alarms.push({ vital: "UO", level: "critical", message: `UO ${Math.round(state.urineOutputPerHour)} mL/hr — Oliguria / anuria` });
  else if (state.urineOutputPerHour < 30) alarms.push({ vital: "UO", level: "warning", message: `UO ${Math.round(state.urineOutputPerHour)} mL/hr — Reduced urine output` });

  if (state.lactate > 8) alarms.push({ vital: "Lactate", level: "critical", message: `Lactate ${state.lactate.toFixed(1)} — Severe lactic acidosis` });
  else if (state.lactate > 4) alarms.push({ vital: "Lactate", level: "warning", message: `Lactate ${state.lactate.toFixed(1)} — Elevated lactate` });

  if (state.isVentilated && state.peakInspiratoryPressure > 45) alarms.push({ vital: "PIP", level: "critical", message: `PIP ${Math.round(state.peakInspiratoryPressure)} cmH₂O — High airway pressure` });
  if (state.isVentilated && state.plateauPressure > 30) alarms.push({ vital: "Plateau", level: "warning", message: `Plateau ${Math.round(state.plateauPressure)} cmH₂O — Lung protection risk` });

  return alarms;
}

// ─── Helper: clamp a value to physiology bounds ───────────────────────────────

export function clampVital(key: keyof PhysiologyState, value: number): number {
  const range = PHYSIOLOGY_CLAMPS[key];
  if (!range) return value;
  return Math.max(range.min, Math.min(range.max, value));
}

// ─── Helper: recompute MAP from SBP / DBP ────────────────────────────────────

export function computeMap(sbp: number, dbp: number): number {
  return (sbp + 2 * dbp) / 3;
}
