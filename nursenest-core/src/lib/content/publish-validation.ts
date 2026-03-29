import { QuestionType } from "@prisma/client";
import { validateQuestionPayload } from "@/lib/content/question-schema";

export type PublishValidation = { ok: true } | { ok: false; reasons: string[] };

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

export function validateLessonForPublish(input: { title: string; summary: string; body: string }): PublishValidation {
  const reasons: string[] = [];
  if (input.title.trim().length < 4) reasons.push("Title required");
  if (input.summary.trim().length < 10) reasons.push("Summary required");
  if (input.body.trim().length < 10) reasons.push("Body required");
  return reasons.length ? { ok: false, reasons } : { ok: true };
}
