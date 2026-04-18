/**
 * Next.js client instrumentation entry — must stay lightweight.
 * Sentry.init lives in `sentry.client.config.ts` (Session Replay + tracing).
 */
import * as Sentry from "@sentry/nextjs";
import { isSentryClientRuntimeEnabled } from "@/lib/observability/sentry-flags";

if (isSentryClientRuntimeEnabled()) {
  void import("./sentry.client.config");
}

export const onRouterTransitionStart =
  isSentryClientRuntimeEnabled()
    ? Sentry.captureRouterTransitionStart
    : () => {};
