/**
 * Option-level selection analytics for flashcard study sessions.
 *
 * Uses denormalized aggregate counters on `FlashcardOption` to avoid a
 * high-volume per-user log table. Aggregates are incremented atomically
 * (Prisma `update { selectCount: { increment: 1 } }`).
 *
 * Tracked signals:
 *   selectCount        — total times this option was selected
 *   correctSelectCount — times selected when the overall answer was correct
 *     (SATA partial: counts if the option is itself correct)
 *
 * Analytics derivable from these counters:
 *   distractor frequency  = selectCount / Σ(selectCount for card)
 *   misconception rate    = selectCount for wrong options / total sessions
 *   SATA partial accuracy = correctSelectCount / selectCount (per option)
 */

import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type OptionSelectionInput = {
  flashcardId: string;
  /** Option keys selected by the learner (single letter for MCQ; 1+ for SATA). */
  selectedKeys: string[];
  /** Whether the overall card answer was correct (MCQ: true/false; SATA: true if all correct options selected). */
  overallCorrect: boolean;
};

/**
 * Record learner option selections. Increments aggregate counters on each
 * selected `FlashcardOption` row. Silently no-ops when the card has no
 * canonical option rows (legacy JSON-only cards).
 *
 * Fire-and-forget — never throws.
 */
export async function recordOptionSelections(input: OptionSelectionInput): Promise<void> {
  if (input.selectedKeys.length === 0) return;

  try {
    const rows = await prisma.flashcardOption.findMany({
      where: {
        flashcardId: input.flashcardId,
        optionKey: { in: input.selectedKeys },
      },
      select: { id: true, optionKey: true, isCorrect: true },
    });

    if (rows.length === 0) return; // legacy card — no canonical rows

    await Promise.all(
      rows.map((row) =>
        prisma.flashcardOption.update({
          where: { id: row.id },
          data: {
            selectCount: { increment: 1 },
            // For SATA: count a correct-select when this specific option is correct.
            // For MCQ: count when the single correct option was selected (overallCorrect).
            ...(row.isCorrect || input.overallCorrect
              ? { correctSelectCount: { increment: row.isCorrect ? 1 : 0 } }
              : {}),
          },
        }),
      ),
    );
  } catch (e) {
    safeServerLog("flashcard_options", "record_selection_failed", {
      flashcardId: input.flashcardId.slice(0, 12),
      error: e instanceof Error ? e.message.slice(0, 120) : String(e).slice(0, 120),
    });
  }
}

export type OptionAnalyticsSummary = {
  optionKey: string;
  content: string;
  isCorrect: boolean;
  selectCount: number;
  correctSelectCount: number;
  selectRate: number;
  misconceptionRate: number;
};

/**
 * Build a distractor frequency summary for a single flashcard.
 * Useful for admin content dashboards.
 */
export async function loadOptionAnalyticsSummary(
  flashcardId: string,
): Promise<OptionAnalyticsSummary[]> {
  const rows = await prisma.flashcardOption.findMany({
    where: { flashcardId },
    select: {
      optionKey: true,
      content: true,
      isCorrect: true,
      selectCount: true,
      correctSelectCount: true,
    },
    orderBy: { displayOrder: "asc" },
  });

  const totalSelections = rows.reduce((sum, r) => sum + r.selectCount, 0);

  return rows.map((r) => ({
    optionKey: r.optionKey,
    content: r.content,
    isCorrect: r.isCorrect,
    selectCount: r.selectCount,
    correctSelectCount: r.correctSelectCount,
    selectRate: totalSelections > 0 ? r.selectCount / totalSelections : 0,
    misconceptionRate:
      !r.isCorrect && totalSelections > 0 ? r.selectCount / totalSelections : 0,
  }));
}
