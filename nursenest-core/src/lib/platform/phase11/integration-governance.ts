/**
 * Phase 11 — external integration **governance contracts** (registration, verification, replay).
 *
 * Aligns with Phase 10 webhook shapes in `integration-events.ts`; does not dispatch HTTP.
 *
 * See reports/phase-11-developer-platform.md
 */

import type { DeveloperApiScope } from "@/lib/platform/phase11/developer-api-scopes";

export const WebhookVerificationClass = {
  /** Shared-secret HMAC over raw body + timestamp header. */
  hmacTimestampV1: "hmac_timestamp_v1",
  /** mTLS client cert + optional signed JWT. */
  mtlsJwtV1: "mtls_jwt_v1",
} as const;

export type WebhookVerificationClass =
  (typeof WebhookVerificationClass)[keyof typeof WebhookVerificationClass];

export const EventReplayPolicy = {
  /** Drop duplicate delivery_id if seen within TTL. */
  idempotentByDeliveryId: "idempotent_by_delivery_id",
  /** Strict ordering per stream key (future). */
  orderedPerStream: "ordered_per_stream",
} as const;

export type EventReplayPolicy = (typeof EventReplayPolicy)[keyof typeof EventReplayPolicy];

export type IntegrationRegistrationV1 = {
  integrationId: string;
  displayName: string;
  ownerOrgKey: string;
  grantedScopes: readonly DeveloperApiScope[];
  webhookVerification: WebhookVerificationClass;
  replayPolicy: EventReplayPolicy;
  /** Hostnames integrations may call back to ( NurseNest-controlled endpoints only for inbound). */
  inboundCallbackHostAllowlist: readonly string[];
};

/** Standard header names for webhook idempotency (values never logged raw in production). */
export const WEBHOOK_IDEMPOTENCY_HEADERS = {
  deliveryId: "x-nn-delivery-id",
  signature: "x-nn-signature",
  timestamp: "x-nn-timestamp",
} as const;
