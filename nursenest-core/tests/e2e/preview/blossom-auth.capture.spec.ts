/**
 * Blossom premium auth — design PNG exports.
 *
 * Source: auth-mockups/blossom-auth-premium-gallery.html
 * Output: auth-mockups/design-png/blossom-auth/*.png
 *
 * Run from nursenest-core/:
 *   npx playwright test tests/e2e/preview/blossom-auth.capture.spec.ts --project=chromium
 */
import fs from "node:fs";
import path from "node:path";
import { test } from "@playwright/test";

const REPO_ROOT = path.resolve(process.cwd(), "..");
const HTML = path.join(REPO_ROOT, "auth-mockups", "blossom-auth-premium-gallery.html");
const OUT = path.join(REPO_ROOT, "auth-mockups", "design-png", "blossom-auth");
const fileUrl = `file://${HTML}`;

const shots = [
  { selector: "#mockup-sign-in-split", name: "01-sign-in-split-editorial-desktop.png", width: 1440, height: 900 },
  { selector: "#mockup-sign-up-pathway", name: "02-sign-up-pathway-aspirational-desktop.png", width: 1440, height: 900 },
  { selector: "#mockup-forgot-centered", name: "03-forgot-password-centered-glass-desktop.png", width: 1440, height: 900 },
  { selector: "#mockup-mobile-sign-in", name: "04-sign-in-mobile-native.png", width: 390, height: 844 },
  { selector: "#mockup-verify-success", name: "05-email-verification-success-desktop.png", width: 1440, height: 900 },
  { selector: "#mockup-reset-password", name: "06-reset-password-split-desktop.png", width: 1440, height: 900 },
  { selector: "#mockup-session-expired", name: "07-session-expired-calm-desktop.png", width: 1440, height: 900 },
  { selector: "#mockup-oauth-loading", name: "08-oauth-continuation-loading-desktop.png", width: 1440, height: 900 },
  { selector: "#mockup-error-state", name: "09-auth-error-gentle-desktop.png", width: 1440, height: 900 },
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
    await page.goto(fileUrl, { waitUntil: "load" });
    await page.locator(".gallery-nav").evaluate((el) => el.remove()).catch(() => undefined);

    const target = page.locator(shot.selector);
    await target.waitFor({ state: "visible" });
    await target.screenshot({
      path: path.join(OUT, shot.name),
      animations: "disabled",
    });
  });
}
