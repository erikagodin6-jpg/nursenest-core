import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { getE2eBaseURL } from "../helpers/e2e-env";

const baseURL = getE2eBaseURL();
const evidenceDir = join(process.cwd(), "reports", "ui-evidence");

test.describe("Pre-Nursing marketing hub", () => {
  test("renders premium foundations module grid on /pre-nursing", async ({ page }) => {
    await mkdir(evidenceDir, { recursive: true });
    await page.goto(`${baseURL}/pre-nursing`, { waitUntil: "domcontentloaded", timeout: 180_000 });
    await expect(page.locator("[data-nn-qa-pre-nursing-marketing-hub]")).toBeVisible({ timeout: 120_000 });
    const premium = page.locator("[data-nn-qa-pathway-premium-modules]");
    await expect(premium).toBeVisible();
    await expect(premium.locator('[data-nn-qa-hub-premium-module="pn_lesson_library"]')).toBeVisible();
    await page.screenshot({
      path: join(evidenceDir, "pre-nursing-hub-desktop.png"),
      fullPage: true,
    });
  });

  test("mobile 390: hub and premium grid stay in viewport width", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/pre-nursing`, { waitUntil: "domcontentloaded", timeout: 180_000 });
    await expect(page.locator("[data-nn-qa-pathway-premium-modules]")).toBeVisible({ timeout: 120_000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
    await mkdir(evidenceDir, { recursive: true });
    await page.screenshot({ path: join(evidenceDir, "pre-nursing-hub-mobile.png"), fullPage: true });
  });
});
