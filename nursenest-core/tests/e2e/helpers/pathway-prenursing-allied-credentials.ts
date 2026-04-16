/**
 * QA credentials for pre-nursing / allied pathway E2E.
 * Tries pathway-specific `PREFIX_EMAIL` / `PREFIX_PASSWORD`, then {@link getQaPaidCredentials}.
 */
import type { SmokeCredentials } from "./smoke-credentials";
import { getQaPaidCredentials } from "./smoke-credentials";

export function resolvePrenursingAlliedCredentials(prefixes: string[]): SmokeCredentials | null {
  for (const prefix of prefixes) {
    const email = process.env[`${prefix}_EMAIL`]?.trim();
    const password = process.env[`${prefix}_PASSWORD`];
    if (email && password !== undefined && String(password).length > 0) {
      return { email, password: String(password) };
    }
  }
  return getQaPaidCredentials();
}
