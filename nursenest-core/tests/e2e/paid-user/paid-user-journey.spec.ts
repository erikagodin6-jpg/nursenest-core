/**
 * End-to-end **subscriber journey**: homepage → dashboard → lessons → premium lesson → practice → flashcards → billing.
 *
 * Uses `tests/e2e/.auth/paid-user.json` via `--project=chromium-paid` (no UI login per run).
 *
 * @see ../helpers/paid-user-suite.ts for run commands and shared guards.
 */
import { expect, test } from "@playwright/test";
import {
  assertNoMissingI18nDomTokens,
  assertPaidUserGuardsClean,
  attachPaidUserStandardGuards,
  dismissFlashcardResumeIfPresent,
  answerOneQuestionBankItem,
  expectNotLoginUrl,
  expectNoSubscriberPaywallSurface,
  expectOnLearnerApp,
  PLACEHOLDER_COPY_RE,
} from "../helpers/paid-user-suite";

test.describe("Paid subscriber — full journey", () => {
  test("homepage → dashboard → lessons → practice → flashcards → billing", async ({ page, baseURL }) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";
    const appOrigin = new URL(origin).origin;
    const guards = attachPaidUserStandardGuards(page, appOrigin);

    try {
      await test.step("Homepage (signed-in marketing shell)", async () => {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await assertNoMissingI18nDomTokens(page);
        const body = await page.locator("body").innerText();
        expect(body.length).toBeGreaterThan(80);
        expect(PLACEHOLDER_COPY_RE.test(body)).toBe(false);
      });

      await test.step("Learner dashboard", async () => {
        const dash = page.getByRole("link", { name: /dashboard/i }).first();
        await expect(dash).toBeVisible({ timeout: 30_000 });
        await dash.click();
        await page.waitForURL(/\/app(\/|$)/, { timeout: 30_000 });
        await expectOnLearnerApp(page);
        await expectNoSubscriberPaywallSurface(page, "/app");
        await assertNoMissingI18nDomTokens(page);
        const hub = await page.locator("main").innerText();
        expect(hub.length).toBeGreaterThan(80);
      });

      await test.step("Lessons index", async () => {
        await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectNoSubscriberPaywallSurface(page, "/app/lessons");
        const lessonLinks = page.locator('a[href^="/app/lessons/"]');
        await expect(lessonLinks.first()).toBeVisible({ timeout: 120_000 });
      });

      await test.step("Premium lesson — full content (not preview-only)", async () => {
        const first = page.locator('a[href^="/app/lessons/"]').first();
        const href = await first.getAttribute("href");
        expect(href).toBeTruthy();
        await first.click();
        await page.waitForLoadState("domcontentloaded");
        expectNotLoginUrl(page);
        await expectNoSubscriberPaywallSurface(page, "lesson detail");
        await assertNoMissingI18nDomTokens(page);

        const mainText = await page.locator("main").innerText();
        expect(mainText.length).toBeGreaterThan(120);
        expect(PLACEHOLDER_COPY_RE.test(mainText)).toBe(false);

        await expect(page.locator('aside[aria-label="Lesson access"]').getByText(/^Preview only$/i)).toHaveCount(0);
      });

      await test.step("Practice — answer several items; rationales visible", async () => {
        await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectNoSubscriberPaywallSurface(page, "/app/questions");
        await assertNoMissingI18nDomTokens(page);

        await page.getByRole("heading", { name: /^Question bank$/i }).scrollIntoViewIfNeeded();
        await expect(page.getByRole("button", { name: /^Check answer$/i })).toBeVisible({ timeout: 120_000 });

        for (let i = 0; i < 4; i++) {
          await answerOneQuestionBankItem(page);
        }
      });

      await test.step("Flashcards — study loop", async () => {
        await page.goto("/app/flashcards", { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectNoSubscriberPaywallSurface(page, "/app/flashcards");

        const learnFirst = page.locator('a[href*="/app/flashcards/"][href*="mode=learn"]').first();
        await expect(learnFirst).toBeVisible({ timeout: 120_000 });
        const deckHref = await learnFirst.getAttribute("href");
        expect(deckHref).toBeTruthy();
        await page.goto(deckHref!, { waitUntil: "domcontentloaded" });
        await dismissFlashcardResumeIfPresent(page);

        const reveal = page.getByRole("button", { name: /reveal answer/i });
        const nextCard = page.getByRole("button", { name: /^Next$/i });

        for (let i = 0; i < 3; i++) {
          await expect(reveal).toBeVisible({ timeout: 120_000 });
          await reveal.click();
          await expect(page.locator("aside").filter({ hasText: /rationale/i }).first()).toBeVisible({
            timeout: 15_000,
          });
          if (i < 2) {
            await expect(nextCard).toBeEnabled({ timeout: 10_000 });
            await nextCard.click();
            await page.waitForTimeout(400);
          }
        }
      });

      await test.step("Account — subscription & billing", async () => {
        await page.goto("/app/account/billing", { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectNoSubscriberPaywallSurface(page, "/app/account/billing");
        await expect(page.getByRole("heading", { name: /subscription & billing/i })).toBeVisible({ timeout: 30_000 });
        const main = await page.locator("main").innerText();
        expect(main.length).toBeGreaterThan(40);
      });

      await test.step("Console, i18n, network, and /api contract", async () => {
        assertPaidUserGuardsClean({
          tag: "[paid-user-journey]",
          routeLabel: "final",
          observers: guards.observers,
          apiViolations: guards.apiObserver.violations,
          pageUrl: page.url(),
        });
      });
    } finally {
      guards.dispose();
    }
  });
});
