/**
 * Operator-facing Phase 0 (env + DB + login + learner shell) classifications for RN full-content.
 * Maps Auth.js credential callback `code` query params (see `src/lib/auth.ts`) to stable labels.
 */

/** Auth.js `authorize` credential codes when diagnostic mode is enabled. */
export type AuthCredentialCallbackCode =
  | "rate_limited"
  | "missing_credentials"
  | "account_locked"
  | "duplicate_user"
  | "db_url_auth"
  | "db_lookup"
  | "user_missing"
  | "no_password_hash"
  | "system_error"
  | "password_invalid"
  | "credentials";

/** Single primary label for reports / suite JSON (no secrets). */
export type RnPhase0PrimaryClassification =
  | "ENVIRONMENT_UNREACHABLE"
  | "DATABASE_URL_NOT_SET"
  | "DB_AUTH_FAILURE"
  | "DB_UNAVAILABLE"
  | "QA_CREDENTIALS_MISSING"
  | "QA_USER_MISSING"
  | "QA_PASSWORD_REJECTED"
  | "ACCOUNT_LOCKED"
  | "RATE_LIMITED"
  | "DUPLICATE_USER_MATCH"
  | "USER_ACCOUNT_MISSING_PASSWORD"
  | "AUTH_SYSTEM_ERROR"
  | "LOGIN_PAGE_OR_FORM_LOAD_FAILED"
  | "CREDENTIALS_CALLBACK_TIMEOUT_OR_MISSING"
  | "AUTH_CALLBACK_REJECTED"
  | "LEARNER_SHELL_TRANSITION_FAILED"
  | "ENTITLEMENT_OR_PAYWALL_BLOCKING_LEARNER"
  | "UNKNOWN_LOGIN_FAILURE";

export type DatabasePreflightClassification =
  | "SKIPPED_NO_DATABASE_URL"
  | "OK"
  | "DB_AUTH_FAILURE"
  | "CONNECTION_REFUSED"
  | "TIMEOUT"
  | "DNS_OR_NETWORK"
  | "OTHER";

export function mapDatabasePreflightToPrimary(c: DatabasePreflightClassification): RnPhase0PrimaryClassification | null {
  switch (c) {
    case "SKIPPED_NO_DATABASE_URL":
      return "DATABASE_URL_NOT_SET";
    case "DB_AUTH_FAILURE":
      return "DB_AUTH_FAILURE";
    case "CONNECTION_REFUSED":
    case "TIMEOUT":
    case "DNS_OR_NETWORK":
    case "OTHER":
      return "DB_UNAVAILABLE";
    case "OK":
      return null;
    default:
      return "DB_UNAVAILABLE";
  }
}

export function mapAuthCallbackCodeToPrimary(code: string | null | undefined): RnPhase0PrimaryClassification {
  switch (code) {
    case "db_url_auth":
      return "DB_AUTH_FAILURE";
    case "db_lookup":
      return "DB_UNAVAILABLE";
    case "user_missing":
      return "QA_USER_MISSING";
    case "password_invalid":
      return "QA_PASSWORD_REJECTED";
    case "account_locked":
      return "ACCOUNT_LOCKED";
    case "rate_limited":
      return "RATE_LIMITED";
    case "duplicate_user":
      return "DUPLICATE_USER_MATCH";
    case "no_password_hash":
      return "USER_ACCOUNT_MISSING_PASSWORD";
    case "system_error":
      return "AUTH_SYSTEM_ERROR";
    case "missing_credentials":
      return "QA_CREDENTIALS_MISSING";
    case "credentials":
      return "AUTH_CALLBACK_REJECTED";
    default:
      return "AUTH_CALLBACK_REJECTED";
  }
}

export function humanReadableOperatorHint(classification: RnPhase0PrimaryClassification): string {
  switch (classification) {
    case "ENVIRONMENT_UNREACHABLE":
      return "Fix BASE_URL / dev server: origin or /login HTTP probe failed before any authentication.";
    case "DATABASE_URL_NOT_SET":
      return "Set DATABASE_URL in the environment used by this Playwright process (must match the app server for meaningful DB preflight).";
    case "DB_AUTH_FAILURE":
      return "Postgres rejected the database user/password in DATABASE_URL (invalid credentials for the DB, not the QA web login). Fix DATABASE_URL or DB role password.";
    case "DB_UNAVAILABLE":
      return "Could not reach Postgres or Prisma query failed (not necessarily QA email/password). Check DATABASE_URL host/port, network, TLS, and DB health.";
    case "QA_CREDENTIALS_MISSING":
      return "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* or PLAYWRIGHT_TEST_*). The suite does not skip when unset.";
    case "QA_USER_MISSING":
      return "No user row matches the QA identifier in the database behind DATABASE_URL — seed or reset the QA paid account.";
    case "QA_PASSWORD_REJECTED":
      return "User exists but bcrypt password does not match QA_PAID_PASSWORD (or chosen env pair).";
    case "ACCOUNT_LOCKED":
      return "Login lockout/rate protection blocked this identifier — wait or clear lockout for the QA account.";
    case "RATE_LIMITED":
      return "IP-level login rate limit — slow down or adjust limits for the test environment.";
    case "DUPLICATE_USER_MATCH":
      return "Ambiguous duplicate user match for this identifier — resolve data integrity for the QA account.";
    case "USER_ACCOUNT_MISSING_PASSWORD":
      return "User exists but has no password hash — fix account data or use password reset.";
    case "AUTH_SYSTEM_ERROR":
      return "Password compare or internal auth error — check server logs.";
    case "LOGIN_PAGE_OR_FORM_LOAD_FAILED":
      return "/login did not expose #login-identifier / #login-password in time — app bundle, routing, or crash.";
    case "CREDENTIALS_CALLBACK_TIMEOUT_OR_MISSING":
      return "No JSON response from /api/auth/callback/credentials — Auth route down, CSRF, or blocked request.";
    case "AUTH_CALLBACK_REJECTED":
      return "Credentials callback returned an error redirect (see authCallbackCode in artifact).";
    case "LEARNER_SHELL_TRANSITION_FAILED":
      return "Auth callback succeeded but navigation did not reach a learner-shell route in time.";
    case "ENTITLEMENT_OR_PAYWALL_BLOCKING_LEARNER":
      return "On learner surface but subscription/paywall blocked paid verification — fix entitlements for the QA user.";
    case "UNKNOWN_LOGIN_FAILURE":
      return "See rn-full-content-login-and-auth.json and server logs.";
    default:
      return "See attached JSON artifacts.";
  }
}
