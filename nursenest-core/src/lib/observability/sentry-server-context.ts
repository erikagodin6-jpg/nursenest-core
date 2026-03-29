import * as Sentry from "@sentry/nextjs";
import { sentryUserHash } from "@/lib/observability/sentry-user-hash";

export type ServerFeatureTag =
  | "exam"
  | "lesson"
  | "flashcard"
  | "question"
  | "entitlement"
  | "payment"
  | "auth"
  | "signup"
  | "image"
  | "api"
  | "other";

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
    environment: process.env.SENTRY_ENVIRONMENT || process.env.VERCEL_ENV || process.env.NODE_ENV,
    route: opts.route,
  });
  if (opts.userId) {
    Sentry.setUser({ id: sentryUserHash(opts.userId) });
  }
}
