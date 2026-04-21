import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";

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

/** Capture only when `SENTRY_ENABLED` + server DSN — avoids loading `@sentry/nextjs` on cold paths. */
export async function sentryCaptureMessageWhenEnabled(
  message: string,
  captureContext?: Parameters<typeof import("@sentry/nextjs").captureMessage>[1],
): Promise<void> {
  if (!isSentryServerRuntimeEnabled()) return;
  const Sentry = await importSentryNextjs();
  Sentry.captureMessage(message, captureContext);
}

export async function sentryCaptureExceptionWhenEnabled(
  exception: unknown,
  captureContext?: Parameters<typeof import("@sentry/nextjs").captureException>[1],
): Promise<void> {
  if (!isSentryServerRuntimeEnabled()) return;
  const Sentry = await importSentryNextjs();
  Sentry.captureException(exception, captureContext);
}
