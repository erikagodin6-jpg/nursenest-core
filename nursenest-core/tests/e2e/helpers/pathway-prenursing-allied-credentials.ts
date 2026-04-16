/**
 * QA credentials for pre-nursing / allied pathway E2E.
 *
 * Resolution order (per row): pathway-specific `PREFIX_EMAIL` / `PREFIX_PASSWORD` first, then
 * {@link getQaPaidCredentials} as final fallback. The spec asserts session tier/country so a wrong
 * fallback surfaces as an explicit failure (e.g. CA allied vs US-only account).
 */
import type { SmokeCredentials } from "./smoke-credentials";
import { getQaPaidCredentials } from "./smoke-credentials";

export type ResolvedPrenursingAlliedCredentials = SmokeCredentials & {
  /** Which env var name or rule supplied the email (for failure artifacts). */
  sourceLabel: string;
};

export function resolvePrenursingAlliedCredentials(prefixes: string[]): ResolvedPrenursingAlliedCredentials | null {
  for (const prefix of prefixes) {
    const email = process.env[`${prefix}_EMAIL`]?.trim();
    const password = process.env[`${prefix}_PASSWORD`];
    if (email && password !== undefined && String(password).length > 0) {
      return { email, password: String(password), sourceLabel: `${prefix}_EMAIL` };
    }
  }
  const generic = getQaPaidCredentials();
  if (generic) {
    return { ...generic, sourceLabel: "QA_PAID_EMAIL (generic fallback)" };
  }
  return null;
}
