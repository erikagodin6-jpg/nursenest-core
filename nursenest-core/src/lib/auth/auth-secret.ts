/**
 * Canonical Auth.js / NextAuth session signing secret resolution.
 *
 * - Prefers `AUTH_SECRET` (Auth.js canonical), then legacy `NEXTAUTH_SECRET`.
 * - Never logs raw secret material — only presence / source labels.
 * - Startup diagnostics are deduped per process (see {@link reportAuthSecretStartupStatus}).
 */

import { isProductionBuildInvocation } from "@/lib/build/build-safe-mode";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";

export type AuthSecretSource = "AUTH_SECRET" | "NEXTAUTH_SECRET" | null;

export type ResolvedAuthSecret =
  | { secret: string; source: "AUTH_SECRET" | "NEXTAUTH_SECRET" }
  | { secret: null; source: null };

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

function isNextCompileBuildPhase(): boolean {
  const p = process.env.NEXT_PHASE;
  return p === "phase-production-build" || p === "phase-development-build";
}

/** True when `npm run build` / platform build is the active lifecycle (inherited by many child processes). */
function isNpmBuildLifecycle(): boolean {
  const ev = process.env.npm_lifecycle_event?.trim();
  return ev === "build" || ev === "vercel-build";
}

/**
 * True when the `next build` CLI is running (argv shape), including workers that omit `NEXT_PHASE`.
 * Avoid matching `next start` / `next dev`.
 */
function isNextCliBuildArgv(): boolean {
  const parts = process.argv;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const a = parts[i] ?? "";
    const isNextBin = a === "next" || a.endsWith("/next") || a.endsWith("\\next.cmd");
    if (isNextBin && parts[i + 1] === "build") return true;
  }
  return false;
}

function isAuthSecretBuildToleranceContext(): boolean {
  return (
    isProductionBuildInvocation() ||
    isNextCompileBuildPhase() ||
    isNpmBuildLifecycle() ||
    isNextCliBuildArgv()
  );
}

/**
 * Returns the signing secret and which env name supplied it.
 * Trims whitespace; empty strings are treated as unset.
 */
export function resolveAuthSecretFromEnv(): ResolvedAuthSecret {
  const auth = process.env.AUTH_SECRET?.trim();
  if (auth && auth.length > 0) {
    return { secret: auth, source: "AUTH_SECRET" };
  }
  const legacy = process.env.NEXTAUTH_SECRET?.trim();
  if (legacy && legacy.length > 0) {
    return { secret: legacy, source: "NEXTAUTH_SECRET" };
  }
  return { secret: null, source: null };
}

/** True when at least one accepted env var holds a non-empty trimmed value. */
export function isAuthSecretConfigured(): boolean {
  return resolveAuthSecretFromEnv().secret !== null;
}

/** Presence flags for CLI / env:check — never includes secret values. */
export function getAuthSecretEnvPresenceReport(): {
  AUTH_SECRET: "yes" | "no";
  NEXTAUTH_SECRET: "yes" | "no";
  resolvedFrom: AuthSecretSource;
} {
  const authSet = Boolean(process.env.AUTH_SECRET?.trim());
  const nextSet = Boolean(process.env.NEXTAUTH_SECRET?.trim());
  const r = resolveAuthSecretFromEnv();
  return {
    AUTH_SECRET: authSet ? "yes" : "no",
    NEXTAUTH_SECRET: nextSet ? "yes" : "no",
    resolvedFrom: r.source,
  };
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
