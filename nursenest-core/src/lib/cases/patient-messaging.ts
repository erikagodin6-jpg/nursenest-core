/**
 * Longitudinal patient messaging.
 *
 * Generates short patient-reported messages at each step based on
 * trajectory state and medication adherence.
 *
 * Messages are deterministic: same trajectory state → same messages.
 * They appear above the scenario text in the CENTER panel.
 */
import type {
  PatientMessage,
  ClinicalTrajectoryState,
  PatientStabilityState,
  MedicationAdherenceRecord,
} from "@/lib/cases/longitudinal-case-types";

// ── Message templates ─────────────────────────────────────────────────────────

const IMPROVEMENT_MESSAGES: string[] = [
  "\"I've been feeling better over the past few weeks — my energy is coming back.\"",
  "\"The medication seems to be helping. I've had fewer headaches.\"",
  "\"My breathing has been easier since we adjusted the treatment.\"",
  "\"I've been sleeping better and feel less swollen in my ankles.\"",
];

const STABLE_MESSAGES: string[] = [
  "\"About the same as last time, I'd say.\"",
  "\"I haven't noticed much change either way.\"",
  "\"Things have been manageable. No major new concerns.\"",
];

const WORSENING_MESSAGES: string[] = [
  "\"I've been more tired than usual and my legs feel heavy.\"",
  "\"I've noticed my shortness of breath is getting worse on exertion.\"",
  "\"The swelling in my ankles is back and seems worse.\"",
  "\"I've been feeling lightheaded when I stand up. I almost fell last week.\"",
];

const CRITICAL_MESSAGES: string[] = [
  "\"I've been feeling really unwell — worse than I've ever felt.\"",
  "\"I'm having trouble catching my breath even at rest now.\"",
  "\"My chest has been tight and I've been sweating a lot.\"",
];

const SIDE_EFFECT_MESSAGES: Record<string, string> = {
  amlodipine: "\"My ankles started swelling after the new medication.\"",
  "ace inhibitor": "\"I've developed a dry cough since starting the new blood pressure pill.\"",
  ramipril: "\"I've developed a dry cough since starting the new blood pressure pill.\"",
  lisinopril: "\"I've developed a dry cough since starting the new blood pressure pill.\"",
  metformin: "\"The new diabetes medication has been upsetting my stomach — some nausea after meals.\"",
  statin: "\"I've had some muscle aches since starting the cholesterol medication.\"",
  atorvastatin: "\"I've had some muscle aches since starting the cholesterol medication.\"",
  diuretic: "\"I've been going to the bathroom much more frequently since the water pill.\"",
  furosemide: "\"I've been going to the bathroom much more frequently since the water pill.\"",
  warfarin: "\"I've noticed some bruising on my arms — is that from the blood thinner?\"",
  opioid: "\"The pain medication is helping but I've been quite constipated.\"",
  beta: "\"I feel more tired since starting the new heart medication.\"",
  corticosteroid: "\"My blood sugar has been higher since the steroid — my home glucometer is showing higher readings.\"",
  prednisone: "\"My blood sugar has been higher since the steroid — my home glucometer is showing higher readings.\"",
};

// ── Delayed consequence messages ──────────────────────────────────────────────

const DELAYED_CONSEQUENCE_MESSAGES: Array<{
  issueCode: RegExp;
  summary: string;
  clinicalNote: string;
  severity: "warning" | "critical";
}> = [
  {
    issueCode: /uncontrolled_chronic_disease/,
    summary: "Uncontrolled chronic disease is now affecting lab values and vital signs.",
    clinicalNote: "A prior management gap is compounding. Review the rationale for step where the decision was missed.",
    severity: "warning",
  },
  {
    issueCode: /prescribing_gap/,
    summary: "The earlier prescribing gap is visible in today's results.",
    clinicalNote: "Medication effect is absent or insufficient. Consider reviewing the correct prescribing approach.",
    severity: "warning",
  },
  {
    issueCode: /escalation_delayed/,
    summary: "Delayed escalation from a prior visit has worsened the patient's condition.",
    clinicalNote: "Earlier urgent referral should have prevented this deterioration. Review the red-flag recognition rationale.",
    severity: "critical",
  },
  {
    issueCode: /diagnostic_gap/,
    summary: "A missed diagnostic at an earlier step is now manifesting clinically.",
    clinicalNote: "The investigation deferred earlier has allowed the condition to progress undetected.",
    severity: "warning",
  },
  {
    issueCode: /assessment_incomplete/,
    summary: "An incomplete assessment left a clinical problem unidentified.",
    clinicalNote: "A thorough initial assessment would have identified this finding earlier.",
    severity: "warning",
  },
];

// ── Message generators ────────────────────────────────────────────────────────

/**
 * Picks a message from a template array deterministically
 * based on the step index (avoids randomness).
 */
function pickMessage(messages: string[], stepIndex: number): string {
  return messages[stepIndex % messages.length]!;
}

/**
 * Generates patient-reported symptom messages for the current step.
 * Deterministic: same state → same messages.
 */
export function generatePatientMessages(
  stepIndex: number,
  trajectoryState: ClinicalTrajectoryState,
  medicationAdherence: MedicationAdherenceRecord[],
): PatientMessage[] {
  if (stepIndex === 0) return []; // No patient message at first step (baseline)

  const messages: PatientMessage[] = [];

  // Stability-based message
  const symptomMessage = stabilityMessage(trajectoryState.stabilityState, stepIndex);
  if (symptomMessage) messages.push(symptomMessage);

  // Medication side-effect messages (one per session, not per step)
  const newMeds = medicationAdherence.filter((r) => r.status === "started" && r.stepIndex === stepIndex - 1);
  for (const med of newMeds.slice(0, 1)) { // max one side-effect message per step
    const sideEffect = detectSideEffect(med.name);
    if (sideEffect) {
      messages.push({
        type: "side_effect",
        text: sideEffect,
        stepIndex,
      });
    }
  }

  return messages;
}

function stabilityMessage(state: PatientStabilityState, stepIndex: number): PatientMessage | null {
  switch (state) {
    case "improving":
      return {
        type: "symptom_improvement",
        text: pickMessage(IMPROVEMENT_MESSAGES, stepIndex),
        stepIndex,
      };
    case "stable":
      return {
        type: "neutral",
        text: pickMessage(STABLE_MESSAGES, stepIndex),
        stepIndex,
      };
    case "deteriorating":
      return {
        type: "symptom_worsening",
        text: pickMessage(WORSENING_MESSAGES, stepIndex),
        stepIndex,
      };
    case "critical":
      return {
        type: "symptom_worsening",
        text: pickMessage(CRITICAL_MESSAGES, stepIndex),
        stepIndex,
      };
  }
}

function detectSideEffect(medName: string): string | null {
  const lower = medName.toLowerCase();
  for (const [key, message] of Object.entries(SIDE_EFFECT_MESSAGES)) {
    if (lower.includes(key)) return message;
  }
  return null;
}

// ── Delayed consequence generator ────────────────────────────────────────────

/**
 * Generates delayed consequences for the current step
 * based on unresolved clinical issues from prior decisions.
 */
import type { DelayedConsequence } from "@/lib/cases/longitudinal-case-types";

export function generateDelayedConsequences(
  stepIndex: number,
  trajectoryState: ClinicalTrajectoryState,
): DelayedConsequence[] {
  if (stepIndex === 0) return [];

  const consequences: DelayedConsequence[] = [];

  for (const issue of trajectoryState.unresolvedClinicalIssues) {
    // Only surface consequences for issues that are at least 1 step old
    if (issue.stepIndex >= stepIndex) continue;

    for (const template of DELAYED_CONSEQUENCE_MESSAGES) {
      if (template.issueCode.test(issue.code)) {
        consequences.push({
          sourceStepIndex: issue.stepIndex,
          summary: template.summary,
          clinicalNote: template.clinicalNote,
          severity: template.severity,
        });
        break; // One consequence per issue
      }
    }
  }

  return consequences;
}
