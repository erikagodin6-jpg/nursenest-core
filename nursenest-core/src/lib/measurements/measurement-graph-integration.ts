/**
 * Measurement nodes in the unified educational graph — first-class ontology linkage.
 */
import type { ClinicalInterpretationId } from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import type { ClinicalReasoningRelation } from "@/lib/educational-graph/rn-competency-ontology";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import type { EduGraphStep, GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import type {
  AuthoredMeasurement,
  ClinicalMeasurementSystem,
  MeasurementCategory,
} from "@/lib/measurements/measurement-domain";
import { orchestrateClinicalMeasurement } from "@/lib/measurements/clinical-measurement-orchestrator";
import { linkMeasurementToCompetencyGraph } from "@/lib/measurements/measurement-semantic-layer";
import { getPathwayMeasurementPolicy } from "@/lib/measurements/pathway-measurement-policy";
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

export type MeasurementGraphNode = {
  nodeId: string;
  category: MeasurementCategory;
  kind?: string;
  competencyTopicKeys: string[];
  interpretationGuideIds: ClinicalInterpretationId[];
  glossaryKeys: string[];
  reasoningChain: readonly ClinicalReasoningRelation[];
  remediationPriority: number;
};

export function buildMeasurementGraphNode(args: {
  measurement: AuthoredMeasurement;
  pathwayId?: string | null;
  countryCode?: string | null;
  trendValuesSi?: number[];
}): MeasurementGraphNode {
  const entity = linkMeasurementToCompetencyGraph({
    category: args.measurement.category,
    kind: args.measurement.kind,
  });
  const policy = getPathwayMeasurementPolicy(args.pathwayId, args.countryCode);
  const orchestrated = orchestrateClinicalMeasurement({
    measurement: args.measurement,
    renderedSystem: policy.instructionalSystem,
    pathwayId: args.pathwayId,
    countryCode: args.countryCode,
    trendValuesSi: args.trendValuesSi,
    sourceSurface: "dashboard",
    authenticated: true,
  });

  return {
    nodeId: entity.entityId,
    category: args.measurement.category,
    kind: args.measurement.kind,
    competencyTopicKeys: entity.competencyTopicKeys,
    interpretationGuideIds: entity.interpretationGuideIds,
    glossaryKeys: entity.glossaryKeys,
    reasoningChain: orchestrated.bedsidePathway.reasoningRelations,
    remediationPriority: entity.remediationPriority,
  };
}

/**
 * Merge measurement-aware graph traversal — dedupes hrefs against base graph.
 */
export function orchestrateMeasurementEducationalGraph(args: {
  topicSlug: string;
  topicLabel?: string;
  pathwayId?: string | null;
  sourceSurface: GraphSourceSurface;
  coachingModel?: CoachingModel;
  learnerState?: RnLearnerStateSnapshot | null;
  measurement?: AuthoredMeasurement;
  trendValuesSi?: number[];
}): {
  traversal: ReturnType<typeof orchestrateEducationalGraph>;
  measurementNode: MeasurementGraphNode | null;
} {
  const traversal = orchestrateEducationalGraph({
    topicSlug: args.topicSlug,
    topicLabel: args.topicLabel,
    pathwayId: args.pathwayId,
    sourceSurface: args.sourceSurface,
    coachingModel: args.coachingModel,
    learnerState: args.learnerState ?? null,
    persistentWeakTopics: args.learnerState?.measurementWeaknesses,
  });

  if (!args.measurement) {
    return { traversal, measurementNode: null };
  }

  const measurementNode = buildMeasurementGraphNode({
    measurement: args.measurement,
    pathwayId: args.pathwayId,
    trendValuesSi: args.trendValuesSi,
  });

  const seen = new Set(traversal.steps.map((s) => s.href));
  const enrichedSteps: EduGraphStep[] = [...traversal.steps];
  if (measurementNode.interpretationGuideIds[0] && enrichedSteps.length < 8) {
    const interp = enrichedSteps.find((s) => s.stepKind === "interpretation");
    if (interp) {
      interp.telemetryMetadata = {
        ...interp.telemetryMetadata,
        measurementTag: measurementNode.nodeId,
        reasoningRelation: measurementNode.reasoningChain[0],
      };
      interp.remediationPriority = Math.max(interp.remediationPriority, measurementNode.remediationPriority);
    }
  }

  return {
    traversal: {
      ...traversal,
      steps: enrichedSteps.filter((s) => {
        if (seen.has(s.href)) return false;
        seen.add(s.href);
        return true;
      }),
      reasoningChain: [
        ...traversal.reasoningChain,
        ...measurementNode.reasoningChain.filter((r) => !traversal.reasoningChain.includes(r)),
      ],
    },
    measurementNode,
  };
}
