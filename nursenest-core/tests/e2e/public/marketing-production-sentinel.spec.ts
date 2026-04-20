/**
 * Fails CI / pre-deploy if public marketing surfaces show placeholder copy, stuck pricing text,
 * duplicate headers, or anonymous /admin is not a redirect (RBAC still server-enforced).
 *
 * Run from nursenest-core:
 *   npx playwright test tests/e2e/public/marketing-production-sentinel.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* private mode */
    }
  }, SELECTOR_DISMISSED_LS);
});

test.describe("Marketing production sentinels", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("home, pricing, login — no placeholders, single header, html lang en", async ({ page }) => {
    for (const path of ["/", "/pricing", "/login"] as const) {
      await page.goto(path, { waitUntil: "load", timeout: 90_000 });
      await dismissMarketingScrims(page);

      const lang = await page.locator("html").getAttribute("lang");
      expect(lang?.toLowerCase().startsWith("en"), `${path}: html lang should default to English`).toBe(true);

      const body = (await page.locator("body").innerText()).toLowerCase();
      expect(body, `${path}: no lorem`).not.toContain("lorem ipsum");
      expect(body, `${path}: no loading pricing stuck`).not.toContain("loading pricing");
      expect(body, `${path}: no raw missing markers`).not.toMatch(/\[missing:/i);

      const headers = await page.locator("header.nn-header-animate-in").count();
      expect(headers, `${path}: at most one primary marketing header`).toBeLessThanOrEqual(1);
    }
  });

  test("admin route — unauthenticated users get redirect, not dashboard shell", async ({ page }) => {
    const res = await page.goto("/admin", { waitUntil: "commit", timeout: 60_000 });
    const status = res?.status() ?? 0;
    expect(status, "/admin should redirect when anonymous").toBeGreaterThanOrEqual(300);
    expect(status, "/admin should redirect when anonymous").toBeLessThan(400);
  });
});
