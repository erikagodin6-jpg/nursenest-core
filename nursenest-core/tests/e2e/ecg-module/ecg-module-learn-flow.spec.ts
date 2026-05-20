/**
 * ECG module learner flow — requires production-like gates:
 * - `ENABLE_ECG_MODULE=true`
 * - Internal course `ecg-mastery-module` published (see `ecg-module-status.ts`)
 * - Paid RN/NP entitlement
 *
 * Opt-in for CI/staging:
 *   `E2E_ECG_MODULE_ENABLED=1 npm run test:e2e -- tests/e2e/ecg-module/ecg-module-learn-flow.spec.ts`
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import { expectOnPaidSubscriberApp } from "../helpers/paid-surface-assertions";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";

test.use({ storageState: { cookies: [], origins: [] } });

test("Paid subscriber — ECG basic quizzes load deterministic strips without console errors", async ({ page, baseURL }, testInfo) => {
  test.skip(process.env.E2E_ECG_MODULE_ENABLED !== "1", "Set E2E_ECG_MODULE_ENABLED=1 with ENABLE_ECG_MODULE and published ECG module.");
  const creds = getQaPaidCredentials();
  test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD (or QA_PAID_* / PLAYWRIGHT_TEST_*)");

  const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
  try {
    await loginWithCredentials(page, creds!.email, creds!.password);
    await expectOnPaidSubscriberApp(page);

    const url = `${baseURL?.replace(/\/$/, "") ?? ""}/modules/ecg/basic/quizzes`;
    const nav = await page.goto(url, { waitUntil: "domcontentloaded" });
    expect(nav?.status(), "ECG route should resolve when module gates pass").not.toBe(404);

    await expect(page.getByRole("heading", { name: /Basic ECG quizzes/i })).toBeVisible({ timeout: 60_000 });

    await expect(
      page
        .locator('[data-testid="ecg-live-strip"]')
        .or(page.getByText(/No ECG items are published for this mode yet/i)),
    ).toBeVisible({ timeout: 60_000 });

    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "midnight"));
    await expect(
      page.locator('[data-testid="ecg-live-strip"]').or(page.getByText(/No ECG items are published for this mode yet/i)),
    ).toBeVisible({ timeout: 30_000 });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Basic ECG quizzes/i })).toBeVisible({ timeout: 60_000 });

    expect(observers.failedRequests.filter((u) => !u.includes("favicon")), observers.failedRequests.join(" | ")).toEqual([]);
  } finally {
    await logObserverDiagnostics(observers, testInfo.title);
    observers.dispose();
  }
});
