/**
 * CAT **exam / test mode** contract on the practice runner: single-column shell,
 * explicit submit → lock → advance, no study-only chrome (rationale column, transparency strip).
 *
 * Requires paid E2E credentials (same harness as paid-user-cat-smoke).
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
import { answerOneCatExamItem } from "../helpers/cat-practice-exam-flow";

test.describe("CAT exam mode — runner contract", () => {
  test("no study split / transparency; submit then advance; single advance control", async ({ page }) => {
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
      await expect(page.getByRole("button", { name: /^Begin exam$/i })).toBeVisible({ timeout: 15_000 });
      await page.getByRole("button", { name: /^Begin exam$/i }).click();
      await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });

      await expect(page.locator("[data-cat-exam-root]")).toBeVisible({ timeout: 120_000 });
      await expect(page.locator(".nn-question-session-rationale")).toHaveCount(0);
      await expect(page.locator("[data-nn-qa-cat-live-transparency]")).toHaveCount(0);

      const submit = page.getByRole("button", { name: /^Submit & Continue$/i });
      await expect(submit).toBeDisabled();

      const list = page.locator("ul.nn-cat-opt-list").first();
      await expect(list).toBeVisible({ timeout: 60_000 });
      const mcBtn = list.locator("button.nn-cat-opt").first();
      await mcBtn.click();
      await expect(submit).toBeEnabled({ timeout: 30_000 });
      await submit.click();

      const advance = page.locator("[data-nn-qa-cat-exam-advance]");
      await expect(advance).toBeVisible({ timeout: 30_000 });
      await expect(advance).toBeEnabled();
      await expect(page.locator("[data-nn-qa-cat-exam-submit-answer]")).toHaveCount(0);
      await expect(advance).toHaveAttribute("data-nn-qa-cat-exam-advance-intent", "server_driven");

      let patchCount = 0;
      await page.route("**/api/practice-tests/**", async (route) => {
        if (route.request().method() === "PATCH") {
          try {
            const body = route.request().postDataJSON() as {
              action?: string;
              examQuestionId?: string;
              sessionId?: string;
              selectedAnswer?: unknown;
              cursorIndex?: number;
              answers?: Record<string, unknown>;
            } | null;
            if (body?.action === "cat_advance") {
              patchCount += 1;
              expect(body.examQuestionId, "cat_advance must echo examQuestionId").toMatch(/^[a-z0-9_-]{8,}$/i);
              expect(body.sessionId, "cat_advance must echo sessionId (practice test id)").toMatch(/^[a-z0-9_-]{8,}$/i);
              expect(body.cursorIndex, "cat_advance requires cursorIndex").toBeGreaterThanOrEqual(0);
              expect(body.answers?.[body.examQuestionId!], "selectedAnswer must match answers[examQuestionId]").toEqual(
                body.selectedAnswer,
              );
            }
          } catch {
            /* non-JSON body */
          }
        }
        await route.continue();
      });

      await advance.click();
      await expect
        .poll(() => patchCount, { timeout: 60_000 })
        .toBe(1);

      await expect(page.locator("[data-nn-qa-cat-exam-submit-answer]")).toBeVisible({ timeout: 60_000 });

      await page.unroute("**/api/practice-tests/**");

      await answerOneCatExamItem(page);

      const serious = obs.consoleErrors.filter(
        (x) => !/cookie|Content Security Policy|third-party|analytics/i.test(x),
      );
      if (serious.length > 0 || obs.failedRequests.length > 0) {
        logObserverFailureSummary({
          tag: "[cat-exam-mode-contract]",
          routeLabel: "final",
          seriousConsole: serious,
          failedRequests: obs.failedRequests,
          pageUrl: page.url(),
        });
      }
      expect(serious, serious.slice(0, 6).join("\n")).toEqual([]);
      expect(obs.failedRequests, obs.failedRequests.slice(0, 6).join("\n")).toEqual([]);
    } catch (e) {
      logPaidSurfaceDebug(buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-exam-contract"), obs));
      throw e;
    } finally {
      obs.dispose();
    }
  });
});
