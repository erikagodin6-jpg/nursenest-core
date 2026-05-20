/**
 * Phase 14 — platform **governance architecture** contracts (policy boundaries & workflows; no enforcers here).
 *
 * Runtime enforcement remains `getUserAccess`, `requireAdmin`, staff path RBAC, and Phase 11 API scopes.
 *
 * See reports/phase-14-governance-autonomous-network.md
 */

export const PolicyEnforcementBoundary = {
  learnerEntitlement: "gov.boundary.learner_entitlement",
  staffPathRbac: "gov.boundary.staff_path_rbac",
  institutionalScope: "gov.boundary.institutional_scope",
  analyticsAccess: "gov.boundary.analytics_access",
  aiRecommendationServe: "gov.boundary.ai_recommendation_serve",
  contentPublish: "gov.boundary.content_publish",
  operationalDestructive: "gov.boundary.operational_destructive",
} as const;

export type PolicyEnforcementBoundary =
  (typeof PolicyEnforcementBoundary)[keyof typeof PolicyEnforcementBoundary];

export const GovernanceWorkflowKind = {
  auditReview: "gov.workflow.audit_review",
  aiRecommendationReview: "gov.workflow.ai_recommendation_review",
  remediationOverride: "gov.workflow.remediation_override",
  analyticsAccessRequest: "gov.workflow.analytics_access_request",
  operationalEscalation: "gov.workflow.operational_escalation",
  complianceReadinessChecklist: "gov.workflow.compliance_readiness",
} as const;

export type GovernanceWorkflowKind =
  (typeof GovernanceWorkflowKind)[keyof typeof GovernanceWorkflowKind];
