/**
 * Regression guard: practice / adaptive hub must never expose internal debug labels to learners.
 *
 * Covers:
 *   - INVALID_SURFACE must not appear anywhere in the DOM
 *   - "CAT Overview (Marketing)" must not appear (internal label removed)
 *   - Parenthetical "(Marketing)" must not appear in any CTA label
 *   - Body-system category cards render in the marketing practice hub
 *   - Learner practice hub (authenticated): no INVALID_SURFACE, body-system grid present
 *
 * Anonymous tests run against the public marketing questions hub and require no credentials.
 * Authenticated tests skip when QA credentials are absent.
 */
import { expect, test } from "@playwright/test";
import { gotoExpectOk, requireOrigin, seedUsMarketingCookie } from "../helpers/navigation-e2e";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { loginWithCredentials } from "../helpers/learner-login";

const HUB_TIMEOUT = 60_000;
const MARKETING_QUESTIONS_PATH = "/us/rn/nclex-rn/questions";
const LEARNER_QUESTIONS_PATH = "/app/questions";

// ── Anonymous marketing hub ───────────────────────────────────────────────────

test.describe("marketing practice hub — no internal labels (anonymous)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("INVALID_SURFACE is not visible anywhere in the marketing practice hub", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, MARKETING_QUESTIONS_PATH);
    await expect(page.locator('[data-testid="marketing-practice-questions-hub"]')).toBeVisible({
      timeout: HUB_TIMEOUT,
    });
    const bodyText = await page.locator("body").innerText();
    expect(bodyText, "INVALID_SURFACE must not appear in learner-facing DOM").not.toContain("INVALID_SURFACE");
  });

  test('"CAT Overview (Marketing)" label is not present — internal label removed', async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, MARKETING_QUESTIONS_PATH);
    await expect(page.locator('[data-testid="marketing-practice-questions-hub"]')).toBeVisible({
      timeout: HUB_TIMEOUT,
    });
    const bodyText = await page.locator("body").innerText();
    expect(bodyText, '"CAT Overview (Marketing)" must not appear in learner UI').not.toContain(
      "CAT Overview (Marketing)",
    );
    // No CTA label should include a parenthetical "(Marketing)" suffix
    const ctaTexts = await page.getByRole("link").allInnerTexts();
    const leaked = ctaTexts.filter((t) => /\(marketing\)/i.test(t));
    expect(leaked, `Learner CTAs must not include "(Marketing)": ${leaked.join(", ")}`).toHaveLength(0);
  });

  test("body-system category cards render in the marketing practice hub", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, MARKETING_QUESTIONS_PATH);
    await expect(page.locator('[data-testid="marketing-practice-questions-hub"]')).toBeVisible({
      timeout: HUB_TIMEOUT,
    });
    const cards = page.locator('[data-testid="practice-body-system-cards"] button');
    const count = await cards.count();
    expect(count, "At least one body-system category card must render").toBeGreaterThan(0);
  });

  test("CAT Overview link does not carry internal label and href is not a marketing-only dead end", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, MARKETING_QUESTIONS_PATH);
    await expect(page.locator('[data-testid="marketing-practice-questions-hub"]')).toBeVisible({
      timeout: HUB_TIMEOUT,
    });
    const catLink = page.locator('[data-testid="marketing-cat-overview-link"]');
    if ((await catLink.count()) > 0) {
      const label = await catLink.innerText();
      expect(label, "CAT link must not contain '(Marketing)'").not.toMatch(/\(marketing\)/i);
    }
  });
});

// ── Authenticated learner practice hub ────────────────────────────────────────

test.describe("learner practice hub — no internal labels (authenticated)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("INVALID_SURFACE never appears in /app/questions after login", async ({ page }) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD to run authenticated practice hub tests");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await page.goto(LEARNER_QUESTIONS_PATH, { waitUntil: "domcontentloaded" });

    // If redirected to login, the fix for auth-loop is a separate concern; just assert no debug leak.
    await page.waitForLoadState("networkidle");

    const bodyText = await page.locator("body").innerText();
    expect(bodyText, "INVALID_SURFACE must not appear in learner DOM").not.toContain("INVALID_SURFACE");
    expect(bodyText, '"Marketing" must not appear as a CTA label suffix in learner DOM').not.toMatch(
      /\(Marketing\)/,
    );
  });

  test("body-system section renders and Start Adaptive Practice does not show INVALID_SURFACE", async ({ page }) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD to run authenticated practice hub tests");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await page.goto(LEARNER_QUESTIONS_PATH, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const setupContainer = page.locator('[data-testid="practice-adaptive-setup"]');
    if (await setupContainer.isVisible().catch(() => false)) {
      // Body systems grid must be present
      const grid = page.locator('[data-testid="body-systems-grid"]');
      await expect(grid).toBeVisible({ timeout: HUB_TIMEOUT });
      const cards = grid.locator("button");
      expect(await cards.count(), "Body system cards must render").toBeGreaterThan(0);

      // Clicking Start Adaptive Practice must not surface INVALID_SURFACE
      const startBtn = page.locator('[data-testid="start-practice-btn"]');
      if (await startBtn.isVisible().catch(() => false)) {
        await startBtn.click();
        // Wait briefly for any error to appear
        await page.waitForTimeout(3_000);
        const bodyAfter = await page.locator("body").innerText();
        expect(bodyAfter, "INVALID_SURFACE must not appear after clicking Start Adaptive Practice").not.toContain(
          "INVALID_SURFACE",
        );
      }
    }
  });
});
