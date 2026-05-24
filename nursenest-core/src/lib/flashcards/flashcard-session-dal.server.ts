import "server-only";
import {
  ContentStatus,
  FlashcardDeckVisibility,
  FlashcardItemKind,
  FlashcardSessionStatus,
  type FlashcardAttempt,
  type FlashcardMastery,
  type FlashcardSession,
} from "@prisma/client";
import { prisma } from "@/lib/db";

// ── Types ──────────────────────────────────────────────────────────────────

export type DeckListRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  country: string;
  tier: string;
  cardCount: number;
  pathwayId: string | null;
  examFamily: string;
};

export type McqOption = {
  key: string;
  content: string;
  isCorrect: boolean;
  rationale: string | null;
};

export type McqCard = {
  id: string;
  questionStem: string;
  options: McqOption[];
  correctAnswer: string;
  rationaleCorrect: string | null;
  positionInDeck: number;
};

export type DeckWithCards = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  country: string;
  tier: string;
  cardCount: number;
  pathwayId: string | null;
  cards: McqCard[];
};

export type SessionWithProgress = FlashcardSession & {
  answeredCount: number;
  correctCount: number;
};

// ── Deck queries ───────────────────────────────────────────────────────────

export async function getPublishedFlashcardDecks(
  options: { pathwayId?: string | null; limit?: number } = {},
): Promise<DeckListRow[]> {
  const { pathwayId, limit = 50 } = options;
  const rows = await prisma.flashcardDeck.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      visibility: { not: FlashcardDeckVisibility.HIDDEN },
      ...(pathwayId ? { pathwayId } : {}),
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      country: true,
      tier: true,
      cardCount: true,
      pathwayId: true,
      examFamily: true,
    },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    take: limit,
  });
  return rows;
}

export async function getDeckWithMcqCards(deckId: string): Promise<DeckWithCards | null> {
  const deck = await prisma.flashcardDeck.findUnique({
    where: { id: deckId },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      country: true,
      tier: true,
      cardCount: true,
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
  });

  if (!deck) return null;
  if (
    deck.status !== ContentStatus.PUBLISHED ||
    deck.visibility === FlashcardDeckVisibility.HIDDEN
  ) {
    return null;
  }

  const cards: McqCard[] = deck.cards
    .filter((c) => c.questionStem && c.correctAnswer && c.options.length > 0)
    .map((c) => ({
      id: c.id,
      questionStem: c.questionStem!,
      correctAnswer: c.correctAnswer!,
      rationaleCorrect: c.rationaleCorrect,
      positionInDeck: c.positionInDeck,
      options: c.options.map((o) => ({
        key: o.optionKey,
        content: o.content,
        isCorrect: o.isCorrect,
        rationale: o.rationale,
      })),
    }));

  return {
    id: deck.id,
    slug: deck.slug,
    title: deck.title,
    description: deck.description,
    country: deck.country,
    tier: deck.tier,
    cardCount: deck.cardCount,
    pathwayId: deck.pathwayId,
    cards,
  };
}

// ── Session management ─────────────────────────────────────────────────────

/** Returns existing ACTIVE session or creates a new one. Never surfaces COMPLETED sessions as resumable. */
export async function createOrResumeFlashcardSession(
  userId: string,
  deckId: string,
  cardCount: number,
): Promise<FlashcardSession> {
  const existing = await prisma.flashcardSession.findFirst({
    where: { userId, deckId, status: FlashcardSessionStatus.ACTIVE },
    orderBy: { startedAt: "desc" },
  });
  if (existing) return existing;

  return prisma.flashcardSession.create({
    data: { userId, deckId, cardCount, status: FlashcardSessionStatus.ACTIVE },
  });
}

export async function getActiveSession(
  userId: string,
  deckId: string,
): Promise<SessionWithProgress | null> {
  const session = await prisma.flashcardSession.findFirst({
    where: { userId, deckId, status: FlashcardSessionStatus.ACTIVE },
    orderBy: { startedAt: "desc" },
  });
  if (!session) return null;

  const [answeredCount, correctCount] = await Promise.all([
    prisma.flashcardAttempt.count({ where: { sessionId: session.id } }),
    prisma.flashcardAttempt.count({ where: { sessionId: session.id, isCorrect: true } }),
  ]);

  return { ...session, answeredCount, correctCount };
}

// ── Attempt recording ──────────────────────────────────────────────────────

export type RecordAttemptInput = {
  sessionId: string;
  userId: string;
  flashcardId: string;
  selectedKey: string | null;
  isCorrect: boolean;
  guessed: boolean;
  confidence: number | null;
  bookmarked: boolean;
};

export async function recordFlashcardAttempt(
  input: RecordAttemptInput,
): Promise<{ attempt: FlashcardAttempt; mastery: FlashcardMastery }> {
  const { sessionId, userId, flashcardId, selectedKey, isCorrect, guessed, confidence, bookmarked } =
    input;

  const [attempt, mastery] = await prisma.$transaction([
    prisma.flashcardAttempt.create({
      data: { sessionId, userId, flashcardId, selectedKey, isCorrect, guessed, confidence, bookmarked },
    }),
    prisma.flashcardMastery.upsert({
      where: { userId_flashcardId: { userId, flashcardId } },
      create: {
        userId,
        flashcardId,
        level: isCorrect ? 1 : 0,
        totalAttempts: 1,
        correctCount: isCorrect ? 1 : 0,
        lastAttemptAt: new Date(),
      },
      update: {
        totalAttempts: { increment: 1 },
        correctCount: isCorrect ? { increment: 1 } : undefined,
        lastAttemptAt: new Date(),
        level: computeMasteryLevel(isCorrect),
      },
    }),
  ]);

  return { attempt, mastery };
}

/** Simple mastery level bump: correct → increment toward 3, incorrect → clamp at 1 then decrement. */
function computeMasteryLevel(isCorrect: boolean) {
  if (isCorrect) {
    return { increment: 1 };
  }
  return { decrement: 1 };
}

export async function completeFlashcardSession(sessionId: string, userId: string): Promise<void> {
  await prisma.flashcardSession.updateMany({
    where: { id: sessionId, userId, status: FlashcardSessionStatus.ACTIVE },
    data: { status: FlashcardSessionStatus.COMPLETED, completedAt: new Date() },
  });
}
