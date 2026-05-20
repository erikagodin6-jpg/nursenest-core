/**
 * RN CAT in-session exam mockups — PNGs per question type × design direction × theme.
 *
 * Source: lesson-mockups/rn-cat-exam-in-session-gallery.html
 * Output: <repo>/reports/screenshots/rn-cat-exam-in-session-mockups-2026/
 *
 *   cd nursenest-core
 *   npm run capture:rn-cat-exam-in-session
 */
import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const REPO_ROOT = path.resolve(process.cwd(), "..");
const HTML = path.join(REPO_ROOT, "lesson-mockups", "rn-cat-exam-in-session-gallery.html");
const OUT = path.join(REPO_ROOT, "reports", "screenshots", "rn-cat-exam-in-session-mockups-2026");
const fileUrl = `file://${HTML}`;

const TYPES = [
  "mcq",
  "sata",
  "bowtie",
  "matrix_mcq",
  "matrix_mr",
  "drag_drop",
  "dropdown_cloze",
  "highlight_text",
  "hotspot",
  "case_study",
  "trend",
  "ordered_response",
] as const;

const DIRS = ["a", "b", "c", "d", "e"] as const;
const THEMES = ["ocean", "blossom", "midnight"] as const;

function outPath(type: string, dir: string, theme: string): string {
  return path.join(OUT, `${type}--dir-${dir}--${theme}--desktop.png`);
}

test.describe.configure({ mode: "serial" });

test.beforeAll(() => {
  fs.mkdirSync(OUT, { recursive: true });
  if (!fs.existsSync(HTML)) {
    throw new Error(`Missing gallery HTML: ${HTML}`);
  }
});

for (const theme of THEMES) {
  for (const type of TYPES) {
    for (const dir of DIRS) {
      test(`capture ${type} dir-${dir} ${theme}`, async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "chromium", "PNG capture uses chromium only.");

        await page.setViewportSize({ width: 1440, height: 1100 });
        await page.goto(fileUrl, { waitUntil: "domcontentloaded" });

        await page.locator(`[data-theme-pick="${theme}"]`).click();
        await page.locator(`[data-type-pick="${type}"]`).click();
        await page.locator(`[data-dir-pick="${dir}"]`).click();
        await page.waitForTimeout(250);

        const viewport = page.locator("[data-capture-root]");
        await expect(viewport).toBeVisible();
        await expect(viewport).toHaveAttribute("data-capture-type", type);
        await expect(viewport).toHaveAttribute("data-capture-dir", dir);
        await expect(viewport).toHaveAttribute("data-capture-theme", theme);

        const target = outPath(type, dir, theme);
        await viewport.screenshot({ path: target, animations: "disabled" });
        expect(fs.existsSync(target)).toBe(true);
      });
    }
  }
}
