/**
 * Lesson detail reading workspace v2 — design PNG exports.
 *
 * Source: lesson-mockups/rn-lesson-detail-reading-v2-design.html
 * Output: lesson-mockups/exports/lesson-detail-v2/*.png
 *
 * Run from nursenest-core/:
 *   npx playwright test tests/e2e/preview/lesson-detail-reading-v2.capture.spec.ts --project=chromium
 */
import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const REPO_ROOT = path.resolve(process.cwd(), "..");
const HTML = path.join(REPO_ROOT, "lesson-mockups", "rn-lesson-detail-reading-v2-design.html");
const OUT = path.join(REPO_ROOT, "lesson-mockups", "design-png", "lesson-detail-v2");
const fileUrl = `file://${HTML}`;

const shots = [
  { id: "desktop-open", name: "desktop-reading-workspace-ocean.png", width: 1440, height: 1400 },
  { id: "desktop-scrolled", name: "desktop-reading-wrap-below-rails.png", width: 1440, height: 900 },
  { id: "desktop-collapsed", name: "desktop-reading-collapsed-rails.png", width: 1440, height: 900 },
  { id: "mobile-full", name: "mobile-reading-fullwidth.png", width: 390, height: 900 },
  { id: "mobile-drawer", name: "mobile-reading-drawer.png", width: 390, height: 780 },
] as const;

test.describe.configure({ mode: "serial" });

test.beforeAll(() => {
  fs.mkdirSync(OUT, { recursive: true });
  if (!fs.existsSync(HTML)) {
    throw new Error(`Missing design HTML: ${HTML}`);
  }
});

for (const shot of shots) {
  test(`capture ${shot.name}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "PNG capture uses chromium only.");

    await page.setViewportSize({ width: shot.width, height: shot.height });
    await page.goto(fileUrl, { waitUntil: "networkidle" });

    const target = page.locator(`#${shot.id}`);
    await expect(target).toBeVisible();
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const outPath = path.join(OUT, shot.name);
    await target.screenshot({ path: outPath, animations: "disabled" });
    expect(fs.existsSync(outPath)).toBe(true);
  });
}
