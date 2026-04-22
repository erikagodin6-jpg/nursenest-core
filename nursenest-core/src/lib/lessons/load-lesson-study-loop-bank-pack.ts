import "server-only";

import crypto from "crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  buildRelatedExamQuestionWhereForPathwayLesson,
  RELATED_EXAM_QUESTIONS_CAP,
} from "@/lib/lessons/lesson-question-cross-links";
import { examRowToLessonBankItem, type LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { loadLessonBankQuizItemsByExamIds } from "@/lib/lessons/lesson-explicit-exam-question-items";
import {
  explicitLessonStudyLoopCombinedSanitizedIds,
  LESSON_STUDY_LOOP_MIN_QUESTIONS,
} from "@/lib/lessons/load-lesson-study-loop-gate";

export {
  explicitLessonStudyLoopCombinedIdCount,
  explicitLessonStudyLoopCombinedSanitizedIds,
  LESSON_STUDY_LOOP_MIN_QUESTIONS,
  shouldUseExplicitLessonStudyLoopPack,
} from "@/lib/lessons/load-lesson-study-loop-gate";
export const LESSON_STUDY_LOOP_TARGET_DEFAULT = 12;
export const LESSON_STUDY_LOOP_TARGET_MAX = 20;

export type LessonStudyLoopBankPack = {
  items: LessonBankQuizItem[];
  questionIds: string[];
  poolCount: number;
  targetRequested: number;
};

function hashKey(lessonKey: string, id: string): string {
  return crypto.createHash("sha256").update(`${lessonKey}:${id}`).digest("hex");
}

/**
 * Deterministic ordering for the same lesson + pathway + user context.
 */
type EnrichedItem = LessonBankQuizItem & { _difficulty: number | null };

function stableSortRows(lessonKey: string, rows: EnrichedItem[]): EnrichedItem[] {
  return [...rows].sort((a, b) =>
    hashKey(lessonKey, a.examQuestionId).localeCompare(hashKey(lessonKey, b.examQuestionId)),
  );
}

function difficultyBand(d: number | null | undefined): "easy" | "mid" | "hard" {
  const n = d ?? 3;
  if (n <= 2) return "easy";
  if (n >= 4) return "hard";
  return "mid";
}

/**
 * Pick up to `targetCount` items with a simple easy/mid/hard mix when the pool allows.
 */
function pickBalanced(items: EnrichedItem[], targetCount: number): LessonBankQuizItem[] {
  if (items.length <= targetCount) return items.map(stripEnriched);
  const buckets = { easy: [] as EnrichedItem[], mid: [] as EnrichedItem[], hard: [] as EnrichedItem[] };
  for (const it of items) {
    buckets[difficultyBand(it._difficulty)].push(it);
  }
  const out: EnrichedItem[] = [];
  const pattern: Array<keyof typeof buckets> = ["mid", "easy", "hard", "mid", "easy", "hard", "mid", "hard", "easy", "mid"];
  let p = 0;
  const takeFrom = (b: keyof typeof buckets) => {
    const arr = buckets[b];
    if (arr.length === 0) return false;
    out.push(arr.shift()!);
    return true;
  };
  while (out.length < targetCount) {
    const b = pattern[p % pattern.length];
    p++;
    if (!takeFrom(b)) {
      const merged = [...buckets.easy, ...buckets.mid, ...buckets.hard];
      for (const m of merged) {
        if (out.length >= targetCount) break;
        if (!out.some((x) => x.examQuestionId === m.examQuestionId)) out.push(m);
      }
      break;
    }
  }
  if (out.length < targetCount) {
    for (const it of items) {
      if (out.length >= targetCount) break;
      if (!out.some((x) => x.examQuestionId === it.examQuestionId)) out.push(it);
    }
  }
  return out.slice(0, targetCount).map(stripEnriched);
}

function stripEnriched(it: EnrichedItem): LessonBankQuizItem {
  const { _difficulty: _d, ...rest } = it;
  return rest;
}

type Row = {
  id: string;
  stem: string;
  options: Prisma.JsonValue;
  correctAnswer: Prisma.JsonValue;
  questionType: string;
  rationale: string | null;
  difficulty: number | null;
};

/**
 * Load a bounded set of exam-bank MCQs related to the lesson for the optional study loop.
 * Returns empty pack when the pool is too small or the DB is unavailable.
 */
export async function loadLessonStudyLoopBankPack(args: {
  pathway: ExamPathwayDefinition;
  lessonTitle: string;
  lessonTopic: string;
  lessonTopicSlug: string;
  bodySystem?: string | null;
  lessonSlug: string;
  lessonKey: string;
  targetCount?: number;
}): Promise<LessonStudyLoopBankPack> {
  const target = Math.min(
    LESSON_STUDY_LOOP_TARGET_MAX,
    Math.max(LESSON_STUDY_LOOP_MIN_QUESTIONS, args.targetCount ?? LESSON_STUDY_LOOP_TARGET_DEFAULT),
  );
  const where = buildRelatedExamQuestionWhereForPathwayLesson({
    pathway: args.pathway,
    lessonTitle: args.lessonTitle,
    lessonTopic: args.lessonTopic,
    lessonTopicSlug: args.lessonTopicSlug,
    bodySystem: args.bodySystem,
    lessonSlug: args.lessonSlug,
  });
  if (!where) {
    return { items: [], questionIds: [], poolCount: 0, targetRequested: target };
  }

  const rows = await withDatabaseFallback(
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
        take: RELATED_EXAM_QUESTIONS_CAP,
      }),
    [] as Row[],
  );

  const mapped: EnrichedItem[] = [];
  for (const r of rows) {
    const item = examRowToLessonBankItem(r as Row);
    if (!item) continue;
    mapped.push({ ...item, _difficulty: r.difficulty ?? null });
  }

  const poolCount = mapped.length;
  if (poolCount < LESSON_STUDY_LOOP_MIN_QUESTIONS) {
    return { items: [], questionIds: [], poolCount, targetRequested: target };
  }

  const sorted = stableSortRows(args.lessonKey, mapped);
  const effectiveTarget = Math.min(target, sorted.length);
  const items = pickBalanced(sorted, effectiveTarget);
  return {
    items,
    questionIds: items.map((i) => i.examQuestionId),
    poolCount,
    targetRequested: effectiveTarget,
  };
}

/**
 * Build study-loop pack from already-resolved explicit bank items (avoids a second DB read).
 */
export function buildLessonStudyLoopBankPackFromPreloadedExplicitItems(args: {
  preloadedItems: LessonBankQuizItem[];
  lessonKey: string;
  targetCount?: number;
}): LessonStudyLoopBankPack {
  const target = Math.min(
    LESSON_STUDY_LOOP_TARGET_MAX,
    Math.max(LESSON_STUDY_LOOP_MIN_QUESTIONS, args.targetCount ?? LESSON_STUDY_LOOP_TARGET_DEFAULT),
  );
  const enriched: EnrichedItem[] = args.preloadedItems.map((it) => ({ ...it, _difficulty: null }));
  const poolCount = enriched.length;
  if (poolCount < LESSON_STUDY_LOOP_MIN_QUESTIONS) {
    return { items: [], questionIds: [], poolCount, targetRequested: target };
  }
  const sorted = stableSortRows(args.lessonKey, enriched);
  const effectiveTarget = Math.min(target, sorted.length);
  const items = pickBalanced(sorted, effectiveTarget);
  return {
    items,
    questionIds: items.map((i) => i.examQuestionId),
    poolCount,
    targetRequested: effectiveTarget,
  };
}

/**
 * Study loop pack from explicit lesson `ExamQuestion` ids (no topic discovery pool).
 * Pass `preloadedItems` when the caller already ran {@link loadLessonBankQuizItemsByExamIds} for the combined id list.
 */
export async function loadLessonStudyLoopBankPackFromExplicitIds(args: {
  entitlement: AccessScope;
  pathway: ExamPathwayDefinition;
  preTestQuestionIds?: string[];
  postTestQuestionIds?: string[];
  lessonKey: string;
  targetCount?: number;
  preloadedItems?: LessonBankQuizItem[];
}): Promise<LessonStudyLoopBankPack> {
  const target = Math.min(
    LESSON_STUDY_LOOP_TARGET_MAX,
    Math.max(LESSON_STUDY_LOOP_MIN_QUESTIONS, args.targetCount ?? LESSON_STUDY_LOOP_TARGET_DEFAULT),
  );
  const combined = explicitLessonStudyLoopCombinedSanitizedIds(args.preTestQuestionIds, args.postTestQuestionIds);

  if (!args.entitlement.hasAccess) {
    return { items: [], questionIds: [], poolCount: combined.length, targetRequested: target };
  }

  /** Gate on resolved renderable rows when preloaded — raw configured id count can exceed accessible MCQs. */
  if (args.preloadedItems?.length) {
    if (args.preloadedItems.length < LESSON_STUDY_LOOP_MIN_QUESTIONS) {
      return {
        items: [],
        questionIds: [],
        poolCount: args.preloadedItems.length,
        targetRequested: target,
      };
    }
    return buildLessonStudyLoopBankPackFromPreloadedExplicitItems({
      preloadedItems: args.preloadedItems,
      lessonKey: args.lessonKey,
      targetCount: args.targetCount,
    });
  }

  if (combined.length < LESSON_STUDY_LOOP_MIN_QUESTIONS) {
    return { items: [], questionIds: [], poolCount: combined.length, targetRequested: target };
  }

  const flat = await loadLessonBankQuizItemsByExamIds({
    entitlement: args.entitlement,
    countryCode: args.pathway.countryCode,
    ids: combined,
  });
  return buildLessonStudyLoopBankPackFromPreloadedExplicitItems({
    preloadedItems: flat.items,
    lessonKey: args.lessonKey,
    targetCount: args.targetCount,
  });
}
