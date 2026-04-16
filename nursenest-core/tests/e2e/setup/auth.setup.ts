/**
 * One-time login for the **paid seeded** E2E account; writes `PAID_USER_AUTH_FILE` for reuse.
 *
 * Credentials: `../helpers/paid-test-credentials.ts` (`E2E_PAID_*` or `PLAYWRIGHT_TEST_*`).
 * Project `setup-paid-auth` runs before `chromium-paid` (`dependencies` + `storageState` in playwright.config).
 */
import fs from "fs";
import path from "path";
import { expect, test as setup } from "@playwright/test";
import { PAID_USER_AUTH_FILE } from "../helpers/auth-state-paths";
import { describeAuthFailureSurface } from "../helpers/auth-diagnostics";
import { loginWithCredentials } from "../helpers/learner-login";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";

setup("authenticate paid test account and save storage state", async ({ page }) => {
  const creds = getPaidTestCredentials();
  if (!creds) {
    throw new Error(
      [
        "Paid E2E credentials missing.",
        "Set E2E_PAID_EMAIL and E2E_PAID_PASSWORD, or PLAYWRIGHT_TEST_EMAIL and PLAYWRIGHT_TEST_PASSWORD.",
        "(This file should only run when those are set — see playwright.config.ts testMatch for setup-paid-auth.)",
      ].join(" "),
    );
  }

  try {
    await loginWithCredentials(page, creds.email, creds.password);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(
      `Paid auth setup failed: login did not reach learner shell after submit. email=${creds.email} ${msg}. category=auth Check BASE_URL, credentials, and account state. ${diag}`,
    );
  }

  // loginWithCredentials can succeed on /app/lessons without ever hitting /app — but the dashboard
  // redirects incomplete users from /app → /app/onboarding. Hit /app here so storage state is only
  // saved when onboarding is complete (otherwise downstream specs fail after goto("/app")).
  await page.goto("/app", { waitUntil: "domcontentloaded" });
  await expect
    .poll(
      () => new URL(page.url()).pathname.includes("/app/onboarding"),
      {
        timeout: 30_000,
        message:
          "E2E user must complete onboarding (DB onboardingCompletedAt). Run scripts/qa-paid-test-account-reset.mts with production DATABASE_URL.",
      },
    )
    .toBe(false);

  // Confirm premium path without going through Stripe (lessons hub must not be paywalled).
  await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
  await expectNoSubscriptionPaywall(page, "setup-paid-auth /app/lessons (premium seed required)");

  fs.mkdirSync(path.dirname(PAID_USER_AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: PAID_USER_AUTH_FILE });
});
