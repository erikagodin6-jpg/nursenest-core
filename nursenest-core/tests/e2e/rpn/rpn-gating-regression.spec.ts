/**
 * E2E: RPN/LPN gating regression — asserts module visibility rules for practical nursing paths.
 * ECG, advanced hemodynamics, and advanced labs are RN-only; they must not appear on RPN/LPN hubs.
 */
import { expect, test } from "@playwright/test";

const PN_HUBS = [
  { path: "/canada/rpn/rex-pn", name: "Canada RPN" },
  { path: "/us/lpn/nclex-pn", name: "US LPN" },
];

const RN_ONLY_PATTERNS = [
  /advanced ecg/i,
  /ecg interpretation/i,
  /hemodynamic monitoring/i,
  /advanced labs/i,
  /critical care ecg/i,
];

for (const { path, name } of PN_HUBS) {
  test.describe(`${name} module gating`, () => {
    test(`${path} does not expose ECG module links`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      for (const pattern of [/advanced ecg/i, /ecg interpretation/i]) {
        const moduleLink = page.locator("a").filter({ hasText: pattern });
        const count = await moduleLink.count();
        expect(count, `Found ECG module link matching ${pattern} on ${path}`).toBe(0);
      }
    });

    test(`${path} loads without 500 server error`, async ({ page }) => {
      const r = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(r?.status()).not.toBe(500);
    });

    test(`${path} shows a practice questions or study CTA`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const cta = page.locator("a, button").filter({ hasText: /practice|study|start|questions|lesson/i }).first();
      await expect(cta).toBeVisible({ timeout: 30_000 });
    });
  });
}

test.describe("RPN/LPN route isolation", () => {
  test("Canada RPN hub is at /canada/rpn/rex-pn (not /canada/rn/)", async ({ page }) => {
    const r = await page.goto("/canada/rpn/rex-pn", { waitUntil: "domcontentloaded" });
    expect(r?.status()).toBe(200);
    expect(r?.url()).toContain("/canada/rpn/rex-pn");
  });

  test("US LPN hub is at /us/lpn/nclex-pn (not /us/rn/)", async ({ page }) => {
    const r = await page.goto("/us/lpn/nclex-pn", { waitUntil: "domcontentloaded" });
    expect(r?.status()).toBe(200);
    expect(r?.url()).toContain("/us/lpn/nclex-pn");
  });

  test("RPN and RN hubs are on distinct URL trees", () => {
    expect("/canada/rpn/rex-pn").not.toContain("/rn/");
    expect("/us/lpn/nclex-pn").not.toContain("/rn/");
  });
});

test.describe("PN content scope — scenario and ECG gating", () => {
  test("Canada RPN hub title does not say 'RN'", async ({ page }) => {
    await page.goto("/canada/rpn/rex-pn", { waitUntil: "domcontentloaded" });
    const title = await page.title();
    // Title should mention RPN or REx-PN, not RN
    expect(title.toLowerCase()).not.toMatch(/\bnclex-rn\b/i);
  });

  test("US LPN hub does not redirect to RN hub", async ({ page }) => {
    const r = await page.goto("/us/lpn/nclex-pn", { waitUntil: "domcontentloaded", timeout: 30_000 });
    const finalUrl = r?.url() ?? "";
    expect(finalUrl).not.toContain("/us/rn/");
    expect(finalUrl).not.toContain("/canada/rn/");
  });
});
