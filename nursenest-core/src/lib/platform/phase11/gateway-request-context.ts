/**
 * Phase 11 — entitlement-aware **gateway context** after authentication (types only).
 *
 * `entitlementHints` mirror Phase 10 extension hints: **non-authoritative**; handlers must re-resolve access.
 *
 * See reports/phase-11-developer-platform.md
 */

import type { EntitlementAwareExtensionContext } from "@/lib/platform/phase10/extensibility-contracts";

export const ApiTokenKind = {
  /** First-party session cookie / JWT — existing learner auth. */
  firstPartySession: "first_party_session",
  /** Scoped HMAC or OAuth-style bearer for machine clients (future). */
  integrationBearer: "integration_bearer",
  /** Read-only analytics export token (short TTL, tight scopes). */
  analyticsReadToken: "analytics_read_token",
  /** Staff or instructor operational token — never mixed with learner DTC tokens. */
  staffOrInstructor: "staff_or_instructor",
} as const;

export type ApiTokenKind = (typeof ApiTokenKind)[keyof typeof ApiTokenKind];

export type ApiGatewayRequestContext = {
  requestId: string;
  tokenKind: ApiTokenKind;
  /** Stable integration id when `integrationBearer`; omit for first-party. */
  integrationClientId?: string;
  /** Institution / tenant key when token is org-scoped; must match row-level filters. */
  institutionKey?: string;
  /** Non-authoritative hints from token claims; always re-check server-side. */
  entitlementHints: EntitlementAwareExtensionContext;
};
