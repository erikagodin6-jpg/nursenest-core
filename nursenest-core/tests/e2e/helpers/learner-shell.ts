/**
 * **Single source of truth** for “learner shell” pathnames in Playwright (Node-side only).
 *
 * Browser callbacks (`waitForFunction` in `learner-login.ts`) must mirror this logic inline — they cannot import this module.
 */
import type { Page } from "@playwright/test";

/** Default timeout for post-login navigation to leave `/login` (ms). */
export const PLAYWRIGHT_AUTH_NAV_TIMEOUT_MS = 60_000;

export const LEARNER_SHELL_PATH_EXPECTATION =
  "pathname must be /app, /app/*, /lessons*, /questions*, or /flashcards*; not /login, /signup, /sign-up, or /app/onboarding.";

export function isLearnerShell(pathname: string): boolean {
  if (!pathname) return false;

  if (
    pathname.includes("/login") ||
    pathname.includes("/signup") ||
    pathname.includes("/sign-up") ||
    pathname.includes("/app/onboarding")
  )
    return false;

  return (
    pathname === "/app" ||
    pathname.startsWith("/app/") ||
    pathname.startsWith("/lessons") ||
    pathname.startsWith("/questions") ||
    pathname.startsWith("/flashcards")
  );
}

/** @deprecated Use {@link isLearnerShell} — identical reference, no separate logic. */
export const isLearnerAppShellPath = isLearnerShell;

/**
 * Primary nav `href` values may be `/app/...` or top-level `/lessons` etc.
 * Resolves absolute URLs to pathname for same-origin checks.
 */
export function isLearnerNavInternalHref(href: string | null | undefined): boolean {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  const raw = href.trim();
  let pathname: string;
  try {
    if (/^https?:\/\//i.test(raw)) {
      pathname = new URL(raw).pathname;
    } else {
      pathname = raw.split(/[?#]/)[0] ?? "";
    }
  } catch {
    return false;
  }
  return isLearnerShell(pathname);
}

export function formatLearnerShellMismatch(url: string, pathname: string): string {
  return `Not on learner shell. url=${url} pathname=${pathname}`;
}

/** Sync URL check for specs that already have `Page`. */
export function currentPathname(page: Page): string {
  try {
    return new URL(page.url()).pathname;
  } catch {
    return "";
  }
}
