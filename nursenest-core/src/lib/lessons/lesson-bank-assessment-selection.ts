import "server-only";

import crypto from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { pathwayExamQuestionMarketingWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { examRowToLessonBankItem, type LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import {
  buildRelatedExamQuestionWhereForPathwayLesson,
  RELATED_EXAM_QUESTIONS_CAP,
} from "@/lib/lessons/lesson-question-cross-links";
import type { PathwayLessonQuizItem, PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

/** Pre-test size band (practice: rationale after each in UI). */
export const LESSON_ASSESSMENT_PRE_MIN = 3;
export const LESSON_ASSESSMENT_PRE_MAX = 5;
/** Post-test size band. */
export const LESSON_ASSESSMENT_POST_MIN = 5;
export const LESSON_ASSESSMENT_POST_MAX = 10;

/** Extra rows to pull when merging topic match + fallback general pool. */
const FETCH_CAP = 80;

type ExamRow = {
  id: string;
  stem: string;
  options: Prisma.JsonValue;
  correctAnswer: Prisma.JsonValue;
  questionType: string;
  rationale: string | null;
  difficulty: number | null;
};

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

/**
 * Prefer catalog items first, then pad from bank up to `max`. Dedupes by exam id or stem prefix.
 */
export function mergeAssessmentWithBank(
  catalog: PathwayLessonQuizItem[] | undefined,
  bank: PathwayLessonQuizItem[],
  min: number,
  max: number,
): PathwayLessonQuizItem[] {
  const seen = new Set<string>();
  const out: PathwayLessonQuizItem[] = [];
  const push = (q: PathwayLessonQuizItem) => {
    const k = itemKey(q);
    if (seen.has(k)) return;
    seen.add(k);
    out.push(q);
  };
  for (const q of catalog ?? []) {
    push(q);
    if (out.length >= max) return out.slice(0, max);
  }
  for (const q of bank) {
    push(q);
    if (out.length >= max) break;
  }
  return out.length >= min ? out.slice(0, Math.min(max, out.length)) : [];
}

async function rowsToItems(rows: ExamRow[]): Promise<LessonBankQuizItem[]> {
  const out: LessonBankQuizItem[] = [];
  for (const r of rows) {
    const item = examRowToLessonBankItem(r);
    if (item) out.push(item);
  }
  return out;
}

async function fetchMcqRows(where: Prisma.ExamQuestionWhereInput, take: number): Promise<ExamRow[]> {
  return withDatabaseFallback(
    () =>
      prisma.examQuestion.findMany({
        where,
        select: {
          id: true,
          stem: true,
          options: true,
          correctAnswer: true,
          questionType: true,
          rationale: true,
          difficulty: true,
        },
        orderBy: { updatedAt: "desc" },
        take,
      }),
    [] as ExamRow[],
  );
}

/**
 * Load MCQs for lesson assessments: topic-matched pool first, then general pathway pool to fill gaps.
 */
export async function loadLessonBankAssessmentItems(
  pathway: ExamPathwayDefinition,
  lesson: Pick<PathwayLessonRecord, "title" | "topic" | "topicSlug" | "bodySystem" | "slug">,
): Promise<LessonBankQuizItem[]> {
  const primaryWhere = buildRelatedExamQuestionWhereForPathwayLesson({
    pathway,
    lessonTitle: lesson.title,
    lessonTopic: lesson.topic,
    lessonTopicSlug: lesson.topicSlug,
    bodySystem: lesson.bodySystem,
    lessonSlug: lesson.slug,
  });

  const primaryRows = primaryWhere ? await fetchMcqRows(primaryWhere, RELATED_EXAM_QUESTIONS_CAP) : [];
  let items = await rowsToItems(primaryRows);
  const seen = new Set(items.map((i) => i.examQuestionId));

  if (items.length < LESSON_ASSESSMENT_PRE_MAX + LESSON_ASSESSMENT_POST_MAX) {
    const base = pathwayExamQuestionMarketingWhere(pathway);
    const exclude =
      seen.size > 0
        ? ({ id: { notIn: [...seen] } } satisfies Prisma.ExamQuestionWhereInput)
        : ({} satisfies Prisma.ExamQuestionWhereInput);
    const fallbackRows = await fetchMcqRows({ AND: [base, exclude] }, FETCH_CAP);
    for (const r of fallbackRows) {
      if (seen.has(r.id)) continue;
      const item = examRowToLessonBankItem(r);
      if (!item) continue;
      seen.add(r.id);
      items.push(item);
      if (items.length >= FETCH_CAP) break;
    }
  }

  return items;
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
 * Resolve pre/post lesson quizzes: catalog when present, padded from the pathway question bank.
 * Returns empty arrays when the bank cannot satisfy minimums (caller hides sections).
 */
export async function resolvePathwayLessonBankAssessments(
  pathway: ExamPathwayDefinition,
  lesson: PathwayLessonRecord,
): Promise<{ preTest: PathwayLessonQuizItem[]; postTest: PathwayLessonQuizItem[] }> {
  const lessonKey = `${pathway.id}:${lesson.slug}`;
  const pool = await loadLessonBankAssessmentItems(pathway, lesson);
  if (pool.length === 0) {
    return {
      preTest: mergeAssessmentWithBank(lesson.preTest, [], LESSON_ASSESSMENT_PRE_MIN, LESSON_ASSESSMENT_PRE_MAX),
      postTest: mergeAssessmentWithBank(lesson.postTest, [], LESSON_ASSESSMENT_POST_MIN, LESSON_ASSESSMENT_POST_MAX),
    };
  }

  const { preBank, postBank } = splitBankPrePost(lessonKey, pool);
  const preTest = mergeAssessmentWithBank(lesson.preTest, preBank, LESSON_ASSESSMENT_PRE_MIN, LESSON_ASSESSMENT_PRE_MAX);
  const postTest = mergeAssessmentWithBank(lesson.postTest, postBank, LESSON_ASSESSMENT_POST_MIN, LESSON_ASSESSMENT_POST_MAX);
  return { preTest, postTest };
}
