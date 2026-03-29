/**
 * Release strings for Sentry — enables the Releases UI and commit ↔ error links when set in deploy env.
 * Server: `SENTRY_RELEASE` or `VERCEL_GIT_COMMIT_SHA` (Vercel injects the latter).
 * Client: must use `NEXT_PUBLIC_*` (inlined at build). Prefer the same value as server.
 */
export function getSentryReleaseServer(): string | undefined {
  const r = process.env.SENTRY_RELEASE?.trim() || process.env.VERCEL_GIT_COMMIT_SHA?.trim();
  return r || undefined;
}

export function getSentryReleaseClient(): string | undefined {
  const r = process.env.NEXT_PUBLIC_SENTRY_RELEASE?.trim() || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.trim();
  return r || undefined;
}
