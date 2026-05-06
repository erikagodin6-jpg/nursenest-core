/**
 * Homepage → marketing hub → Start free → signup per tier (RN, PN, NP, Allied, New Grad).
 *
 * Requires `QA_SIGNUP_EMAIL_DOMAIN` and Turnstile bypass / unset `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (see `rn-student-signup-flow.spec.ts`).
 *
 * Run: `npx playwright test -c playwright.tier-matrix.config.ts tests/e2e/tier-matrix/tier-matrix-signup-multi-tier.spec.ts`
 */
import { expect, test } from "@playwright/test";
import {
  expectNotPageNotFound,
  gotoExpectOk,
  requireOrigin,
  seedCaMarketingCookie,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";
import { loginWithCredentials } from "../helpers/learner-login";
import { isLearnerShell } from "../helpers/learner-shell";
import { learnerShellStudyNavigation } from "../helpers/learner-shell-locators";
import { expectOnLearnerApp } from "../helpers/paid-surface-assertions";
import { TIER_MATRIX_SIGNUP_ROWS } from "../helpers/tier-product-matrix";

test.use({ storageState: { cookies: [], origins: [] } });

const PATHWAYS_BAND = ".nn-home-pathways-band";

async function dismissOnboardingIfPresent(page: import("@playwright/test").Page): Promise<void> {
  if (!page.url().includes("/app/onboarding")) return;
  const goal = page.locator("[data-testid^='onboarding-exam-goal-']").first();
  if (await goal.isVisible().catch(() => false)) {
    await goal.click();
  }
  const start = page.getByTestId("onboarding-start-studying-now");
  if (await start.isVisible().catch(() => false)) {
    await start.click();
  }
  await page
    .waitForURL((u) => !u.pathname.includes("/app/onboarding"), { timeout: 120_000 })
    .catch(() => {});
}

for (const row of TIER_MATRIX_SIGNUP_ROWS) {
  test.describe(`Signup — ${row.label}`, () => {
    test(`homepage → hub → signup → learner shell (${row.key})`, async ({ page, baseURL }) => {
      const domain = process.env.QA_SIGNUP_EMAIL_DOMAIN?.trim();
      test.skip(!domain, "Set QA_SIGNUP_EMAIL_DOMAIN (see rn-student-signup-flow.spec.ts).");

      const origin = requireOrigin(baseURL);
      if (row.marketingRegionCookie === "canada") {
        await seedCaMarketingCookie(page, origin);
      } else {
        await seedUsMarketingCookie(page, origin);
      }
      await page.setViewportSize({ width: 1280, height: 900 });

      await gotoExpectOk(page, "/");
      await expectNotPageNotFound(page);

      const card = page.locator(`${PATHWAYS_BAND} a[data-nn-home-tier-card="${row.homeTierCardId}"]`);
      await expect(card).toBeVisible({ timeout: 60_000 });
      await card.click();
      await page.waitForLoadState("domcontentloaded");
      await expect(page).toHaveURL(row.hubPathnameRegex, { timeout: 35_000 });
      await expectNotPageNotFound(page);

      await page.getByRole("link", { name: /start free account/i }).click();
      await expect(page).toHaveURL(/\/signup/i, { timeout: 30_000 });

      const stamp = Date.now();
      const email = `tier-matrix-${row.key}+${stamp}@${domain}`;
      const username = `tm${row.key}${stamp.toString(36)}`.replace(/[^a-z0-9]/gi, "").slice(0, 26);
      const password = `E2e1!${row.key.slice(0, 2).toUpperCase()}${String(stamp).slice(-4)}`;

      await page.locator('input[name="firstName"]').fill("Tier");
      await page.locator('input[name="lastName"]').fill("Matrix");
      await page.locator('input[name="username"]').fill(username);
      await page.locator('input[name="email"]').fill(email);
      await page.locator('input[name="password"]').fill(password);
      await page.locator('select[name="country"]').selectOption(row.signupCountry);
      await page.locator('select[name="tier"]').selectOption(row.signupTier);
      await page.locator('select[name="learnerPath"]').selectOption(row.signupLearnerPath);
      await page.locator('select[name="examFocus"]').selectOption(row.signupExamFocus);

      const submit = page.getByRole("button", { name: /create account/i });
      await expect(submit).toBeEnabled({ timeout: 90_000 });

      const [signupRes] = await Promise.all([
        page.waitForResponse(
          (res) => {
            if (res.request().method() !== "POST") return false;
            try {
              return new URL(res.url()).pathname.endsWith("/api/signup");
            } catch {
              return false;
            }
          },
          { timeout: 120_000 },
        ),
        submit.click(),
      ]);
      expect(signupRes.status(), "POST /api/signup").toBe(201);

      await page.waitForURL(
        (url) => {
          const p = url.pathname;
          return !p.includes("/signup") && !p.includes("/sign-up");
        },
        { timeout: 120_000 },
      );

      if (new URL(page.url()).pathname.includes("/login")) {
        await loginWithCredentials(page, email, password, { navigationOrigin: origin });
      }

      await dismissOnboardingIfPresent(page);

      const path = new URL(page.url()).pathname;
      expect(isLearnerShell(path), `expected learner shell after signup; got ${page.url()}`).toBe(true);
      await expectOnLearnerApp(page);
      await expect(page.locator("main").first()).toBeVisible({ timeout: 45_000 });

      const nav = learnerShellStudyNavigation(page);
      await expect(nav).toBeVisible({ timeout: 30_000 });
      await expect(nav.locator('a[href*="/app/lessons"]').first()).toBeVisible();
    });
  });
}
