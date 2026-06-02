/**
 * True only on the flashcards landing hub (`/app/flashcards`), not custom sessions or deck routes.
 * Used to hide secondary learner chrome (guided path strip, retention pulse, staff banner) so the
 * study workspace dominates the first viewport.
 */
export function isFlashcardsHubLandingPath(inputPathname: string | null | undefined): boolean {
  const pathname = (inputPathname ?? "").split("?")[0]?.split("#")[0]?.replace(/\/+$/, "") ?? "";
  return pathname === "/app/flashcards";
}

/**
 * Active flashcard study surfaces suppress the full learner chrome so the
 * exam-minimal nav shows instead.
 *
 * Matches two URL shapes:
 *   /app/flashcards/[deckRef]                                          (legacy deck study)
 *   /app/study-tools/flashcards/decks/[deckId]/session/[sessionId]     (new session player)
 */
export function isFlashcardsFocusedStudyPath(inputPathname: string | null | undefined): boolean {
  const pathname = (inputPathname ?? "").split("?")[0]?.split("#")[0]?.replace(/\/+$/, "") ?? "";
  const parts = pathname.split("/").filter(Boolean);

  // /app/flashcards/[deckRef]
  if (parts.length === 3 && parts[0] === "app" && parts[1] === "flashcards") {
    const leaf = parts[2]?.trim() ?? "";
    return Boolean(leaf) && leaf !== "decks";
  }

  // /app/study-tools/flashcards/decks/[deckId]/session/[sessionId]
  if (
    parts.length === 7 &&
    parts[0] === "app" &&
    parts[1] === "study-tools" &&
    parts[2] === "flashcards" &&
    parts[3] === "decks" &&
    parts[5] === "session" &&
    Boolean(parts[4]) &&
    Boolean(parts[6])
  ) {
    return true;
  }

  return false;
}
