/**
 * Token + primitive enforcement for premium auth convergence.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-auth-token-enforcement.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const AUTH_DIR = path.resolve(ROOT, "src/components/auth");
const AUTH_TOKENS_CSS = path.resolve(ROOT, "src/app/styles/marketing/auth-tokens.css");
const AUTH_PRIMITIVES = path.resolve(ROOT, "src/components/auth/auth-experience/auth-primitives.tsx");

const REQUIRED_AUTH_TOKENS = [
  "--auth-bg",
  "--auth-surface",
  "--auth-border",
  "--auth-heading",
  "--auth-subtext",
  "--auth-primary",
  "--auth-focus",
  "--auth-input-bg",
  "--auth-input-border",
  "--auth-button-primary",
  "--auth-success",
  "--auth-warning",
  "--auth-danger",
  "--auth-info",
] as const;

const AUTH_FORM_FILES = [
  "login-form.tsx",
  "signup-form.tsx",
  "forgot-password-form.tsx",
  "reset-password-form.tsx",
  "auth-verify-email-pending.tsx",
] as const;

/** Product UI violations — theme CSS and third-party SVG fills are excluded. */
const FORBIDDEN_TSX_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /border-amber-\d+/, reason: "use --auth-warning via nn-premium-auth-dev-notice or AuthMessageBanner" },
  { pattern: /bg-amber-\d+/, reason: "use semantic auth warning tokens" },
  { pattern: /text-amber-\d+/, reason: "use semantic auth warning tokens" },
  { pattern: /border-\[var\(--border-medium\)\]/, reason: "use nn-premium-auth-input token classes" },
  { pattern: /bg-\[var\(--bg-card\)\]/, reason: "use nn-premium-auth-input token classes" },
  { pattern: /rounded-xl.*nn-premium-auth-input|nn-premium-auth-input.*rounded-xl/, reason: "radius from --auth-radius-input in CSS" },
];

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

function listAuthTsxFiles(): string[] {
  const out: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".tsx")) out.push(full);
    }
  }
  walk(AUTH_DIR);
  return out;
}

describe("premium auth token enforcement", () => {
  const tokensCss = read(AUTH_TOKENS_CSS);
  const primitives = read(AUTH_PRIMITIVES);

  it("defines all required auth semantic tokens on .nn-premium-auth-system", () => {
    for (const token of REQUIRED_AUTH_TOKENS) {
      assert.match(tokensCss, new RegExp(`${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`), `${token} missing`);
    }
  });

  it("exports shared auth form primitives for inputs, buttons, and fields", () => {
    assert.match(primitives, /export function AuthInput/, "AuthInput primitive required");
    assert.match(primitives, /export function AuthPrimaryButton/, "AuthPrimaryButton primitive required");
    assert.match(primitives, /export function AuthField/, "AuthField primitive required");
    assert.match(primitives, /nn-premium-auth-input/, "primitive must bind input class");
    assert.match(primitives, /nn-premium-auth-primary-button/, "primitive must bind button class");
  });

  it("keeps canonical auth forms free of rogue Tailwind color/spacing overrides", () => {
    for (const file of AUTH_FORM_FILES) {
      const full = path.join(AUTH_DIR, file);
      const source = read(full);
      for (const { pattern, reason } of FORBIDDEN_TSX_PATTERNS) {
        assert.doesNotMatch(source, pattern, `${file}: ${reason}`);
      }
    }
  });

  it("requires auth forms to use shared primitives or nn-premium-auth-input class", () => {
    for (const file of AUTH_FORM_FILES) {
      const source = read(path.join(AUTH_DIR, file));
      assert.match(
        source,
        /AuthInput|AuthField|nn-premium-auth-input/,
        `${file} must use AuthInput/AuthField or nn-premium-auth-input`,
      );
      if (file === "signup-form.tsx") {
        assert.match(source, /AuthFormLayout[\s\S]*formId="signup"/, "signup must use AuthFormLayout");
      } else if (file !== "auth-verify-email-pending.tsx") {
        assert.match(
          source,
          /AuthPrimaryButton|nn-premium-auth-primary-button/,
          `${file} must use AuthPrimaryButton or nn-premium-auth-primary-button`,
        );
      } else {
        assert.match(
          source,
          /nn-premium-auth-verified__secondary-btn|AuthPrimaryButton|nn-premium-auth-primary-button/,
          `${file} must use auth button token classes`,
        );
      }
    }
  });

  it("standardizes motion tokens for auth transitions", () => {
    assert.match(tokensCss, /--nn-auth-motion-fade:\s*350ms/, "fade duration");
    assert.match(tokensCss, /--nn-auth-motion-loading-pulse:\s*1\.2s/, "loading pulse");
    assert.match(tokensCss, /prefers-reduced-motion:\s*reduce/, "reduced motion guard");
    assert.match(tokensCss, /160ms ease/, "interaction timing on primary button");
  });

  it("does not hardcode hex in auth experience TSX (except OAuth brand SVG)", () => {
    const experienceDir = path.join(AUTH_DIR, "auth-experience");
    for (const file of fs.readdirSync(experienceDir).filter((f) => f.endsWith(".tsx"))) {
      const source = read(path.join(experienceDir, file));
      assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, `${file} must not contain hex colors`);
    }
  });
});

describe("premium auth accessibility hooks", () => {
  it("AuthMessageBanner uses alert role for danger tone", () => {
    const banner = read(path.join(AUTH_DIR, "auth-experience/auth-message-banner.tsx"));
    assert.match(banner, /role={role}/, "dynamic role");
    assert.match(banner, /tone === "danger" \? "alert"/, "danger uses alert");
    assert.match(banner, /aria-live/, "live region");
  });

  it("AuthInput supports aria-invalid propagation", () => {
    const primitives = read(AUTH_PRIMITIVES);
    assert.match(primitives, /aria-invalid/, "invalid state wiring");
  });

  it("loading transitions expose aria-live polite regions", () => {
    const shell = read(path.join(AUTH_DIR, "auth-experience/auth-transition-shell.tsx"));
    assert.match(shell, /aria-live="polite"/, "loading strip live region");
    assert.match(shell, /aria-busy="true"/, "loading busy state");
  });
});
