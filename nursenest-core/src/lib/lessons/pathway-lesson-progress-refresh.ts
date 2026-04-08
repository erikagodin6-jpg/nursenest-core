/**
 * When pathway lesson progress changes, we refresh server components on hub/dashboard routes
 * but not on the lesson detail page (that page updates via client events only to avoid flicker).
 */
export function shouldRefreshServerAfterPathwayLessonProgress(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname.startsWith("/app")) return true;
  const parts = pathname.split("/").filter(Boolean);
  const li = parts.indexOf("lessons");
  if (li === -1) return false;
  if (li === parts.length - 1) return true;
  if (parts[li + 1] === "topics") return true;
  return false;
}
