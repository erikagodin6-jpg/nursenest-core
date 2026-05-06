/**
 * Phase 10 integration event taxonomy (contracts only).
 * See reports/phase-10-ecosystem-platform.md
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
  targetUrlHostAllowlist: readonly string[];
  eventTypes: readonly IntegrationEventDomain[];
  authClass: "hmac_sha256_v1" | "mtls_client_cert_v1";
};
