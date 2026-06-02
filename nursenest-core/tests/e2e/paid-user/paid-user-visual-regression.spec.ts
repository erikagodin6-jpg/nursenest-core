/**
 * Visual regression for key learner surfaces (pixel diff vs committed baselines).
 *
 * Baselines live next to this file:
 *   `paid-user-visual-regression.spec.ts-snapshots/<project>/<name>.png`
 *
 * Update baselines after intentional UI changes:
 *   npx playwright test tests/e2e/paid-user/paid-user-visual-regression.spec.ts --project=chromium-paid --update-snapshots
 *
 * Pixel diffs catch layout shifts, missing buttons, broken nav, and overlapping text as visible changes.
 * Requires `--project=chromium-paid` (stored auth).
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { LESSON_HUB_CARD_LINKS } from "../helpers/paid-content-discovery";

/** Align with `devices['iPhone 12']` viewport for consistent mobile baselines. */
const MOBILE_VIEWPORT = { width: 390, height: 844 } as const;

/** Keep options local to this spec so we never change global `expect` for other tests in the worker. */
const screenshotOpts = {
  fullPage: true,
  animations: "disabled" as const,
  caret: "hide" as const,
  maxDiffPixelRatio: 0.02,
  threshold: 0.25,
};

async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready).catch(() => {});
}

async function captureWhenReady(page: Page, name: string, ready: Locator): Promise<void> {
  await ready.first().waitFor({ state: "visible", timeout: 120_000 });
  await waitForFonts(page);
  await expect(page).toHaveScreenshot(`${name}.png`, screenshotOpts);
}

test.describe("Learner visual regression", () => {
  test("dashboard (desktop)", async ({ page }) => {
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    expect(page.url()).not.toMatch(/\/login/i);
    await captureWhenReady(
      page,
      "dashboard-desktop",
      page.locator('nav[aria-label="Learner primary actions"]'),
    );
  });

  test("lesson page (desktop)", async ({ page }) => {
    await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
    expect(page.url()).not.toMatch(/\/login/i);
    const firstLesson = page.locator(LESSON_HUB_CARD_LINKS).first();
    await firstLesson.waitFor({ state: "visible", timeout: 120_000 });
    const href = await firstLesson.getAttribute("href");
    expect(href).toBeTruthy();
    await page.goto(href!, { waitUntil: "domcontentloaded" });
    expect(page.url()).not.toMatch(/\/login/i);
    await captureWhenReady(page, "lesson-desktop", page.locator("main"));
  });

  test("practice — question bank (desktop)", async ({ page }) => {
    await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
    expect(page.url()).not.toMatch(/\/login/i);
    await captureWhenReady(page, "practice-desktop", page.getByRole("heading", { name: /^Question bank$/i }));
  });

  test("dashboard (mobile layout)", async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    expect(page.url()).not.toMatch(/\/login/i);
    await captureWhenReady(
      page,
      "dashboard-mobile",
      page.locator('nav[aria-label="Learner bottom navigation"]'),
    );
  });
});
