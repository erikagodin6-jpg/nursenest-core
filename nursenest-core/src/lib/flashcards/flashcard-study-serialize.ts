import { buildFlashcardExplanationFromSources } from "@/lib/content-quality/controlled-rationale-enrichment";
import { truncateForPreview } from "@/lib/flashcards/flashcard-access";
import { flashcardLessonCrossLinkForDeckStudyRow } from "@/lib/flashcards/flashcard-lesson-cross-link";
import { parseLessonLinkSourceKey } from "@/lib/flashcards/lesson-link-source-key";
import {
  correctAnswerLine,
  parseExamMicroQuestionFromDbFields,
  shuffleExamMicroQuestionOrder,
  type ExamMicroQuestionPayload,
} from "@/lib/flashcards/flashcard-exam-style";
import { applyFlashcardCardOverlay } from "@/lib/i18n/educational-content-overlay";
import type { FlashcardEducationalBundle } from "@/lib/i18n/educational-content-overlay";
import type { FlashcardItemKind, Prisma } from "@prisma/client";

/** Narrow DB select row for study serialization. */
export type FlashcardStudySelectRow = {
  id: string;
  front: string;
  back: string;
  lessonId?: string | null;
  sourceKey: string | null;
  examItemKind: FlashcardItemKind | null;
  questionStem: string | null;
  answerOptions: Prisma.JsonValue | null;
  correctAnswer: string | null;
  rationaleCorrect: string | null;
  rationaleIncorrect: Prisma.JsonValue | null;
  category: { name: string; topicCode: string | null };
  deck: { pathwayId: string | null; title?: string | null } | null;
  /** First HTTPS image from exam bank `images` JSON — render only when present (no placeholder). */
  clinicalImageUrl?: string | null;
  clinicalPearl?: string | null;
  keyTakeaway?: string | null;
};

export type FlashcardStudyApiCard = {
  id: string;
  front: string;
  back: string;
  fullBackAvailable: boolean;
  topic: string;
  subtopic: string | null;
  sourceKey: string | null;
  pathwayId: string | null;
  explanation?: string;
  examMicroQuestion?: ExamMicroQuestionPayload;
  /** Present on `lessonlink:v1|…` catalog-derived custom-session cards. */
  lessonLinkSectionKind?: string;
  lessonLinkCardType?: string;
  difficultyRating?: number;
  /** Resolved catalog pathway lesson (slug + title) — no duplicated bodies. */
  lessonStudyHref?: string;
  lessonStudyTitle?: string;
  /** Exam-bank clinical image — omit from JSON when absent so clients render no image chrome. */
  clinicalImageUrl?: string | null;
};

export { parseLessonLinkSourceKey } from "@/lib/flashcards/lesson-link-source-key";

export function serializeFlashcardForDeckStudy(
  card: FlashcardStudySelectRow,
  opts: {
    educationalLocale: string;
    flashcardBundle: FlashcardEducationalBundle | undefined;
    fullBackAvailable: boolean;
    /** When set, shuffles MCQ option order deterministically for this study batch. */
    examOptionShuffleSalt?: string | null;
  },
): FlashcardStudyApiCard {
  let exam = parseExamMicroQuestionFromDbFields(card);
  if (exam && opts.examOptionShuffleSalt?.trim()) {
    exam = shuffleExamMicroQuestionOrder(exam, `${opts.examOptionShuffleSalt.trim()}:${card.id}`);
  }
  const loc = applyFlashcardCardOverlay(
    { id: card.id, front: card.front, back: card.back },
    opts.educationalLocale,
    opts.flashcardBundle,
  );
  const front = exam ? exam.questionStem : loc.front;
  const rawBack = exam ? correctAnswerLine(exam) : loc.back;
  const back = opts.fullBackAvailable ? rawBack : truncateForPreview(rawBack);
  const explanation = exam
    ? undefined
    : loc.explanation ??
      buildFlashcardExplanationFromSources({
        front: loc.front,
        back: loc.back,
        topic: card.category.name,
        subtopic: card.category.topicCode,
      });
  const lessonLink = flashcardLessonCrossLinkForDeckStudyRow(card.deck?.pathwayId ?? null, card);
  return {
    id: card.id,
    front,
    back,
    fullBackAvailable: opts.fullBackAvailable,
    topic: card.category.name,
    subtopic: card.category.topicCode,
    sourceKey: card.sourceKey,
    pathwayId: card.deck?.pathwayId ?? null,
    ...(exam ? { examMicroQuestion: exam } : {}),
    ...(!exam && explanation ? { explanation } : {}),
    ...(lessonLink ? { lessonStudyHref: lessonLink.lessonStudyHref, lessonStudyTitle: lessonLink.lessonStudyTitle } : {}),
  };
}

export function serializeFlashcardForCustomSession(
  card: FlashcardStudySelectRow,
  opts: {
    swapFrontBack: boolean;
    topic: string;
    pathwayId: string | null;
    /** Per-request salt so option positions vary each session while staying reproducible with a fixed salt. */
    examOptionShuffleSalt?: string | null;
  },
): Omit<FlashcardStudyApiCard, "fullBackAvailable"> & { rawTopic: string } {
  let exam = parseExamMicroQuestionFromDbFields(card);
  if (exam && opts.examOptionShuffleSalt?.trim()) {
    exam = shuffleExamMicroQuestionOrder(exam, `${opts.examOptionShuffleSalt.trim()}:${card.id}`);
  }
  let front = opts.swapFrontBack ? card.back : card.front;
  let back = opts.swapFrontBack ? card.front : card.back;
  if (exam) {
    front = exam.questionStem;
    back = correctAnswerLine(exam);
  }
  const authoredRecall =
    !exam && typeof card.rationaleCorrect === "string" && card.rationaleCorrect.trim().length >= 8
      ? card.rationaleCorrect.trim()
      : null;
  const examTeachingExtra = [card.clinicalPearl?.trim(), card.keyTakeaway?.trim()].filter(Boolean).join("\n\n");
  const explanation = exam
    ? examTeachingExtra || undefined
    : authoredRecall ??
      buildFlashcardExplanationFromSources({
        front,
        back,
        topic: opts.topic,
        subtopic: card.category.topicCode,
      });
  const link = parseLessonLinkSourceKey(card.sourceKey);
  const pid = card.deck?.pathwayId ?? opts.pathwayId;
  const lessonLink = flashcardLessonCrossLinkForDeckStudyRow(pid, card);
  const img = card.clinicalImageUrl?.trim();
  return {
    id: card.id,
    front,
    back,
    topic: opts.topic,
    subtopic: card.category.topicCode,
    rawTopic: card.category.name,
    sourceKey: card.sourceKey,
    pathwayId: pid,
    ...(exam ? { examMicroQuestion: exam } : {}),
    ...(explanation ? { explanation } : {}),
    ...(img && img.startsWith("https://") ? { clinicalImageUrl: img } : {}),
    ...(link
      ? {
          lessonLinkSectionKind: link.sectionKind,
          lessonLinkCardType: link.cardType,
          difficultyRating: link.difficulty,
        }
      : {}),
    ...(lessonLink ? { lessonStudyHref: lessonLink.lessonStudyHref, lessonStudyTitle: lessonLink.lessonStudyTitle } : {}),
  };
}
