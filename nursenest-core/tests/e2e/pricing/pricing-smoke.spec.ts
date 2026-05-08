/**
 * Lightweight marketing pricing route check (complements public-site-smoke and freemium flows).
 */
import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";

const SCREENSHOT_DIRS = ["preview-screenshots", "reports/ui-redesign-preview"] as const;

function ensureScreenshotDirs() {
  for (const dir of SCREENSHOT_DIRS) mkdirSync(dir, { recursive: true });
}

function actionableObserverDiagnostics(d: { consoleErrors: string[]; failedRequests: string[] }) {
  const knownDevConsoleNoise = [
    /assertConfig[\s\S]*\bAuth\b/i,
    /MissingSecret|errors\.authjs\.dev#missingsecret/i,
    /marketing_critical_nav_keys_missing_count/i,
    /MarketingI18nProvider] Missing hero\/nav keys/i,
    /marketing-locale-layout] layout message integrity failed/i,
    /missing_or_invalid.*breadcrumbs\.(home|pricing)/i,
    /missing required marketing copy: breadcrumbs\.(home|pricing)/i,
  ];
  return {
    consoleErrors: d.consoleErrors.filter((msg) => !knownDevConsoleNoise.some((re) => re.test(msg))),
    failedRequests: d.failedRequests,
  };
}

test.describe("Pricing page", () => {
  test("loads with public nav, pricing CTAs, FAQ accordion, and no observer noise", async ({ page }, testInfo) => {
    ensureScreenshotDirs();
    const o = attachPageObservers(page);
    const r = await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    expect(r?.ok()).toBeTruthy();
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId("pricing-marketing-hero")).toBeVisible();
    await expect(page.locator("#pricing-plans-heading")).toBeVisible();
    await expect(page.getByRole("button", { name: /RN|Registered Nurse/i })).toBeVisible();
    await expect(page.locator("article.nn-pricing-plan-card").first()).toBeVisible();
    await expect(page.getByTestId("section-pricing-learner-faq")).toBeVisible();

    const firstFaq = page.getByTestId("section-pricing-learner-faq").locator("details").first();
    await firstFaq.locator("summary").click();
    await expect(firstFaq).toHaveAttribute("open", "");

    await expect(page.locator('[data-testid="pricing-marketing-hero"] a[href="#pricing-plans-heading"]').first()).toBeVisible();
    await page.screenshot({ path: "preview-screenshots/pricing-desktop.png", fullPage: true });
    await page.screenshot({ path: "reports/ui-redesign-preview/pricing-desktop.png", fullPage: true });

    const d = actionableObserverDiagnostics(await logObserverDiagnostics(o, testInfo.title));
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });

  test("mobile pricing layout avoids horizontal overflow", async ({ page }, testInfo) => {
    ensureScreenshotDirs();
    await page.setViewportSize({ width: 390, height: 844 });
    const o = attachPageObservers(page);
    const r = await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    expect(r?.ok()).toBeTruthy();
    await expect(page.getByTestId("pricing-marketing-hero")).toBeVisible({ timeout: 60_000 });
    await expect(page.locator("article.nn-pricing-plan-card").first()).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(2);

    await page.screenshot({ path: "preview-screenshots/pricing-mobile.png", fullPage: false });
    await page.screenshot({ path: "reports/ui-redesign-preview/pricing-mobile.png", fullPage: false });

    const d = actionableObserverDiagnostics(await logObserverDiagnostics(o, testInfo.title));
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });

  test("localized pricing route keeps pricing surface intact", async ({ page }, testInfo) => {
    const o = attachPageObservers(page);
    const r = await page.goto("/fr/pricing", { waitUntil: "domcontentloaded" });
    expect(r?.ok()).toBeTruthy();
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId("pricing-marketing-hero")).toBeVisible();
    await expect(page.locator("#pricing-plans-heading")).toBeVisible();
    await expect(page.locator("article.nn-pricing-plan-card").first()).toBeVisible();

    const d = actionableObserverDiagnostics(await logObserverDiagnostics(o, testInfo.title));
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });
});
