/**
 * On-demand production invalid-credentials copy check (not part of default CI).
 * For valid-account login + paid smoke, use `tests/e2e/setup/auth-paid.setup.ts` + `paid-user-smoke.spec.ts` with E2E_PAID_*.
 *
 *   BASE_URL=https://www.nursenest.ca npx playwright test tests/e2e/paid-user/production-credentials-verify.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";

test("wrong password shows invalid-credentials copy (not generic)", async ({ page }) => {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.locator("#login-identifier").fill("not-a-real-user@example.invalid");
  await page.locator("#login-password").fill("definitely-wrong-password-xyz");
  await page.getByRole("button", { name: /^Sign In$/i }).click();

  await expect(page.getByText(/Invalid email, username, or password/i)).toBeVisible({ timeout: 45_000 });
  await expect(page.getByText(/^Unable to sign in\. Try again\.$/)).not.toBeVisible();
});
