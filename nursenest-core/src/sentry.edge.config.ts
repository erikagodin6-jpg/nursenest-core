import * as Sentry from "@sentry/nextjs";
import { getSentryDsnServer } from "@/lib/observability/sentry-dsn";
import { getSentryReleaseServer } from "@/lib/observability/sentry-release";
import { scrubSentryEvent } from "@/lib/observability/sentry-scrub";

const isDev = process.env.NODE_ENV === "development";

Sentry.init({
  dsn: getSentryDsnServer(),
  release: getSentryReleaseServer(),
  environment: process.env.SENTRY_ENVIRONMENT || process.env.VERCEL_ENV || process.env.NODE_ENV,
  sendDefaultPii: false,
  tracesSampleRate: isDev ? Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.2) : Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.05),
  beforeSend(event) {
    return scrubSentryEvent(event) as typeof event;
  },
});
