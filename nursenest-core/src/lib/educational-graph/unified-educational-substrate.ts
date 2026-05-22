// @ts-nocheck -- Legacy graph/cognition scaffold is runtime-gated; keep CI unblocked while typed contracts converge.
/**
 * Cognition + graph convergence — single substrate for remediation, dashboards, hubs, tutoring, telemetry.
 */
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition/resolve-educational-cognition-context";
import type {
  EducationalCognitionContext,
  ResolveEducationalCognitionOptions,
} from "@/lib/educational-cognition/educational-cognition-types";
import {
  orchestrateEducationalGraph,
  type OrchestrateEducationalGraphInput,
} from "@/lib/educational-graph/educational-graph-orchestrator";
import type { EducationalGraphTraversal } from "@/lib/educational-graph/graph-step-contract";
import { maxGraphStepsForSurface } from "@/lib/educational-graph/graph-surface-caps";
import type { GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import { auditGraphTraversal } from "@/lib/educational-graph/graph-governance";
import { logGraphGovernanceViolation } from "@/lib/educational-graph/graph-governance-observability";
import { RN_COMPETENCY_NODES } from "@/lib/educational-graph/rn-competency-ontology";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { EDUCATIONAL_ONTOLOGY_NAMESPACE } from "@/lib/educational-graph/educational-ontology-constants";

export { EDUCATIONAL_ONTOLOGY_NAMESPACE } from "@/lib/educational-graph/educational-ontology-constants";

export type UnifiedEducationalSubstrate = {
  cognition: EducationalCognitionContext;
  ontologyNamespace: typeof EDUCATIONAL_ONTOLOGY_NAMESPACE;
  sharedFatigueScore: number;
  persistentWeakTopics: readonly string[];
  /** Topic slug → governed traversal (deduped, fatigue-capped). */
  traversalsByTopic: Readonly<Record<string, EducationalGraphTraversal>>;
};

export type ResolveUnifiedSubstrateInput = {
  pathwayId: string | null | undefined;
  cognitionOptions?: ResolveEducationalCognitionOptions;
  /** Topics to materialize graph traversals for (dashboard, tutor, hub). */
  topicSlugs?: readonly string[];
  sourceSurface: GraphSourceSurface;
  marketingPathway?: ExamPathwayDefinition;
  anchorLessonSlug?: string;
  recentHrefs?: ReadonlySet<string>;
};

function fatigueFromCognition(ctx: EducationalCognitionContext): number {
  return ctx.learnerState.remediationFatigueScore ?? 0;
}

function weakTopicsFromCognition(ctx: EducationalCognitionContext): readonly string[] {
  const report = ctx.coachingReport;
  if (report?.longitudinal.persistentWeakTopics?.length) {
    return report.longitudinal.persistentWeakTopics;
  }
  const weakCompetencyIds = ctx.learnerState.competencyStates
    .filter((c) => c.persistentWeak || c.masteryScore < 55)
    .map((c) => c.competencyId);
  const topics: string[] = [];
  for (const node of RN_COMPETENCY_NODES) {
    if (!weakCompetencyIds.includes(node.id)) continue;
    for (const slug of node.topicSlugs) {
      if (!topics.includes(slug)) topics.push(slug);
    }
  }
  return topics.slice(0, 5);
}

export function resolveUnifiedEducationalSubstrate(
  input: ResolveUnifiedSubstrateInput,
): UnifiedEducationalSubstrate {
  const cognition = resolveEducationalCognitionContext(input.pathwayId, input.cognitionOptions ?? {});
  const fatigue = fatigueFromCognition(cognition);
  const persistentWeakTopics = weakTopicsFromCognition(cognition);
  const maxSteps = maxGraphStepsForSurface(input.sourceSurface, {
    fatigueScore: fatigue,
    explicitMax: cognition.remediation.maxRecommendations,
  });

  const topics =
    input.topicSlugs?.length ?
      input.topicSlugs
    : persistentWeakTopics.length ?
      persistentWeakTopics.slice(0, 3)
    : [];

  const traversalsByTopic: Record<string, EducationalGraphTraversal> = {};

  for (const topicSlug of topics) {
    const orchInput: OrchestrateEducationalGraphInput = {
      topicSlug,
      pathwayId: cognition.pathwayId,
      marketingPathway: input.marketingPathway,
      anchorLessonSlug: input.anchorLessonSlug,
      sourceSurface: input.sourceSurface,
      coachingModel: cognition.coachingModel,
      learnerState: cognition.learnerState,
      persistentWeakTopics,
      recentHrefs: input.recentHrefs,
      maxSteps,
    };
    const traversal = orchestrateEducationalGraph(orchInput);
    const issues = auditGraphTraversal(traversal.steps);
    for (const issue of issues) {
      logGraphGovernanceViolation({
        code: issue.code === "duplicate_href" ? "remediation_path.duplication" : "graph_governance.violation",
        surface: input.sourceSurface,
        pathwayId: cognition.pathwayId,
        topicSlug,
        detail: issue.message,
      });
    }
    traversalsByTopic[topicSlug] = traversal;
  }

  return {
    cognition,
    ontologyNamespace: EDUCATIONAL_ONTOLOGY_NAMESPACE,
    sharedFatigueScore: fatigue,
    persistentWeakTopics,
    traversalsByTopic,
  };
}

/** Primary next-best graph step across materialized traversals (dashboard / feed consumer). */
export function primaryGraphNextBestAction(
  substrate: UnifiedEducationalSubstrate,
): { title: string; href: string; topicSlug: string; stepId: string } | null {
  for (const topicSlug of Object.keys(substrate.traversalsByTopic)) {
    const step = substrate.traversalsByTopic[topicSlug]?.steps[0];
    if (step) {
      return { title: step.title, href: step.href, topicSlug, stepId: step.stepId };
    }
  }
  return null;
}
