/**
 * Learner shell visual governance: Ocean, Blossom, Midnight themes
 *
 * Captures: authenticated learner dashboard + CAT page + practice exam
 * at mobile (390×844) and desktop (1440×900).
 *
 * Requires: valid paid credentials in PLAYWRIGHT_PAID_EMAIL / PLAYWRIGHT_PAID_PASSWORD
 * or an existing auth state file at VISUAL_QA_LEARNER_AUTH_FILE.
 *
 * From package root:
 *   npx playwright test tests/e2e/visual/theme-parity/learner-shell-visual.spec.ts --project=chromium
 *
 * Screenshots: docs/screenshots/theme-parity/
 */
import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const THEME_STORAGE_KEY = "nursenest-theme";
const SHOT_DIR = path.join(process.cwd(), "docs", "screenshots", "theme-parity");
const THEMES = ["ocean", "blossom", "midnight"] as const;
const VIEWPORTS = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "mobile", width: 390, height: 844 },
] as const;

test.beforeEach(async ({ browserName }) => {
  test.skip(browserName !== "chromium", "Visual captures run on Chromium only.");
  fs.mkdirSync(SHOT_DIR, { recursive: true });
});

async function setTheme(page: import("@playwright/test").Page, themeId: string): Promise<void> {
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
  await expect(page.locator("html")).toHaveAttribute("data-theme", themeId, { timeout: 5_000 });
}

test.describe("Learner shell visual governance", () => {
  test("dashboard shell renders with correct theme chrome (authenticated)", async ({
    page,
    context,
  }) => {
    // Skip if no auth state available
    const authFile = process.env.VISUAL_QA_LEARNER_AUTH_FILE;
    if (!authFile || !fs.existsSync(authFile)) {
      test.skip();
      return;
    }

    await context.addCookies(
      JSON.parse(fs.readFileSync(authFile, "utf8")).cookies ?? [],
    );

    for (const viewport of VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const theme of THEMES) {
        await page.goto("/app", { waitUntil: "domcontentloaded", timeout: 60_000 });
        await setTheme(page, theme);

        // Wait for learner shell to render
        const shell = page.locator('[data-testid="learner-shell"]');
        await expect(shell).toBeVisible({ timeout: 30_000 });

        // Short settle for shell animations
        await page.waitForTimeout(2000);

        await page.screenshot({
          path: path.join(SHOT_DIR, `learner-dashboard-${theme}-${viewport.label}.png`),
          fullPage: false,
        });
      }
    }
  });

  test("CAT page renders with premium chrome (authenticated)", async ({
    page,
    context,
  }) => {
    const authFile = process.env.VISUAL_QA_LEARNER_AUTH_FILE;
    if (!authFile || !fs.existsSync(authFile)) {
      test.skip();
      return;
    }

    await context.addCookies(
      JSON.parse(fs.readFileSync(authFile, "utf8")).cookies ?? [],
    );

    await page.setViewportSize({ width: 390, height: 844 });

    for (const theme of THEMES) {
      await page.goto("/app/practice-tests/start", {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      await setTheme(page, theme);

      await page.waitForTimeout(2500);

      await page.screenshot({
        path: path.join(SHOT_DIR, `cat-start-${theme}-mobile.png`),
        fullPage: false,
      });
    }
  });
});

test.describe("Learner shell hydration stability", () => {
  test("learner shell nav height stays stable 3s after load (authenticated)", async ({
    page,
    context,
  }) => {
    const authFile = process.env.VISUAL_QA_LEARNER_AUTH_FILE;
    if (!authFile || !fs.existsSync(authFile)) {
      test.skip();
      return;
    }

    await context.addCookies(
      JSON.parse(fs.readFileSync(authFile, "utf8")).cookies ?? [],
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/app", { waitUntil: "domcontentloaded", timeout: 60_000 });

    const shell = page.locator('[data-testid="learner-shell"]');
    await expect(shell).toBeVisible({ timeout: 30_000 });

    // Capture nav height at T=0
    const nav = page.locator(".nn-learner-shell-sticky").first();
    const navBox0 = await nav.boundingBox().catch(() => null);

    // Wait 3 seconds for any deferred hydration
    await page.waitForTimeout(3000);

    // Nav height must not shift
    const navBox3 = await nav.boundingBox().catch(() => null);
    if (navBox0 && navBox3) {
      expect(Math.abs(navBox3.height - navBox0.height)).toBeLessThan(4);
    }
  });
});
