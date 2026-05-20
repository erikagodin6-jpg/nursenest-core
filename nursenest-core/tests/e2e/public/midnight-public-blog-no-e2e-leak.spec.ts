/**
 * Midnight theme shell + guarantee public marketing never surfaces automated blog E2E artifacts
 * (`bloge2e*`, deterministic "Runtime …" QA titles).
 *
 * Run (from nursenest-core/):
 *   npx playwright test tests/e2e/public/midnight-public-blog-no-e2e-leak.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key: string) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }, SELECTOR_DISMISSED_LS);
});

test.describe("Midnight theme + public blog E2E exclusion", () => {
  test.describe.configure({ retries: 1 });
  test.use({ viewport: { width: 1280, height: 900 } });

  test("Midnight: marketing-row4 header (Ocean layout parity), key surfaces render, no bloge2e strings", async ({
    page,
  }, testInfo) => {
    // Multi-route marketing audit + full-page screenshots can exceed the default 180s Playwright timeout on cold dev.
    test.setTimeout(480_000);
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await dismissMarketingScrims(page);

    await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({ timeout: 60_000 });

    const themeButton = page.getByRole("button", { name: /^Theme\b/i }).first();
    await expect(themeButton).toBeVisible({ timeout: 30_000 });
    await themeButton.click();
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 5000 });
    await page.getByRole("option", { name: /Midnight/i }).first().click();
    await page.waitForTimeout(200);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "midnight");

    const header = page.locator("header").first();
    await expect(header).toBeVisible();
    await expect(header).toHaveAttribute("data-nn-header-layout", "marketing-row4");

    await expect(page.getByRole("navigation").first()).toBeVisible();

    const homeLower = (await page.locator("body").innerText()).toLowerCase();
    expect(homeLower, "homepage body must not list E2E blog artifacts").not.toContain("bloge2e");

    await testInfo.attach("midnight-home-full", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    await page.goto("/pricing", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await dismissMarketingScrims(page);
    await expect(page.locator("main, [role='main'], body").first()).toBeVisible({ timeout: 60_000 });
    await testInfo.attach("midnight-pricing", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    await page.goto("/us/rn/nclex-rn/lessons", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await dismissMarketingScrims(page);
    await expect(page.locator("body")).toBeVisible({ timeout: 60_000 });
    await testInfo.attach("midnight-rn-lessons", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    await page.goto("/blog", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await dismissMarketingScrims(page);
    await expect(page.locator("body")).toBeVisible({ timeout: 120_000 });
    const blogLower = (await page.locator("body").innerText()).toLowerCase();
    expect(blogLower, "/blog must not show bloge2e").not.toContain("bloge2e");
    expect(blogLower).not.toContain("runtime en scheduled");
    expect(blogLower).not.toContain("runtime en published");
    expect(blogLower).not.toContain("runtime draft scheduled");
    await testInfo.attach("midnight-blog-index", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await dismissMarketingScrims(page);
    const footerBlog = page.locator('footer a[href^="/blog"]');
    const n = await footerBlog.count();
    for (let i = 0; i < n; i++) {
      const t = ((await footerBlog.nth(i).innerText()) || "").toLowerCase();
      expect(t).not.toContain("bloge2e");
    }
  });
});
