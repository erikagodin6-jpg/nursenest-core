import { ContentStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { pathwayExamQuestionMarketingWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  getRnNclexLessonQuestionBankBridgeClauses,
  hasExplicitRnNclexLessonBridge,
} from "@/lib/lessons/rn-nclex-lesson-question-bank-bridge";

/** Upper bound for cross-link lists (lesson ↔ question bank). Single `findMany` uses `take` with this value. */
export const RELATED_EXAM_QUESTIONS_CAP = 8;

/** Max `topic.contains` OR branches from title/slug tokens (additive only; direct matches stay separate). */
const MAX_TOPIC_CONTAINS_TOKENS = 6;

/** Conservative stop list for title/slug-derived `contains` tokens only (not used for exact `lessonTopic` / slug-phrase). */
const TITLE_TOPIC_TOKEN_STOPWORDS = new Set([
  "all",
  "and",
  "any",
  "are",
  "adult",
  "adults",
  "assessment",
  "basic",
  "basics",
  "been",
  "but",
  "can",
  "care",
  "case",
  "cases",
  "clinical",
  "disease",
  "diseases",
  "disorders",
  "exam",
  "for",
  "from",
  "has",
  "have",
  "how",
  "into",
  "introduction",
  "interventions",
  "lesson",
  "lessons",
  "management",
  "may",
  "not",
  "nurse",
  "nurses",
  "nursing",
  "overview",
  "patient",
  "patients",
  "paediatric",
  "pediatric",
  "practice",
  "prioritization",
  "review",
  "safety",
  "study",
  "studies",
  "syndrome",
  "syndromes",
  "that",
  "the",
  "this",
  "use",
  "what",
  "when",
  "why",
  "will",
  "with",
  "without",
  "your",
  "you",
]);

/**
 * Short tokens that are valid length but too generic for `topic.contains` (common slug fragments / abbrev noise).
 */
const WEAK_TOPIC_CONTAINS_TOKENS = new Set([
  "ca",
  "iv",
  "med",
  "np",
  "pn",
  "rn",
  "us",
]);

/**
 * Lowercase, trim, strip apostrophes and punctuation, split on non-alphanumeric runs (covers space, hyphen, slash, underscore).
 * Bounded input (lesson titles / slugs); simple linear passes, no backtracking-heavy patterns.
 */
function rawTokensFromNormalizedSource(source: string): string[] {
  const collapsed = source
    .toLowerCase()
    .trim()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  if (!collapsed) return [];
  return collapsed
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

function shouldEmitContainsToken(t: string): boolean {
  if (t.length < 3) return false;
  if (TITLE_TOPIC_TOKEN_STOPWORDS.has(t)) return false;
  if (WEAK_TOPIC_CONTAINS_TOKENS.has(t)) return false;
  return true;
}

/**
 * Deterministic: emit eligible title tokens in order, then slug tokens not already seen; first-seen wins dedupe.
 * At most {@link MAX_TOPIC_CONTAINS_TOKENS} `topic.contains` branches — additive only (exact topic / body / tags unchanged).
 */
function deriveTopicMatchTokens(lessonTitle: string, topicSlug: string): string[] {
  const titlePart = rawTokensFromNormalizedSource(lessonTitle);
  const slugPart = rawTokensFromNormalizedSource(topicSlug);
  const seen = new Set<string>();
  const out: string[] = [];

  const pushIfEligible = (t: string): boolean => {
    if (!shouldEmitContainsToken(t) || seen.has(t)) return false;
    seen.add(t);
    out.push(t);
    return out.length >= MAX_TOPIC_CONTAINS_TOKENS;
  };

  for (const t of titlePart) {
    if (pushIfEligible(t)) return out;
  }
  for (const t of slugPart) {
    if (pushIfEligible(t)) return out;
  }
  return out;
}

export type RelatedExamQuestionStem = {
  id: string;
  stemPreview: string;
};

function stemPreview(stem: string, max = 155): string {
  const t = stem.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function dedupeOrClauses(clauses: Prisma.ExamQuestionWhereInput[]): Prisma.ExamQuestionWhereInput[] {
  const seen = new Set<string>();
  const out: Prisma.ExamQuestionWhereInput[] = [];
  for (const c of clauses) {
    const k = JSON.stringify(c);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(c);
  }
  return out;
}

/** Keep OR fan-in bounded when RN bridge + title tokens are merged. */
const MAX_RELATED_QUESTION_OR_CLAUSES = 26;

/**
 * Published exam questions in the pathway’s marketing-scoped pool that match the lesson (topic labels/tokens
 * from title + slug, optional `bodySystem`, optional `tags` has `topicSlug`). Single bounded `findMany`; no in-memory fallbacks.
 */
export async function loadRelatedExamQuestionStemsForPathwayLesson(args: {
  pathway: ExamPathwayDefinition;
  /** Lesson display title — tokenized for `topic` substring matches. */
  lessonTitle: string;
  /** Pathway lesson topic label (often matches `exam_questions.topic` exactly). */
  lessonTopic: string;
  lessonTopicSlug: string;
  bodySystem?: string | null;
  /** Catalog / DB lesson slug — enables RN NCLEX bridge hints (single query). */
  lessonSlug?: string;
}): Promise<RelatedExamQuestionStem[]> {
  const { pathway, lessonTitle, lessonTopic, lessonTopicSlug, bodySystem, lessonSlug } = args;
  const base = pathwayExamQuestionMarketingWhere(pathway);
  const topicTrim = lessonTopic.trim();
  const slug = lessonTopicSlug.trim().toLowerCase();
  const fromSlugPhrase = slug.replace(/-/g, " ").trim();
  const tokens = deriveTopicMatchTokens(lessonTitle, lessonTopicSlug);

  const bridgeFirst = getRnNclexLessonQuestionBankBridgeClauses(pathway.id, lessonSlug ?? "");
  const skipTitleSlugTokenFallback = hasExplicitRnNclexLessonBridge(pathway.id, lessonSlug ?? "");

  const orClauses: Prisma.ExamQuestionWhereInput[] = [...bridgeFirst];
  if (topicTrim.length > 0) {
    orClauses.push({ topic: { equals: topicTrim, mode: "insensitive" } });
  }
  if (fromSlugPhrase.length > 0 && fromSlugPhrase !== topicTrim.toLowerCase()) {
    orClauses.push({ topic: { equals: fromSlugPhrase, mode: "insensitive" } });
  }
  if (!skipTitleSlugTokenFallback) {
    for (const tok of tokens) {
      orClauses.push({ topic: { contains: tok, mode: "insensitive" } });
    }
  }
  if (bodySystem?.trim()) {
    orClauses.push({ bodySystem: { equals: bodySystem.trim(), mode: "insensitive" } });
  }
  if (slug.length > 0) {
    orClauses.push({ tags: { has: slug } });
  }

  const orMerged = dedupeOrClauses(orClauses).slice(0, MAX_RELATED_QUESTION_OR_CLAUSES);

  if (orMerged.length === 0) return [];

  return withDatabaseFallback(
    async () => {
      const rows = await prisma.examQuestion.findMany({
        where: {
          AND: [base, { OR: orMerged }],
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
