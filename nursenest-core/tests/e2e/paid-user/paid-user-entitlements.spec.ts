/**
 * **Entitlements:** premium URLs with paid session vs anonymous (cleared storage).
 *
 * @see ../helpers/paid-user-suite.ts
 */
import { expect, test, type Page } from "@playwright/test";
import {
  captureQuestionIdFromBankApi,
  expectAtLeastOneFlashcardLearnLink,
  expectAtLeastOneLessonLink,
  paidFlashcardsHubUrl,
  paidLessonsHubUrl,
} from "../helpers/paid-content-discovery";
import { dismissFlashcardResumeIfPresent } from "../helpers/paid-user-suite";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";

async function expectLearnerSignInGate(page: Page) {
  await expect(page.getByRole("link", { name: /sign in/i }).first()).toBeVisible({ timeout: 30_000 });
}

async function expectNoPremiumQuestionSurface(page: Page) {
  await expect(page.locator(".nn-question-stem")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Check answer$/i })).toHaveCount(0);
}

async function clearAuthSession(page: Page, baseURL: string) {
  await page.context().clearCookies();
  await page.goto(baseURL.replace(/\/$/, ""));
  await page.evaluate(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
  });
}

test.describe("Paid entitlements vs anonymous downgrade", () => {
  test.describe.configure({ mode: "serial" });

  test("premium URLs: full access when subscribed; blocked when session cleared", async ({ page, baseURL }) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";

    const lessonUrl: string = await test.step("Discover lesson URL (paid)", async () => {
      await page.goto(paidLessonsHubUrl(), { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "/app/lessons");
      await expectAtLeastOneLessonLink(page);
      const href = await page.locator('a[href^="/app/lessons/"]').first().getAttribute("href");
      expect(href, "Expected at least one lesson link").toBeTruthy();
      const u = new URL(href!, origin);
      return `${u.pathname}${u.search}`;
    });

    const questionId: string = await test.step("Discover question id (paid)", async () => captureQuestionIdFromBankApi(page));

    const flashcardDeckUrl: string = await test.step("Discover flashcard deck URL (paid)", async () => {
      await page.goto(paidFlashcardsHubUrl(), { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "/app/flashcards");
      await expectAtLeastOneFlashcardLearnLink(page);
      const learn = page.locator('a[href*="/app/flashcards/"][href*="mode=learn"]').first();
      const href = await learn.getAttribute("href");
      expect(href).toBeTruthy();
      const u = new URL(href!, origin);
      return `${u.pathname}${u.search}`;
    });

    const questionDirectUrl = `/app/questions?includeIds=${encodeURIComponent(questionId)}`;

    await test.step("Paid: premium lesson is fully accessible", async () => {
      await page.goto(`${origin}${lessonUrl}`, {
        waitUntil: "domcontentloaded",
      });
      expect(page.url()).not.toMatch(/\/login/i);
      await expectNoSubscriptionPaywall(page, "lesson direct");
      await expect(page.getByRole("heading", { name: /subscription required/i })).toHaveCount(0);
      const mainText = await page.locator("main").innerText();
      expect(mainText.length, "Lesson main should have substantial content").toBeGreaterThan(120);
      await expect(page.locator('aside[aria-label="Lesson access"]').getByText(/^Preview only$/i)).toHaveCount(0);
      await expect(page.locator("main").getByRole("link", { name: /^Upgrade to unlock/i })).toHaveCount(0);
    });

    await test.step("Paid: premium question via direct URL — rationale after check", async () => {
      await page.goto(`${origin}${questionDirectUrl}`, { waitUntil: "domcontentloaded" });
      expect(page.url()).not.toMatch(/\/login/i);
      await expectNoSubscriptionPaywall(page, "questions direct");
      await page.getByRole("heading", { name: /^Question bank$/i }).scrollIntoViewIfNeeded();
      const checkBtn = page.getByRole("button", { name: /^Check answer$/i });
      await expect(checkBtn).toBeVisible({ timeout: 120_000 });
      await expect(page.locator(".nn-question-stem").first()).toBeVisible({ timeout: 30_000 });

      const list = page.locator("ul.nn-qopt-list").first();
      const cb = list.locator('input[type="checkbox"]').first();
      if (await cb.isVisible().catch(() => false)) {
        await cb.click();
      } else {
        await list.locator("li > button").first().click();
      }
      await checkBtn.click();
      await expect(page.getByRole("status")).toBeVisible({ timeout: 30_000 });
      const rationale = page.locator(
        "aside.nn-question-session-rationale .nn-rationale-prose, aside.nn-question-session-rationale .nn-question-rationale-card__body",
      );
      await expect(rationale.first()).toBeVisible({ timeout: 30_000 });
      const rat = (await rationale.first().innerText()).trim();
      expect(rat.length, "Rationale should render for subscriber").toBeGreaterThan(20);
    });

    await test.step("Paid: flashcards deck direct URL — study surface", async () => {
      await page.goto(`${origin}${flashcardDeckUrl}`, {
        waitUntil: "domcontentloaded",
      });
      expect(page.url()).not.toMatch(/\/login/i);
      await expectNoSubscriptionPaywall(page, "flashcards deck");
      await dismissFlashcardResumeIfPresent(page);
      await expect(page.getByRole("button", { name: /reveal answer/i })).toBeVisible({ timeout: 120_000 });
    });

    await test.step("Clear storage (simulate downgrade)", async () => {
      await clearAuthSession(page, origin);
    });

    await test.step("Anonymous: premium lesson blocked (sign-in gate, no lesson shell)", async () => {
      await page.goto(`${origin}${lessonUrl}`, { waitUntil: "domcontentloaded" });
      await expectLearnerSignInGate(page);
      await expect(page.locator("main")).toHaveCount(0);
      await expect(page.getByRole("heading", { name: /subscription required/i })).toHaveCount(0);
    });

    await test.step("Anonymous: question URL blocked — no bank, no rationale", async () => {
      await page.goto(`${origin}${questionDirectUrl}`, { waitUntil: "domcontentloaded" });
      await expectLearnerSignInGate(page);
      await expectNoPremiumQuestionSurface(page);
    });

    await test.step("Anonymous: flashcards deck blocked", async () => {
      await page.goto(`${origin}${flashcardDeckUrl}`, { waitUntil: "domcontentloaded" });
      await expectLearnerSignInGate(page);
      await expect(page.getByRole("button", { name: /reveal answer/i })).toHaveCount(0);
    });
  });
});
