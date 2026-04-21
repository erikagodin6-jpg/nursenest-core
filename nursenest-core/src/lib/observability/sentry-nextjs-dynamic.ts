/**
 * Runtime-only `@sentry/nextjs` load for server and client code paths.
 *
 * `webpackIgnore: true` prevents webpack from statically tracing this dependency into broad server
 * chunks (smaller compile graph when `SENTRY_ENABLED` is false at build time). The package remains
 * installed; when Sentry is enabled in production, Node resolves it normally at runtime.
 */
export function importSentryNextjs(): Promise<typeof import("@sentry/nextjs")> {
  return import(/* webpackIgnore: true */ "@sentry/nextjs");
}
