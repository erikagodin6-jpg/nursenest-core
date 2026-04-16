/**
 * Paid RN learner surfaces — lessons (sample), flashcards, adaptive CAT — real routes, no mocks.
 *
 * Requires: `QA_PAID_EMAIL` + `QA_PAID_PASSWORD` (or `E2E_PAID_*` / `PLAYWRIGHT_TEST_*`).
 *
 * Run (extended smoke config includes `tests/e2e/smoke`):
 *   cd nursenest-core && npm run qa:smoke:extended -- tests/e2e/smoke/rn-full-content-access.spec.ts
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers, type PageObservers } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  learnerAppMainLandmark,
  waitForAuthenticatedLearnerShell,
} from "../helpers/paid-learner-shell";
import {
  LESSON_HUB_CARD_LINKS,
  paidFlashcardsHubUrl,
  paidLessonsHubUrl,
  paidQuestionsHubUrl,
} from "../helpers/paid-content-discovery";
import { expectNoSubscriptionPaywall, expectOnPaidSubscriberApp } from "../helpers/paid-surface-assertions";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  attachSlowRequestTap,
  buildCaptureFromObservers,
  type SmokeCapture,
} from "../helpers/smoke-evidence";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { dismissFlashcardResumeIfPresent } from "../helpers/paid-user-suite";

test.use({ storageState: { cookies: [], origins: [] } });

const LESSON_SAMPLE_MAX = 15;
const MAIN_MIN_CHARS = 80;
const CAT_START_TEST = "[data-nn-qa-practice-hub-start-test]";

test.describe.configure({ timeout: 900_000 });

async function answerOneCatItem(page: Page): Promise<void> {
  const list = page.locator("ul.nn-cat-opt-list").first();
  await expect(list).toBeVisible({ timeout: 120_000 });
  const mcBtn = list.locator("button.nn-cat-opt");
  const sataLabel = list.locator("label.nn-cat-opt");
  if ((await mcBtn.count()) > 0) {
    await mcBtn.first().click();
  } else if ((await sataLabel.count()) > 0) {
    await sataLabel.first().click();
  } else {
    throw new Error("No CAT answer options found (expected MC or SATA controls).");
  }
  const next = page.getByRole("button", { name: /Next question|Submit & finish/ });
  await expect(next).toBeEnabled({ timeout: 30_000 });
  await next.click();
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
}

function baseOriginFrom(page: Page, baseURL: string | undefined): string {
  if (baseURL) {
    try {
      return new URL(baseURL).origin;
    } catch {
      /* fall through */
    }
  }
  try {
    return new URL(page.url()).origin;
  } catch {
    return "http://127.0.0.1:3000";
  }
}

async function attachFailureDiagnostics(
  testInfo: import("@playwright/test").TestInfo,
  page: Page,
  observers: PageObservers,
  slowMs: { url: string; ms: number }[],
): Promise<void> {
  await attachSmokeFailureScreenshot(page, testInfo, "rn-full-content-access-failure.png");
  await testInfo.attach("rn-full-content-access-failure.json", {
    body: Buffer.from(
      JSON.stringify(
        {
          currentUrl: page.url(),
          consoleErrors: observers.consoleErrors,
          failedRequests: observers.failedRequests,
          slowRequestsOver3s: slowMs,
        },
        null,
        2,
      ),
      "utf-8",
    ),
    contentType: "application/json",
  });
}

test.describe("RN full content access (paid)", () => {
  test("login → lessons sample → flashcards → question bank → CAT", async ({ page, baseURL }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

    const slowMs: { url: string; ms: number }[] = [];
    const origin = baseOriginFrom(page, baseURL);
    const disposeSlow = attachSlowRequestTap(page, origin, slowMs, 3000);

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });

    const assertCleanObservers = (label: string): void => {
      expect(observers.consoleErrors, `[${label}] console: ${observers.consoleErrors.join(" | ")}`).toEqual([]);
      expect(observers.failedRequests, `[${label}] network: ${observers.failedRequests.join(" | ")}`).toEqual([]);
    };

    try {
      await test.step("Login", async () => {
        await loginWithCredentials(page, creds!.email, creds!.password);
        await expectOnPaidSubscriberApp(page);
        expect(page.url(), "not stuck on /login").not.toMatch(/\/login/i);
      });

      await test.step("Lessons hub + sample lesson URLs", async () => {
        await page.goto(paidLessonsHubUrl(PAID_E2E_DEFAULT_PATHWAY_ID), { waitUntil: "domcontentloaded" });
        await waitForAuthenticatedLearnerShell(page);
        await expectNoSubscriptionPaywall(page, "lessons hub");

        const mainLandmark = learnerAppMainLandmark(page);
        await expect(mainLandmark).toBeVisible({ timeout: 120_000 });
        const hubText = await mainLandmark.innerText().catch(() => "");
        expect(hubText.length, "lessons hub main not empty").toBeGreaterThan(MAIN_MIN_CHARS);

        const linkLoc = page.locator(LESSON_HUB_CARD_LINKS);
        await expect(linkLoc.first()).toBeVisible({ timeout: 120_000 });
        const n = Math.min(LESSON_SAMPLE_MAX, await linkLoc.count());
        expect(n, "at least one lesson link").toBeGreaterThan(0);

        const hrefs: string[] = [];
        for (let i = 0; i < n; i++) {
          const href = await linkLoc.nth(i).getAttribute("href");
          if (!href) continue;
          try {
            hrefs.push(new URL(href, page.url()).href);
          } catch {
            /* skip bad href */
          }
        }
        const unique = [...new Set(hrefs)];
        const toVisit = unique.slice(0, LESSON_SAMPLE_MAX);

        for (let i = 0; i < toVisit.length; i++) {
          const url = toVisit[i]!;
          await page.goto(url, { waitUntil: "domcontentloaded" });
          await waitForAuthenticatedLearnerShell(page).catch(() => {});
          await expectNoSubscriptionPaywall(page, `lesson ${i + 1}`);

          const m = learnerAppMainLandmark(page);
          await expect(m).toBeVisible({ timeout: 90_000 });
          const body = await m.innerText().catch(() => "");
          expect(body.length, `lesson main has body (${url})`).toBeGreaterThan(MAIN_MIN_CHARS);

          const loading = page.locator('[data-loading="true"], [aria-busy="true"]').filter({ visible: true });
          const stillLoading = await loading.count().catch(() => 0);
          expect(stillLoading, "no stuck global loading aria on lesson").toBe(0);

          assertCleanObservers(`lesson-${i + 1}`);
        }
      });

      await test.step("Flashcards", async () => {
        await page.goto(paidFlashcardsHubUrl(PAID_E2E_DEFAULT_PATHWAY_ID), { waitUntil: "domcontentloaded" });
        await waitForAuthenticatedLearnerShell(page);
        await expectNoSubscriptionPaywall(page, "flashcards hub");

        const mainLandmark = learnerAppMainLandmark(page);
        await expect(mainLandmark).toBeVisible({ timeout: 120_000 });

        const learnFirst = page.locator('a[href*="/app/flashcards/"][href*="mode=learn"]').first();
        await expect(learnFirst).toBeVisible({ timeout: 120_000 });
        const deckHref = await learnFirst.getAttribute("href");
        expect(deckHref).toBeTruthy();

        await page.goto(deckHref!, { waitUntil: "domcontentloaded" });
        await dismissFlashcardResumeIfPresent(page);

        const cardSurface = page.locator(".nn-learner-app main, main").first();
        await expect(cardSurface).toBeVisible({ timeout: 120_000 });
        const cardText0 = (await cardSurface.innerText().catch(() => "")).trim();
        expect(cardText0.length, "flashcard surface renders text (at least one card)").toBeGreaterThan(20);

        const reveal = page.getByRole("button", { name: /^Reveal answer$/i });
        if (await reveal.isVisible().catch(() => false)) {
          await reveal.click();
          await expect(cardSurface).toBeVisible({ timeout: 15_000 });
        }
        const nextNav = page.getByRole("button", { name: "Next", exact: true });
        if (await nextNav.isEnabled().catch(() => false)) {
          await nextNav.click();
        }

        assertCleanObservers("flashcards");
      });

      await test.step("Question bank (/app/questions)", async () => {
        await page.goto(paidQuestionsHubUrl(PAID_E2E_DEFAULT_PATHWAY_ID), { waitUntil: "domcontentloaded" });
        await waitForAuthenticatedLearnerShell(page);
        await expectNoSubscriptionPaywall(page, "questions hub");

        const mainLandmark = learnerAppMainLandmark(page);
        await expect(mainLandmark).toBeVisible({ timeout: 120_000 });

        const stemish = mainLandmark.locator("p, article, section, .nn-marketing-body-sm").first();
        await expect(stemish).toBeVisible({ timeout: 120_000 });

        const firstPick = page.locator(".nn-qopt-list").first().locator("button, label").first();
        if (await firstPick.isVisible().catch(() => false)) {
          await firstPick.click();
          const check = page.getByRole("button", { name: /^Check answer$/i });
          if (await check.isVisible().catch(() => false)) {
            await check.click();
          }
        }

        await expect(mainLandmark).toBeVisible({ timeout: 60_000 });
        assertCleanObservers("questions");
      });

      await test.step("CAT exam (adaptive practice test)", async () => {
        await page.goto(
          `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`,
          { waitUntil: "domcontentloaded" },
        );
        await waitForAuthenticatedLearnerShell(page);
        await expectNoSubscriptionPaywall(page, "CAT hub");

        await expect(page.locator(CAT_START_TEST)).toBeVisible({ timeout: 60_000 });
        await page.locator(CAT_START_TEST).click();
        await expect(page.getByRole("button", { name: /^Begin exam$/i })).toBeVisible({ timeout: 15_000 });
        await page.getByRole("button", { name: /^Begin exam$/i }).click();
        await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });

        await expect(page.locator(".nn-cat-question-stem, .nn-marketing-body-sm").first()).toBeVisible({
          timeout: 120_000,
        });

        await answerOneCatItem(page);
        assertCleanObservers("cat");
      });

      const capture: SmokeCapture = {
        ...buildCaptureFromObservers(page, observers, { slowRequestsMs: slowMs }),
      };
      await attachSmokeCapture(testInfo, "rn-full-content-access", capture);
    } catch (e) {
      await attachFailureDiagnostics(testInfo, page, observers, slowMs);
      throw e;
    } finally {
      disposeSlow();
      observers.dispose();
    }
  });
});
