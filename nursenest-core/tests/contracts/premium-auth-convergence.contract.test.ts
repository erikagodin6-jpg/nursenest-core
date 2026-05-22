/**
 * Static guard for the premium auth convergence pass.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-auth-convergence.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const PREMIUM_CSS_PATH = path.resolve(ROOT, "src/app/premium-redesign-2026.css");
const AUTH_SHELL_PATH = path.resolve(ROOT, "src/components/auth/premium-auth-shell.tsx");
const LOGIN_PAGE_PATH = path.resolve(ROOT, "src/components/marketing/marketing-login-page.tsx");
const SIGNUP_PAGE_PATH = path.resolve(ROOT, "src/components/marketing/marketing-signup-page.tsx");
const FORGOT_PAGE_PATH = path.resolve(ROOT, "src/components/marketing/marketing-forgot-password-page.tsx");
const RESET_PAGE_PATH = path.resolve(ROOT, "src/components/marketing/marketing-reset-password-page.tsx");
const LOGIN_FORM_PATH = path.resolve(ROOT, "src/components/auth/login-form.tsx");
const SIGNUP_FORM_PATH = path.resolve(ROOT, "src/components/auth/signup-form.tsx");
const FORGOT_FORM_PATH = path.resolve(ROOT, "src/components/auth/forgot-password-form.tsx");
const RESET_FORM_PATH = path.resolve(ROOT, "src/components/auth/reset-password-form.tsx");
const VERIFY_BANNER_PATH = path.resolve(ROOT, "src/components/auth/verify-status-banner.tsx");
const TRIAL_BLOCKED_PATH = path.resolve(ROOT, "src/components/auth/trial-blocked-card.tsx");
const AUTH_CONFIG_PATH = path.resolve(ROOT, "src/lib/auth.ts");
const OAUTH_CONFIG_PATH = path.resolve(ROOT, "src/lib/auth/oauth-config.ts");
const AUTH_GOVERNANCE_PATH = path.resolve(ROOT, "src/lib/auth/auth-flow-governance.ts");
const OAUTH_BUTTONS_PATH = path.resolve(ROOT, "src/components/auth/oauth-provider-buttons.tsx");
const SCREENSHOT_DIR = path.resolve(ROOT, "docs/screenshots/premium-auth-system");

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const REQUIRED_SCREENSHOT_PREFIXES = [
  "sign-in",
  "sign-up",
  "forgot-password",
  "reset-password",
  "auth-error",
] as const;
const REQUIRED_PATHWAY_LABELS = [
  "RN / NCLEX-RN",
  "RPN / REx-PN",
  "LPN / NCLEX-PN",
  "NP",
  "Allied Health",
  "New Grad",
  "Pre-Nursing",
] as const;

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

function escaped(value: string): RegExp {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
}

describe("premium auth convergence", () => {
  const css = read(PREMIUM_CSS_PATH);
  const shell = read(AUTH_SHELL_PATH);
  const loginPage = read(LOGIN_PAGE_PATH);
  const signupPage = read(SIGNUP_PAGE_PATH);
  const forgotPage = read(FORGOT_PAGE_PATH);
  const resetPage = read(RESET_PAGE_PATH);
  const loginForm = read(LOGIN_FORM_PATH);
  const signupForm = read(SIGNUP_FORM_PATH);
  const forgotForm = read(FORGOT_FORM_PATH);
  const resetForm = read(RESET_FORM_PATH);
  const verifyBanner = read(VERIFY_BANNER_PATH);
  const trialBlocked = read(TRIAL_BLOCKED_PATH);
  const authConfig = read(AUTH_CONFIG_PATH);
  const oauthConfig = read(OAUTH_CONFIG_PATH);
  const authGovernance = read(AUTH_GOVERNANCE_PATH);
  const oauthButtons = read(OAUTH_BUTTONS_PATH);

  it("keeps all five required themes covered by the premium auth layer", () => {
    for (const theme of REQUIRED_THEMES) {
      assert.match(css, new RegExp(`html\\[data-theme="${theme}"\\] \\.nn-premium-auth-system`), `${theme} must be covered`);
    }
    assert.match(css, /--nn-auth-theme-covered\s*:\s*1/, "auth theme coverage sentinel missing");
  });

  it("uses a shared premium auth shell across sign in, sign up, forgot password, and reset password", () => {
    assert.match(shell, /data-nn-premium-auth-system/, "shared auth system hook missing");
    assert.match(shell, /data-nn-premium-auth-card/, "auth card hook missing");
    assert.match(shell, /data-nn-premium-auth-legal/, "legal hook missing");
    assert.match(loginPage, /<PremiumAuthShell/, "login page must use shared shell");
    assert.match(signupPage, /<PremiumAuthShell/, "signup page must use shared shell");
    assert.match(forgotPage, /<PremiumAuthShell/, "forgot password page must use shared shell");
    assert.match(resetPage, /<PremiumAuthShell/, "reset password page must use shared shell");
  });

  it("keeps credentials auth and gates OAuth providers behind env configuration", () => {
    assert.match(authConfig, /Credentials\(/, "credentials provider must remain configured");
    assert.match(authConfig, /buildOAuthProviders\(/, "OAuth providers must be composed from oauth-config");
    assert.match(oauthConfig, /isGoogleOAuthConfigured/, "Google OAuth must be env-gated");
    assert.match(oauthConfig, /isAppleOAuthConfigured/, "Apple OAuth must be env-gated");
    assert.match(authConfig, /oauthAuthCallbacks/, "OAuth signIn/redirect callbacks must be wired");
    assert.match(authConfig, /pages:\s*{[\s\S]*signIn:\s*"\/login"[\s\S]*error:\s*"\/login"/, "Auth.js route contract changed");
  });

  it("centralizes return-intent restoration in auth-flow-governance", () => {
    assert.match(authGovernance, /resolveAuthReturnDestination/, "governance must resolve post-auth destinations");
    assert.match(authGovernance, /resolveLearnerStudyCallbackPath/, "learner study callbacks must be first-class");
    assert.match(oauthButtons, /nn-premium-auth-oauth-button/, "OAuth UI must use premium Blossom classes");
  });

  it("surfaces compliance copy, legal links, account deletion discoverability, and pathway labels", () => {
    assert.match(shell, /does not provide medical advice, diagnosis, or treatment/, "educational disclaimer missing");
    assert.match(shell, /Terms Of Service/, "Terms link label missing");
    assert.match(shell, /Privacy Policy/, "Privacy link label missing");
    assert.match(shell, /Account Settings/, "account deletion discoverability missing");
    for (const label of REQUIRED_PATHWAY_LABELS) {
      assert.match(shell, escaped(label), `${label} missing from shell`);
    }
    assert.match(signupForm, /Choose Your Pathway/, "signup pathway heading missing");
  });

  it("adds premium hooks to forms, verification, email sent, auth error, and subscription-required states", () => {
    assert.match(loginForm, /data-nn-premium-auth-form="login"/, "login form hook missing");
    assert.match(signupForm, /data-nn-premium-auth-form="signup"/, "signup form hook missing");
    assert.match(forgotForm, /data-nn-premium-auth-form="forgot-password"/, "forgot form hook missing");
    assert.match(resetForm, /data-nn-premium-auth-form="reset-password"/, "reset form hook missing");
    assert.match(verifyBanner, /data-nn-premium-auth-verification/, "verification hook missing");
    assert.match(forgotForm, /data-nn-premium-auth-email-sent/, "email sent hook missing");
    assert.match(resetForm, /data-nn-premium-auth-error-state/, "auth error hook missing");
    assert.match(trialBlocked, /data-nn-premium-auth-subscription-required/, "subscription-required hook missing");
  });

  it("keeps styling token-driven with mobile safe-area and reduced-motion support", () => {
    for (const token of [
      "--semantic-brand",
      "--semantic-info",
      "--semantic-warning",
      "--semantic-success",
      "--semantic-border-soft",
      "--semantic-panel-muted",
    ]) {
      assert.match(css, new RegExp(token), `${token} should be consumed`);
    }
    assert.match(css, /env\(safe-area-inset-bottom/, "safe-area bottom handling missing");
    assert.match(css, /env\(safe-area-inset-left/, "safe-area left handling missing");
    assert.match(css, /prefers-reduced-motion:\s*reduce/, "reduced-motion handling missing");
    assert.match(css, /nn-premium-auth-primary-button/, "premium button styling missing");
  });

  it("archives Figma-first PNG evidence for all required auth screens and themes", () => {
    for (const theme of REQUIRED_THEMES) {
      for (const prefix of REQUIRED_SCREENSHOT_PREFIXES) {
        const desktopPath = path.join(SCREENSHOT_DIR, `${prefix}-${theme}-desktop.png`);
        assert.ok(fs.existsSync(desktopPath), `${desktopPath} must exist`);
      }

      for (const prefix of ["sign-in", "sign-up"] as const) {
        const mobilePath = path.join(SCREENSHOT_DIR, `${prefix}-${theme}-mobile.png`);
        assert.ok(fs.existsSync(mobilePath), `${mobilePath} must exist`);
      }
    }
  });
});
