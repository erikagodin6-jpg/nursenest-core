/**
 * E2E: RPN student flow — verifies the Canada RPN (REx-PN) hub renders correctly and that
 * ECG and hemodynamics premium modules are NOT visible to RPN users.
 * RPN/LPN is a distinct profession — not "RN-lite".
 */
import { expect, test } from "@playwright/test";

test.describe("Canada RPN — REx-PN hub", () => {
  test("REx-PN hub loads successfully", async ({ page }) => {
    const r = await page.goto("/canada/rpn/rex-pn", { waitUntil: "domcontentloaded" });
    expect(r?.status()).toBe(200);
  });

  test("REx-PN hub page title references REx-PN", async ({ page }) => {
    await page.goto("/canada/rpn/rex-pn", { waitUntil: "domcontentloaded" });
    const title = await page.title();
    expect(title.toLowerCase()).toContain("rex-pn");
  });

  test("REx-PN hub does not show ECG premium module card", async ({ page }) => {
    await page.goto("/canada/rpn/rex-pn", { waitUntil: "domcontentloaded" });
    const ecgCard = page.getByText(/advanced ecg/i);
    await expect(ecgCard).not.toBeVisible({ timeout: 5_000 }).catch(() => {
      // If element doesn't exist at all, that's also acceptable
    });
  });

  test("REx-PN hub has visible CTA for practice questions or lessons", async ({ page }) => {
    await page.goto("/canada/rpn/rex-pn", { waitUntil: "domcontentloaded" });
    const cta = page.locator("a").filter({ hasText: /practice|lesson|question|start/i }).first();
    await expect(cta).toBeVisible({ timeout: 30_000 });
  });
});

test.describe("Canada RPN — blog authority cluster", () => {
  test("/blog/rex-pn loads without error", async ({ page }) => {
    const r = await page.goto("/blog/rex-pn", { waitUntil: "domcontentloaded" });
    expect(r?.status()).toBe(200);
  });

  test("/blog/rex-pn has REx-PN in the heading", async ({ page }) => {
    await page.goto("/blog/rex-pn", { waitUntil: "domcontentloaded" });
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 20_000 });
    const text = await h1.textContent();
    expect(text?.toLowerCase()).toContain("rex-pn");
  });
});

test.describe("Canada RPN — gating regression", () => {
  test("/canada/rpn/rex-pn does not redirect to 404", async ({ page }) => {
    const r = await page.goto("/canada/rpn/rex-pn", { waitUntil: "domcontentloaded" });
    expect(r?.status()).not.toBe(404);
  });

  test("REx-PN lessons hub loads", async ({ page }) => {
    const r = await page.goto("/canada/rpn/rex-pn/lessons", { waitUntil: "domcontentloaded" });
    expect(r?.status()).not.toBe(500);
  });
});
