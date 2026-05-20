import type { ZodError } from "zod";

import { examQuestionImportRecordSchema } from "@/lib/content-pipeline/schemas/exam-question-import-record";
import type { ExamQuestionImportRecord } from "@/lib/content-pipeline/schemas/exam-question-import-record";
import { pathwayLessonImportRecordSchema } from "@/lib/content-pipeline/schemas/pathway-lesson-import-record";
import type { PathwayLessonImportRecord } from "@/lib/content-pipeline/schemas/pathway-lesson-import-record";

export type ImportBatchValidationIssue = { index: number; error: ZodError };

/**
 * Validate an in-memory batch (already chunked by caller). Does not hit the database.
 */
export function validateExamQuestionImportBatch(rows: unknown[]): {
  ok: true;
  data: ExamQuestionImportRecord[];
} | { ok: false; issues: ImportBatchValidationIssue[] } {
  const issues: ImportBatchValidationIssue[] = [];
  const data: ExamQuestionImportRecord[] = [];
  for (let i = 0; i < rows.length; i++) {
    const parsed = examQuestionImportRecordSchema.safeParse(rows[i]);
    if (!parsed.success) issues.push({ index: i, error: parsed.error });
    else data.push(parsed.data);
  }
  if (issues.length) return { ok: false, issues };
  return { ok: true, data };
}

export function validatePathwayLessonImportBatch(rows: unknown[]): {
  ok: true;
  data: PathwayLessonImportRecord[];
} | { ok: false; issues: ImportBatchValidationIssue[] } {
  const issues: ImportBatchValidationIssue[] = [];
  const data: PathwayLessonImportRecord[] = [];
  for (let i = 0; i < rows.length; i++) {
    const parsed = pathwayLessonImportRecordSchema.safeParse(rows[i]);
    if (!parsed.success) issues.push({ index: i, error: parsed.error });
    else data.push(parsed.data);
  }
  if (issues.length) return { ok: false, issues };
  return { ok: true, data };
}
