import { QuestionType } from "@prisma/client";
import { classifyContentItemLesson } from "@/lib/content-quality/classify-lesson";
import { classifyRationaleWordCount, totalRationaleWordCount } from "@/lib/content-quality/classify-rationale";
import type { ContentQualityTier } from "@/lib/content-quality/standards";
import { RATIONALE_MIN_WORDS } from "@/lib/content-quality/standards";
import { validateQuestionPayload } from "@/lib/content/question-schema";
import { bodyStringToContentJson } from "@/lib/prisma/content-item-body";

/**
 * Central rules for when published content may ship to learners.
 * Structural problems always block. Quality gaps block publish unless an admin explicitly acknowledges.
 */
export type ExamQuestionGovernanceResult = {
  ok: boolean;
  /** Hard failures — cannot publish without fixing. */
  reasons: string[];
  /** Non-blocking hints for calm in-app warnings. */
  warnings: string[];
  rationaleWordCount: number;
  qualityTier: ContentQualityTier;
  /** True when rationale is below the premium bar — PATCH must send acknowledgeBelowQualityBar. */
  requiresQualityOverride: boolean;
  /** True when severe content incompleteness requires explicit override intent. */
  requiresSevereOverride: boolean;
};

function rationalePartsForCount(rationale: string, extra: Array<string | null | undefined>): number {
  return totalRationaleWordCount([rationale, ...extra]);
}

/**
 * Admin publish / status=PUBLISHED for exam questions.
 * Optional `correctAnswerExplanation` etc. count toward rationale depth when provided.
 */
export function governExamQuestionPublish(
  input: {
    stem: string;
    rationale: string;
    correctAnswerExplanation?: string | null;
    clinicalReasoning?: string | null;
    keyTakeaway?: string | null;
    questionType: QuestionType;
    options: unknown;
    answerKey: unknown;
  },
  opts: { acknowledgeBelowQualityBar?: boolean; acknowledgeSevereQualityIssue?: boolean },
): ExamQuestionGovernanceResult {
  const reasons: string[] = [];
  const warnings: string[] = [];

  if (input.stem.trim().length < 10) reasons.push("Stem too short");
  const shape = validateQuestionPayload(input.questionType, input.options, input.answerKey);
  if (shape) reasons.push(shape);

  const wc = rationalePartsForCount(input.rationale, [
    input.correctAnswerExplanation,
    input.clinicalReasoning,
    input.keyTakeaway,
  ]);
  const classified = classifyRationaleWordCount(wc);

  if (classified.tier === "missing") {
    if (!opts.acknowledgeSevereQualityIssue) {
      reasons.push(
        "Rationale missing or empty — add teaching text before publish, or explicitly confirm severe-quality override.",
      );
    } else {
      warnings.push("Published with severe rationale gap (missing rationale). Prioritize remediation immediately.");
    }
  }

  if (reasons.length > 0) {
    return {
      ok: false,
      reasons,
      warnings,
      rationaleWordCount: wc,
      qualityTier: classified.tier,
      requiresQualityOverride: false,
      requiresSevereOverride: classified.tier === "missing" && !opts.acknowledgeSevereQualityIssue,
    };
  }

  if (classified.tier === "thin") {
    if (!opts.acknowledgeBelowQualityBar) {
      return {
        ok: false,
        reasons: [
          `Rationale teaching depth is below the ${RATIONALE_MIN_WORDS}-word bar (${wc} words). Expand rationale and related teaching fields, or confirm publish with acknowledgeBelowQualityBar.`,
        ],
        warnings,
        rationaleWordCount: wc,
        qualityTier: classified.tier,
        requiresQualityOverride: true,
        requiresSevereOverride: false,
      };
    }
    warnings.push(
      `Published with below-bar rationale (${wc} words). Consider enriching for SEO and learner trust.`,
    );
  } else if (classified.tier === "acceptable") {
    warnings.push("Rationale meets minimum depth; expanding toward strong tier improves previews and conversion.");
  }

  return {
    ok: true,
    reasons: [],
    warnings,
    rationaleWordCount: wc,
    qualityTier: classified.tier,
    requiresQualityOverride: false,
    requiresSevereOverride: false,
  };
}

export type ContentItemLessonGovernanceResult = {
  ok: boolean;
  reasons: string[];
  warnings: string[];
  wordCount: number;
  qualityTier: ContentQualityTier;
  requiresQualityOverride: boolean;
};

/**
 * Content-item lessons (legacy JSON body) — uses same word-count tiers as reporting.
 */
export function governContentItemLessonPublish(
  input: { title: string; summary: string; body: string },
  opts: { acknowledgeBelowQualityBar?: boolean },
): ContentItemLessonGovernanceResult {
  const reasons: string[] = [];
  if (input.title.trim().length < 4) reasons.push("Title required");
  if (input.summary.trim().length < 10) reasons.push("Summary required");
  if (input.body.trim().length < 10) reasons.push("Body required");

  const content = bodyStringToContentJson(input.body);
  const q = classifyContentItemLesson(content);

  if (reasons.length > 0) {
    return {
      ok: false,
      reasons,
      warnings: [],
      wordCount: q.wordCount,
      qualityTier: q.tier,
      requiresQualityOverride: false,
    };
  }

  if (q.tier === "missing" || q.tier === "thin") {
    if (!opts.acknowledgeBelowQualityBar) {
      return {
        ok: false,
        reasons: [
          `Lesson body is ${q.tier === "missing" ? "empty" : "thin"} for publish (${q.wordCount} words). Improve content or confirm with acknowledgeBelowQualityBar.`,
        ],
        warnings: [],
        wordCount: q.wordCount,
        qualityTier: q.tier,
        requiresQualityOverride: true,
      };
    }
    return {
      ok: true,
      reasons: [],
      warnings: ["Published with thin lesson body — prioritize enrichment for public previews."],
      wordCount: q.wordCount,
      qualityTier: q.tier,
      requiresQualityOverride: false,
    };
  }

  if (q.tier === "acceptable") {
    return {
      ok: true,
      reasons: [],
      warnings: ["Lesson is acceptable length; strong tier improves SEO depth."],
      wordCount: q.wordCount,
      qualityTier: q.tier,
      requiresQualityOverride: false,
    };
  }

  return {
    ok: true,
    reasons: [],
    warnings: [],
    wordCount: q.wordCount,
    qualityTier: q.tier,
    requiresQualityOverride: false,
  };
}
