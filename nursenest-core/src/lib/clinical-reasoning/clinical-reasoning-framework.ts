export type ClinicalReasoningStepKey =
  | "recognize"
  | "interpret"
  | "prioritize"
  | "act"
  | "evaluate"
  | "reflect";

export type ClinicalReasoningAudience =
  | "RN"
  | "RPN"
  | "NP"
  | "Allied Health"
  | "Pre-Nursing"
  | "Admissions";

export type ClinicalReasoningActivityKind =
  | "lesson"
  | "question"
  | "flashcard"
  | "simulation"
  | "ecg_activity"
  | "lab_activity"
  | "pharmacology_activity"
  | "clinical_skill";

export type ClinicalReasoningStep = {
  readonly key: ClinicalReasoningStepKey;
  readonly label: string;
  readonly learnerQuestion: string;
  readonly evidenceOfLearning: readonly string[];
};

export type ClinicalReasoningActivityStandard = {
  readonly kind: ClinicalReasoningActivityKind;
  readonly requiredSteps: readonly ClinicalReasoningStepKey[];
  readonly requiredTeachingElements: readonly string[];
  readonly mustTeachConsequence: boolean;
  readonly mustTeachEscalation: boolean;
};

export type ClinicalReasoningAudienceAdaptation = {
  readonly audience: ClinicalReasoningAudience;
  readonly emphasis: readonly string[];
  readonly scopeGuardrail: string;
};

export const CLINICAL_REASONING_STEPS: readonly ClinicalReasoningStep[] = [
  {
    key: "recognize",
    label: "Recognize",
    learnerQuestion: "What cues matter right now?",
    evidenceOfLearning: ["Identifies abnormal findings", "Separates relevant from distracting data", "Names early warning cues"],
  },
  {
    key: "interpret",
    label: "Interpret",
    learnerQuestion: "What is happening and why?",
    evidenceOfLearning: ["Connects cues to physiology", "Explains likely mechanism", "Compares plausible hypotheses"],
  },
  {
    key: "prioritize",
    label: "Prioritize",
    learnerQuestion: "What matters first, next, and later?",
    evidenceOfLearning: ["Ranks urgency", "Uses safety frameworks", "Distinguishes stable from unstable findings"],
  },
  {
    key: "act",
    label: "Act",
    learnerQuestion: "What should the clinician do now?",
    evidenceOfLearning: ["Chooses scope-safe action", "Escalates when needed", "Avoids delays that increase harm"],
  },
  {
    key: "evaluate",
    label: "Evaluate",
    learnerQuestion: "Did the action work?",
    evidenceOfLearning: ["Reassesses response", "Adjusts plan when the patient does not improve", "Documents outcome"],
  },
  {
    key: "reflect",
    label: "Reflect",
    learnerQuestion: "What pattern should be remembered for next time?",
    evidenceOfLearning: ["Names learner trap", "Creates retrieval cue", "Links to remediation or practice"],
  },
] as const;

export const CLINICAL_REASONING_AUDIENCE_ADAPTATIONS: readonly ClinicalReasoningAudienceAdaptation[] = [
  {
    audience: "RN",
    emphasis: ["bedside assessment", "prioritization", "delegation", "patient safety", "rapid escalation"],
    scopeGuardrail: "Keep actions inside RN nursing scope and emphasize assessment, intervention, delegation, and evaluation.",
  },
  {
    audience: "RPN",
    emphasis: ["predictability", "stable versus unstable clients", "scope escalation", "practical bedside safety"],
    scopeGuardrail: "Emphasize stable and predictable care while escalating unstable or complex changes promptly.",
  },
  {
    audience: "NP",
    emphasis: ["diagnostic reasoning", "management planning", "prescribing safety", "follow-up", "differential diagnosis"],
    scopeGuardrail: "Use advanced practice reasoning while preserving certification-specific scope and country-specific rules.",
  },
  {
    audience: "Allied Health",
    emphasis: ["profession-specific assessment", "handoff", "interprofessional escalation", "functional outcomes"],
    scopeGuardrail: "Adapt decisions to the learner profession and avoid nursing-only rationale language.",
  },
  {
    audience: "Pre-Nursing",
    emphasis: ["foundational science", "cause and effect", "terminology", "study transfer"],
    scopeGuardrail: "Use academic, confidence-building reasoning without implying independent clinical practice authority.",
  },
  {
    audience: "Admissions",
    emphasis: ["test reasoning", "professional judgment", "ethical reasoning", "communication", "study strategy"],
    scopeGuardrail: "Focus on entrance-exam and professionalism decisions instead of licensure-level bedside actions.",
  },
] as const;

const FULL_REASONING_SEQUENCE: readonly ClinicalReasoningStepKey[] = [
  "recognize",
  "interpret",
  "prioritize",
  "act",
  "evaluate",
  "reflect",
] as const;

export const CLINICAL_REASONING_ACTIVITY_STANDARDS: readonly ClinicalReasoningActivityStandard[] = [
  {
    kind: "lesson",
    requiredSteps: FULL_REASONING_SEQUENCE,
    requiredTeachingElements: [
      "clinical context",
      "pathophysiology",
      "assessment cues",
      "priority decisions",
      "what happens if missed",
      "knowledge check",
    ],
    mustTeachConsequence: true,
    mustTeachEscalation: true,
  },
  {
    kind: "question",
    requiredSteps: FULL_REASONING_SEQUENCE,
    requiredTeachingElements: [
      "why tested",
      "clinical context",
      "why correct",
      "why reasonable distractors are not best",
      "clinical application",
      "exam strategy",
    ],
    mustTeachConsequence: true,
    mustTeachEscalation: true,
  },
  {
    kind: "flashcard",
    requiredSteps: ["recognize", "interpret", "reflect"],
    requiredTeachingElements: ["clinical relevance", "memory hook", "clinical pearl", "related practice"],
    mustTeachConsequence: true,
    mustTeachEscalation: false,
  },
  {
    kind: "simulation",
    requiredSteps: FULL_REASONING_SEQUENCE,
    requiredTeachingElements: ["clinical context", "decision points", "patient response", "delayed-action consequence", "debrief"],
    mustTeachConsequence: true,
    mustTeachEscalation: true,
  },
  {
    kind: "ecg_activity",
    requiredSteps: FULL_REASONING_SEQUENCE,
    requiredTeachingElements: ["clinical context", "rhythm cues", "mechanism", "hemodynamic impact", "first action", "medication safety"],
    mustTeachConsequence: true,
    mustTeachEscalation: true,
  },
  {
    kind: "lab_activity",
    requiredSteps: FULL_REASONING_SEQUENCE,
    requiredTeachingElements: ["clinical context", "abnormal pattern", "trend interpretation", "clinical risk", "notification threshold"],
    mustTeachConsequence: true,
    mustTeachEscalation: true,
  },
  {
    kind: "pharmacology_activity",
    requiredSteps: FULL_REASONING_SEQUENCE,
    requiredTeachingElements: ["clinical context", "mechanism", "contraindication", "monitoring", "hold parameters", "patient education"],
    mustTeachConsequence: true,
    mustTeachEscalation: true,
  },
  {
    kind: "clinical_skill",
    requiredSteps: FULL_REASONING_SEQUENCE,
    requiredTeachingElements: ["clinical context", "indication", "safety check", "complication cue", "documentation", "reassessment"],
    mustTeachConsequence: true,
    mustTeachEscalation: true,
  },
] as const;

export function clinicalReasoningStep(key: ClinicalReasoningStepKey): ClinicalReasoningStep {
  const step = CLINICAL_REASONING_STEPS.find((item) => item.key === key);
  if (!step) throw new Error(`Unknown clinical reasoning step: ${key}`);
  return step;
}

export function clinicalReasoningActivityStandard(kind: ClinicalReasoningActivityKind): ClinicalReasoningActivityStandard {
  const standard = CLINICAL_REASONING_ACTIVITY_STANDARDS.find((item) => item.kind === kind);
  if (!standard) throw new Error(`Unknown clinical reasoning activity kind: ${kind}`);
  return standard;
}

export function auditClinicalReasoningFramework(): readonly string[] {
  const issues: string[] = [];
  const stepKeys = new Set(CLINICAL_REASONING_STEPS.map((step) => step.key));
  for (const required of FULL_REASONING_SEQUENCE) {
    if (!stepKeys.has(required)) issues.push(`missing clinical reasoning step: ${required}`);
  }
  for (const standard of CLINICAL_REASONING_ACTIVITY_STANDARDS) {
    if (standard.requiredSteps.length < 3) issues.push(`${standard.kind} has too few reasoning steps`);
    if (!standard.requiredTeachingElements.includes("clinical context") && standard.kind !== "flashcard") {
      issues.push(`${standard.kind} must include clinical context`);
    }
    if (standard.kind !== "flashcard" && !standard.mustTeachEscalation) {
      issues.push(`${standard.kind} must teach escalation thinking`);
    }
    if (!standard.mustTeachConsequence) issues.push(`${standard.kind} must teach clinical consequences`);
  }
  const audiences = new Set(CLINICAL_REASONING_AUDIENCE_ADAPTATIONS.map((item) => item.audience));
  for (const audience of ["RN", "RPN", "NP", "Allied Health", "Pre-Nursing", "Admissions"] as const) {
    if (!audiences.has(audience)) issues.push(`missing audience adaptation: ${audience}`);
  }
  return issues;
}
