import type { Prisma } from "@prisma/client";
import { ECG_QUESTION_FORMAT } from "@/lib/ecg-module/ecg-module-config";
import { isBowtieQuestionType } from "@/lib/questions/bowtie-adapter";
import { validateBowtieQuestionPayload } from "@/lib/questions/bowtie-question-schema";

/** Shared with marketing snapshots and flashcard exam-bank SQL — keep CAT / linear / hub counts aligned. */
export const NON_ECG_PRACTICE_EXAM_WHERE: Prisma.ExamQuestionWhereInput = {
  NOT: [{ questionFormat: ECG_QUESTION_FORMAT }, { tags: { has: "ecg-video" } }],
};

/** Fields required for CAT completeness checks (subset of Prisma `ExamQuestion` selects). */
export type CatQuestionCompletenessFields = {
  stem: string;
  questionType?: string | null;
  options: Prisma.JsonValue | null;
  correctAnswer: Prisma.JsonValue | null;
  rationale: string | null;
};

function hasValidStem(stem: string | null | undefined): boolean {
  return typeof stem === "string" && stem.trim().length > 0;
}

function hasValidRationale(rationale: string | null | undefined): boolean {
  return typeof rationale === "string" && rationale.trim().length > 0;
}

function hasValidOptions(row: CatQuestionCompletenessFields): boolean {
  const { options } = row;
  if (isBowtieQuestionType(row.questionType)) {
    return validateBowtieQuestionPayload({
      questionType: row.questionType,
      stem: row.stem,
      options,
      correctAnswer: row.correctAnswer,
      rationale: row.rationale,
      publishMode: false,
      requireRationale: false,
    }).ok;
  }
  if (!Array.isArray(options)) return false;
  if (options.length < 2) return false;
  return options.every((opt) => {
    if (typeof opt === "string") return opt.trim().length > 0;
    if (typeof opt === "number") return Number.isFinite(opt);
    return false;
  });
}

function hasValidCorrectAnswer(row: CatQuestionCompletenessFields): boolean {
  const { correctAnswer } = row;
  if (correctAnswer == null) return false;
  if (isBowtieQuestionType(row.questionType)) {
    return validateBowtieQuestionPayload({
      questionType: row.questionType,
      stem: row.stem,
      options: row.options,
      correctAnswer,
      rationale: row.rationale,
      publishMode: false,
      requireRationale: false,
    }).ok;
  }
  if (typeof correctAnswer === "object" && !Array.isArray(correctAnswer)) return false;
  if (typeof correctAnswer === "string") return correctAnswer.trim().length > 0;
  if (typeof correctAnswer === "number") return Number.isFinite(correctAnswer);
  if (Array.isArray(correctAnswer)) {
    return correctAnswer.length > 0 && correctAnswer.every((entry) => {
      if (typeof entry === "string") return entry.trim().length > 0;
      if (typeof entry === "number") return Number.isFinite(entry);
      return false;
    });
  }
  return false;
}

export function isCompleteCatQuestionRow(row: CatQuestionCompletenessFields): boolean {
  return (
    hasValidStem(row.stem) &&
    hasValidOptions(row) &&
    hasValidCorrectAnswer(row) &&
    hasValidRationale(row.rationale)
  );
}
