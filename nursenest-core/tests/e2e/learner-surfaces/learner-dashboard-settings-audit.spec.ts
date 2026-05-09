/**
 * Learner dashboard / account / settings hygiene — canonical redirects, key surfaces,
 * and guards against obvious untranslated marketing keys in main content.
 *
 * Requires paid QA credentials for authenticated sections (skipped when unset).
 * Screenshots: set `LEARNER_UI_AUDIT_SCREENSHOTS=1` to write under `reports/learner-dashboard-settings-ui-audit-2026-05-08/screenshots/`.
 *
 * Run: `cd nursenest-core && npm run test:e2e:learner-surfaces-smoke` (this file matches that config).
 */
import { expect, test, devices, type Page } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { expectPaidLearnerShellReady, learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { requireOrigin } from "../helpers/navigation-e2e";
import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const RAW_KEY_LIKE = /\blearner\.[a-z][a-z0-9]*(?:\.[a-z][a-z0-9]*){2,}\b/i;

function screenshotRoot() {
  return join(process.cwd(), "reports", "learner-dashboard-settings-ui-audit-2026-05-08", "screenshots");
}

async function maybeScreenshot(page: Page, name: string) {
  if (process.env.LEARNER_UI_AUDIT_SCREENSHOTS !== "1") return;
  const dir = screenshotRoot();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: join(dir, name), fullPage: true });
}

async function expectMainHasNoRawKeys(page: Page) {
  const main = learnerAppMainLandmark(page);
  await expect(main).toBeVisible({ timeout: 60_000 });
  const text = await main.innerText();
  expect(text, "main landmark should not expose raw i18n key strings").not.toMatch(RAW_KEY_LIKE);
}

test.describe("Learner dashboard/settings — canonical redirects (guest)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("/app/dashboard → /app", async ({ page }) => {
    await page.goto("/app/dashboard", { waitUntil: "commit" });
    await page.waitForURL(/\/app\/?(\?|$)/, { timeout: 30_000 });
  });

  test("/app/settings → /app/account/settings", async ({ page }) => {
    await page.goto("/app/settings", { waitUntil: "commit" });
    await page.waitForURL(/\/app\/account\/settings/, { timeout: 30_000 });
  });

  test("/app/report-card → /app/account/report", async ({ page }) => {
    await page.goto("/app/report-card", { waitUntil: "commit" });
    await page.waitForURL(/\/app\/account\/report/, { timeout: 30_000 });
  });
});

test.describe("Learner dashboard/settings — authenticated surfaces", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("paid subscriber: dashboard, account hub, settings hub, billing, report card; nav links resolve", async ({
    page,
    baseURL,
  }) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

    requireOrigin(baseURL);
    await loginWithCredentials(page, creds!.email, creds!.password);

    await page.goto("/app", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "audit /app");
    await expectMainHasNoRawKeys(page);
    await maybeScreenshot(page, "dashboard-desktop.png");

    await page.goto("/app/account", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "audit /app/account");
    await expect(page.getByTestId("learner-account-center-overview")).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('a[href="/app/account/billing"]').first()).toBeVisible({ timeout: 30_000 });
    await expectMainHasNoRawKeys(page);

    await page.goto("/app/account/settings", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "audit settings hub");
    await expect(page.getByTestId("learner-account-settings-hub")).toBeVisible({ timeout: 60_000 });
    await expectMainHasNoRawKeys(page);
    await maybeScreenshot(page, "settings-hub-desktop.png");

    await page.goto("/app/account/billing", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "audit billing");
    await expectMainHasNoRawKeys(page);
    await maybeScreenshot(page, "billing-desktop.png");

    await page.goto("/app/account/report", { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "audit report");
    await expect(page.getByTestId("learner-performance-workspace-nav")).toBeVisible({ timeout: 60_000 });
    await expectMainHasNoRawKeys(page);
    await maybeScreenshot(page, "report-card-desktop.png");

    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/app/account/settings", { waitUntil: "domcontentloaded" });
    await expectMainHasNoRawKeys(page);
    await maybeScreenshot(page, "settings-hub-dark-desktop.png");
  });
});

test.describe("Learner dashboard/settings — mobile viewport", () => {
  test.use({
    ...devices["iPhone 12"],
    storageState: { cookies: [], origins: [] },
  });

  test("paid subscriber: core routes render without horizontal overflow", async ({ page }) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

    await loginWithCredentials(page, creds!.email, creds!.password);

    for (const path of ["/app", "/app/account/settings", "/app/account/billing", "/app/account/report"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expectPaidLearnerShellReady(page, `mobile ${path}`);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth, `${path} should not overflow horizontally`).toBeLessThanOrEqual(clientWidth + 2);
    }
    await maybeScreenshot(page, "dashboard-mobile.png");
  });
});
