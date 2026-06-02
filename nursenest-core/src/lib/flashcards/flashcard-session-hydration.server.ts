import "server-only";
import {
  ContentStatus,
  FlashcardDeckVisibility,
  FlashcardItemKind,
  FlashcardSessionStatus,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import type {
  HydratedSession,
  RuntimeCard,
  SessionCardPayload,
  SessionRuntime,
} from "./session-runtime-types";
import { getFlashcardClinicalMedia } from "./flashcard-clinical-media-registry";

export async function hydrateFlashcardSession(
  sessionId: string,
  userId: string,
): Promise<HydratedSession | null> {
  const session = await prisma.flashcardSession.findFirst({
    where: {
      id: sessionId,
      userId,
      status: { not: FlashcardSessionStatus.ABANDONED },
    },
    select: {
      id: true,
      status: true,
      deck: {
        select: {
          id: true,
          title: true,
          pathwayId: true,
          status: true,
          visibility: true,
          cards: {
            where: {
              status: ContentStatus.PUBLISHED,
              examItemKind: {
                in: [
                  FlashcardItemKind.RECALL,
                  FlashcardItemKind.CLINICAL,
                  FlashcardItemKind.PRIORITY,
                  FlashcardItemKind.CONCEPT,
                ],
              },
            },
            select: {
              id: true,
              questionStem: true,
              correctAnswer: true,
              rationaleCorrect: true,
              positionInDeck: true,
              examItemKind: true,
              options: {
                select: {
                  optionKey: true,
                  content: true,
                  isCorrect: true,
                  rationale: true,
                  displayOrder: true,
                },
                orderBy: { displayOrder: "asc" },
              },
            },
            orderBy: { positionInDeck: "asc" },
          },
        },
      },
    },
  });

  if (!session) return null;
  if (
    session.deck.status !== ContentStatus.PUBLISHED ||
    session.deck.visibility === FlashcardDeckVisibility.HIDDEN
  ) {
    return null;
  }

  const priorAttempts = await prisma.flashcardAttempt.findMany({
    where: { sessionId },
    select: {
      flashcardId: true,
      selectedKey: true,
      isCorrect: true,
      guessed: true,
      confidence: true,
      bookmarked: true,
    },
    orderBy: { answeredAt: "asc" },
  });

  const attemptByCardId = new Map(priorAttempts.map((a) => [a.flashcardId, a]));

  const validCards = session.deck.cards.filter(
    (c) =>
      c.questionStem &&
      c.correctAnswer &&
      c.rationaleCorrect &&
      c.options.length >= 3 &&
      c.options.some((o) => o.isCorrect),
  );

  const cardPayloads: SessionCardPayload[] = validCards.map((c) => {
    const incorrectRationales = c.options
      .filter((o) => !o.isCorrect && o.rationale)
      .map((o) => ({ letter: o.optionKey, rationale: o.rationale! }));

    const clinicalMedia = getFlashcardClinicalMedia(c.id);
    return {
      cardId: c.id,
      positionInDeck: c.positionInDeck,
      questionStem: c.questionStem!,
      answerOptions: c.options.map((o) => ({ letter: o.optionKey, text: o.content })),
      correctLetter: c.correctAnswer!,
      rationaleCorrect: c.rationaleCorrect!,
      rationaleIncorrect: incorrectRationales,
      itemKind: c.examItemKind ?? "RECALL",
      ...(clinicalMedia ? { clinicalMedia } : {}),
    };
  });

  if (cardPayloads.length === 0) return null;

  let correct = 0;
  let incorrect = 0;
  let guessed = 0;
  let bookmarked = 0;

  const runtimeCards: RuntimeCard[] = cardPayloads.map((payload) => {
    const attempt = attemptByCardId.get(payload.cardId);
    if (!attempt) {
      return { cardId: payload.cardId, state: "UNANSWERED", revealed: false };
    }
    if (attempt.isCorrect) correct++;
    else incorrect++;
    if (attempt.guessed) guessed++;
    if (attempt.bookmarked) bookmarked++;
    return {
      cardId: payload.cardId,
      state: "LOCKED",
      selectedAnswerId: attempt.selectedKey ?? undefined,
      revealed: true,
      attempt: {
        correct: attempt.isCorrect ?? false,
        guessed: attempt.guessed,
        confidence: attempt.confidence ?? undefined,
        bookmarked: attempt.bookmarked,
      },
    };
  });

  const firstUnanswered = runtimeCards.findIndex((c) => c.state === "UNANSWERED");
  const isCompleted =
    firstUnanswered === -1 || session.status === FlashcardSessionStatus.COMPLETED;

  const runtime: SessionRuntime = {
    sessionId: session.id,
    currentIndex: isCompleted ? cardPayloads.length - 1 : firstUnanswered,
    totalCards: cardPayloads.length,
    cards: runtimeCards,
    metrics: { correct, incorrect, guessed, bookmarked },
    completed: isCompleted,
  };

  return {
    runtime,
    cards: cardPayloads,
    deck: {
      id: session.deck.id,
      title: session.deck.title,
      pathwayId: session.deck.pathwayId,
    },
  };
}
