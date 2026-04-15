import type { Page } from "@playwright/test";

/** True when URL is under /app but not the onboarding wizard (which shares the learner chrome). */
export function isLearnerAppShellPath(pathname: string): boolean {
  if (!pathname.startsWith("/app")) return false;
  if (pathname === "/app/onboarding" || pathname.startsWith("/app/onboarding/")) return false;
  return true;
}

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
      const onLearnerShell =
        path.startsWith("/app") &&
        path !== "/app/onboarding" &&
        !path.startsWith("/app/onboarding/");
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
  if (!isLearnerAppShellPath(pathname)) {
    throw new Error(
      `Login rejected — check email/password and that the account exists for BASE_URL. Current URL: ${atUrl}`,
    );
  }
}
