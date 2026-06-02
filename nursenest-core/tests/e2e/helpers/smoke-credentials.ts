/**
 * QA smoke suite credentials — prefer explicit `QA_*` vars; fall back to existing E2E / Playwright names.
 */
export type SmokeCredentials = { email: string; password: string };

export function getQaFreeCredentials(): SmokeCredentials | null {
  const email = process.env.QA_FREE_EMAIL?.trim() || process.env.E2E_FREE_EMAIL?.trim();
  const password = process.env.QA_FREE_PASSWORD ?? process.env.E2E_FREE_PASSWORD;
  if (!email || password === undefined || String(password).length === 0) return null;
  return { email, password: String(password) };
}

/** Paid QA account if configured, otherwise free — for shared learner flows (e.g. marketing homepage when signed in). */
export function getQaPaidOrFreeCredentials(): SmokeCredentials | null {
  return getQaPaidCredentials() ?? getQaFreeCredentials();
}

/** Which env pair supplied paid E2E credentials (for diagnostics only; never log passwords). */
export type PaidCredentialSource = "QA_PAID_EMAIL" | "E2E_PAID_EMAIL" | "PLAYWRIGHT_TEST_EMAIL";

export type ResolvedPaidCredentials = {
  email: string;
  password: string;
  source: PaidCredentialSource;
};

/** `ab***@domain.com` — safe to embed in reports. */
export function maskEmailForReport(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  const user = email.slice(0, at);
  const domain = email.slice(at + 1);
  const prefix = user.length <= 2 ? user[0] ?? "*" : user.slice(0, 2);
  return `${prefix}***@${domain}`;
}

/**
 * Same resolution order as {@link getQaPaidCredentials}, but exposes which env vars were used.
 * Password is never returned in logs — callers should only use it for login.
 */
export function resolveQaPaidCredentialsWithSource(): ResolvedPaidCredentials | null {
  const a = process.env.QA_PAID_EMAIL?.trim();
  const b = process.env.QA_PAID_PASSWORD;
  if (a && b !== undefined && String(b).length > 0) {
    return { email: a, password: String(b), source: "QA_PAID_EMAIL" };
  }
  const c = process.env.E2E_PAID_EMAIL?.trim();
  const d = process.env.E2E_PAID_PASSWORD;
  if (c && d !== undefined && String(d).length > 0) {
    return { email: c, password: String(d), source: "E2E_PAID_EMAIL" };
  }
  const e = process.env.PLAYWRIGHT_TEST_EMAIL?.trim();
  const f = process.env.PLAYWRIGHT_TEST_PASSWORD;
  if (e && f !== undefined && String(f).length > 0) {
    return { email: e, password: String(f), source: "PLAYWRIGHT_TEST_EMAIL" };
  }
  return null;
}

export function getQaPaidCredentials(): SmokeCredentials | null {
  const r = resolveQaPaidCredentialsWithSource();
  return r ? { email: r.email, password: r.password } : null;
}

export { getAdminE2eCredentials, hasAdminE2eCredentials } from "./admin-e2e-credentials";
