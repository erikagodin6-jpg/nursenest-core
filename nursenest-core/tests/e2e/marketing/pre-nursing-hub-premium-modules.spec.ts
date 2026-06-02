import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { getE2eBaseURL } from "../helpers/e2e-env";

const baseURL = getE2eBaseURL();
const evidenceDir = join(process.cwd(), "reports", "ui-evidence");
const requiredThemes = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;

test.describe("Pre-Nursing marketing hub", () => {
  test("renders premium foundations module grid on /pre-nursing", async ({ page }) => {
    await mkdir(evidenceDir, { recursive: true });
    await page.goto(`${baseURL}/pre-nursing`, { waitUntil: "domcontentloaded", timeout: 180_000 });
    await expect(page.locator("[data-nn-qa-pre-nursing-marketing-hub]")).toBeVisible({ timeout: 120_000 });
    await expect(page.locator("[data-nn-premium-prenursing-hero]")).toBeVisible();
    await expect(page.locator("[data-nn-premium-prenursing-readiness]")).toBeVisible();
    await expect(page.locator("[data-nn-premium-prenursing-quick-modes]")).toBeVisible();
    await expect(page.locator("[data-nn-premium-prenursing-categories]")).toBeVisible();
    await expect(page.locator("[data-nn-premium-prenursing-module-library]")).toBeVisible();
    const premium = page.locator("[data-nn-qa-pathway-premium-modules]");
    await expect(premium).toBeVisible();
    await expect(premium.locator('[data-nn-qa-hub-premium-module="pn_lesson_library"]')).toBeVisible();
    await expect(page.getByRole("heading", { name: "Quick Study Modes" })).toBeVisible();
    await expect(page.getByText("Anatomy & Physiology", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Dosage Calculations", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Nursing School Readiness", { exact: true }).first()).toBeVisible();
    await page.screenshot({
      path: join(evidenceDir, "pre-nursing-hub-desktop.png"),
      fullPage: true,
    });
  });

  test("mobile 390: hub and premium grid stay in viewport width", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/pre-nursing`, { waitUntil: "domcontentloaded", timeout: 180_000 });
    await expect(page.locator("[data-nn-qa-pathway-premium-modules]")).toBeVisible({ timeout: 120_000 });
    await expect(page.locator("[data-nn-premium-prenursing-readiness]")).toBeVisible();
    await expect(page.locator("[data-nn-premium-prenursing-quick-modes]")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
    await mkdir(evidenceDir, { recursive: true });
    await page.screenshot({ path: join(evidenceDir, "pre-nursing-hub-mobile.png"), fullPage: true });
  });

  for (const theme of requiredThemes) {
    test(`theme parity: ${theme} renders premium Pre-Nursing surfaces`, async ({ page }) => {
      await page.goto(`${baseURL}/pre-nursing?theme=${theme}`, { waitUntil: "domcontentloaded", timeout: 180_000 });
      await page.evaluate((nextTheme) => {
        document.documentElement.setAttribute("data-theme", nextTheme);
      }, theme);
      await expect(page.locator("[data-nn-qa-pre-nursing-marketing-hub]")).toBeVisible({ timeout: 120_000 });
      await expect(page.locator("[data-nn-premium-prenursing-readiness]")).toBeVisible();
      await expect(page.locator("[data-nn-premium-prenursing-quick-modes]")).toBeVisible();
      await expect(page.locator("[data-nn-premium-prenursing-categories]")).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);
    });
  }
});
