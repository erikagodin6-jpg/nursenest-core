/**
 * Server-side option hydration: reads canonical `FlashcardOption` rows if present,
 * falls back to JSON fields (answerOptions / rationaleIncorrect) for legacy cards.
 *
 * This module is the single read path for study serialization. All callers that
 * need resolved answer options should go through `hydrateFlashcardOptions` rather
 * than parsing JSON directly.
 */
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  fromDbRows,
  normalizeLegacyAnswerPayload,
  type CanonicalOption,
  type FlashcardOptionRow,
} from "@/lib/flashcards/flashcard-option-normalize";

// Re-export the row type so callers can import from one place
export type { CanonicalOption, FlashcardOptionRow };

export type HydrationSource = "canonical" | "json_fallback" | "none";

export type HydratedOptions = {
  options: CanonicalOption[];
  source: HydrationSource;
};

/**
 * Hydrate options for a single flashcard.
 *
 * Prefers canonical DB rows; falls back to JSON fields for legacy cards.
 * Returns `{ options: [], source: "none" }` when neither source has valid data.
 *
 * @param flashcardId - Prisma flashcard id
 * @param jsonFallback - JSON field values from an existing DB select (avoids extra query)
 */
export async function hydrateFlashcardOptions(
  flashcardId: string,
  jsonFallback?: {
    answerOptions: Prisma.JsonValue | null | undefined;
    correctAnswer: string | null | undefined;
    rationaleIncorrect: Prisma.JsonValue | null | undefined;
  },
): Promise<HydratedOptions> {
  const rows = await prisma.flashcardOption.findMany({
    where: { flashcardId },
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      optionKey: true,
      content: true,
      isCorrect: true,
      rationale: true,
      displayOrder: true,
      selectCount: true,
      correctSelectCount: true,
    },
  });

  if (rows.length >= 3) {
    return { options: fromDbRows(rows as FlashcardOptionRow[]), source: "canonical" };
  }

  if (jsonFallback) {
    const normalized = normalizeLegacyAnswerPayload(jsonFallback);
    if (normalized && normalized.length >= 3) {
      return { options: normalized, source: "json_fallback" };
    }
  }

  return { options: [], source: "none" };
}

/**
 * Batch hydrate options for multiple flashcards in a single DB query.
 * Returns a Map<flashcardId, HydratedOptions>.
 *
 * @param cards - each card must supply flashcardId + JSON fallback fields
 */
export async function batchHydrateFlashcardOptions(
  cards: Array<{
    id: string;
    answerOptions: Prisma.JsonValue | null | undefined;
    correctAnswer: string | null | undefined;
    rationaleIncorrect: Prisma.JsonValue | null | undefined;
  }>,
): Promise<Map<string, HydratedOptions>> {
  const ids = cards.map((c) => c.id);
  const allRows = await prisma.flashcardOption.findMany({
    where: { flashcardId: { in: ids } },
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      flashcardId: true,
      optionKey: true,
      content: true,
      isCorrect: true,
      rationale: true,
      displayOrder: true,
      selectCount: true,
      correctSelectCount: true,
    },
  });

  // Group rows by flashcardId
  const rowsByCard = new Map<string, FlashcardOptionRow[]>();
  for (const row of allRows) {
    const existing = rowsByCard.get(row.flashcardId) ?? [];
    existing.push({
      id: row.id,
      optionKey: row.optionKey,
      content: row.content,
      isCorrect: row.isCorrect,
      rationale: row.rationale,
      displayOrder: row.displayOrder,
      selectCount: row.selectCount,
      correctSelectCount: row.correctSelectCount,
    });
    rowsByCard.set(row.flashcardId, existing);
  }

  const result = new Map<string, HydratedOptions>();

  for (const card of cards) {
    const canonical = rowsByCard.get(card.id);
    if (canonical && canonical.length >= 3) {
      result.set(card.id, { options: fromDbRows(canonical), source: "canonical" });
      continue;
    }
    const normalized = normalizeLegacyAnswerPayload({
      answerOptions: card.answerOptions,
      correctAnswer: card.correctAnswer,
      rationaleIncorrect: card.rationaleIncorrect,
    });
    if (normalized && normalized.length >= 3) {
      result.set(card.id, { options: normalized, source: "json_fallback" });
    } else {
      result.set(card.id, { options: [], source: "none" });
    }
  }

  return result;
}

/**
 * Dual-write helper: persists canonical options for a newly created/updated card.
 * Idempotent — uses upsert so it is safe to call multiple times.
 */
export async function writeCanonicalOptions(
  flashcardId: string,
  options: CanonicalOption[],
  tx?: Parameters<typeof prisma.flashcardOption.upsert>[0] extends { where: unknown } ? never : Prisma.TransactionClient,
): Promise<void> {
  const client = tx ?? prisma;
  await Promise.all(
    options.map((opt) =>
      (client as typeof prisma).flashcardOption.upsert({
        where: { flashcardId_optionKey: { flashcardId, optionKey: opt.optionKey } },
        create: {
          flashcardId,
          optionKey: opt.optionKey,
          content: opt.content,
          isCorrect: opt.isCorrect,
          rationale: opt.rationale,
          displayOrder: opt.displayOrder,
        },
        update: {
          content: opt.content,
          isCorrect: opt.isCorrect,
          rationale: opt.rationale,
          displayOrder: opt.displayOrder,
        },
      }),
    ),
  );
}
