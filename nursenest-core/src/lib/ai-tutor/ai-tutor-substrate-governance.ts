/**
 * Universal AI tutor graph continuity — single authority for tutoring prompts and lineage.
 */
import type { TutoringPromptContext } from "@/lib/ai-tutor/types";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import {
  buildGraphLineageEnvelope,
  graphLineageTelemetryProps,
  type GraphLineageEnvelope,
} from "@/lib/educational-graph/graph-lineage-envelope";
import { tutoringPromptContextFromAiEnvelope } from "@/lib/educational-cognition/ai-tutor-cognition-envelope";
import type { AiTutorContextEnvelope } from "@/lib/learner/rn-coaching-intelligence/ai-tutor-context-envelope";
import type { RnCompetencyMasteryState } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";
import type { CognitionReliabilityTier } from "@/lib/educational-cognition/cognition-snapshot-types";
import { GRAPH_VERSION, ONTOLOGY_REVISION } from "@/lib/educational-cognition/cognition-version-governance";
import { logGraphGovernanceViolation } from "@/lib/educational-graph/graph-governance-observability";

export type TutoringSubstrateViolation = {
  code: "ai_prompt.graph_drift" | "tutoring_orphan_steps" | "tutoring_local_ranking";
  detail: string;
};

export type TutoringGraphContinuitySnapshot = {
  pathwayId: string;
  graphVersion: string;
  ontologyRevision: string;
  graphSteps: readonly EduGraphStep[];
  lineage: GraphLineageEnvelope;
  tutoringPlanSummary: string;
};

export function assertTutoringUsesGraphStepsOnly(ctx: TutoringPromptContext): TutoringSubstrateViolation | null {
  if (!ctx.graphSteps?.length) {
    return {
      code: "ai_prompt.graph_drift",
      detail: "TutoringPromptContext missing graphSteps — must derive from orchestrateEducationalGraph",
    };
  }
  const orphan = ctx.graphSteps.find((s) => !s.stepId || !s.href?.startsWith("/"));
  if (orphan) {
    return { code: "tutoring_orphan_steps", detail: `Invalid graph step: ${orphan.stepId}` };
  }
  return null;
}

export function resolveTutoringGraphSteps(args: {
  pathwayId: string;
  topicSlug: string;
  topicLabel?: string;
  cognition?: EducationalCognitionContext | null;
  envelope?: AiTutorContextEnvelope | null;
}): readonly EduGraphStep[] {
  if (args.envelope?.graphSteps?.length) return args.envelope.graphSteps;
  const traversal = orchestrateEducationalGraph({
    topicSlug: args.topicSlug,
    topicLabel: args.topicLabel ?? args.topicSlug,
    pathwayId: args.pathwayId,
    sourceSurface: "ai_tutor",
    coachingModel: args.cognition?.coachingModel,
    learnerState: args.cognition?.learnerState,
    persistentWeakTopics: args.cognition?.learnerState.competencyStates
      .filter((c: RnCompetencyMasteryState) => c.persistentWeak)
      .map((c: RnCompetencyMasteryState) => c.competencyId.replace(/_/g, " ")),
  });
  return traversal.steps;
}

export function buildTutoringGraphContinuitySnapshot(args: {
  ctx: EducationalCognitionContext;
  envelope: AiTutorContextEnvelope;
  graphSteps: readonly EduGraphStep[];
  cognitionReliabilityTier?: CognitionReliabilityTier;
}): TutoringGraphContinuitySnapshot {
  const primary = args.graphSteps[0];
  const lineage = buildGraphLineageEnvelope({
    pathwayId: args.ctx.pathwayId,
    sourceSurface: "ai_tutor",
    educationalIntent: primary?.educationalIntent ?? null,
    testingModel: args.ctx.psychometric.model ?? getTestingModelForPathwayId(args.ctx.pathwayId),
    cognitionReliabilityTier: args.cognitionReliabilityTier ?? "inferred",
    topicSlug: primary?.topicSlug,
    stepId: primary?.stepId,
  });

  return {
    pathwayId: args.ctx.pathwayId,
    graphVersion: GRAPH_VERSION,
    ontologyRevision: ONTOLOGY_REVISION,
    graphSteps: args.graphSteps,
    lineage,
    tutoringPlanSummary: args.envelope.tutoringPlanSummary,
  };
}

export function buildGovernedTutoringPromptContext(args: {
  partial: Omit<TutoringPromptContext, "graphSteps">;
  envelope: AiTutorContextEnvelope;
  cognition?: EducationalCognitionContext | null;
}): TutoringPromptContext {
  const pathwayId = args.partial.entitlementSnapshot.pathwayId;
  const topicSlug = args.partial.topicKeys[0] ?? "clinical-focus";
  const graphSteps =
    args.envelope.graphSteps.length > 0
      ? args.envelope.graphSteps
      : resolveTutoringGraphSteps({
          pathwayId,
          topicSlug,
          cognition: args.cognition ?? null,
          envelope: args.envelope,
        });

  const violation = assertTutoringUsesGraphStepsOnly({ ...args.partial, graphSteps });
  if (violation) {
    logGraphGovernanceViolation({
      code: violation.code === "ai_prompt.graph_drift" ? "ai_prompt.graph_drift" : "graph_governance.violation",
      surface: "ai_tutor",
      pathwayId,
      topicSlug,
      detail: violation.detail,
    });
  }

  return tutoringPromptContextFromAiEnvelope(
    { ...args.envelope, graphSteps },
    args.partial,
  );
}

export function tutoringLineageTelemetryProps(
  snapshot: TutoringGraphContinuitySnapshot,
): Record<string, string | number | boolean | undefined> {
  return {
    ...graphLineageTelemetryProps(snapshot.lineage),
    graph_step_count: snapshot.graphSteps.length,
    tutoring_plan_hash: snapshot.tutoringPlanSummary.length,
  };
}
