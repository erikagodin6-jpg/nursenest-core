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
import { attachPageObservers } from "../helpers/attach-observers";
import { describeAuthFailureSurface } from "../helpers/auth-diagnostics";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  describePaidCredentialResolution,
  getPaidTestCredentials,
} from "../helpers/paid-test-credentials";
import { learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";

setup("authenticate paid test account and save storage state", async ({ page }, testInfo) => {
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

  const credResolution = describePaidCredentialResolution();
  const observers = attachPageObservers(page, { profile: "public", probeAuthApi: true, captureConsoleContext: true });

  try {
    await loginWithCredentials(page, creds.email, creds.password, { enterLearnerApp: false });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    const shot = await page.screenshot({ fullPage: true }).catch(() => null);
    if (shot) {
      await testInfo.attach("setup-paid-auth-failure.png", { body: shot, contentType: "image/png" });
    }
    const artifact = {
      category: "setup-paid-auth",
      baseURL: process.env.BASE_URL ?? "http://localhost:3000",
      credentialSource: credResolution.source,
      credentialEmailPresent: credResolution.emailPresent,
      credentialPasswordPresent: credResolution.passwordPresent,
      maskedEmail: credResolution.maskedEmail,
      finalUrl: page.url(),
      thrownMessage: msg,
      describeAuthFailureSurface: diag,
      consoleErrors: observers.consoleErrors,
      consoleErrorContext: observers.consoleErrorContext ?? [],
      failedRequests: observers.failedRequests,
      authHttp: observers.authHttp ?? [],
    };
    await testInfo.attach("setup-paid-auth-failure.json", {
      body: Buffer.from(JSON.stringify(artifact, null, 2), "utf-8"),
      contentType: "application/json",
    });
    throw new Error(
      [
        `Paid auth setup failed: login did not complete after submit. email=${creds.email}`,
        msg,
        "category=auth",
        "Check BASE_URL, DATABASE_URL (Prisma must connect — password auth / sslmode for managed Postgres), QA account exists with ACTIVE subscription (`scripts/qa-paid-test-account-reset.mts`), and credentials.",
        diag,
        observers.consoleErrors.length ? `consoleErrors=${observers.consoleErrors.length}` : "",
        observers.failedRequests.length ? `failedRequests=${observers.failedRequests.join(" | ")}` : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  } finally {
    observers.dispose();
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

  await expect(learnerAppMainLandmark(page)).toBeVisible({
    timeout: 30_000,
    message:
      "Learner shell main landmark missing on /app — session invalid, auth gate, or layout error. See waitForAuthenticatedLearnerShell diagnostics in paid-learner-shell.ts.",
  });

  // Confirm premium path without going through Stripe (lessons hub must not be paywalled).
  await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
  await expectNoSubscriptionPaywall(page, "setup-paid-auth /app/lessons (premium seed required)");

  fs.mkdirSync(path.dirname(PAID_USER_AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: PAID_USER_AUTH_FILE });
});
