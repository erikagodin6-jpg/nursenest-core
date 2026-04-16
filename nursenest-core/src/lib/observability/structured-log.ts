/**
 * Canonical structured audit / operations log (`nn.structured_log.v1` in `meta.schema`).
 * Emits the same JSON line drain as {@link emitMonitoringRecord}; fields are redacted via {@link redactMetaForLog}.
 *
 * Do **not** pass passwords, tokens, raw Authorization, full connection strings, payment secrets, or full PII in `message`.
 */
import { emitMonitoringRecord, type MonitoringSeverity } from "@/lib/observability/observability-record";

export const STRUCTURED_LOG_SCHEMA = "nn.structured_log.v1" as const;

export type StructuredLogEventName =
  | "request_start"
  | "request_end"
  | "request_failed"
  | "route_timeout"
  | "route_degraded"
  | "db_query_slow"
  | "db_query_failed"
  | "auth_login_failed"
  | "auth_login_succeeded"
  | "signup_failed"
  | "password_reset_requested"
  | "password_reset_failed"
  | "paywall_stats_unavailable"
  | "checkout_started"
  | "checkout_failed"
  | "webhook_received"
  | "webhook_failed"
  | "question_load_failed"
  | "lesson_load_failed";

export type StructuredLogFields = {
  correlationId?: string;
  route?: string;
  method?: string;
  durationMs?: number;
  degraded?: boolean;
  errorClass?: string;
  /** Non-sensitive operator hint; no raw tokens/PII. */
  message?: string;
  userRole?: string;
  /** Low-cardinality session hint, e.g. subscribed tier / anonymous. */
  userState?: string;
  country?: string;
  locale?: string;
  entitlementState?: string;
  httpStatus?: number;
  flow?: "billing" | "auth" | "content" | "public" | "admin" | "cron" | "webhook" | "other";
};

/** Strip obvious emails from free-text messages for drains. */
export function sanitizeStructuredMessage(s: string, maxLen = 400): string {
  const t = s.trim().slice(0, maxLen);
  return t.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, "[email]");
}

function errorClassFromUnknown(e: unknown): string {
  if (e instanceof Error) return e.constructor?.name ?? "Error";
  return typeof e === "string" ? "string" : typeof e;
}

export function emitStructuredLog(
  kind: StructuredLogEventName,
  severity: MonitoringSeverity,
  fields: StructuredLogFields,
  /** When set, adds `errorClass` from the thrown value. */
  error?: unknown,
): void {
  const errClass = fields.errorClass ?? (error !== undefined ? errorClassFromUnknown(error) : undefined);
  const msg = fields.message ? sanitizeStructuredMessage(fields.message) : undefined;

  emitMonitoringRecord({
    scope: "structured",
    event: kind,
    severity,
    correlationId: fields.correlationId,
    route: fields.route?.slice(0, 200),
    httpStatus: fields.httpStatus,
    durationMs: fields.durationMs,
    flow: fields.flow,
    meta: {
      schema: STRUCTURED_LOG_SCHEMA,
      method: fields.method,
      userRole: fields.userRole,
      userState: fields.userState,
      country: fields.country,
      locale: fields.locale,
      entitlementState: fields.entitlementState,
      degraded: fields.degraded,
      errorClass: errClass,
      message: msg,
    },
  });
}
