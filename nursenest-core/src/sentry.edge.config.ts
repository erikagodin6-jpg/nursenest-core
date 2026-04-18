import * as Sentry from "@sentry/nextjs";
import { getSentryDsnServer } from "@/lib/observability/sentry-dsn";
import { getSentryEnvironmentServer, getSentryTraceSampleRate } from "@/lib/observability/sentry-flags";
import { getSentryReleaseServer } from "@/lib/observability/sentry-release";
import { scrubSentryEvent } from "@/lib/observability/sentry-scrub";

Sentry.init({
  dsn: getSentryDsnServer(),
  release: getSentryReleaseServer(),
  environment: getSentryEnvironmentServer(),
  sendDefaultPii: false,
  tracesSampleRate: getSentryTraceSampleRate("edge"),
  beforeSend(event) {
    return scrubSentryEvent(event) as typeof event;
  },
});
