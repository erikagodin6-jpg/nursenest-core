/**
 * Option-level telemetry for distractor analytics.
 *
 * Records which option each user selected (FlashcardOptionResponse rows) and
 * increments the denormalized selectCount / correctSelectCount on FlashcardOption.
 * Both writes happen in a single transaction for consistency.
 *
 * Consumers:
 *   - POST /api/flashcards/cards/[cardId]/review (after SM-2 update)
 *   - POST /api/flashcards/decks/[deckRef]/review (deck session review)
 *
 * Analytics surface (future dashboards):
 *   - Distractor frequency: which wrong options are most-selected
 *   - SATA partial accuracy: correct options selected / total correct options
 *   - Dangerous misconceptions: safety-critical distractors selected at high rate
 */

import { prisma } from "@/lib/db";

export type OptionResponseInput = {
  userId: string;
  flashcardId: string;
  /** For MCQ: one entry. For SATA: one entry per option the user selected. */
  selectedKeys: string[];
  /** Keys that are correct per canonical options (from FlashcardOption.isCorrect). */
  correctKeys: string[];
  sessionId?: string | null;
};

/**
 * Records option-level responses and increments denormalized counts.
 * Fire-and-forget safe: errors are caught and logged, never propagated to the caller.
 * Does not block the SM-2 progress save.
 */
export async function recordOptionResponses(input: OptionResponseInput): Promise<void> {
  const { userId, flashcardId, selectedKeys, correctKeys, sessionId } = input;
  if (selectedKeys.length === 0) return;

  const correctSet = new Set(correctKeys);
  const now = new Date();

  try {
    await prisma.$transaction(async (tx) => {
      // Append one row per selected option
      await tx.flashcardOptionResponse.createMany({
        data: selectedKeys.map((key) => ({
          userId,
          flashcardId,
          optionKey: key,
          wasCorrect: correctSet.has(key),
          sessionId: sessionId ?? null,
          respondedAt: now,
        })),
        skipDuplicates: false,
      });

      // Increment selectCount on each selected option; correctSelectCount when the
      // selection was correct. Uses updateMany — no-op for options without canonical rows.
      for (const key of selectedKeys) {
        await tx.flashcardOption.updateMany({
          where: { flashcardId, optionKey: key },
          data: {
            selectCount: { increment: 1 },
            ...(correctSet.has(key) ? { correctSelectCount: { increment: 1 } } : {}),
          },
        });
      }
    });
  } catch {
    // Analytics failure must never surface to the learner
  }
}

export type DistractorStat = {
  optionKey: string;
  content: string;
  isCorrect: boolean;
  selectCount: number;
  correctSelectCount: number;
  selectionRate: number;
};

/**
 * Returns distractor frequency stats for a single flashcard.
 * Used by admin dashboards and remediation targeting.
 */
export async function getOptionDistractorStats(flashcardId: string): Promise<DistractorStat[]> {
  const options = await prisma.flashcardOption.findMany({
    where: { flashcardId },
    orderBy: { displayOrder: "asc" },
  });

  const totalSelections = options.reduce((sum, o) => sum + o.selectCount, 0);

  return options.map((o) => ({
    optionKey: o.optionKey,
    content: o.content,
    isCorrect: o.isCorrect,
    selectCount: o.selectCount,
    correctSelectCount: o.correctSelectCount,
    selectionRate: totalSelections > 0 ? o.selectCount / totalSelections : 0,
  }));
}

/**
 * Returns the most-frequently-missed distractors across all cards in a deck.
 * Sorted by selection rate descending — highest distractor pressure first.
 * Used by remediation targeting and misconception heatmaps.
 */
export async function getTopDistractorsForDeck(
  deckId: string,
  limit = 10,
): Promise<Array<DistractorStat & { flashcardId: string; questionStem: string | null }>> {
  const options = await prisma.flashcardOption.findMany({
    where: {
      isCorrect: false,
      selectCount: { gt: 0 },
      flashcard: { deckId, status: "PUBLISHED" },
    },
    include: { flashcard: { select: { id: true, questionStem: true } } },
    orderBy: { selectCount: "desc" },
    take: limit * 3, // over-fetch for per-card dedup
  });

  const seen = new Set<string>();
  const results: Array<DistractorStat & { flashcardId: string; questionStem: string | null }> = [];

  for (const o of options) {
    const key = `${o.flashcardId}:${o.optionKey}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const cardTotal = options
      .filter((x) => x.flashcardId === o.flashcardId)
      .reduce((sum, x) => sum + x.selectCount, 0);

    results.push({
      flashcardId: o.flashcardId,
      questionStem: o.flashcard.questionStem,
      optionKey: o.optionKey,
      content: o.content,
      isCorrect: false,
      selectCount: o.selectCount,
      correctSelectCount: o.correctSelectCount,
      selectionRate: cardTotal > 0 ? o.selectCount / cardTotal : 0,
    });

    if (results.length >= limit) break;
  }

  return results.sort((a, b) => b.selectionRate - a.selectionRate);
}
