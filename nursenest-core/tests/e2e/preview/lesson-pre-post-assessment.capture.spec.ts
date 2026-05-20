/**
 * Pre/post assessment mockup PNG exports.
 *
 * Source: lesson-mockups/rn-lesson-pre-post-assessment-design.html
 * Output: lesson-mockups/exports/lesson-pre-post/*.png
 */
import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const REPO_ROOT = path.resolve(process.cwd(), "..");
const HTML = path.join(REPO_ROOT, "lesson-mockups", "rn-lesson-pre-post-assessment-design.html");
const OUT = path.join(REPO_ROOT, "lesson-mockups", "design-png", "lesson-pre-post");
const fileUrl = `file://${HTML}`;

const shots = [
  { id: "pre-idle", name: "desktop-pre-test-idle.png", width: 1440, height: 820 },
  { id: "pre-active", name: "desktop-pre-test-active.png", width: 1440, height: 900 },
  { id: "pre-complete", name: "desktop-pre-test-complete.png", width: 1440, height: 720 },
  { id: "lesson-post-idle", name: "desktop-lesson-post-test-idle.png", width: 1440, height: 780 },
  { id: "post-active", name: "desktop-post-test-active.png", width: 1440, height: 880 },
  { id: "post-complete", name: "desktop-post-test-complete.png", width: 1440, height: 720 },
  { id: "mobile-pre", name: "mobile-pre-test-active.png", width: 390, height: 820 },
  { id: "mobile-post", name: "mobile-post-test-complete.png", width: 390, height: 640 },
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
    await page.waitForTimeout(250);

    const outPath = path.join(OUT, shot.name);
    await target.screenshot({ path: outPath, animations: "disabled" });
    expect(fs.existsSync(outPath)).toBe(true);
  });
}
