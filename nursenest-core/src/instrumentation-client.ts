/**
 * Next.js client instrumentation entry.
 *
 * Keep this file extremely small. Do not import `@sentry/nextjs` here directly,
 * because this module is loaded by Next's instrumentation pipeline.
 *
 * Sentry.init stays in `sentry.client.config.ts`.
 */

import { isSentryClientRuntimeEnabled } from "@/lib/observability/sentry-flags";
import { importSentryNextjs } from "@/lib/observability/sentry-nextjs-dynamic";

if (isSentryClientRuntimeEnabled()) {
  void import("./sentry.client.config").catch(() => {});
}

/**
 * Args are intentionally `unknown[]` so this file does not need to import
 * Sentry router-transition types at compile time.
 */
export function onRouterTransitionStart(...args: unknown[]): void {
  if (!isSentryClientRuntimeEnabled()) return;

  void importSentryNextjs()
    .then((Sentry) => {
      const captureRouterTransitionStart = (Sentry as unknown as { captureRouterTransitionStart?: (...routerArgs: unknown[]) => void }).captureRouterTransitionStart;

      captureRouterTransitionStart?.(...args);
    })
    .catch(() => {});
}