/**
 * Advanced Simulation Engine — Phase 3 type system.
 *
 * Extends the base linear SimStep model with:
 *   - Branching pathways (wrong choices route to consequence steps)
 *   - "What happens if you do nothing?" mandatory consequence timelines
 *   - Dynamic vitals that evolve across steps
 *   - Lab values and imaging descriptions
 *   - Support for text-only steps (ECMO, transport — no waveform)
 *   - Multiple valid intervention strategies with scored feedback
 *
 * Architecture: each AdvancedSimulation has a step registry keyed by string.
 * The player walks keys rather than indices, enabling non-linear branching.
 */

import type { VentWaveformConfig } from "./vent-waveform-generator";

// ─── Vital Signs ───────────────────────────────────────────────────────────────

export type VitalSigns = {
  hr?: number;        // bpm
  spo2?: number;      // %
  rr?: number;        // breaths/min
  bp?: string;        // "120/80"
  sbp?: number;       // systolic only (for trend calculations)
  etco2?: number;     // mmHg
  fio2?: number;      // %
  temp?: number;      // °C
  gcs?: number;       // Glasgow Coma Scale total
  cvp?: number;       // cmH₂O
  map_bp?: number;    // Mean arterial pressure mmHg
};

// ─── Lab Values ────────────────────────────────────────────────────────────────

export type LabValues = {
  ph?: number;
  pao2?: number;      // mmHg
  paco2?: number;     // mmHg
  hco3?: number;      // mEq/L
  be?: number;        // Base excess mEq/L
  lactate?: number;   // mmol/L
  hgb?: number;       // g/dL
  pf_ratio?: number;  // PaO2/FiO2
  wbc?: number;       // ×10³/µL
  plt?: number;       // ×10³/µL
  inr?: number;
  creatinine?: number;// mg/dL
  potassium?: number; // mEq/L
  sodium?: number;    // mEq/L
};

// ─── Consequence of Inaction ──────────────────────────────────────────────────

export type ConsequenceEvent = {
  /** Time since recognition of the problem */
  timeframe: string;
  /** What physiologically happens */
  event: string;
  /** Vital sign changes at this point */
  vitalsChange?: Partial<VitalSigns>;
};

export type ConsequenceOfInaction = {
  /** Opening statement — why delay is dangerous */
  description: string;
  /** Sequential deterioration events */
  timeline: ConsequenceEvent[];
  /** Terminal outcome if untreated */
  finalOutcome: string;
  /** The single most important clinical pearl */
  clinicalPearl: string;
};

// ─── Simulation Choice ─────────────────────────────────────────────────────────

export type AdvancedSimChoice = {
  id: string;
  text: string;
  correct: boolean;
  /** Detailed clinical explanation */
  feedback: string;
  /** If set, choosing this routes to this step key instead of the default next */
  branchToKey?: string;
  /** Danger level — used to visually flag immediately harmful choices */
  danger?: "caution" | "harmful" | "fatal";
};

// ─── Simulation Step ───────────────────────────────────────────────────────────

export type AdvancedSimStep = {
  /** Unique key within the simulation — used for branching */
  key: string;
  /** Clinical narrative above the waveform */
  context: string;
  /** Optional heading for the waveform panel */
  waveformLabel?: string;
  /** Null = no waveform this step (text/decision only) */
  waveformConfig?: VentWaveformConfig;
  /** Show P-V loop alongside scalar traces */
  showPvLoop?: boolean;
  /** Show F-V loop alongside scalar traces */
  showFvLoop?: boolean;
  question: string;
  choices: AdvancedSimChoice[];
  /** Default next step key; "end" = simulation complete */
  nextKey: string | "end";
  /** Key learning regardless of answer choice */
  keyLearning: string;
  /** What happens if the learner delays or does nothing */
  consequenceOfInaction?: ConsequenceOfInaction;
  vitals?: VitalSigns;
  labs?: LabValues;
  /** Imaging findings described in text */
  imaging?: string;
  /** Additional clinical data (e.g. ETT position, cuff pressure) */
  clinicalData?: Record<string, string>;
};

// ─── Simulation ────────────────────────────────────────────────────────────────

export type SimulationCategory =
  | "waveform_detective"
  | "emergency"
  | "nicu"
  | "picu"
  | "ecmo"
  | "transport"
  | "foundational";

export type AdvancedSimulation = {
  id: string;
  title: string;
  category: SimulationCategory;
  summary: string;
  /** Age and diagnosis — shown in the picker card */
  patient: string;
  difficulty: "basic" | "intermediate" | "advanced";
  estimatedMinutes: number;
  competencies: string[];
  /** Key of the entry step */
  entryStepKey: string;
  /** All steps keyed for O(1) lookup */
  steps: Record<string, AdvancedSimStep>;
};

// ─── Category metadata ─────────────────────────────────────────────────────────

export const SIM_CATEGORY_LABELS: Record<SimulationCategory, string> = {
  waveform_detective: "Waveform Detective",
  emergency: "Ventilator Emergencies",
  nicu: "NICU Respiratory",
  picu: "PICU Respiratory",
  ecmo: "ECMO",
  transport: "Transport RT",
  foundational: "Foundational",
};

export const SIM_CATEGORY_DESCRIPTIONS: Record<SimulationCategory, string> = {
  waveform_detective: "Identify waveform abnormalities, explain physiology, and select the correct intervention.",
  emergency: "High-acuity ventilator emergencies requiring immediate recognition and response.",
  nicu: "Neonatal respiratory therapy — premature infants, RDS, surfactant, HFOV, PPHN.",
  picu: "Pediatric critical care respiratory — asthma, bronchiolitis, ARDS, airway emergencies.",
  ecmo: "Extracorporeal membrane oxygenation — initiation, management, complications, weaning.",
  transport: "Interfacility and air transport of ventilated patients — resource limits, altitude physiology.",
  foundational: "Core ventilator concepts for all RT learners.",
};

// ─── Helper factories ──────────────────────────────────────────────────────────

export function adv(
  id: string,
  text: string,
  correct: boolean,
  feedback: string,
  opts?: { branchToKey?: string; danger?: AdvancedSimChoice["danger"] },
): AdvancedSimChoice {
  return { id, text, correct, feedback, ...opts };
}

export function step(
  key: string,
  config: Omit<AdvancedSimStep, "key">,
): AdvancedSimStep {
  return { key, ...config };
}

export function makeSimulation(
  id: string,
  meta: Omit<AdvancedSimulation, "id" | "steps" | "entryStepKey">,
  steps: AdvancedSimStep[],
): AdvancedSimulation {
  const stepMap: Record<string, AdvancedSimStep> = {};
  for (const s of steps) stepMap[s.key] = s;
  return {
    id,
    ...meta,
    entryStepKey: steps[0]!.key,
    steps: stepMap,
  };
}

// ─── Waveform Detective case type (Phase 3A specialization) ────────────────────

export type DetectiveCase = {
  id: string;
  title: string;
  difficulty: "basic" | "intermediate" | "advanced";
  /** The waveform displayed — the learner must identify the abnormality */
  abnormalConfig: VentWaveformConfig;
  /** Waveform after correct intervention applied */
  correctedConfig: VentWaveformConfig;
  showPvLoop: boolean;
  showFvLoop: boolean;
  /** Which traces show the key finding */
  findingTraces: Array<"pressure" | "flow" | "volume" | "pv_loop" | "fv_loop">;
  identifyQuestion: string;
  identifyChoices: AdvancedSimChoice[];
  physiologyQuestion: string;
  physiologyChoices: AdvancedSimChoice[];
  interventionQuestion: string;
  interventionChoices: AdvancedSimChoice[];
  /** Consequence if the problem is missed */
  consequenceOfInaction: ConsequenceOfInaction;
  /** Teaching annotations visible on abnormal waveform */
  teachingPoints: string[];
  keyLearning: string;
};
