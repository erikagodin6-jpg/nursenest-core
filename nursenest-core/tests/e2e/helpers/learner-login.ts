import type { Page } from "@playwright/test";

/** Human-readable hint for assertion errors (routes may use `/app/*` or direct learner paths). */
export const LEARNER_SHELL_PATH_EXPECTATION =
  "learner shell: pathname under /app (excluding /app/onboarding), or /lessons, /questions, /flashcards; not /login, /signup, or onboarding";

/**
 * Route-agnostic learner shell detection. The app may serve the same chrome at `/app/...` or at
 * top-level paths such as `/lessons` (see proxy rewrites); tests must accept both.
 */
export function isLearnerShell(pathname: string): boolean {
  if (!pathname) return false;
  if (pathname.includes("/login")) return false;
  if (pathname.includes("/signup")) return false;
  if (pathname.includes("/app/onboarding")) return false;

  const underApp =
    pathname === "/app" || (pathname.startsWith("/app/") && !pathname.startsWith("/app/onboarding"));

  return (
    underApp ||
    pathname.startsWith("/lessons") ||
    pathname.startsWith("/questions") ||
    pathname.startsWith("/flashcards")
  );
}

/** @deprecated Prefer {@link isLearnerShell} — kept for older imports. */
export const isLearnerAppShellPath = isLearnerShell;

/**
 * Credentials login on /login → /app. Shared by paid and free auth setup.
 *
 * Waits for a **post-onboarding** learner route. `/app/onboarding` is treated as failure: the account
 * must have `onboardingCompletedAt` set (see `scripts/qa-paid-test-account-reset.mts` for paid E2E).
 */
export async function loginWithCredentials(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.locator("#login-identifier").fill(email);
  await page.locator("#login-password").fill(password);
  await page.getByRole("button", { name: /^Sign In$/i }).click();
  /** Browser-only: do not reference Node helpers here — `waitForFunction` runs in the page context. */
  await page.waitForFunction(
    () => {
      const path = window.location.pathname;
      if (!path) return false;
      if (path.includes("/login") || path.includes("/signup") || path.includes("/app/onboarding")) return false;
      const underApp =
        path === "/app" || (path.startsWith("/app/") && !path.startsWith("/app/onboarding"));
      const onLearnerShell =
        underApp ||
        path.startsWith("/lessons") ||
        path.startsWith("/questions") ||
        path.startsWith("/flashcards");
      if (onLearnerShell) return true;
      const body = document.body?.innerText ?? "";
      return /Unable to sign in|Invalid email, username, or password|Invalid credentials|incorrect password/i.test(
        body,
      );
    },
    null,
    { timeout: 60_000 },
  );
  const atUrl = page.url();
  const pathname = new URL(atUrl).pathname;
  if (/Unable to sign in|Invalid email, username, or password|Invalid credentials|incorrect password/i.test(
    await page.locator("body").innerText().catch(() => ""),
  )) {
    throw new Error(
      `Login rejected — check email/password and that the account exists for BASE_URL. Current URL: ${atUrl}`,
    );
  }
  if (pathname === "/app/onboarding" || pathname.startsWith("/app/onboarding/")) {
    throw new Error(
      `Signed in but still on /app/onboarding — complete onboarding in the product or run scripts/qa-paid-test-account-reset.mts (sets onboardingCompletedAt + learnerPath) for this E2E user. Current URL: ${atUrl}`,
    );
  }
  if (!isLearnerShell(pathname)) {
    throw new Error(
      `Login rejected — check email/password and that the account exists for BASE_URL. Current URL: ${atUrl}`,
    );
  }
}
