/**
 * Smoke: allied **occupation** marketing hubs expose the premium module grid
 * (`data-nn-qa-pathway-premium-modules`) without `/admin` leakage.
 *
 * NOTE: Top-level allied hubs (`/allied/allied-health`, `/us/allied/allied-health`)
 * are intentionally an occupation **chooser** — they do not render the premium
 * module grid. Comprehensive coverage for the global chooser plus deeper
 * profession-scoped link assertions live in
 * `tests/e2e/public/pathway-hub-premium-modules-interaction.spec.ts`.
 */
import { expect, test } from "@playwright/test";

/** Representative public allied **occupation** URLs that render the premium grid. */
const ALLIED_OCCUPATION_PREMIUM_SMOKE_URLS = ["/allied/mlt"] as const;

test.describe("Allied occupation hub premium modules (public smoke)", () => {
  for (const path of ALLIED_OCCUPATION_PREMIUM_SMOKE_URLS) {
    test(`premium grid visible on ${path}`, async ({ page }) => {
      const res = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(res?.ok(), `HTTP ok for ${path}`).toBeTruthy();

      const premium = page.locator("[data-nn-qa-pathway-premium-modules]");
      await expect(premium).toBeVisible({ timeout: 120_000 });
      await expect(page.getByRole("heading", { name: /^Study tools$/i })).toBeVisible();

      const html = await page.content();
      expect(html.includes("/admin/"), "no raw admin URLs in HTML").toBe(false);
    });
  }
});
