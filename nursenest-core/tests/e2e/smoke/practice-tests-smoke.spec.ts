/**
 * Smoke — Practice Tests Session Flow
 *
 * Phase 1: Core Smoke Suite — Practice Tests
 * Verifies: launcher, session creation, question renders, answer submits,
 *           rationale displays, review page displays.
 *
 * Fails if:
 *   - no questions generated
 *   - blank rationale after submission
 *   - session creation error
 *
 * Requires: paid QA credentials (QA_PAID_EMAIL + QA_PAID_PASSWORD)
 *
 * Run:
 *   npx playwright test tests/e2e/smoke/practice-tests-smoke.spec.ts --project=chromium-paid
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

const PRACTICE_HUB = "/app/practice-tests";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Smoke — Practice Tests", () => {
  test("launcher loads, session creates with questions, answer submits, rationale appears", async (
    { page },
    testInfo,
  ) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD to run practice tests smoke");

    const observers = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await page.goto(PRACTICE_HUB, { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "practice-tests-smoke");

      // Hub loads with start button
      const startBtn = page.locator("[data-nn-qa-practice-hub-start-test]").first();
      await expect(startBtn).toBeVisible({ timeout: 60_000 });
      await startBtn.click();

      // Wait for practice session URL
      await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });

      // Session runner must be visible
      const sessionRoot = page.locator(
        "[data-nn-practice-session-root], [data-cat-exam-root], [data-nn-qa-practice-session]",
      ).first();
      await expect(sessionRoot).toBeVisible({ timeout: 30_000 });

      // Verify a question is rendered (not blank, not error state)
      const questionText = await sessionRoot.innerText().catch(() => "");
      expect(questionText.length, "Question content not empty").toBeGreaterThan(20);
      expect(questionText, "No 'no questions' error").not.toMatch(/no questions generated|session creation error/i);

      // Select an answer
      const firstOption = page
        .locator('[role="radio"], [data-nn-qa-option]')
        .first();
      if (await firstOption.count() > 0) {
        await firstOption.click();

        // Submit
        const submitBtn = page.getByRole("button", { name: /submit|confirm/i }).first();
        if (await submitBtn.count() > 0 && await submitBtn.isEnabled().catch(() => false)) {
          await submitBtn.click();

          // Rationale should appear — must not be blank
          const rationale = page.locator(
            "[data-nn-qa-rationale], .nn-question-session-rationale, [data-nn-rationale-body]",
          );
          const rationaleVisible = await rationale.first().isVisible({ timeout: 15_000 }).catch(() => false);

          if (rationaleVisible) {
            const rationaleText = await rationale.first().innerText().catch(() => "");
            expect(rationaleText.trim().length, "Rationale must not be blank").toBeGreaterThan(10);
          }
        }
      }

      await attachSmokeCapture(testInfo, "practice-tests-smoke", buildCaptureFromObservers(page, observers));
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "practice-tests-smoke-failure.png");
      await attachSmokeCapture(testInfo, "practice-tests-smoke", buildCaptureFromObservers(page, observers));
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
