import type { FlashcardRating } from "@/lib/flashcards/spaced-repetition";

/** Learner-friendly labels; map into SM-2 quality bands for scheduling. */
export type SimpleFlashcardRating = "incorrect" | "unsure" | "known";

export function isSimpleFlashcardRating(x: string): x is SimpleFlashcardRating {
  return x === "incorrect" || x === "unsure" || x === "known";
}

/**
 * incorrect → soonest review; unsure → medium interval (SM-2 "good"); known → longer ("easy").
 * Passes through legacy again/hard/good/easy unchanged.
 */
export function toSchedulerRating(input: SimpleFlashcardRating | FlashcardRating): FlashcardRating {
  if (input === "incorrect") return "again";
  if (input === "unsure") return "good";
  if (input === "known") return "easy";
  return input as FlashcardRating;
}
