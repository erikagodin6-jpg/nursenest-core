/**
 * **API / network health** — same-origin fetch/XHR monitoring on a **minimal** authenticated path
 * (no duplicate of the full journey). Touches core API prefixes: lessons, questions, flashcards.
 *
 * Slow / failing requests are attached for triage. Not a substitute for `paid-user-journey` UI assertions.
 *
 * @see ../helpers/paid-user-suite.ts
 */
import { expect, test, type Page } from "@playwright/test";
import {
  attachPaidSessionNetworkMonitor,
  PAID_SESSION_SLOW_MS,
} from "../helpers/paid-session-network-monitor";
import {
  paidFlashcardsHubUrl,
  paidLessonsHubUrl,
  paidQuestionsHubUrl,
} from "../helpers/paid-content-discovery";
import { expectPaidLearnerShellReady } from "../helpers/paid-learner-shell";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";

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
}

test.describe("Paid user — API / network health (focused)", () => {
  test("minimal navigation + one bank check + one flashcard reveal (monitored)", async ({ page, baseURL }, testInfo) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";
    const appOrigin = new URL(origin).origin;
    const net = attachPaidSessionNetworkMonitor(page, appOrigin);

    try {
      await test.step("/app — shell", async () => {
        await page.goto("/app", { waitUntil: "domcontentloaded" });
        assertNotLogin(page.url());
        await expectPaidLearnerShellReady(page, "api-health /app");
        await assertNoPaywallOrUpgradeCopy(page, "/app");
      });

      await test.step("Lessons hub + one lesson", async () => {
        await page.goto(paidLessonsHubUrl(), { waitUntil: "domcontentloaded" });
        assertNotLogin(page.url());
        await assertNoPaywallOrUpgradeCopy(page, "/app/lessons");
        const first = page.locator('a[href^="/app/lessons/"]').first();
        await expect(first).toBeVisible({ timeout: 120_000 });
        await first.click();
        await page.waitForLoadState("domcontentloaded");
        assertNotLogin(page.url());
        await assertNoPaywallOrUpgradeCopy(page, "lesson detail");
        expect(await page.locator("main").innerText().then((t) => t.length)).toBeGreaterThan(120);
      });

      await test.step("Questions — one answered (API + rationale)", async () => {
        await page.goto(paidQuestionsHubUrl(), { waitUntil: "domcontentloaded" });
        assertNotLogin(page.url());
        await assertNoPaywallOrUpgradeCopy(page, "/app/questions");
        await page.getByRole("heading", { name: /^Question bank$/i }).scrollIntoViewIfNeeded();
        await expect(page.getByRole("button", { name: /^Check answer$/i })).toBeVisible({ timeout: 120_000 });
        await answerOneBankQuestion(page);
      });

      await test.step("Flashcards — one reveal in learn mode", async () => {
        await page.goto(paidFlashcardsHubUrl(), { waitUntil: "domcontentloaded" });
        assertNotLogin(page.url());
        await assertNoPaywallOrUpgradeCopy(page, "/app/flashcards");

        const learnFirst = page.locator('a[href*="/app/flashcards/"][href*="mode=learn"]').first();
        await expect(learnFirst).toBeVisible({ timeout: 120_000 });
        const deckHref = await learnFirst.getAttribute("href");
        expect(deckHref).toBeTruthy();
        await page.goto(deckHref!, { waitUntil: "domcontentloaded" });
        await dismissFlashcardResumeIfPresent(page);

        const reveal = page.getByRole("button", { name: /reveal answer/i });
        await expect(reveal).toBeVisible({ timeout: 120_000 });
        await reveal.click();
        await expect(page.locator("aside").filter({ hasText: /rationale/i }).first()).toBeVisible({
          timeout: 15_000,
        });
      });

      await test.step("Network audit assertions", async () => {
        if (net.slowRequests.length > 0) {
          await testInfo.attach("slow-endpoints.txt", {
            body: net.formatSlowLog(),
            contentType: "text/plain",
          });
          // eslint-disable-next-line no-console
          console.log(
            `[paid-user-api-health] Slow same-origin fetch/XHR (>${PAID_SESSION_SLOW_MS}ms):\n${net.formatSlowLog()}`,
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
