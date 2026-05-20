/**
 * Phase 11 developer platform & public API **foundations** (types and constants only).
 *
 * - No new public HTTP routes.
 * - Entitlements remain `getUserAccess` + server gates; gateway context hints are non-authoritative.
 *
 * See reports/phase-11-developer-platform.md
 */

export * from "@/lib/platform/phase11/api-versioning";
export * from "@/lib/platform/phase11/developer-api-scopes";
export * from "@/lib/platform/phase11/gateway-request-context";
export * from "@/lib/platform/phase11/integration-governance";
export * from "@/lib/platform/phase11/observability-metrics";

/** Re-export Phase 10 event taxonomy for developer-facing bundles (single import surface). */
export { IntegrationEventDomain, type WebhookSubscriptionContract } from "@/lib/platform/phase10/integration-events";
