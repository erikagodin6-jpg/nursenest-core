/**
 * Default when no env is set — must match `playwright.release-gate.config.ts` `use.baseURL`.
 * Use 127.0.0.1 (not `localhost`) so APIRequestContext and `next dev --hostname 127.0.0.1` align
 * (Node often resolves `localhost` to ::1 while dev binds IPv4 only → ECONNREFUSED).
 */
export const E2E_DEFAULT_BASE_URL = "http://127.0.0.1:3000";

function trimBase(raw: string): string {
  return raw.replace(/\/$/, "");
}

/**
 * Env-only resolution (no Playwright fixture). Same precedence as the release-gate Playwright config:
 * `BASE_URL` → `PLAYWRIGHT_BASE_URL` → `NURSENEST_PRODUCTION_BASE_URL` → default.
 */
export function getE2eBaseURL(): string {
  return trimBase(
    process.env.BASE_URL?.trim() ||
      process.env.PLAYWRIGHT_BASE_URL?.trim() ||
      process.env.NURSENEST_PRODUCTION_BASE_URL?.trim() ||
      E2E_DEFAULT_BASE_URL,
  );
}

/**
 * Prefer Playwright's configured `baseURL`, then the env chain in {@link getE2eBaseURL}.
 */
export function resolveE2eAppBaseUrl(playwrightBaseURL?: string | null): string {
  if (typeof playwrightBaseURL === "string" && playwrightBaseURL.trim()) {
    return trimBase(playwrightBaseURL.trim());
  }
  return getE2eBaseURL();
}

export function resolveE2eOrigin(playwrightBaseURL?: string | null): string {
  return new URL(resolveE2eAppBaseUrl(playwrightBaseURL)).origin;
}
