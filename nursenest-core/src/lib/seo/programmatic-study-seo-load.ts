import "server-only";

import { ContentStatus, FlashcardDeckVisibility, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { pathwayExamQuestionMarketingWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { getPathwayLessonForMarketingHubVerify } from "@/lib/lessons/pathway-lesson-loader";
import { pathwayLessonEligibleForPublicMarketingSurface } from "@/lib/lessons/pathway-lesson-route-access";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { clusterPageMeetsIndexabilityThreshold } from "@/lib/seo/programmatic-seo-engine/cluster-gates";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Minimum pathway-scoped bank rows aligned with the lesson lane before we publish a study SEO surface. */
export const MIN_PROGRAMMATIC_STUDY_SEO_QUESTION_COUNT = 10;

export type ProgrammaticStudySeoPreviewQuestion = {
  id: string;
  stem: string;
  options: Prisma.JsonValue;
};

export type ProgrammaticStudySeoFlashcardPreview = {
  deckSlug: string;
  deckTitle: string;
  cards: { front: string; back: string }[];
};

export type ProgrammaticStudySeoPagePayload = {
  lesson: PathwayLessonRecord;
  questionCount: number;
  previewQuestions: ProgrammaticStudySeoPreviewQuestion[];
  /** Public preview deck slice (may be empty when none published). */
  flashcardPreview: ProgrammaticStudySeoFlashcardPreview | null;
  /** Plain intro derived from lesson content (for indexability gates + meta). */
  introPlainText: string;
};

function plainFromHtmlish(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function questionScopeForLesson(lesson: PathwayLessonRecord): Prisma.ExamQuestionWhereInput {
  const parts: Prisma.ExamQuestionWhereInput[] = [];
  const body = lesson.bodySystem?.trim();
  const topic = lesson.topic?.trim();
  if (body) {
    parts.push({ bodySystem: { equals: body, mode: Prisma.QueryMode.insensitive } });
  }
  if (topic && topic.length >= 3) {
    parts.push({ topic: { contains: topic.slice(0, 120), mode: Prisma.QueryMode.insensitive } });
  }
  if (parts.length === 0) {
    return { id: { in: [] } };
  }
  return { OR: parts };
}

function introFromLesson(lesson: PathwayLessonRecord): string {
  const first = lesson.sections[0];
  const raw = first?.body ? plainFromHtmlish(first.body) : "";
  const title = lesson.title?.trim() ?? "";
  const topic = lesson.topic?.trim() ?? "";
  const lead = [
    `Study hub for ${title} on ${topic || "this exam track"}.`,
    raw.slice(0, 520),
    "Use the lesson for structured teaching, then rehearse with pathway-scoped questions and adaptive practice on NurseNest.",
  ]
    .filter(Boolean)
    .join(" ");
  return lead.replace(/\s+/g, " ").trim();
}

function renderableCount(lesson: PathwayLessonRecord, previewQuestions: number, flashCards: number): number {
  const headings = lesson.sections.filter((s) => (s.heading ?? "").trim().length > 0).length;
  return headings + previewQuestions + Math.min(2, flashCards);
}

/**
 * Loads hybrid study SEO payload for `/{country}/{role}/{exam}/study/{lessonSlug}`.
 * Returns null when the lesson is missing, not marketing-complete, bank density is too low, or intro is too thin.
 */
export async function loadProgrammaticStudySeoPagePayload(
  pathway: ExamPathwayDefinition,
  lessonSlug: string,
): Promise<ProgrammaticStudySeoPagePayload | null> {
  if (!isDatabaseUrlConfigured()) return null;
  const slug = lessonSlug.trim();
  if (!slug) return null;

  const hubLocale = await getMarketingLocaleForDefaultRoute();
  const lesson = await getPathwayLessonForMarketingHubVerify(pathway.id, slug, hubLocale);
  if (!lesson || !pathwayLessonEligibleForPublicMarketingSurface(lesson)) return null;

  const scopedQuestions: Prisma.ExamQuestionWhereInput = {
    AND: [pathwayExamQuestionMarketingWhere(pathway), questionScopeForLesson(lesson)],
  };

  let questionCount = 0;
  let previewQuestions: ProgrammaticStudySeoPreviewQuestion[] = [];
  let flashcardPreview: ProgrammaticStudySeoFlashcardPreview | null = null;

  try {
    const [count, qs, deck] = await Promise.all([
      prisma.examQuestion.count({ where: scopedQuestions }),
      prisma.examQuestion.findMany({
        where: scopedQuestions,
        orderBy: [{ difficulty: "asc" }, { id: "asc" }],
        take: 5,
        select: { id: true, stem: true, options: true },
      }),
      prisma.flashcardDeck.findFirst({
        where: {
          pathwayId: pathway.id,
          status: ContentStatus.PUBLISHED,
          visibility: FlashcardDeckVisibility.PUBLIC_PREVIEW,
        },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, slug: true, title: true },
      }),
    ]);
    questionCount = count;
    previewQuestions = qs.map((q) => ({
      id: q.id,
      stem: q.stem,
      options: q.options,
    }));

    if (deck) {
      const cards = await prisma.flashcard.findMany({
        where: { deckId: deck.id, status: ContentStatus.PUBLISHED },
        orderBy: [{ positionInDeck: "asc" }, { id: "asc" }],
        take: 2,
        select: { front: true, back: true },
      });
      if (cards.length > 0) {
        flashcardPreview = {
          deckSlug: deck.slug,
          deckTitle: deck.title,
          cards: cards.map((c) => ({ front: c.front, back: c.back })),
        };
      }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("programmatic_study_seo", "load_payload_db_error", {
      pathwayId: pathway.id,
      lessonSlug: slug,
      error_message: msg.slice(0, 300),
    });
    return null;
  }

  if (questionCount < MIN_PROGRAMMATIC_STUDY_SEO_QUESTION_COUNT) return null;

  const introPlainText = introFromLesson(lesson);
  const fcCount = flashcardPreview?.cards.length ?? 0;
  if (
    !clusterPageMeetsIndexabilityThreshold({
      renderableItemCount: renderableCount(lesson, previewQuestions.length, fcCount),
      introPlainTextChars: introPlainText.length,
    })
  ) {
    return null;
  }

  return {
    lesson,
    questionCount,
    previewQuestions,
    flashcardPreview,
    introPlainText,
  };
}

/** Sitemap: same gates as the live page — avoids emitting URLs that 404 or are too thin. */
export async function isProgrammaticStudySeoUrlEligibleForSitemap(
  pathway: ExamPathwayDefinition,
  lessonSlug: string,
): Promise<boolean> {
  const payload = await loadProgrammaticStudySeoPagePayload(pathway, lessonSlug);
  return Boolean(payload);
}
