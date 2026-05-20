/**
 * Replayable graph lineage — shared client/server telemetry contract.
 */
import type { EducationalIntent } from "@/lib/educational-graph/graph-step-contract";
import {
  GRAPH_VERSION,
  ONTOLOGY_REVISION,
  type CognitionVersionMetadata,
  buildCognitionVersionMetadata,
} from "@/lib/educational-cognition/cognition-version-governance";
import type { CognitionReliabilityTier } from "@/lib/educational-cognition/cognition-snapshot-types";

export type GraphLineageEnvelope = {
  pathwayId: string;
  graphVersion: string;
  ontologyRevision: string;
  educationalIntent: EducationalIntent | null;
  testing_model: string;
  cognitionReliabilityTier: CognitionReliabilityTier;
  continuityCheckpointId: string;
  source_surface: string;
};

export function createContinuityCheckpointId(args: {
  pathwayId: string;
  topicSlug: string;
  stepId?: string;
  surface: string;
}): string {
  const base = `${args.pathwayId}:${args.topicSlug}:${args.surface}`;
  return args.stepId ? `${base}:${args.stepId}` : base;
}

export function buildGraphLineageEnvelope(args: {
  pathwayId: string;
  sourceSurface: string;
  educationalIntent?: EducationalIntent | null;
  testingModel: string;
  cognitionReliabilityTier?: CognitionReliabilityTier;
  topicSlug?: string;
  stepId?: string;
  version?: CognitionVersionMetadata;
}): GraphLineageEnvelope {
  const version = args.version ?? buildCognitionVersionMetadata();
  const topicSlug = args.topicSlug ?? "unknown";
  return {
    pathwayId: args.pathwayId,
    graphVersion: version.graphVersion ?? GRAPH_VERSION,
    ontologyRevision: version.ontologyRevision ?? ONTOLOGY_REVISION,
    educationalIntent: args.educationalIntent ?? null,
    testing_model: args.testingModel,
    cognitionReliabilityTier: args.cognitionReliabilityTier ?? "inferred",
    continuityCheckpointId: createContinuityCheckpointId({
      pathwayId: args.pathwayId,
      topicSlug,
      stepId: args.stepId,
      surface: args.sourceSurface,
    }),
    source_surface: args.sourceSurface,
  };
}

export function graphLineageTelemetryProps(
  lineage: GraphLineageEnvelope,
): Record<string, string | number | boolean | undefined> {
  return {
    pathway_id: lineage.pathwayId,
    graph_version: lineage.graphVersion,
    ontology_revision: lineage.ontologyRevision,
    educational_intent: lineage.educationalIntent ?? undefined,
    testing_model: lineage.testing_model,
    cognition_reliability_tier: lineage.cognitionReliabilityTier,
    continuity_checkpoint_id: lineage.continuityCheckpointId,
    source_surface: lineage.source_surface,
  };
}
