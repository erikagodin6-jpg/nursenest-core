import type { Page } from "@playwright/test";

/**
 * Performs credentials login on /login and waits until /app is reachable.
 * Used by auth setup; keep in sync with login-form IDs (#login-identifier, #login-password).
 */
export async function loginPaidUser(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.locator("#login-identifier").fill(email);
  await page.locator("#login-password").fill(password);
  await page.getByRole("button", { name: /^Sign In$/i }).click();
  await page.waitForFunction(
    () => {
      const path = window.location.pathname;
      if (path.startsWith("/app")) return true;
      const body = document.body?.innerText ?? "";
      return /Unable to sign in|Invalid email, username, or password|Invalid credentials|incorrect password/i.test(
        body,
      );
    },
    null,
    { timeout: 60_000 },
  );
  if (!/\/app(\/|$)/.test(new URL(page.url()).pathname)) {
    throw new Error(
      "Login rejected (check E2E_PAID_EMAIL / E2E_PAID_PASSWORD and that the account exists on BASE_URL).",
    );
  }
}
