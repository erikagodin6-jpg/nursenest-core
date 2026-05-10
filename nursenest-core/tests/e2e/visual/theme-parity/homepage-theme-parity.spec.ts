/**
 * Homepage layout parity: Ocean (canonical), Blossom, Midnight — same DOM/CSS grid;
 * themes differ only in palette (see `premium-redesign-2026.css` + theme tokens).
 *
 * From package root (`nursenest-core/`):
 *   npx playwright test tests/e2e/visual/theme-parity/homepage-theme-parity.spec.ts --project=chromium
 *
 * Screenshots (committed baselines): `docs/screenshots/theme-parity/`
 */
import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { dismissMarketingScrims } from "../../helpers/marketing-navigation-audit";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";
const THEME_STORAGE_KEY = "nursenest-theme";
const SHOT_DIR = path.join(process.cwd(), "docs", "screenshots", "theme-parity");
const THEMES = ["ocean", "blossom", "midnight"] as const;

test.beforeEach(async ({ context, browserName }) => {
  test.skip(browserName !== "chromium", "Theme parity captures run on Chromium only.");
  await context.addInitScript(
    ({ dismissedKey }: { dismissedKey: string }) => {
      try {
        localStorage.setItem(dismissedKey, "1");
      } catch {
        /* ignore */
      }
    },
    { dismissedKey: SELECTOR_DISMISSED_LS },
  );
  fs.mkdirSync(SHOT_DIR, { recursive: true });
});

async function settle(page: import("@playwright/test").Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded", { timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(4000);
}

async function gotoHomeWithTheme(
  page: import("@playwright/test").Page,
  themeId: (typeof THEMES)[number],
): Promise<void> {
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.evaluate(
    ({ themeKey, themeId: id }) => {
      try {
        localStorage.setItem(themeKey, id);
        document.documentElement.setAttribute("data-theme", id);
      } catch {
        /* ignore */
      }
    },
    { themeKey: THEME_STORAGE_KEY, themeId },
  );
  await expect(page.locator("header[data-nn-header-layout]").first()).toBeVisible({
    timeout: 180_000,
  });
}

test.describe("Homepage theme parity (Ocean / Blossom / Midnight)", () => {
  test("desktop 1440×900 — full-page screenshots per theme", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    for (const theme of THEMES) {
      await gotoHomeWithTheme(page, theme);
      await settle(page);
      await dismissMarketingScrims(page);

      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

      await page.screenshot({
        path: path.join(SHOT_DIR, `home-${theme}-1440x900-full.png`),
        fullPage: true,
      });
    }
  });

  test("mobile 390×844 — full-page screenshots per theme", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const theme of THEMES) {
      await gotoHomeWithTheme(page, theme);
      await settle(page);
      await dismissMarketingScrims(page);

      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

      await page.screenshot({
        path: path.join(SHOT_DIR, `home-${theme}-390x844-full.png`),
        fullPage: true,
      });
    }
  });
});
