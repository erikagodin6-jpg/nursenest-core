/**
 * Audit / analytics hook shapes — **metadata only**. Never attach stems, answers,
 * names, emails, or other PHI-adjacent fields.
 */
export type TutoringRecommendationAuditPayload = {
  pathwayId: string;
  recommendationCount: number;
  durationMs: number;
  fallbackUsed: boolean;
  providerKind: string;
};

export type TutoringAuditHook = (payload: TutoringRecommendationAuditPayload) => void;

export const noopTutoringAuditHook: TutoringAuditHook = () => {};
