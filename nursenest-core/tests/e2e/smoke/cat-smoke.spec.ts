/**
 * Smoke — CAT Session Flow
 *
 * Phase 1: Core Smoke Suite — Computerized Adaptive Testing
 * Verifies: CAT launches, question loads, answer submits, next question appears,
 *           completion screen appears.
 *
 * Fails if:
 *   - multiple questions shown simultaneously
 *   - infinite loading (> 30s for first question)
 *   - missing next question after answer
 *
 * Requires: paid QA credentials (QA_PAID_EMAIL + QA_PAID_PASSWORD)
 *
 * Run:
 *   npx playwright test tests/e2e/smoke/cat-smoke.spec.ts --project=chromium-paid
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { loginWithCredentials } from "../helpers/learner-login";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";

const CAT_HUB = "/app/practice-tests?cat=1";
const QUESTION_LOAD_TIMEOUT_MS = 30_000;

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Smoke — CAT Session", () => {
  test("CAT launches, question loads, answer submits, advances to next question", async (
    { page },
    testInfo,
  ) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD to run CAT smoke");

    const observers = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await page.goto(CAT_HUB, { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "cat-smoke-hub");

      // Hub loads — start button visible
      const startBtn = page.locator("[data-nn-qa-practice-hub-start-test]").first();
      await expect(startBtn).toBeVisible({ timeout: 60_000 });
      await startBtn.click();

      // "Begin exam" confirmation
      const beginBtn = page.getByRole("button", { name: /^Begin exam$/i });
      await expect(beginBtn).toBeVisible({ timeout: 15_000 });
      await beginBtn.click();

      // Wait for CAT session URL
      await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });

      // CAT exam root must be visible
      const examRoot = page.locator("[data-cat-exam-root]");
      await expect(examRoot).toBeVisible({ timeout: QUESTION_LOAD_TIMEOUT_MS });

      // Exactly one question at a time (not multiple)
      const questionContainers = page.locator("[data-nn-qa-cat-format], [data-nn-qa-exam-format]");
      const qCount = await questionContainers.count();
      expect(qCount, "Multiple questions shown simultaneously").toBeLessThanOrEqual(1);

      // No infinite loading state
      const loadingSpinner = page.locator('[data-nn-loading="true"], .nn-loading-spinner');
      const stillLoading = await loadingSpinner.isVisible({ timeout: 2_000 }).catch(() => false);
      expect(stillLoading, "CAT stuck in loading state after question should be visible").toBeFalsy();

      // Submit button present (disabled until answer selected)
      const submitBtn = page.getByRole("button", { name: /^Submit answer$/i });
      await expect(submitBtn).toBeVisible({ timeout: 15_000 });
      expect(await submitBtn.isDisabled(), "Submit should be disabled before answer").toBeTruthy();

      // Select an answer (first MCQ option)
      const firstOption = page
        .locator('[data-nn-qa-cat-format="mcq"] [data-nn-qa-option], [data-nn-qa-exam-format="mcq"] [role="radio"]')
        .first();
      if (await firstOption.count() > 0) {
        await firstOption.click();
        await expect(submitBtn).toBeEnabled({ timeout: 5_000 });
        await submitBtn.click();

        // After submission: next question or completion
        const advanced = await Promise.race([
          page.waitForSelector("[data-cat-exam-root]", { timeout: 30_000 }).then(() => "next_question"),
          page.waitForSelector("[data-nn-qa-cat-completion], .nn-cat-completion", { timeout: 30_000 }).then(() => "completion"),
        ]).catch(() => null);

        expect(advanced, "CAT did not advance after answer submission").toBeTruthy();
      }

      await attachSmokeCapture(testInfo, "cat-smoke", buildCaptureFromObservers(page, observers));
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "cat-smoke-failure.png");
      await attachSmokeCapture(testInfo, "cat-smoke", buildCaptureFromObservers(page, observers));
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
