/**
 * Phase 10 — integration & webhook **contracts** (event taxonomy only).
 *
 * No outbound webhook dispatcher here — routes that emit must stay staff-gated or system-cron-gated.
 *
 * @see reports/phase-10-ecosystem-platform.md
 */

export const IntegrationEventDomain = {
  entitlementChanged: "entitlement.changed",
  cohortAssignmentPublished: "cohort.assignment_published",
  contentModerationUpdated: "content.moderation_updated",
  marketplacePurchaseCompleted: "marketplace.purchase_completed",
  analyticsExportReady: "analytics.export_ready",
} as const;

export type IntegrationEventDomain =
  (typeof IntegrationEventDomain)[keyof typeof IntegrationEventDomain];

export type WebhookSubscriptionContract = {
  subscriberOrgId: string;
  /** HTTPS endpoint registered server-side after verification challenge. */
  targetUrlHostAllowlist: readonly string[];
  eventTypes: readonly IntegrationEventDomain[];
  /** HMAC or mTLS class — implementation deferred. */
  authClass: "hmac_sha256_v1" | "mtls_client_cert_v1";
};
