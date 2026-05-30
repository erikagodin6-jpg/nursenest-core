/**
 * Authentication, paywall, and free-trial abuse prevention contract.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/auth-paywall-trial-abuse-prevention.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.resolve(ROOT, relativePath), "utf8");
}

const PUBLIC_HUB_ROUTES = [
  "/",
  "/pricing",
  "/canada/rn/nclex-rn",
  "/canada/pn/rex-pn",
  "/np",
  "/allied-health",
  "/ecg-telemetry-mastery",
  "/labs-interpretation",
  "/clinical-modules",
  "/cnple-pharmacology",
  "/canada/rn/nclex-rn/flashcards",
  "/canada/rn/nclex-rn/lessons",
  "/canada/rn/nclex-rn/questions",
] as const;

describe("auth paywall trial abuse prevention", () => {
  it("documents public browsing surfaces while preserving premium launch protection", () => {
    const doc = read("docs/auth-paywall-trial-abuse-prevention.md");

    for (const route of PUBLIC_HUB_ROUTES) {
      assert.match(doc, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${route} missing from public model`);
    }
    for (const phrase of [
      "Visitors can browse",
      "Visitors cannot launch",
      "Server-Side Enforcement",
      "Create Free Account",
      "Sign In",
      "Upgrade To Unlock",
    ]) {
      assert.match(doc, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${phrase} missing from policy doc`);
    }
  });

  it("enforces disposable email controls at signup and trial scoring", () => {
    const signupRoute = read("src/app/api/signup/route.ts");
    const emailControls = read("src/lib/trial/trial-email-controls.ts");
    const eligibility = read("src/lib/trial/trial-eligibility.ts");

    assert.match(signupRoute, /isDisposableEmailDomain/, "signup must block disposable email domains before account creation");
    assert.match(signupRoute, /code:\s*"disposable_email"/, "signup response must expose a stable disposable-email code");
    for (const provider of ["10minutemail.com", "guerrillamail.com", "temp-mail.org"]) {
      assert.match(emailControls, new RegExp(provider.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${provider} must be denied`);
    }
    assert.match(eligibility, /disposable_email_domain/, "trial eligibility must score disposable domains");
  });

  it("uses layered trial eligibility signals instead of trusting one check", () => {
    const attempt = read("src/lib/trial/attempt-start-trial.ts");
    const eligibility = read("src/lib/trial/trial-eligibility.ts");

    for (const signal of [
      "emailVerified",
      "deviceAlreadyTrialed",
      "trialAlreadyUsed",
      "hasSubscriptionHistory",
      "stripeEmailHasSubscriptionHistory",
      "accountCreationCountForIp",
      "noPaymentHistory",
    ]) {
      assert.match(eligibility, new RegExp(signal), `${signal} missing from weighted eligibility model`);
      assert.match(attempt, new RegExp(signal), `${signal} missing from trial start integration`);
    }

    assert.match(attempt, /hashTrialDeviceFingerprint/, "trial start must hash device fingerprint");
    assert.match(attempt, /stripeEmailHasSubscriptionHistory/, "trial start must use Stripe history as a billing signal");
    assert.match(attempt, /recordTrialBlock\(userId, eligibility\.code\)/, "trial blocks must feed abuse telemetry");
    assert.match(attempt, /duplicate_account_detected/, "duplicate-device signals must be tracked");
  });

  it("keeps premium content gated server-side through entitlement and API protection contracts", () => {
    const entitlementMatrix = read("src/lib/entitlements/entitlement-state-matrix.ts");
    const apiProtection = read("src/lib/http/api-protection.ts");
    const practiceTestPage = read("src/app/(app)/app/(learner)/practice-tests/[id]/page.tsx");
    const trialRoute = read("src/app/api/trial/start/route.ts");

    assert.match(entitlementMatrix, /Access is never granted from browser query params/, "entitlement contract must reject client-only access");
    assert.match(entitlementMatrix, /Content SQL gates/, "content gates must be server-side");
    assert.match(apiProtection, /recordPremiumProtectionAbuseFromLog/, "API abuse must feed premium protection telemetry");
    assert.match(practiceTestPage, /resolveEntitlementForPage|SubscriptionPaywall|LearnerActivityState/, "practice test launch must resolve entitlement server-side");
    assert.match(trialRoute, /auth\(\)/, "trial start API must require authenticated account");
  });
});
