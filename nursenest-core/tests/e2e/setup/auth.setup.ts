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
import { describeAuthFailureSurface, redactAuthDiagnosticsUrl } from "../helpers/auth-diagnostics";
import { paidFlashcardsHubUrl } from "../helpers/paid-content-discovery";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  describePaidCredentialResolution,
  getPaidTestCredentials,
} from "../helpers/paid-test-credentials";
import { getE2eBaseURL } from "../helpers/e2e-env";
import { learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import { waitForStableLearnerPathname } from "../helpers/redirect-loop-guard";
import { formatPaidE2eFailureTaxonomy } from "../helpers/paid-e2e-failure-taxonomy";
import { spawnWaitForAppReady } from "../helpers/spawn-wait-for-app-ready";

setup("authenticate paid test account and save storage state", async ({ page, request }, testInfo) => {
  spawnWaitForAppReady();

  if (!process.env.DATABASE_URL?.trim()) {
    console.warn(
      "[setup-paid-auth] DATABASE_URL unset — Prisma auth and paywall checks may fail. Export DATABASE_URL or rely on Playwright webServer env injection.",
    );
  }

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
  const baseURL = getE2eBaseURL();
  console.log("[setup-paid-auth] --- env (no secrets) ---");
  console.log(
    `[setup-paid-auth] baseURL=${baseURL} AUTH_URL=${process.env.AUTH_URL?.trim() ? "set" : "unset"} NEXTAUTH_URL=${process.env.NEXTAUTH_URL?.trim() ? "set" : "unset"}`,
  );
  console.log(
    `[setup-paid-auth] AUTH_SECRET=${process.env.AUTH_SECRET?.trim() ? "set" : "unset"} NEXTAUTH_SECRET=${process.env.NEXTAUTH_SECRET?.trim() ? "set" : "unset"} DATABASE_URL=${process.env.DATABASE_URL?.trim() ? "set" : "unset"}`,
  );
  console.log(
    "[setup-paid-auth] auth URL hint: local webServer injects AUTH_URL/NEXTAUTH_URL=origin from playwright.learning-routes.config.ts; Playwright worker may show AUTH_URL unset unless exported in shell — browser still targets baseURL.",
  );
  console.log(`[setup-paid-auth] credentialSource=${credResolution.source} maskedEmail=${credResolution.maskedEmail ?? "n/a"}`);

  /** Warm Auth.js routes so `signIn()`'s internal `getProviders()` + CSRF fetches are not blocked behind first-compile. */
  try {
    const warmCsrf = await request.get("/api/auth/csrf", { timeout: 120_000 });
    const warmProviders = await request.get("/api/auth/providers", { timeout: 120_000 });
    console.log(
      `[setup-paid-auth] warmup GET /api/auth/csrf → ${warmCsrf.status()} GET /api/auth/providers → ${warmProviders.status()}`,
    );
  } catch (e) {
    console.warn("[setup-paid-auth] warmup request failed (non-fatal):", e instanceof Error ? e.message : String(e));
  }

  const observers = attachPageObservers(page, { profile: "public", probeAuthApi: true, captureConsoleContext: true });

  try {
    await loginWithCredentials(page, creds.email, creds.password, {
      enterLearnerApp: false,
      onCredentialsSuccess: (info) => {
        console.log(
          `[setup-paid-auth] credentials POST httpStatus=${info.httpStatus} callbackRedirect=${info.callbackRedirectRedacted} pageUrl=${info.pageUrlRedacted}`,
        );
      },
    });
    console.log(`[setup-paid-auth] credentials flow completed browser url=${redactAuthDiagnosticsUrl(page.url())}`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    const shot = await page.screenshot({ fullPage: true }).catch(() => null);
    if (shot) {
      await testInfo.attach("setup-paid-auth-failure.png", { body: shot, contentType: "image/png" });
    }
    const taxonomy = formatPaidE2eFailureTaxonomy({
      thrownMessage: msg,
      failedRequestCount: observers.failedRequests.length,
      consoleErrorCount: observers.consoleErrors.length,
    });
    const artifact = {
      category: "setup-paid-auth",
      paidE2eTaxonomy: taxonomy,
      baseURL: getE2eBaseURL(),
      credentialSource: credResolution.source,
      credentialEmailPresent: credResolution.emailPresent,
      credentialPasswordPresent: credResolution.passwordPresent,
      maskedEmail: credResolution.maskedEmail,
      finalUrl: redactAuthDiagnosticsUrl(page.url()),
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
        `paidE2eTaxonomy=${taxonomy}`,
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
  await waitForStableLearnerPathname(page, { label: "post-login /app" });
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

  // Confirm premium path without going through Stripe — use flashcards hub (same pathway as learning-routes E2E).
  await page.goto(paidFlashcardsHubUrl(), { waitUntil: "domcontentloaded" });
  await expectNoSubscriptionPaywall(page, "setup-paid-auth /app/flashcards (premium seed required)");

  fs.mkdirSync(path.dirname(PAID_USER_AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: PAID_USER_AUTH_FILE });
  console.log(
    `[setup-paid-auth] saved storageState path=${PAID_USER_AUTH_FILE} finalUrl=${redactAuthDiagnosticsUrl(page.url())}`,
  );
});
