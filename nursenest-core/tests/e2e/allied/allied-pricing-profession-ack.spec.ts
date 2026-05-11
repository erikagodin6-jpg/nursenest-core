/**
 * Allied Health pricing — profession acknowledgement before checkout.
 *
 * Requires a dev server built from this branch (`npm run dev:next` / Playwright webServer).
 * If another process is serving an older `/pricing` bundle on :3000, restart it so these selectors exist.
 */
import { expect, test } from "@playwright/test";

test.describe("Allied pricing — profession acknowledgement", () => {
  test("checkout disabled until acknowledgement; warning visible (desktop)", async ({ page }) => {
    const r = await page.goto("/pricing", { waitUntil: "load", timeout: 120_000 });
    expect(r?.ok(), `HTTP ${r?.status()} for /pricing`).toBeTruthy();

    await expect(page.locator("#pricing-plans-heading")).toBeVisible({ timeout: 60_000 });
    await page.getByRole("button", { name: /^Allied Health$/i }).click();

    const warn = page.getByTestId("pricing-allied-profession-warning");
    await expect(warn).toBeVisible({ timeout: 60_000 });
    await expect(warn.getByRole("listitem")).toHaveCount(3);

    const monthly = page.getByTestId("pricing-checkout-monthly");
    await expect(monthly).toBeDisabled();

    await page.getByTestId("pricing-allied-profession-ack").check();
    await expect(monthly).toBeEnabled();
  });

  test("warning remains visible on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const r = await page.goto("/pricing", { waitUntil: "load", timeout: 120_000 });
    expect(r?.ok(), `HTTP ${r?.status()} for /pricing`).toBeTruthy();

    await page.getByRole("button", { name: /^Allied Health$/i }).click();
    await expect(page.getByTestId("pricing-allied-profession-warning")).toBeVisible({ timeout: 60_000 });
  });
});
