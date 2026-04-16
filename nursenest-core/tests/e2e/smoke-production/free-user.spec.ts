/**
 * Free tier QA — `QA_FREE_EMAIL` / `QA_FREE_PASSWORD` (or `E2E_FREE_*`).
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";
import { attachSmokeProductionFailure } from "../helpers/smoke-production-diagnostics";
import { getQaFreeCredentials } from "../helpers/smoke-credentials";
import { expectOnLearnerApp } from "../helpers/paid-surface-assertions";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Free user", () => {
  test("login, dashboard, limited lessons/questions", async ({ page }, testInfo) => {
    const creds = getQaFreeCredentials();
    test.skip(!creds, "Set QA_FREE_EMAIL + QA_FREE_PASSWORD (or E2E_FREE_*)");

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await expectOnLearnerApp(page);

      await page.goto("/app", { waitUntil: "domcontentloaded" });
      await expect(page.locator("main")).toBeVisible({ timeout: 60_000 });

      await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { name: "Subscription required" })).toBeVisible({ timeout: 45_000 });
      await expect(page.getByRole("heading", { name: "Lesson preview" })).toBeVisible({ timeout: 60_000 });

      await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { name: "Subscription required" }).first()).toBeVisible({
        timeout: 45_000,
      });
      await expect(page.locator("main")).toBeVisible({ timeout: 45_000 });
      await page.waitForFunction(
        () => {
          const t = document.body?.innerText ?? "";
          return (
            t.includes("Try a few questions") ||
            t.includes("Complimentary preview") ||
            t.includes("View plans")
          );
        },
        null,
        { timeout: 90_000 },
      );

      await attachSmokeCapture(testInfo, "free-user", buildCaptureFromObservers(page, observers));
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeProductionFailure(testInfo, page, observers, "free-user");
      await attachSmokeFailureScreenshot(page, testInfo, "free-user-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
