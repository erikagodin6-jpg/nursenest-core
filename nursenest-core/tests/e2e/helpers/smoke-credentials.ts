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

export function getQaPaidCredentials(): SmokeCredentials | null {
  const a = process.env.QA_PAID_EMAIL?.trim();
  const b = process.env.QA_PAID_PASSWORD;
  if (a && b !== undefined && String(b).length > 0) {
    return { email: a, password: String(b) };
  }
  const c = process.env.E2E_PAID_EMAIL?.trim();
  const d = process.env.E2E_PAID_PASSWORD;
  if (c && d !== undefined && String(d).length > 0) {
    return { email: c, password: String(d) };
  }
  const e = process.env.PLAYWRIGHT_TEST_EMAIL?.trim();
  const f = process.env.PLAYWRIGHT_TEST_PASSWORD;
  if (e && f !== undefined && String(f).length > 0) {
    return { email: e, password: String(f) };
  }
  return null;
}

export { getAdminE2eCredentials, hasAdminE2eCredentials } from "./admin-e2e-credentials";
