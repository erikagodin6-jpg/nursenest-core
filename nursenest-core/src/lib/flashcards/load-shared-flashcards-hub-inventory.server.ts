import "server-only";

import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildFlashcardCustomSession } from "@/lib/flashcards/build-flashcard-custom-session";
import type { FlashcardsHubServerPayload } from "@/lib/flashcards/flashcards-hub-types";

export type SharedFlashcardsHubInventoryResult =
  | {
      ok: true;
      payload: FlashcardsHubServerPayload;
      categories: { name: string; count: number }[];
    }
  | {
      ok: false;
      code: string;
      message: string;
    };

/**
 * Shared flashcard hub inventory path.
 *
 * This intentionally calls the same count-only custom-session builder used by
 * launch/session creation, so hub counts and launchable cards are derived from
 * one merged pool: exam questions + dedicated flashcards + lesson-derived cards.
 */
export async function loadSharedFlashcardsHubInventoryForPathway(args: {
  userId: string;
  entitlement: AccessScope;
  pathway: ExamPathwayDefinition;
}): Promise<SharedFlashcardsHubInventoryResult> {
  const built = await buildFlashcardCustomSession({
    userId: args.userId,
    entitlement: args.entitlement,
    pathwayId: args.pathway.id,
    topicCode: null,
    lessonId: null,
    selectedCategories: [],
    stateIds: [],
    weakOnly: false,
    incorrectOnly: false,
    starredOnly: false,
    savedOnly: false,
    notesOnly: false,
    revisitOnly: false,
    notStudiedOnly: false,
    recentStudiedOnly: false,
    recentDays: 14,
    shuffle: true,
    mode: "mixed",
    limit: 25,
    includeCards: false,
    sourceKind: "all",
    cardLimitRaw: "25",
  });

  if (!built.ok) {
    return {
      ok: false,
      code: built.code,
      message: built.message,
    };
  }

  return {
    ok: true,
    payload: {
      categoryOptions: built.categoryOptions,
      matchingTotal: built.summary.matchingCards,
      lessonVirtualDiagnostics: built.summary.lessonVirtualDiagnostics ?? null,
      poolDiagnostics: built.summary.poolInventoryDiagnostics ?? null,
    },
    categories: built.categoryOptions.map((row) => ({
      name: row.id,
      count: row.count,
    })),
  };
}
