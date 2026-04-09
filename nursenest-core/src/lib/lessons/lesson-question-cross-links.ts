import { ContentStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { pathwayExamQuestionMarketingWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/** Upper bound for cross-link lists (lesson ↔ question bank). */
export const RELATED_EXAM_QUESTIONS_CAP = 8;
export const RELATED_LESSONS_FOR_TOPIC_CAP = 8;

export type RelatedExamQuestionStem = {
  id: string;
  stemPreview: string;
};

function stemPreview(stem: string, max = 155): string {
  const t = stem.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

/**
 * Published exam questions in the pathway’s marketing-scoped pool that match the lesson’s topic tags
 * (`topic`, `bodySystem`, optional `tags` overlap with `topicSlug`). Single bounded query; no scans.
 */
export async function loadRelatedExamQuestionStemsForPathwayLesson(args: {
  pathway: ExamPathwayDefinition;
  lessonTopic: string;
  lessonTopicSlug: string;
  bodySystem?: string | null;
}): Promise<RelatedExamQuestionStem[]> {
  const { pathway, lessonTopic, lessonTopicSlug, bodySystem } = args;
  const base = pathwayExamQuestionMarketingWhere(pathway);
  const topicTrim = lessonTopic.trim();
  const slug = lessonTopicSlug.trim().toLowerCase();
  const fromSlugWords = slug.replace(/-/g, " ").trim();

  const orClauses: Prisma.ExamQuestionWhereInput[] = [];
  if (topicTrim.length > 0) {
    orClauses.push({ topic: { equals: topicTrim, mode: "insensitive" } });
  }
  if (fromSlugWords.length > 0 && fromSlugWords !== topicTrim.toLowerCase()) {
    orClauses.push({ topic: { equals: fromSlugWords, mode: "insensitive" } });
  }
  if (bodySystem?.trim()) {
    orClauses.push({ bodySystem: { equals: bodySystem.trim(), mode: "insensitive" } });
  }
  if (slug.length > 0) {
    orClauses.push({ tags: { has: slug } });
  }

  if (orClauses.length === 0) return [];

  return withDatabaseFallback(
    async () => {
      const rows = await prisma.examQuestion.findMany({
        where: {
          AND: [base, { OR: orClauses }],
        },
        select: { id: true, stem: true },
        orderBy: { updatedAt: "desc" },
        take: RELATED_EXAM_QUESTIONS_CAP,
      });
      return rows.map((r) => ({ id: r.id, stemPreview: stemPreview(r.stem) }));
    },
    [],
  );
}

/** Pass to {@link getRelatedPathwayLessons} when no lesson should be excluded (hub / topic-only views). */
export const RELATED_LESSONS_EXCLUDE_SLUG_SENTINEL = "__related_lessons_exclude_none__";

/**
 * Resolve `topicSlug` from a human topic label (one row) so we can reuse {@link getRelatedPathwayLessons} safely.
 */
export async function resolveTopicSlugForPathwayTopicLabel(
  pathwayId: string,
  topicLabel: string,
): Promise<string | null> {
  const q = topicLabel.trim();
  if (!q) return null;
  return withDatabaseFallback(
    async () => {
      const row = await prisma.pathwayLesson.findFirst({
        where: {
          pathwayId,
          status: ContentStatus.PUBLISHED,
          topic: { equals: q, mode: "insensitive" },
        },
        select: { topicSlug: true },
        orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
      });
      if (row?.topicSlug) return row.topicSlug;
      const guess = q
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (!guess) return null;
      const bySlug = await prisma.pathwayLesson.findFirst({
        where: { pathwayId, status: ContentStatus.PUBLISHED, topicSlug: guess },
        select: { topicSlug: true },
      });
      return bySlug?.topicSlug ?? null;
    },
    null,
  );
}
