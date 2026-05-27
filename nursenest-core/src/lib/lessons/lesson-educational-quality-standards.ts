import type { HealthcareProgramTier } from "@/lib/nursing-tiers/tier-pedagogy-profile";
import type { PracticeQuestionType } from "@/lib/practice-tests/practice-question-rendering-engine";

export type LessonInteractionType =
  | "knowledge_check"
  | "sata"
  | "prioritization"
  | "sequencing"
  | "case_mini_scenario"
  | "bowtie"
  | "chart_review"
  | "reflection_prompt";

export type LessonEducationalQualityStandard = {
  tier: HealthcareProgramTier;
  purpose: string;
  requiredDepthSignals: readonly string[];
  requiredInteractiveElements: readonly LessonInteractionType[];
  requiredAdaptiveSignals: readonly string[];
  flashcardOutputs: readonly string[];
  examAlignment: readonly string[];
  scopeFocus: readonly string[];
};

export type LessonEducationalQualityInput = {
  tier: HealthcareProgramTier;
  title?: string | null;
  sections: readonly {
    kind?: string | null;
    heading?: string | null;
    body?: string | null;
    checkpointQuestions?: readonly unknown[] | null;
    recallPrompts?: readonly unknown[] | null;
    keyRecallFacts?: readonly unknown[] | null;
  }[];
  interactiveTypes?: readonly LessonInteractionType[];
  embeddedQuestionTypes?: readonly PracticeQuestionType[];
  flashcardPrompts?: readonly string[];
  adaptiveSignals?: readonly string[];
};

export type LessonEducationalQualityIssueCode =
  | "SHALLOW_EDUCATIONAL_DEPTH"
  | "MISSING_CLINICAL_REASONING"
  | "MISSING_PATHOPHYSIOLOGY_INTEGRATION"
  | "MISSING_SAFETY_INTEGRATION"
  | "MISSING_WORKFLOW_SIMULATION"
  | "MISSING_LICENSING_EXAM_ALIGNMENT"
  | "MISSING_INTERACTIVE_LEARNING"
  | "MISSING_ADVANCED_QUESTION_TYPES"
  | "MISSING_ADAPTIVE_INTEGRATION"
  | "MISSING_FLASHCARD_RETENTION_OUTPUT"
  | "MISSING_TIER_SCOPE_CUSTOMIZATION"
  | "PASSIVE_TEXT_HEAVY_LESSON"
  | "GENERIC_TEACHING_LANGUAGE";

export type LessonEducationalQualityIssue = {
  code: LessonEducationalQualityIssueCode;
  severity: "warning" | "error";
  message: string;
  remediation: string;
};

export type LessonEducationalQualityResult = {
  pass: boolean;
  score: number;
  standard: LessonEducationalQualityStandard;
  issues: LessonEducationalQualityIssue[];
};

const SHARED_DEPTH_SIGNALS = [
  "clinical reasoning",
  "pathophysiology integration",
  "workflow simulation",
  "patient safety",
  "licensing exam realism",
  "adaptive retention",
] as const;

const SHARED_INTERACTIONS = [
  "knowledge_check",
  "prioritization",
  "case_mini_scenario",
  "reflection_prompt",
] as const satisfies readonly LessonInteractionType[];

const SHARED_ADAPTIVE_SIGNALS = [
  "weak_concept",
  "confidence_gap",
  "misconception_pattern",
  "remediation_queue",
  "spaced_repetition",
] as const;

const SHARED_FLASHCARD_OUTPUTS = [
  "high-yield flashcards",
  "safety reminders",
  "clinical pearls",
  "common misconceptions",
  "exam traps",
  "prioritization anchors",
] as const;

export const LESSON_EDUCATIONAL_QUALITY_STANDARDS: Record<
  HealthcareProgramTier,
  LessonEducationalQualityStandard
> = {
  RPN: {
    tier: "RPN",
    purpose:
      "Upgrade practical-nursing lessons into scope-safe bedside reasoning modules focused on stable patients, recognition, reporting, and routine safety.",
    requiredDepthSignals: SHARED_DEPTH_SIGNALS,
    requiredInteractiveElements: SHARED_INTERACTIONS,
    requiredAdaptiveSignals: SHARED_ADAPTIVE_SIGNALS,
    flashcardOutputs: SHARED_FLASHCARD_OUTPUTS,
    examAlignment: ["REx-PN", "NCLEX-PN", "scope-safe prioritization", "recognition and reporting"],
    scopeFocus: [
      "stable patients",
      "foundational nursing care",
      "routine interventions",
      "recognition/reporting",
      "predictable outcomes",
    ],
  },
  RN: {
    tier: "RN",
    purpose:
      "Upgrade RN lessons into NCLEX-style clinical judgment modules that teach prioritization, delegation, trend recognition, and safe care planning.",
    requiredDepthSignals: SHARED_DEPTH_SIGNALS,
    requiredInteractiveElements: [...SHARED_INTERACTIONS, "sata", "sequencing", "bowtie", "chart_review"],
    requiredAdaptiveSignals: SHARED_ADAPTIVE_SIGNALS,
    flashcardOutputs: SHARED_FLASHCARD_OUTPUTS,
    examAlignment: ["NCLEX-RN", "NGN clinical judgment", "prioritization", "patient safety"],
    scopeFocus: ["complex patients", "delegation", "trend recognition", "clinical judgment", "care planning"],
  },
  NP: {
    tier: "NP",
    purpose:
      "Upgrade NP lessons into advanced-practice modules that teach differential diagnosis, diagnostic interpretation, prescribing safety, and independent management.",
    requiredDepthSignals: SHARED_DEPTH_SIGNALS,
    requiredInteractiveElements: [...SHARED_INTERACTIONS, "chart_review", "case_mini_scenario", "reflection_prompt"],
    requiredAdaptiveSignals: SHARED_ADAPTIVE_SIGNALS,
    flashcardOutputs: SHARED_FLASHCARD_OUTPUTS,
    examAlignment: ["NP boards", "diagnostic reasoning", "evidence-based management", "follow-up planning"],
    scopeFocus: [
      "differential diagnosis",
      "advanced diagnostics",
      "prescribing",
      "independent management",
      "evidence-based treatment",
    ],
  },
  ALLIED: {
    tier: "ALLIED",
    purpose:
      "Upgrade Allied Health lessons into profession-specific workflow modules that teach technical competence, communication, interpretation, and escalation.",
    requiredDepthSignals: SHARED_DEPTH_SIGNALS,
    requiredInteractiveElements: SHARED_INTERACTIONS,
    requiredAdaptiveSignals: SHARED_ADAPTIVE_SIGNALS,
    flashcardOutputs: SHARED_FLASHCARD_OUTPUTS,
    examAlignment: ["Allied Health licensing", "workflow reasoning", "technical safety", "interprofessional communication"],
    scopeFocus: [
      "profession workflow",
      "technical responsibilities",
      "diagnostic interpretation",
      "procedural competency",
      "patient communication",
      "interdisciplinary collaboration",
    ],
  },
} as const;

const CLINICAL_REASONING_RE =
  /\b(priority|priorit|cue|recognition|first|next|escalat|delegate|trend|reassess|SBAR|handoff|clinical judgment|differential|diagnostic reasoning|workflow reasoning)\b/i;
const PATHOPHYSIOLOGY_RE =
  /\b(pathophysiology|mechanism|because|therefore|causes|leads to|perfusion|hypoxia|inflammation|ischemia|compensat|receptor|cellular|organ)\b/i;
const SAFETY_RE =
  /\b(safety|unsafe|harm|risk|red flag|deteriorat|urgent|emergency|high-alert|medication error|fall|infection|shock|sepsis|respiratory distress)\b/i;
const WORKFLOW_RE =
  /\b(workflow|handoff|SBAR|chart|MAR|orders|reassessment|interdisciplinary|provider|notify|report|documentation|competing priorit|interruption)\b/i;
const EXAM_RE =
  /\b(NCLEX|NGN|REx|board|licensing|exam|test[- ]taking|common trap|high[- ]yield|select all|bow[- ]tie|case study)\b/i;
const GENERIC_RE =
  /\b(this is important|be familiar with|review the material|basic concept|study this topic|good to know|key takeaway only)\b/i;

const TIER_SCOPE_PATTERNS: Record<HealthcareProgramTier, readonly RegExp[]> = {
  RPN: [/\brecognize|report|notify|stable|predictable|routine|scope|ordered intervention|practical nurse|RPN|LPN\b/i],
  RN: [/\bpriorit|delegate|trend|care plan|unstable|clinical judgment|NCLEX|NGN|reassess\b/i],
  NP: [/\bdifferential|diagnoses|prescrib|management|follow-up|evidence-based|referral|contraindication\b/i],
  ALLIED: [/\bworkflow|technical|procedure|diagnostic|equipment|interprofessional|documentation|scope|escalation\b/i],
};

function plain(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function words(value: string): number {
  return value.match(/\b[\w'-]+\b/g)?.length ?? 0;
}

function hasAnyQuestionSurface(input: LessonEducationalQualityInput): boolean {
  if ((input.embeddedQuestionTypes?.length ?? 0) > 0) return true;
  if ((input.interactiveTypes?.length ?? 0) > 0) return true;
  return input.sections.some((section) => {
    return (
      (section.checkpointQuestions?.length ?? 0) > 0 ||
      (section.recallPrompts?.length ?? 0) > 0 ||
      (section.keyRecallFacts?.length ?? 0) > 0
    );
  });
}

function addIssue(issues: LessonEducationalQualityIssue[], issue: LessonEducationalQualityIssue): void {
  issues.push(issue);
}

export function resolveLessonEducationalQualityStandard(
  tier: HealthcareProgramTier,
): LessonEducationalQualityStandard {
  return LESSON_EDUCATIONAL_QUALITY_STANDARDS[tier];
}

export function evaluateLessonEducationalQuality(
  input: LessonEducationalQualityInput,
): LessonEducationalQualityResult {
  const standard = resolveLessonEducationalQualityStandard(input.tier);
  const sectionText = input.sections
    .map((section) => [plain(section.heading), plain(section.kind), plain(section.body)].join(" "))
    .join(" ");
  const allText = [plain(input.title), sectionText, ...(input.flashcardPrompts ?? [])].join(" ");
  const totalWords = words(sectionText);
  const sectionCount = input.sections.filter((section) => plain(section.body)).length;
  const issues: LessonEducationalQualityIssue[] = [];

  if (totalWords < 900 || sectionCount < 4) {
    addIssue(issues, {
      code: "SHALLOW_EDUCATIONAL_DEPTH",
      severity: "error",
      message: "Lesson is too shallow for premium board-prep and clinical-practice education.",
      remediation: "Add a structured spine with mechanism, assessment, prioritization, interventions, complications, case application, and retention outputs.",
    });
  }

  if (!CLINICAL_REASONING_RE.test(allText)) {
    addIssue(issues, {
      code: "MISSING_CLINICAL_REASONING",
      severity: "error",
      message: "Lesson does not explicitly teach clinical reasoning or prioritization.",
      remediation: "Add cue recognition, first/next action logic, escalation triggers, delegation or diagnostic reasoning, and reassessment timing.",
    });
  }

  if (!PATHOPHYSIOLOGY_RE.test(allText)) {
    addIssue(issues, {
      code: "MISSING_PATHOPHYSIOLOGY_INTEGRATION",
      severity: "error",
      message: "Lesson does not connect findings and interventions to pathophysiology.",
      remediation: "Explain why symptoms, labs, complications, and treatments occur using cause-and-effect clinical mechanisms.",
    });
  }

  if (!SAFETY_RE.test(allText)) {
    addIssue(issues, {
      code: "MISSING_SAFETY_INTEGRATION",
      severity: "error",
      message: "Lesson does not foreground patient safety.",
      remediation: "Add red flags, unsafe choices, medication safety, deterioration recognition, and escalation markers.",
    });
  }

  if (!WORKFLOW_RE.test(allText)) {
    addIssue(issues, {
      code: "MISSING_WORKFLOW_SIMULATION",
      severity: "warning",
      message: "Lesson lacks real-world workflow simulation.",
      remediation: "Add handoff, chart review, reassessment, provider communication, interdisciplinary workflow, or competing-priority context.",
    });
  }

  if (!EXAM_RE.test(allText)) {
    addIssue(issues, {
      code: "MISSING_LICENSING_EXAM_ALIGNMENT",
      severity: "warning",
      message: "Lesson lacks licensing exam framing.",
      remediation: "Add exam-style wording, common traps, NGN/REx/board alignment, and application-based reasoning prompts.",
    });
  }

  if (!hasAnyQuestionSurface(input)) {
    addIssue(issues, {
      code: "MISSING_INTERACTIVE_LEARNING",
      severity: "error",
      message: "Lesson is passive and lacks active recall or embedded practice.",
      remediation: "Add checkpoint questions, reflection prompts, mini-cases, recall prompts, or interactive modules throughout the lesson.",
    });
  }

  const advancedQuestionTypes = new Set(input.embeddedQuestionTypes ?? []);
  const hasAdvancedType = [...advancedQuestionTypes].some((type) => type !== "single");
  const hasAdvancedInteraction = (input.interactiveTypes ?? []).some((type) =>
    ["sata", "prioritization", "sequencing", "case_mini_scenario", "bowtie", "chart_review"].includes(type),
  );
  if (!hasAdvancedType && !hasAdvancedInteraction) {
    addIssue(issues, {
      code: "MISSING_ADVANCED_QUESTION_TYPES",
      severity: "warning",
      message: "Lesson does not include modern exam-style interactions beyond standard MCQ.",
      remediation: "Add SATA, sequencing, chart review, bow-tie, prioritization, or mini-case checkpoints where clinically appropriate.",
    });
  }

  const adaptiveSignals = new Set(input.adaptiveSignals ?? []);
  for (const signal of ["weak_concept", "confidence_gap", "remediation_queue", "spaced_repetition"] as const) {
    if (!adaptiveSignals.has(signal)) {
      addIssue(issues, {
        code: "MISSING_ADAPTIVE_INTEGRATION",
        severity: "error",
        message: `Lesson does not expose adaptive signal "${signal}".`,
        remediation: "Map lesson interactions and retention outputs into adaptive learning, remediation, flashcards, and readiness signals.",
      });
      break;
    }
  }

  if ((input.flashcardPrompts?.length ?? 0) < 3 && !/flashcard|spaced repetition|clinical pearl|exam trap/i.test(allText)) {
    addIssue(issues, {
      code: "MISSING_FLASHCARD_RETENTION_OUTPUT",
      severity: "error",
      message: "Lesson does not produce enough retention assets.",
      remediation: "Generate high-yield flashcards, safety reminders, clinical pearls, misconception cards, exam traps, and prioritization anchors.",
    });
  }

  if (!TIER_SCOPE_PATTERNS[input.tier].some((pattern) => pattern.test(allText))) {
    addIssue(issues, {
      code: "MISSING_TIER_SCOPE_CUSTOMIZATION",
      severity: "error",
      message: "Lesson does not clearly adapt to the learner tier or profession scope.",
      remediation: `Add ${standard.scopeFocus.join(", ")} language and examples while preserving the shared NurseNest lesson layout.`,
    });
  }

  if (totalWords >= 1200 && !hasAnyQuestionSurface(input)) {
    addIssue(issues, {
      code: "PASSIVE_TEXT_HEAVY_LESSON",
      severity: "warning",
      message: "Lesson is long but passive.",
      remediation: "Break the lesson into checkpoints, mini-cases, reflection prompts, and adaptive review moments.",
    });
  }

  if (GENERIC_RE.test(allText)) {
    addIssue(issues, {
      code: "GENERIC_TEACHING_LANGUAGE",
      severity: "error",
      message: "Lesson uses generic teaching language instead of clinician-authored guidance.",
      remediation: "Replace generic phrasing with concrete bedside cues, safety consequences, workflow decisions, and exam traps.",
    });
  }

  const score = Math.max(
    0,
    100 -
      issues.reduce((penalty, issue) => {
        return penalty + (issue.severity === "error" ? 16 : 6);
      }, 0),
  );

  return {
    pass: score >= 80 && !issues.some((issue) => issue.severity === "error"),
    score,
    standard,
    issues,
  };
}
