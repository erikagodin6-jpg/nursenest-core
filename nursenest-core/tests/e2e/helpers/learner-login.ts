/**
 * Credentials login → learner shell. Canonical shell rules: {@link ./learner-shell}.
 *
 * **Browser serialization:** `waitForFunction` must mirror {@link isLearnerShell} in `learner-shell.ts`
 * (same branches). It cannot import helpers — Playwright runs the callback in the page context.
 */
import type { Page } from "@playwright/test";
import { describeAuthFailureSurface } from "./auth-diagnostics";
import { isLearnerShell, PLAYWRIGHT_AUTH_NAV_TIMEOUT_MS, formatLearnerShellMismatch } from "./learner-shell";

export {
  currentPathname,
  isLearnerAppShellPath,
  isLearnerNavInternalHref,
  isLearnerShell,
  LEARNER_SHELL_PATH_EXPECTATION,
  formatLearnerShellMismatch,
  PLAYWRIGHT_AUTH_NAV_TIMEOUT_MS,
} from "./learner-shell";

/**
 * Credentials login on /login → learner shell.
 *
 * Waits for a **post-onboarding** learner route. `/app/onboarding` is treated as failure for paid regression seeds.
 */
export async function loginWithCredentials(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.locator("#login-identifier").fill(email);
  await page.locator("#login-password").fill(password);
  await page.getByRole("button", { name: /^Sign In$/i }).click();

  await page.waitForFunction(
    () => {
      const path = window.location.pathname;
      if (!path) return false;

      if (
        path.includes("/login") ||
        path.includes("/signup") ||
        path.includes("/sign-up") ||
        path.includes("/app/onboarding")
      )
        return false;

      return (
        path === "/app" ||
        path.startsWith("/app/") ||
        path.startsWith("/lessons") ||
        path.startsWith("/questions") ||
        path.startsWith("/flashcards")
      );
    },
    undefined,
    { timeout: PLAYWRIGHT_AUTH_NAV_TIMEOUT_MS },
  );

  const atUrl = page.url();
  const pathname = new URL(atUrl).pathname;
  const body = await page.locator("body").innerText().catch(() => "");

  if (/Unable to sign in|Invalid email, username, or password|Invalid credentials|incorrect password/i.test(body)) {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(
      `Login rejected — check email/password and BASE_URL. ${formatLearnerShellMismatch(atUrl, pathname)} ${diag}`,
    );
  }
  if (pathname.includes("/app/onboarding")) {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(`On /app/onboarding — complete onboarding... ${formatLearnerShellMismatch(atUrl, pathname)} ${diag}`);
  }
  if (!isLearnerShell(pathname)) {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(`${formatLearnerShellMismatch(atUrl, pathname)} ${diag}`);
  }
}
