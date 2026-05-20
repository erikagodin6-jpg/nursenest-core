import { getSentryDsnServer } from "@/lib/observability/sentry-dsn";
import { importSentryNextjs } from "@/lib/observability/sentry-nextjs-dynamic";
import {
  getSentryEnvironmentServer,
  getSentryProfilesSampleRate,
  getSentryTraceSampleRate,
} from "@/lib/observability/sentry-flags";
import { getSentryReleaseServer } from "@/lib/observability/sentry-release";
import { scrubSentryEvent } from "@/lib/observability/sentry-scrub";

let initPromise: Promise<void> | null = null;

export async function initSentryServerConfig(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const Sentry = await importSentryNextjs();
    Sentry.init({
      dsn: getSentryDsnServer(),
      release: getSentryReleaseServer(),
      environment: getSentryEnvironmentServer(),
      sendDefaultPii: false,
      tracesSampleRate: getSentryTraceSampleRate("server"),
      profilesSampleRate: getSentryProfilesSampleRate(),
      maxBreadcrumbs: 80,
      ignoreErrors: [
        /^ResizeObserver loop/i,
        /Non-Error promise rejection/i,
        /Loading chunk \d+ failed/i,
      ],
      beforeSend(event) {
        return scrubSentryEvent(event) as typeof event;
      },
    });
  })();
  return initPromise;
}
