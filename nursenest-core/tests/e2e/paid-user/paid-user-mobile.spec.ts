/**
 * **Mobile paid-user smoke** — viewport-specific checks without duplicating the full desktop journey.
 *
 * @see ../helpers/paid-user-suite.ts
 */
import { expect, test } from "@playwright/test";
import {
  LESSON_HUB_CARD_LINKS,
  paidFlashcardsHubUrl,
  paidLessonsHubUrl,
  paidQuestionsHubUrl,
} from "../helpers/paid-content-discovery";
import { expectPaidLearnerShellReady } from "../helpers/paid-learner-shell";
import {
  answerOneQuestionBankItem,
  assertPaidUserGuardsClean,
  attachPaidUserStandardGuards,
  dismissFlashcardResumeIfPresent,
  expectNotLoginUrl,
  expectNoSubscriberPaywallSurface,
} from "../helpers/paid-user-suite";

test.describe("Paid user — mobile smoke", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("shell, lesson, practice, bottom nav, flashcards", async ({ page, baseURL }, testInfo) => {
    const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    const guards = attachPaidUserStandardGuards(page, appOrigin);

    try {
      await test.step("Learner dashboard", async () => {
        await page.goto("/app", { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectPaidLearnerShellReady(page, "mobile /app");
        await expectNoSubscriberPaywallSurface(page, "/app");
        await expect(page.locator("main")).toBeVisible({ timeout: 30_000 });
      });

      await test.step("Premium lesson — first hub link (pathway)", async () => {
        await page.goto(paidLessonsHubUrl(), { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectNoSubscriberPaywallSurface(page, "/app/lessons");
        const first = page.locator(LESSON_HUB_CARD_LINKS).first();
        await expect(first).toBeVisible({ timeout: 120_000 });
        await first.click();
        await page.waitForLoadState("domcontentloaded");
        expectNotLoginUrl(page);
        await expectNoSubscriberPaywallSurface(page, "lesson mobile");
        const mainText = await page.locator("main").innerText();
        expect(mainText.length).toBeGreaterThan(120);
        await expect(page.locator('aside[aria-label="Lesson access"]').getByText(/^Preview only$/i)).toHaveCount(0);
      });

      await test.step("Practice — one bank item", async () => {
        await page.goto(paidQuestionsHubUrl(), { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectNoSubscriberPaywallSurface(page, "/app/questions");
        await page.getByRole("heading", { name: /^Question bank$/i }).scrollIntoViewIfNeeded();
        await answerOneQuestionBankItem(page);
      });

      await test.step("Bottom nav — in viewport", async () => {
        await page.goto("/app", { waitUntil: "domcontentloaded" });
        const bottom = page.locator('nav[aria-label="Learner bottom navigation"]').getByRole("link");
        const n = await bottom.count();
        expect(n).toBeGreaterThan(0);
        const last = bottom.nth(n - 1);
        await last.scrollIntoViewIfNeeded();
        await expect(last).toBeVisible();
        const box = await last.boundingBox();
        expect(box, "bottom nav link should have layout").toBeTruthy();
        expect(box!.y + box!.height).toBeLessThanOrEqual(900);
      });

      await test.step("Flashcards — learn deck opens", async () => {
        await page.goto(paidFlashcardsHubUrl(), { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectNoSubscriberPaywallSurface(page, "/app/flashcards");
        const learnFirst = page.locator('a[href*="/app/flashcards/"][href*="mode=learn"]').first();
        await expect(learnFirst).toBeVisible({ timeout: 120_000 });
        await learnFirst.click();
        await page.waitForLoadState("domcontentloaded");
        await dismissFlashcardResumeIfPresent(page);
        const reveal = page.getByRole("button", { name: /reveal answer/i });
        await expect(reveal).toBeVisible({ timeout: 120_000 });
        await reveal.scrollIntoViewIfNeeded();
        await expect(reveal).toBeEnabled();
      });

      await test.step("Guards", async () => {
        assertPaidUserGuardsClean({
          tag: "[paid-user-mobile]",
          routeLabel: "final",
          observers: guards.observers,
          apiViolations: guards.apiObserver.violations,
          pageUrl: page.url(),
          page,
          sessionNet: guards.sessionNet,
          i18nConsoleMode: "warn",
          attach: (name, body) => {
            void testInfo.attach(name, { body, contentType: "text/plain" });
          },
        });
      });
    } finally {
      guards.dispose();
    }
  });
});
