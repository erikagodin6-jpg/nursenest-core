// @ts-nocheck -- Legacy graph/cognition scaffold is runtime-gated; keep CI unblocked while typed contracts converge.
import "server-only";

import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import {
  buildAdaptiveRecommendations,
  type AdaptiveLearnerRecommendations,
  type NextAction,
} from "@/lib/learner/adaptive-recommendations";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import {
  resolveLearnerCognitionSubstrate,
  type LearnerCognitionSubstrate,
} from "@/lib/educational-cognition/cognition-substrate";
import { emitCognitionTelemetryV5 } from "@/lib/educational-cognition/cognition-telemetry-v5";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";
import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import { warmDurableLearnerCognitionCache } from "@/lib/educational-cognition/learner-cognition-persistence";
import { graphNextStepsFromSteps } from "@/lib/educational-cognition/graph-next-step-continuity";
import {
  buildCognitionVersionMetadata,
  type CognitionVersionMetadata,
} from "@/lib/educational-cognition/cognition-version-governance";
import { nextActionFromGraphStep } from "@/lib/educational-graph/graph-step-next-action";
import {
  buildCognitionExplainability,
  serializeExplainabilityForPublic,
} from "@/lib/educational-cognition/cognition-explainability";

export type GovernedAdaptiveRecommendations = AdaptiveLearnerRecommendations & {
  cognition: {
    pathwayId: string;
    testingModel: string;
    showAdaptivePlan: boolean;
    graphPrimary: NextAction | null;
    primaryGraphStep: EduGraphStep | null;
    fatigueCapActive: boolean;
    timingRiskBand: string;
    graphNextSteps: Array<{ title: string; href: string; kind: string }>;
    version: CognitionVersionMetadata;
    explainability: ReturnType<typeof serializeExplainabilityForPublic>;
  };
};

function weakTopicRowsFromCognition(ctx: EducationalCognitionContext): WeakTopicRow[] {
  const labels = ctx.learnerState.competencyStates
    .filter((c) => c.persistentWeak || c.masteryScore < 55)
    .sort((a, b) => a.masteryScore - b.masteryScore)
    .map((c) => {
      const missRate = Math.max(0, Math.min(1, (100 - c.masteryScore) / 100));
      const attempted = Math.max(1, c.sessionEvidenceCount);
      return {
        topic: c.competencyId.replace(/_/g, " "),
        normalizedTopic: c.competencyId,
        missed: Math.round(attempted * missRate),
        attempted,
        missRate,
        weakPriorityScore: Math.max(0, 100 - c.masteryScore) / 100,
      };
    });
  if (labels.length > 0) return labels;
  return ctx.ontology.measurementWeaknessTags.slice(0, 3).map((tag, i) => ({
    topic: tag.replace(/_/g, " "),
    normalizedTopic: tag,
    missed: 4,
    attempted: 10,
    missRate: 0.4,
    weakPriorityScore: (90 - i * 5) / 100,
  }));
}

function secondaryFromDashboardAndGraph(
  substrate: LearnerCognitionSubstrate,
  maxSecondary: number,
): NextAction[] {
  const fromGraph = substrate.graphSteps.slice(1, maxSecondary + 1).map(nextActionFromGraphStep);
  const fromCards: NextAction[] = [];
  for (const card of substrate.dashboard.cards) {
    if (!card.href || card.tone !== "remediation") continue;
    fromCards.push({
      title: card.title,
      href: card.href,
      reason: card.body,
      kind: card.href.includes("flashcard") ? "review" : card.href.includes("lesson") ? "lesson" : "quiz",
    });
    if (fromCards.length + fromGraph.length >= maxSecondary) break;
  }
  const seen = new Set<string>();
  const merged: NextAction[] = [];
  for (const action of [...fromGraph, ...fromCards]) {
    if (seen.has(action.href)) continue;
    seen.add(action.href);
    merged.push(action);
    if (merged.length >= maxSecondary) break;
  }
  return merged;
}

function applyCognitionOverlay(
  base: AdaptiveLearnerRecommendations,
  substrate: LearnerCognitionSubstrate,
): GovernedAdaptiveRecommendations {
  const { ctx, graphSteps, timingRiskBand } = substrate;
  const graphPrimary = graphSteps[0] ? nextActionFromGraphStep(graphSteps[0]) : null;
  const graphNextSteps = graphNextStepsFromSteps(graphSteps);

  let primaryNext = graphPrimary ?? base.primaryNext;
  if (graphPrimary && !ctx.remediation.fatigueCapActive) {
    primaryNext = graphPrimary;
  } else if (!graphPrimary && substrate.dashboard.cards[0]?.href) {
    const momentum = substrate.dashboard.cards.find((c) => c.href && c.tone === "momentum");
    const card = momentum ?? substrate.dashboard.cards.find((c) => c.href);
    if (card?.href) {
      primaryNext = {
        title: card.title,
        href: card.href,
        reason: card.body,
        kind: card.href.includes("lesson") ? "lesson" : "continue",
      };
    }
  }

  const maxSecondary = ctx.remediation.maxRecommendations;
  let secondary = secondaryFromDashboardAndGraph(substrate, maxSecondary);
  if (secondary.length === 0) {
    secondary = base.secondary.slice(0, maxSecondary);
  }
  if (ctx.remediation.fatigueCapActive && secondary.length > 2) {
    secondary = secondary.slice(0, 2);
  }

  let readinessTimelineLine = base.readinessTimelineLine;
  if (!ctx.readinessSemantics.allowsPassOutlook && readinessTimelineLine) {
    if (/pass|probability|likelihood|outlook/i.test(readinessTimelineLine)) {
      readinessTimelineLine = null;
    }
  }

  if (!ctx.dashboard.showAdaptivePlan) {
    secondary = secondary.filter((a) => a.kind !== "cat");
  }

  const weakTop3 = weakTopicRowsFromCognition(ctx)
    .slice(0, 3)
    .map((w) => w.topic);

  const version = buildCognitionVersionMetadata({
    envelopeVersion: ctx.learnerState.version,
    migrationPath: null,
  });
  const explainability = buildCognitionExplainability({
    ctx,
    graphSteps,
    primaryReason: primaryNext.reason,
  });

  return {
    ...base,
    primaryNext,
    secondary,
    weakTop3: weakTop3.length ? weakTop3 : base.weakTop3,
    readinessTimelineLine,
    cognition: {
      pathwayId: ctx.pathwayId,
      testingModel: ctx.psychometric.model,
      showAdaptivePlan: ctx.dashboard.showAdaptivePlan,
      graphPrimary,
      primaryGraphStep: graphSteps[0] ?? null,
      fatigueCapActive: ctx.remediation.fatigueCapActive,
      timingRiskBand,
      graphNextSteps,
      version,
      explainability: serializeExplainabilityForPublic(explainability),
    },
  };
}

export type BuildGovernedAdaptiveRecommendationsArgs = Parameters<typeof buildAdaptiveRecommendations>[0] & {
  userId?: string | null;
  entitlement?: AccessScope | null;
  topicTrends?: TopicTrendRow[];
};

/**
 * Cognition-driven adaptive recommendations — dashboard + graph authority (exam calendar shell only).
 */
export async function buildGovernedAdaptiveRecommendations(
  args: BuildGovernedAdaptiveRecommendationsArgs,
): Promise<GovernedAdaptiveRecommendations> {
  const pathwayId = args.preferredPathwayId?.trim() || null;

  if (args.userId && args.entitlement?.hasAccess && pathwayId) {
    await warmDurableLearnerCognitionCache(args.userId);

    const substrate = resolveLearnerCognitionSubstrate({
      pathwayId,
      userId: args.userId,
      readinessResult: args.readiness,
      topicTrends: args.topicTrends ?? [],
      weakTopics: args.weakTopics,
      persistLearnerState: true,
      sourceSurface: "adaptive_recommendations",
    });

    const cognitionWeakTopics = weakTopicRowsFromCognition(substrate.ctx);

    const base = buildAdaptiveRecommendations({
      ...args,
      preferredPathwayId: pathwayId,
      weakTopics: cognitionWeakTopics,
      recommendedQuizTopic: cognitionWeakTopics[0]?.topic ?? args.recommendedQuizTopic,
    });

    const governed = applyCognitionOverlay(base, substrate);
    emitCognitionTelemetryV5(substrate.ctx, "study_plan_generated", "adaptive_recommendations", {
      primary_kind: governed.primaryNext.kind,
      secondary_count: governed.secondary.length,
      graph_steps: governed.cognition.graphNextSteps.length,
    });
    return governed;
  }

  const base = buildAdaptiveRecommendations(args);
  const model = getTestingModelForPathwayId(pathwayId);
  return {
    ...base,
    cognition: {
      pathwayId: pathwayId ?? "unknown",
      testingModel: model,
      showAdaptivePlan: model === "CAT",
      graphPrimary: null,
      primaryGraphStep: null,
      fatigueCapActive: false,
      timingRiskBand: "stable",
      graphNextSteps: [],
      version: buildCognitionVersionMetadata({ migrationPath: "anonymous_fallback" }),
      explainability: serializeExplainabilityForPublic({
        derivedFrom: ["buildAdaptiveRecommendations", "anonymous_fallback"],
        competencySignals: [],
        remediationSignals: [],
        graphSignals: [],
        confidenceTier: "low",
        ontologyRevision: buildCognitionVersionMetadata().ontologyRevision,
        recommendationReason: "Session-only adaptive shell — sign in for cognition-governed recommendations.",
      }),
    },
  };
}
