import type { HealthcareProgramTier } from "@/lib/nursing-tiers/tier-pedagogy-profile";
import type { AdaptiveDifficultyLevel } from "@/lib/questions/adaptive-difficulty-standards";

export type CaseStudyWorkflowElement =
  | "patient-presentation"
  | "evolving-symptoms"
  | "changing-vitals"
  | "labs-imaging"
  | "nursing-notes"
  | "provider-orders"
  | "interdisciplinary-communication"
  | "medication-administration"
  | "reassessment-findings"
  | "deterioration-or-improvement";

export type CaseStudyQuestionFocus =
  | "assessment"
  | "prioritization"
  | "intervention-selection"
  | "communication"
  | "escalation"
  | "delegation"
  | "patient-education"
  | "discharge-planning"
  | "complication-recognition";

export type CaseStudyExpansionStandard = {
  tier: HealthcareProgramTier;
  purpose: string;
  minimumStageCount: number;
  minimumQuestionCount: number;
  requiredWorkflowElements: readonly CaseStudyWorkflowElement[];
  requiredQuestionFoci: readonly CaseStudyQuestionFocus[];
  scopeGuardrails: readonly string[];
};

export type CaseStudyStageInput = {
  id?: string | null;
  title?: string | null;
  timepoint?: string | null;
  narrative?: string | null;
  workflowElements?: readonly CaseStudyWorkflowElement[] | null;
};

export type CaseStudyQuestionInput = {
  id?: string | null;
  stem?: string | null;
  focus?: CaseStudyQuestionFocus | string | null;
};

export type CaseStudyExpansionInput = {
  tier: HealthcareProgramTier;
  difficultyLevel?: AdaptiveDifficultyLevel | null;
  sourceStem?: string | null;
  stages?: readonly CaseStudyStageInput[] | null;
  questions?: readonly CaseStudyQuestionInput[] | null;
};

export type CaseStudyExpansionIssueCode =
  | "INSUFFICIENT_STAGES"
  | "INSUFFICIENT_PROGRESSIVE_QUESTIONS"
  | "MISSING_WORKFLOW_ELEMENT"
  | "MISSING_QUESTION_FOCUS"
  | "NO_EVOLUTION"
  | "SCOPE_MISMATCH";

export type CaseStudyExpansionIssue = {
  code: CaseStudyExpansionIssueCode;
  severity: "warning" | "error";
  message: string;
  remediation: string;
};

export type CaseStudyExpansionResult = {
  pass: boolean;
  score: number;
  standard: CaseStudyExpansionStandard;
  issues: CaseStudyExpansionIssue[];
};

const BASE_WORKFLOW_ELEMENTS = [
  "patient-presentation",
  "evolving-symptoms",
  "changing-vitals",
  "nursing-notes",
  "reassessment-findings",
  "deterioration-or-improvement",
] as const;

const BASE_QUESTION_FOCI = [
  "assessment",
  "prioritization",
  "intervention-selection",
  "communication",
  "escalation",
] as const;

export const CASE_STUDY_EXPANSION_STANDARDS: Record<HealthcareProgramTier, CaseStudyExpansionStandard> = {
  RPN: {
    tier: "RPN",
    purpose:
      "Transform foundational bedside items into stable-to-changing client cases that test recognition, reporting, safety, and practical-nurse scope.",
    minimumStageCount: 3,
    minimumQuestionCount: 4,
    requiredWorkflowElements: [
      ...BASE_WORKFLOW_ELEMENTS,
      "provider-orders",
      "medication-administration",
    ],
    requiredQuestionFoci: [
      ...BASE_QUESTION_FOCI,
      "delegation",
      "patient-education",
    ],
    scopeGuardrails: [
      "Keep clients stable or predictably changing until the learning objective is recognition and reporting.",
      "Do not require independent diagnosis, prescribing, or critical-care ownership.",
    ],
  },
  RN: {
    tier: "RN",
    purpose:
      "Transform standalone RN questions into evolving clinical workflows that test assessment, prioritization, intervention, escalation, delegation, education, and complication recognition.",
    minimumStageCount: 4,
    minimumQuestionCount: 6,
    requiredWorkflowElements: [
      ...BASE_WORKFLOW_ELEMENTS,
      "labs-imaging",
      "provider-orders",
      "interdisciplinary-communication",
      "medication-administration",
    ],
    requiredQuestionFoci: [
      ...BASE_QUESTION_FOCI,
      "delegation",
      "patient-education",
      "discharge-planning",
      "complication-recognition",
    ],
    scopeGuardrails: [
      "Keep complexity at entry-level RN practice: safety, prioritization, delegation, deterioration, and nursing intervention sequencing.",
      "Avoid physician-level decision-making, advanced ventilator management, rare specialty procedures, and RT-specific interventions.",
    ],
  },
  NP: {
    tier: "NP",
    purpose:
      "Transform provider-level items into longitudinal cases with diagnostic uncertainty, orders, medication decisions, reassessment, follow-up, and escalation logic.",
    minimumStageCount: 4,
    minimumQuestionCount: 6,
    requiredWorkflowElements: [
      ...BASE_WORKFLOW_ELEMENTS,
      "labs-imaging",
      "provider-orders",
      "interdisciplinary-communication",
      "medication-administration",
    ],
    requiredQuestionFoci: [
      "assessment",
      "prioritization",
      "intervention-selection",
      "communication",
      "escalation",
      "patient-education",
      "discharge-planning",
      "complication-recognition",
    ],
    scopeGuardrails: [
      "Scale through differential diagnosis, diagnostics, pharmacologic judgment, monitoring, follow-up, and evidence-based management.",
      "Do not collapse NP case studies into RN-only delegation or task-priority sequences.",
    ],
  },
  ALLIED: {
    tier: "ALLIED",
    purpose:
      "Transform allied-health items into profession-specific workflow cases with safety checks, documentation, communication, escalation, and role-appropriate interpretation.",
    minimumStageCount: 3,
    minimumQuestionCount: 5,
    requiredWorkflowElements: [
      "patient-presentation",
      "evolving-symptoms",
      "changing-vitals",
      "labs-imaging",
      "nursing-notes",
      "interdisciplinary-communication",
      "reassessment-findings",
      "deterioration-or-improvement",
    ],
    requiredQuestionFoci: [
      "assessment",
      "prioritization",
      "intervention-selection",
      "communication",
      "escalation",
      "patient-education",
      "complication-recognition",
    ],
    scopeGuardrails: [
      "Adapt cases to profession-specific terminology, workflow, equipment/specimen/procedure safeguards, and escalation paths.",
      "Do not default to RN care planning or scope-inappropriate diagnosis/treatment ownership.",
    ],
  },
} as const;

function normalizeFocus(value: string | null | undefined): CaseStudyQuestionFocus | null {
  const normalized = String(value ?? "").trim().toLowerCase().replace(/[\s_]+/g, "-");
  if (
    normalized === "assessment" ||
    normalized === "prioritization" ||
    normalized === "intervention-selection" ||
    normalized === "communication" ||
    normalized === "escalation" ||
    normalized === "delegation" ||
    normalized === "patient-education" ||
    normalized === "discharge-planning" ||
    normalized === "complication-recognition"
  ) {
    return normalized;
  }
  return null;
}

function stageText(stage: CaseStudyStageInput): string {
  return [stage.title, stage.timepoint, stage.narrative].filter(Boolean).join(" ");
}

function addIssue(issues: CaseStudyExpansionIssue[], issue: CaseStudyExpansionIssue): void {
  issues.push(issue);
}

function hasEvolutionSignal(stages: readonly CaseStudyStageInput[]): boolean {
  const joined = stages.map(stageText).join(" ");
  return /\b(now|later|after|reassess|worsen|improv|increase|decrease|new|repeat|from .* to|trend|follow-up)\b/i.test(joined);
}

const SCOPE_MISMATCH_PATTERNS: Record<HealthcareProgramTier, readonly RegExp[]> = {
  RPN: [/\bdiagnose|prescribe|intubate|vasopressor|central line|adjust ventilator\b/i],
  RN: [/\bprescribe\b|diagnose\b|intubate|adjust ventilator settings|insert central line|perform surgery\b/i],
  NP: [/\bnone impossible marker\b/i],
  ALLIED: [/\bnursing care plan|prescribe|diagnose and treat|independent medical management\b/i],
};

export function resolveCaseStudyExpansionStandard(tier: HealthcareProgramTier): CaseStudyExpansionStandard {
  return CASE_STUDY_EXPANSION_STANDARDS[tier];
}

export function evaluateCaseStudyExpansion(input: CaseStudyExpansionInput): CaseStudyExpansionResult {
  const standard = resolveCaseStudyExpansionStandard(input.tier);
  const stages = [...(input.stages ?? [])];
  const questions = [...(input.questions ?? [])];
  const stageElements = new Set(stages.flatMap((stage) => [...(stage.workflowElements ?? [])]));
  const questionFoci = new Set(
    questions
      .map((question) => normalizeFocus(question.focus))
      .filter((focus): focus is CaseStudyQuestionFocus => focus !== null),
  );
  const issues: CaseStudyExpansionIssue[] = [];

  if (stages.length < standard.minimumStageCount) {
    addIssue(issues, {
      code: "INSUFFICIENT_STAGES",
      severity: "error",
      message: "Case study does not have enough longitudinal stages.",
      remediation: `Add at least ${standard.minimumStageCount} stages showing presentation, evolving data, and reassessment.`,
    });
  }

  if (questions.length < standard.minimumQuestionCount) {
    addIssue(issues, {
      code: "INSUFFICIENT_PROGRESSIVE_QUESTIONS",
      severity: "error",
      message: "Case study does not contain enough progressive decision points.",
      remediation: `Add at least ${standard.minimumQuestionCount} questions spanning assessment, intervention, communication, escalation, and education/review.`,
    });
  }

  for (const element of standard.requiredWorkflowElements) {
    if (!stageElements.has(element)) {
      addIssue(issues, {
        code: "MISSING_WORKFLOW_ELEMENT",
        severity: element === "labs-imaging" || element === "interdisciplinary-communication" ? "warning" : "error",
        message: `Case study is missing workflow element: ${element}.`,
        remediation: "Add this element to a stage so the case simulates real clinical workflow, not a static vignette.",
      });
    }
  }

  for (const focus of standard.requiredQuestionFoci) {
    if (!questionFoci.has(focus)) {
      addIssue(issues, {
        code: "MISSING_QUESTION_FOCUS",
        severity: focus === "discharge-planning" ? "warning" : "error",
        message: `Case sequence is missing question focus: ${focus}.`,
        remediation: "Add a progressive question that tests this decision point within the learner's scope.",
      });
    }
  }

  if (!hasEvolutionSignal(stages)) {
    addIssue(issues, {
      code: "NO_EVOLUTION",
      severity: "error",
      message: "Case does not show meaningful deterioration, improvement, reassessment, or changing clinical data.",
      remediation: "Add a later stage with changing vitals, symptoms, orders, response to medication, or reassessment findings.",
    });
  }

  const combined = [
    input.sourceStem,
    ...stages.map(stageText),
    ...questions.map((question) => question.stem),
  ].join(" ");
  if (SCOPE_MISMATCH_PATTERNS[input.tier].some((pattern) => pattern.test(combined))) {
    addIssue(issues, {
      code: "SCOPE_MISMATCH",
      severity: "error",
      message: "Case study contains decisions outside the selected profession/tier scope.",
      remediation: "Maintain profession-specific scope while increasing complexity through evolving data and decision sequencing.",
    });
  }

  const score = Math.max(
    0,
    100 -
      issues.reduce((penalty, issue) => {
        return penalty + (issue.severity === "error" ? 16 : 7);
      }, 0),
  );

  return {
    pass: score >= 80 && !issues.some((issue) => issue.severity === "error"),
    score,
    standard,
    issues,
  };
}
