/**
 * Next.js client instrumentation entry — must stay lightweight.
 * Sentry.init lives in `sentry.client.config.ts` (Session Replay + tracing).
 */
import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true") {
  void import("./sentry.client.config");
}

export const onRouterTransitionStart =
  process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true"
    ? Sentry.captureRouterTransitionStart
    : () => {};
