/**
 * Explicit login (steps 1–3) without relying on saved storage — verifies /login → credentials → /app.
 * `test.use({ storageState: { cookies: [], origins: [] } })` overrides the project `storageState`
 * from `setup-paid-auth`, so this file still performs a real sign-in while other `chromium-paid` specs reuse the cache.
 *
 * Credentials: `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` (see `helpers/paid-test-credentials.ts`).
 *
 * Run with project `chromium-paid` (setup still runs first; this test ignores the saved JSON).
 */
import { expect, test } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Paid user — explicit login flow", () => {
  test("1–3: login page → credentials → dashboard /app", async ({ page }) => {
    const creds = getPaidTestCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL and E2E_PAID_PASSWORD");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await expect(page).toHaveURL(/\/app(\/|$)/, { timeout: 15_000 });

    await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Subscription required" })).toHaveCount(0, {
      timeout: 30_000,
    });
  });
});
