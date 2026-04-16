"use client";

/**
 * Browser-side structured diagnostics (Sentry breadcrumbs + dev console).
 * Does **not** stream to platform log drains — use for correlation with server `emitStructuredLog` via Sentry issue linkage.
 *
 * Never pass passwords, tokens, or full PII in `message`.
 */
import * as Sentry from "@sentry/nextjs";

/** Keep aligned with {@link STRUCTURED_LOG_SCHEMA} in `structured-log.ts`. */
const CLIENT_STRUCTURED_LOG_SCHEMA = "nn.structured_log.v1" as const;

export type ClientStructuredEvent = "question_load_failed" | "lesson_load_failed";

export function emitClientStructuredLog(
  event: ClientStructuredEvent,
  fields: {
    route: string;
    method?: string;
    httpStatus?: number;
    errorClass?: string;
    message?: string;
    degraded?: boolean;
    locale?: string;
  },
): void {
  const data = {
    schema: CLIENT_STRUCTURED_LOG_SCHEMA,
    event,
    ts: new Date().toISOString(),
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
    ...fields,
  };
  if (process.env.NODE_ENV === "development") {
    console.info("[nn-structured]", data);
  }
  Sentry.addBreadcrumb({
    category: "structured",
    message: event,
    level: fields.httpStatus && fields.httpStatus >= 500 ? "error" : "warning",
    data,
  });
}
