import crypto from "node:crypto";
import type { LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import { preferExplicitAssessmentSide } from "@/lib/lessons/lesson-assessment-explicit-pure";
import { normalizePathwayLessonQuizItemForRender } from "@/lib/lessons/lesson-quiz-render-contract";
import type { PathwayLessonQuizItem, PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

/** Pre-test size band (practice: rationale after each in UI). */
export const LESSON_ASSESSMENT_PRE_MIN = 3;
export const LESSON_ASSESSMENT_PRE_MAX = 5;
/** Post-test size band. */
export const LESSON_ASSESSMENT_POST_MIN = 5;
export const LESSON_ASSESSMENT_POST_MAX = 10;

function hashKey(lessonKey: string, id: string): string {
  return crypto.createHash("sha256").update(`${lessonKey}:${id}`).digest("hex");
}

function stableSortItems(lessonKey: string, items: LessonBankQuizItem[]): LessonBankQuizItem[] {
  return [...items].sort((a, b) =>
    hashKey(lessonKey, a.examQuestionId).localeCompare(hashKey(lessonKey, b.examQuestionId)),
  );
}

function itemKey(q: PathwayLessonQuizItem): string {
  const id = "examQuestionId" in q && typeof (q as LessonBankQuizItem).examQuestionId === "string"
    ? (q as LessonBankQuizItem).examQuestionId
    : "";
  if (id) return `id:${id}`;
  return `stem:${q.question.trim().slice(0, 160)}`;
}

function dedupeAssessmentItems(items: PathwayLessonQuizItem[], max: number): PathwayLessonQuizItem[] {
  const seen = new Set<string>();
  const out: PathwayLessonQuizItem[] = [];
  for (const q of items) {
    const k = itemKey(q);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(q);
    if (out.length >= max) break;
  }
  return out;
}

/**
 * Prefer catalog items first, then pad from bank up to `max`. Dedupes by exam id or stem prefix.
 *
 * This remains exported for legacy callers/tests, but the learner lesson assembler below intentionally
 * does not use broad bank padding for pre/post quizzes. Pre/post checks must match the lesson objective;
 * wider topic/pathway practice belongs in the separate practice rail after the lesson.
 */
export function mergeAssessmentWithBank(
  catalog: PathwayLessonQuizItem[] | undefined,
  bank: PathwayLessonQuizItem[],
  min: number,
  max: number,
): PathwayLessonQuizItem[] {
  const out = dedupeAssessmentItems([...(catalog ?? []), ...bank], max);
  return out.length >= min ? out : [];
}

/**
 * Split a stable-sorted bank pool into disjoint pre and post sets (no overlapping questions).
 */
export function splitBankPrePost(
  lessonKey: string,
  items: LessonBankQuizItem[],
): { preBank: LessonBankQuizItem[]; postBank: LessonBankQuizItem[] } {
  const sorted = stableSortItems(lessonKey, items);
  const preTarget = Math.min(LESSON_ASSESSMENT_PRE_MAX, Math.max(LESSON_ASSESSMENT_PRE_MIN, 4));
  const postTarget = Math.min(LESSON_ASSESSMENT_POST_MAX, Math.max(LESSON_ASSESSMENT_POST_MIN, 7));
  const preBank = sorted.slice(0, Math.min(preTarget, sorted.length));
  const rest = sorted.slice(preBank.length);
  const postBank = rest.slice(0, Math.min(postTarget, rest.length));
  return { preBank, postBank };
}

/**
 * Preserves authoring order for explicit bank items present in `itemsByExamId`
 * (ids missing from the map are skipped — caller logging handles zero-resolve).
 */
export function orderedExplicitLessonBankItemsForConfiguredIds(
  configuredIds: string[],
  itemsByExamId: ReadonlyMap<string, LessonBankQuizItem>,
): LessonBankQuizItem[] {
  const out: LessonBankQuizItem[] = [];
  for (const id of configuredIds) {
    const it = itemsByExamId.get(id);
    if (it) out.push(it);
  }
  return out;
}

function sanitizeAssessmentQuizSides(items: PathwayLessonQuizItem[]): PathwayLessonQuizItem[] {
  const out: PathwayLessonQuizItem[] = [];
  for (const q of items) {
    const n = normalizePathwayLessonQuizItemForRender(q);
    if (n) out.push(n);
  }
  return out;
}

function lessonAuthoredAssessmentSide(
  catalog: PathwayLessonQuizItem[] | undefined,
  min: number,
  max: number,
): PathwayLessonQuizItem[] {
  const authored = dedupeAssessmentItems(catalog ?? [], max);
  return authored.length >= min ? authored : [];
}

/**
 * Pure merge of catalog + bank pool with optional explicit ExamQuestion-backed sides.
 * Applies {@link normalizePathwayLessonQuizItemForRender} so lesson mini-quiz shells always receive a consistent contract.
 *
 * Important: learner-facing pre/post checks are now strict. We do not backfill a sparse or missing
 * lesson quiz from the broad pathway bank because that creates readiness/retention tests that do not
 * match the actual teaching content. Generic reinforcement remains available in topic practice.
 */
export function assemblePathwayLessonBankAssessmentsFromParts(args: {
  lesson: Pick<PathwayLessonRecord, "preTest" | "postTest">;
  lessonKey: string;
  pool: LessonBankQuizItem[];
  explicitPre: PathwayLessonQuizItem[] | null;
  explicitPost: PathwayLessonQuizItem[] | null;
}): { preTest: PathwayLessonQuizItem[]; postTest: PathwayLessonQuizItem[] } {
  const authoredPre = lessonAuthoredAssessmentSide(
    args.lesson.preTest,
    LESSON_ASSESSMENT_PRE_MIN,
    LESSON_ASSESSMENT_PRE_MAX,
  );
  const authoredPost = lessonAuthoredAssessmentSide(
    args.lesson.postTest,
    LESSON_ASSESSMENT_POST_MIN,
    LESSON_ASSESSMENT_POST_MAX,
  );

  return {
    preTest: sanitizeAssessmentQuizSides(preferExplicitAssessmentSide(args.explicitPre, authoredPre)),
    postTest: sanitizeAssessmentQuizSides(preferExplicitAssessmentSide(args.explicitPost, authoredPost)),
  };
}
