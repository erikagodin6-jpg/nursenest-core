/**
 * Smoke + screenshot evidence: US RN / NP hubs, Canada RPN hub, US New Grad pathway hub.
 *
 * Run with auto dev server:
 *   cd nursenest-core && npx playwright test -c playwright.nursing-hubs.config.ts
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";
import {
  expectNotPageNotFound,
  gotoExpectOk,
  requireOrigin,
  seedCaMarketingCookie,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";

const PREMIUM = '[data-nn-qa-pathway-premium-modules=""]';

async function expectNoAdminLinksInPremiumZone(page: Page) {
  const zone = page.locator(PREMIUM);
  await expect(zone.locator('a[href*="/admin"]')).toHaveCount(0);
  const html = (await zone.innerHTML()).toLowerCase();
  expect(html.includes('href="/admin'), "premium zone must not link to /admin").toBe(false);
  expect(html.includes("href='/admin"), "premium zone must not link to /admin").toBe(false);
}

test.describe("Nursing pathway hubs — public smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("US RN hub — study + readiness premium bands, ECG module present", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await expectNotPageNotFound(page);
    await expect(page.locator('[data-nn-nursing-tier-hub="surface"]')).toBeVisible({ timeout: 90_000 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 60_000 });
    await expect(page.locator(PREMIUM)).toBeVisible();
    await expect(page.locator('[data-nn-hub-premium-tone="study"]')).toBeVisible();
    await expect(page.locator('[data-nn-hub-premium-tone="readiness"]')).toBeVisible();
    await expect(page.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(1);
    await expect(page.getByRole("heading", { name: /^study tools$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^readiness & progress$/i })).toBeVisible();
    await expect(page.locator(`${PREMIUM} [data-nn-qa-hub-premium-module="hub_lessons"]`)).toBeVisible();
    await expect(page.locator(`${PREMIUM} [data-nn-qa-hub-premium-module="flashcards"]`)).toBeVisible();
    await expect(page.locator(`${PREMIUM} [data-nn-qa-hub-premium-module="labs"]`)).toBeVisible();
    await expect(page.locator(`${PREMIUM} [data-nn-qa-hub-premium-module="med_calc"]`)).toBeVisible();
    await expect(page.locator('[data-nn-hub-section="quick-actions"]')).toBeVisible();
    await expectNoAdminLinksInPremiumZone(page);
  });

  test("Canada RPN hub — premium grids, no ECG marker", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedCaMarketingCookie(page, origin);
    await gotoExpectOk(page, "/canada/pn/rex-pn");
    await expectNotPageNotFound(page);
    await expect(page.locator('[data-nn-nursing-tier-hub="surface"]')).toBeVisible({ timeout: 90_000 });
    await expect(page.locator(PREMIUM)).toBeVisible();
    await expect(page.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(0);
    await expect(page.locator(`${PREMIUM} [data-nn-qa-hub-premium-module="hub_lessons"]`)).toBeVisible();
    await expect(page.locator(`${PREMIUM} [data-nn-qa-hub-premium-module="flashcards"]`)).toBeVisible();
    await expect(page.locator(`${PREMIUM} [data-nn-qa-hub-premium-module="osce"]`)).toBeVisible();
    await expectNoAdminLinksInPremiumZone(page);
  });

  test("US NP hub — NP clinical marker + ECG", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/np/fnp");
    await expectNotPageNotFound(page);
    await expect(page.locator('[data-nn-nursing-tier-hub="surface"]')).toBeVisible({ timeout: 90_000 });
    await expect(page.locator(`${PREMIUM} [data-nn-qa-hub-premium-module="hub_lessons"]`)).toBeVisible();
    await expect(page.locator(`${PREMIUM} [data-nn-qa-hub-np-cases="1"]`)).toHaveCount(1);
    await expect(page.locator(`${PREMIUM} [data-nn-qa-hub-ecg="1"]`)).toHaveCount(1);
    await expectNoAdminLinksInPremiumZone(page);
  });

  test("US New Grad pathway hub — premium modules + transition section, no ECG", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/new-grad-transition");
    await expectNotPageNotFound(page);
    await expect(page.locator('[data-nn-nursing-tier-hub="surface"]')).toBeVisible({ timeout: 90_000 });
    await expect(page.locator(PREMIUM)).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText(/New graduate transition/i).first()).toBeVisible();
    await expect(page.locator(`${PREMIUM} [data-nn-qa-hub-ecg]`)).toHaveCount(0);
    await expect(page.locator('[data-nn-hub-premium-tone="newGrad"]')).toBeVisible();
    await expectNoAdminLinksInPremiumZone(page);
  });
});

const SCREENSHOT_OUT = join(process.cwd(), "docs", "screenshots", "nursing-hubs-e2e");

const THEME_BUCKETS_E2E = [
  { id: "ocean", label: "ocean" },
  { id: "blossom", label: "blossom" },
  { id: "midnight", label: "midnight" },
] as const;

const SCREENSHOT_HUBS: { fileBase: string; path: string; readySelector: string; seed: "us" | "ca" }[] = [
  {
    fileBase: "us-rn-nclex-rn",
    path: "/us/rn/nclex-rn",
    readySelector: PREMIUM,
    seed: "us",
  },
  {
    fileBase: "ca-pn-rex-pn-rpn",
    path: "/canada/pn/rex-pn",
    readySelector: PREMIUM,
    seed: "ca",
  },
  {
    fileBase: "us-np-fnp",
    path: "/us/np/fnp",
    readySelector: PREMIUM,
    seed: "us",
  },
  {
    fileBase: "us-rn-new-grad-transition",
    path: "/us/rn/new-grad-transition",
    readySelector: PREMIUM,
    seed: "us",
  },
];

test.describe("Nursing hubs — screenshot evidence", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(() => {
    mkdirSync(SCREENSHOT_OUT, { recursive: true });
  });

  for (const hub of SCREENSHOT_HUBS) {
    test(`${hub.fileBase} — desktop Ocean / Blossom / Midnight`, async ({ page, baseURL }) => {
      const origin = requireOrigin(baseURL);
      await page.setViewportSize({ width: 1440, height: 900 });
      if (hub.seed === "ca") await seedCaMarketingCookie(page, origin);
      else await seedUsMarketingCookie(page, origin);
      await gotoExpectOk(page, hub.path);
      await expectNotPageNotFound(page);
      await page.locator(hub.readySelector).waitFor({ state: "visible", timeout: 120_000 });

      for (const th of THEME_BUCKETS_E2E) {
        await page.evaluate((id: string) => {
          document.documentElement.setAttribute("data-theme", id);
        }, th.id);
        await page.waitForTimeout(350);
        await page.screenshot({
          path: join(SCREENSHOT_OUT, `${hub.fileBase}-desktop-${th.label}.png`),
          fullPage: true,
        });
      }
      await page.evaluate(() => {
        document.documentElement.removeAttribute("data-theme");
      });
    });

    test(`${hub.fileBase} — mobile Ocean / Blossom / Midnight`, async ({ page, baseURL }) => {
      const origin = requireOrigin(baseURL);
      await page.setViewportSize({ width: 390, height: 844 });
      if (hub.seed === "ca") await seedCaMarketingCookie(page, origin);
      else await seedUsMarketingCookie(page, origin);
      await gotoExpectOk(page, hub.path);
      await expectNotPageNotFound(page);
      await page.locator(hub.readySelector).waitFor({ state: "visible", timeout: 120_000 });

      for (const th of THEME_BUCKETS_E2E) {
        await page.evaluate((id: string) => {
          document.documentElement.setAttribute("data-theme", id);
        }, th.id);
        await page.waitForTimeout(350);
        await page.screenshot({
          path: join(SCREENSHOT_OUT, `${hub.fileBase}-mobile-${th.label}.png`),
          fullPage: true,
        });
      }
      await page.evaluate(() => {
        document.documentElement.removeAttribute("data-theme");
      });
    });
  }
});
