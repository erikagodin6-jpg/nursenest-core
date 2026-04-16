/**
 * Canonical **full subscriber UI journey** (desktop): dashboard → lessons → premium lesson → practice → flashcards → billing.
 * Marketing homepage is intentionally omitted here — covered by public E2E and fast-sanity focuses on speed.
 *
 * Uses `tests/e2e/.auth/paid-user.json` via `--project=chromium-paid` (no UI login per run).
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
import { assertCoreLearnerDurability } from "../helpers/paid-durability";
import { expectPaidLearnerShellReady } from "../helpers/paid-learner-shell";
import {
  assertNoMissingI18nDomTokens,
  assertPaidUserGuardsClean,
  attachPaidUserStandardGuards,
  dismissFlashcardResumeIfPresent,
  answerOneQuestionBankItem,
  expectNotLoginUrl,
  expectNoSubscriberPaywallSurface,
  PLACEHOLDER_COPY_RE,
} from "../helpers/paid-user-suite";

test.describe("Paid subscriber — full journey", () => {
  test("dashboard → lessons → practice → flashcards → billing", async ({ page, baseURL }, testInfo) => {
    const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    const guards = attachPaidUserStandardGuards(page, appOrigin);

    try {
      await test.step("Learner dashboard", async () => {
        await page.goto("/app", { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectPaidLearnerShellReady(page, "journey /app");
        await expectNoSubscriberPaywallSurface(page, "/app");
        await assertNoMissingI18nDomTokens(page);
        const hub = await page.locator("main").innerText();
        expect(hub.length).toBeGreaterThan(80);
        await assertCoreLearnerDurability(page, "journey dashboard");
      });

      await test.step("Lessons index (pathway-scoped)", async () => {
        await page.goto(paidLessonsHubUrl(), { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectPaidLearnerShellReady(page, "journey /app/lessons");
        await expectNoSubscriberPaywallSurface(page, "/app/lessons");
        const lessonLinks = page.locator(LESSON_HUB_CARD_LINKS);
        await expect(lessonLinks.first()).toBeVisible({ timeout: 120_000 });
        await assertCoreLearnerDurability(page, "journey lessons hub");
      });

      await test.step("Premium lesson — full content (not preview-only)", async () => {
        const first = page.locator(LESSON_HUB_CARD_LINKS).first();
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

      await test.step("Practice — answer 2 items; rationales visible", async () => {
        await page.goto(paidQuestionsHubUrl(), { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectNoSubscriberPaywallSurface(page, "/app/questions");
        await assertNoMissingI18nDomTokens(page);

        await page.getByRole("heading", { name: /^Question bank$/i }).scrollIntoViewIfNeeded();
        await expect(page.getByRole("button", { name: /^Check answer$/i })).toBeVisible({ timeout: 120_000 });

        for (let i = 0; i < 2; i++) {
          await answerOneQuestionBankItem(page);
        }
      });

      await test.step("Flashcards — study loop", async () => {
        await page.goto(paidFlashcardsHubUrl(), { waitUntil: "domcontentloaded" });
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

        for (let i = 0; i < 2; i++) {
          await expect(reveal).toBeVisible({ timeout: 120_000 });
          await reveal.click();
          await expect(page.locator("aside").filter({ hasText: /rationale/i }).first()).toBeVisible({
            timeout: 15_000,
          });
          if (i < 1) {
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

      await test.step("Core durability + console, network, /api contract", async () => {
        await assertCoreLearnerDurability(page, "journey pre-guards");
        assertPaidUserGuardsClean({
          tag: "[paid-user-journey]",
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
