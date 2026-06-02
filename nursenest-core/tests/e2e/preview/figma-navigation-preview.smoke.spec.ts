import { expect, test } from "@playwright/test";

test.describe("figma navigation preview routes", () => {
  test("each variant renders exactly one primary preview header band", async ({ page }) => {
    for (const v of ["a", "b", "c"] as const) {
      await page.goto(`/preview/figma-navigation/${v}?auth=anon`);
      await expect(page.locator(`header[data-preview-nav-variant="${v}"]`)).toHaveCount(1);
      await expect(page.locator(`header[data-preview-nav-variant="${v}"]`)).toBeVisible();
    }
  });

  test("learner auth mode switches CTA cluster", async ({ page }) => {
    await page.goto("/preview/figma-navigation/a?auth=learner");
    await expect(page.locator('[data-preview-auth="learner"] a[href="/app"]').first()).toBeVisible();
    await page.goto("/preview/figma-navigation/a?auth=anon");
    await expect(page.locator('[data-preview-auth="anon"] a[href="/login"]').first()).toBeVisible();
  });
});
