/**
 * Premium analytics / report / readiness presentation smoke (visual hooks + shells).
 *
 * **Credentials:** `QA_PAID_EMAIL` + `QA_PAID_PASSWORD` (or aliases in
 * `tests/e2e/helpers/smoke-credentials.ts`). Tests skip when unset.
 *
 * **Server:** `npm run dev:next` or `PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=…`
 *
 * Run: `cd nursenest-core && npm run test:e2e:learner-surfaces-smoke`
 */
import { expect, test } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { expectPaidLearnerShellReady, learnerAppMainLandmark } from "../helpers/paid-learner-shell";

test.describe("Analytics + report premium surfaces", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("analytics shell, report sections, readiness hero", async ({ page }) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (paid learner)");

    await loginWithCredentials(page, creds!.email, creds!.password);

    await page.goto("/app/account/analytics", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "premium analytics route");
    const main = learnerAppMainLandmark(page);
    await expect(main).toBeVisible({ timeout: 60_000 });

    const quietEmpty = page.locator('[data-nn-empty="account-analytics-quiet"]');
    const premiumShell = page.locator('[data-nn-premium-analytics="performance-report"]');
    await expect(quietEmpty.or(premiumShell).first()).toBeVisible({ timeout: 45_000 });

    await page.goto("/app/account/report", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "report card route");
    await expect(main).toBeVisible({ timeout: 60_000 });
    await expect(page.locator("#rc-readiness")).toBeVisible({ timeout: 45_000 });

    await page.goto("/app/account/readiness", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "readiness route");
    await expect(page.locator(".nn-premium-readiness-page-hero")).toBeVisible({ timeout: 45_000 });
  });
});
