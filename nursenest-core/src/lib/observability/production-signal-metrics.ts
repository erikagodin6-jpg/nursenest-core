/**
 * Production signals for Sentry Metrics + structured log drains (`emitMonitoringRecord`).
 * Keep attribute values **low-cardinality** (no user ids, emails, or raw paths).
 */
import { Prisma } from "@prisma/client";
import { emitMonitoringRecord } from "@/lib/observability/observability-record";
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

export function recordCredentialsLoginFailure(bucket: CredentialsLoginFailureBucket): void {
  sentryCount("auth.login.failure", 1, { bucket });
  emitMonitoringRecord({
    scope: "auth",
    event: "credentials_login_failure",
    severity: bucket === "db_error" || bucket === "system_error" ? "error" : "warn",
    meta: { bucket },
  });
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

export function recordCheckoutFailure(reason: CheckoutFailureReason): void {
  sentryCount("billing.checkout.failure", 1, { reason });
  emitMonitoringRecord({
    scope: "billing",
    event: "checkout_failure",
    severity: reason === "session_failed" || reason === "stripe_unavailable" ? "error" : "warn",
    meta: { reason },
  });
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
}
