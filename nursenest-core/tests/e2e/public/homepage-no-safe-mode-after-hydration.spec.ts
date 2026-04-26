/**
 * Regression: `/` must not collapse to marketing safe-mode or global "Just a moment" after hydration.
 *
 * Run from `nursenest-core` with app on BASE_URL (dev or production-like `npm run start`):
 *   npx playwright test tests/e2e/public/homepage-no-safe-mode-after-hydration.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

/** Non-fatal browser quirks occasionally surface as pageerror in automation — extend only with comment. */
const PAGEERROR_ALLOWLIST: RegExp[] = [];

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }, SELECTOR_DISMISSED_LS);
});

test.describe("Homepage stays real after hydration", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("no safe-mode / emergency shell; hero h1 visible; no uncaught pageerror", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => {
      pageErrors.push(err?.message ?? String(err));
    });

    await page.goto("/", { waitUntil: "load", timeout: 120_000 });

    await expect(page.locator('[data-nn-home-safe-mode="1"]')).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^Just a moment$/i })).toHaveCount(0);

    const mainH1 = page.locator("main").getByRole("heading", { level: 1 }).first();
    await expect(mainH1).toBeVisible({ timeout: 30_000 });
    await expect(mainH1).not.toHaveText(/^\s*$/);

    await page.waitForTimeout(2500);

    await expect(page.locator('[data-nn-home-safe-mode="1"]')).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^Just a moment$/i })).toHaveCount(0);
    await expect(mainH1).toBeVisible();

    const fatal = pageErrors.filter((msg) => !PAGEERROR_ALLOWLIST.some((re) => re.test(msg)));
    expect(fatal, `Uncaught page errors: ${fatal.join(" | ")}`).toEqual([]);
  });
});
