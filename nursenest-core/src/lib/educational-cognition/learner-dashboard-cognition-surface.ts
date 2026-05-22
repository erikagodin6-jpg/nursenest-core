/**
 * Serializable dashboard presentation slice — derived from {@link resolveEducationalCognitionContext}.
 * Callers treat this as the only source for adaptive visibility, widget eligibility, and readiness labels.
 */
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { resolveSubscribedQuestionBankPathways } from "@/lib/learner/tier-scoped-study-routes";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition/resolve-educational-cognition-context";
import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";

export type LearnerDashboardCognitionSurface = {
  pathwayId: string;
  testingModel: string;
  showAdaptivePlan: boolean;
  primaryMetricLabel: string;
  sessionCtaLabel: string;
  readinessLabel: string;
  allowsPassOutlook: boolean;
  allowsPrecisionBand: boolean;
  widgetEligibility: Record<string, boolean>;
  maxRemediationItems: number;
  fatigueCapActive: boolean;
  coachingIntensityCap: "low" | "medium" | "high";
  maxVisibleWidgets: number;
};

export function buildLearnerDashboardCognitionSurface(
  ctx: EducationalCognitionContext,
): LearnerDashboardCognitionSurface {
  const widgetEligibility: Record<string, boolean> = {};
  for (const w of ctx.dashboard.widgets) {
    widgetEligibility[w.id] = w.eligible;
  }

  const fatigueCapActive =
    ctx.capabilities.remediation_fatigue_governance &&
    ctx.learnerState.remediationFatigueScore >= 0.65;

  const coachingIntensityCap: LearnerDashboardCognitionSurface["coachingIntensityCap"] =
    fatigueCapActive ? "low" : ctx.coachingModel === "linear_practice" ? "medium" : "high";

  const maxVisibleWidgets = fatigueCapActive ? 5 : ctx.dashboard.widgets.filter((w) => w.eligible).length > 6 ? 7 : 6;

  return {
    pathwayId: ctx.pathwayId,
    testingModel: ctx.psychometric.model,
    showAdaptivePlan: ctx.dashboard.showAdaptivePlan,
    primaryMetricLabel: ctx.dashboard.primaryMetricLabel,
    sessionCtaLabel: ctx.dashboard.sessionCtaLabel,
    readinessLabel: ctx.readinessSemantics.readinessLabel,
    allowsPassOutlook: ctx.readinessSemantics.allowsPassOutlook,
    allowsPrecisionBand: ctx.readinessSemantics.allowsPrecisionBand,
    widgetEligibility,
    maxRemediationItems: ctx.remediation.maxRecommendations,
    fatigueCapActive,
    coachingIntensityCap,
    maxVisibleWidgets,
  };
}

/** Resolve primary pathway for tier-scoped dashboard loads. */
export async function resolvePrimaryDashboardPathwayId(
  entitlement: AccessScope,
  learnerPath: string | null,
): Promise<string | null> {
  const compatible = await listPathwaysCompatibleWithSubscription(entitlement);
  if (compatible.length === 0) return null;
  const rows = compatible.map((p) => ({ id: p.id, shortName: p.shortName ?? p.id }));
  const resolved = resolveSubscribedQuestionBankPathways({
    requestedPathwayId: null,
    compatible: rows,
    learnerPath,
  });
  if (resolved.state === "scoped") return resolved.defaultPathwayId;
  return compatible[0]?.id ?? null;
}

export async function resolveDashboardEducationalCognition(args: {
  entitlement: AccessScope;
  learnerPath: string | null;
  readinessResult: ReadinessResult;
  weakTopicLabels?: string[];
  userId?: string | null;
}): Promise<{ ctx: EducationalCognitionContext; surface: LearnerDashboardCognitionSurface }> {
  const pathwayId =
    (await resolvePrimaryDashboardPathwayId(args.entitlement, args.learnerPath)) ?? "unknown";
  const ctx = resolveEducationalCognitionContext(pathwayId, {
    userId: args.userId,
    readinessResult: args.readinessResult,
    weakTopicLabels: args.weakTopicLabels,
  });
  return { ctx, surface: buildLearnerDashboardCognitionSurface(ctx) };
}
