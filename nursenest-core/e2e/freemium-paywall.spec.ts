/**
 * Free-tier paywall + upgrade flows (requires `chromium-free` + `setup-free-auth`).
 *
 * Env: E2E_FREE_EMAIL, E2E_FREE_PASSWORD
 * Run: npm run qa:freemium:browser
 */
import { expect, test } from "@playwright/test";

test.describe("Freemium paywalls & upgrade paths", () => {
  test("lessons hub: subscription gate, lesson preview lock copy, pricing CTA", async ({ page }) => {
    await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Subscription required" })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/NurseNest subscription/i).first()).toBeVisible();
    const pricing = page.locator('a[href="/pricing"]');
    await expect(pricing.first()).toBeVisible();
    await expect(pricing.first()).toHaveAttribute("href", "/pricing");

    await expect(page.getByRole("heading", { name: "Lesson preview" })).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText(/Full lesson bodies unlock with a subscription/i)).toBeVisible();
  });

  test("question bank: paywall, peek loads, rationales locked after check (or empty-state plans)", async ({
    page,
  }) => {
    await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Subscription required" }).first()).toBeVisible({
      timeout: 30_000,
    });

    await expect(page.locator('a[href="/pricing"]').first()).toBeVisible();

    // Peek loads async (API); accept either interactive preview or empty-pool upgrade path
    await page.waitForFunction(
      () => {
        const t = document.body?.innerText ?? "";
        return (
          t.includes("Try a few questions") ||
          t.includes("Complimentary preview") ||
          t.includes("View plans")
        );
      },
      null,
      { timeout: 120_000 },
    );

    const checkBtn = page.getByRole("button", { name: /^Check answer$/i });
    if (await checkBtn.isVisible().catch(() => false)) {
      const firstPick = page.locator(".nn-qopt-list").first().locator("button, label").first();
      await expect(firstPick).toBeVisible({ timeout: 15_000 });
      await firstPick.click();
      await checkBtn.click();
      await expect(page.getByRole("link", { name: /^Unlock rationales$/i })).toBeVisible({ timeout: 30_000 });
      await expect(page.getByText(/Full step-by-step explanations/i)).toBeVisible();
    } else {
      await expect(page.getByRole("link", { name: /View plans/i })).toBeVisible({ timeout: 15_000 });
    }
  });

  test("pricing page loads from marketing route", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main, [role='main'], article").first()).toBeVisible({ timeout: 30_000 });
    await expect(page.url()).toMatch(/\/pricing/);
  });

  test("paywall primary CTA navigates to pricing", async ({ page }) => {
    await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
    await page.locator('a[href="/pricing"]').first().click();
    await page.waitForURL(/\/pricing/, { timeout: 30_000 });
    await expect(page).toHaveURL(/\/pricing/);
  });
});
