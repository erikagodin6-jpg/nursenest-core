import type { BuilderCategoryOption } from "@/lib/flashcards/flashcard-builder-taxonomy";
import type { FlashcardLessonVirtualDiagnostics } from "@/lib/flashcards/flashcard-custom-session-response";

/** Server-rendered flashcards hub inventory for first paint (category counts + totals). */
export type FlashcardsHubServerPayload = {
  categoryOptions: BuilderCategoryOption[];
  matchingTotal: number;
  lessonVirtualDiagnostics?: FlashcardLessonVirtualDiagnostics | null;
};
