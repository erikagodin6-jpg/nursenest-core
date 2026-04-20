/**
 * Deploy-style contract: marketing homepage must never look “broken” (chrome + hero + real content).
 *
 * Run (anonymous / production-like):
 *   npx playwright test tests/e2e/public/site-core-ux-never-broken.spec.ts --project=chromium
 *
 * Selectors: see `../helpers/site-never-broken-contract.ts`.
 */
import { expect, test } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import {
  SEL_DESKTOP_PRIMARY_NAV,
  SEL_HERO_HEADING,
  SEL_HERO_SECTION,
  SEL_MARKETING_HEADER,
  assertMarketingHomeNeverBroken,
  assertMarketingMainHasBody,
} from "../helpers/site-never-broken-contract";
import { expectNotPageNotFound } from "../helpers/navigation-e2e";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }, SELECTOR_DISMISSED_LS);
});

test.describe("Site core UX — homepage never broken (chromium)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("header, logo, nav, hero visible; main overview has copy; not 404", async ({ page }) => {
    const r = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(r?.ok(), `HTTP ${r?.status()}`).toBeTruthy();
    await expectNotPageNotFound(page);

    await assertMarketingHomeNeverBroken(page, "home domcontentloaded");
    await assertMarketingMainHasBody(page, "home domcontentloaded");

    await page.waitForLoadState("load");
    await assertMarketingHomeNeverBroken(page, "home load");
  });

  test("no blank first paint: hero + heading visible at commit", async ({ page }) => {
    await page.goto("/", { waitUntil: "commit" });
    await expect(page.locator(SEL_MARKETING_HEADER).first()).toBeVisible({ timeout: 60_000 });
    await expect(page.locator(SEL_HERO_SECTION).first()).toBeVisible({ timeout: 60_000 });
    await expect(page.locator(SEL_HERO_HEADING).first()).toBeVisible({ timeout: 60_000 });
  });

  test("navigation: home → Pricing → back; chrome + hero still OK", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await assertMarketingHomeNeverBroken(page, "nav start");

    await dismissMarketingScrims(page);
    const pricing = page.locator(SEL_MARKETING_HEADER).getByRole("link", { name: /^Pricing$/i }).first();
    await expect(pricing).toBeVisible({ timeout: 30_000 });
    await Promise.all([
      page.waitForURL(/\/pricing/, { timeout: 60_000, waitUntil: "domcontentloaded" }),
      pricing.click(),
    ]);
    await expectNotPageNotFound(page);
    await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 30_000 });

    await page.goBack({ waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/($|\?)/);
    await assertMarketingHomeNeverBroken(page, "nav back home");
    await expect(page.locator(SEL_DESKTOP_PRIMARY_NAV).first()).toBeVisible();
  });
});
