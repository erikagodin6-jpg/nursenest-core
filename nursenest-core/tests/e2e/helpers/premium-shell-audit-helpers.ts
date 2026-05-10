import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { expect, type Page, type TestInfo } from "@playwright/test";

export const PREMIUM_FULL_PLATFORM_SCREENSHOT_DIR = join("docs", "screenshots", "premium-full-platform-convergence");
const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";
const THEME_STORAGE_KEY = "nursenest-theme";

mkdirSync(PREMIUM_FULL_PLATFORM_SCREENSHOT_DIR, { recursive: true });

export function screenshotName(surface: string, viewport: string, theme: string): string {
  const safe = (input: string) =>
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  return `${safe(surface)}--${safe(viewport)}--${safe(theme)}.png`;
}

export async function preparePremiumShellPage(page: Page, path: string, themeId = "ocean"): Promise<void> {
  await page.addInitScript(
    ({ dismissedKey, themeKey, theme }) => {
      localStorage.setItem(dismissedKey, "1");
      localStorage.setItem(themeKey, theme);
      document.documentElement.setAttribute("data-theme", theme);
    },
    { dismissedKey: SELECTOR_DISMISSED_LS, themeKey: THEME_STORAGE_KEY, theme: themeId },
  );
  const response = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 180_000 });
  expect(response?.ok(), `HTTP ${response?.status()} for ${path}`).toBeTruthy();
  await page.evaluate(
    ({ themeKey, theme }) => {
      localStorage.setItem(themeKey, theme);
      document.documentElement.setAttribute("data-theme", theme);
    },
    { themeKey: THEME_STORAGE_KEY, theme: themeId },
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", themeId, { timeout: 15_000 });
}

export async function waitForLearnerShellReady(page: Page): Promise<void> {
  await expect(page.getByTestId("learner-shell")).toBeVisible({ timeout: 120_000 });
  await expect(page.locator("#nn-learner-main")).toBeVisible({ timeout: 120_000 });
}

export async function settleForScreenshot(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => undefined);
  await page.evaluate(() => document.fonts?.ready).catch(() => undefined);
}

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const width = window.innerWidth;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    return { width, scrollWidth, delta: scrollWidth - width };
  });
  expect(overflow.delta, JSON.stringify(overflow)).toBeLessThanOrEqual(2);
}

export async function expectAtMostOneVisible(page: Page, selector: string): Promise<void> {
  const count = await page.locator(selector).filter({ visible: true }).count();
  expect(count, selector).toBeLessThanOrEqual(1);
}

export async function capturePremiumShellScreenshot(
  page: Page,
  testInfo: TestInfo,
  surface: string,
  viewport: string,
  theme: string,
): Promise<void> {
  await settleForScreenshot(page);
  const filename = screenshotName(surface, viewport, theme);
  const path = join(PREMIUM_FULL_PLATFORM_SCREENSHOT_DIR, filename);
  await page.screenshot({ path, fullPage: false });
  await testInfo.attach(filename, { path, contentType: "image/png" });
}
