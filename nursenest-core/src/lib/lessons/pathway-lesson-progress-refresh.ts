/**
 * When pathway lesson progress changes, we refresh server components on hub/dashboard routes
 * but not on the lesson detail page (that page updates via client events only to avoid flicker).
 *
 * We also skip **interactive study shells** (flashcards hub/session, question bank, practice tests):
 * those surfaces hydrate client-side inventory; a global `router.refresh()` here remounts islands,
 * retriggers `useEffect` fetches, and can look like a URL/search-param “loop” to users.
 */
import { isLearnerShell } from "@/lib/navigation/learner-shell";

function isAppLessonDetailPath(pathname: string): boolean {
  if (!pathname.startsWith("/app/lessons/")) return false;
  if (pathname.startsWith("/app/lessons/topics")) return false;
  const pathOnly = pathname.split("?")[0] ?? pathname;
  const segments = pathOnly.split("/").filter(Boolean);
  // /app/lessons/<slug> (not hub, not topics index)
  return segments.length >= 3 && segments[1] === "lessons";
}

export function shouldRefreshServerAfterPathwayLessonProgress(pathname: string | null): boolean {
  if (!pathname) return false;

  if (
    pathname.startsWith("/app/flashcards") ||
    pathname.startsWith("/app/questions") ||
    pathname.startsWith("/app/practice-tests") ||
    pathname.startsWith("/app/practice-exams") ||
    pathname.startsWith("/app/strategy/")
  ) {
    return false;
  }

  if (isAppLessonDetailPath(pathname)) return false;

  if (isLearnerShell(pathname)) return true;

  const parts = pathname.split("/").filter(Boolean);
  const li = parts.indexOf("lessons");
  if (li === -1) return false;
  if (li === parts.length - 1) return true;
  if (parts[li + 1] === "topics") return true;
  return false;
}
