import "server-only";

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
import { logExplicitExamQuestionLoadOutcome } from "@/lib/lessons/lesson-explicit-exam-question-observability";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  assemblePathwayLessonBankAssessmentsFromParts,
  LESSON_ASSESSMENT_POST_MAX,
  LESSON_ASSESSMENT_POST_MIN,
  LESSON_ASSESSMENT_PRE_MAX,
  LESSON_ASSESSMENT_PRE_MIN,
  mergeAssessmentWithBank,
  orderedExplicitLessonBankItemsForConfiguredIds,
  splitBankPrePost,
} from "@/lib/lessons/lesson-bank-assessment-assembly-pure";

export {
  LESSON_ASSESSMENT_PRE_MIN,
  LESSON_ASSESSMENT_PRE_MAX,
  LESSON_ASSESSMENT_POST_MIN,
  LESSON_ASSESSMENT_POST_MAX,
  mergeAssessmentWithBank,
  splitBankPrePost,
  orderedExplicitLessonBankItemsForConfiguredIds,
  assemblePathwayLessonBankAssessmentsFromParts,
};

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
        const ordered = orderedExplicitLessonBankItemsForConfiguredIds(preIds, byId);
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
        const ordered = orderedExplicitLessonBankItemsForConfiguredIds(postIds, byId);
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
  return assemblePathwayLessonBankAssessmentsFromParts({
    lesson,
    lessonKey,
    pool,
    explicitPre,
    explicitPost,
  });
}
