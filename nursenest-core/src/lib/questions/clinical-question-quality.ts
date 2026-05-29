/**
 * Clinical question quality standards for NurseNest question-bank content.
 *
 * This module is intentionally DB-agnostic so it can be reused by:
 * - import/promotion pipelines,
 * - production DB audits,
 * - generated-draft review tooling,
 * - contract tests.
 *
 * Goal: prevent short-answer-bank style content from being treated as premium clinical teaching.
 */
import { isGenericRationaleText } from "@/lib/questions/rationale-quality";

export const CLINICAL_QUESTION_QUALITY_THRESHOLDS = {
  minStemChars: 60,
  minRationaleChars: 180,
  minClinicalReasoningChars: 100,
  minExamStrategyChars: 60,
  minTrapOrTakeawayChars: 40,
  minDistractorRationaleChars: 35,
  passingScore: 80,
} as const;

export type ClinicalQuestionQualityInput = {
  stem?: string | null;
  options?: unknown;
  correctAnswer?: unknown;
  rationale?: string | null;
  distractorRationales?: unknown;
  clinicalReasoning?: string | null;
  examStrategy?: string | null;
  clinicalTrap?: string | null;
  keyTakeaway?: string | null;
  topic?: string | null;
  bodySystem?: string | null;
  cognitiveLevel?: string | null;
  difficulty?: number | null;
  qualityScore?: number | null;
  questionType?: string | null;
};

export type ClinicalQuestionQualityIssueCode =
  | "STEM_TOO_SHORT"
  | "OPTIONS_TOO_FEW"
  | "CORRECT_ANSWER_MISSING"
  | "RATIONALE_TOO_SHORT"
  | "GENERIC_RATIONALE"
  | "DISTRACTOR_RATIONALES_MISSING"
  | "DISTRACTOR_RATIONALES_TOO_THIN"
  | "GENERIC_DISTRACTOR_RATIONALE"
  | "CLINICAL_REASONING_MISSING"
  | "EXAM_STRATEGY_MISSING"
  | "TRAP_OR_TAKEAWAY_MISSING"
  | "METADATA_INCOMPLETE"
  | "QUALITY_SCORE_LOW"
  | "UNSAFE_ABSOLUTE_LANGUAGE";

export type ClinicalQuestionQualityIssue = {
  code: ClinicalQuestionQualityIssueCode;
  severity: "error" | "warning";
  field: string;
  message: string;
  remediation: string;
};

export type ClinicalQuestionQualityResult = {
  score: number;
  pass: boolean;
  issues: ClinicalQuestionQualityIssue[];
};

function text(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizedQuestionType(value: string | null | undefined): string {
  return text(value).toLowerCase().replace(/[\s_]+/g, "-");
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

function parseObjectish(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  return {};
}

function hasCorrectAnswer(value: unknown): boolean {
  if (Array.isArray(value)) return value.some((v) => text(String(v)).length > 0);
  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return false;
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed.length > 0;
      if (typeof parsed === "string") return parsed.trim().length > 0;
      return parsed !== null && parsed !== undefined;
    } catch {
      return true;
    }
  }
  return value !== null && value !== undefined;
}

function usesUnsafeAbsoluteLanguage(input: ClinicalQuestionQualityInput): boolean {
  const combined = [input.stem, input.rationale, input.clinicalReasoning, input.examStrategy]
    .map((v) => text(v))
    .join(" ");
  return /\b(always|never|guarantee|guaranteed|only intervention|only appropriate|cure)\b/i.test(combined);
}

function optionText(option: unknown): string {
  if (typeof option === "string") return option;
  if (option && typeof option === "object") {
    const record = option as Record<string, unknown>;
    return text(String(record.text ?? record.label ?? record.content ?? ""));
  }
  return "";
}

function countAdequateDistractorRationales(input: ClinicalQuestionQualityInput): number {
  const rationales = parseObjectish(input.distractorRationales);
  return Object.values(rationales).filter(
    (value) => text(typeof value === "string" ? value : JSON.stringify(value)).length >=
      CLINICAL_QUESTION_QUALITY_THRESHOLDS.minDistractorRationaleChars,
  ).length;
}

function addIssue(
  issues: ClinicalQuestionQualityIssue[],
  issue: ClinicalQuestionQualityIssue,
): void {
  issues.push(issue);
}

export function evaluateClinicalQuestionQuality(
  input: ClinicalQuestionQualityInput,
): ClinicalQuestionQualityResult {
  const issues: ClinicalQuestionQualityIssue[] = [];
  const options = parseArrayish(input.options).filter((option) => optionText(option).length > 0);
  const type = normalizedQuestionType(input.questionType);
  const expectsDistractors = ["mcq", "multiple-choice", "multiple-choice-question", "sata", "select-all-that-apply"].includes(type);

  if (text(input.stem).length < CLINICAL_QUESTION_QUALITY_THRESHOLDS.minStemChars) {
    addIssue(issues, {
      code: "STEM_TOO_SHORT",
      severity: "error",
      field: "stem",
      message: "Question stem is too short to support a clinically meaningful vignette.",
      remediation: "Add patient context, relevant assessment findings, and a focused clinical decision point.",
    });
  }

  if (options.length < 4 && (type === "mcq" || type === "multiple-choice" || type === "")) {
    addIssue(issues, {
      code: "OPTIONS_TOO_FEW",
      severity: "error",
      field: "options",
      message: "MCQ-style questions should have at least four plausible options.",
      remediation: "Add plausible distractors that map to common learner misconceptions.",
    });
  }

  if (!hasCorrectAnswer(input.correctAnswer)) {
    addIssue(issues, {
      code: "CORRECT_ANSWER_MISSING",
      severity: "error",
      field: "correctAnswer",
      message: "Correct answer is missing or empty.",
      remediation: "Set a correct answer that exactly maps to the canonical option key/text.",
    });
  }

  if (text(input.rationale).length < CLINICAL_QUESTION_QUALITY_THRESHOLDS.minRationaleChars) {
    addIssue(issues, {
      code: "RATIONALE_TOO_SHORT",
      severity: "error",
      field: "rationale",
      message: "Rationale is too shallow for premium clinical teaching.",
      remediation: "Explain why the answer is correct, why alternatives are unsafe/less correct, and what cue in the stem matters most.",
    });
  }
  if (isGenericRationaleText(input.rationale)) {
    addIssue(issues, {
      code: "GENERIC_RATIONALE",
      severity: "error",
      field: "rationale",
      message: "Rationale is generic or placeholder-like instead of teaching the exam thought process.",
      remediation:
        "Explain the correct answer, the stem-specific clinical cue, why alternatives are unsafe or unsupported, and the transferable nursing principle.",
    });
  }

  if (expectsDistractors) {
    const adequate = countAdequateDistractorRationales(input);
    const genericDistractors = Object.values(parseObjectish(input.distractorRationales)).filter((value) =>
      isGenericRationaleText(typeof value === "string" ? value : JSON.stringify(value)),
    ).length;
    if (adequate === 0) {
      addIssue(issues, {
        code: "DISTRACTOR_RATIONALES_MISSING",
        severity: "error",
        field: "distractorRationales",
        message: "No per-distractor teaching is present.",
        remediation: "Add a rationale for each incorrect option explaining the misconception or safety issue.",
      });
    } else if (adequate < Math.max(1, options.length - 1)) {
      addIssue(issues, {
        code: "DISTRACTOR_RATIONALES_TOO_THIN",
        severity: "warning",
        field: "distractorRationales",
        message: "Some distractors lack adequate teaching rationale.",
        remediation: "Make each distractor rationale at least 35 characters and clinically specific.",
      });
    }
    if (genericDistractors > 0) {
      addIssue(issues, {
        code: "GENERIC_DISTRACTOR_RATIONALE",
        severity: "error",
        field: "distractorRationales",
        message: "One or more distractor rationales use vague placeholder wording.",
        remediation:
          "Rewrite each wrong-answer rationale to name the misconception, the risk of choosing it first, and the priority framework that rules it out.",
      });
    }
  }

  if (text(input.clinicalReasoning).length < CLINICAL_QUESTION_QUALITY_THRESHOLDS.minClinicalReasoningChars) {
    addIssue(issues, {
      code: "CLINICAL_REASONING_MISSING",
      severity: "error",
      field: "clinicalReasoning",
      message: "Clinical reasoning explanation is missing or too thin.",
      remediation: "Add cue recognition, interpretation, prioritization, and expected nursing/NP action.",
    });
  }

  if (text(input.examStrategy).length < CLINICAL_QUESTION_QUALITY_THRESHOLDS.minExamStrategyChars) {
    addIssue(issues, {
      code: "EXAM_STRATEGY_MISSING",
      severity: "warning",
      field: "examStrategy",
      message: "Exam strategy is missing or too thin.",
      remediation: "Add how to approach the item under NCLEX/CNPLE-style clinical judgment conditions.",
    });
  }

  const hasTrapOrTakeaway =
    text(input.clinicalTrap).length >= CLINICAL_QUESTION_QUALITY_THRESHOLDS.minTrapOrTakeawayChars ||
    text(input.keyTakeaway).length >= CLINICAL_QUESTION_QUALITY_THRESHOLDS.minTrapOrTakeawayChars;
  if (!hasTrapOrTakeaway) {
    addIssue(issues, {
      code: "TRAP_OR_TAKEAWAY_MISSING",
      severity: "warning",
      field: "clinicalTrap|keyTakeaway",
      message: "Question lacks a clear trap or durable takeaway.",
      remediation: "Add the common trap learners fall for or the one-sentence takeaway they should remember.",
    });
  }

  if (!text(input.topic) || !text(input.bodySystem) || !text(input.cognitiveLevel) || input.difficulty == null) {
    addIssue(issues, {
      code: "METADATA_INCOMPLETE",
      severity: "warning",
      field: "topic|bodySystem|cognitiveLevel|difficulty",
      message: "Question metadata is incomplete for adaptive routing and remediation.",
      remediation: "Populate topic, body system, cognitive level, and difficulty before publishing.",
    });
  }

  if (typeof input.qualityScore === "number" && input.qualityScore < CLINICAL_QUESTION_QUALITY_THRESHOLDS.passingScore) {
    addIssue(issues, {
      code: "QUALITY_SCORE_LOW",
      severity: "error",
      field: "qualityScore",
      message: "Question has an explicit low quality score.",
      remediation: "Keep in review/quarantine until corrected and rescored at 80+.",
    });
  }

  if (usesUnsafeAbsoluteLanguage(input)) {
    addIssue(issues, {
      code: "UNSAFE_ABSOLUTE_LANGUAGE",
      severity: "warning",
      field: "stem|rationale",
      message: "Question uses absolute language that may be clinically unsafe unless intentionally tested.",
      remediation: "Replace unsupported absolutes with conditional, evidence-aware clinical wording.",
    });
  }

  const penalty = issues.reduce((sum, issue) => sum + (issue.severity === "error" ? 15 : 6), 0);
  const score = Math.max(0, 100 - penalty);

  return {
    score,
    pass: score >= CLINICAL_QUESTION_QUALITY_THRESHOLDS.passingScore && !issues.some((i) => i.severity === "error"),
    issues,
  };
}
