/**
 * Entitlement enforcement: premium URLs with paid session vs anonymous (cleared storage).
 *
 * Requires `chromium-paid` + `E2E_PAID_EMAIL` / `E2E_PAID_PASSWORD` (or `PLAYWRIGHT_TEST_*`).
 *
 * Run:
 *   cd nursenest-core && E2E_PAID_EMAIL=... E2E_PAID_PASSWORD=... npx playwright test tests/e2e/paid-user/paid-user-entitlement-downgrade.spec.ts --project=chromium-paid
 */
import { expect, test, type Page } from "@playwright/test";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";

async function dismissFlashcardResumeIfPresent(page: Page) {
  const startFresh = page.getByRole("button", { name: /^Start fresh$/i });
  if (await startFresh.isVisible().catch(() => false)) {
    await startFresh.click();
    await page.waitForTimeout(300);
  }
}

async function expectLearnerSignInGate(page: Page) {
  await expect(page.getByRole("link", { name: /sign in/i }).first()).toBeVisible({ timeout: 30_000 });
}

/** No premium question UI (stem / bank shell) when session is missing. */
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

async function captureQuestionIdFromBank(page: Page): Promise<string> {
  let captured: string | null = null;
  const handler = async (resp: import("@playwright/test").Response) => {
    if (captured) return;
    let pathname = "";
    try {
      pathname = new URL(resp.url()).pathname;
    } catch {
      return;
    }
    if (pathname !== "/api/questions") return;
    if (resp.request().method() !== "GET") return;
    if (resp.status() !== 200) return;
    try {
      const data = (await resp.json()) as { questions?: Array<{ id?: string }> };
      const id = data.questions?.[0]?.id;
      if (typeof id === "string" && id.length >= 8) captured = id;
    } catch {
      /* ignore parse errors */
    }
  };
  page.on("response", handler);
  try {
    await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
    for (let i = 0; i < 90 && !captured; i++) {
      await page.waitForTimeout(200);
    }
    if (!captured) {
      throw new Error("Timed out waiting for GET /api/questions with at least one question id.");
    }
    return captured;
  } finally {
    page.off("response", handler);
  }
}

test.describe("Paid entitlement vs anonymous downgrade", () => {
  test.describe.configure({ mode: "serial" });

  test("premium URLs: full access when subscribed; blocked when session cleared", async ({ page, baseURL }) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";

    const lessonUrl: string = await test.step("Discover lesson URL (paid)", async () => {
      await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "/app/lessons");
      const href = await page.locator('a[href^="/app/lessons/"]').first().getAttribute("href");
      expect(href, "Expected at least one lesson link").toBeTruthy();
      const u = new URL(href!, origin);
      return `${u.pathname}${u.search}`;
    });

    const questionId: string = await test.step("Discover question id (paid)", async () => captureQuestionIdFromBank(page));

    const flashcardDeckUrl: string = await test.step("Discover flashcard deck URL (paid)", async () => {
      await page.goto("/app/flashcards", { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "/app/flashcards");
      const learn = page.locator('a[href*="/app/flashcards/"][href*="mode=learn"]').first();
      await expect(learn).toBeVisible({ timeout: 120_000 });
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
