import type { ExamQuestion } from "@prisma/client";

/**
 * Application-level enforcement until DB NOT NULL + backfill lands.
 * Call from admin mutations before publish.
 */
export type ExamQuestionContextFields = {
  tier: string;
  exam?: string | null;
  countryCode: string | null;
};

export function assertExamQuestionContextForPublish(row: ExamQuestionContextFields): void {
  if (!row.tier?.trim()) throw new Error("exam_questions.tier is required for publish");
  if ("exam" in row && !row.exam?.trim()) throw new Error("exam_questions.exam is required for publish");
  if (!row.countryCode?.trim()) {
    throw new Error("exam_questions.country_code is required for publish (use CA | US until global enum expands)");
  }
}
