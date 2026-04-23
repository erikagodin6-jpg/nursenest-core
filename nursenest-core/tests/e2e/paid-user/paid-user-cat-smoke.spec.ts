/**
 * **CAT / practice exam smoke** — start hub → begin exam → answer a few items.
 * Extracted from the old monolithic `paid-user-smoke` to avoid duplicating journey/lessons/flashcards coverage.
 *
 * @see ../helpers/paid-user-suite.ts
 */
import { expect, test, type Page } from "@playwright/test";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  buildPaidFailureSnapshot,
  collectPaidSurfaceDebug,
  logPaidSurfaceDebug,
  waitForAuthenticatedLearnerShell,
} from "../helpers/paid-learner-shell";
import { attachPageObservers } from "../helpers/attach-observers";
import { logObserverFailureSummary } from "../helpers/log-observer-failure-summary";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import {
  answerOneCatExamItem,
  clickBeginExamAfterPracticeHubStart,
} from "../helpers/cat-practice-exam-flow";

async function answerOneCatItem(page: Page) {
  await answerOneCatExamItem(page);
}

test.describe("Paid user — CAT smoke", () => {
  test("practice hub → begin exam → 3 items", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await page.goto(
        `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`,
        { waitUntil: "domcontentloaded" },
      );
      await waitForAuthenticatedLearnerShell(page);
      await expectNoSubscriptionPaywall(page, "CAT hub");
      await expect(page.locator("[data-nn-qa-practice-hub-start-test]")).toBeVisible({ timeout: 60_000 });
      await page.locator("[data-nn-qa-practice-hub-start-test]").click();
      await clickBeginExamAfterPracticeHubStart(page);
      await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });
      await expect(page.locator(".nn-cat-question-stem").first()).toBeVisible({
        timeout: 120_000,
      });
      for (let i = 0; i < 3; i++) {
        await answerOneCatItem(page);
      }

      const serious = obs.consoleErrors.filter(
        (x) => !/cookie|Content Security Policy|third-party|analytics/i.test(x),
      );
      if (serious.length > 0 || obs.failedRequests.length > 0) {
        logObserverFailureSummary({
          tag: "[paid-user-cat-smoke]",
          routeLabel: "final",
          seriousConsole: serious,
          failedRequests: obs.failedRequests,
          pageUrl: page.url(),
        });
      }
      expect(serious, serious.slice(0, 6).join("\n")).toEqual([]);
      expect(obs.failedRequests, obs.failedRequests.slice(0, 6).join("\n")).toEqual([]);
    } catch (e) {
      logPaidSurfaceDebug(buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-smoke"), obs));
      throw e;
    } finally {
      obs.dispose();
    }
  });
});
