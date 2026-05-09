/**
 * Allied Health marketing hubs — URL discovery from registry, premium zone stability,
 * no ECG QA marker, no NCLEX NGN copy, no /admin leakage in the public premium grid.
 *
 * Run from app package:
 *   cd nursenest-core && npx playwright test tests/e2e/public/allied-health-hubs.spec.ts
 *
 * Screenshots (optional artifact): nursenest-core/docs/screenshots/allied-health-e2e/
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { ALLIED_PROFESSION_KEYS } from "@/lib/allied/allied-professions-registry";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(HERE, "..", "..", "..");
const SCREENSHOT_DIR = join(PKG_ROOT, "docs", "screenshots", "allied-health-e2e");

const PREMIUM = '[data-nn-qa-pathway-premium-modules=""]';

/** Console patterns ignored for benign third-party / hydration noise (tune per env). */
function isBenignConsoleMessage(text: string): boolean {
  const t = text.toLowerCase();
  if (t.includes("favicon")) return true;
  if (t.includes("ResizeObserver loop")) return true;
  return false;
}

function hubUrls(): string[] {
  const bases = ["/allied/allied-health", "/us/allied/allied-health"];
  const careers = ALLIED_PROFESSION_KEYS.map((k) => `/allied/${encodeURIComponent(k)}`);
  return [...bases, ...careers];
}

test.describe("Allied Health hubs (registry-driven)", () => {
  test.beforeAll(() => {
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });

  for (const path of hubUrls()) {
    test(`HTTP 200 + premium zone — ${path}`, async ({ page, baseURL }) => {
      test.skip(!baseURL, "BASE_URL required");

      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const t = msg.text();
          if (!isBenignConsoleMessage(t)) errors.push(t);
        }
      });

      const res = await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
      expect(res?.status(), `status for ${path}`).toBeLessThan(400);

      const zone = page.locator(PREMIUM);
      await expect(zone).toBeVisible({ timeout: 90_000 });

      await expect(zone.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(0);
      await expect(zone).not.toContainText(/NGN/i);

      const zoneHtml = await zone.innerHTML();
      expect(zoneHtml.toLowerCase().includes("/admin")).toBe(false);

      await expect(page.getByRole("heading", { name: /^Study tools$/i })).toBeVisible();

      await page.waitForTimeout(5000);
      await expect(zone).toBeVisible();

      expect(errors, `console errors for ${path}`).toEqual([]);
    });
  }

  test("desktop + mobile viewports — global hub", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    const path = "/allied/allied-health";
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await expect(page.locator(PREMIUM)).toBeVisible({ timeout: 90_000 });
    await page.screenshot({ path: join(SCREENSHOT_DIR, "allied-hub-desktop-ocean.png"), fullPage: false });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await expect(page.locator(PREMIUM)).toBeVisible({ timeout: 90_000 });
    await page.screenshot({ path: join(SCREENSHOT_DIR, "allied-hub-mobile-ocean.png"), fullPage: false });
  });

  test("light/dark theme — sample occupation hub", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    const path = "/allied/mlt";
    await page.setViewportSize({ width: 1280, height: 900 });

    await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await expect(page.locator(PREMIUM)).toBeVisible({ timeout: 90_000 });
    await page.screenshot({ path: join(SCREENSHOT_DIR, "allied-mlt-ocean.png"), fullPage: false });

    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "midnight"));
    await page.waitForTimeout(200);
    await expect(page.locator(PREMIUM)).toBeVisible();
    await page.screenshot({ path: join(SCREENSHOT_DIR, "allied-mlt-midnight.png"), fullPage: false });
  });
});
