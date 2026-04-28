import type { BuilderCategoryOption } from "@/lib/flashcards/flashcard-builder-taxonomy";

/** Server-rendered flashcards hub inventory for first paint (category counts + totals). */
export type FlashcardsHubServerPayload = {
  categoryOptions: BuilderCategoryOption[];
  matchingTotal: number;
};
