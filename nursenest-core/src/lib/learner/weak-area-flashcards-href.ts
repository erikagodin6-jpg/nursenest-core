/**
 * Tier-scoped weak-area flashcard study — always stays under `/app/flashcards/weak-areas`.
 * Pass the learner's preferred pathway when known so `/api/flashcards/weak-queue` can resolve inventory.
 */
export function weakAreaFlashcardsHref(pathwayId?: string | null): string {
  const p = typeof pathwayId === "string" ? pathwayId.trim() : "";
  return p.length > 0
    ? `/app/flashcards/weak-areas?pathwayId=${encodeURIComponent(p)}`
    : "/app/flashcards/weak-areas";
}
