import "server-only";

import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition/resolve-educational-cognition-context";
import { resolveDashboardSubstrateOrchestration } from "@/lib/educational-cognition/dashboard-substrate-orchestration";
import { emitGovernedServerGraphTelemetry } from "@/lib/educational-graph/governed-server-telemetry";
import { logGraphLineageServerCapture } from "@/lib/educational-graph/graph-lineage-server-observability";
import { replayDashboardActions } from "@/lib/educational-graph/graph-runtime-replay";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

export function emitLearnerDashboardGraphTelemetry(args: {
  userId: string;
  entitlement: AccessScope;
  pathwayId: string;
  readiness?: ReadinessResult | null;
  topicTrends?: TopicTrendRow[];
  weakTopics?: WeakTopicRow[];
}): void {
  if (!args.entitlement.hasAccess) return;

  const ctx = resolveEducationalCognitionContext(args.pathwayId, {
    userId: args.userId,
    readinessResult: args.readiness ?? null,
    topicTrends: args.topicTrends,
    weakTopics: args.weakTopics,
    persistLearnerState: false,
  });

  const orch = resolveDashboardSubstrateOrchestration({
    pathwayId: args.pathwayId,
    cognitionOptions: {
      userId: args.userId,
      readinessResult: args.readiness ?? null,
      topicTrends: args.topicTrends,
      weakTopics: args.weakTopics,
    },
  });

  const primary = orch.graphActions[0]?.step;
  const lineage = emitGovernedServerGraphTelemetry({
    userId: args.userId,
    entitlement: args.entitlement,
    event: "graph_step_viewed",
    cognition: ctx,
    sourceSurface: "dashboard_feed",
    step: primary,
    stepCount: orch.graphActions.length,
  });

  logGraphLineageServerCapture({
    event: "dashboard_sequence_rendered",
    lineage,
    userId: args.userId,
  });

  void replayDashboardActions(orch.graphActions, args.pathwayId);
}
