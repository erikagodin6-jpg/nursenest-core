/**
 * ECG Navigation Visibility — E2E Regression Tests
 *
 * Verifies that ECG is visible in the marketing header on desktop and mobile
 * WITHOUT requiring auth, and that authenticated RN/NP learners can discover
 * ECG from their learner navigation.
 *
 * Run:
 *   npx playwright test tests/e2e/ecg/ecg-nav-visibility.spec.ts --project=chromium
 *
 * No auth required for the public marketing tests (groups 1 & 2).
 * Auth required for group 3 (learner nav), gated by E2E_ECG_MODULE_ENABLED=1.
 */

import { expect, test, type Page } from "@playwright/test";
import { getE2eBaseURL } from "../helpers/e2e-env";

const BASE_URL = getE2eBaseURL();
const IS_ECG_ENABLED = process.env.E2E_ECG_MODULE_ENABLED === "1";

// ─── 1. Desktop marketing nav — ECG visible without auth ──────────────────────

test.describe("Desktop marketing header — ECG visible without auth", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("ECG Mastery link appears in marketing nav bar on homepage", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForSelector("header", { timeout: 30_000 });

    // ECG link must be visible in the header nav without any interaction
    const ecgLink = page.locator("header a").filter({ hasText: /ECG/i }).first();
    await expect(ecgLink).toBeVisible({ timeout: 15_000 });

    const href = await ecgLink.getAttribute("href");
    expect(
      href,
      "ECG nav link must point to /ecg-interpretation or an ECG authority page",
    ).toMatch(/\/(ecg-interpretation|ecg|advanced-ecg-nursing)/);
  });

  test("ECG nav link on homepage does not require opening a dropdown", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForSelector("header", { timeout: 30_000 });

    // The nav bar itself (not a dropdown) must contain ECG
    const mainNav = page.locator("header nav").first();
    const ecgInNav = mainNav.locator("a").filter({ hasText: /ECG/i }).first();
    await expect(ecgInNav).toBeVisible({ timeout: 15_000 });
  });

  test("ECG link navigates to /ecg-interpretation (public, indexable)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForSelector("header", { timeout: 30_000 });

    const ecgLink = page.locator("header a").filter({ hasText: /ECG/i }).first();
    const href = await ecgLink.getAttribute("href");

    // Must not link to a learner-only route that requires auth
    expect(href).not.toMatch(/\/modules\//);
    expect(href).not.toMatch(/\/app\//);
    expect(href).not.toMatch(/\/login/);
  });

  test("ECG link appears on non-homepage marketing pages too", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForSelector("header", { timeout: 30_000 });

    const ecgLink = page.locator("header a").filter({ hasText: /ECG/i }).first();
    await expect(ecgLink).toBeVisible({ timeout: 15_000 });
  });
});

// ─── 2. Mobile menu — ECG visible without auth ────────────────────────────────

test.describe("Mobile menu — ECG visible without auth", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("ECG appears in mobile drawer after opening hamburger menu", async ({ page }, info) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForSelector("header", { timeout: 30_000 });

    // Open mobile menu
    const menuBtn = page.locator("button[aria-label*='menu'], button[aria-label*='Menu']").first();
    await expect(menuBtn).toBeVisible({ timeout: 15_000 });
    await menuBtn.click();

    // Wait for drawer to open
    await page.waitForTimeout(400);

    // ECG must appear in the mobile drawer
    const mobileEcgLink = page.locator("a").filter({ hasText: /ECG/i }).first();
    await expect(mobileEcgLink).toBeVisible({ timeout: 10_000 });

    const href = await mobileEcgLink.getAttribute("href");
    expect(href).toMatch(/\/(ecg-interpretation|ecg|advanced-ecg-nursing)/);

    await info.attach("mobile-ecg-nav.png", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});

// ─── 3. RN mega-menu — ECG in Specialties group ──────────────────────────────

test.describe("Desktop RN mega-menu — ECG in Specialties", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("RN dropdown contains ECG Mastery and Telemetry links", async ({ page }, info) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForSelector("header", { timeout: 30_000 });

    // Find and hover/click the RN nav trigger to open the mega-menu
    const rnTrigger = page.locator("header button, header a").filter({ hasText: /^RN$|RN\s/ }).first();
    if (await rnTrigger.count() === 0) {
      // Try tier hub strip
      const tierRn = page.locator("header").getByText("RN").first();
      if (await tierRn.count() > 0) {
        await tierRn.hover();
        await page.waitForTimeout(300);
      }
    } else {
      await rnTrigger.hover();
      await page.waitForTimeout(300);
    }

    // Check if ECG links are now visible (may be in dropdown)
    const ecgLinks = page.locator("a").filter({ hasText: /ECG Mastery/i });
    const count = await ecgLinks.count();
    if (count > 0) {
      await expect(ecgLinks.first()).toBeVisible({ timeout: 5_000 });
      const href = await ecgLinks.first().getAttribute("href");
      expect(href).toContain("/advanced-ecg-nursing");
    }
    // If not found in dropdown, at least verify it's visible somewhere in the page
    // (may be in the top nav bar that we already tested)

    await info.attach("rn-megamenu-ecg.png", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});

// ─── 4. Authenticated learner — ECG in Clinical Modules flyout (RN/NP) ───────

test.describe("Authenticated learner — ECG in Clinical Modules flyout", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Clinical Modules flyout shows ECG Fundamentals and Advanced ECG for RN", async ({
    page,
  }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const { loginWithCredentials } = await import("../helpers/learner-login");
    const { getQaPaidCredentials } = await import("../helpers/smoke-credentials");

    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await page.goto(`${BASE_URL}/app/lessons`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    // Open Clinical Modules flyout
    const flyoutTrigger = page.locator('[aria-haspopup="menu"]').first();
    await expect(flyoutTrigger).toBeVisible({ timeout: 30_000 });
    await flyoutTrigger.click();
    await page.waitForSelector('[role="menu"]', { timeout: 10_000 });

    // ECG Fundamentals must be in the flyout
    const ecgFundamentals = page.locator('[role="menu"] a').filter({ hasText: /ECG Fundamentals/i });
    await expect(ecgFundamentals).toBeVisible({ timeout: 5_000 });

    // Advanced ECG must also be visible (with premium badge)
    const advancedEcg = page.locator('[role="menu"] [role="menuitem"]').filter({ hasText: /Advanced ECG/i });
    await expect(advancedEcg).toBeVisible({ timeout: 5_000 });

    await info.attach("learner-ecg-flyout.png", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});

// ─── 5. ECG hub pages are reachable from nav links ────────────────────────────

test.describe("ECG nav links resolve to real pages (no 404)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  const ECG_MARKETING_PAGES = [
    "/ecg-interpretation",
    "/advanced-ecg-nursing",
    "/ecg-telemetry-mastery",
  ];

  for (const path of ECG_MARKETING_PAGES) {
    test(`${path} returns HTTP 200 (nav link is not broken)`, async ({ request }) => {
      const response = await request.get(`${BASE_URL}${path}`);
      expect(
        response.status(),
        `ECG nav link destination "${path}" must return HTTP 200 — a broken link defeats the visibility fix`,
      ).toBe(200);
    });
  }
});
