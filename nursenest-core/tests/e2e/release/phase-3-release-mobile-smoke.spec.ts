/**
 * Phase 3 — minimal mobile viewport checks in the release gate (Pixel 7 project).
 */
import { expect, test } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { MARKETING_PUBLIC_SELECTOR } from "../helpers/navigation-e2e";
test.describe("Phase 3 — release mobile smoke", () => {
  test("homepage + pricing render without horizontal overflow signal", async ({ page }) => {
    test.setTimeout(180_000);
    const home = await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(home?.ok(), `HTTP ${home?.status()} for / (mobile)`).toBeTruthy();
    await dismissMarketingScrims(page);
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 60_000 });

    const pricing = await page.goto("/pricing", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(pricing?.ok(), `HTTP ${pricing?.status()} for /pricing (mobile)`).toBeTruthy();
    await dismissMarketingScrims(page);
    await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });
    const body = await page.locator("body").innerText().catch(() => "");
    expect(body).not.toMatch(/application error|internal server error|unhandled runtime error/i);
  });
});
