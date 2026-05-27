import type { HealthcareProgramTier } from "@/lib/nursing-tiers/tier-pedagogy-profile";

export type LicensingExamStyle =
  | "NCLEX-RN"
  | "REx-PN"
  | "NP-board-style"
  | "Allied-Health-licensing";

export type LicensingExamStyleStandard = {
  tier: HealthcareProgramTier;
  style: LicensingExamStyle;
  purpose: string;
  requiredQualities: readonly string[];
  preferredDecisionFrames: readonly string[];
  avoid: readonly string[];
  scopeGuardrails: readonly string[];
};

export type LicensingExamStyleInput = {
  tier: HealthcareProgramTier;
  stem?: string | null;
  options?: unknown;
  rationale?: string | null;
  clinicalReasoning?: string | null;
  cognitiveLevel?: string | null;
  nclexCategory?: string | null;
};

export type LicensingExamStyleIssueCode =
  | "RECALL_OR_TRIVIA_STYLE"
  | "MISSING_PATIENT_SCENARIO"
  | "MISSING_CLINICAL_JUDGMENT"
  | "MISSING_CUE_RECOGNITION"
  | "MISSING_DECISION_POINT"
  | "MISSING_PATIENT_OUTCOME_OR_SAFETY"
  | "MISSING_MULTI_CONCEPT_INTEGRATION"
  | "NON_BEDSIDE_LANGUAGE"
  | "SPECIALTY_COMPLEXITY_DRIFT"
  | "PROVIDER_DECISION_DRIFT"
  | "TIER_SCOPE_MISMATCH";

export type LicensingExamStyleIssue = {
  code: LicensingExamStyleIssueCode;
  severity: "warning" | "error";
  message: string;
  remediation: string;
};

export type LicensingExamStyleResult = {
  pass: boolean;
  score: number;
  standard: LicensingExamStyleStandard;
  issues: LicensingExamStyleIssue[];
};

const SHARED_REQUIRED_QUALITIES = [
  "scenario-based clinical reasoning",
  "cue recognition",
  "patient safety or outcome emphasis",
  "decision-making under realistic bedside conditions",
  "application over memorization",
  "plausible ambiguity with a defensible best answer",
] as const;

const SHARED_AVOID = [
  "isolated trivia",
  "definition-only stems",
  "recall-only medication facts without a patient context",
  "generic textbook language",
  "unrealistic or cartoonish bedside actions",
  "questions made hard only through obscure facts",
] as const;

export const LICENSING_EXAM_STYLE_STANDARDS: Record<
  HealthcareProgramTier,
  LicensingExamStyleStandard
> = {
  RPN: {
    tier: "RPN",
    style: "REx-PN",
    purpose:
      "REx-PN style items should test foundational clinical judgment, safe bedside care, recognition, reporting, and stable-vs-changing client cues.",
    requiredQualities: SHARED_REQUIRED_QUALITIES,
    preferredDecisionFrames: [
      "expected vs unexpected finding",
      "recognize and report",
      "basic assessment before routine care",
      "safe practical-nurse intervention",
      "patient teaching within scope",
    ],
    avoid: [
      ...SHARED_AVOID,
      "independent diagnosis or prescribing",
      "advanced unstable-client management ownership",
    ],
    scopeGuardrails: [
      "Scale realism through safety, recognition, reporting, and predictable bedside care.",
      "Do not make REx-PN items feel advanced by shifting them into RN/NP decision ownership.",
    ],
  },
  RN: {
    tier: "RN",
    style: "NCLEX-RN",
    purpose:
      "NCLEX-RN style items should emphasize clinical judgment, prioritization, safety, cue recognition, delegation, and nursing intervention sequencing.",
    requiredQualities: SHARED_REQUIRED_QUALITIES,
    preferredDecisionFrames: [
      "which client should be seen first",
      "which action should the nurse take first",
      "which finding requires follow-up",
      "which task can be delegated",
      "which response indicates deterioration or improvement",
    ],
    avoid: [
      ...SHARED_AVOID,
      "highly specialized ICU management",
      "advanced ventilator management",
      "physician-level diagnosis or prescribing",
      "selecting medical diagnoses or treatment plans instead of nursing actions",
      "respiratory therapist-specific interventions",
      "rare specialty procedures",
      "obscure memorization used as difficulty",
    ],
    scopeGuardrails: [
      "Keep items entry-level RN: safety, prioritization, delegation, trends, education, and deterioration recognition.",
      "Avoid physician-level or specialist-only decision-making.",
    ],
  },
  NP: {
    tier: "NP",
    style: "NP-board-style",
    purpose:
      "NP board-style items should test advanced assessment, differential diagnosis, diagnostic interpretation, management, medication safety, follow-up, and escalation.",
    requiredQualities: SHARED_REQUIRED_QUALITIES,
    preferredDecisionFrames: [
      "most likely diagnosis or differential",
      "initial evidence-based management",
      "which diagnostic test changes management",
      "which medication is safest given contraindications",
      "which follow-up or escalation plan is indicated",
    ],
    avoid: [
      ...SHARED_AVOID,
      "RN-only task delegation as the endpoint",
      "treatment plans without monitoring or follow-up",
      "diagnosis questions that do not affect management",
    ],
    scopeGuardrails: [
      "Scale through diagnostic uncertainty, pharmacologic judgment, diagnostic interpretation, and longitudinal management.",
      "Do not flatten NP content into simple RN care-priority items.",
    ],
  },
  ALLIED: {
    tier: "ALLIED",
    style: "Allied-Health-licensing",
    purpose:
      "Allied Health licensing-style items should test profession-specific workflow, safety checks, scope, communication, documentation, interpretation, and escalation.",
    requiredQualities: SHARED_REQUIRED_QUALITIES,
    preferredDecisionFrames: [
      "which safety check should occur first",
      "which finding must be escalated",
      "which documentation or handoff is most appropriate",
      "which action stays within profession scope",
      "which workflow error threatens patient safety",
    ],
    avoid: [
      ...SHARED_AVOID,
      "RN care-plan framing as the default",
      "profession-agnostic healthcare trivia",
      "scope-inappropriate diagnosis or treatment ownership",
    ],
    scopeGuardrails: [
      "Preserve profession-specific terminology, workflow, and scope while using the shared NurseNest question structure.",
      "Do not make Allied Health exams feel like recycled RN items.",
    ],
  },
} as const;

function text(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseArrayish(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function optionText(option: unknown): string {
  if (typeof option === "string") return option.trim();
  if (option && typeof option === "object") {
    const record = option as Record<string, unknown>;
    return text(String(record.text ?? record.content ?? record.label ?? ""));
  }
  return "";
}

function countMatches(value: string, patterns: readonly RegExp[]): number {
  return patterns.reduce((sum, pattern) => sum + (pattern.test(value) ? 1 : 0), 0);
}

function addIssue(issues: LicensingExamStyleIssue[], issue: LicensingExamStyleIssue): void {
  issues.push(issue);
}

const RECALL_PATTERNS = [
  /^\s*(what is|define|which term|what does .* mean|list|identify the definition)\b/i,
  /\bmemorize|definition|textbook term|stands for\b/i,
] as const;

const PATIENT_SCENARIO_PATTERNS = [
  /\b(client|patient|resident|infant|child|adolescent|adult|older adult|pregnant|postpartum|caregiver|family)\b/i,
  /\b\d{1,3}[- ]year[- ]old\b/i,
] as const;

const CUE_PATTERNS = [
  /\b(vital signs?|temperature|heart rate|pulse|respiratory rate|blood pressure|spo2|oxygen saturation)\b/i,
  /\b(lab|glucose|potassium|sodium|creatinine|hemoglobin|wbc|platelet|x-ray|ecg|imaging)\b/i,
  /\b(reports?|states?|assessment|finding|new|worsening|increased|decreased|change|trend)\b/i,
] as const;

const DECISION_PATTERNS = [
  /\b(first|priority|best|most appropriate|next|initial|requires follow-up|should the nurse|should the provider|should the technologist)\b/i,
  /\b(intervention|action|teaching|delegate|escalate|notify|communicate|document|administer|hold|monitor)\b/i,
] as const;

const OUTCOME_OR_SAFETY_PATTERNS = [
  /\b(safety|risk|harm|deteriorat|unstable|immediate|urgent|fall|airway|breathing|circulation|infection|bleeding|hypoxia|shock)\b/i,
] as const;

const MULTI_CONCEPT_PATTERNS = [
  /\b(while|despite|after|before|because|however|but|with history of|taking|receiving)\b/i,
  /\b(comorbid|medication|allergy|contraindication|delegation|scope|trend|follow-up|education|handoff)\b/i,
] as const;

const NON_BEDSIDE_PATTERNS = [
  /\b(according to the textbook|in general theory|purely conceptual|memorization only|academic definition)\b/i,
] as const;

const SPECIALTY_COMPLEXITY_PATTERNS = [
  /\b(mechanically ventilated|ventilator mode|ventilator settings?|tidal volume|plateau pressure|peep adjustment)\b/i,
  /\b(arterial line|central venous pressure|swan-ganz|pulmonary artery catheter|wedge pressure)\b/i,
  /\b(vasopressor titration|titrate norepinephrine|titrated vasopressor|intra-aortic balloon|ecmo|crrt)\b/i,
  /\b(intracranial pressure monitoring|icp monitoring|advanced hemodynamic)\b/i,
] as const;

const PROVIDER_DECISION_PATTERNS = [
  /\b(which diagnosis should be made|diagnose the client|prescribe|write an order|order a ct|order an mri)\b/i,
  /\b(select the antibiotic regimen|choose the surgical procedure|determine medical treatment plan)\b/i,
] as const;

const SCOPE_MISMATCH_PATTERNS: Record<HealthcareProgramTier, readonly RegExp[]> = {
  RPN: [/\bdiagnose|prescribe|intubate|vasopressor|central line|adjust ventilator\b/i],
  RN: [/\bprescribe\b|diagnose\b|intubate|adjust ventilator settings|insert central line|perform surgery\b/i],
  NP: [/\bnone impossible marker\b/i],
  ALLIED: [/\bnursing care plan|prescribe|diagnose and treat|independent medical management\b/i],
};

export function resolveLicensingExamStyleStandard(
  tier: HealthcareProgramTier,
): LicensingExamStyleStandard {
  return LICENSING_EXAM_STYLE_STANDARDS[tier];
}

export function evaluateLicensingExamStyle(
  input: LicensingExamStyleInput,
): LicensingExamStyleResult {
  const standard = resolveLicensingExamStyleStandard(input.tier);
  const stem = text(input.stem);
  const rationale = text(input.rationale);
  const reasoning = text(input.clinicalReasoning);
  const options = parseArrayish(input.options).map(optionText).filter(Boolean);
  const combined = [stem, rationale, reasoning, ...options].join(" ");
  const issues: LicensingExamStyleIssue[] = [];

  if (countMatches(stem, RECALL_PATTERNS) > 0 && countMatches(stem, PATIENT_SCENARIO_PATTERNS) === 0) {
    addIssue(issues, {
      code: "RECALL_OR_TRIVIA_STYLE",
      severity: "error",
      message: "Stem is recall/trivia-style rather than licensing-exam clinical reasoning.",
      remediation: "Rewrite as a patient scenario that asks for a decision, priority, intervention, teaching, or escalation.",
    });
  }

  if (countMatches(stem, PATIENT_SCENARIO_PATTERNS) === 0) {
    addIssue(issues, {
      code: "MISSING_PATIENT_SCENARIO",
      severity: "error",
      message: "Question lacks a realistic patient/client or workflow scenario.",
      remediation: "Add bedside or profession-specific context with patient/client status and relevant cues.",
    });
  }

  if (countMatches(combined, CUE_PATTERNS) === 0) {
    addIssue(issues, {
      code: "MISSING_CUE_RECOGNITION",
      severity: "error",
      message: "Question does not require cue recognition.",
      remediation: "Add assessment findings, changing status, labs/imaging, medications, orders, or workflow data the learner must interpret.",
    });
  }

  if (countMatches(stem, DECISION_PATTERNS) === 0) {
    addIssue(issues, {
      code: "MISSING_DECISION_POINT",
      severity: "error",
      message: "Question lacks a clear clinical decision point.",
      remediation: "Ask for the best first action, priority finding, intervention, escalation, delegation, education, or management step.",
    });
  }

  if (countMatches(combined, OUTCOME_OR_SAFETY_PATTERNS) === 0) {
    addIssue(issues, {
      code: "MISSING_PATIENT_OUTCOME_OR_SAFETY",
      severity: "warning",
      message: "Question does not clearly emphasize safety, harm prevention, or patient outcome.",
      remediation: "Tie the item to deterioration, risk reduction, safety, escalation, or expected patient outcome.",
    });
  }

  if (countMatches(combined, MULTI_CONCEPT_PATTERNS) < 2) {
    addIssue(issues, {
      code: "MISSING_MULTI_CONCEPT_INTEGRATION",
      severity: "warning",
      message: "Question may test a single isolated concept instead of an integrated reasoning chain.",
      remediation: "Integrate multiple concepts such as symptoms plus medication, trend plus delegation, or workflow plus safety.",
    });
  }

  if (
    countMatches(combined, DECISION_PATTERNS) === 0 ||
    (text(input.cognitiveLevel).toLowerCase() === "recall" && countMatches(combined, MULTI_CONCEPT_PATTERNS) < 2)
  ) {
    addIssue(issues, {
      code: "MISSING_CLINICAL_JUDGMENT",
      severity: "error",
      message: "Question does not demonstrate modern clinical-judgment reasoning.",
      remediation: "Require interpretation, prioritization, decision-making, or application under realistic clinical conditions.",
    });
  }

  if (countMatches(combined, NON_BEDSIDE_PATTERNS) > 0) {
    addIssue(issues, {
      code: "NON_BEDSIDE_LANGUAGE",
      severity: "warning",
      message: "Question uses academic or generic language instead of realistic bedside/workflow language.",
      remediation: "Use natural patient-care language and profession-specific workflow details.",
    });
  }

  if ((input.tier === "RN" || input.tier === "RPN") && countMatches(combined, SPECIALTY_COMPLEXITY_PATTERNS) > 0) {
    addIssue(issues, {
      code: "SPECIALTY_COMPLEXITY_DRIFT",
      severity: "error",
      message: "Question drifts into specialty/ICU complexity instead of entry-level licensing judgment.",
      remediation:
        "Reframe around recognition of deterioration, basic nursing safety actions, escalation, delegation, or patient teaching.",
    });
  }

  if ((input.tier === "RN" || input.tier === "RPN") && countMatches(combined, PROVIDER_DECISION_PATTERNS) > 0) {
    addIssue(issues, {
      code: "PROVIDER_DECISION_DRIFT",
      severity: "error",
      message: "Question asks for provider-level diagnosis, prescribing, ordering, or treatment-plan decisions.",
      remediation:
        "Ask what the nurse should assess, do first, teach, delegate, hold/question, report, or evaluate.",
    });
  }

  if (SCOPE_MISMATCH_PATTERNS[input.tier].some((pattern) => pattern.test(combined))) {
    addIssue(issues, {
      code: "TIER_SCOPE_MISMATCH",
      severity: "error",
      message: "Question contains decision-making outside the selected exam/tier scope.",
      remediation: "Keep realism and complexity aligned to the learner's profession and expected licensing exam scope.",
    });
  }

  const score = Math.max(
    0,
    100 -
      issues.reduce((penalty, issue) => {
        return penalty + (issue.severity === "error" ? 18 : 8);
      }, 0),
  );

  return {
    pass: score >= 80 && !issues.some((issue) => issue.severity === "error"),
    score,
    standard,
    issues,
  };
}
