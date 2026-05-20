/**
 * Phase 14 — trust & **auditability** event kinds (structured logging contracts; no PII values).
 *
 * See reports/phase-14-governance-autonomous-network.md
 */

export const TrustAuditEventKind = {
  aiRecommendationServed: "trust.ai_rec.served",
  aiRecommendationReviewed: "trust.ai_rec.reviewed",
  entitlementResolved: "trust.entitlement.resolved",
  entitlementDenied: "trust.entitlement.denied",
  adminAction: "trust.admin.action",
  analyticsAccessGranted: "trust.analytics.access_granted",
  analyticsAccessRevoked: "trust.analytics.access_revoked",
  recommendationExplainabilityBundle: "trust.rec.explainability_bundle",
  contentLineageCheckpoint: "trust.content.lineage_checkpoint",
  moderationTransition: "trust.moderation.transition",
} as const;

export type TrustAuditEventKind = (typeof TrustAuditEventKind)[keyof typeof TrustAuditEventKind];
