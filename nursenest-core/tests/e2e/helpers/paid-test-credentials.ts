import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const LOCAL_ENV_PATH = path.resolve(process.cwd(), ".env.playwright.local");

if (fs.existsSync(LOCAL_ENV_PATH)) {
  dotenv.config({ path: LOCAL_ENV_PATH, override: false });
}

/**
 * Paid seeded test account (premium entitlements, no Stripe in routine E2E).
 *
 * **Do not commit real credentials.** Provide via environment variables:
 *
 * 1. **Preferred:** `E2E_PAID_EMAIL` and `E2E_PAID_PASSWORD`
 * 2. **QA / smoke alias:** `QA_PAID_EMAIL` and `QA_PAID_PASSWORD` (same semantics)
 * 3. **Alternative:** `PLAYWRIGHT_TEST_EMAIL` and `PLAYWRIGHT_TEST_PASSWORD` (same semantics)
 *
 * Optional: `PLAYWRIGHT_PAID_AUTH_STATE` overrides the saved storage JSON path (see `auth-state-paths.ts`).
 * Session file is written once per run by `tests/e2e/setup/auth.setup.ts` and reused via `chromium-paid` `storageState`.
 *
 * Local: optional `.env.playwright.local` at the package root (gitignored); does not override existing env (CI wins).
 */
export type PaidTestCredentials = { email: string; password: string };

/** Which env pair `getPaidTestCredentials` resolved (no secret values). */
export type PaidCredentialSource = "QA_PAID_*" | "E2E_PAID_*" | "PLAYWRIGHT_TEST_*" | "none";

export function getPaidCredentialSource(): PaidCredentialSource {
  const qa = process.env.QA_PAID_EMAIL?.trim();
  const qb = process.env.QA_PAID_PASSWORD;
  if (qa && qb !== undefined && String(qb).length > 0) return "QA_PAID_*";
  const a = process.env.E2E_PAID_EMAIL?.trim();
  const b = process.env.E2E_PAID_PASSWORD;
  if (a && b) return "E2E_PAID_*";
  const c = process.env.PLAYWRIGHT_TEST_EMAIL?.trim();
  const d = process.env.PLAYWRIGHT_TEST_PASSWORD;
  if (c && d) return "PLAYWRIGHT_TEST_*";
  return "none";
}

/** Masks an email for logs (keeps domain). */
export function maskEmailForDiagnostics(email: string): string {
  const at = email.indexOf("@");
  if (at <= 1) return email.length > 0 ? "***" : "";
  return `${email[0]}***@${email.slice(at + 1)}`;
}

export function describePaidCredentialResolution(): {
  source: PaidCredentialSource;
  emailPresent: boolean;
  passwordPresent: boolean;
  maskedEmail: string | null;
} {
  const creds = getPaidTestCredentials();
  const source = getPaidCredentialSource();
  return {
    source,
    emailPresent: Boolean(creds?.email),
    passwordPresent: Boolean(creds?.password && String(creds.password).length > 0),
    maskedEmail: creds?.email ? maskEmailForDiagnostics(creds.email) : null,
  };
}

export function getPaidTestCredentials(): PaidTestCredentials | null {
  const qa = process.env.QA_PAID_EMAIL?.trim();
  const qb = process.env.QA_PAID_PASSWORD;
  if (qa && qb !== undefined && String(qb).length > 0) {
    return { email: qa, password: String(qb) };
  }
  const a = process.env.E2E_PAID_EMAIL?.trim();
  const b = process.env.E2E_PAID_PASSWORD;
  if (a && b) {
    return { email: a, password: b };
  }
  const c = process.env.PLAYWRIGHT_TEST_EMAIL?.trim();
  const d = process.env.PLAYWRIGHT_TEST_PASSWORD;
  if (c && d) {
    return { email: c, password: d };
  }
  return null;
}

export function hasPaidTestCredentials(): boolean {
  return getPaidTestCredentials() !== null;
}
