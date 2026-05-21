/**
 * True only on the flashcards landing hub (`/app/flashcards`), not custom sessions or deck routes.
 * Used to hide secondary learner chrome (guided path strip, retention pulse, staff banner) so the
 * study workspace dominates the first viewport.
 */
export function isFlashcardsHubLandingPath(inputPathname: string | null | undefined): boolean {
  const pathname = (inputPathname ?? "").split("?")[0]?.split("#")[0]?.replace(/\/+$/, "") ?? "";
  return pathname === "/app/flashcards";
}
