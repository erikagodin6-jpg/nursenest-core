import { buildFlashcardExplanationFromSources } from "@/lib/content-quality/controlled-rationale-enrichment";
import { truncateForPreview } from "@/lib/flashcards/flashcard-access";
import {
  correctAnswerLine,
  parseExamMicroQuestionFromDbFields,
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
  sourceKey: string | null;
  examItemKind: FlashcardItemKind | null;
  questionStem: string | null;
  answerOptions: Prisma.JsonValue | null;
  correctAnswer: string | null;
  rationaleCorrect: string | null;
  rationaleIncorrect: Prisma.JsonValue | null;
  category: { name: string; topicCode: string | null };
  deck: { pathwayId: string | null } | null;
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
};

export function serializeFlashcardForDeckStudy(
  card: FlashcardStudySelectRow,
  opts: {
    educationalLocale: string;
    flashcardBundle: FlashcardEducationalBundle | undefined;
    fullBackAvailable: boolean;
  },
): FlashcardStudyApiCard {
  const exam = parseExamMicroQuestionFromDbFields(card);
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
  };
}

export function serializeFlashcardForCustomSession(
  card: FlashcardStudySelectRow,
  opts: {
    swapFrontBack: boolean;
    topic: string;
    pathwayId: string | null;
  },
): Omit<FlashcardStudyApiCard, "fullBackAvailable"> & { rawTopic: string } {
  const exam = parseExamMicroQuestionFromDbFields(card);
  let front = opts.swapFrontBack ? card.back : card.front;
  let back = opts.swapFrontBack ? card.front : card.back;
  if (exam) {
    front = exam.questionStem;
    back = correctAnswerLine(exam);
  }
  const explanation = exam
    ? undefined
    : buildFlashcardExplanationFromSources({
        front,
        back,
        topic: opts.topic,
        subtopic: card.category.topicCode,
      });
  return {
    id: card.id,
    front,
    back,
    topic: opts.topic,
    subtopic: card.category.topicCode,
    rawTopic: card.category.name,
    sourceKey: card.sourceKey,
    pathwayId: card.deck?.pathwayId ?? opts.pathwayId,
    ...(exam ? { examMicroQuestion: exam } : {}),
    ...(explanation ? { explanation } : {}),
  };
}
