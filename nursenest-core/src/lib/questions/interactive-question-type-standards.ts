import type { HealthcareProgramTier } from "@/lib/nursing-tiers/tier-pedagogy-profile";
import type {
  PracticeQuestionScoringRule,
  PracticeQuestionType,
} from "@/lib/practice-tests/practice-question-rendering-engine";

export type InteractiveQuestionCapability =
  | "partial_correctness"
  | "unsafe_pattern_tracking"
  | "hesitation_tracking"
  | "misconception_tracking"
  | "confidence_calibration"
  | "adaptive_difficulty"
  | "progressive_hints"
  | "deep_rationale"
  | "touch_accessibility";

export type InteractiveQuestionTypeStandard = {
  type: PracticeQuestionType;
  label: string;
  purpose: string;
  requiredPayload: readonly string[];
  allowedScoringRules: readonly PracticeQuestionScoringRule[];
  adaptiveSignals: readonly InteractiveQuestionCapability[];
  tierFit: Record<HealthcareProgramTier, string>;
  requiredClinicalReasoning: readonly string[];
};

export type InteractiveQuestionDefinitionInput = {
  type: PracticeQuestionType;
  payloadKeys: readonly string[];
  scoringRule: PracticeQuestionScoringRule;
  tier: HealthcareProgramTier;
  rationaleSections?: readonly string[];
  adaptiveSignals?: readonly InteractiveQuestionCapability[];
  accessibility?: {
    keyboardOperable?: boolean;
    touchTargetSafe?: boolean;
    screenReaderLabels?: boolean;
  };
};

export type InteractiveQuestionTypeIssueCode =
  | "UNSUPPORTED_TYPE"
  | "MISSING_REQUIRED_PAYLOAD"
  | "INVALID_SCORING_RULE"
  | "MISSING_ADAPTIVE_SIGNAL"
  | "MISSING_RATIONALE_SUPPORT"
  | "MISSING_ACCESSIBILITY_SUPPORT"
  | "TIER_SCOPE_WARNING";

export type InteractiveQuestionTypeIssue = {
  code: InteractiveQuestionTypeIssueCode;
  severity: "warning" | "error";
  message: string;
  remediation: string;
};

export type InteractiveQuestionTypeValidationResult = {
  pass: boolean;
  standard: InteractiveQuestionTypeStandard | null;
  issues: InteractiveQuestionTypeIssue[];
};

const SHARED_SIGNALS = [
  "hesitation_tracking",
  "misconception_tracking",
  "confidence_calibration",
  "adaptive_difficulty",
  "progressive_hints",
  "deep_rationale",
  "touch_accessibility",
] as const satisfies readonly InteractiveQuestionCapability[];

const SAFETY_SIGNALS = [
  ...SHARED_SIGNALS,
  "unsafe_pattern_tracking",
  "partial_correctness",
] as const satisfies readonly InteractiveQuestionCapability[];

const SHARED_TIER_FIT: Record<HealthcareProgramTier, string> = {
  RPN: "Use stable-client, recognition/reporting, routine procedure, and scope-safe safety decisions.",
  RN: "Use prioritization, delegation, trend recognition, clinical judgment, and complex bedside decisions.",
  NP: "Use diagnostic reasoning, advanced management, prescribing safety, and follow-up decisions.",
  ALLIED: "Use profession-specific workflow, diagnostic/technical responsibilities, communication, and escalation.",
};

export const INTERACTIVE_QUESTION_TYPE_STANDARDS: Record<
  PracticeQuestionType,
  InteractiveQuestionTypeStandard
> = {
  single: {
    type: "single",
    label: "Single Best Answer",
    purpose: "Test one safest or most appropriate decision when several options may appear plausible.",
    requiredPayload: ["stem", "options", "correctAnswer"],
    allowedScoringRules: ["exact"],
    adaptiveSignals: SHARED_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["clinical judgment", "patient safety", "distractor discrimination"],
  },
  multiple: {
    type: "multiple",
    label: "Select-All-That-Apply",
    purpose: "Test nuanced selection of multiple safe interventions or cues without all-or-none clues.",
    requiredPayload: ["stem", "options", "correctAnswers"],
    allowedScoringRules: ["partial-credit", "exact"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["unsafe-option differentiation", "cue recognition", "partial correctness"],
  },
  ordered: {
    type: "ordered",
    label: "Ordered Response",
    purpose: "Test workflow sequencing, escalation timing, emergency response order, or sterile/procedure order.",
    requiredPayload: ["stem", "steps", "correctOrder"],
    allowedScoringRules: ["ordered", "partial-credit"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["procedural reasoning", "prioritization logic", "escalation timing"],
  },
  matrix: {
    type: "matrix",
    label: "Matrix Grid",
    purpose: "Test classification across several findings or interventions, such as stable/unstable or expected/unexpected.",
    requiredPayload: ["stem", "rows", "columns", "correctCells"],
    allowedScoringRules: ["matrix", "partial-credit", "classification"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["clinical comparison", "scope differentiation", "classification reasoning"],
  },
  bowtie: {
    type: "bowtie",
    label: "Bow-Tie",
    purpose: "Test NGN cue linkage: condition, priority actions, and parameters to monitor.",
    requiredPayload: ["scenario", "conditionOptions", "actionOptions", "monitoringOptions", "correctAnswer"],
    allowedScoringRules: ["multi-part", "partial-credit"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["cue linkage", "clinical judgment", "priority monitoring"],
  },
  cloze: {
    type: "cloze",
    label: "Cloze / Drop-Down",
    purpose: "Test authentic completion of medication, lab, documentation, diagnosis, or intervention decisions.",
    requiredPayload: ["stem", "blanks", "dropdownOptions", "correctSelections"],
    allowedScoringRules: ["multi-part", "partial-credit", "exact"],
    adaptiveSignals: SHARED_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["interpretation", "calculation safety", "documentation precision"],
  },
  hotspot: {
    type: "hotspot",
    label: "Hotspot",
    purpose: "Test anatomy, injection sites, ECG/wound/radiology localization, or equipment recognition.",
    requiredPayload: ["stem", "media", "hotspotRegions", "correctRegions"],
    allowedScoringRules: ["hotspot", "partial-credit"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["visual interpretation", "touch accuracy", "safety localization"],
  },
  "case-study": {
    type: "case-study",
    label: "Evolving Case Study",
    purpose: "Simulate longitudinal bedside workflow with evolving symptoms, vitals, labs, orders, and reassessment.",
    requiredPayload: ["patientProfile", "timeline", "tabs", "items"],
    allowedScoringRules: ["multi-part", "partial-credit"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["evolving cues", "reassessment", "interdisciplinary communication"],
  },
  "chart-review": {
    type: "chart-review",
    label: "Chart Review / EHR Simulation",
    purpose: "Require MAR, notes, labs, I/O, imaging, orders, and trend review to identify safety concerns.",
    requiredPayload: ["chartTabs", "orders", "labs", "notes", "questionTasks"],
    allowedScoringRules: ["multi-part", "partial-credit", "classification"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["trend analysis", "contraindication recognition", "missed finding detection"],
  },
  highlight: {
    type: "highlight",
    label: "Highlight / Select-in-Passage",
    purpose: "Test recognition of relevant cues inside chart notes, handoff text, or assessment passages.",
    requiredPayload: ["passage", "selectableSegments", "correctSegments"],
    allowedScoringRules: ["partial-credit", "classification"],
    adaptiveSignals: SHARED_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["cue recognition", "signal-vs-noise filtering", "documentation interpretation"],
  },
  trend: {
    type: "trend",
    label: "Trend / Chart Interpretation",
    purpose: "Test interpretation of serial vitals, labs, telemetry, I/O, or symptom progression.",
    requiredPayload: ["trendData", "timepoints", "questionTasks", "correctInterpretation"],
    allowedScoringRules: ["exact", "partial-credit", "classification"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["trend recognition", "deterioration recognition", "intervention timing"],
  },
  "extended-matching": {
    type: "extended-matching",
    label: "Extended Matching",
    purpose: "Test diagnostic differentiation, pharmacology matching, or intervention selection across multiple mini-scenarios.",
    requiredPayload: ["optionBank", "scenarios", "correctMatches"],
    allowedScoringRules: ["matching", "partial-credit"],
    adaptiveSignals: SHARED_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["differential comparison", "pattern recognition", "option discrimination"],
  },
  multimedia: {
    type: "multimedia",
    label: "Multimedia-Based",
    purpose: "Integrate ECG strips, sounds, imaging, wounds, labels, or equipment into clinical interpretation.",
    requiredPayload: ["media", "stem", "interaction", "correctResponse"],
    allowedScoringRules: ["exact", "partial-credit", "hotspot", "classification"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["visual or auditory reasoning", "clinical interpretation", "safety cue recognition"],
  },
  "decision-tree": {
    type: "decision-tree",
    label: "Simulation Decision Tree",
    purpose: "Create branching clinical scenarios where choices alter patient condition and outcomes.",
    requiredPayload: ["initialState", "branches", "outcomes", "unsafeChoices"],
    allowedScoringRules: ["decision-tree", "partial-credit", "multi-part"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["branching decisions", "reassessment", "consequence-based learning"],
  },
  delegation: {
    type: "delegation",
    label: "Delegation & Assignment",
    purpose: "Test workload management, Canadian scope, acuity matching, and unsafe assignment recognition.",
    requiredPayload: ["staffRoles", "patientAssignments", "tasks", "correctAssignments"],
    allowedScoringRules: ["matching", "partial-credit", "classification"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: {
      ...SHARED_TIER_FIT,
      RPN: "Use RPN recognition/reporting, stable-client assignments, and tasks within practical-nurse scope.",
      RN: "Use RN accountability for acuity, delegation, supervision, and unstable-patient prioritization.",
    },
    requiredClinicalReasoning: ["scope of practice", "acuity recognition", "unsafe delegation"],
  },
  triage: {
    type: "triage",
    label: "Triage & Prioritization",
    purpose: "Require ranking patients, first-to-see decisions, escalation urgency, and deterioration recognition.",
    requiredPayload: ["patients", "acuityCues", "correctPriorityOrder"],
    allowedScoringRules: ["ordered", "partial-credit"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["competing priorities", "incomplete information", "unstable-vs-stable comparison"],
  },
  "medication-safety": {
    type: "medication-safety",
    label: "Medication Safety",
    purpose: "Test dose verification, interactions, contraindications, high-alert meds, timing, adverse effects, and teaching.",
    requiredPayload: ["medicationData", "patientData", "safetyTask", "correctResponse"],
    allowedScoringRules: ["exact", "partial-credit", "multi-part", "classification"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["contraindication recognition", "high-alert safety", "patient education"],
  },
  "communication-documentation": {
    type: "communication-documentation",
    label: "Communication & Documentation",
    purpose: "Test SBAR, handoff, therapeutic communication, legal charting, and documentation correction.",
    requiredPayload: ["scenario", "communicationOptions", "correctResponse"],
    allowedScoringRules: ["exact", "partial-credit", "classification"],
    adaptiveSignals: SHARED_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["professional communication", "legal documentation", "patient-centered language"],
  },
  ranking: {
    type: "ranking",
    label: "Priority Ranking",
    purpose: "Test ordered prioritization of patients, tasks, interventions, or escalation steps.",
    requiredPayload: ["items", "correctOrder", "priorityRationale"],
    allowedScoringRules: ["ordered", "partial-credit"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["priority ranking", "stability comparison", "timing"],
  },
  "clinical-judgment": {
    type: "clinical-judgment",
    label: "Layered Clinical Judgment",
    purpose: "Test cue recognition, hypothesis generation, action, monitoring, and evaluation in one layered item.",
    requiredPayload: ["scenario", "layers", "correctResponses"],
    allowedScoringRules: ["multi-part", "partial-credit"],
    adaptiveSignals: SAFETY_SIGNALS,
    tierFit: SHARED_TIER_FIT,
    requiredClinicalReasoning: ["cue recognition", "hypothesis generation", "evaluation"],
  },
} as const;

export function questionTypeStandardFor(type: PracticeQuestionType): InteractiveQuestionTypeStandard {
  return INTERACTIVE_QUESTION_TYPE_STANDARDS[type];
}

function addIssue(
  issues: InteractiveQuestionTypeIssue[],
  issue: InteractiveQuestionTypeIssue,
): void {
  issues.push(issue);
}

export function validateInteractiveQuestionDefinition(
  input: InteractiveQuestionDefinitionInput,
): InteractiveQuestionTypeValidationResult {
  const standard = INTERACTIVE_QUESTION_TYPE_STANDARDS[input.type] ?? null;
  const issues: InteractiveQuestionTypeIssue[] = [];

  if (!standard) {
    addIssue(issues, {
      code: "UNSUPPORTED_TYPE",
      severity: "error",
      message: `Question type ${input.type} is not registered in the interactive question standards.`,
      remediation: "Add a type standard before rendering or scoring this question format.",
    });
    return { pass: false, standard, issues };
  }

  const payloadKeys = new Set(input.payloadKeys);
  for (const key of standard.requiredPayload) {
    if (!payloadKeys.has(key)) {
      addIssue(issues, {
        code: "MISSING_REQUIRED_PAYLOAD",
        severity: "error",
        message: `${standard.label} is missing required payload key "${key}".`,
        remediation: "Provide the full structured payload needed by the renderer and scoring engine.",
      });
    }
  }

  if (!standard.allowedScoringRules.includes(input.scoringRule)) {
    addIssue(issues, {
      code: "INVALID_SCORING_RULE",
      severity: "error",
      message: `${input.scoringRule} is not an allowed scoring rule for ${standard.label}.`,
      remediation: `Use one of: ${standard.allowedScoringRules.join(", ")}.`,
    });
  }

  const providedSignals = new Set(input.adaptiveSignals ?? []);
  for (const signal of ["confidence_calibration", "adaptive_difficulty", "deep_rationale"] as const) {
    if (!providedSignals.has(signal)) {
      addIssue(issues, {
        code: "MISSING_ADAPTIVE_SIGNAL",
        severity: "error",
        message: `${standard.label} must report ${signal} for adaptive learning integration.`,
        remediation: "Map answer attempts into mastery, confidence, remediation, and readiness signals.",
      });
    }
  }

  const rationaleSections = new Set(input.rationaleSections ?? []);
  for (const section of ["why_correct", "why_incorrect", "patient_safety"] as const) {
    if (!rationaleSections.has(section)) {
      addIssue(issues, {
        code: "MISSING_RATIONALE_SUPPORT",
        severity: "error",
        message: `${standard.label} must support ${section} rationale teaching.`,
        remediation: "Attach deep rationale sections that explain correct reasoning, wrong-answer traps, and safety implications.",
      });
    }
  }

  if (
    !input.accessibility?.keyboardOperable ||
    !input.accessibility.touchTargetSafe ||
    !input.accessibility.screenReaderLabels
  ) {
    addIssue(issues, {
      code: "MISSING_ACCESSIBILITY_SUPPORT",
      severity: "error",
      message: `${standard.label} is missing accessibility support.`,
      remediation: "Ensure keyboard operation, touch-safe targets, and screen-reader labels before release.",
    });
  }

  if (input.tier === "RPN" && ["decision-tree", "extended-matching"].includes(input.type)) {
    addIssue(issues, {
      code: "TIER_SCOPE_WARNING",
      severity: "warning",
      message: `${standard.label} can be used for RPN only when scoped to stable patients, recognition/reporting, and routine safety.`,
      remediation: "Keep complexity in practical-nurse scope; do not test RN/NP-only management decisions.",
    });
  }

  return {
    pass: !issues.some((issue) => issue.severity === "error"),
    standard,
    issues,
  };
}
