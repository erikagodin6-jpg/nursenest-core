/**
 * Longitudinal state mutation orchestrator.
 *
 * Computes EvolvedStepState for a target step from all prior decisions.
 * Coordinates: lab evolution, vital evolution, medication adherence,
 * patient messaging, and delayed consequence surfacing.
 *
 * All computations are deterministic (no randomness).
 * Given the same decisions and case, the same evolved state is always produced.
 */
import type {
  PatientCase,
  CaseDecisionRecord,
  EvolvedStepState,
  EvolvedLabValue,
} from "@/lib/cases/longitudinal-case-types";
import { computeTrajectoryState } from "@/lib/cases/clinical-trajectory-engine";
import { evolveLabs } from "@/lib/cases/case-lab-evolution";
import { evolveVitals } from "@/lib/cases/vital-evolution";
import {
  buildMedicationAdherenceRecords,
  getActiveMedicationNames,
} from "@/lib/cases/medication-adherence";
import {
  generatePatientMessages,
  generateDelayedConsequences,
} from "@/lib/cases/patient-messaging";

// ── Main entry point ──────────────────────────────────────────────────────────

/**
 * Computes the full EvolvedStepState for a target step.
 *
 * @param patientCase     Full case definition (all steps)
 * @param decisions       All decisions made up to (not including) targetStepIndex
 * @param targetStepIndex The step for which to compute evolved state
 */
export function computeEvolvedStepState(
  patientCase: PatientCase,
  decisions: CaseDecisionRecord[],
  targetStepIndex: number,
): EvolvedStepState {
  if (targetStepIndex === 0 || decisions.length === 0) {
    return emptyEvolvedState();
  }

  // Trajectory state from all decisions so far
  const trajectoryState = computeTrajectoryState(decisions);

  // Medication adherence up to the step before target
  const adherenceRecords = buildMedicationAdherenceRecords(
    patientCase,
    decisions,
    targetStepIndex - 1,
  );
  const activeMeds = getActiveMedicationNames(adherenceRecords);

  // Disease labels from unresolved issues
  const diseaseLabels = trajectoryState.unresolvedClinicalIssues.map((i) => i.label);

  // Steps elapsed since baseline (approximate: 1 step = one follow-up interval)
  const stepsElapsed = targetStepIndex;

  // Evolved labs: start from the NEAREST prior lab panel, evolve forward
  const priorLabArtifact = findMostRecentLabPanel(patientCase, targetStepIndex - 1);
  const targetLabArtifact = findMostRecentLabPanel(patientCase, targetStepIndex);

  let evolvedLabs: EvolvedLabValue[] = [];
  if (priorLabArtifact && targetLabArtifact?.values) {
    const evolvedArtifact = evolveLabs(priorLabArtifact, activeMeds, diseaseLabels, 1);
    evolvedLabs = (evolvedArtifact.values ?? []).map((v) => {
      const authoredVal = targetLabArtifact.values?.find((a) => a.test === v.test);
      const priorVal = priorLabArtifact.values?.find((p) => p.test === v.test);
      const currentNum = parseFloat(v.value);
      const priorNum = priorVal ? parseFloat(priorVal.value) : currentNum;
      const delta = !isNaN(currentNum) && !isNaN(priorNum) ? currentNum - priorNum : undefined;

      return {
        test: v.test,
        value: v.value,
        unit: v.unit,
        referenceRange: authoredVal?.referenceRange ?? v.referenceRange,
        flag: v.flag,
        trend: deriveTrend(v.test, delta),
        deltaFromBaseline: delta,
      };
    });
  } else if (targetLabArtifact?.values) {
    // No prior labs to evolve from — return authored values with no trend
    evolvedLabs = targetLabArtifact.values.map((v) => ({ ...v }));
  }

  // Evolved vitals: from the step's authored vitals
  const targetStep = patientCase.steps[targetStepIndex];
  const priorStep = patientCase.steps[targetStepIndex - 1];
  let evolvedVitals = targetStep?.vitals.map((v) => ({ ...v })) ?? [];
  if (targetStep && priorStep && stepsElapsed > 0) {
    evolvedVitals = evolveVitals(
      targetStep.vitals,
      activeMeds,
      diseaseLabels,
      1,
      priorStep.vitals,
    );
  }

  // Patient messages
  const patientMessages = generatePatientMessages(
    targetStepIndex,
    trajectoryState,
    adherenceRecords,
  );

  // Delayed consequences
  const delayedConsequences = generateDelayedConsequences(
    targetStepIndex,
    trajectoryState,
  );

  return {
    evolvedLabs,
    evolvedVitals,
    patientMessages,
    medicationAdherenceRecords: adherenceRecords,
    delayedConsequences,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function emptyEvolvedState(): EvolvedStepState {
  return {
    evolvedLabs: [],
    evolvedVitals: [],
    patientMessages: [],
    medicationAdherenceRecords: [],
    delayedConsequences: [],
  };
}

/**
 * Finds the most recent lab panel artifact at or before the given step index.
 */
function findMostRecentLabPanel(
  patientCase: PatientCase,
  upToStepIndex: number,
) {
  for (let i = upToStepIndex; i >= 0; i--) {
    const step = patientCase.steps[i];
    if (!step) continue;
    const panel = step.diagnosticArtifacts.find(
      (a) => a.type === "lab_panel" && a.values && a.values.length > 0,
    );
    if (panel) return panel;
  }
  return null;
}

function deriveTrend(
  testName: string,
  delta: number | undefined,
): EvolvedLabValue["trend"] {
  if (delta === undefined) return "stable";
  const threshold = 0.05; // 5% relative — absolute threshold for small values
  if (Math.abs(delta) < threshold) return "stable";

  // Higher is better for: eGFR, Hb, platelets
  const higherBetter = /eGFR|Hb\b|hemoglobin|haemoglobin|platelets/i.test(testName);
  const improving = higherBetter ? delta > 0 : delta < 0;
  return improving ? "improving" : "worsening";
}
