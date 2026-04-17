/**
 * Static checks: incident-facing structured events stay wired in source (no runtime / DB).
 * If this fails after a refactor, update implementations or this list — do not delete signals silently.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..", "..");

function read(rel: string): string {
  return readFileSync(join(repoRoot, rel), "utf8");
}

describe("structured log — incident signal coverage (static)", () => {
  it("declares all operator-facing event names in structured-log.ts", () => {
    const src = read("src/lib/observability/structured-log.ts");
    const required = [
      "request_failed",
      "route_timeout",
      "route_degraded",
      "db_query_slow",
      "db_query_failed",
      "auth_login_failed",
      "signup_failed",
      "password_reset_failed",
      "checkout_failed",
      "webhook_failed",
      "webhook_ignored",
      "entitlement_resolve_failed",
      "question_load_failed",
      "lesson_load_failed",
    ] as const;
    for (const ev of required) {
      assert.match(src, new RegExp(`"${ev}"`, "m"), `missing StructuredLogEventName: ${ev}`);
    }
  });

  it("api-route-telemetry emits request lifecycle signals", () => {
    const src = read("src/lib/observability/api-route-telemetry.ts");
    assert.match(src, /emitStructuredLog\("request_end"/);
    assert.match(src, /emitStructuredLog\("request_failed"/);
    assert.match(src, /emitStructuredLog\("route_degraded"/);
    assert.match(src, /emitStructuredLog\("route_timeout"/);
  });

  it("production-signal-metrics emits db, auth, checkout, webhook, entitlement helpers", () => {
    const src = read("src/lib/observability/production-signal-metrics.ts");
    assert.match(src, /emitStructuredLog\(\s*"db_query_failed"/);
    assert.match(src, /emitStructuredLog\(\s*"db_query_slow"/);
    assert.match(src, /emitStructuredLog\(\s*"auth_login_failed"/);
    assert.match(src, /emitStructuredLog\(\s*"checkout_failed"/);
    assert.match(src, /emitStructuredLog\(\s*"webhook_failed"/);
    assert.match(src, /recordEntitlementResolveFailureSignal/);
    assert.match(src, /emitStructuredLog\(\s*"route_degraded"/);
  });

  it("edge proxy emits request_start for /api (correlation + operator trace)", () => {
    const src = read("src/proxy.ts");
    assert.match(src, /emitStructuredLog\("request_start"/);
    assert.match(src, /NN_CORRELATION_HEADER/);
  });

  it("billing webhook emits webhook_ignored for unhandled Stripe types (audit, not failure)", () => {
    const src = read("src/app/api/subscriptions/webhook/route.ts");
    assert.match(src, /emitStructuredLog\("webhook_ignored"/);
  });

  it("auth + signup routes emit signup_failed / password_reset_failed with correlation", () => {
    assert.match(read("src/app/api/signup/route.ts"), /emitStructuredLog\("signup_failed"/);
    assert.match(read("src/app/api/auth/forgot-password/route.ts"), /emitStructuredLog\("password_reset_failed"/);
    assert.match(read("src/app/api/auth/forgot-password/route.ts"), /correlationIdFromRequest/);
  });

  it("entitlement resolve failures emit structured + metrics (RSC + APIs)", () => {
    assert.match(read("src/lib/entitlements/resolve-entitlement-for-page.ts"), /emitStructuredLog\("entitlement_resolve_failed"/);
    assert.match(read("src/lib/entitlements/require-subscriber-session.ts"), /emitStructuredLog\("entitlement_resolve_failed"/);
    assert.match(read("src/app/api/questions/route.ts"), /emitStructuredLog\("entitlement_resolve_failed"/);
    assert.match(read("src/app/api/lessons/route.ts"), /emitStructuredLog\("entitlement_resolve_failed"/);
  });

  it("content APIs emit question_load_failed / lesson_load_failed", () => {
    assert.match(read("src/app/api/questions/route.ts"), /emitStructuredLog\("question_load_failed"/);
    assert.match(read("src/app/api/questions/[id]/route.ts"), /emitStructuredLog\("question_load_failed"/);
    assert.match(read("src/app/api/lessons/route.ts"), /emitStructuredLog\("lesson_load_failed"/);
  });

  it("alert thresholds export structured drain keys", () => {
    const src = read("src/lib/observability/alert-thresholds.ts");
    assert.match(src, /requestFailedCount5m/);
    assert.match(src, /routeTimeoutCount5m/);
    assert.match(src, /routeDegradedCount15m/);
    assert.match(src, /questionOrLessonLoadFailedCount15m/);
  });
});
