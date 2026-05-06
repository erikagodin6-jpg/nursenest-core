import { QuestionType } from "@prisma/client";
import { governExamQuestionPublish } from "@/lib/content/editorial-publish-policy";
import { validateQuestionPayload } from "@/lib/content/question-schema";
import {
  collectEducationalPlaceholderIds,
  hasEducationalAiDisclaimerLanguage,
  hasLargeDuplicateParagraphBlock,
} from "@/lib/education/educational-content-placeholder-guard";

export type PublishValidation = { ok: true } | { ok: false; reasons: string[] };

/** @deprecated Prefer {@link governExamQuestionPublish} for admin flows — kept for legacy callers expecting loose rationale length. */
export function validateQuestionForPublish(input: {
  stem: string;
  rationale: string;
  questionType: QuestionType;
  options: unknown;
  answerKey: unknown;
}): PublishValidation {
  const reasons: string[] = [];
  if (input.stem.trim().length < 10) reasons.push("Stem too short");
  if (input.rationale.trim().length < 20) reasons.push("Rationale required (long-form)");
  const shape = validateQuestionPayload(input.questionType, input.options, input.answerKey);
  if (shape) reasons.push(shape);
  return reasons.length ? { ok: false, reasons } : { ok: true };
}

/** Strict editorial governance for publish — use from admin APIs. */
export function validateQuestionForPublishStrict(
  input: Parameters<typeof governExamQuestionPublish>[0],
  opts: Parameters<typeof governExamQuestionPublish>[1],
) {
  return governExamQuestionPublish(input, opts);
}

export function validateLessonForPublish(input: { title: string; summary: string; body: string }): PublishValidation {
  const reasons: string[] = [];
  if (input.title.trim().length < 4) reasons.push("Title required");
  if (input.summary.trim().length < 25) reasons.push("Summary required (substantive meta description for publish)");
  if (input.body.trim().length < 10) reasons.push("Body required");

  const bundle = `${input.title}\n${input.summary}\n${input.body}`;
  const stubIds = collectEducationalPlaceholderIds(bundle);
  if (stubIds.length > 0) {
    reasons.push(`Placeholder or stub language detected: ${stubIds.join(", ")}`);
  }
  if (hasEducationalAiDisclaimerLanguage(bundle)) {
    reasons.push("AI meta-disclaimer phrasing is not allowed in published lesson copy");
  }
  if (input.body.trim().length > 2400 && hasLargeDuplicateParagraphBlock(input.body)) {
    reasons.push("Lesson body contains a repeated substantive paragraph block (likely copy-paste filler)");
  }

  return reasons.length ? { ok: false, reasons } : { ok: true };
}

export { governContentItemLessonPublish, governExamQuestionPublish } from "@/lib/content/editorial-publish-policy";
