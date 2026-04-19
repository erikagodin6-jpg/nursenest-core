import "server-only";

import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";

type SpanOpts = {
  name: string;
  op: string;
  attributes?: Record<string, string | number | boolean | undefined>;
};

/**
 * Leaf entry for Sentry spans — layouts and other hot parents import this file only (no static
 * `sentry-route-observability` / `@sentry/nextjs` graph edge).
 */
export async function withSentryRuntimeSpan<T>(opts: SpanOpts, fn: () => Promise<T>): Promise<T> {
  if (!isSentryServerRuntimeEnabled()) return fn();
  const { withSentryServerSpan } = await import("@/lib/observability/sentry-route-observability");
  return withSentryServerSpan(opts, fn);
}

export function captureSentryRuntimeSoftError(opts: {
  scope: string;
  event: string;
  error?: unknown;
  meta?: Record<string, string | number | boolean | undefined>;
  route?: string;
  feature?: string;
  level?: "warning" | "error";
}): void {
  if (!isSentryServerRuntimeEnabled()) return;
  void import("@/lib/observability/sentry-route-observability")
    .then((m) => {
      m.captureSentrySoftError(opts);
    })
    .catch(() => {});
}
