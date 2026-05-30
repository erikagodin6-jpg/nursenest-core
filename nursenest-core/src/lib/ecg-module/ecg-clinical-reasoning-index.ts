/**
 * ECG Clinical Reasoning — Combined Export
 *
 * Assembles all clinical reasoning units from Parts 1–5 into a single
 * searchable, typed library. Import from this file for all consumer code.
 */

export type {
  EcgClinicalReasoningUnit,
  EcgHemodynamicImpact,
  EcgClinicalPresentation,
  EcgEscalationCriteria,
  EcgEscalationLevel,
  EcgExamTraps,
  EcgProfessionContent,
  EcgProfessionViews,
  EcgCompareContrast,
  EcgSimulationHook,
  EcgSimulationScenarioType,
} from "./ecg-clinical-reasoning";

import { ECG_CLINICAL_REASONING_UNITS_PART1 } from "./ecg-clinical-reasoning";
import { ECG_CLINICAL_REASONING_UNITS_PART2 } from "./ecg-clinical-reasoning-p2";
import { ECG_CLINICAL_REASONING_UNITS_PART3 } from "./ecg-clinical-reasoning-p3";
import { ECG_CLINICAL_REASONING_UNITS_PART4 } from "./ecg-clinical-reasoning-p4";
import { ECG_CLINICAL_REASONING_UNITS_PART5 } from "./ecg-clinical-reasoning-p5";

/** All 29 ECG clinical reasoning units — one per rhythm in the library. */
export const ECG_CLINICAL_REASONING_UNITS = [
  ...ECG_CLINICAL_REASONING_UNITS_PART1,
  ...ECG_CLINICAL_REASONING_UNITS_PART2,
  ...ECG_CLINICAL_REASONING_UNITS_PART3,
  ...ECG_CLINICAL_REASONING_UNITS_PART4,
  ...ECG_CLINICAL_REASONING_UNITS_PART5,
];

/**
 * Look up clinical reasoning content by rhythm key.
 * Returns undefined if the rhythm has no clinical reasoning unit yet.
 */
export function getEcgClinicalReasoningUnit(rhythmKey: string) {
  return ECG_CLINICAL_REASONING_UNITS.find((u) => u.rhythmKey === rhythmKey);
}

/**
 * Returns clinical reasoning units matching a given escalation level.
 * Useful for building escalation-sorted lesson queues.
 */
export function getEcgUnitsByEscalationLevel(
  level: import("./ecg-clinical-reasoning").EcgEscalationLevel,
) {
  return ECG_CLINICAL_REASONING_UNITS.filter(
    (u) => u.escalation.defaultLevel === level,
  );
}

/**
 * Returns all rhythms that have compare-and-contrast content linking to
 * a given rhythm key. Used to populate the "Compare with" UI panel.
 */
export function getEcgCompareContrastPeers(rhythmKey: string) {
  return ECG_CLINICAL_REASONING_UNITS.filter((u) =>
    u.compareContrast.some((c) => c.compareWithRhythmKey === rhythmKey),
  );
}

/** All rhythm keys that have a clinical reasoning unit. */
export const ECG_CLINICAL_REASONING_RHYTHM_KEYS: ReadonlyArray<string> =
  ECG_CLINICAL_REASONING_UNITS.map((u) => u.rhythmKey);
