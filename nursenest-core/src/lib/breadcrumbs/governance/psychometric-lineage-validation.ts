/**
 * Psychometric lineage validation — graph-aware telemetry stamps across surfaces.
 */

import { buildCognitionVersionMetadata } from "@/lib/educational-cognition/cognition-version-governance";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";
import { getTestingModelDefinition } from "@/lib/testing/testing-model-definitions";
import {
  BREADCRUMB_ONTOLOGY_REVISION,
  EDUCATIONAL_GRAPH_VERSION,
} from "@/lib/breadcrumbs/governance/graph-os-constants";
import type { CognitionReliabilityTier } from "@/lib/breadcrumbs/governance/telemetry-lineage-governance";
import { normalizeEducationalPathname } from "@/lib/breadcrumbs/pathname-normalization";

export type PsychometricLineageStamp = {
  testing_model: string;
  cognitionReliabilityTier: CognitionReliabilityTier;
  graphVersion: string;
  ontologyRevision: string;
  educationalIntent: string;
  pathwayId: string | null;
};

export type PsychometricLineageValidationIssue = {
  code:
    | "missing_testing_model"
    | "missing_graph_version"
    | "missing_ontology_revision"
    | "pathway_context_drift"
    | "hydration_lineage_gap"
    | "dedupe_collision";
  detail: string;
};

export function resolvePsychometricLineageStamp(args?: {
  pathwayId?: string | null;
  educationalIntent?: string;
  cognitionReliabilityTier?: CognitionReliabilityTier;
  sessionKind?: string | null;
}): PsychometricLineageStamp {
  const pathwayId = args?.pathwayId?.trim() || null;
  const model = pathwayId ? getTestingModelForPathwayId(pathwayId) : null;
  const definition = model ? getTestingModelDefinition(model) : null;
  const version = buildCognitionVersionMetadata();
  const testing_model = model ?? "unknown";
  const tier: CognitionReliabilityTier =
    args?.cognitionReliabilityTier ??
    (definition?.allowsConfidenceEstimation ? "high" : model ? "medium" : "unknown");

  return {
    testing_model,
    cognitionReliabilityTier: tier,
    graphVersion: version.graphVersion || EDUCATIONAL_GRAPH_VERSION,
    ontologyRevision: version.ontologyRevision || BREADCRUMB_ONTOLOGY_REVISION,
    educationalIntent: args?.educationalIntent ?? "competency",
    pathwayId,
  };
}

export function validatePsychometricLineage(stamp: PsychometricLineageStamp): PsychometricLineageValidationIssue[] {
  const issues: PsychometricLineageValidationIssue[] = [];
  if (!stamp.testing_model || stamp.testing_model === "unknown") {
    issues.push({ code: "missing_testing_model", detail: "no pathway psychometric context" });
  }
  if (!stamp.graphVersion) {
    issues.push({ code: "missing_graph_version", detail: "graphVersion empty" });
  }
  if (!stamp.ontologyRevision) {
    issues.push({ code: "missing_ontology_revision", detail: "ontologyRevision empty" });
  }
  return issues;
}

export function validateHydrationLineageParity(args: {
  ssrStamp: PsychometricLineageStamp;
  hydratedStamp: PsychometricLineageStamp;
  pathname: string;
}): PsychometricLineageValidationIssue[] {
  const issues: PsychometricLineageValidationIssue[] = [];
  const path = normalizeEducationalPathname(args.pathname);
  if (args.ssrStamp.graphVersion !== args.hydratedStamp.graphVersion) {
    issues.push({
      code: "hydration_lineage_gap",
      detail: `graphVersion ${args.ssrStamp.graphVersion}→${args.hydratedStamp.graphVersion}`,
    });
  }
  if (args.ssrStamp.ontologyRevision !== args.hydratedStamp.ontologyRevision) {
    issues.push({
      code: "hydration_lineage_gap",
      detail: `ontologyRevision mismatch on ${path}`,
    });
  }
  if (args.ssrStamp.testing_model !== args.hydratedStamp.testing_model) {
    issues.push({
      code: "hydration_lineage_gap",
      detail: `testing_model ${args.ssrStamp.testing_model}→${args.hydratedStamp.testing_model}`,
    });
  }
  return issues;
}

const dedupeRegistry = new Set<string>();

export function registerPsychometricTelemetryDedupe(key: string): boolean {
  if (dedupeRegistry.has(key)) return false;
  dedupeRegistry.add(key);
  if (dedupeRegistry.size > 2000) dedupeRegistry.clear();
  return true;
}

export function resetPsychometricTelemetryDedupeForTests(): void {
  dedupeRegistry.clear();
}

export function psychometricTelemetryDedupeKey(
  stamp: PsychometricLineageStamp,
  pathname: string,
  event: string,
): string {
  return `${event}:${normalizeEducationalPathname(pathname)}:${stamp.graphVersion}:${stamp.testing_model}`;
}
