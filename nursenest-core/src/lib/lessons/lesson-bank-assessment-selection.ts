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
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  loadLessonBankQuizItemsByExamIdsWithDiagnostics,
  type LessonExplicitExamQuestionLoadDiagnostics,
} from "@/lib/lessons/lesson-explicit-exam-question-items";
import type { ExplicitExamQuestionIdLoadDiagnostics, ExplicitIdDropReason } from "@/lib/lessons/lesson-explicit-exam-question-resolution-pipeline";
import { sanitizeQuestionIdArrayWithDiagnostics } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { preferExplicitAssessmentSide } from "@/lib/lessons/lesson-assessment-explicit-pure";
import {
  isExplicitQuestionIdsDebugLoggingEnabled,
  logExplicitExamQuestionLoadOutcome,
} from "@/lib/lessons/lesson-explicit-exam-question-observability";
import { safeServerLog } from "@/lib/observability/safe-server-log";

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
  const capped = out.slice(0, Math.min(max, out.length));
  if (capped.length >= min) return capped;
  /** Show thin catalog-only sets rather than hiding when the bank cannot pad to `min`. */
  if (capped.length > 0) return capped;
  return [];
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
  const primaryItems = await rowsToItems(primaryRows);
  const seen = new Set(primaryItems.map((i) => i.examQuestionId));

  if (primaryItems.length >= LESSON_ASSESSMENT_PRE_MAX + LESSON_ASSESSMENT_POST_MAX) {
    return primaryItems;
  }

  const base = pathwayExamQuestionMarketingWhere(pathway);
  const exclude =
    seen.size > 0
      ? ({ id: { notIn: [...seen] } } satisfies Prisma.ExamQuestionWhereInput)
      : ({} satisfies Prisma.ExamQuestionWhereInput);
  const fallbackRows = await fetchMcqRows({ AND: [base, exclude] }, FETCH_CAP);
  const extra: LessonBankQuizItem[] = [];
  for (const r of fallbackRows) {
    if (seen.has(r.id)) continue;
    const item = examRowToLessonBankItem(r);
    if (!item) continue;
    seen.add(r.id);
    extra.push(item);
    if (primaryItems.length + extra.length >= FETCH_CAP) break;
  }

  return [...primaryItems, ...extra];
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

function orderedExplicitItemsForConfiguredIds(
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

function lessonExplicitDiagnosticsToCore(d: LessonExplicitExamQuestionLoadDiagnostics): ExplicitExamQuestionIdLoadDiagnostics {
  return {
    orderedUniqRequestedIds: d.requestedOrderedIds,
    resolvedExamQuestionIds: d.resolvedIds,
    dropped: d.drops.map((x) => ({
      id: x.id,
      reason: (x.reason === "finalize_drop" ? "finalize_rejected" : x.reason) as ExplicitIdDropReason,
    })),
    zeroResolvedWithSubscriberAccess: d.requestedOrderedIds.length > 0 && d.resolvedIds.length === 0,
  };
}

function logExplicitAssessmentZeroResolve(params: {
  pathwayId: string;
  lessonSlug: string;
  side: "pre" | "post";
  configuredIds: string[];
  diagnostics?: LessonExplicitExamQuestionLoadDiagnostics;
}): void {
  const core: ExplicitExamQuestionIdLoadDiagnostics = params.diagnostics
    ? lessonExplicitDiagnosticsToCore(params.diagnostics)
    : {
        orderedUniqRequestedIds: params.configuredIds,
        resolvedExamQuestionIds: [],
        dropped: [],
        zeroResolvedWithSubscriberAccess: params.configuredIds.length > 0,
      };
  logExplicitExamQuestionLoadOutcome({
    scope: "lesson_explicit_exam_ids",
    pathwayId: params.pathwayId,
    lessonSlug: params.lessonSlug,
    phase: params.side,
    hadConfiguredUniqIds: params.configuredIds.length > 0,
    hadSubscriberAccess: true,
    diagnostics: core,
    fallbackSurface: "assessment_merge",
  });
  if (isExplicitQuestionIdsDebugLoggingEnabled() && params.diagnostics) {
    safeServerLog("lesson_explicit_exam_ids", "assessment_explicit_zero_resolve_verbose", {
      pathwayId: params.pathwayId,
      lessonSlug: params.lessonSlug,
      side: params.side,
      drops: params.diagnostics.drops.length,
    });
  }
}

export type ExplicitLessonBankQuizCombinedLoad = {
  items: LessonBankQuizItem[];
  diagnostics: LessonExplicitExamQuestionLoadDiagnostics;
};

/**
 * Resolve pre/post lesson quizzes: catalog when present, padded from the pathway question bank.
 * Returns empty arrays when the bank cannot satisfy minimums (caller hides sections).
 *
 * Pass `explicitCombinedLoad` when the caller already resolved pre+post ids in one combined fetch
 * (avoids duplicate DB reads on hot learner paths).
 */
export async function resolvePathwayLessonBankAssessments(
  pathway: ExamPathwayDefinition,
  lesson: PathwayLessonRecord,
  access?: AccessScope | null,
  options?: { explicitCombinedLoad?: ExplicitLessonBankQuizCombinedLoad },
): Promise<{ preTest: PathwayLessonQuizItem[]; postTest: PathwayLessonQuizItem[] }> {
  const preSan = sanitizeQuestionIdArrayWithDiagnostics(lesson.preTestQuestionIds);
  const postSan = sanitizeQuestionIdArrayWithDiagnostics(lesson.postTestQuestionIds);
  const preIds = preSan.ids ?? [];
  const postIds = postSan.ids ?? [];
  const hadConfiguredPreRaw =
    Array.isArray(lesson.preTestQuestionIds) &&
    lesson.preTestQuestionIds.some((x) => typeof x === "string" && x.trim().length > 0);
  const hadConfiguredPostRaw =
    Array.isArray(lesson.postTestQuestionIds) &&
    lesson.postTestQuestionIds.some((x) => typeof x === "string" && x.trim().length > 0);

  let explicitPre: PathwayLessonQuizItem[] | null = null;
  let explicitPost: PathwayLessonQuizItem[] | null = null;
  if (access?.hasAccess) {
    if (hadConfiguredPreRaw && !preIds.length) {
      safeServerLog("lesson_explicit_exam_ids", "explicit_exam_question_ids_all_sanitized_away", {
        phase: "pre",
        pathwayId: pathway.id,
        lessonSlug: lesson.slug,
        sanitizeDropped: preSan.dropped.length,
      });
    }
    if (hadConfiguredPostRaw && !postIds.length) {
      safeServerLog("lesson_explicit_exam_ids", "explicit_exam_question_ids_all_sanitized_away", {
        phase: "post",
        pathwayId: pathway.id,
        lessonSlug: lesson.slug,
        sanitizeDropped: postSan.dropped.length,
      });
    }
    if (options?.explicitCombinedLoad) {
      const byId = new Map(options.explicitCombinedLoad.items.map((x) => [x.examQuestionId, x]));
      if (preIds.length) {
        const ordered = orderedExplicitItemsForConfiguredIds(preIds, byId);
        if (ordered.length) explicitPre = ordered;
        else logExplicitAssessmentZeroResolve({
          pathwayId: pathway.id,
          lessonSlug: lesson.slug,
          side: "pre",
          configuredIds: preIds,
          diagnostics: options.explicitCombinedLoad.diagnostics,
        });
      }
      if (postIds.length) {
        const ordered = orderedExplicitItemsForConfiguredIds(postIds, byId);
        if (ordered.length) explicitPost = ordered;
        else
          logExplicitAssessmentZeroResolve({
            pathwayId: pathway.id,
            lessonSlug: lesson.slug,
            side: "post",
            configuredIds: postIds,
            diagnostics: options.explicitCombinedLoad.diagnostics,
          });
      }
    } else {
      if (preIds.length) {
        const { items: loaded, diagnostics } = await loadLessonBankQuizItemsByExamIdsWithDiagnostics({
          entitlement: access,
          countryCode: pathway.countryCode,
          ids: preIds,
          logContext: { pathwayId: pathway.id, lessonSlug: lesson.slug, side: "pre" },
        });
        if (loaded.length) explicitPre = loaded;
        else
          logExplicitAssessmentZeroResolve({
            pathwayId: pathway.id,
            lessonSlug: lesson.slug,
            side: "pre",
            configuredIds: preIds,
            diagnostics,
          });
      }
      if (postIds.length) {
        const { items: loaded, diagnostics } = await loadLessonBankQuizItemsByExamIdsWithDiagnostics({
          entitlement: access,
          countryCode: pathway.countryCode,
          ids: postIds,
          logContext: { pathwayId: pathway.id, lessonSlug: lesson.slug, side: "post" },
        });
        if (loaded.length) explicitPost = loaded;
        else
          logExplicitAssessmentZeroResolve({
            pathwayId: pathway.id,
            lessonSlug: lesson.slug,
            side: "post",
            configuredIds: postIds,
            diagnostics,
          });
      }
    }
  }

  const lessonKey = `${pathway.id}:${lesson.slug}`;
  const pool = await loadLessonBankAssessmentItems(pathway, lesson);
  if (pool.length === 0) {
    return {
      preTest: preferExplicitAssessmentSide(
        explicitPre,
        mergeAssessmentWithBank(lesson.preTest, [], LESSON_ASSESSMENT_PRE_MIN, LESSON_ASSESSMENT_PRE_MAX),
      ),
      postTest: preferExplicitAssessmentSide(
        explicitPost,
        mergeAssessmentWithBank(lesson.postTest, [], LESSON_ASSESSMENT_POST_MIN, LESSON_ASSESSMENT_POST_MAX),
      ),
    };
  }

  const { preBank, postBank } = splitBankPrePost(lessonKey, pool);
  const preTest = preferExplicitAssessmentSide(
    explicitPre,
    mergeAssessmentWithBank(lesson.preTest, preBank, LESSON_ASSESSMENT_PRE_MIN, LESSON_ASSESSMENT_PRE_MAX),
  );
  const postTest = preferExplicitAssessmentSide(
    explicitPost,
    mergeAssessmentWithBank(lesson.postTest, postBank, LESSON_ASSESSMENT_POST_MIN, LESSON_ASSESSMENT_POST_MAX),
  );
  return { preTest, postTest };
}
