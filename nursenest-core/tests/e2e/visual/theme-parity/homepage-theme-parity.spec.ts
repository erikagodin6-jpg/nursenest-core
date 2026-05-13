/**
 * Homepage layout parity: Ocean (canonical), Blossom, Midnight, Aurora, Sunset
 * — same DOM/CSS grid; themes differ only in palette.
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
const THEMES = ["ocean", "blossom", "midnight", "aurora", "sunset"] as const;

/** Settling time after theme application — covers hydration + below-fold skeleton resolve */
const SETTLE_MS = 4000;

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

async function settle(page: import("@playwright/test").Page, ms = SETTLE_MS): Promise<void> {
  await page.waitForLoadState("domcontentloaded", { timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(ms);
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

test.describe("Homepage theme parity (Ocean / Blossom / Midnight / Aurora / Sunset)", () => {
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

test.describe("Homepage hydration stability (5-second stability window)", () => {
  test("hero and header remain layout-stable for 5s after load (mobile 390×844)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });

    // Wait for the hero heading to be present (RSC island rendered)
    const hero = page.locator('[data-testid="hero-section"]');
    await expect(hero).toBeVisible({ timeout: 30_000 });

    // Capture hero bounding box at T=0
    const box0 = await hero.boundingBox();

    // Also capture header
    const header = page.locator("header[data-nn-header-layout]");
    await expect(header).toBeVisible({ timeout: 10_000 });
    const headerBox0 = await header.boundingBox();

    // Wait 5 seconds — hydration, carousel init, fonts, lazy sections all settle
    await page.waitForTimeout(5000);

    // Capture again at T=5s
    const box5 = await hero.boundingBox();
    const headerBox5 = await header.boundingBox();

    // Hero position must not shift more than 2px
    if (box0 && box5) {
      expect(Math.abs(box5.y - box0.y)).toBeLessThan(2);
      expect(Math.abs(box5.height - box0.height)).toBeLessThan(8);
    }

    // Header height must remain stable
    if (headerBox0 && headerBox5) {
      expect(Math.abs(headerBox5.height - headerBox0.height)).toBeLessThan(2);
    }
  });

  test("hero section renders hero heading and stats line without hydration mismatch (desktop)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });

    // Check for hydration mismatch warnings in console
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && msg.text().includes("Hydration")) {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Hero heading must be visible
    await expect(page.locator('[data-testid="text-hero-heading"]')).toBeVisible({ timeout: 30_000 });

    // Stats line must render (RSC server island)
    await expect(page.locator('[data-testid="premium-hero-stats-line"]')).toBeVisible({ timeout: 10_000 });

    // No hydration errors
    expect(consoleErrors, `Unexpected hydration errors: ${consoleErrors.join(", ")}`).toHaveLength(0);
  });
});
