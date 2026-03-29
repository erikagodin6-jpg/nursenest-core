/**
 * Next.js client instrumentation entry — must stay lightweight.
 * Sentry.init lives in `sentry.client.config.ts` (Session Replay + tracing).
 */
import "./sentry.client.config";
import * as Sentry from "@sentry/nextjs";

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
