/**
 * ECG Ecosystem Adapter
 *
 * Bridges the Physiology Monitor Engine into the ECG module ecosystem.
 *
 * Enables:
 *   1. ECG Simulations — replace static vitals with live PhysiologyState
 *   2. Rhythm Progression Cases — drive sequential rhythm changes from deterioration stages
 *   3. Telemetry Cases — alarm recognition + escalation + intervention response
 *
 * The adapter is purely a data-transformation layer — it imports from both
 * physiology-monitor and the ECG module, but adds no UI or persistence.
 */

import type { EcgStripMediaConfig } from "@/lib/ecg-module/ecg-waveform-generator";
import type { EcgRhythmTemplate } from "@/lib/ecg-module/ecg-rhythm-templates";
import { getEcgRhythmTemplate } from "@/lib/ecg-module/ecg-rhythm-templates";
import { buildEcgConfigFromState, buildStaticEcgConfigForCondition } from "./ecg-bridge";
import { getDeteriorationPattern, DETERIORATION_PATTERNS } from "./deterioration-patterns";
import type { PhysiologyState, ConditionStage } from "./physiology-state";
import type { MonitorMode } from "./physiology-state";

// ─── Telemetry case ───────────────────────────────────────────────────────────

export interface TelemetryCaseConfig {
  /** Unique scenario identifier. */
  id: string;
  title: string;
  /** Specialty/unit context. */
  specialty: "telemetry" | "icu" | "emergency" | "stepdown";
  conditionKey: string;
  /** Starting stage for the scenario. */
  openingStage: ConditionStage;
  /** Monitor mode for this scenario. */
  monitorMode: MonitorMode;
  /** ECG configs for each stage (pre-computed for the UI). */
  stageEcgConfigs: Partial<Record<ConditionStage, EcgStripMediaConfig>>;
  /** Learning objectives for this telemetry case. */
  learningObjectives: string[];
  /** Whether the scenario requires escalation as a graded action. */
  requiresEscalation: boolean;
  /** NGN-format question prompt shown after the monitoring phase. */
  ngnPrompt?: string;
}

// ─── Rhythm progression case ──────────────────────────────────────────────────

export interface RhythmProgressionCase {
  id: string;
  title: string;
  conditionKey: string;
  /** Ordered list of rhythm keys the learner will observe. */
  rhythmSequence: Array<{
    stage: ConditionStage;
    rhythmKey: string;
    rhythmName: string;
    clinicalNote: string;
    ecgConfig: EcgStripMediaConfig;
  }>;
  clinicalContext: string;
  teachingPoints: string[];
}

// ─── ECG simulation frame ─────────────────────────────────────────────────────

export interface EcgSimulationFrame {
  /** Current PhysiologyState drives everything. */
  ecgConfig: EcgStripMediaConfig;
  rhythmLabel: string;
  heartRate: number;
  bloodPressure: string;
  spo2: number;
  /** If true, the learner should identify this as an emergency. */
  isEmergencyRhythm: boolean;
  clinicalContext: string;
}

// ─── Adapter functions ────────────────────────────────────────────────────────

/**
 * Converts live PhysiologyState into an ECG simulation frame.
 * Drop this into any ECG lesson or simulation that wants live physiology.
 */
export function stateToEcgSimulationFrame(state: PhysiologyState): EcgSimulationFrame {
  const ecgConfig = buildEcgConfigFromState(state, { educationalMode: "realistic_monitor" });
  const template: EcgRhythmTemplate | null = getEcgRhythmTemplate(state.ecgRhythmKey);

  const isEmergencyRhythm = [
    "ventricular_fibrillation", "asystole", "pea",
    "ventricular_tachycardia", "third_degree_av_block",
  ].includes(state.ecgRhythmKey);

  return {
    ecgConfig,
    rhythmLabel: template?.rhythmName ?? state.ecgRhythmKey.replace(/_/g, " "),
    heartRate: Math.round(state.heartRate),
    bloodPressure: `${Math.round(state.systolicBP)}/${Math.round(state.diastolicBP)}`,
    spo2: Math.round(state.spo2),
    isEmergencyRhythm,
    clinicalContext: buildClinicalContext(state),
  };
}

/**
 * Builds a Rhythm Progression Case from a deterioration pattern.
 * Shows the learner the full ECG trajectory of a condition.
 */
export function buildRhythmProgressionCase(conditionKey: string): RhythmProgressionCase | null {
  const pattern = getDeteriorationPattern(conditionKey);
  if (!pattern) return null;

  const stages: ConditionStage[] = ["early", "developing", "severe", "critical"];
  const rhythmSequence = stages.map((stage) => {
    const stageDef = pattern.stages[stage];
    const template = getEcgRhythmTemplate(stageDef.ecgRhythmKey);
    return {
      stage,
      rhythmKey: stageDef.ecgRhythmKey,
      rhythmName: template?.rhythmName ?? stageDef.ecgRhythmKey.replace(/_/g, " "),
      clinicalNote: stageDef.explanation,
      ecgConfig: buildStaticEcgConfigForCondition(conditionKey, stage),
    };
  });

  // Deduplicate if rhythm doesn't change between stages
  const uniqueSequence = rhythmSequence.filter(
    (s, i) => i === 0 || s.rhythmKey !== rhythmSequence[i - 1]!.rhythmKey,
  );

  return {
    id: `rhythm-progression-${conditionKey}`,
    title: `${pattern.label} — ECG Progression`,
    conditionKey,
    rhythmSequence: uniqueSequence,
    clinicalContext: pattern.description,
    teachingPoints: buildTeachingPoints(conditionKey, pattern),
  };
}

/**
 * Generates a telemetry case config from a deterioration pattern.
 * Used by the Telemetry module to scaffold alarm-recognition scenarios.
 */
export function buildTelemetryCase(
  conditionKey: string,
  options?: { specialty?: TelemetryCaseConfig["specialty"]; openingStage?: ConditionStage },
): TelemetryCaseConfig | null {
  const pattern = getDeteriorationPattern(conditionKey);
  if (!pattern) return null;

  const stages: ConditionStage[] = ["early", "developing", "severe", "critical"];
  const stageEcgConfigs: Partial<Record<ConditionStage, EcgStripMediaConfig>> = {};
  for (const stage of stages) {
    stageEcgConfigs[stage] = buildStaticEcgConfigForCondition(conditionKey, stage);
  }

  const specialty = options?.specialty ?? deriveSpecialty(conditionKey);
  const openingStage = options?.openingStage ?? "early";

  return {
    id: `telemetry-${conditionKey}`,
    title: `Telemetry Monitoring: ${pattern.label}`,
    specialty,
    conditionKey,
    openingStage,
    monitorMode: specialty === "icu" ? "icu" : "general",
    stageEcgConfigs,
    learningObjectives: buildLearningObjectives(conditionKey),
    requiresEscalation: true,
    ngnPrompt: buildNgnTelemetryPrompt(conditionKey, pattern.label),
  };
}

/**
 * Returns all conditions that can drive ECG simulations for a given ECG domain.
 */
export function conditionsForEcgDomain(domainId: string): string[] {
  const ECG_DOMAIN_CONDITIONS: Record<string, string[]> = {
    rhythm_recognition:    ["afib_rvr", "svt", "vt_to_vf", "heart_failure"],
    acls_critical_rhythms: ["vt_to_vf", "stemi", "cardiac_tamponade", "tension_pneumothorax"],
    ischemia_stemi:        ["stemi", "gi_bleed"],
    electrolyte_abnormalities: ["hyperkalemia", "dka"],
    telemetry_interpretation:  ["sepsis", "afib_rvr", "heart_failure", "pulmonary_embolism"],
    conduction_disorders:  ["increased_icp", "stemi"],
  };
  return ECG_DOMAIN_CONDITIONS[domainId] ?? [];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildClinicalContext(state: PhysiologyState): string {
  const conditions: string[] = [];
  if (state.spo2 < 92) conditions.push(`SpO₂ ${Math.round(state.spo2)}%`);
  if (state.map < 65) conditions.push(`MAP ${Math.round(state.map)} mmHg`);
  if (state.heartRate > 100) conditions.push(`HR ${Math.round(state.heartRate)}`);
  if (state.heartRate < 50) conditions.push(`Bradycardia ${Math.round(state.heartRate)}`);
  return conditions.length > 0 ? conditions.join(" · ") : "Monitoring in progress";
}

function buildTeachingPoints(conditionKey: string, pattern: ReturnType<typeof getDeteriorationPattern>): string[] {
  if (!pattern) return [];
  const points = [
    `${pattern.label} causes characteristic ECG changes at each stage of deterioration.`,
    pattern.stages.early.explanation,
    pattern.stages.severe.explanation,
  ];
  if (conditionKey === "stemi") {
    points.push("ST elevation in contiguous leads + reciprocal changes confirms STEMI. Activate cath lab immediately.");
  }
  if (conditionKey === "hyperkalemia") {
    points.push("ECG changes in hyperkalemia are progressive: peaked T → widened QRS → sine wave → PEA/VF.");
  }
  return points.slice(0, 4);
}

function deriveSpecialty(conditionKey: string): TelemetryCaseConfig["specialty"] {
  const ICU_CONDITIONS = ["ards", "cardiac_tamponade", "increased_icp", "vt_to_vf", "tension_pneumothorax"];
  const ED_CONDITIONS = ["anaphylaxis", "stemi", "svt"];
  if (ICU_CONDITIONS.includes(conditionKey)) return "icu";
  if (ED_CONDITIONS.includes(conditionKey)) return "emergency";
  return "telemetry";
}

function buildLearningObjectives(conditionKey: string): string[] {
  const BASE = [
    `Recognise the ECG changes associated with ${conditionKey.replace(/_/g, " ")}.`,
    "Interpret vital sign trends to identify clinical deterioration.",
    "Initiate appropriate escalation within the expected time window.",
  ];
  return BASE;
}

function buildNgnTelemetryPrompt(conditionKey: string, label: string): string {
  return `The nurse is monitoring a patient with ${label}. Review the telemetry strip and vital sign trends above. Which finding requires the MOST immediate nursing action?`;
}

// ─── Registry: all telemetry cases ───────────────────────────────────────────

export function getAllTelemetryCases(): TelemetryCaseConfig[] {
  return DETERIORATION_PATTERNS
    .map((p) => buildTelemetryCase(p.key))
    .filter((c): c is TelemetryCaseConfig => c !== null);
}

export function getAllRhythmProgressionCases(): RhythmProgressionCase[] {
  return DETERIORATION_PATTERNS
    .map((p) => buildRhythmProgressionCase(p.key))
    .filter((c): c is RhythmProgressionCase => c !== null);
}
