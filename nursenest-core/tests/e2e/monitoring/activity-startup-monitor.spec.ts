import { expect, test } from "@playwright/test";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";
import { expectPaidLearnerShellReady, learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";

test.describe("Activity startup uptime monitor", () => {
  test.skip(!getPaidTestCredentials(), "Requires paid learner credentials/storage state");

  test("flashcards, practice questions, and CAT startup become interactive", async ({ page }) => {
    test.setTimeout(180_000);

    await page.goto("/api/health/activity-startup", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toContainText(/activityStartup|ok/i);

    await page.goto("/app/flashcards", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page, "flashcards monitor");
    await expectPaidLearnerShellReady(page, "flashcards monitor");
    const flashMain = learnerAppMainLandmark(page);
    await expect(flashMain.locator("[data-nn-e2e-flashcards-hub]")).toBeVisible({ timeout: 30_000 });
    const flashStart = flashMain.locator("[data-nn-e2e-start-review]").first();
    if (await flashStart.isVisible().catch(() => false)) {
      await flashStart.click();
      await page.waitForURL(/\/app\/flashcards\/custom/, { timeout: 45_000 });
      await expect(
        page.locator(".nn-flashcard-session-layout, [data-nn-premium-flashcard-study], .nn-flashcard-empty-state").first(),
      ).toBeVisible({ timeout: 20_000 });
    }

    await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page, "questions monitor");
    await expectPaidLearnerShellReady(page, "questions monitor");
    await expect(
      page.locator(".nn-question-stem, [data-testid='marketing-practice-questions-hub'], main").first(),
    ).toBeVisible({ timeout: 30_000 });

    await page.goto("/app/practice-tests?cat=1", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page, "cat monitor");
    await expectPaidLearnerShellReady(page, "cat monitor");
    await expect(page.locator("[data-nn-qa-practice-hub-start-test], main").first()).toBeVisible({ timeout: 30_000 });
  });
});
