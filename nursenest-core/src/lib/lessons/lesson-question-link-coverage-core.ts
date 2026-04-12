/**
 * Shared lesson ↔ bank link coverage scan (same predicate as lesson UI / audits).
 */
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getExamPathwayById, listExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  countRelatedExamQuestionsForPathwayLesson,
  lessonQuestionCoverageTierFromCount,
  relatedExamQuestionsNeededForIdealBand,
  relatedExamQuestionsNeededForMinTarget,
  RELATED_EXAM_QUESTIONS_IDEAL_MIN,
  RELATED_EXAM_QUESTIONS_MIN_TARGET,
} from "@/lib/lessons/lesson-question-cross-links";

export type LessonQuestionLinkCoverageRow = {
  pathwayId: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  relatedQuestionCount: number;
  tier: ReturnType<typeof lessonQuestionCoverageTierFromCount>;
  neededForMin: number;
  /** Additional items to reach ideal lower bound (15), 0 if already at/above */
  neededForIdeal: number;
};

export type LessonQuestionLinkCoverageSummary = {
  generatedAt: string;
  pathwayCount: number;
  lessonRows: number;
  byTier: Record<ReturnType<typeof lessonQuestionCoverageTierFromCount>, number>;
  /** Related count === 0 */
  zeroQuestions: number;
  /** Related count 1–4 */
  underFiveQuestions: number;
  /** Related count < {@link RELATED_EXAM_QUESTIONS_MIN_TARGET} */
  belowMinTarget: number;
  /** Related count in [min, ideal) */
  belowIdealBand: number;
  skippedPathways: string[];
  thresholds: {
    minTarget: number;
    idealMin: number;
    idealMax: number;
  };
};

function buildLessonQuestionLinkSummary(
  pathwayIds: string[],
  skippedPathways: string[],
  rows: LessonQuestionLinkCoverageRow[],
): LessonQuestionLinkCoverageSummary {
  return {
    generatedAt: new Date().toISOString(),
    pathwayCount: pathwayIds.length - skippedPathways.length,
    lessonRows: rows.length,
    byTier: {
      critical: rows.filter((r) => r.tier === "critical").length,
      low: rows.filter((r) => r.tier === "low").length,
      below_minimum: rows.filter((r) => r.tier === "below_minimum").length,
      adequate: rows.filter((r) => r.tier === "adequate").length,
      ideal: rows.filter((r) => r.tier === "ideal").length,
    },
    zeroQuestions: rows.filter((r) => r.relatedQuestionCount === 0).length,
    underFiveQuestions: rows.filter((r) => r.relatedQuestionCount > 0 && r.relatedQuestionCount < 5).length,
    belowMinTarget: rows.filter((r) => r.relatedQuestionCount < RELATED_EXAM_QUESTIONS_MIN_TARGET).length,
    belowIdealBand: rows.filter(
      (r) =>
        r.relatedQuestionCount >= RELATED_EXAM_QUESTIONS_MIN_TARGET &&
        r.relatedQuestionCount < RELATED_EXAM_QUESTIONS_IDEAL_MIN,
    ).length,
    skippedPathways,
    thresholds: {
      minTarget: RELATED_EXAM_QUESTIONS_MIN_TARGET,
      idealMin: RELATED_EXAM_QUESTIONS_IDEAL_MIN,
      idealMax: 25,
    },
  };
}

/**
 * Scan arbitrary pathway ids (e.g. registry + DB-only catalogs). Unresolved ids are skipped with counts in summary.
 */
export async function scanLessonQuestionLinkCoverageForPathways(
  pathwayIds: string[],
  resolvePathway: (pathwayId: string) => ExamPathwayDefinition | undefined,
): Promise<{
  rows: LessonQuestionLinkCoverageRow[];
  summary: LessonQuestionLinkCoverageSummary;
}> {
  const sortedIds = [...new Set(pathwayIds)].sort((a, b) => a.localeCompare(b));
  const rows: LessonQuestionLinkCoverageRow[] = [];
  const skippedPathways: string[] = [];

  for (const pathwayId of sortedIds) {
    const pathway = resolvePathway(pathwayId);
    if (!pathway) {
      skippedPathways.push(pathwayId);
      continue;
    }

    const lessons = await prisma.pathwayLesson.findMany({
      where: { pathwayId, status: ContentStatus.PUBLISHED, locale: "en" },
      select: { slug: true, title: true, topic: true, topicSlug: true, bodySystem: true },
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
    });

    for (const L of lessons) {
      const relatedQuestionCount = await countRelatedExamQuestionsForPathwayLesson({
        pathway,
        lessonTitle: L.title,
        lessonTopic: L.topic,
        lessonTopicSlug: L.topicSlug,
        bodySystem: L.bodySystem,
        lessonSlug: L.slug,
      });
      const tier = lessonQuestionCoverageTierFromCount(relatedQuestionCount);
      const neededForMin = relatedExamQuestionsNeededForMinTarget(relatedQuestionCount);
      const neededIdeal = relatedExamQuestionsNeededForIdealBand(relatedQuestionCount);
      rows.push({
        pathwayId,
        slug: L.slug,
        title: L.title,
        topic: L.topic,
        topicSlug: L.topicSlug,
        bodySystem: L.bodySystem,
        relatedQuestionCount,
        tier,
        neededForMin,
        neededForIdeal: neededIdeal,
      });
    }
  }

  return {
    rows,
    summary: buildLessonQuestionLinkSummary(sortedIds, skippedPathways, rows),
  };
}

/**
 * Full scan: every published EN pathway lesson × registry pathways (optionally one pathway id).
 */
export async function scanLessonQuestionLinkCoverage(pathwayFilter?: string | null): Promise<{
  rows: LessonQuestionLinkCoverageRow[];
  summary: LessonQuestionLinkCoverageSummary;
}> {
  const pathwayIds = pathwayFilter
    ? [pathwayFilter]
    : listExamPathways()
        .map((p) => p.id)
        .sort((a, b) => a.localeCompare(b));

  return scanLessonQuestionLinkCoverageForPathways(pathwayIds, (id) => getExamPathwayById(id));
}
