/**
 * RN Practice in-session exam mockups — PNGs per state × theme.
 *
 * Source: lesson-mockups/rn-practice-exam-in-session-gallery.html
 * Output: <repo>/reports/screenshots/rn-practice-exam-in-session-mockups-2026/
 *
 *   cd nursenest-core
 *   npm run capture:rn-practice-exam-in-session
 */
import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const REPO_ROOT = path.resolve(process.cwd(), "..");
const HTML = path.join(REPO_ROOT, "lesson-mockups", "rn-practice-exam-in-session-gallery.html");
const OUT = path.join(REPO_ROOT, "reports", "screenshots", "rn-practice-exam-in-session-mockups-2026");
const fileUrl = `file://${HTML}`;

const STATES = ["pre_submit", "rationale_correct", "rationale_incorrect", "sata_rationale"] as const;
const THEMES = ["ocean", "blossom", "midnight"] as const;

function outPath(state: string, theme: string): string {
  return path.join(OUT, `${state}--${theme}--desktop.png`);
}

test.describe.configure({ mode: "serial" });

test.beforeAll(() => {
  fs.mkdirSync(OUT, { recursive: true });
  if (!fs.existsSync(HTML)) {
    throw new Error(`Missing gallery HTML: ${HTML}`);
  }
});

for (const theme of THEMES) {
  for (const state of STATES) {
    test(`capture ${state} ${theme}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "chromium", "PNG capture uses chromium only.");

      await page.setViewportSize({ width: 1440, height: 1100 });
      await page.goto(fileUrl, { waitUntil: "domcontentloaded" });

      await page.locator(`[data-theme-pick="${theme}"]`).click();
      await page.locator(`[data-state-pick="${state}"]`).click();
      await page.waitForTimeout(250);

      const viewport = page.locator("[data-capture-root]");
      await expect(viewport).toBeVisible();
      await expect(viewport).toHaveAttribute("data-capture-state", state);
      await expect(viewport).toHaveAttribute("data-capture-theme", theme);

      const target = outPath(state, theme);
      await viewport.screenshot({ path: target, animations: "disabled" });
      expect(fs.existsSync(target)).toBe(true);
    });
  }
}
