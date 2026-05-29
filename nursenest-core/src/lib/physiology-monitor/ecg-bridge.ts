/**
 * ECG Bridge
 *
 * Translates the current PhysiologyState into an EcgStripMediaConfig that the
 * existing generateEcgWaveform() can render. This is the single connection
 * point between the physiology engine and the ECG waveform system.
 *
 * Rate is taken directly from state.ecgRate (synced to heartRate by the engine
 * except for VF/asystole). QRS width and feature flags come from the active
 * condition stage as set by the engine.
 */

import type { EcgStripMediaConfig } from "@/lib/ecg-module/ecg-waveform-generator";
import { getEcgRhythmTemplate } from "@/lib/ecg-module/ecg-rhythm-templates";
import type { PhysiologyState } from "./physiology-state";

// ─── Rhythm key → regularity / P-wave lookup ─────────────────────────────────
//
// The ECG generator needs regularity and pWavePresence fields. Rather than
// hard-coding them here, we pull them from the rhythm template registry.
// For rhythm keys not in the registry, we fall back to safe defaults.

type Regularity = EcgStripMediaConfig["regularity"];
type PWavePattern = EcgStripMediaConfig["pWavePattern"];
type PrIntervalPattern = EcgStripMediaConfig["prIntervalPattern"];

function rhythmMeta(key: string): {
  regularity: Regularity;
  pWavePattern: PWavePattern;
  prIntervalPattern: PrIntervalPattern;
} {
  const template = getEcgRhythmTemplate(key);
  return {
    regularity: template?.rhythmRegularity ?? "regular",
    pWavePattern: template?.pWavePresence ?? "present",
    prIntervalPattern: template?.prIntervalPattern ?? "normal",
  };
}

// ─── Rate clamping per rhythm ─────────────────────────────────────────────────

function clampEcgRate(rhythmKey: string, rawRate: number): number {
  if (rawRate === 0) return 0;
  const template = getEcgRhythmTemplate(rhythmKey);
  if (!template) return Math.max(10, Math.min(300, rawRate));
  const [lo, hi] = template.expectedRateRange;
  // Allow ±20% outside template range to show clinical variability
  return Math.max(Math.round(lo * 0.8), Math.min(Math.round(hi * 1.2), rawRate));
}

// ─── QT behavior ─────────────────────────────────────────────────────────────

function qtBehavior(state: PhysiologyState): EcgStripMediaConfig["qtBehavior"] {
  if (state.ecgFeatures.polymorphicTwisting) return "prolonged";
  if (state.potassium < 3.0) return "prolonged";
  if (state.heartRate > 130) return "shortened";
  return "normal";
}

// ─── Main bridge function ─────────────────────────────────────────────────────

export function buildEcgConfigFromState(
  state: PhysiologyState,
  options?: {
    /** Preferred educational mode. Defaults to "emergency_scenario" for any deterioration. */
    educationalMode?: EcgStripMediaConfig["educationalMode"];
    paperSpeed?: number;
  },
): EcgStripMediaConfig {
  const { regularity, pWavePattern, prIntervalPattern } = rhythmMeta(state.ecgRhythmKey);

  const rate = clampEcgRate(state.ecgRhythmKey, state.ecgRate > 0 ? state.ecgRate : state.heartRate);
  const mode = options?.educationalMode ?? deriveEducationalMode(state);

  const isArrest = ["ventricular_fibrillation", "asystole", "pea"].includes(state.ecgRhythmKey);
  const isDeterioration = state.conditionStage === "severe" || state.conditionStage === "critical";

  return {
    mediaType: "ecg_live_strip",
    rhythmKey: state.ecgRhythmKey,
    rate,
    regularity,
    pWavePattern,
    prIntervalPattern,
    qrsWidth: state.ecgQrsWidth,
    qtBehavior: qtBehavior(state),
    artifactLevel: ECG_MODE_ARTIFACT_LEVELS[mode],
    difficulty: isArrest ? "advanced" : isDeterioration ? "intermediate" : "basic",
    pathwayTierScope: ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"],
    paperSpeed: options?.paperSpeed ?? 25,
    stripType: isDeterioration ? "deterioration" : "single_rhythm",
    educationalMode: mode,
    morphologyProfile: isDeterioration ? "decompensating" : "compensated",
    features: {
      hasOrganizedQrs: state.ecgFeatures.hasOrganizedQrs,
      hasRecurringQrs: state.ecgFeatures.hasRecurringQrs,
      avDissociation: state.ecgFeatures.avDissociation,
      progressivePr: state.ecgFeatures.progressivePr,
      polymorphicTwisting: state.ecgFeatures.polymorphicTwisting,
      peakedT: state.ecgFeatures.peakedT,
      widenedQrs: state.ecgFeatures.widenedQrs,
      stElevation: state.ecgFeatures.stElevation,
      stDepression: state.ecgFeatures.stDepression,
      pacerSpikes: state.ecgFeatures.pacerSpikes,
      rsrPrime: state.ecgFeatures.rsrPrime,
      broadNotchedR: state.ecgFeatures.broadNotchedR,
      retrogradeP: state.ecgFeatures.retrogradeP,
    },
  };
}

// ─── Educational mode derivation ─────────────────────────────────────────────

function deriveEducationalMode(state: PhysiologyState): EcgStripMediaConfig["educationalMode"] {
  if (state.conditionStage === "critical" || state.conditionStage === "severe") {
    return "emergency_scenario";
  }
  if (state.conditionStage === "developing") {
    return "realistic_monitor";
  }
  return "clean_teaching";
}

const ECG_MODE_ARTIFACT_LEVELS: Record<NonNullable<EcgStripMediaConfig["educationalMode"]>, number> = {
  clean_teaching: 0.008,
  realistic_monitor: 0.035,
  artifact_training: 0.14,
  telemetry_review: 0.025,
  emergency_scenario: 0.06,
};

// ─── Snapshot ECG config for screenshots ─────────────────────────────────────

/** Returns a static (non-animated) config for screenshot / marketing use. */
export function buildStaticEcgConfigForCondition(
  conditionKey: string,
  stage: PhysiologyState["conditionStage"] = "developing",
): EcgStripMediaConfig {
  // Import here to avoid circular deps in tests
  const { getDeteriorationPattern } = require("./deterioration-patterns") as {
    getDeteriorationPattern: (key: string) => import("./deterioration-patterns").DeteriorationPattern | null;
  };
  const pattern = getDeteriorationPattern(conditionKey);
  if (!pattern) throw new Error(`No pattern for condition key: ${conditionKey}`);

  const stageDef = pattern.stages[stage];
  const { regularity, pWavePattern, prIntervalPattern } = rhythmMeta(stageDef.ecgRhythmKey);

  const overrides = pattern.initialOverrides;
  const baseRate = typeof overrides.heartRate === "number" ? overrides.heartRate : 80;

  return {
    mediaType: "ecg_live_strip",
    rhythmKey: stageDef.ecgRhythmKey,
    rate: baseRate,
    regularity,
    pWavePattern,
    prIntervalPattern,
    qrsWidth: stageDef.ecgQrsWidth,
    difficulty: stage === "critical" ? "advanced" : "intermediate",
    pathwayTierScope: ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"],
    stripType: "deterioration",
    educationalMode: "realistic_monitor",
    morphologyProfile: "decompensating",
    features: { ...stageDef.ecgFeatures },
  };
}
