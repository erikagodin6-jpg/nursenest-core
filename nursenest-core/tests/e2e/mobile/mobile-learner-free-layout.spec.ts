/**
 * Free-tier learner on mobile — optional `QA_FREE_EMAIL` / `QA_FREE_PASSWORD`.
 */
import { expect, test } from "@playwright/test";
import { learnerShellStudyNavigation } from "../helpers/learner-shell-locators";
import { loginWithCredentials } from "../helpers/learner-login";
import { assertMobileHorizontalLayoutHealth } from "../helpers/mobile-layout-health";
import { expectOnLearnerApp } from "../helpers/paid-surface-assertions";
import { getQaFreeCredentials } from "../helpers/smoke-credentials";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Mobile — free learner", () => {
  test("dashboard + lesson paywall — bounded width", async ({ page }) => {
    const creds = getQaFreeCredentials();
    test.skip(!creds, "Set QA_FREE_EMAIL + QA_FREE_PASSWORD (or E2E_FREE_*)");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await expectOnLearnerApp(page);

    await page.goto("/app", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });
    await assertMobileHorizontalLayoutHealth(page, "free /app");

    await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Subscription required" })).toBeVisible({ timeout: 45_000 });
    await assertMobileHorizontalLayoutHealth(page, "free /app/lessons");
  });

  test("learner bottom nav — tap Flashcards and assert bounded width", async ({ page }) => {
    const creds = getQaFreeCredentials();
    test.skip(!creds, "Set QA_FREE_EMAIL + QA_FREE_PASSWORD (or E2E_FREE_*)");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await expectOnLearnerApp(page);

    await page.goto("/app", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });
    const nav = learnerShellStudyNavigation(page);
    await expect(nav).toBeVisible({ timeout: 60_000 });
    const flash = nav.getByRole("link", { name: /flashcards/i }).first();
    await expect(flash).toBeVisible({ timeout: 30_000 });
    await flash.click();
    await page.waitForURL(/\/app\/flashcards/, { timeout: 60_000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });
    await assertMobileHorizontalLayoutHealth(page, "free /app/flashcards (bottom nav)");
  });
});
