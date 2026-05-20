/**
 * RN Practice exam hub mockups — PNGs per view × theme.
 *
 * Source: lesson-mockups/rn-practice-exam-hub-gallery.html
 * Output: <repo>/reports/screenshots/rn-practice-exam-hub-mockups-2026/
 *
 *   cd nursenest-core
 *   npm run capture:rn-practice-exam-hub
 */
import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const REPO_ROOT = path.resolve(process.cwd(), "..");
const HTML = path.join(REPO_ROOT, "lesson-mockups", "rn-practice-exam-hub-gallery.html");
const OUT = path.join(REPO_ROOT, "reports", "screenshots", "rn-practice-exam-hub-mockups-2026");
const fileUrl = `file://${HTML}`;

const VIEWS = ["default", "filters_active", "count_custom"] as const;
const THEMES = ["ocean", "blossom", "midnight"] as const;

function outPath(view: string, theme: string): string {
  return path.join(OUT, `hub--${view}--${theme}--desktop.png`);
}

test.describe.configure({ mode: "serial" });

test.beforeAll(() => {
  fs.mkdirSync(OUT, { recursive: true });
  if (!fs.existsSync(HTML)) {
    throw new Error(`Missing gallery HTML: ${HTML}`);
  }
});

for (const theme of THEMES) {
  for (const view of VIEWS) {
    test(`capture hub ${view} ${theme}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "chromium", "PNG capture uses chromium only.");

      await page.setViewportSize({ width: 1440, height: 1100 });
      await page.goto(fileUrl, { waitUntil: "domcontentloaded" });

      await page.locator(`[data-theme-pick="${theme}"]`).click();
      await page.locator(`[data-view-pick="${view}"]`).click();
      await page.waitForTimeout(250);

      const viewport = page.locator("[data-capture-root]");
      await expect(viewport).toBeVisible();
      await expect(viewport).toHaveAttribute("data-capture-view", view);
      await expect(viewport).toHaveAttribute("data-capture-theme", theme);

      const target = outPath(view, theme);
      await viewport.screenshot({ path: target, animations: "disabled" });
      expect(fs.existsSync(target)).toBe(true);
    });
  }
}
