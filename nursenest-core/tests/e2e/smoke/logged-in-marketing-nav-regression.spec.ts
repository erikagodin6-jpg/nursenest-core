/**
 * Regression: paid learners on marketing `/` must keep full public header IA (mega row, marketing links),
 * not a collapsed learner-primary strip (`data-nn-nav-mode="learner"`).
 *
 * Requires real QA paid credentials — no auth mocks.
 *
 * @see src/lib/navigation/active-context.ts — marketing chrome stays `navMode: "public"`.
 */
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { HEADER_CHROME } from "../helpers/country-selector";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  DESKTOP_MEGA_TIER_NAV,
  DESKTOP_PRIMARY_STRIP_NAV,
  MARKETING_PUBLIC_SELECTOR,
} from "../helpers/navigation-e2e";
import { attachSmokeProductionFailure } from "../helpers/smoke-production-diagnostics";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";

test.use({ storageState: { cookies: [], origins: [] } });

async function attachNavRegressionEvidence(page: Page, testInfo: TestInfo) {
  const snippet = await page
    .locator(HEADER_CHROME)
    .first()
    .evaluate((el) => (el instanceof HTMLElement ? el.outerHTML.slice(0, 24_000) : ""))
    .catch(() => "(no header)");
  await testInfo.attach("header-chrome-snippet.html", {
    body: Buffer.from(snippet, "utf-8"),
    contentType: "text/html",
  });
}

/** Structure-based checks: landmarks, `data-nn-nav-mode`, stable href patterns (locale-agnostic). */
async function expectPublicMarketingHomeWithSession(page: Page) {
  const marketingHeader = page.locator(MARKETING_PUBLIC_SELECTOR).first();
  await expect(marketingHeader).toBeVisible({ timeout: 60_000 });
  await expect(marketingHeader).toHaveAttribute("data-nn-nav-mode", "public");

  await expect
    .poll(async () => page.locator('[data-nn-nav-mode="learner"]').count(), { timeout: 60_000 })
    .toBe(0);

  const chrome = page.locator(HEADER_CHROME);

  await expect(chrome.locator(DESKTOP_PRIMARY_STRIP_NAV).first()).toBeVisible({ timeout: 45_000 });
  await expect(chrome.locator('a[href*="question-bank"]').first()).toBeVisible({ timeout: 30_000 });

  await expect(chrome.locator(DESKTOP_MEGA_TIER_NAV).first()).toBeVisible({ timeout: 30_000 });
  await expect(chrome.locator(`${DESKTOP_MEGA_TIER_NAV} button`).first()).toBeVisible({ timeout: 20_000 });

  await expect(chrome.locator('a[href="/app/account/overview"]').first()).toBeVisible({ timeout: 30_000 });
  await expect(chrome.getByRole("button", { name: /^sign out$/i }).first()).toBeVisible({ timeout: 30_000 });

  const hasAppCta = chrome.locator(
    'a[href="/app"], a[href^="/app/lessons"], a[href^="/app/dashboard"], a[href^="/app/study"]',
  );
  await expect(hasAppCta.first()).toBeVisible({ timeout: 30_000 });

  const path = new URL(page.url()).pathname;
  expect(path.startsWith("/app"), `expected marketing origin, pathname=${path}`).toBe(false);
}

test.describe("Regression — marketing home nav (paid learner)", () => {
  test("public header IA survives load, hydration, and refresh", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

    await page.setViewportSize({ width: 1440, height: 900 });

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);

      const res = await page.goto("/", { waitUntil: "domcontentloaded" });
      expect(res?.ok(), `HTTP ${res?.status()} for /`).toBeTruthy();

      await page.waitForLoadState("networkidle", { timeout: 35_000 }).catch(() => {});

      await expectPublicMarketingHomeWithSession(page);

      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 35_000 }).catch(() => {});

      await expectPublicMarketingHomeWithSession(page);

      await attachSmokeCapture(
        testInfo,
        "logged-in-marketing-nav-regression",
        buildCaptureFromObservers(page, observers),
      );
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeProductionFailure(testInfo, page, observers, "logged-in-marketing-nav-regression");
      await attachNavRegressionEvidence(page, testInfo);
      await attachSmokeFailureScreenshot(page, testInfo, "logged-in-marketing-nav-regression-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });

  test.describe("mobile viewport", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("marketing shell + session affordances; drawer exposes marketing links", async ({ page }, testInfo) => {
      const creds = getQaPaidCredentials();
      test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

      const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
      try {
        await loginWithCredentials(page, creds!.email, creds!.password);

        const res = await page.goto("/", { waitUntil: "domcontentloaded" });
        expect(res?.ok(), `HTTP ${res?.status()} for /`).toBeTruthy();

        const marketingHeader = page.locator(MARKETING_PUBLIC_SELECTOR).first();
        await expect(marketingHeader).toBeVisible({ timeout: 60_000 });
        await expect(marketingHeader).toHaveAttribute("data-nn-nav-mode", "public");
        await expect(page.locator('[data-nn-nav-mode="learner"]')).toHaveCount(0);

        const chrome = page.locator(HEADER_CHROME);
        await expect(chrome.locator('a[href="/app"]').first()).toBeVisible({ timeout: 30_000 });
        await expect(chrome.getByRole("button", { name: /^sign out$/i }).first()).toBeVisible({ timeout: 30_000 });

        await page.getByRole("button", { name: /^open menu$/i }).click();
        await expect(chrome.locator('a[href*="question-bank"]').first()).toBeVisible({ timeout: 20_000 });
        await page.getByRole("button", { name: /^close menu$/i }).last().click();

        const path = new URL(page.url()).pathname;
        expect(path.startsWith("/app"), `expected marketing origin, pathname=${path}`).toBe(false);

        await attachSmokeCapture(
          testInfo,
          "logged-in-marketing-nav-regression-mobile",
          buildCaptureFromObservers(page, observers),
        );
        expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
        expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
      } catch (e) {
        await attachSmokeProductionFailure(testInfo, page, observers, "logged-in-marketing-nav-regression-mobile");
        await attachNavRegressionEvidence(page, testInfo);
        await attachSmokeFailureScreenshot(page, testInfo, "logged-in-marketing-nav-regression-mobile-failure.png");
        throw e;
      } finally {
        observers.dispose();
      }
    });
  });
});
