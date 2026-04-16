/**
 * Production signals for Sentry Metrics + structured log drains (`emitMonitoringRecord`).
 * Keep attribute values **low-cardinality** (no user ids, emails, or raw paths).
 */
import { Prisma } from "@prisma/client";
import { PINNED_AUTH_BASE_PATH } from "@/lib/auth/auth-base-path";
import { emitMonitoringRecord } from "@/lib/observability/observability-record";
import { correlationIdFromRequest } from "@/lib/observability/correlation-id";
import { emitStructuredLog } from "@/lib/observability/structured-log";
import { sentryCount, sentryDistribution } from "@/lib/observability/sentry-metrics";

export type CredentialsLoginFailureBucket =
  | "rate_limited"
  | "missing_fields"
  | "locked_out"
  | "duplicate_user_match"
  | "db_error"
  | "not_found"
  | "no_password_hash"
  | "system_error"
  | "bad_password";

export function recordCredentialsLoginFailure(
  bucket: CredentialsLoginFailureBucket,
  request?: Request,
): void {
  sentryCount("auth.login.failure", 1, { bucket });
  emitMonitoringRecord({
    scope: "auth",
    event: "credentials_login_failure",
    severity: bucket === "db_error" || bucket === "system_error" ? "error" : "warn",
    meta: { bucket },
  });
  let route: string | undefined;
  try {
    route = request
      ? new URL(request.url).pathname.slice(0, 200)
      : `${PINNED_AUTH_BASE_PATH}/callback/credentials`;
  } catch {
    route = `${PINNED_AUTH_BASE_PATH}/callback/credentials`;
  }
  emitStructuredLog(
    "auth_login_failed",
    bucket === "db_error" || bucket === "system_error" ? "error" : "warn",
    {
      correlationId: request ? correlationIdFromRequest(request) : undefined,
      route,
      method: request?.method ?? "POST",
      errorClass: bucket,
      message: `credentials login failure: ${bucket}`,
    },
  );
}

export function prismaClientErrorBucket(err: unknown): string {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const c = err.code;
    if (["P1001", "P1002", "P1008", "P1017"].includes(c)) return "connection";
    if (c === "P2024") return "timeout";
    if (c === "P2002") return "unique";
    if (c === "P2025") return "not_found";
    if (c === "P2003") return "fk_violation";
    return "known_other";
  }
  if (err instanceof Prisma.PrismaClientValidationError) return "validation";
  return "unknown";
}

/** After a failed Prisma operation (before rethrow). */
export function recordPrismaClientQueryError(err: unknown): void {
  const bucket = prismaClientErrorBucket(err);
  sentryCount("db.client.error", 1, { bucket });
  emitMonitoringRecord({
    scope: "db",
    event: "prisma_client_error",
    severity: "error",
    meta: { bucket },
  });
  emitStructuredLog("db_query_failed", "error", {
    errorClass: bucket,
    message: `prisma client error (${bucket})`,
  });
}

export type CheckoutFailureReason =
  | "unauthorized"
  | "demo_forbidden"
  | "invalid_payload"
  | "policy_mismatch"
  | "price_not_configured"
  | "stripe_unavailable"
  | "app_origin"
  | "session_failed";

export function recordCheckoutFailure(reason: CheckoutFailureReason, request?: Request): void {
  sentryCount("billing.checkout.failure", 1, { reason });
  emitMonitoringRecord({
    scope: "billing",
    event: "checkout_failure",
    severity: reason === "session_failed" || reason === "stripe_unavailable" ? "error" : "warn",
    meta: { reason },
    correlationId: request ? correlationIdFromRequest(request) : undefined,
  });
  emitStructuredLog(
    "checkout_failed",
    reason === "session_failed" || reason === "stripe_unavailable" ? "error" : "warn",
    {
      correlationId: request ? correlationIdFromRequest(request) : undefined,
      route: "/api/subscriptions/checkout",
      method: "POST",
      flow: "billing",
      errorClass: reason,
      message: `checkout failed: ${reason}`,
    },
  );
}

export function recordHealthReadyDatabaseFailure(): void {
  sentryCount("health.ready.failure", 1, { kind: "database" });
  emitMonitoringRecord({
    scope: "health",
    event: "ready_database_unavailable",
    severity: "error",
  });
}

/** Slow Prisma query — paired with `perf` logs in {@link logSlowPrismaQuery}. */
export function recordSlowDbQuery(durationMs: number, severity: "warn" | "critical"): void {
  sentryDistribution("db.query.duration_ms", durationMs, { severity });
  sentryCount("db.query.slow", 1, { severity });
  emitMonitoringRecord({
    scope: "db",
    event: "slow_query",
    severity: severity === "critical" ? "error" : "warn",
    durationMs,
    meta: { severity },
  });
  emitStructuredLog("db_query_slow", severity === "critical" ? "error" : "warn", {
    durationMs,
    degraded: severity === "critical",
    errorClass: severity === "critical" ? "slow_query_critical" : "slow_query_warn",
    message: `slow prisma query ${durationMs}ms`,
  });
}

/** Stripe webhook handler, idempotency claim insert, or related persistence failed after verified event (alert: HIGH). */
export function recordStripeWebhookFailure(
  phase: "handler" | "dedupe" | "claim",
  eventType: string,
  request?: Request,
): void {
  sentryCount("billing.webhook.failure", 1, { phase });
  const correlationId = request ? correlationIdFromRequest(request) : undefined;
  emitMonitoringRecord({
    scope: "billing",
    event: "stripe_webhook_failure",
    severity: "error",
    correlationId,
    meta: { phase, eventType: eventType.slice(0, 80) },
  });
  emitStructuredLog("webhook_failed", "error", {
    correlationId,
    route: "/api/subscriptions/webhook",
    method: "POST",
    flow: "webhook",
    errorClass: phase,
    message: `stripe webhook ${phase} failed for ${eventType.slice(0, 60)}`,
  });
}

/**
 * Paywall “proof” line fell back to neutral copy (no numeric proof) — marketing surface degraded.
 * `surface`: low-cardinality bucket only.
 */
export function recordPaywallProofNeutral(surface: "fallback" | "safe_mode" | "partial_stats"): void {
  sentryCount("marketing.paywall.proof_neutral", 1, { surface });
  emitMonitoringRecord({
    scope: "marketing",
    event: "paywall_proof_neutral",
    severity: "warn",
    meta: { surface },
  });
  emitStructuredLog("paywall_stats_unavailable", "warn", {
    route: "/api/public/home-stats",
    method: "GET",
    degraded: true,
    errorClass: surface,
    message: `paywall marketing stats unavailable (${surface})`,
  });
}

/** Auto-degraded mode engaged (slow-query / circuit burst) — skips Tier-2 learner work. */
export function recordAutoDegradedEngaged(reasonPrefix: string): void {
  const reason = reasonPrefix.slice(0, 48);
  sentryCount("resilience.auto_degraded.engaged", 1, { reason });
  emitMonitoringRecord({
    scope: "resilience",
    event: "auto_degraded_engaged",
    severity: "warn",
    meta: { reason },
  });
  emitStructuredLog("route_degraded", "warn", {
    degraded: true,
    errorClass: "auto_degraded",
    message: reason,
  });
}
