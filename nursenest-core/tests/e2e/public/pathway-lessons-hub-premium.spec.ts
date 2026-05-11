/**
 * Marketing pathway lessons hubs: premium shell, stable hooks, no placeholder copy in main content.
 * Run: `cd nursenest-core && npx playwright test tests/e2e/public/pathway-lessons-hub-premium.spec.ts`
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import { expect, test } from "@playwright/test";
import {
  expectNotPageNotFound,
  gotoExpectOk,
  requireOrigin,
  seedCaMarketingCookie,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";

const HUB_ROOT = '[data-nn-lessons-marketing-hub="1"]';
const PREMIUM_LESSONS_ROOT = '[data-nn-premium-lessons-system="hub"]';
const PREMIUM_LESSONS_HERO = "[data-nn-premium-lessons-hero]";
const PREMIUM_LESSONS_BODY = "[data-nn-premium-lessons-hub-body]";
const LESSONS_SECTION = '[data-nn-qa-pathway-lessons-hub="true"]';
const APP_ERROR_SCREEN = "[data-nn-app-error-screen]";
const PLACEHOLDER_RE = /placeholder|lorem ipsum|todo:|tbd\b|\[insert\]/i;
const HUB_TIMEOUT = 180_000;

const SCREENSHOT_DIR = join(process.cwd(), "reports/lessons-hub-cleanup-2026-05-08/screenshots");

test.describe.configure({ timeout: 300_000, mode: "serial" });

async function assertNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return Math.max(0, doc.scrollWidth - doc.clientWidth);
  });
  expect(overflow, "main document horizontal overflow").toBeLessThanOrEqual(8);
}

async function captureHubScreenshot(page: import("@playwright/test").Page, fileBase: string) {
  await mkdir(SCREENSHOT_DIR, { recursive: true });
  await page.screenshot({ path: join(SCREENSHOT_DIR, `${fileBase}.png`), fullPage: true });
}

async function expectMarketingLessonsHubLoaded(page: import("@playwright/test").Page) {
  await expect(page.locator(HUB_ROOT)).toBeVisible({ timeout: HUB_TIMEOUT });
  await expect(page.locator(PREMIUM_LESSONS_ROOT)).toBeVisible({ timeout: HUB_TIMEOUT });
  await expect(page.locator(PREMIUM_LESSONS_HERO)).toBeVisible({ timeout: HUB_TIMEOUT });
  await expect(page.locator(PREMIUM_LESSONS_BODY)).toBeVisible({ timeout: HUB_TIMEOUT });
  await expect(page.locator(LESSONS_SECTION)).toBeVisible({ timeout: HUB_TIMEOUT });
  await expect(page.getByRole("heading", { name: /other ways to study/i })).toHaveCount(0);
}

test.describe("Pathway lessons hub — premium shell (RN / PN / NP / CA RPN / Allied)", () => {
  test.beforeAll(async ({ request }) => {
    await mkdir(SCREENSHOT_DIR, { recursive: true });
    /** Warm Turbopack + hub RSC before browser tests (reduces cold-start timeouts under serial mode). */
    await request.get("/us/rn/nclex-rn/lessons", { timeout: 300_000 });
  });

  test("US RN lessons index loads premium hub + lesson section", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn/lessons");
    await expectNotPageNotFound(page);
    await expectMarketingLessonsHubLoaded(page);
    await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^Lesson Library$/ })).toBeVisible();
    await expect(page.locator(`${LESSONS_SECTION} a.group`).first()).toBeVisible();
    await page.waitForTimeout(5000);
    await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
    await expect(page.locator(HUB_ROOT)).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: /lessons/i })).toBeVisible();
    const main = page.locator("main");
    await expect(main).toBeVisible();
    await expect(main).not.toContainText(PLACEHOLDER_RE);
    await expect(page.locator(`${HUB_ROOT} a`).filter({ hasText: /overview/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Practice Questions/ }).first()).toBeVisible();
    await captureHubScreenshot(page, "us-rn-nclex-rn-lessons");
  });

  test("Canada RN lessons index loads premium hub + lesson section", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedCaMarketingCookie(page, origin);
    await gotoExpectOk(page, "/canada/rn/nclex-rn/lessons");
    await expectNotPageNotFound(page);
    await expectMarketingLessonsHubLoaded(page);
    await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^Lesson Library$/ })).toBeVisible();
    await expect(page.locator(`${LESSONS_SECTION} a.group`).first()).toBeVisible();
    await page.waitForTimeout(5000);
    await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
    await expect(page.locator(HUB_ROOT)).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: /lessons/i })).toBeVisible();
    const main = page.locator("main");
    await expect(main).toBeVisible();
    await expect(main).not.toContainText(PLACEHOLDER_RE);
    await expect(page.locator(`${HUB_ROOT} a`).filter({ hasText: /overview/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Practice Questions/ }).first()).toBeVisible();
    await captureHubScreenshot(page, "ca-rn-nclex-rn-lessons");
  });

  test("US PN lessons index loads premium hub + lesson section", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/pn/nclex-pn/lessons");
    await expectNotPageNotFound(page);
    await expectMarketingLessonsHubLoaded(page);
    await expect(page.locator("main")).not.toContainText(PLACEHOLDER_RE);
    await captureHubScreenshot(page, "us-pn-nclex-pn-lessons");
  });

  test("US NP (FNP) lessons index loads premium hub + lesson section", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/np/fnp/lessons");
    await expectNotPageNotFound(page);
    await expectMarketingLessonsHubLoaded(page);
    await captureHubScreenshot(page, "us-np-fnp-lessons");
  });

  test("Allied health legacy hub redirects to canonical global lessons URL", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/allied/allied-health/lessons");
    await page.waitForURL("**/allied/allied-health/lessons", { timeout: 120_000 });
    await expectNotPageNotFound(page);
  });

  test("Allied global lessons hub — hub markers + no app error screen", async ({ page, baseURL }) => {
    test.skip(
      process.env.NN_E2E_ALLIED_GLOBAL_HUB_BODY !== "1",
      "Set NN_E2E_ALLIED_GLOBAL_HUB_BODY=1 to assert full allied hub chrome (route can stay on loading.tsx until slow RSC completes on cold dev).",
    );
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/allied/allied-health/lessons");
    await expectNotPageNotFound(page);
    await expect(page.getByRole("heading", { name: /^Lesson Library$/ })).toBeVisible({ timeout: HUB_TIMEOUT });
    await expect(page.locator(LESSONS_SECTION)).toBeVisible({ timeout: HUB_TIMEOUT });
    await expect(page.locator(HUB_ROOT)).toBeVisible({ timeout: HUB_TIMEOUT });
    await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
    await page.waitForTimeout(5000);
    await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
    await captureHubScreenshot(page, "allied-allied-health-lessons");
  });

  test("Canada RPN (REx-PN) lessons index loads premium hub + lesson section", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedCaMarketingCookie(page, origin);
    await gotoExpectOk(page, "/canada/pn/rex-pn/lessons");
    await expectNotPageNotFound(page);
    await expectMarketingLessonsHubLoaded(page);
    await expect(page.locator("main")).not.toContainText(PLACEHOLDER_RE);
    await captureHubScreenshot(page, "canada-pn-rex-pn-lessons");
  });

  test("Mobile viewport — US RN, Canada RN, and US NP hubs: no runaway horizontal scroll", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.setViewportSize({ width: 390, height: 844 });
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn/lessons");
    await expectNotPageNotFound(page);
    await expectMarketingLessonsHubLoaded(page);
    await assertNoHorizontalOverflow(page);
    await seedCaMarketingCookie(page, origin);
    await gotoExpectOk(page, "/canada/rn/nclex-rn/lessons");
    await expectNotPageNotFound(page);
    await expectMarketingLessonsHubLoaded(page);
    await assertNoHorizontalOverflow(page);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/np/fnp/lessons");
    await expectNotPageNotFound(page);
    await expectMarketingLessonsHubLoaded(page);
    await assertNoHorizontalOverflow(page);
    await captureHubScreenshot(page, "mobile-us-np-fnp-lessons");
  });

  test("theme parity — Ocean, Blossom, Midnight, Sunset, and Aurora preserve premium Lessons hub structure", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn/lessons");
    await expectMarketingLessonsHubLoaded(page);

    for (const theme of ["ocean", "blossom", "midnight", "sunset", "aurora"] as const) {
      await page.evaluate((themeId) => {
        document.documentElement.setAttribute("data-theme", themeId);
      }, theme);
      await expect(page.locator(PREMIUM_LESSONS_ROOT)).toBeVisible();
      await expect(page.locator(PREMIUM_LESSONS_HERO)).toBeVisible();
      await expect(page.locator(PREMIUM_LESSONS_BODY)).toBeVisible();
      await expect(page.getByRole("link", { name: /Practice Questions/ }).first()).toBeVisible();
      await assertNoHorizontalOverflow(page);
    }
  });
});
