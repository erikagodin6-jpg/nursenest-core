/**
 * Sentry browser SDK — loaded via `instrumentation-client.ts`.
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */
import * as Sentry from "@sentry/nextjs";
import { browserTracingIntegration, replayIntegration } from "@sentry/nextjs";
import { getSentryDsnClient } from "@/lib/observability/sentry-dsn";
import { getSentryReleaseClient } from "@/lib/observability/sentry-release";
import { scrubSentryEvent } from "@/lib/observability/sentry-scrub";

const isDev = process.env.NODE_ENV === "development";

function tracesSampleRate(): number {
  if (isDev) return Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.2);
  return Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.08);
}

/** Normal sessions: low sample to limit performance/bandwidth (recommended < 10%). */
function replaysSessionSampleRate(): number {
  return Number(process.env.NEXT_PUBLIC_SENTRY_REPLAY_SESSION_SAMPLE_RATE ?? (isDev ? 0 : 0.05));
}

Sentry.init({
  dsn: getSentryDsnClient(),
  release: getSentryReleaseClient(),
  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
  sendDefaultPii: false,
  tracesSampleRate: tracesSampleRate(),
  integrations: [
    browserTracingIntegration(),
    replayIntegration({ maskAllText: true, blockAllMedia: true }),
  ],
  replaysSessionSampleRate: replaysSessionSampleRate(),
  replaysOnErrorSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE ?? 1),
  maxBreadcrumbs: 60,
  ignoreErrors: [
    /^ResizeObserver loop/i,
    /Non-Error promise rejection/i,
    /Loading chunk \d+ failed/i,
    /Failed to fetch dynamically imported module/i,
  ],
  beforeSend(event) {
    if (typeof window !== "undefined") {
      const mechanismType = event.exception?.values?.[0]?.mechanism?.type;
      const isUnhandledRejection = mechanismType === "auto.browser.global_handlers.onunhandledrejection";
      event.tags = {
        ...event.tags,
        route: window.location.pathname,
        environment:
          process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
        ...(isUnhandledRejection ? { feature: "unhandledrejection" } : {}),
      };
    }
    return scrubSentryEvent(event) as typeof event;
  },
});
