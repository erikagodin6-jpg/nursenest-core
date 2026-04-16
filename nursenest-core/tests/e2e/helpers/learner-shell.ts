/**
 * **Canonical learner-shell detection** for Playwright (Node-side only).
 *
 * Do **not** import application routes here — this file documents the URL contract tests rely on.
 * Production may serve the same chrome at `/app/...` or at top-level `/lessons`, `/questions`, `/flashcards`
 * (rewrites/proxy). Assertions use `page.url()` (Playwright resolves relative `goto()` against `use.baseURL` / `BASE_URL`).
 *
 * **Browser context:** `loginWithCredentials` in `learner-login.ts` embeds an equivalent **inline**
 * `waitForFunction` predicate (only `window.location` / string checks). If you change rules here,
 * update that callback in the same PR — it cannot import this module (serialized to the page).
 *
 * Valid learner shell (pathname):
 * - `/app` and `/app/*` **except** `/app/onboarding` and nested onboarding routes
 * - `/lessons`, `/lessons/*`
 * - `/questions`, `/questions/*`
 * - `/flashcards`, `/flashcards/*`
 * (Other `/app/*` surfaces — account, practice-tests, etc. — are included via `/app` prefix.)
 *
 * Invalid for paid regression “ready” state:
 * - `/login`, paths containing `/login` as a segment (defensive)
 * - `/signup`, `/sign-up`
 * - `/app/onboarding`, `/app/onboarding/*`
 */
import type { Page } from "@playwright/test";

/** Default timeout for post-login navigation to leave `/login` (ms). */
export const PLAYWRIGHT_AUTH_NAV_TIMEOUT_MS = 60_000;

export const LEARNER_SHELL_PATH_EXPECTATION =
  "learner shell: pathname is `/app`, `/app/*` (not `/apple…`), `/lessons*`, `/questions*`, or `/flashcards*`; exclude `/app/onboarding*`; not paths containing `/login`, `/signup`, or `/sign-up`.";

/** True for `/app/onboarding` and nested onboarding steps (E2E must fail fast here). */
export function isAppOnboardingPath(pathname: string): boolean {
  return pathname === "/app/onboarding" || pathname.startsWith("/app/onboarding/");
}

export function isLearnerShell(pathname: string): boolean {
  if (!pathname) return false;

  if (pathname.includes("/login")) return false;
  if (pathname.includes("/signup") || pathname.includes("/sign-up")) return false;
  if (isAppOnboardingPath(pathname)) return false;

  return (
    pathname === "/app" ||
    pathname.startsWith("/app/") ||
    pathname.startsWith("/lessons") ||
    pathname.startsWith("/questions") ||
    pathname.startsWith("/flashcards")
  );
}

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
  return [`Expected learner shell.`, `url=${url}`, `pathname=${pathname}`, `Expected: ${LEARNER_SHELL_PATH_EXPECTATION}`].join(
    " ",
  );
}

/** Sync URL check for specs that already have `Page`. */
export function currentPathname(page: Page): string {
  try {
    return new URL(page.url()).pathname;
  } catch {
    return "";
  }
}
