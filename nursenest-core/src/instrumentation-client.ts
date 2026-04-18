/**
 * Next.js client instrumentation entry — must stay lightweight.
 * Sentry.init lives in `sentry.client.config.ts` (Session Replay + tracing).
 */
import { isSentryClientRuntimeEnabled } from "@/lib/observability/sentry-flags";

if (isSentryClientRuntimeEnabled()) {
  void import("./sentry.client.config");
}

export function onRouterTransitionStart(
  ...args: Parameters<typeof import("@sentry/nextjs").captureRouterTransitionStart>
): void {
  if (!isSentryClientRuntimeEnabled()) return;
  void import("@sentry/nextjs")
    .then((Sentry) => {
      Sentry.captureRouterTransitionStart(...args);
    })
    .catch(() => {});
}
