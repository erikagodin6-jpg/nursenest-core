import "server-only";

import { ContentStatus, FlashcardDeckVisibility, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { pathwayExamQuestionMarketingWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { clusterPageMeetsIndexabilityThreshold } from "@/lib/seo/programmatic-seo-engine/cluster-gates";
import { normalizeBodySystemUrlKey } from "@/lib/seo/content-backed-study-resource-hub-slug";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import {
  evaluatePublicMarketingLessonCrossLinkIntegrity,
  mapWithConcurrency,
} from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import { PATHWAY_LESSON_CANONICAL_DB_LOCALE } from "@/lib/lessons/pathway-lesson-locale";

/** Minimum structural-complete lessons sharing a body system before a hub is eligible. */
export const MIN_LESSONS_PER_BODY_SYSTEM = 3;
/** Minimum published exam questions (pathway-scoped pool) matching the same body system label. */
export const MIN_QUESTIONS_PER_BODY_SYSTEM = 12;
/** Hard cap on lesson deep links rendered (payload + indexability). */
export const MAX_LESSON_LINKS = 10;
/** Hard cap on flashcard deck links (pathway-aligned public preview only). */
export const MAX_FLASHCARD_DECK_LINKS = 5;
/** Global cap for sitemap emission across all pathways (avoids URL explosion). */
export const MAX_CONTENT_BACKED_STUDY_RESOURCE_SITEMAP_URLS = 400;

const INTRO_TEMPLATE = (pathwayName: string, bodyLabel: string) =>
  [
    `${bodyLabel} shows up repeatedly on ${pathwayName}: assessment cues, medication monitoring, patient education, and escalation when status changes.`,
    `This hub only exists when NurseNest has enough pathway lessons and a pathway-scoped bank sample in the same clinical lane—so you are not landing on an empty template.`,
    `Use the lesson links for structured teaching, then jump into the question bank with the topic filter applied. Flashcard decks listed here are pathway-aligned previews when we publish them for marketing.`,
  ].join(" ");

export type ContentBackedStudyResourceLessonLink = { slug: string; title: string; topic: string };
export type ContentBackedStudyResourceDeckLink = { slug: string; title: string };

export type ContentBackedStudyResourceHubPayload = {
  bodyKey: string;
  bodySystemLabel: string;
  pathway: ExamPathwayDefinition;
  lessons: ContentBackedStudyResourceLessonLink[];
  questionCount: number;
  flashcardDecks: ContentBackedStudyResourceDeckLink[];
  introPlainText: string;
};

async function resolveCanonicalBodySystemForKey(
  pathwayId: string,
  bodyKey: string,
): Promise<string | null> {
  const rows = await prisma.pathwayLesson.findMany({
    where: {
      pathwayId,
      status: ContentStatus.PUBLISHED,
      structuralPublicComplete: true,
      locale: PATHWAY_LESSON_CANONICAL_DB_LOCALE,
      bodySystem: { not: "" },
    },
    select: { bodySystem: true },
    distinct: ["bodySystem"],
  });
  for (const r of rows) {
    if (normalizeBodySystemUrlKey(r.bodySystem) === bodyKey) return r.bodySystem.trim();
  }
  return null;
}

function meetsQualityThreshold(args: {
  lessonCount: number;
  questionCount: number;
  introPlainText: string;
  renderableLinks: number;
}): boolean {
  if (args.lessonCount < MIN_LESSONS_PER_BODY_SYSTEM) return false;
  if (args.questionCount < MIN_QUESTIONS_PER_BODY_SYSTEM) return false;
  return clusterPageMeetsIndexabilityThreshold({
    renderableItemCount: args.renderableLinks,
    introPlainTextChars: args.introPlainText.replace(/\s+/g, " ").trim().length,
  });
}

/**
 * Loads a single body-system study resource hub when content thresholds are met (otherwise returns null → 404).
 * Tier/exam separation is enforced by `pathway` identity + {@link pathwayExamQuestionMarketingWhere}.
 */
export async function loadContentBackedStudyResourceHubPayload(
  pathway: ExamPathwayDefinition,
  bodyKey: string,
): Promise<ContentBackedStudyResourceHubPayload | null> {
  if (!isDatabaseUrlConfigured()) return null;
  const lessonContentLocale = await getMarketingLocaleForDefaultRoute();
  const bk = bodyKey.trim().toLowerCase();
  if (bk.length < 2) return null;

  const bodySystemLabel = await resolveCanonicalBodySystemForKey(pathway.id, bk);
  if (!bodySystemLabel) return null;

  const lessonWhere = {
    pathwayId: pathway.id,
    status: ContentStatus.PUBLISHED,
    structuralPublicComplete: true,
    locale: PATHWAY_LESSON_CANONICAL_DB_LOCALE,
    bodySystem: { equals: bodySystemLabel, mode: Prisma.QueryMode.insensitive },
  };

  const [lessonTotal, lessons, questionCount, flashcardDecks] = await Promise.all([
    prisma.pathwayLesson.count({ where: lessonWhere }),
    prisma.pathwayLesson.findMany({
      where: lessonWhere,
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      take: MAX_LESSON_LINKS,
      select: { slug: true, title: true, topic: true },
    }),
    prisma.examQuestion.count({
      where: {
        AND: [
          pathwayExamQuestionMarketingWhere(pathway),
          { bodySystem: { equals: bodySystemLabel, mode: Prisma.QueryMode.insensitive } },
        ],
      },
    }),
    prisma.flashcardDeck.findMany({
      where: {
        pathwayId: pathway.id,
        status: ContentStatus.PUBLISHED,
        visibility: FlashcardDeckVisibility.PUBLIC_PREVIEW,
      },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      take: MAX_FLASHCARD_DECK_LINKS,
      select: { slug: true, title: true },
    }),
  ]);

  const introPlainText = INTRO_TEMPLATE(pathway.displayName, bodySystemLabel);
  const renderableLinks = lessonTotal + flashcardDecks.length + 3;
  const indexable = meetsQualityThreshold({
    lessonCount: lessonTotal,
    questionCount,
    introPlainText,
    renderableLinks,
  });

  if (!indexable) return null;

  const verifiedLessons = await mapWithConcurrency(lessons, 6, async (l) => {
    const ev = await evaluatePublicMarketingLessonCrossLinkIntegrity(pathway, l.slug, lessonContentLocale);
    return { l, ev };
  });
  const lessonsOut = verifiedLessons
    .filter((x) => x.ev.ok)
    .map((x) => ({ slug: x.l.slug, title: x.l.title, topic: x.l.topic }));

  return {
    bodyKey: bk,
    bodySystemLabel,
    pathway,
    lessons: lessonsOut,
    questionCount,
    flashcardDecks: flashcardDecks.map((d) => ({ slug: d.slug, title: d.title })),
    introPlainText,
  };
}

export type ContentBackedStudyResourceSitemapRow = {
  pathway: ExamPathwayDefinition;
  bodyKey: string;
};

/**
 * Candidates for sitemap: one row per distinct body system on the pathway that passes **lesson + question** gates.
 * Caller caps total URLs (see {@link MAX_CONTENT_BACKED_STUDY_RESOURCE_SITEMAP_URLS}).
 */
export async function listContentBackedStudyResourceHubSitemapRows(
  pathway: ExamPathwayDefinition,
): Promise<ContentBackedStudyResourceSitemapRow[]> {
  if (!isDatabaseUrlConfigured()) return [];
  const groups = await prisma.pathwayLesson.groupBy({
    by: ["bodySystem"],
    where: {
      pathwayId: pathway.id,
      status: ContentStatus.PUBLISHED,
      structuralPublicComplete: true,
      locale: PATHWAY_LESSON_CANONICAL_DB_LOCALE,
      bodySystem: { not: "" },
    },
    _count: { _all: true },
  });

  const out: ContentBackedStudyResourceSitemapRow[] = [];
  const baseQ = pathwayExamQuestionMarketingWhere(pathway);

  for (const g of groups) {
    const label = g.bodySystem.trim();
    if (label.length < 2) continue;
    if (g._count._all < MIN_LESSONS_PER_BODY_SYSTEM) continue;
    const qn = await prisma.examQuestion.count({
      where: {
        AND: [baseQ, { bodySystem: { equals: label, mode: Prisma.QueryMode.insensitive } }],
      },
    });
    if (qn < MIN_QUESTIONS_PER_BODY_SYSTEM) continue;
    const introPlainText = INTRO_TEMPLATE(pathway.displayName, label);
    if (
      !clusterPageMeetsIndexabilityThreshold({
        renderableItemCount: g._count._all + 3,
        introPlainTextChars: introPlainText.replace(/\s+/g, " ").trim().length,
      })
    ) {
      continue;
    }
    const bodyKey = normalizeBodySystemUrlKey(label);
    if (!bodyKey) continue;
    out.push({ pathway, bodyKey });
  }
  return out;
}
