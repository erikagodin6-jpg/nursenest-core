/**
 * Single source of truth: “learner shell” URL classification (authenticated study surfaces).
 *
 * Used by client components, E2E (via `@/lib/navigation/learner-shell`), and tests — **no duplicate predicates**.
 */
export function isLearnerShell(pathname: string): boolean {
  if (!pathname) return false;

  if (
    pathname.includes("/login") ||
    pathname.includes("/signup") ||
    pathname.includes("/sign-up") ||
    pathname.includes("/app/onboarding")
  ) {
    return false;
  }

  return (
    pathname === "/app" ||
    pathname.startsWith("/app/") ||
    pathname.startsWith("/lessons") ||
    pathname.startsWith("/questions") ||
    pathname.startsWith("/flashcards")
  );
}

/** @deprecated Use {@link isLearnerShell} — alias only, identical behavior. */
export const isLearnerAppShellPath = isLearnerShell;
