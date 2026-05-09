/**
 * Phase 1 learner dashboard: hero shell + readiness/next-action strip stability.
 *
 * Requires stored paid session (`setup-paid-auth` -> `chromium-paid`):
 *
 * ```
 * npx playwright test --project=chromium-paid tests/e2e/paid-user/learner-dashboard-phase1-hero-readiness.spec.ts
 * ```
 */
import { expect, test, type Page } from "@playwright/test";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";
import { learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";

function attachPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (err) => {
    errors.push(err.stack ?? err.message);
  });
  return errors;
}

test.describe("Paid user — dashboard Phase 1 hero + readiness strip", () => {
  test.skip(!getPaidTestCredentials(), "Requires E2E paid credentials (see paid-test-credentials.ts)");

  test("readiness strip, overflow, themes, 5s stability", async ({ page }) => {
    test.setTimeout(120_000);
    const pageErrors = attachPageErrors(page);

    await page.goto("/app", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);

    await expect(page.getByTestId("learner-dashboard-shell")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("learner-dashboard-readiness-strip")).toBeVisible({ timeout: 45_000 });

    const main = learnerAppMainLandmark(page);
    await expect(main).toBeVisible();

    const desktopOverflow = await main.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    expect(desktopOverflow, "learner main should not horizontally overflow (desktop)").toBe(false);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expect(page.getByTestId("learner-dashboard-readiness-strip")).toBeVisible({ timeout: 45_000 });
    const mobileOverflow = await main.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    expect(mobileOverflow, "learner main should not horizontally overflow (mobile)").toBe(false);

    for (const theme of ["ocean", "midnight", "blossom"] as const) {
      await page.evaluate((id) => document.documentElement.setAttribute("data-theme", id), theme);
      const attr = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
      expect(attr).toBe(theme);
      await expect(page.getByTestId("learner-dashboard-readiness-strip")).toBeVisible();
      await expect(main.getByRole("heading", { level: 1 }).first()).toBeVisible();
    }

    await page.waitForTimeout(5_000);
    expect(pageErrors, pageErrors.join("\n---\n")).toEqual([]);
  });
});
