/**
 * Mobile regression — runs under `playwright.mobile.config.ts` (Pixel + iPhone).
 * Marketing smoke; authenticated paid flows live in `mobile-learner-authenticated-layout.spec.ts`.
 */
import { expect, test, type Page } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { measureHorizontalOverflow } from "../helpers/mobile-usability-audit";
import { HEADER_CHROME } from "../helpers/country-selector";
import { MARKETING_PUBLIC_SELECTOR } from "../helpers/navigation-e2e";

const OVERFLOW_TOLERANCE_PX = 4;

async function assertDocumentOverflowSoft(page: Page): Promise<void> {
  const o = await measureHorizontalOverflow(page);
  expect(
    o.document.excess,
    `document horizontal overflow: scrollWidth ${o.document.scrollWidth} vs clientWidth ${o.document.clientWidth}`,
  ).toBeLessThanOrEqual(OVERFLOW_TOLERANCE_PX);
}

test.describe("Mobile regression — marketing", () => {
  test("homepage loads with public chrome and bounded width", async ({ page }) => {
    test.setTimeout(300_000);
    const r = await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(r?.ok(), `HTTP ${r?.status()} for /`).toBeTruthy();
    await dismissMarketingScrims(page);
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
    await expect(page.locator(HEADER_CHROME).first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("button", { name: /open menu/i }).first()).toBeVisible({ timeout: 20_000 });
    await assertDocumentOverflowSoft(page);
  });

  test("pricing loads with main landmark and bounded width", async ({ page }) => {
    test.setTimeout(300_000);
    const r = await page.goto("/pricing", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(r?.ok(), `HTTP ${r?.status()} for /pricing`).toBeTruthy();
    await dismissMarketingScrims(page);
    await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });
    await assertDocumentOverflowSoft(page);
  });
});
