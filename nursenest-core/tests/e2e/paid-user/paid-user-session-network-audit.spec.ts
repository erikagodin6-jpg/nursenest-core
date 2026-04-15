/**
 * Paid session: track every same-origin `fetch` / XHR for status, latency, and transport failures.
 *
 * Fails if any response is 4xx/5xx, any tracked request exceeds 3s, or a critical API path errors.
 * Slow endpoints are attached as `slow-endpoints.txt` for triage.
 *
 * Requires stored auth + `--project=chromium-paid` (see `paid-user-full-journey.spec.ts`).
 */
import { expect, test, type Page } from "@playwright/test";
import {
  attachPaidSessionNetworkMonitor,
  PAID_SESSION_SLOW_MS,
} from "../helpers/paid-session-network-monitor";
import { expectNoSubscriptionPaywall, expectOnLearnerApp } from "../helpers/paid-surface-assertions";

function assertNotLogin(url: string) {
  expect(url, "Unexpected redirect to /login").not.toMatch(/\/login/i);
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
  await expect(main.getByRole("button", { name: /^Upgrade$/i })).toHaveCount(0);
  await expect(main.getByRole("link", { name: /^Upgrade to unlock/i })).toHaveCount(0);
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

test.describe("Paid user session — network audit", () => {
  test("full learner journey with fetch/XHR monitoring (no 4xx/5xx, no >3s, critical APIs OK)", async ({
    page,
    baseURL,
  }, testInfo) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";
    const appOrigin = new URL(origin).origin;
    const net = attachPaidSessionNetworkMonitor(page, appOrigin);

    try {
      await test.step("Homepage (signed-in)", async () => {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        assertNotLogin(page.url());
        const body = await page.locator("body").innerText();
        expect(body.length).toBeGreaterThan(80);
      });

      await test.step("Learner dashboard", async () => {
        const dash = page.getByRole("link", { name: /dashboard/i }).first();
        await expect(dash).toBeVisible({ timeout: 30_000 });
        await dash.click();
        await page.waitForURL(/\/app(\/|$)/, { timeout: 30_000 });
        await expectOnLearnerApp(page);
        await assertNoPaywallOrUpgradeCopy(page, "/app");
        expect(await page.locator("main").innerText().then((t) => t.length)).toBeGreaterThan(80);
      });

      await test.step("Lessons hub + open a lesson", async () => {
        await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
        assertNotLogin(page.url());
        await assertNoPaywallOrUpgradeCopy(page, "/app/lessons");
        const lessonLinks = page.locator('a[href^="/app/lessons/"]');
        await expect(lessonLinks.first()).toBeVisible({ timeout: 120_000 });

        const first = lessonLinks.first();
        const href = await first.getAttribute("href");
        expect(href).toBeTruthy();
        await first.click();
        await page.waitForLoadState("domcontentloaded");
        assertNotLogin(page.url());
        await assertNoPaywallOrUpgradeCopy(page, "lesson detail");
        expect(await page.locator("main").innerText().then((t) => t.length)).toBeGreaterThan(120);
        await expect(page.locator('aside[aria-label="Lesson access"]').getByText(/^Preview only$/i)).toHaveCount(0);
      });

      await test.step("Practice: answer 4 questions", async () => {
        await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
        assertNotLogin(page.url());
        await assertNoPaywallOrUpgradeCopy(page, "/app/questions");
        await page.getByRole("heading", { name: /^Question bank$/i }).scrollIntoViewIfNeeded();
        await expect(page.getByRole("button", { name: /^Check answer$/i })).toBeVisible({ timeout: 120_000 });
        for (let i = 0; i < 4; i++) {
          await answerOneBankQuestion(page);
        }
      });

      await test.step("Flashcards: 3 flips in learn mode", async () => {
        await page.goto("/app/flashcards", { waitUntil: "domcontentloaded" });
        assertNotLogin(page.url());
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

      await test.step("Account / billing", async () => {
        await page.goto("/app/account/billing", { waitUntil: "domcontentloaded" });
        assertNotLogin(page.url());
        await assertNoPaywallOrUpgradeCopy(page, "/app/account/billing");
        await expect(page.getByRole("heading", { name: /subscription & billing/i })).toBeVisible({
          timeout: 30_000,
        });
        expect(await page.locator("main").innerText().then((t) => t.length)).toBeGreaterThan(40);
      });

      await test.step("Network audit assertions", async () => {
        if (net.slowRequests.length > 0) {
          await testInfo.attach("slow-endpoints.txt", {
            body: net.formatSlowLog(),
            contentType: "text/plain",
          });
          // eslint-disable-next-line no-console
          console.log(
            `[paid-session-network-audit] Slow same-origin fetch/XHR (>${PAID_SESSION_SLOW_MS}ms):\n${net.formatSlowLog()}`,
          );
        }

        if (net.criticalFailures.length > 0) {
          await testInfo.attach("critical-api-failures.txt", {
            body: net.criticalFailures.join("\n"),
            contentType: "text/plain",
          });
        }

        const failures = net.buildFailureMessages();
        expect(
          failures,
          `Same-origin fetch/XHR issues (status 4xx/5xx, slow >${PAID_SESSION_SLOW_MS}ms, or network error):\n${failures.join("\n")}`,
        ).toEqual([]);
      });
    } finally {
      net.dispose();
    }
  });
});
