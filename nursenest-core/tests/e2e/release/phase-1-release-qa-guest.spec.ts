/**
 * Phase 1 — public / auth entry surfaces for the production release gate (no paid storage).
 *
 * @see reports/phase-1-operational-hardening.md
 */
import { expect, test } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { resolveE2eAppBaseUrl } from "../helpers/e2e-env";
import { MARKETING_PUBLIC_SELECTOR } from "../helpers/navigation-e2e";
import { loginWithCredentials } from "../helpers/learner-login";
import { getQaFreeCredentials } from "../helpers/smoke-credentials";

test.describe("Phase 1 — release QA (guest / marketing entry)", () => {
  test("homepage + pricing + signup + login load without fatal shell", async ({ page }) => {
    test.setTimeout(240_000);
    const home = await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(home?.ok(), `HTTP ${home?.status()} for /`).toBeTruthy();
    await dismissMarketingScrims(page);
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 60_000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });

    const pricing = await page.goto("/pricing", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(pricing?.ok(), `HTTP ${pricing?.status()} for /pricing`).toBeTruthy();
    await dismissMarketingScrims(page);
    await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });
    await expect(page.getByRole("heading", { name: /choose your plan/i })).toBeVisible({ timeout: 120_000 });
    /* Scope to main — header nav also has /signup links (often hidden in overflow); `.first()` must not grab those. */
    const pricingMain = page.locator("main");
    const checkoutCta = pricingMain
      .getByRole("link", {
        name: /subscribe|get started|choose plan|choose your plan|select plan|start|upgrade|checkout|continue/i,
      })
      .or(
        pricingMain.getByRole("button", {
          name: /subscribe|get started|choose plan|select plan|checkout|continue/i,
        }),
      )
      .or(pricingMain.locator('a[href*="stripe"], a[href*="checkout"]'))
      .first();
    await expect(checkoutCta).toBeVisible({ timeout: 90_000 });

    const signup = await page.goto("/signup", { waitUntil: "domcontentloaded", timeout: 90_000 });
    expect(signup?.ok(), `HTTP ${signup?.status()} for /signup`).toBeTruthy();
    await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });
    await expect(page.getByRole("textbox", { name: /email/i }).first()).toBeVisible({ timeout: 45_000 });

    const login = await page.goto("/login", { waitUntil: "domcontentloaded", timeout: 90_000 });
    expect(login?.ok(), `HTTP ${login?.status()} for /login`).toBeTruthy();
    await expect(page.getByRole("textbox", { name: /email/i }).first()).toBeVisible({ timeout: 45_000 });
  });

  test("signup route survives mobile viewport (no fatal crash)", async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 390, height: 844 });
    const r = await page.goto("/signup", { waitUntil: "domcontentloaded", timeout: 90_000 });
    expect(r?.ok(), `HTTP ${r?.status()} for /signup mobile`).toBeTruthy();
    await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });
    await expect(page.getByRole("textbox", { name: /email/i }).first()).toBeVisible({ timeout: 45_000 });
    const body = await page.locator("body").innerText().catch(() => "");
    expect(body).not.toMatch(/application error|internal server error|unhandled runtime error/i);
  });

  test("Canada REx-PN hub preserves auth callback into the canonical RPN paid route", async ({ page }) => {
    test.setTimeout(180_000);
    const hub = await page.goto("/canada/pn/rex-pn", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(hub?.ok(), `HTTP ${hub?.status()} for /canada/pn/rex-pn`).toBeTruthy();
    await dismissMarketingScrims(page);
    await expect(page.getByRole("heading", { name: /REx-PN/i }).first()).toBeVisible({ timeout: 60_000 });
    const practiceModule = page
      .locator('[data-nn-qa-hub-premium-module="practice_tests"] a.nn-exam-hub-study-card')
      .first();
    await expect(practiceModule).toBeVisible({ timeout: 60_000 });
    const href = await practiceModule.getAttribute("href");
    const decodedHref = decodeURIComponent(href ?? "");
    expect(decodedHref).toContain("/login");
    expect(decodedHref).toContain("pathwayId=ca-rpn-rex-pn");
    await practiceModule.click();
    await expect(page).toHaveURL(/\/login\?/, { timeout: 60_000 });
    expect(decodeURIComponent(page.url())).toContain("pathwayId=ca-rpn-rex-pn");
  });

  test("unauthenticated user hitting /app/onboarding is redirected toward auth (no blank shell)", async ({
    browser,
    baseURL,
  }) => {
    /* Fresh context — default page may carry cookies/storage from earlier tests in the worker. */
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    try {
      const origin = resolveE2eAppBaseUrl(baseURL);
      /* Prefer transport-level redirect check — client navigations can settle on /app/onboarding while RSC resolves. */
      const redir = await page.request.get(`${origin}/app/onboarding`, { maxRedirects: 0 });
      expect(
        [302, 303, 307, 308],
        `expected onboarding to redirect unauthenticated users (got HTTP ${redir.status()} from ${origin}/app/onboarding)`,
      ).toContain(redir.status());
      const loc = redir.headers()["location"] ?? "";
      expect(loc, `Location should send guests to login/signup, got: ${loc}`).toMatch(/\/(login|signup)/i);

      await page.goto(`${origin}/app/onboarding`, { waitUntil: "domcontentloaded", timeout: 90_000 });
      await expect(page).toHaveURL(/\/(login|signup)(\?|$)/i, { timeout: 45_000 });
      await expect(page.getByRole("textbox", { name: /email/i }).first()).toBeVisible({ timeout: 45_000 });
    } finally {
      await ctx.close();
    }
  });

  test("free-tier account sees clean subscription gate on lessons hub", async ({ page }) => {
    const creds = getQaFreeCredentials();
    test.skip(
      !creds,
      "Credential-gated free learner check will skip: missing E2E_FREE_EMAIL + E2E_FREE_PASSWORD (or QA_FREE_EMAIL + QA_FREE_PASSWORD).",
    );
    await loginWithCredentials(page, creds!.email, creds!.password);
    await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Subscription required" })).toBeVisible({
      timeout: 45_000,
    });
    await expect(page.locator('a[href="/pricing"]').first()).toBeVisible();
  });
});
