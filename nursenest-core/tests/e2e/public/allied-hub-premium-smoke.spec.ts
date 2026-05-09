/**
 * Smoke: allied **occupation** marketing hubs expose the premium module grid
 * (`data-nn-qa-pathway-premium-modules`) without `/admin` leakage.
 *
 * Covers multiple occupations + one edge profession, desktop + mobile viewports,
 * and light + dark theme buckets via `[data-theme]` (same pattern as nursing hub smoke).
 */
import { expect, test } from "@playwright/test";

const ALLIED_OCCUPATION_PREMIUM_SMOKE_URLS = [
  "/allied/mlt",
  "/allied/paramedic",
  "/allied/psychotherapy",
  "/allied/dietetic-technician",
] as const;

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 720 },
  { name: "mobile", width: 390, height: 844 },
] as const;

const THEMES = ["ocean", "midnight"] as const;

test.describe("Allied occupation hub premium modules (public smoke)", () => {
  for (const path of ALLIED_OCCUPATION_PREMIUM_SMOKE_URLS) {
    for (const vp of VIEWPORTS) {
      for (const theme of THEMES) {
        test(`premium grid visible on ${path} (${vp.name}, ${theme})`, async ({ page }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          const res = await page.goto(path, { waitUntil: "domcontentloaded" });
          expect(res?.ok(), `HTTP ok for ${path}`).toBeTruthy();

          await page.evaluate((id) => {
            document.documentElement.setAttribute("data-theme", id);
          }, theme);

          const premium = page.locator("[data-nn-qa-pathway-premium-modules]");
          await expect(premium).toBeVisible({ timeout: 120_000 });
          await expect(page.getByRole("heading", { name: /^Study tools$/i })).toBeVisible();

          const html = await page.content();
          expect(html.includes("/admin/"), "no raw admin URLs in HTML").toBe(false);
          expect(html.includes("data-nn-qa-hub-ecg"), "allied hub must not render ECG QA marker").toBe(false);
        });
      }
    }
  }
});
