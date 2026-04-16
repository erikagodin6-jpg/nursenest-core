/**
 * Resolve QA paid credentials for pathway-specific E2E.
 *
 * Priority per pathway row: first `credentialPrefixes` entry with both `*_EMAIL` and `*_PASSWORD` set,
 * else {@link getQaPaidCredentials} (shared `QA_PAID_EMAIL`, `E2E_PAID_*`, `PLAYWRIGHT_TEST_*`).
 */
import type { SmokeCredentials } from "./smoke-credentials";
import { getQaPaidCredentials } from "./smoke-credentials";

function tryPrefix(prefix: string): SmokeCredentials | null {
  const email = process.env[`${prefix}_EMAIL`]?.trim();
  const password = process.env[`${prefix}_PASSWORD`];
  if (email && password !== undefined && String(password).length > 0) {
    return { email, password: String(password) };
  }
  return null;
}

/** Try each prefix in order, then shared paid QA credentials. */
export function resolvePathwayAccessCredentials(prefixes: string[]): SmokeCredentials | null {
  for (const p of prefixes) {
    const c = tryPrefix(p);
    if (c) return c;
  }
  return getQaPaidCredentials();
}
