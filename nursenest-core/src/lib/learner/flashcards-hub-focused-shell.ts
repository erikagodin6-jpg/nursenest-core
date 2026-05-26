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
 * Active flashcard study surfaces keep the canonical learner nav, but suppress
 * secondary strips above the session so the current study shell owns the page.
 */
export function isFlashcardsFocusedStudyPath(inputPathname: string | null | undefined): boolean {
  const pathname = (inputPathname ?? "").split("?")[0]?.split("#")[0]?.replace(/\/+$/, "") ?? "";
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 3) return false;
  if (parts[0] !== "app" || parts[1] !== "flashcards") return false;
  const leaf = parts[2]?.trim() ?? "";
  return Boolean(leaf) && leaf !== "decks";
}
