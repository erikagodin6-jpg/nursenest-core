/**
 * Phase 11 — API **observability event names** (constants only; emitters must redact PII/secrets).
 *
 * Pair with existing structured logging / metrics sinks; no new telemetry SDK here.
 *
 * See reports/phase-11-developer-platform.md
 */

export const ApiObservabilityMetric = {
  gatewayLatencyMs: "api.gateway.latency_ms",
  rateLimitExceeded: "api.rate_limit.exceeded",
  authFailure: "api.auth.failure",
  entitlementDenied: "api.entitlement.denied",
  suspiciousToken: "api.token.suspicious",
  tenantBoundaryReject: "api.tenant.boundary_reject",
  integrationReplayDrop: "api.integration.replay_drop",
} as const;

export type ApiObservabilityMetric = (typeof ApiObservabilityMetric)[keyof typeof ApiObservabilityMetric];
