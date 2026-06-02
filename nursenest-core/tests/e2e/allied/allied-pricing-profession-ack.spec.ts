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
    await expect(warn).toContainText(/same price/i);
    await expect(warn).toContainText(/occupation-specific/i);

    const scopePanel = page.getByTestId("pricing-tier-scope-panel");
    await expect(scopePanel).toContainText(/one selected occupation only/i);
    await expect(scopePanel).toContainText(/share the same price/i);

    const monthly = page.getByTestId("pricing-checkout-monthly");
    await expect(monthly).toBeDisabled();

    await page.getByTestId("pricing-allied-profession-ack").check();
    await expect(monthly).toBeEnabled();

    await monthly.click();
    await page.waitForURL(/\/login\?/);
    await expect(page).toHaveURL(/checkoutIntent=1/);
    await expect(page).toHaveURL(/checkoutTier=ALLIED/);
    await expect(page).toHaveURL(/checkoutAlliedCareer=paramedic/);
  });

  test("warning remains visible on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const r = await page.goto("/pricing", { waitUntil: "load", timeout: 120_000 });
    expect(r?.ok(), `HTTP ${r?.status()} for /pricing`).toBeTruthy();

    await page.getByRole("button", { name: /^Allied Health$/i }).click();
    await expect(page.getByTestId("pricing-allied-profession-warning")).toBeVisible({ timeout: 60_000 });
  });
});
