/**
 * Pre-Nursing marketing hub: module library, breadcrumbs, quick study modes.
 *
 * Run: `npx playwright test tests/e2e/public/pre-nursing-hub-complete.spec.ts --project=chromium`
 *
 * Saves `pre-nursing-hub-evidence.png` under Playwright's output dir for this test (see HTML report / artifacts).
 */
import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

test.describe("Pre-Nursing hub (public)", () => {
  test("loads module grid, breadcrumbs, quick modes — captures screenshot", async ({ page }, testInfo) => {
    test.setTimeout(600_000);
    const res = await page.goto("/pre-nursing", { waitUntil: "domcontentloaded", timeout: 300_000 });
    expect(res?.ok(), `HTTP ${res?.status()}`).toBeTruthy();

    for (let i = 0; i < 5; i += 1) {
      await page.keyboard.press("Escape");
    }

    const heroCta = page.getByRole("link", { name: /Start free lessons/i });
    await expect(heroCta).toBeVisible({ timeout: 300_000 });
    await expect(page.getByTestId("link-pre-nursing-lessons")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("pre-nursing-card-study-strategies")).toBeVisible();
    await expect(page.getByTestId("pre-nursing-card-anatomy-physiology")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Quick study modes/i })).toBeVisible();
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toBeVisible();

    const outDir = path.join(process.cwd(), "test-results", "pre-nursing-evidence");
    await mkdir(outDir, { recursive: true });
    const evidencePath = path.join(outDir, "pre-nursing-hub-full.png");
    await page.screenshot({ path: evidencePath, fullPage: true });
    await testInfo.attach("pre-nursing-hub-full.png", { path: evidencePath, contentType: "image/png" });
  });
});
