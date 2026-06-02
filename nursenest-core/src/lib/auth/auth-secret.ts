/**
 * Startup diagnostics for Auth.js / NextAuth session signing secret (logging).
 *
 * Resolution helpers live in {@link ./auth-session-signing-env} (Edge-safe, no Sentry).
 */

import {
  getAuthSecretEnvPresenceReport,
  isAuthSecretBuildToleranceContext,
  resolveAuthSecretFromEnv,
} from "@/lib/auth/auth-session-signing-env";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";

export type { AuthSecretSource, ResolvedAuthSecret } from "@/lib/auth/auth-session-signing-env";
export {
  assertDevAuthSigningSecretConfiguredOrThrow,
  getAuthSecretEnvPresenceReport,
  isAuthSecretBuildToleranceContext,
  isAuthSecretConfigured,
  resolveAuthSecretFromEnv,
} from "@/lib/auth/auth-session-signing-env";

type StartupDedupe = {
  buildMissingLogged: boolean;
  runtimeMissingLogged: boolean;
};

const GLOBAL_KEY = "__nnAuthSecretStartupDedupe" as const;

function readDedupe(): StartupDedupe {
  const g = globalThis as unknown as { [GLOBAL_KEY]?: StartupDedupe };
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = { buildMissingLogged: false, runtimeMissingLogged: false };
  }
  return g[GLOBAL_KEY]!;
}

/** Test hook — clears per-process dedupe flags. */
export function resetAuthSecretStartupDedupeForTests(): void {
  const g = globalThis as unknown as { [GLOBAL_KEY]?: StartupDedupe };
  delete g[GLOBAL_KEY];
}

/**
 * One-time startup diagnostics for a missing auth secret.
 *
 * - During `next build` (NEXT_PHASE, npm lifecycle `build`, or `next build` argv): single non-critical log.
 * - Production runtime (outside build phases): single critical log (existing behavior).
 * - Development runtime: optional single informational line (deduped with build path if both ran — rare).
 */
export function reportAuthSecretStartupStatus(surface: string): void {
  const resolved = resolveAuthSecretFromEnv();
  if (resolved.secret) {
    return;
  }

  const dedupe = readDedupe();
  const presence = getAuthSecretEnvPresenceReport();
  const meta = {
    surface,
    ...presence,
    NEXT_PHASE: process.env.NEXT_PHASE?.trim() || undefined,
    npm_lifecycle_event: process.env.npm_lifecycle_event?.trim() || undefined,
  };

  if (isAuthSecretBuildToleranceContext()) {
    if (dedupe.buildMissingLogged) return;
    dedupe.buildMissingLogged = true;
    safeServerLog("auth", "missing_auth_secret_build", {
      ...meta,
      hint: "Build-time: sessions are not served; set AUTH_SECRET for production runtime (DigitalOcean App Platform env). See reports/auth-secret-runtime-setup.md.",
    });
    return;
  }

  if (process.env.NODE_ENV === "production") {
    if (dedupe.runtimeMissingLogged) return;
    dedupe.runtimeMissingLogged = true;
    safeServerLogCritical(
      "auth",
      "missing_auth_secret",
      { surface, ...presence },
      new Error("AUTH_SECRET (or NEXTAUTH_SECRET) must be set in production for JWT signing"),
    );
    return;
  }

  if (dedupe.buildMissingLogged || dedupe.runtimeMissingLogged) return;
  dedupe.buildMissingLogged = true;
  safeServerLog("auth", "missing_auth_secret_dev", {
    ...meta,
    hint: "Set AUTH_SECRET in .env.local for local dev (see reports/auth-secret-runtime-setup.md).",
  });
}
