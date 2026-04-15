/**
 * Lightweight marketing pricing route check (complements public-site-smoke and freemium flows).
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";

test.describe("Pricing page", () => {
  test("loads with public nav and no observer noise", async ({ page }, testInfo) => {
    const o = attachPageObservers(page);
    const r = await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    expect(r?.ok()).toBeTruthy();
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });
});
