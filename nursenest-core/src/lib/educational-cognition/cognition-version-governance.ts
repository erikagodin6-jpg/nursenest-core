/**
 * Explicit version metadata for cognition runtime surfaces (telemetry, APIs, adaptive, graph).
 */
import { COGNITION_SNAPSHOT_VERSION } from "@/lib/educational-cognition/cognition-snapshot-types";
import { EDUCATIONAL_ONTOLOGY_NAMESPACE } from "@/lib/educational-graph/educational-ontology-constants";

/** Runtime cognition schema revision (envelope + integrity + repair shape). */
export const COGNITION_SCHEMA_VERSION = 1 as const;

/** Hydration/repair pipeline revision. */
export const HYDRATION_VERSION = 2 as const;

export const ONTOLOGY_REVISION = EDUCATIONAL_ONTOLOGY_NAMESPACE;

export const GRAPH_VERSION = "educational_graph_steps.v1" as const;

export type CognitionVersionMetadata = {
  cognitionSchemaVersion: number;
  envelopeVersion: number;
  hydrationVersion: number;
  ontologyRevision: string;
  graphVersion: string;
  migrationPath: string | null;
};

export function buildCognitionVersionMetadata(args?: {
  envelopeVersion?: number;
  migrationPath?: string | null;
}): CognitionVersionMetadata {
  return {
    cognitionSchemaVersion: COGNITION_SCHEMA_VERSION,
    envelopeVersion: args?.envelopeVersion ?? COGNITION_SNAPSHOT_VERSION,
    hydrationVersion: HYDRATION_VERSION,
    ontologyRevision: ONTOLOGY_REVISION,
    graphVersion: GRAPH_VERSION,
    migrationPath: args?.migrationPath ?? null,
  };
}

/** Telemetry-safe snake_case projection (no PII). */
export function cognitionVersionTelemetryProps(
  meta: CognitionVersionMetadata,
): Record<string, string | number> {
  return {
    cognition_schema_version: meta.cognitionSchemaVersion,
    envelope_version: meta.envelopeVersion,
    hydration_version: meta.hydrationVersion,
    ontology_revision: meta.ontologyRevision,
    graph_version: meta.graphVersion,
    migration_path: meta.migrationPath ?? "none",
  };
}
