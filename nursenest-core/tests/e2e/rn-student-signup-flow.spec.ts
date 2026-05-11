/**
 * RN visitor → US NCLEX-RN marketing hub → signup → onboarding (RN) → learner shell, study nav, and paywall hygiene.
 *
 * **Email:** `rn-student-e2e+<timestamp>@<QA_SIGNUP_EMAIL_DOMAIN>` — the domain must be allowed by `/api/signup`
 * (same contract as `tests/e2e/auth/signup-auto-login.spec.ts`). `@example.com` is not used because production-like
 * signup validation typically rejects reserved domains.
 *
 * **Turnstile:** If `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set, the Create account button stays disabled until the
 * widget resolves; unset Turnstile in local E2E or provide a CI bypass, matching other signup specs.
 *
 * Run (from `nursenest-core/`, dev server on `BASE_URL`):
 * `npm run test:e2e:rn-signup`
 */
import { expect, test } from "@playwright/test";
import {
  expectNotPageNotFound,
  gotoExpectOk,
  requireOrigin,
  seedCaMarketingCookie,
  seedUsMarketingCookie,
} from "./helpers/navigation-e2e";
import { loginWithCredentials } from "./helpers/learner-login";
import { isLearnerShell } from "./helpers/learner-shell";
import { learnerShellStudyNavigation } from "./helpers/learner-shell-locators";
import { expectOnLearnerApp } from "./helpers/paid-surface-assertions";

test.use({ storageState: { cookies: [], origins: [] } });

const PATHWAYS_BAND = ".nn-home-pathways-band";
const TIER_CARD_RN = 'a[data-nn-home-tier-card="rn"]';
const RN_SIGNUP_VARIANTS = [
  {
    label: "US RN",
    seed: "us" as const,
    hubPath: "/us/rn/nclex-rn",
    signupCountry: "US",
    examFocus: "nclex_rn",
    emailPrefix: "rn-student-e2e",
  },
  {
    label: "Canada RN",
    seed: "ca" as const,
    hubPath: "/canada/rn/nclex-rn",
    signupCountry: "CA",
    examFocus: "nclex_rn",
    emailPrefix: "ca-rn-student-e2e",
  },
] as const;

test.describe("RN student signup flow", () => {
  for (const variant of RN_SIGNUP_VARIANTS) {
    test(`homepage → ${variant.label} hub → signup → onboarding → learner shell + RN nav + paywall`, async ({
      page,
      baseURL,
    }) => {
      const domain = process.env.QA_SIGNUP_EMAIL_DOMAIN?.trim();
      test.skip(
        !domain,
        "Set QA_SIGNUP_EMAIL_DOMAIN to a catch-all domain allowed by /api/signup (see spec header).",
      );

      const origin = requireOrigin(baseURL);
      if (variant.seed === "ca") {
        await seedCaMarketingCookie(page, origin);
      } else {
        await seedUsMarketingCookie(page, origin);
      }
      await page.setViewportSize({ width: 1280, height: 900 });

      await gotoExpectOk(page, "/");
      await expectNotPageNotFound(page);

      const band = page.locator(PATHWAYS_BAND);
      await expect(band.locator(TIER_CARD_RN)).toBeVisible({ timeout: 60_000 });
      await band.locator(TIER_CARD_RN).click();
      await page.waitForLoadState("domcontentloaded");
      await expect(page).toHaveURL(new RegExp(variant.hubPath.replace(/\//g, "\\/"), "i"), { timeout: 25_000 });
      await expectNotPageNotFound(page);

      await expect(page.locator(".nn-qa-nursing-tier-hub-lessons-card").first()).toBeVisible({ timeout: 30_000 });

      await page.getByRole("link", { name: /start free account/i }).click();
      await expect(page).toHaveURL(/\/signup/i, { timeout: 30_000 });

      const stamp = Date.now();
      const email = `${variant.emailPrefix}+${stamp}@${domain}`;
      const username = `rnsignup${stamp.toString(36)}`.replace(/[^a-z0-9]/gi, "").slice(0, 26);
      const password = `E2e1!Rn${String(stamp).slice(-4)}`;

      await page.locator('input[name="firstName"]').fill("RN");
      await page.locator('input[name="lastName"]').fill("E2E");
      await page.locator('input[name="username"]').fill(username);
      await page.locator('input[name="email"]').fill(email);
      await page.locator('input[name="password"]').fill(password);
      await page.locator('select[name="country"]').selectOption(variant.signupCountry);
      await page.locator('select[name="tier"]').selectOption("RN");
      await page.locator('select[name="examFocus"]').selectOption(variant.examFocus);

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

      if (page.url().includes("/app/onboarding")) {
        await page.getByTestId("onboarding-exam-goal-rn").click();
        await page.getByTestId("onboarding-start-studying-now").click();
        await page.waitForURL((url) => !url.pathname.includes("/app/onboarding"), { timeout: 60_000 });
      }

      const path = new URL(page.url()).pathname;
      expect(isLearnerShell(path), `expected learner shell after signup; got ${page.url()}`).toBe(true);
      await expectOnLearnerApp(page);
      await expect(page.locator("main").first()).toBeVisible({ timeout: 45_000 });

      const bodyText = (await page.locator("body").innerText()).toLowerCase();
      expect(bodyText).toMatch(/nclex|rn|nurse/);

      const nav = learnerShellStudyNavigation(page);
      await expect(nav).toBeVisible({ timeout: 30_000 });
      await expect(nav.locator('a[href*="/app/lessons"]').first()).toBeVisible();
      await expect(nav.locator('a[href*="/app/questions"]').first()).toBeVisible();
      await expect(nav.locator('a[href*="/app/flashcards"]').first()).toBeVisible();
      await expect(nav.locator('a[href*="/app/practice-tests"]').first()).toBeVisible();

      await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
      const subGate = page.getByRole("heading", { name: /subscription required/i });
      if ((await subGate.count()) > 0) {
        await expect(page.locator('a[href="/pricing"]').first()).toBeVisible();
        await expect(page.getByRole("heading", { name: /lesson preview/i })).toBeVisible({ timeout: 60_000 });
      } else {
        await expect(page.locator("main").first()).toBeVisible({ timeout: 30_000 });
      }

      await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { name: /subscription required/i }).first()).toBeVisible({
        timeout: 45_000,
      });
      const pricingFromBank = page.locator('a[href="/pricing"]').first();
      await expect(pricingFromBank).toBeVisible();
      await pricingFromBank.click();
      await expect(page).toHaveURL(/\/pricing/, { timeout: 30_000 });
      await expect(page.locator("main, [role='main'], article").first()).toBeVisible({ timeout: 30_000 });
    });
  }
});
