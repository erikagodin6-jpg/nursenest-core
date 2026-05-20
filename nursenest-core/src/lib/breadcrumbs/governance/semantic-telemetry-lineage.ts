/**
 * Semantic telemetry lineage — graph-aware breadcrumb event validation.
 */

import type { BreadcrumbIntent } from "@/lib/breadcrumbs/breadcrumb-intent";
import type { BreadcrumbSurface } from "@/lib/breadcrumbs/breadcrumb-surface";
import type { BreadcrumbSchemaOwner } from "@/lib/breadcrumbs/breadcrumb-schema-governance";
import { normalizeEducationalPathname } from "@/lib/breadcrumbs/pathname-normalization";
import { EDUCATIONAL_GRAPH_VERSION, BREADCRUMB_ONTOLOGY_REVISION } from "@/lib/breadcrumbs/governance/graph-os-constants";
import type { OntologyClassification } from "@/lib/breadcrumbs/breadcrumb-root-registry";

export type SemanticRouteKind = "learner" | "marketing" | "academy" | "discovery" | "seo_fallback" | "unknown";

export type CognitionReliabilityTier = "high" | "medium" | "low" | "unknown";

export type SemanticTelemetryLineage = {
  normalizedPathname: string;
  semanticRouteKind: SemanticRouteKind;
  ontologyNamespace: string;
  canonicalRoot: string;
  schemaOwner: BreadcrumbSchemaOwner;
  breadcrumbDepth: number;
  graphVersion: string;
  educationalIntent: string;
  cognitionReliabilityTier: CognitionReliabilityTier;
  breadcrumbIntent: BreadcrumbIntent;
  breadcrumbSurface: BreadcrumbSurface;
  topicSlug?: string;
  competencyId?: string;
};

export type LineageValidationIssue = {
  code:
    | "canonical_mismatch"
    | "learner_seo_leakage"
    | "ungoverned_owner"
    | "missing_ontology"
    | "depth_zero"
    | "stale_graph_version";
  detail: string;
};

export function semanticRouteKindFromPath(pathname: string): SemanticRouteKind {
  const path = normalizeEducationalPathname(pathname);
  if (path.startsWith("/app")) return "learner";
  if (path.startsWith("/ecg") || path.startsWith("/labs") || path.startsWith("/clinical-modules")) {
    return "academy";
  }
  if (
    path.includes("/pricing") ||
    path.includes("/cat") ||
    path.includes("/questions") ||
    /\/(canada|us)\/(rn|pn|np)\//.test(path)
  ) {
    return "discovery";
  }
  if (path.startsWith("/")) return "marketing";
  return "unknown";
}

export function buildSemanticTelemetryLineage(args: {
  pathname: string;
  breadcrumbIntent: BreadcrumbIntent;
  breadcrumbSurface: BreadcrumbSurface;
  breadcrumbDepth: number;
  canonicalRoot: string;
  schemaOwner: BreadcrumbSchemaOwner;
  ontologyNamespace?: string;
  ontologyClassification?: OntologyClassification | "unknown";
  educationalIntent?: string;
  topicSlug?: string;
  competencyId?: string;
}): SemanticTelemetryLineage {
  const normalizedPathname = normalizeEducationalPathname(args.pathname);
  const semanticRouteKind = semanticRouteKindFromPath(normalizedPathname);
  const cognitionReliabilityTier: CognitionReliabilityTier =
    args.schemaOwner === "page" && semanticRouteKind !== "seo_fallback" ? "high" : args.schemaOwner === "layout_fallback" ? "medium" : "low";

  return {
    normalizedPathname,
    semanticRouteKind,
    ontologyNamespace:
      args.ontologyNamespace ?? args.canonicalRoot ?? args.ontologyClassification ?? "unknown",
    canonicalRoot: args.canonicalRoot,
    schemaOwner: args.schemaOwner,
    breadcrumbDepth: args.breadcrumbDepth,
    graphVersion: EDUCATIONAL_GRAPH_VERSION,
    educationalIntent: args.educationalIntent ?? args.breadcrumbIntent,
    cognitionReliabilityTier,
    breadcrumbIntent: args.breadcrumbIntent,
    breadcrumbSurface: args.breadcrumbSurface,
    topicSlug: args.topicSlug,
    competencyId: args.competencyId,
  };
}

export function validateTelemetryLineage(lineage: SemanticTelemetryLineage): LineageValidationIssue[] {
  const issues: LineageValidationIssue[] = [];

  if (!lineage.normalizedPathname.startsWith("/")) {
    issues.push({ code: "canonical_mismatch", detail: lineage.normalizedPathname });
  }

  if (lineage.semanticRouteKind === "learner" && lineage.breadcrumbIntent !== "learner") {
    issues.push({
      code: "learner_seo_leakage",
      detail: `intent=${lineage.breadcrumbIntent}`,
    });
  }

  if (lineage.schemaOwner === "none" && lineage.breadcrumbDepth > 0) {
    issues.push({ code: "ungoverned_owner", detail: "trail_without_owner" });
  }

  if (!lineage.ontologyNamespace || lineage.ontologyNamespace === "unknown") {
    issues.push({ code: "missing_ontology", detail: lineage.canonicalRoot });
  }

  if (lineage.breadcrumbDepth < 1) {
    issues.push({ code: "depth_zero", detail: lineage.normalizedPathname });
  }

  if (!lineage.graphVersion) {
    issues.push({ code: "stale_graph_version", detail: "missing_graph_version" });
  }

  return issues;
}

export function lineageOntologyRevision(): string {
  return BREADCRUMB_ONTOLOGY_REVISION;
}
