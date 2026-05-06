import { expect, test } from "@playwright/test";

test.describe("Public - blog tag article routing", () => {
  test("tag results navigate to canonical blog article pages", async ({ page }) => {
    const response = await page.goto("/blog/tag/pathophysiology", {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    expect(response?.status(), "HTTP status for /blog/tag/pathophysiology").toBeLessThan(400);

    const firstPostLink = page.locator('main li a[href^="/blog/"]').first();
    const articleTitle = (await firstPostLink.textContent())?.trim();
    const href = await firstPostLink.getAttribute("href");

    expect(href, "first tag result href").toMatch(/^\/blog\/[^/?#]+$/);
    expect(articleTitle, "first tag result title").toBeTruthy();

    await Promise.all([
      page.waitForURL(/\/blog\/[^/?#]+$/, { timeout: 90_000 }),
      firstPostLink.click(),
    ]);
    await expect(page.getByText("Just a moment")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: articleTitle! })).toBeVisible();
  });
});
