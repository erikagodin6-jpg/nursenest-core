/**
 * Unified lookup: **topicSlug + pathway** → ranked PathwayLesson rows for rationales, CTAs, and study flow.
 * Reuses the same scoring floors as rationale deep links — do not surface guesses below confidence thresholds.
 */
import type { PrismaClient } from "@prisma/client";
import { ContentStatus } from "@prisma/client";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  RATIONALE_DB_EXACT_MIN_SCORE,
  RATIONALE_DB_WEAK_MIN_SCORE,
  rankPathwayLessonRowsForQuestion,
  type PathwayLessonScoreRow,
} from "@/lib/learner/lesson-question-rationale/pathway-lesson-match";
import { pathwayRationaleContextFromId } from "@/lib/learner/lesson-question-rationale/pathway-context";
import type { QuestionRationaleSignals } from "@/lib/learner/lesson-question-rationale/types";
import type { RationaleLessonLinkKind } from "@/lib/learner/lesson-question-rationale/types";

export type ExamContextLessonHit = {
  id: string;
  slug: string;
  title: string;
  topicSlug: string;
  score: number;
  kind: RationaleLessonLinkKind;
  appHref: string;
};

export type FindLessonsForExamContextResult = {
  pathwayId: string;
  topicSlug: string;
  primary: ExamContextLessonHit | null;
  related: ExamContextLessonHit[];
  /** When no row clears the primary threshold */
  suppressedReason?: "invalid_pathway" | "no_published_rows" | "low_confidence";
};

/**
 * Find best-matching published lessons for a pathway + topic cluster slug.
 * Optional `stem`/`tags` improve token overlap (same as question rationale resolver).
 */
export async function findLessonsForExamContext(
  prisma: PrismaClient,
  opts: {
    pathwayId: string;
    topicSlug: string;
    stem?: string | null;
    tags?: string[];
    /** Default: {@link RATIONALE_DB_EXACT_MIN_SCORE} */
    primaryMinScore?: number;
    /** Default: {@link RATIONALE_DB_WEAK_MIN_SCORE} */
    relatedMinScore?: number;
    maxRelated?: number;
  },
): Promise<FindLessonsForExamContextResult> {
  const pathwayId = opts.pathwayId.trim();
  const topicSlug = opts.topicSlug.trim();
  const primaryMin = opts.primaryMinScore ?? RATIONALE_DB_EXACT_MIN_SCORE;
  const relatedMin = opts.relatedMinScore ?? RATIONALE_DB_WEAK_MIN_SCORE;
  const maxRelated = Math.max(0, Math.min(5, opts.maxRelated ?? 3));

  if (!getExamPathwayById(pathwayId)) {
    return { pathwayId, topicSlug, primary: null, related: [], suppressedReason: "invalid_pathway" };
  }

  const pathwayCtx = pathwayRationaleContextFromId(pathwayId);
  const rows = await prisma.pathwayLesson.findMany({
    where: {
      pathwayId,
      topicSlug,
      status: ContentStatus.PUBLISHED,
      locale: "en",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      topic: true,
      topicSlug: true,
      bodySystem: true,
      countryCode: true,
    },
  });

  if (rows.length === 0) {
    return { pathwayId, topicSlug, primary: null, related: [], suppressedReason: "no_published_rows" };
  }

  const signals: QuestionRationaleSignals = {
    topic: null,
    subtopic: null,
    bodySystem: null,
    tags: opts.tags ?? [],
    topicCode: topicSlug,
    stem: opts.stem ?? null,
  };

  const ranked = rankPathwayLessonRowsForQuestion(
    signals,
    pathwayCtx,
    rows as PathwayLessonScoreRow[],
    topicSlug,
  );

  const toHit = (r: (typeof ranked)[number]): ExamContextLessonHit => ({
    id: r.row.id,
    slug: r.row.slug,
    title: r.row.title,
    topicSlug: r.row.topicSlug,
    score: r.score,
    kind: r.kind,
    appHref: `/app/lessons/${r.row.id}`,
  });

  const primaryRow = ranked.find((r) => r.score >= primaryMin) ?? null;
  const primary = primaryRow ? toHit(primaryRow) : null;

  const related: ExamContextLessonHit[] = [];
  for (const r of ranked) {
    if (primary && r.row.id === primary.id) continue;
    if (r.score < relatedMin) continue;
    related.push(toHit(r));
    if (related.length >= maxRelated) break;
  }

  if (!primary && related.length === 0) {
    return { pathwayId, topicSlug, primary: null, related: [], suppressedReason: "low_confidence" };
  }

  return { pathwayId, topicSlug, primary, related };
}
