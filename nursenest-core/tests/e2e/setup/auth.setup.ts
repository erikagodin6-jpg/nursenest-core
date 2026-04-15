/**
 * One-time login for the **paid seeded** E2E account; writes storage state for `chromium-paid`.
 *
 * Credentials: see `../helpers/paid-test-credentials.ts` (`E2E_PAID_*` or `PLAYWRIGHT_TEST_*`).
 *
 * Playwright project `setup-paid-auth` runs this file before `paid-user-smoke` and any future
 * `--project=chromium-paid` specs.
 */
import fs from "node:fs";
import path from "node:path";
import { expect, test as setup } from "@playwright/test";
import { PAID_USER_AUTH_FILE } from "../helpers/auth-state-paths";
import { loginWithCredentials } from "../helpers/learner-login";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";

setup("authenticate paid test account and save storage state", async ({ page }) => {
  const creds = getPaidTestCredentials();
  if (!creds) {
    throw new Error(
      [
        "Paid E2E credentials missing.",
        "Set E2E_PAID_EMAIL and E2E_PAID_PASSWORD, or PLAYWRIGHT_TEST_EMAIL and PLAYWRIGHT_TEST_PASSWORD.",
        "(playwright.config gates paid projects when these are unset.)",
      ].join(" "),
    );
  }

  try {
    await loginWithCredentials(page, creds.email, creds.password);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(
      `Paid E2E login failed for ${creds.email}: ${msg}. Check BASE_URL, account exists, and password. Seeded paid account must reach /app after Sign In.`,
    );
  }

  await expect(page).toHaveURL(/\/app(\/|$)/, { timeout: 10_000 });

  // Confirm premium path without going through Stripe (lessons hub must not be paywalled).
  await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
  try {
    await expect(page.getByRole("heading", { name: "Subscription required" })).toHaveCount(0, {
      timeout: 30_000,
    });
  } catch {
    throw new Error(
      "Paid E2E account signed in but /app/lessons still shows Subscription required — use a seeded account with active premium entitlements (not a free-tier user).",
    );
  }

  fs.mkdirSync(path.dirname(PAID_USER_AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: PAID_USER_AUTH_FILE });
});
