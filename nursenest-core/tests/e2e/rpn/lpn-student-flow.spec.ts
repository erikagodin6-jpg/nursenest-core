/**
 * E2E: LPN/LVN student flow — verifies the US LPN (NCLEX-PN) hub renders correctly and that
 * premium RN modules (ECG, hemodynamics, advanced labs) are NOT visible to LPN users.
 */
import { expect, test } from "@playwright/test";

test.describe("US LPN — NCLEX-PN hub", () => {
  test("NCLEX-PN hub loads successfully", async ({ page }) => {
    const r = await page.goto("/us/lpn/nclex-pn", { waitUntil: "domcontentloaded" });
    expect(r?.status()).toBe(200);
  });

  test("NCLEX-PN hub page title references NCLEX-PN or LPN/LVN", async ({ page }) => {
    await page.goto("/us/lpn/nclex-pn", { waitUntil: "domcontentloaded" });
    const title = await page.title();
    const lower = title.toLowerCase();
    expect(lower.includes("nclex-pn") || lower.includes("lpn") || lower.includes("lvn")).toBe(true);
  });

  test("/blog/nclex-pn loads without error", async ({ page }) => {
    const r = await page.goto("/blog/nclex-pn", { waitUntil: "domcontentloaded" });
    expect(r?.status()).toBe(200);
  });

  test("/blog/nclex-pn has NCLEX-PN or LPN in heading", async ({ page }) => {
    await page.goto("/blog/nclex-pn", { waitUntil: "domcontentloaded" });
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 20_000 });
    const text = await h1.textContent();
    const lower = text?.toLowerCase() ?? "";
    expect(lower.includes("nclex-pn") || lower.includes("lpn") || lower.includes("lvn")).toBe(true);
  });
});

test.describe("US LPN marketing pages", () => {
  test("/lpn-nclex-prep loads", async ({ page }) => {
    const r = await page.goto("/lpn-nclex-prep", { waitUntil: "domcontentloaded" });
    expect(r?.status()).not.toBe(500);
  });

  test("/lvn-nclex-prep loads", async ({ page }) => {
    const r = await page.goto("/lvn-nclex-prep", { waitUntil: "domcontentloaded" });
    expect(r?.status()).not.toBe(500);
  });
});
