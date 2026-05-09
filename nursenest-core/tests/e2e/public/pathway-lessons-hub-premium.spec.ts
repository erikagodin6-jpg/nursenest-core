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
const LESSONS_SECTION = '[data-nn-qa-pathway-lessons-hub="true"]';
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
  const hub = page.locator(HUB_ROOT);
  await expect(hub).toBeVisible({ timeout: HUB_TIMEOUT });
  await expect(hub.locator(LESSONS_SECTION)).toBeVisible({ timeout: HUB_TIMEOUT });
  await expect(page.getByRole("heading", { name: /other ways to study/i })).toHaveCount(0);
}

test.describe("Pathway lessons hub — premium shell (RN / PN / NP / CA RPN / Allied)", () => {
  test.beforeAll(async ({ request }) => {
    await mkdir(SCREENSHOT_DIR, { recursive: true });
    /** Warm Turbopack + RN hub aggregates before browser tests (reduces cold-start timeouts under serial mode). */
    await request.get("/us/rn/nclex-rn/lessons", { timeout: 300_000 });
  });

  test("US RN lessons index loads premium hub + lesson section", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn/lessons");
    await expectNotPageNotFound(page);
    await expectMarketingLessonsHubLoaded(page);
    await expect(page.getByRole("heading", { level: 1, name: /lessons/i })).toBeVisible();
    const main = page.locator("main");
    await expect(main).toBeVisible();
    await expect(main).not.toContainText(PLACEHOLDER_RE);
    await expect(page.locator(`${HUB_ROOT} a`).filter({ hasText: /overview/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /practice questions/i }).first()).toBeVisible();
    await captureHubScreenshot(page, "us-rn-nclex-rn-lessons");
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

  test("Allied health lessons index loads premium hub + lesson section", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/allied/allied-health/lessons");
    await expectNotPageNotFound(page);
    await expectMarketingLessonsHubLoaded(page);
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

  test("Mobile viewport — RN + NP hubs: no runaway horizontal scroll", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoExpectOk(page, "/us/rn/nclex-rn/lessons");
    await expectNotPageNotFound(page);
    await expectMarketingLessonsHubLoaded(page);
    await assertNoHorizontalOverflow(page);
    await gotoExpectOk(page, "/us/np/fnp/lessons");
    await expectNotPageNotFound(page);
    await expectMarketingLessonsHubLoaded(page);
    await assertNoHorizontalOverflow(page);
    await captureHubScreenshot(page, "mobile-us-np-fnp-lessons");
  });
});
