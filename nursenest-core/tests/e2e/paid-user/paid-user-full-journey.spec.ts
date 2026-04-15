/**
 * Full paid learner journey using stored auth (`tests/e2e/.auth/paid-user.json` from `setup-paid-auth`).
 *
 * Requires: `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` (or `PLAYWRIGHT_TEST_*`) and `--project=chromium-paid`.
 *
 * Run:
 *   cd nursenest-core && E2E_PAID_EMAIL=... E2E_PAID_PASSWORD=... npx playwright test tests/e2e/paid-user/paid-user-full-journey.spec.ts --project=chromium-paid
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { attachPaidJourneyApiObserver } from "../helpers/paid-journey-network";
import { expectNoSubscriptionPaywall, expectOnLearnerApp } from "../helpers/paid-surface-assertions";
import { logObserverFailureSummary } from "../helpers/log-observer-failure-summary";

const PLACEHOLDER_RE = /\b(TBD|null|undefined)\b/i;

function assertNotLogin(page: Page) {
  expect(page.url(), "Unexpected redirect to /login").not.toMatch(/\/login/i);
}

function assertNoMissingI18nTokens(page: Page) {
  return expect(page.locator("body")).not.toContainText("[missing:");
}

async function dismissFlashcardResumeIfPresent(page: Page) {
  const startFresh = page.getByRole("button", { name: /^Start fresh$/i });
  if (await startFresh.isVisible().catch(() => false)) {
    await startFresh.click();
    await page.waitForTimeout(300);
  }
}

async function assertNoPaywallOrUpgradeCopy(page: Page, context: string) {
  await expectNoSubscriptionPaywall(page, context);
  const main = page.locator("main");
  await expect(main.getByRole("heading", { name: /subscription required/i })).toHaveCount(0);
  // Scoped: common paywall CTA (avoid matching unrelated footer copy).
  await expect(main.getByRole("button", { name: /^Upgrade$/i })).toHaveCount(0);
  await expect(main.getByRole("link", { name: /^Upgrade to unlock/i })).toHaveCount(0);
}

function seriousConsoleLines(consoleErrors: string[]): string[] {
  return consoleErrors.filter((x) => !/cookie|Content Security Policy|third-party|analytics/i.test(x));
}

function i18nConsoleErrors(consoleErrors: string[]): string[] {
  return consoleErrors.filter(
    (x) =>
      /\[marketing-i18n\] missing key|\[nursenest-core\].*marketing_message_key_missing|missing key.*locale bundle/i.test(
        x,
      ),
  );
}

async function answerOneBankQuestion(page: Page) {
  const checkBtn = page.getByRole("button", { name: /^Check answer$/i });
  await expect(checkBtn).toBeVisible({ timeout: 120_000 });

  const list = page.locator("ul.nn-qopt-list").first();
  await expect(list).toBeVisible({ timeout: 15_000 });

  const firstCb = list.locator('input[type="checkbox"]').first();
  if (await firstCb.isVisible().catch(() => false)) {
    await firstCb.click();
  } else {
    await list.locator("li > button").first().click();
  }

  await expect(checkBtn).toBeEnabled({ timeout: 15_000 });
  await checkBtn.click();

  await expect(page.getByRole("status")).toBeVisible({ timeout: 30_000 });
  const rationaleBody = page.locator(
    "aside.nn-question-session-rationale .nn-rationale-prose, aside.nn-question-session-rationale .nn-question-rationale-card__body",
  );
  await expect(rationaleBody.first()).toBeVisible({ timeout: 30_000 });
  const ratText = await rationaleBody.first().innerText();
  expect(ratText.trim().length, "Rationale body should not be empty for paid bank items").toBeGreaterThan(20);

  const nextQ = page.locator("button.nn-question-nav-actions__next").filter({ hasText: /next question/i });
  if ((await nextQ.count()) > 0 && (await nextQ.isEnabled())) {
    await nextQ.click();
    await page.waitForTimeout(400);
  } else {
    const loadMore = page.getByRole("button", { name: /load more/i });
    if (await loadMore.isVisible().catch(() => false)) {
      await loadMore.click();
      await page.waitForTimeout(600);
    }
  }
}

test.describe("Paid user full journey", () => {
  test("homepage → dashboard → lessons → practice → flashcards → billing (paid)", async ({ page, baseURL }) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";
    const obs = attachPageObservers(page, { profile: "app" });
    const apiObs = attachPaidJourneyApiObserver(page, new URL(origin).origin);

    try {
      await test.step("Homepage (signed-in)", async () => {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        assertNotLogin(page);
        await assertNoMissingI18nTokens(page);
        const body = await page.locator("body").innerText();
        expect(body.length).toBeGreaterThan(80);
        expect(PLACEHOLDER_RE.test(body)).toBe(false);
      });

      await test.step("Navigate to learner dashboard", async () => {
        const dash = page.getByRole("link", { name: /dashboard/i }).first();
        await expect(dash).toBeVisible({ timeout: 30_000 });
        await dash.click();
        await page.waitForURL(/\/app(\/|$)/, { timeout: 30_000 });
        await expectOnLearnerApp(page);
        await assertNoPaywallOrUpgradeCopy(page, "/app");
        await assertNoMissingI18nTokens(page);
        const hub = await page.locator("main").innerText();
        expect(hub.length).toBeGreaterThan(80);
      });

      await test.step("Open lessons hub", async () => {
        await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
        assertNotLogin(page);
        await assertNoPaywallOrUpgradeCopy(page, "/app/lessons");
        const lessonLinks = page.locator('a[href^="/app/lessons/"]');
        await expect(lessonLinks.first()).toBeVisible({ timeout: 120_000 });
      });

      await test.step("Open a premium lesson and verify full content", async () => {
        const first = page.locator('a[href^="/app/lessons/"]').first();
        const href = await first.getAttribute("href");
        expect(href).toBeTruthy();
        await first.click();
        await page.waitForLoadState("domcontentloaded");
        assertNotLogin(page);
        await assertNoPaywallOrUpgradeCopy(page, "lesson detail");
        await assertNoMissingI18nTokens(page);

        const mainText = await page.locator("main").innerText();
        expect(mainText.length).toBeGreaterThan(120);
        expect(PLACEHOLDER_RE.test(mainText)).toBe(false);

        await expect(page.locator('aside[aria-label="Lesson access"]').getByText(/^Preview only$/i)).toHaveCount(0);
      });

      await test.step("Practice questions: answer 4 items and verify rationales", async () => {
        await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
        assertNotLogin(page);
        await assertNoPaywallOrUpgradeCopy(page, "/app/questions");
        await assertNoMissingI18nTokens(page);

        await page.getByRole("heading", { name: /^Question bank$/i }).scrollIntoViewIfNeeded();
        await expect(page.getByRole("button", { name: /^Check answer$/i })).toBeVisible({ timeout: 120_000 });

        for (let i = 0; i < 4; i++) {
          await answerOneBankQuestion(page);
        }
      });

      await test.step("Flashcards: flip at least 3 cards", async () => {
        await page.goto("/app/flashcards", { waitUntil: "domcontentloaded" });
        assertNotLogin(page);
        await assertNoPaywallOrUpgradeCopy(page, "/app/flashcards");

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

      await test.step("Account / subscription (billing)", async () => {
        await page.goto("/app/account/billing", { waitUntil: "domcontentloaded" });
        assertNotLogin(page);
        await assertNoPaywallOrUpgradeCopy(page, "/app/account/billing");
        await expect(page.getByRole("heading", { name: /subscription & billing/i })).toBeVisible({ timeout: 30_000 });
        const main = await page.locator("main").innerText();
        expect(main.length).toBeGreaterThan(40);
      });

      await test.step("Console, i18n, and API contract", async () => {
        const serious = seriousConsoleLines(obs.consoleErrors);
        const i18n = i18nConsoleErrors(obs.consoleErrors);
        expect(i18n, `i18n missing-key console errors:\n${i18n.join("\n")}`).toEqual([]);

        if (serious.length > 0 || obs.failedRequests.length > 0) {
          logObserverFailureSummary({
            tag: "[paid-full-journey]",
            routeLabel: "final",
            seriousConsole: serious,
            failedRequests: obs.failedRequests,
            pageUrl: page.url(),
          });
        }
        expect(serious, serious.slice(0, 8).join("\n")).toEqual([]);
        expect(obs.failedRequests, obs.failedRequests.slice(0, 8).join("\n")).toEqual([]);

        expect(apiObs.violations, apiObs.violations.join("\n")).toEqual([]);
      });
    } finally {
      apiObs.dispose();
      obs.dispose();
    }
  });
});
