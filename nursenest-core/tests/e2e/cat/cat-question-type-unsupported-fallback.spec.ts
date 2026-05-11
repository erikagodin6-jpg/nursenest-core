/**
 * Specialized formats that still lack dedicated CAT runners must surface the safe fallback
 * (role=alert) without crashing the exam shell.
 *
 * Paid E2E credentials — same harness as cat-exam-mode-contract.
 */
import { expect, test } from "@playwright/test";
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

test.describe("CAT — unsupported structured question type fallback", () => {
  test("matrix-style payload shows safe fallback alert (no crash)", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await page.route("**/api/practice-tests/*/question*", async (route) => {
        const req = route.request();
        if (req.method() !== "GET") {
          await route.continue();
          return;
        }
        const res = await route.fetch();
        let body: unknown;
        try {
          body = await res.json();
        } catch {
          await route.fulfill({ response: res });
          return;
        }
        const b = body as {
          question?: Record<string, unknown>;
          index?: number;
        };
        if (b.question && typeof b.index === "number" && b.index === 0) {
          b.question = {
            ...b.question,
            questionType: "MATRIX_GRID",
            options: { rows: [{ id: "r1", cells: [] }], columns: [{ id: "c1" }] },
            correctAnswer: [],
          };
        }
        await route.fulfill({
          status: res.status(),
          headers: res.headers(),
          body: JSON.stringify(body),
        });
      });

      await page.goto(
        `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`,
        { waitUntil: "domcontentloaded" },
      );
      await waitForAuthenticatedLearnerShell(page);
      await expectNoSubscriptionPaywall(page, "CAT hub");
      await expect(page.locator("[data-nn-qa-practice-hub-start-test]")).toBeVisible({ timeout: 60_000 });
      await page.locator("[data-nn-qa-practice-hub-start-test]").click();
      await expect(page.getByRole("button", { name: /^Begin exam$/i })).toBeVisible({ timeout: 15_000 });
      await page.getByRole("button", { name: /^Begin exam$/i }).click();
      await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });

      await expect(page.locator("[data-cat-exam-root]")).toBeVisible({ timeout: 120_000 });
      await expect(page.locator('[role="alert"]').filter({ hasText: /specialized question format/i })).toBeVisible({
        timeout: 60_000,
      });

      const serious = obs.consoleErrors.filter(
        (x) => !/cookie|Content Security Policy|third-party|analytics/i.test(x),
      );
      if (serious.length > 0 || obs.failedRequests.length > 0) {
        logObserverFailureSummary({
          tag: "[cat-unsupported-fallback]",
          routeLabel: "final",
          seriousConsole: serious,
          failedRequests: obs.failedRequests,
          pageUrl: page.url(),
        });
      }
      expect(serious, serious.slice(0, 6).join("\n")).toEqual([]);
      expect(obs.failedRequests, obs.failedRequests.slice(0, 6).join("\n")).toEqual([]);

      await page.unroute("**/api/practice-tests/*/question*");
    } catch (e) {
      logPaidSurfaceDebug(buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-unsupported-fallback"), obs));
      throw e;
    } finally {
      obs.dispose();
    }
  });
});
