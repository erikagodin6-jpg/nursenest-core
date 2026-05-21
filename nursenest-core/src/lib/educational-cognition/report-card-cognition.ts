import "server-only";

import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import {
  buildLearnerDashboardCognitionSurface,
  resolvePrimaryDashboardPathwayId,
} from "@/lib/educational-cognition/learner-dashboard-cognition-surface";
import {
  resolveEducationalCognitionContext,
  type EducationalCognitionContext,
} from "@/lib/educational-cognition/resolve-educational-cognition-context";
import {
  emitCognitionTelemetryV5,
  recordCognitionContextResolvedWithEntitlement,
} from "@/lib/educational-cognition/cognition-telemetry-v5";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import { getTestingModelReadinessSemantics } from "@/lib/testing/policies/readiness-policy";

/** Serializable report-card presentation slice — mirrors dashboard cognition semantics. */
export type ReportCardCognitionOrchestration = {
  pathwayId: string;
  testingModel: string;
  readinessLabel: string;
  showAdaptivePlan: boolean;
  allowsPassOutlook: boolean;
  primaryMetricLabel: string;
  maxRemediationItems: number;
  fatigueCapActive: boolean;
  graphNextSteps: Array<{ title: string; href: string; kind: string }>;
  measurementPriority: number;
  timingRiskBand: string;
};

function primaryWeakLabel(ctx: EducationalCognitionContext, weakTopics: WeakTopicRow[]): string {
  const fromRows = weakTopics[0]?.topic?.trim();
  if (fromRows) return fromRows;
  const weak = ctx.learnerState.competencyStates
    .filter((c) => c.persistentWeak || c.masteryScore < 55)
    .sort((a, b) => a.masteryScore - b.masteryScore)[0];
  if (weak) return weak.competencyId.replace(/_/g, " ");
  return ctx.ontology.measurementWeaknessTags[0]?.replace(/_/g, " ") ?? "clinical focus";
}

function graphStepsForReportCard(
  ctx: EducationalCognitionContext,
  weakTopics: WeakTopicRow[],
): EduGraphStep[] {
  const topic = primaryWeakLabel(ctx, weakTopics);
  const traversal = orchestrateEducationalGraph({
    topicSlug: topic.toLowerCase().replace(/\s+/g, "-"),
    topicLabel: topic,
    pathwayId: ctx.pathwayId,
    sourceSurface: "dashboard_feed",
    coachingModel: ctx.coachingModel,
    learnerState: ctx.learnerState,
    persistentWeakTopics: ctx.learnerState.competencyStates
      .filter((c) => c.persistentWeak)
      .map((c) => c.competencyId.replace(/_/g, " ")),
  });
  const cap = ctx.remediation.fatigueCapActive ? 3 : 5;
  return traversal.steps.slice(0, cap);
}

export function presentReportCardCognition(
  ctx: EducationalCognitionContext,
  weakTopics: WeakTopicRow[],
): ReportCardCognitionOrchestration {
  const surface = buildLearnerDashboardCognitionSurface(ctx);
  const semantics = getTestingModelReadinessSemantics(ctx.pathwayId);
  const steps = graphStepsForReportCard(ctx, weakTopics);

  return {
    pathwayId: ctx.pathwayId,
    testingModel: ctx.psychometric.model,
    readinessLabel: semantics.readinessLabel,
    showAdaptivePlan: surface.showAdaptivePlan,
    allowsPassOutlook: surface.allowsPassOutlook,
    primaryMetricLabel: surface.primaryMetricLabel,
    maxRemediationItems: surface.maxRemediationItems,
    fatigueCapActive: surface.fatigueCapActive,
    graphNextSteps: steps.map((s) => ({
      title: s.title,
      href: s.href,
      kind: s.kind ?? s.stepKind,
    })),
    measurementPriority: ctx.measurement.measurementPriorityScore,
    timingRiskBand:
      ctx.learnerState.remediationFatigueScore >= 0.65 ? "elevated_fatigue" : "stable",
  };
}

/**
 * Canonical report-card cognition orchestration — readiness, graph, remediation, telemetry.
 */
export async function resolveReportCardCognitionOrchestration(args: {
  userId: string;
  entitlement: AccessScope;
  learnerPath: string | null;
  readiness: ReadinessResult;
  weakTopics: WeakTopicRow[];
  topicTrends: TopicTrendRow[];
}): Promise<{ ctx: EducationalCognitionContext; orchestration: ReportCardCognitionOrchestration }> {
  const pathwayId =
    (await resolvePrimaryDashboardPathwayId(args.entitlement, args.learnerPath)) ?? "unknown";

  const ctx = resolveEducationalCognitionContext(pathwayId, {
    userId: args.userId,
    readinessResult: args.readiness,
    weakTopicLabels: args.weakTopics.map((w) => w.topic),
    topicTrends: args.topicTrends,
    weakTopics: args.weakTopics,
    persistLearnerState: true,
  });

  const orchestration = presentReportCardCognition(ctx, args.weakTopics);

  recordCognitionContextResolvedWithEntitlement(ctx, args.userId, args.entitlement, "report_card_load");
  emitCognitionTelemetryV5(ctx, "readiness_reliability_assessed", "report_card_load", {
    readiness_band: args.readiness.band,
    graph_step_count: orchestration.graphNextSteps.length,
  });

  return { ctx, orchestration };
}
