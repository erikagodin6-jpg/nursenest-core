/**
 * Educational Cognition OS — canonical substrate for all learner-facing intelligence surfaces.
 */
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import type { EduGraphStep, GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import {
  resolveEducationalCognitionContext,
  type ReadinessResult,
} from "@/lib/educational-cognition/resolve-educational-cognition-context";
import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import { emitCognitionTelemetryV5 } from "@/lib/educational-cognition/cognition-telemetry-v5";
import { saveDurableLearnerCognition } from "@/lib/educational-cognition/learner-cognition-persistence";
import {
  buildGraphContinuityFromTraversal,
  mergeGraphContinuityWithStored,
} from "@/lib/educational-cognition/graph-next-step-continuity";
import { loadDurableLearnerCognitionEnvelopeSync } from "@/lib/educational-cognition/learner-cognition-persistence";
import { deriveTimingCognitionSignals, studyPlanDensityFromTiming } from "@/lib/educational-cognition/timing-cognition";
import { buildGovernedRnStudyPlan, type GovernedRnStudyPlan } from "@/lib/learner/rn-coaching-intelligence/study-plan-orchestration";
import {
  composeDashboardOrchestrationFromContext,
  type DashboardOrchestrationV3,
} from "@/lib/learner/rn-coaching-intelligence/dashboard-orchestration-v3";
import { buildAiTutorContextFromCognition } from "@/lib/educational-cognition/ai-tutor-cognition-envelope";
import type { AiTutorContextEnvelope } from "@/lib/learner/rn-coaching-intelligence/ai-tutor-context-envelope";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import type { TimingIntelligenceResult } from "@/lib/learner/rn-coaching-intelligence/coaching-types";

export type ResolveLearnerCognitionSubstrateInput = {
  pathwayId: string | null;
  userId?: string | null;
  sessionKind?: string | null;
  readinessResult?: ReadinessResult | null;
  topicTrends?: TopicTrendRow[];
  weakTopics?: WeakTopicRow[];
  weakTopicLabels?: string[];
  timing?: TimingIntelligenceResult | null;
  persistLearnerState?: boolean;
  sourceSurface?: GraphSourceSurface;
};

export type LearnerCognitionSubstrate = {
  ctx: EducationalCognitionContext;
  studyPlan: GovernedRnStudyPlan;
  dashboard: DashboardOrchestrationV3;
  graphSteps: EduGraphStep[];
  aiTutor: AiTutorContextEnvelope;
  timingRiskBand: ReturnType<typeof deriveTimingCognitionSignals>["riskBand"];
  studyPlanDensity: ReturnType<typeof studyPlanDensityFromTiming>;
};

function primaryWeakTopicLabel(ctx: EducationalCognitionContext): string {
  const weak = ctx.learnerState.competencyStates
    .filter((c) => c.persistentWeak || c.masteryScore < 55)
    .sort((a, b) => a.masteryScore - b.masteryScore)[0];
  if (weak) return weak.competencyId.replace(/_/g, " ");
  return ctx.ontology.measurementWeaknessTags[0]?.replace(/_/g, " ") ?? "clinical focus";
}

export function resolveLearnerCognitionSubstrate(
  input: ResolveLearnerCognitionSubstrateInput,
): LearnerCognitionSubstrate {
  const pathwayId = (input.pathwayId ?? "").trim() || "unknown";
  const weakLabels =
    input.weakTopicLabels ?? input.weakTopics?.map((w) => w.topic) ?? [];

  const ctx = resolveEducationalCognitionContext(pathwayId, {
    userId: input.userId,
    sessionKind: input.sessionKind,
    readinessResult: input.readinessResult,
    weakTopicLabels: weakLabels,
    topicTrends: input.topicTrends,
    weakTopics: input.weakTopics,
    timing: input.timing ?? null,
    persistLearnerState: input.persistLearnerState,
  });

  const topic = primaryWeakTopicLabel(ctx);
  const traversal = orchestrateEducationalGraph({
    topicSlug: topic.toLowerCase().replace(/\s+/g, "-"),
    topicLabel: topic,
    pathwayId,
    sourceSurface: input.sourceSurface ?? "cognition_substrate",
    coachingModel: ctx.coachingModel,
    learnerState: ctx.learnerState,
    persistentWeakTopics: ctx.learnerState.competencyStates
      .filter((c) => c.persistentWeak)
      .map((c) => c.competencyId.replace(/_/g, " ")),
  });

  const studyPlan = buildGovernedRnStudyPlan({
    learnerState: ctx.learnerState,
    coachingModel: ctx.coachingModel,
    pathwayId,
    remediationUserId: input.userId ?? null,
    maxBlocks: ctx.remediation.fatigueCapActive ? 5 : 8,
  });

  const dashboard = composeDashboardOrchestrationFromContext(ctx);
  const aiTutor = buildAiTutorContextFromCognition(ctx, [...traversal.steps]);
  const timingSignals = deriveTimingCognitionSignals({ learnerState: ctx.learnerState });

  if (input.persistLearnerState && input.userId) {
    const topicSlug = topic.toLowerCase().replace(/\s+/g, "-");
    const prior = loadDurableLearnerCognitionEnvelopeSync(input.userId);
    const dashCard = dashboard.cards.find((c) => c.href);
    const graphContinuity = mergeGraphContinuityWithStored(
      prior?.graphContinuity,
      buildGraphContinuityFromTraversal({
        topicSlug,
        steps: [...traversal.steps],
        ctx,
        prior: prior?.graphContinuity,
        dashboardPrimaryHref: dashCard?.href ?? null,
        adaptivePrimaryHref: traversal.steps[0]?.href ?? null,
      }),
    );
    saveDurableLearnerCognition(input.userId, ctx.learnerState, { graphContinuity });
  }

  emitCognitionTelemetryV5(ctx, "study_plan_generated", input.sourceSurface ?? "cognition_substrate", {
    block_count: studyPlan.blocks.length,
    timing_risk_band: timingSignals.riskBand,
  });

  return {
    ctx,
    studyPlan,
    dashboard,
    graphSteps: [...traversal.steps],
    aiTutor,
    timingRiskBand: timingSignals.riskBand,
    studyPlanDensity: studyPlanDensityFromTiming(timingSignals),
  };
}
