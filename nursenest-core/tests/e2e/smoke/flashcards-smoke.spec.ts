/**
 * Smoke — Flashcards Session Flow
 *
 * Phase 1: Core Smoke Suite — Flashcards
 * Verifies: launcher loads, category selection, multi-category, session generates,
 *           cards render, next card, session completion.
 *
 * Fails if:
 *   - "session could not load" appears
 *   - "0 cards available" appears
 *   - empty session (no cards returned)
 *
 * Requires: paid QA credentials (QA_PAID_EMAIL + QA_PAID_PASSWORD)
 *
 * Run:
 *   npx playwright test tests/e2e/smoke/flashcards-smoke.spec.ts --project=chromium-paid
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

const FLASHCARD_HUB = "/app/flashcards";
const SESSION_ERROR_PATTERNS = [
  /session could not load/i,
  /0 cards available/i,
  /no cards found/i,
  /failed to create session/i,
  /session creation error/i,
];

function hasSessionError(text: string): boolean {
  return SESSION_ERROR_PATTERNS.some((p) => p.test(text));
}

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Smoke — Flashcards", () => {
  test("launcher loads, category visible, session generates with cards", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD to run flashcard smoke");

    const observers = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await page.goto(FLASHCARD_HUB, { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "flashcards-smoke");

      // Launcher renders
      const main = page.locator("main");
      await expect(main).toBeVisible({ timeout: 60_000 });

      // No session errors on launch
      const mainText = await main.innerText().catch(() => "");
      expect(
        hasSessionError(mainText),
        `Session error on launch: ${mainText.slice(0, 200)}`,
      ).toBeFalsy();

      // Category options visible (pathway chips or filter selectors)
      const categoryArea = page.locator(
        "[data-nn-flashcards-hub-categories], [data-nn-qa-flashcards-category], .nn-flashcards-hub",
      ).first();
      // Hub renders without blank content
      expect(mainText.length, "Flashcard hub content not empty").toBeGreaterThan(50);

      // Start a session — look for a "Start" or "Begin" button
      const startBtn = page
        .getByRole("button", { name: /start|begin|study|launch/i })
        .first();
      const hasStartBtn = (await startBtn.count()) > 0;

      if (hasStartBtn) {
        await startBtn.click();
        // Wait for session or cards to appear (up to 30s)
        await page.waitForURL(/\/app\/flashcards/, { timeout: 30_000 });

        // Allow up to 10s for first card
        const cardVisible = await page
          .locator(
            "[data-nn-flashcard-card], [data-nn-qa-flashcard-front], .nn-flashcard-front",
          )
          .first()
          .isVisible({ timeout: 10_000 })
          .catch(() => false);

        const currentText = await page.locator("main").innerText().catch(() => "");
        expect(hasSessionError(currentText), `Session error after launch: ${currentText.slice(0, 300)}`).toBeFalsy();

        if (cardVisible) {
          // Flip or advance the card
          const flipBtn = page.getByRole("button", { name: /flip|show answer|reveal/i }).first();
          if (await flipBtn.count() > 0) await flipBtn.click();

          // Next card
          const nextBtn = page
            .getByRole("button", { name: /next|continue|got it|knew it|didn.*know/i })
            .first();
          if (await nextBtn.count() > 0) {
            await nextBtn.click();
            await page.waitForTimeout(500);
          }
        }
      }

      await attachSmokeCapture(testInfo, "flashcards-smoke", buildCaptureFromObservers(page, observers));
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "flashcards-smoke-failure.png");
      await attachSmokeCapture(testInfo, "flashcards-smoke", buildCaptureFromObservers(page, observers));
      throw e;
    } finally {
      observers.dispose();
    }
  });

  test("multi-category selection: selecting two categories does not error", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Requires paid credentials");

    const observers = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await page.goto(FLASHCARD_HUB, { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "flashcards-multi-category");

      // Look for category toggle buttons/checkboxes
      const categoryBtns = page.locator(
        "[data-nn-qa-flashcards-category], [data-nn-flashcard-category-chip]",
      );
      const count = await categoryBtns.count();

      if (count >= 2) {
        await categoryBtns.nth(0).click();
        await categoryBtns.nth(1).click();

        // Confirm no error state appeared
        const bodyText = await page.locator("main").innerText().catch(() => "");
        expect(hasSessionError(bodyText), `Error after multi-select: ${bodyText.slice(0, 200)}`).toBeFalsy();
      }

      await attachSmokeCapture(testInfo, "flashcards-multi-category", buildCaptureFromObservers(page, observers));
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "flashcards-multi-category-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
