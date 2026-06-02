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
const HUB_SYSTEM_CSS = path.resolve(ROOT, "src/app/styles/marketing/hub-system.css");
const AUTH_TOKENS_CSS = path.resolve(ROOT, "src/app/styles/marketing/auth-tokens.css");
const AUTH_OCEAN_CSS = path.resolve(ROOT, "src/app/styles/marketing/auth-ocean-premium.css");
const AUTH_MIDNIGHT_CSS = path.resolve(ROOT, "src/app/styles/marketing/auth-midnight-premium.css");
const AUTH_SHELL_PATH = path.resolve(ROOT, "src/components/auth/auth-experience/auth-experience-shell.tsx");
const AUTH_SUPPORT_FOOTER_PATH = path.resolve(ROOT, "src/components/auth/auth-experience/auth-support-footer.tsx");
const AUTH_CONSTANTS_PATH = path.resolve(ROOT, "src/components/auth/auth-experience/constants.ts");
const AUTH_SIGNUP_PATHWAY_PATH = path.resolve(ROOT, "src/components/auth/auth-experience/auth-signup-pathway-panel.tsx");
const SIGNUP_EXPERIENCE_PATH = path.resolve(ROOT, "src/components/auth/signup-experience-client.tsx");
const LOGIN_PAGE_PATH = path.resolve(ROOT, "src/components/marketing/marketing-login-page.tsx");
const SIGNUP_PAGE_PATH = path.resolve(ROOT, "src/components/marketing/marketing-signup-page.tsx");
const FORGOT_PAGE_PATH = path.resolve(ROOT, "src/components/marketing/marketing-forgot-password-page.tsx");
const RESET_PAGE_PATH = path.resolve(ROOT, "src/components/marketing/marketing-reset-password-page.tsx");
const AUTH_PRIMITIVES_PATH = path.resolve(ROOT, "src/components/auth/auth-experience/auth-primitives.tsx");
const LOGIN_FORM_PATH = path.resolve(ROOT, "src/components/auth/login-form.tsx");
const SIGNUP_FORM_PATH = path.resolve(ROOT, "src/components/auth/signup-form.tsx");
const FORGOT_FORM_PATH = path.resolve(ROOT, "src/components/auth/forgot-password-form.tsx");
const RESET_FORM_PATH = path.resolve(ROOT, "src/components/auth/reset-password-form.tsx");
const VERIFY_BANNER_PATH = path.resolve(ROOT, "src/components/auth/verify-status-banner.tsx");
const TRIAL_BLOCKED_PATH = path.resolve(ROOT, "src/components/auth/trial-blocked-card.tsx");
const AUTH_CONFIG_PATH = path.resolve(ROOT, "src/lib/auth.ts");
const OAUTH_CONFIG_ENV_PATH = path.resolve(ROOT, "src/lib/auth/oauth-config-env.ts");
const OAUTH_CONFIG_SERVER_PATH = path.resolve(ROOT, "src/lib/auth/oauth-config.server.ts");
const AUTH_GOVERNANCE_PATH = path.resolve(ROOT, "src/lib/auth/auth-flow-governance.ts");
const OAUTH_BUTTONS_PATH = path.resolve(ROOT, "src/components/auth/oauth-provider-buttons.tsx");
const CAPTURE_SPEC_PATH = path.resolve(ROOT, "tests/e2e/preview/blossom-auth.capture.spec.ts");
const CONVERGENCE_AUDIT_PATH = path.resolve(ROOT, "../docs/governance/premium-auth-convergence-audit.md");

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const REQUIRED_PATHWAY_LABELS = [
  "NCLEX-RN",
  "REx-PN",
  "NCLEX-PN",
  "NP",
  "Allied Health",
  "New grad",
  "pre-nursing",
] as const;

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

function escaped(value: string): RegExp {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
}

function usesSharedAuthShell(source: string): boolean {
  return /<PremiumAuthShell|<AuthExperienceShell|SignupExperienceClient/.test(source);
}

describe("premium auth convergence", () => {
  const hubCss = read(HUB_SYSTEM_CSS);
  const authTokensCss = read(AUTH_TOKENS_CSS);
  const authCssBundle = [hubCss, authTokensCss, read(AUTH_OCEAN_CSS), read(AUTH_MIDNIGHT_CSS)].join("\n");
  const shell = read(AUTH_SHELL_PATH);
  const supportFooter = read(AUTH_SUPPORT_FOOTER_PATH);
  const authConstants = read(AUTH_CONSTANTS_PATH);
  const signupPathway = read(AUTH_SIGNUP_PATHWAY_PATH);
  const signupExperience = read(SIGNUP_EXPERIENCE_PATH);
  const loginPage = read(LOGIN_PAGE_PATH);
  const signupPage = read(SIGNUP_PAGE_PATH);
  const forgotPage = read(FORGOT_PAGE_PATH);
  const resetPage = read(RESET_PAGE_PATH);
  const authPrimitives = read(AUTH_PRIMITIVES_PATH);
  const loginForm = read(LOGIN_FORM_PATH);
  const oauthButtonsServer = read(path.resolve(ROOT, "src/components/auth/oauth-provider-buttons-server.tsx"));
  const signupForm = read(SIGNUP_FORM_PATH);
  const forgotForm = read(FORGOT_FORM_PATH);
  const resetForm = read(RESET_FORM_PATH);
  const verifyBanner = read(VERIFY_BANNER_PATH);
  const trialBlocked = read(TRIAL_BLOCKED_PATH);
  const authConfig = read(AUTH_CONFIG_PATH);
  const oauthConfigEnv = read(OAUTH_CONFIG_ENV_PATH);
  const oauthConfigServer = read(OAUTH_CONFIG_SERVER_PATH);
  const authGovernance = read(AUTH_GOVERNANCE_PATH);
  const oauthButtons = read(OAUTH_BUTTONS_PATH);

  it("keeps all five required themes covered by the premium auth layer", () => {
    for (const theme of REQUIRED_THEMES) {
      assert.match(
        authCssBundle,
        new RegExp(`html\\[data-theme="${theme}"\\] \\.nn-premium-auth-system`),
        `${theme} must be covered`,
      );
    }
    assert.match(authCssBundle, /--nn-auth-theme-covered\s*:\s*1/, "auth theme coverage sentinel missing");
  });

  it("uses a shared premium auth shell across sign in, sign up, forgot password, and reset password", () => {
    assert.match(shell, /data-nn-premium-auth-system/, "shared auth system hook missing");
    assert.match(shell, /data-nn-premium-auth-card/, "auth card hook missing");
    assert.match(supportFooter, /data-nn-premium-auth-legal/, "legal hook missing");
    assert.ok(usesSharedAuthShell(loginPage), "login page must use shared shell");
    assert.ok(usesSharedAuthShell(signupPage + signupExperience), "signup page must use shared shell");
    assert.ok(usesSharedAuthShell(forgotPage), "forgot password page must use shared shell");
    assert.ok(usesSharedAuthShell(resetPage), "reset password page must use shared shell");
  });

  it("keeps credentials auth and gates OAuth providers behind env configuration", () => {
    assert.match(authConfig, /Credentials\(/, "credentials provider must remain configured");
    assert.match(authConfig, /buildOAuthProviders\(/, "OAuth providers must be composed from oauth-config.server");
    assert.match(authConfig, /oauth-config\.server/, "OAuth providers must load server-only oauth config");
    assert.match(oauthConfigEnv, /isGoogleOAuthConfigured/, "Google OAuth must be env-gated");
    assert.match(oauthConfigEnv, /isAppleOAuthConfigured/, "Apple OAuth must be env-gated");
    assert.match(oauthConfigServer, /buildOAuthProviders/, "server oauth config must build providers");
    assert.doesNotMatch(oauthConfigEnv, /node:fs/, "client-safe oauth env module must not import fs");
    assert.match(authConfig, /oauthAuthCallbacks/, "OAuth signIn/redirect callbacks must be wired");
    assert.match(authConfig, /pages:\s*{[\s\S]*signIn:\s*"\/login"[\s\S]*error:\s*"\/login"/, "Auth.js route contract changed");
  });

  it("centralizes return-intent restoration in auth-flow-governance", () => {
    assert.match(authGovernance, /resolveAuthReturnDestination/, "governance must resolve post-auth destinations");
    assert.match(authGovernance, /resolveLearnerStudyCallbackPath/, "learner study callbacks must be first-class");
    assert.match(oauthButtons, /nn-premium-auth-oauth-button/, "OAuth UI must use premium Blossom classes");
    assert.match(oauthButtonsServer, /oauth-config-env/, "OAuth button list must use client-safe oauth env module");
  });

  it("surfaces compliance copy, legal links, account deletion discoverability, and pathway labels", () => {
    assert.match(authConstants, /does not provide medical advice, diagnosis, or treatment/, "educational disclaimer missing");
    assert.match(supportFooter, /Terms Of Service/, "Terms link label missing");
    assert.match(supportFooter, /Privacy Policy/, "Privacy link label missing");
    const storyPanel = read(path.resolve(ROOT, "src/components/auth/auth-experience/auth-story-panel.tsx"));
    assert.match(storyPanel, /Account Settings/, "account deletion discoverability missing");
    for (const label of REQUIRED_PATHWAY_LABELS) {
      assert.match(signupPathway + signupForm, escaped(label), `${label} missing from signup pathway surfaces`);
    }
    assert.match(signupPathway, /Choose your pathway/i, "signup pathway heading missing");
  });

  it("adds premium hooks to forms, verification, email sent, auth error, and subscription-required states", () => {
    assert.match(loginForm, /data-nn-premium-auth-form="login"/, "login form hook missing");
    assert.match(signupForm, /AuthFormLayout[\s\S]*formId="signup"/, "signup form hook missing");
    assert.match(forgotForm, /data-nn-premium-auth-form="forgot-password"/, "forgot form hook missing");
    assert.match(resetForm, /data-nn-premium-auth-form="reset-password"/, "reset form hook missing");
    assert.match(verifyBanner, /data-nn-premium-auth-verification/, "verification hook missing");
    assert.match(forgotForm, /data-nn-premium-auth-email-sent/, "email sent hook missing");
    assert.match(resetForm, /data-nn-premium-auth-error-state/, "auth error hook missing");
    assert.match(trialBlocked, /data-nn-premium-auth-subscription-required/, "subscription-required hook missing");
  });

  it("keeps styling token-driven with mobile safe-area and reduced-motion support", () => {
    for (const token of [
      "--auth-primary",
      "--auth-focus",
      "--auth-input-bg",
      "--auth-button-primary",
      "--auth-success",
      "--auth-warning",
      "--auth-danger",
    ]) {
      assert.match(authTokensCss, new RegExp(token), `${token} should be defined in auth-tokens.css`);
    }
    assert.match(authCssBundle, /env\(safe-area-inset-bottom/, "safe-area bottom handling missing");
    assert.match(authTokensCss, /prefers-reduced-motion:\s*reduce/, "reduced-motion handling missing");
    assert.match(authTokensCss, /nn-premium-auth-primary-button/, "premium button styling missing");
    assert.match(authPrimitives, /AuthInput/, "shared auth input primitive required");
  });

  it("documents visual regression capture and convergence audit artifacts", () => {
    assert.ok(fs.existsSync(CAPTURE_SPEC_PATH), "blossom auth capture spec must exist");
    assert.ok(fs.existsSync(CONVERGENCE_AUDIT_PATH), "convergence audit doc must exist");
  });
});
