/**
 * Next.js client instrumentation entry — must stay lightweight.
 * Sentry.init lives in `sentry.client.config.ts` (Session Replay + tracing).
 */
import { isSentryClientRuntimeEnabled } from "@/lib/observability/sentry-flags";
import { importSentryNextjs } from "@/lib/observability/sentry-nextjs-dynamic";

if (isSentryClientRuntimeEnabled()) {
  void import("./sentry.client.config");
}

/** Args forwarded to `captureRouterTransitionStart` — typed as `unknown[]` to avoid a compile-time `@sentry/nextjs` type probe. */
export function onRouterTransitionStart(...args: unknown[]): void {
  if (!isSentryClientRuntimeEnabled()) return;
  void importSentryNextjs()
    .then((Sentry) => {
      const fn = Sentry.captureRouterTransitionStart as (...a: unknown[]) => void;
      fn(...args);
    })
    .catch(() => {});
}
