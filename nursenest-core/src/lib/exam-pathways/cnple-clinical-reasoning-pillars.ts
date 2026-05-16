export type CnpleClinicalReasoningPillar = {
  id: string;
  title: string;
  description: string;
  learnerGoal: string;
  examples: readonly string[];
};

/**
 * Canonical NP/CNPLE reasoning framework.
 *
 * This file intentionally separates NP reasoning from generic RN-style
 * question-bank drilling. The goal is to drive future:
 *   - lesson sequencing
 *   - case generation
 *   - simulation analytics
 *   - remediation tagging
 *   - longitudinal patient follow-up
 */
export const CNPLE_CLINICAL_REASONING_PILLARS: readonly CnpleClinicalReasoningPillar[] = [
  {
    id: "diagnostic-reasoning",
    title: "Diagnostic Reasoning",
    description:
      "Differentiate likely diagnoses, identify dangerous alternatives, determine appropriate investigations, and avoid premature closure.",
    learnerGoal:
      "Move from symptom recognition toward defensible NP-level differential diagnosis construction.",
    examples: [
      "Chest pain differential progression",
      "Thyroid dysfunction workup",
      "Pediatric fever escalation",
      "Shortness of breath triage",
    ],
  },
  {
    id: "prescribing-and-pharmacotherapy",
    title: "Prescribing and Pharmacotherapy",
    description:
      "Apply evidence-based medication selection, contraindication screening, dose adjustment, titration, monitoring, and deprescribing logic.",
    learnerGoal:
      "Develop safe and defensible prescribing habits aligned with Canadian NP practice.",
    examples: [
      "Renal dosing adjustments",
      "Antibiotic stewardship",
      "Hypertension titration",
      "Medication interaction screening",
    ],
  },
  {
    id: "longitudinal-follow-up",
    title: "Longitudinal Follow-Up",
    description:
      "Track chronic disease progression across repeat visits while adjusting investigations, therapies, and patient education plans.",
    learnerGoal:
      "Reason across time instead of treating each encounter like an isolated question.",
    examples: [
      "Diabetes follow-up",
      "Heart failure progression",
      "Mental health medication review",
      "Prenatal care continuity",
    ],
  },
  {
    id: "clinical-prioritization",
    title: "Clinical Prioritization",
    description:
      "Identify unstable findings, red flags, escalation triggers, and immediate interventions during time-constrained assessment.",
    learnerGoal:
      "Recognize what cannot wait and what requires escalation, referral, or urgent intervention.",
    examples: [
      "Sepsis recognition",
      "Stroke red flags",
      "ECG instability patterns",
      "Acute pediatric deterioration",
    ],
  },
  {
    id: "preventive-and-population-health",
    title: "Preventive and Population Health",
    description:
      "Integrate screening, counseling, vaccination, risk reduction, and evidence-based preventive care into NP workflows.",
    learnerGoal:
      "Balance acute management with long-term health maintenance and prevention.",
    examples: [
      "Cancer screening schedules",
      "Smoking cessation counseling",
      "Vaccination planning",
      "Cardiovascular risk reduction",
    ],
  },
] as const;
