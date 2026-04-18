import * as Sentry from "@sentry/nextjs";
import { getSentryEnvironmentServer } from "@/lib/observability/sentry-flags";
import { sentryUserHash } from "@/lib/observability/sentry-user-hash";
import type { ServerFeatureTag } from "@/lib/observability/server-feature-tags";

export type { ServerFeatureTag };
export { SERVER_FEATURE, SERVER_FEATURE_TAGS } from "@/lib/observability/server-feature-tags";

/**
 * Set scoped tags for the current request (API routes / server actions).
 * Call at the start of handlers; cleared automatically after the request.
 */
export function setSentryServerContext(opts: {
  route: string;
  feature: ServerFeatureTag;
  userId?: string | null;
}): void {
  Sentry.setTag("feature", opts.feature);
  Sentry.setTag("route", opts.route);
  Sentry.setContext("nursenest", {
    environment: getSentryEnvironmentServer(),
    route: opts.route,
  });
  if (opts.userId) {
    Sentry.setUser({ id: sentryUserHash(opts.userId) });
  }
}
