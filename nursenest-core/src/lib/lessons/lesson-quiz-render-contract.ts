import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import type { LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";

/**
 * Shape required by `PathwayLessonQuizSet` / `LessonAssessmentQuiz` mini-quiz shells:
 * - `question` non-empty string (stem)
 * - `options` length ≥ 2, all string labels
 * - `correct` integer index into `options`
 * Optional: `rationale`, `examQuestionId` (bank-backed analytics)
 */
export function isRenderablePathwayLessonQuizItem(x: unknown): x is PathwayLessonQuizItem {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.question !== "string" || o.question.trim().length < 1) return false;
  if (!Array.isArray(o.options) || o.options.length < 2) return false;
  if (!o.options.every((t) => typeof t === "string")) return false;
  if (typeof o.correct !== "number" || !Number.isInteger(o.correct)) return false;
  if (o.correct < 0 || o.correct >= o.options.length) return false;
  return true;
}

/**
 * Defensive normalization for server-resolved quiz rows (catalog or bank).
 * Drops items that cannot render safely in the lesson mini-quiz without layout/UX breakage.
 */
export function normalizePathwayLessonQuizItemForRender(item: PathwayLessonQuizItem): PathwayLessonQuizItem | null {
  const question = typeof item.question === "string" ? item.question.trim() : "";
  const options = Array.isArray(item.options)
    ? item.options.map((t) => (typeof t === "string" ? t.trim() : String(t))).filter((s) => s.length > 0)
    : [];
  const rawCorrect = item.correct;
  const correct = typeof rawCorrect === "number" && Number.isInteger(rawCorrect) ? rawCorrect : -1;
  if (question.length < 1 || options.length < 2 || correct < 0 || correct >= options.length) return null;
  const rationale = typeof item.rationale === "string" && item.rationale.trim().length > 0 ? item.rationale.trim() : undefined;
  const ext = item as PathwayLessonQuizItem & { examQuestionId?: string };
  const examQuestionId = typeof ext.examQuestionId === "string" && ext.examQuestionId.trim().length > 0 ? ext.examQuestionId.trim() : undefined;
  const base: PathwayLessonQuizItem = { question, options, correct, ...(rationale ? { rationale } : {}) };
  if (examQuestionId) {
    return { ...base, examQuestionId } as LessonBankQuizItem;
  }
  return base;
}

/** Bank-backed rows only (`examQuestionId` required for study-loop analytics). */
export function finalizeLessonBankQuizItemsForUi(items: LessonBankQuizItem[]): LessonBankQuizItem[] {
  const out: LessonBankQuizItem[] = [];
  for (const it of items) {
    const n = normalizePathwayLessonQuizItemForRender(it);
    if (!n) continue;
    out.push({ ...n, examQuestionId: it.examQuestionId });
  }
  return out;
}
