/**
 * Sentry browser SDK — loaded via `instrumentation-client.ts`.
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */
import * as Sentry from "@sentry/nextjs";
import { getSentryDsnClient } from "@/lib/observability/sentry-dsn";
import {
  getSentryEnvironmentClient,
  getSentryTraceSampleRate,
  isSentryClientReplayEnabled,
} from "@/lib/observability/sentry-flags";
import { getSentryReleaseClient } from "@/lib/observability/sentry-release";
import { scrubSentryEvent } from "@/lib/observability/sentry-scrub";

function replaySampleRate(rawValue: string | undefined, fallback: number): number {
  const raw = rawValue?.trim();
  const value = raw ? Number(raw) : fallback;
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : fallback;
}

const replayEnabled = isSentryClientReplayEnabled();

Sentry.init({
  dsn: getSentryDsnClient(),
  release: getSentryReleaseClient(),
  environment: getSentryEnvironmentClient(),
  sendDefaultPii: false,
  tracesSampleRate: getSentryTraceSampleRate("client"),
  integrations: [Sentry.browserTracingIntegration(), ...(replayEnabled ? [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })] : [])],
  replaysSessionSampleRate: replayEnabled
    ? replaySampleRate(process.env.NEXT_PUBLIC_SENTRY_REPLAY_SESSION_SAMPLE_RATE, 0)
    : 0,
  replaysOnErrorSampleRate: replayEnabled
    ? replaySampleRate(process.env.NEXT_PUBLIC_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE, 1)
    : 0,
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
        environment: getSentryEnvironmentClient(),
        ...(isUnhandledRejection ? { feature: "unhandledrejection" } : {}),
      };
    }
    return scrubSentryEvent(event) as typeof event;
  },
});
