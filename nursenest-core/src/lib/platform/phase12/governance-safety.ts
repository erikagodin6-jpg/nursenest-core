/**
 * Phase 12 — governance & safety contracts for platform intelligence (audit + privacy tiers).
 *
 * See reports/phase-12-platform-intelligence.md
 */

export const AiRecommendationAuditAction = {
  served: "ai_rec.served",
  accepted: "ai_rec.accepted",
  dismissed: "ai_rec.dismissed",
  overriddenByDeterministic: "ai_rec.overridden_by_deterministic",
} as const;

export type AiRecommendationAuditAction =
  (typeof AiRecommendationAuditAction)[keyof typeof AiRecommendationAuditAction];

export type AiRecommendationAuditRecord = {
  occurredAtIso: string;
  userIdPrefix: string;
  pathwayId: string;
  action: AiRecommendationAuditAction;
  /** Opaque model or ruleset id — not raw prompts. */
  policyOrModelRef: string;
};

export const AnalyticsRetentionClass = {
  /** Short-lived operational metrics. */
  operational24h: "retention_operational_24h",
  /** Aggregated learner engagement (minimized dimensions). */
  engagement90d: "retention_engagement_90d",
  /** Longer retention only with explicit consent + DPA alignment (future). */
  extendedContractual: "retention_extended_contractual",
} as const;

export type AnalyticsRetentionClass =
  (typeof AnalyticsRetentionClass)[keyof typeof AnalyticsRetentionClass];

export const OperationalHumanReviewAction = {
  acknowledged: "op_review.acknowledged",
  escalated: "op_review.escalated",
  createdTicket: "op_review.created_ticket",
} as const;

export type OperationalHumanReviewAction =
  (typeof OperationalHumanReviewAction)[keyof typeof OperationalHumanReviewAction];
