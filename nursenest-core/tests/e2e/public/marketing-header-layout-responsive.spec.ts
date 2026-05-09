/**
 * Marketing SiteHeader: responsive layout (lg+ desktop vs mobile), no nav/auth overlap,
 * utility band stacked above primary row, brand leaf slot + wordmark share computed color,
 * tier band below primary, stable screenshots after settle wait.
 *
 * From nursenest-core:
 *   npx playwright test tests/e2e/public/marketing-header-layout-responsive.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { publicMarketingThemeChoiceCount } from "../../../src/lib/theme/theme-registry";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";
const THEME_STORAGE_KEY = "nursenest-theme";

const SHOT_DIR = path.join(process.cwd(), "docs", "screenshots", "marketing-header");

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ context, browserName }) => {
  test.skip(browserName !== "chromium", "Marketing header layout probes run on Chromium only.");
  await context.addInitScript(
    ({ dismissedKey, themeKey }: { dismissedKey: string; themeKey: string }) => {
      try {
        localStorage.setItem(dismissedKey, "1");
        /* Light marketing row4: utility band only renders when `isLightTheme` (ocean/blossom/…). */
        localStorage.setItem(themeKey, "ocean");
      } catch {
        /* ignore */
      }
    },
    { dismissedKey: SELECTOR_DISMISSED_LS, themeKey: THEME_STORAGE_KEY },
  );
  fs.mkdirSync(SHOT_DIR, { recursive: true });
});

async function settle(page: import("@playwright/test").Page): Promise<void> {
  await page.waitForLoadState("load", { timeout: 60_000 }).catch(() => {});
  /* Stable screenshots + hydration; avoid networkidle (can hang on long-polling / analytics). */
  await page.waitForTimeout(5000);
}

/** next-themes can hydrate after first paint; reload once so ocean + row4 chrome are deterministic. */
async function gotoHomeLightMarketing(page: import("@playwright/test").Page): Promise<void> {
  await page.goto("/", { waitUntil: "load", timeout: 120_000 });
  await page.evaluate((themeKey) => {
    try {
      localStorage.setItem(themeKey, "ocean");
    } catch {
      /* ignore */
    }
  }, THEME_STORAGE_KEY);
  await page.reload({ waitUntil: "load", timeout: 120_000 });
}

function utilityBarLocator(page: import("@playwright/test").Page) {
  return page.locator(".nn-marketing-nav-v31-bar-a[data-nn-header-band='utility']").first();
}

function primaryRowLocator(page: import("@playwright/test").Page) {
  return page.locator("header.nn-header-logo-row .nn-header-desktop-grid").first();
}

function tierBandLocator(page: import("@playwright/test").Page) {
  return page.locator(".nn-marketing-nav-v31-tier-rail[data-nn-header-band='tier']").first();
}

test.describe("Marketing header layout — responsive", () => {
  test("desktop 1280: utility above primary, nav/auth no overlap, brand colors match, nav works", async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoHomeLightMarketing(page);
    await settle(page);
    await dismissMarketingScrims(page);

    await page.screenshot({
      path: path.join(SHOT_DIR, `after-fix-${testInfo.project.name}-1280x900.png`),
      fullPage: false,
    });

    await expect(page.locator('header[data-nn-header-layout="marketing-row4"]')).toBeVisible({ timeout: 60_000 });

    const utility = utilityBarLocator(page);
    const primary = primaryRowLocator(page);
    const tier = tierBandLocator(page);

    await expect(utility).toBeVisible({ timeout: 60_000 });
    await expect(primary).toBeVisible({ timeout: 60_000 });
    await expect(tier).toBeVisible({ timeout: 60_000 });

    const stackOk = await page.evaluate(() => {
      const u = document.querySelector(".nn-marketing-nav-v31-bar-a[data-nn-header-band='utility']");
      const p = document.querySelector("header.nn-header-logo-row .nn-header-desktop-grid");
      if (!u || !p) return { ok: false as const, reason: "missing nodes" };
      const ur = u.getBoundingClientRect();
      const pr = p.getBoundingClientRect();
      return { ok: ur.bottom <= pr.top + 1.5, ub: ur.bottom, pt: pr.top };
    });
    expect(stackOk.ok, JSON.stringify(stackOk)).toBe(true);

    const noOverlap = await page.evaluate(() => {
      function overlap(a: DOMRect, b: DOMRect) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      }
      const nav = document.querySelector(".nn-header-main-marketing-nav");
      const auth = document.querySelector(".nn-header-desktop-auth-cluster");
      if (!nav || !auth) return { ok: false as const, reason: "missing nav/auth" };
      const a = nav.getBoundingClientRect();
      const b = auth.getBoundingClientRect();
      return { ok: !overlap(a, b), nav: a, auth: b };
    });
    expect(noOverlap.ok, JSON.stringify(noOverlap)).toBe(true);

    const brandMatch = await page.evaluate(() => {
      const leaf = document.querySelector("[data-nn-header-lockup=\"leaf\"]");
      const word = document.querySelector("[data-nn-header-lockup=\"wordmark\"]");
      if (!leaf || !word) return { ok: false as const };
      const lc = getComputedStyle(leaf).color;
      const wc = getComputedStyle(word).color;
      return { ok: lc === wc, lc, wc };
    });
    expect(brandMatch.ok, JSON.stringify(brandMatch)).toBe(true);

    const pricing = page.locator("header .nn-header-main-marketing-nav a[href*=\"pricing\"]").first();
    await expect(pricing).toBeVisible();
    await expect(pricing).toHaveAttribute("href", /pricing/i);
    const navPromise = page.waitForURL(/pricing/i, { timeout: 120_000 });
    await pricing.scrollIntoViewIfNeeded();
    await pricing.click();
    await navPromise;
    expect(page.url().toLowerCase()).toMatch(/pricing/);
  });

  test("desktop 1024: utility above primary, no nav/auth overlap, brand colors match, key hrefs", async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await gotoHomeLightMarketing(page);
    await settle(page);
    await dismissMarketingScrims(page);

    await page.screenshot({
      path: path.join(SHOT_DIR, `after-fix-${testInfo.project.name}-1024x900.png`),
      fullPage: false,
    });

    await expect(page.locator('header[data-nn-header-layout="marketing-row4"]')).toBeVisible({ timeout: 60_000 });

    const utility = utilityBarLocator(page);
    const primary = primaryRowLocator(page);
    await expect(utility).toBeVisible({ timeout: 60_000 });
    await expect(primary).toBeVisible({ timeout: 60_000 });

    const stackOk = await page.evaluate(() => {
      const u = document.querySelector(".nn-marketing-nav-v31-bar-a[data-nn-header-band='utility']");
      const p = document.querySelector("header.nn-header-logo-row .nn-header-desktop-grid");
      if (!u || !p) return { ok: false as const, reason: "missing nodes" };
      const ur = u.getBoundingClientRect();
      const pr = p.getBoundingClientRect();
      return { ok: ur.bottom <= pr.top + 1.5, ub: ur.bottom, pt: pr.top };
    });
    expect(stackOk.ok, JSON.stringify(stackOk)).toBe(true);

    const noOverlap = await page.evaluate(() => {
      function overlap(a: DOMRect, b: DOMRect) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      }
      const nav = document.querySelector(".nn-header-main-marketing-nav");
      const auth = document.querySelector(".nn-header-desktop-auth-cluster");
      if (!nav || !auth) return { ok: false as const };
      return { ok: !overlap(nav.getBoundingClientRect(), auth.getBoundingClientRect()) };
    });
    expect(noOverlap.ok).toBe(true);

    const brandMatch = await page.evaluate(() => {
      const leaf = document.querySelector("[data-nn-header-lockup=\"leaf\"]");
      const word = document.querySelector("[data-nn-header-lockup=\"wordmark\"]");
      if (!leaf || !word) return { ok: false as const };
      return { ok: getComputedStyle(leaf).color === getComputedStyle(word).color };
    });
    expect(brandMatch.ok).toBe(true);

    const nav = page.locator("header .nn-header-main-marketing-nav");
    const pricing = nav.getByRole("link", { name: /^pricing$/i }).first();
    const blog = nav.getByRole("link", { name: /^blog$/i }).first();
    const faq = nav.getByRole("link", { name: /^faq$/i }).first();
    await expect(pricing).toHaveAttribute("href", /pricing/);
    await expect(blog).toHaveAttribute("href", /\/blog/);
    await expect(faq).toHaveAttribute("href", /\/faq/);
  });

  test("tablet 768: mobile chrome; brand cluster vs controls do not overlap", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await gotoHomeLightMarketing(page);
    await settle(page);

    await page.screenshot({
      path: path.join(SHOT_DIR, `after-fix-${testInfo.project.name}-768x1024.png`),
      fullPage: false,
    });

    await expect(primaryRowLocator(page)).toBeHidden();

    const mobileOk = await page.evaluate(() => {
      function overlap(a: DOMRect, b: DOMRect) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      }
      const brand = document.querySelector(".nn-header-mobile-brand-auth-cluster");
      const controls = document.querySelector(".top-bar.nn-header-mobile-only-flex > div.nn-header-mobile-only-flex");
      if (!brand || !controls) return { ok: false as const, reason: "missing mobile clusters" };
      return { ok: !overlap(brand.getBoundingClientRect(), controls.getBoundingClientRect()) };
    });
    expect(mobileOk.ok, JSON.stringify(mobileOk)).toBe(true);

    await expect(page.getByRole("button", { name: /open menu|menu/i })).toBeVisible();
  });

  test("mobile 390: menu visible; tier/desktop rows absent", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHomeLightMarketing(page);
    await settle(page);

    await page.screenshot({
      path: path.join(SHOT_DIR, `after-fix-${testInfo.project.name}-390x844.png`),
      fullPage: false,
    });

    await expect(primaryRowLocator(page)).toBeHidden();
    await expect(tierBandLocator(page)).toBeHidden();
    await expect(page.getByRole("button", { name: /open menu|menu/i })).toBeVisible();
  });

  test("theme control in utility band when multiple public themes (chromium)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoHomeLightMarketing(page);
    await settle(page);

    if (publicMarketingThemeChoiceCount() <= 1) {
      test.skip(true, "Single public marketing theme — theme picker intentionally omitted.");
    }

    const themeBtn = utilityBarLocator(page).locator("button[aria-haspopup=\"listbox\"]").first();
    await expect(themeBtn).toBeVisible({ timeout: 30_000 });
    await expect(themeBtn).toBeEnabled();
  });
});
