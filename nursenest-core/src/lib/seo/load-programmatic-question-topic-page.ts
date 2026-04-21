import "server-only";

import { ContentStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayExamQuestionMarketingWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { PATHWAY_LESSON_CANONICAL_DB_LOCALE } from "@/lib/lessons/pathway-lesson-locale";
import {
  getProgrammaticQuestionTopicDefinition,
  type ProgrammaticQuestionTopicDefinition,
} from "@/lib/seo/programmatic-question-topic-registry";

export const PROGRAMMATIC_QUESTION_TOPIC_PAGE_SIZE = 6;
/** Defense-in-depth: shallow pagination only. */
export const PROGRAMMATIC_QUESTION_TOPIC_MAX_PAGE = 12;
const PROGRAMMATIC_QUESTION_TOPIC_DB_TIMEOUT_MS = 1000;

export type ProgrammaticQuestionTopicRow = {
  id: string;
  stem: string;
  optionsText: string[];
};

export type RelatedLessonLink = { href: string; title: string };

function mergeWhere(
  base: Prisma.ExamQuestionWhereInput,
  extra?: Prisma.ExamQuestionWhereInput,
): Prisma.ExamQuestionWhereInput {
  if (!extra || Object.keys(extra).length === 0) return base;
  return { AND: [base, extra] };
}

function normalizeOptions(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const o of raw) {
    if (typeof o === "string") {
      out.push(o);
      continue;
    }
    if (o && typeof o === "object" && "text" in o && typeof (o as { text: unknown }).text === "string") {
      out.push((o as { text: string }).text);
    }
  }
  return out;
}

function truncateStem(s: string, max = 720): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

async function withProgrammaticTopicFallback<T>(run: () => Promise<T>, fallback: T, label: string): Promise<T> {
  return withDatabaseFallbackTimeout(run, fallback, PROGRAMMATIC_QUESTION_TOPIC_DB_TIMEOUT_MS, {
    scope: "seo_programmatic_topic",
    label,
  });
}

async function resolveWhere(
  pathway: ExamPathwayDefinition,
  def: ProgrammaticQuestionTopicDefinition,
): Promise<{ where: Prisma.ExamQuestionWhereInput; usedFallback: boolean }> {
  const base = pathwayExamQuestionMarketingWhere(pathway);
  const narrow = def.topicWhere ? mergeWhere(base, def.topicWhere) : base;
  const narrowCount = await withProgrammaticTopicFallback(() => prisma.examQuestion.count({ where: narrow }), 0, "narrow_count");
  if (narrowCount > 0 || !def.fallbackToPathwayPool) {
    return { where: narrow, usedFallback: false };
  }
  const broadCount = await withProgrammaticTopicFallback(() => prisma.examQuestion.count({ where: base }), 0, "broad_count");
  return { where: base, usedFallback: broadCount > 0 && narrowCount === 0 };
}

async function loadQuestionsForPageUncached(
  def: ProgrammaticQuestionTopicDefinition,
  page: number,
): Promise<{
  rows: ProgrammaticQuestionTopicRow[];
  total: number;
  usedFallback: boolean;
}> {
  const pathway = getExamPathwayById(def.primaryPathwayId);
  if (!pathway) {
    return { rows: [], total: 0, usedFallback: false };
  }
  const { where, usedFallback } = await resolveWhere(pathway, def);
  const total = await withProgrammaticTopicFallback(() => prisma.examQuestion.count({ where }), 0, "page_total");
  if (total === 0) {
    return { rows: [], total: 0, usedFallback };
  }
  const skip = (page - 1) * PROGRAMMATIC_QUESTION_TOPIC_PAGE_SIZE;
  const rawRows = await withProgrammaticTopicFallback(
    () =>
      prisma.examQuestion.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }],
        skip,
        take: PROGRAMMATIC_QUESTION_TOPIC_PAGE_SIZE,
        select: { id: true, stem: true, options: true },
      }),
    [],
    "page_rows",
  );
  const rows: ProgrammaticQuestionTopicRow[] = rawRows.map((r) => ({
    id: r.id,
    stem: truncateStem(r.stem),
    optionsText: normalizeOptions(r.options).slice(0, 8),
  }));
  return { rows, total, usedFallback };
}

const loadProgrammaticQuestionTopicQuestionsCached = unstable_cache(
  async (slug: string, safePage: number) => {
    const def = await getProgrammaticQuestionTopicDefinition(slug);
    if (!def) return null;
    return loadQuestionsForPageUncached(def, safePage);
  },
  ["programmatic-question-topic-questions"],
  { revalidate: 3600 },
);

export async function loadProgrammaticQuestionTopicQuestions(
  slug: string,
  page: number,
): Promise<{
  rows: ProgrammaticQuestionTopicRow[];
  total: number;
  pageCount: number;
  usedFallback: boolean;
} | null> {
  const def = await getProgrammaticQuestionTopicDefinition(slug);
  if (!def) return null;
  const safePage = Math.min(Math.max(1, page), PROGRAMMATIC_QUESTION_TOPIC_MAX_PAGE);
  const result = await loadProgrammaticQuestionTopicQuestionsCached(slug, safePage);
  if (!result) return null;
  const { rows, total, usedFallback } = result;
  const pageCount = Math.max(1, Math.ceil(total / PROGRAMMATIC_QUESTION_TOPIC_PAGE_SIZE));
  return { rows, total, pageCount, usedFallback };
}

async function loadRelatedLessonsUncached(def: ProgrammaticQuestionTopicDefinition): Promise<RelatedLessonLink[]> {
  if (!def.relatedLessons?.length) return [];

  const links: RelatedLessonLink[] = [];
  for (const spec of def.relatedLessons) {
    const lessonPathway = getExamPathwayById(spec.pathwayId);
    if (!lessonPathway) continue;
    const basePath = buildExamPathwayPath(lessonPathway);
    const where: Prisma.PathwayLessonWhereInput = {
      pathwayId: spec.pathwayId,
      status: ContentStatus.PUBLISHED,
      structuralPublicComplete: true,
      locale: PATHWAY_LESSON_CANONICAL_DB_LOCALE,
    };
    const or: Prisma.PathwayLessonWhereInput[] = [];
    if (spec.topicSlugContains?.trim()) {
      or.push({ topicSlug: { contains: spec.topicSlugContains.trim(), mode: "insensitive" } });
    }
    if (spec.topicContains?.trim()) {
      or.push({ topic: { contains: spec.topicContains.trim(), mode: "insensitive" } });
    }
    if (or.length === 0) continue;
    where.OR = or;
    const rows = await withProgrammaticTopicFallback(
      () =>
        prisma.pathwayLesson.findMany({
          where,
          take: 5,
          orderBy: { sortOrder: "asc" },
          select: { slug: true, title: true },
        }),
      [],
      `related_lessons:${spec.pathwayId}`,
    );
    for (const r of rows) {
      links.push({ title: r.title, href: `${basePath}/lessons/${r.slug}` });
    }
  }
  const seen = new Set<string>();
  return links.filter((l) => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  }).slice(0, 8);
}

const loadProgrammaticQuestionTopicRelatedLessonsCached = unstable_cache(
  async (slug: string) => {
    const def = await getProgrammaticQuestionTopicDefinition(slug);
    if (!def) return [];
    return loadRelatedLessonsUncached(def);
  },
  ["programmatic-question-topic-lessons"],
  { revalidate: 3600 },
);

export async function loadProgrammaticQuestionTopicRelatedLessons(slug: string): Promise<RelatedLessonLink[]> {
  return loadProgrammaticQuestionTopicRelatedLessonsCached(slug);
}
