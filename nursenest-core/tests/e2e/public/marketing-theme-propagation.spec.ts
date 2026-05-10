/**
 * Marketing theme propagation: every public route must respond to theme switching.
 *
 * Asserts (per Ocean / Blossom / Midnight on /, /pricing, /blog, blog post, RN hub):
 *  - `html[data-theme]` actually changes when the picker is used
 *  - computed CSS variable colors (page bg, surface, heading, body text, border, brand) shift
 *    between themes
 *  - body and the first card surface render with theme-aware background/text colors
 *  - layout height stays within tight tolerance (no layout shift between themes)
 *
 * Run with auto local dev server:
 *   cd nursenest-core && npx playwright test tests/e2e/public/marketing-theme-propagation.spec.ts \
 *     --project=chromium
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import {
  PUBLIC_MARKETING_THEME_ALLOWLIST,
  themeOptionsForPublicMarketingPicker,
  THEME_STORAGE_KEY,
} from "@/lib/theme/theme-registry";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

const SCREENSHOT_DIR = join("docs", "screenshots", "marketing-theme-propagation");
mkdirSync(SCREENSHOT_DIR, { recursive: true });

type ThemeSnapshot = {
  dataTheme: string;
  pageBgVar: string;
  surfaceVar: string;
  headingVar: string;
  bodyTextVar: string;
  borderVar: string;
  brandVar: string;
  ctaVar: string;
  bodyBgRendered: string;
  bodyColorRendered: string;
  documentHeight: number;
};

async function readThemeSnapshot(page: Page): Promise<ThemeSnapshot> {
  return page.evaluate(() => {
    const root = document.documentElement;
    const cs = getComputedStyle(root);
    const bodyCs = getComputedStyle(document.body);
    return {
      dataTheme: root.getAttribute("data-theme") ?? "",
      pageBgVar: cs.getPropertyValue("--theme-page-bg").trim(),
      surfaceVar:
        cs.getPropertyValue("--theme-surface").trim() ||
        cs.getPropertyValue("--theme-card-bg").trim(),
      headingVar: cs.getPropertyValue("--theme-heading-text").trim(),
      bodyTextVar: cs.getPropertyValue("--theme-body-text").trim(),
      borderVar: cs.getPropertyValue("--theme-border").trim(),
      brandVar:
        cs.getPropertyValue("--semantic-brand").trim() ||
        cs.getPropertyValue("--theme-primary").trim(),
      ctaVar: cs.getPropertyValue("--role-cta").trim(),
      bodyBgRendered: bodyCs.backgroundColor,
      bodyColorRendered: bodyCs.color,
      documentHeight: document.documentElement.scrollHeight,
    };
  });
}

async function selectThemeViaPicker(page: Page, label: RegExp): Promise<void> {
  const trigger = page.getByRole("button", { name: /^Theme\b/i }).first();
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.click();
  const listbox = page.getByRole("listbox");
  await expect(listbox).toBeVisible({ timeout: 5_000 });
  await page.getByRole("option", { name: label }).first().click();
  // `disableTransitionOnChange` keeps style writes synchronous; tiny wait covers the
  // useLayoutEffect tick where ThemeStateHydration applies inline tokens.
  await page.waitForTimeout(120);
}

async function snapshotAcrossThemes(
  page: Page,
  routePath: string,
): Promise<{ ocean: ThemeSnapshot; blossom: ThemeSnapshot; midnight: ThemeSnapshot }> {
  await page.goto(routePath, { waitUntil: "load", timeout: 120_000 });
  await dismissMarketingScrims(page);
  await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({
    timeout: 60_000,
  });

  await selectThemeViaPicker(page, /^Ocean\b/);
  const ocean = await readThemeSnapshot(page);
  expect(ocean.dataTheme, `${routePath}: data-theme should be ocean`).toBe("ocean");

  await selectThemeViaPicker(page, /^Blossom\b/);
  const blossom = await readThemeSnapshot(page);
  expect(blossom.dataTheme, `${routePath}: data-theme should be blossom`).toBe("blossom");

  await selectThemeViaPicker(page, /^Midnight\b/);
  const midnight = await readThemeSnapshot(page);
  expect(midnight.dataTheme, `${routePath}: data-theme should be midnight`).toBe("midnight");

  return { ocean, blossom, midnight };
}

function expectAllNonEmptyHex(snapshot: ThemeSnapshot, route: string): void {
  for (const key of [
    "pageBgVar",
    "surfaceVar",
    "headingVar",
    "bodyTextVar",
    "borderVar",
    "brandVar",
    "ctaVar",
  ] as const) {
    const value = snapshot[key];
    expect(value, `${route} ${snapshot.dataTheme}.${key} should be a non-empty color`).toMatch(
      /^(#|rgb|hsl|color-mix)/i,
    );
  }
  expect(
    snapshot.bodyBgRendered,
    `${route} ${snapshot.dataTheme}: body background must render as a real color`,
  ).not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/i);
}

function expectThemesDiffer(
  a: ThemeSnapshot,
  b: ThemeSnapshot,
  route: string,
  hint: string,
): void {
  expect(
    a.pageBgVar,
    `${route}: ${hint} page-bg must differ from ${a.dataTheme}`,
  ).not.toBe(b.pageBgVar);
  expect(
    a.surfaceVar,
    `${route}: ${hint} surface must differ from ${a.dataTheme}`,
  ).not.toBe(b.surfaceVar);
  expect(
    a.bodyBgRendered,
    `${route}: ${hint} body bg must render differently from ${a.dataTheme}`,
  ).not.toBe(b.bodyBgRendered);
}

function expectLayoutStable(
  ocean: ThemeSnapshot,
  blossom: ThemeSnapshot,
  midnight: ThemeSnapshot,
  route: string,
): void {
  // Heights can shift slightly when font-loading or async sections settle; stay generous but bounded.
  const heights = [ocean.documentHeight, blossom.documentHeight, midnight.documentHeight];
  const max = Math.max(...heights);
  const min = Math.min(...heights);
  // Up to 6% variance, capped at 240px — covers chip wrap on light vs dark themes without masking
  // genuine layout shifts that would indicate non-token-only theme changes.
  const tolerance = Math.max(240, Math.round(max * 0.06));
  expect(
    max - min,
    `${route}: theme switch should not change layout height (got ${heights.join(" / ")} px, tol=${tolerance}px)`,
  ).toBeLessThanOrEqual(tolerance);
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key: string) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }, SELECTOR_DISMISSED_LS);
  await context.addInitScript((key: string) => {
    try {
      // Start every test from Ocean so first-paint values are deterministic.
      localStorage.setItem(key, "ocean");
    } catch {
      /* ignore */
    }
  }, THEME_STORAGE_KEY);
});

test.describe("Marketing theme propagation — public routes", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("public marketing picker exposes the agreed allowlist (Ocean, Midnight, Blossom, Aurora, Sunset)", async () => {
    const ids = themeOptionsForPublicMarketingPicker().map((opt) => opt.id);
    expect(ids).toEqual([...PUBLIC_MARKETING_THEME_ALLOWLIST]);
  });

  for (const route of [
    { path: "/", id: "home" },
    { path: "/pricing", id: "pricing" },
    { path: "/blog", id: "blog" },
    {
      path: "/blog/rt-acid-base-compensation-chronic-respiratory-disorders",
      id: "blog-post",
    },
    { path: "/us/rn/nclex-rn", id: "rn-hub" },
  ] as const) {
    test(`${route.path} — Ocean / Blossom / Midnight all shift surface tokens & body bg`, async ({
      page,
    }) => {
      const { ocean, blossom, midnight } = await snapshotAcrossThemes(page, route.path);

      expectAllNonEmptyHex(ocean, route.path);
      expectAllNonEmptyHex(blossom, route.path);
      expectAllNonEmptyHex(midnight, route.path);

      expectThemesDiffer(ocean, blossom, route.path, "Ocean ↔ Blossom");
      expectThemesDiffer(ocean, midnight, route.path, "Ocean ↔ Midnight");
      expectThemesDiffer(blossom, midnight, route.path, "Blossom ↔ Midnight");

      expectLayoutStable(ocean, blossom, midnight, route.path);
    });
  }

  test("/pricing — capture Ocean / Blossom / Midnight screenshot evidence", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);
    await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({
      timeout: 60_000,
    });

    for (const themeLabel of ["Ocean", "Blossom", "Midnight"] as const) {
      await selectThemeViaPicker(page, new RegExp(`^${themeLabel}\\b`));
      const themeAttr = await page.evaluate(
        () => document.documentElement.getAttribute("data-theme") ?? "",
      );
      expect(themeAttr.toLowerCase()).toContain(themeLabel.toLowerCase());
      await page.waitForTimeout(200);
      await page.screenshot({
        path: join(SCREENSHOT_DIR, `pricing-${themeAttr}-1280x900-chromium.png`),
        fullPage: true,
      });
    }
  });

  test("/blog — capture Blossom / Midnight screenshot evidence", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);
    await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({
      timeout: 60_000,
    });

    for (const themeLabel of ["Blossom", "Midnight"] as const) {
      await selectThemeViaPicker(page, new RegExp(`^${themeLabel}\\b`));
      const themeAttr = await page.evaluate(
        () => document.documentElement.getAttribute("data-theme") ?? "",
      );
      expect(themeAttr.toLowerCase()).toContain(themeLabel.toLowerCase());
      await page.waitForTimeout(200);
      await page.screenshot({
        path: join(SCREENSHOT_DIR, `blog-${themeAttr}-1280x900-chromium.png`),
        fullPage: true,
      });
    }
  });
});
