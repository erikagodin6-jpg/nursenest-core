/**
 * **Mobile paid-user smoke** — realistic viewport (iPhone-class), critical flows without desktop-only layout.
 *
 * Lighter than the full navigation audit; focuses on touch targets, premium surfaces, and guardrails.
 *
 * Run:
 *   cd nursenest-core && npx playwright test tests/e2e/paid-user/paid-user-mobile.spec.ts --project=chromium-paid
 *
 * @see ../helpers/paid-user-suite.ts
 */
import { expect, test } from "@playwright/test";
import {
  answerOneQuestionBankItem,
  assertPaidUserGuardsClean,
  attachPaidUserStandardGuards,
  assertNoMissingI18nDomTokens,
  dismissFlashcardResumeIfPresent,
  expectNotLoginUrl,
  expectNoSubscriberPaywallSurface,
  expectOnLearnerApp,
} from "../helpers/paid-user-suite";
import { openMobileNavMenu, learnerMobileDrawerStudyLinks } from "../helpers/nav-primary-audit";

test.describe("Paid user — mobile smoke", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("dashboard, drawer nav, premium lesson, practice — tappable, no paywall", async ({ page, baseURL }) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";
    const appOrigin = new URL(origin).origin;
    const guards = attachPaidUserStandardGuards(page, appOrigin);

    try {
      await test.step("Learner dashboard", async () => {
        await page.goto("/app", { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectOnLearnerApp(page);
        await expectNoSubscriberPaywallSurface(page, "/app");
        await assertNoMissingI18nDomTokens(page);
        await expect(page.locator("main")).toBeVisible({ timeout: 30_000 });
        const hub = await page.locator("main").innerText();
        expect(hub.trim().length).toBeGreaterThan(40);
      });

      await test.step("Drawer — open menu and follow first study link", async () => {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await expect(page.locator('[data-nn-nav-mode="learner"]')).toBeVisible({ timeout: 30_000 });
        await openMobileNavMenu(page);
        const links = learnerMobileDrawerStudyLinks(page);
        await expect(links.first()).toBeVisible({ timeout: 15_000 });
        const href = await links.first().getAttribute("href");
        expect(href).toBeTruthy();
        await links.first().click();
        await page.waitForLoadState("domcontentloaded");
        expectNotLoginUrl(page);
        await expect(page.locator("main")).toBeVisible({ timeout: 30_000 });
        const txt = await page.locator("main").innerText();
        expect(txt.trim().length).toBeGreaterThan(40);
      });

      await test.step("Premium lesson — first /app/lessons/* link", async () => {
        await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectNoSubscriberPaywallSurface(page, "/app/lessons");
        const first = page.locator('a[href^="/app/lessons/"]').first();
        await expect(first).toBeVisible({ timeout: 120_000 });
        await first.click();
        await page.waitForLoadState("domcontentloaded");
        expectNotLoginUrl(page);
        await expectNoSubscriberPaywallSurface(page, "lesson mobile");
        await assertNoMissingI18nDomTokens(page);
        const mainText = await page.locator("main").innerText();
        expect(mainText.length).toBeGreaterThan(120);
        await expect(page.locator('aside[aria-label="Lesson access"]').getByText(/^Preview only$/i)).toHaveCount(0);
      });

      await test.step("Practice — one bank item (rationale visible; controls not obscured)", async () => {
        await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectNoSubscriberPaywallSurface(page, "/app/questions");
        await page.getByRole("heading", { name: /^Question bank$/i }).scrollIntoViewIfNeeded();
        await answerOneQuestionBankItem(page);
      });

      await test.step("Bottom nav — links in viewport and tappable", async () => {
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
        await page.goto("/app/flashcards", { waitUntil: "domcontentloaded" });
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

      await test.step("Console, i18n, network guards", async () => {
        assertPaidUserGuardsClean({
          tag: "[paid-user-mobile]",
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
