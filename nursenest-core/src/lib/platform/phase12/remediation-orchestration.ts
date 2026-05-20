/**
 * Phase 12 — intelligent remediation **orchestration intents** (extends adaptive direction; no engine swap).
 *
 * - Sequencing must respect `getUserAccess` and pathway scope.
 * - When confidence is low or signals missing, fall back to deterministic adaptive recommendations.
 *
 * See reports/phase-12-platform-intelligence.md
 */

export const RemediationOrchestrationIntent = {
  sequenceWeakTopics: "remediation.sequence_weak_topics",
  escalateIntensity: "remediation.escalate_intensity",
  milestoneReadiness: "remediation.milestone_readiness",
  crossSurfaceHandoff: "remediation.cross_surface_handoff",
  clusterWeakTopics: "remediation.cluster_weak_topics",
} as const;

export type RemediationOrchestrationIntent =
  (typeof RemediationOrchestrationIntent)[keyof typeof RemediationOrchestrationIntent];

export const RemediationEscalationLevel = {
  gentle: "gentle",
  standard: "standard",
  intensive: "intensive",
} as const;

export type RemediationEscalationLevel =
  (typeof RemediationEscalationLevel)[keyof typeof RemediationEscalationLevel];
