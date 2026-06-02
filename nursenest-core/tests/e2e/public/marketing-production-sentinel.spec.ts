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
      expect(body, `${path}: no i18n humanized pricing stubs`).not.toContain("value1 title");
      expect(body, `${path}: no i18n humanized pricing stubs`).not.toContain("included heading");
      expect(body, `${path}: no i18n humanized pricing stubs`).not.toContain("worth it question");

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

  test("pricing — conversion clarity section uses real English copy (not humanized stubs)", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "load", timeout: 90_000 });
    await dismissMarketingScrims(page);
    const clarity = page.getByTestId("section-pricing-conversion-clarity");
    await expect(clarity).toContainText("Straight Answers Before You Subscribe");
    await expect(clarity).toContainText("Pathway-scoped study depth");
  });

  test("pricing — anonymous options payload includes display totals (Stripe-backed labels)", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "domcontentloaded", timeout: 90_000 });
    await dismissMarketingScrims(page);
    const res = await page.waitForResponse(
      (r) => r.url().includes("/api/pricing/options") && r.request().method() === "GET",
      { timeout: 60_000 },
    );
    expect(res.ok(), "/api/pricing/options should return 200").toBeTruthy();
    const body = (await page.locator("body").innerText()).toLowerCase();
    expect(body, "pricing cards should render Stripe-derived CAD totals").toMatch(/\$\s*\d+\.\d{2}\s*cad/);
  });
});

test.describe("Marketing pricing header polish", () => {
  test.use({ viewport: { width: 1536, height: 900 } });

  test("pricing — wide desktop shows New Grad and Allied in the lower tier row (no desktop More Tracks)", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "load", timeout: 90_000 });
    await dismissMarketingScrims(page);
    await expect(page.getByRole("button", { name: "New Grad" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Allied" })).toBeVisible();
    await expect(page.locator(".nn-header-hide-until-xl").getByRole("button", { name: /more tracks/i })).toHaveCount(0);
  });

  test("pricing — marketing hero shows a region currency line", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "load", timeout: 90_000 });
    await dismissMarketingScrims(page);
    const hero = page.getByTestId("pricing-marketing-hero");
    await expect(hero).toBeVisible();
    await expect(hero).toContainText(/Canadian dollars|U\.S\. dollars/);
  });
});
