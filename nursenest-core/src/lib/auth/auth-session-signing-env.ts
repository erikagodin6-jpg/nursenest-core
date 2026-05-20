/**
 * Session signing secret resolution for Auth.js / NextAuth (no logging / Sentry).
 *
 * Edge middleware and Node auth both import this module — keep it dependency-light.
 */

import { isProductionBuildInvocation } from "@/lib/build/build-safe-mode";

export type AuthSecretSource = "AUTH_SECRET" | "NEXTAUTH_SECRET" | null;

export type ResolvedAuthSecret =
  | { secret: string; source: "AUTH_SECRET" | "NEXTAUTH_SECRET" }
  | { secret: null; source: null };

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

/** Build / compile contexts where a missing secret must not fail the toolchain. */
export function isAuthSecretBuildToleranceContext(): boolean {
  return (
    isProductionBuildInvocation() ||
    isNextCompileBuildPhase() ||
    isNpmBuildLifecycle() ||
    isNextCliBuildArgv()
  );
}

/**
 * Fail fast in local `next dev` when neither `AUTH_SECRET` nor `NEXTAUTH_SECRET` is set.
 * Avoids Auth.js `[auth][error] MissingSecret` spam with a single explicit message.
 *
 * Set `NN_SKIP_DEV_AUTH_SECRET=1` only for exotic compile-only tooling that imports auth without a session.
 */
export function assertDevAuthSigningSecretConfiguredOrThrow(surface: string): void {
  if (process.env.NODE_ENV !== "development") return;
  if (process.env.NN_SKIP_DEV_AUTH_SECRET === "1") return;
  if (isAuthSecretBuildToleranceContext()) return;
  if (isAuthSecretConfigured()) return;

  throw new Error(
    [
      `[nursenest-core:${surface}] Auth.js session signing secret is missing.`,
      "Set AUTH_SECRET (preferred, Auth.js v5) or NEXTAUTH_SECRET (legacy) in nursenest-core/.env.local.",
      "Generate: openssl rand -base64 32",
      "See nursenest-core/docs/environment-reference.md#auth--sessions",
    ].join(" "),
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
