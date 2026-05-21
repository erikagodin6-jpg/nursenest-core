/**
 * Canonical breadcrumb telemetry — normalized payload, deduped server events.
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { BreadcrumbIntent } from "@/lib/breadcrumbs/breadcrumb-intent";
import type { BreadcrumbSurface } from "@/lib/breadcrumbs/breadcrumb-surface";
import type { BreadcrumbSchemaOwner } from "@/lib/breadcrumbs/breadcrumb-schema-governance";
import type { OntologyClassification } from "@/lib/breadcrumbs/breadcrumb-root-registry";
import {
  buildSemanticTelemetryLineage,
  type SemanticTelemetryLineage,
} from "@/lib/breadcrumbs/governance/semantic-telemetry-lineage";
import { normalizeEducationalPathname } from "@/lib/breadcrumbs/pathname-normalization";

export type BreadcrumbTelemetryEvent =
  | "breadcrumb_rendered"
  | "breadcrumb_clicked"
  | "breadcrumb_schema_emitted"
  | "breadcrumb_fallback_used";

export type BreadcrumbRouteType = "marketing" | "learner" | "unknown";

export type BreadcrumbTelemetryPayload = {
  event: BreadcrumbTelemetryEvent;
  breadcrumbIntent: BreadcrumbIntent;
  breadcrumbSurface: BreadcrumbSurface;
  breadcrumbDepth: number;
  canonicalRoot: string;
  schemaOwner: BreadcrumbSchemaOwner;
  ontologyClassification: OntologyClassification | "unknown";
  routeType: BreadcrumbRouteType;
  pathname: string;
  normalizedPathname?: string;
  semanticRouteKind?: string;
  ontologyNamespace?: string;
  graphVersion?: string;
  educationalIntent?: string;
  cognitionReliabilityTier?: string;
  crumbIndex?: number;
  crumbLabel?: string;
  competencyId?: string;
  topicSlug?: string;
  pathwayId?: string | null;
  lineage?: SemanticTelemetryLineage;
  ontologyRevision?: string;
  testing_model?: string;
};

const renderedDedupe = new Set<string>();

function routeTypeFromPath(pathname: string): BreadcrumbRouteType {
  if (pathname.startsWith("/app")) return "learner";
  if (pathname.startsWith("/")) return "marketing";
  return "unknown";
}

function dedupeKey(payload: BreadcrumbTelemetryPayload): string {
  return `${payload.event}:${payload.pathname}:${payload.breadcrumbSurface}:${payload.breadcrumbDepth}`;
}

function enrichPayload(payload: BreadcrumbTelemetryPayload): BreadcrumbTelemetryPayload {
  const normalizedPathname = normalizeEducationalPathname(
    payload.normalizedPathname ?? payload.pathname,
  );
  const lineage =
    payload.lineage ??
    buildSemanticTelemetryLineage({
      pathname: normalizedPathname,
      breadcrumbIntent: payload.breadcrumbIntent,
      breadcrumbSurface: payload.breadcrumbSurface,
      breadcrumbDepth: payload.breadcrumbDepth,
      canonicalRoot: payload.canonicalRoot,
      schemaOwner: payload.schemaOwner,
      ontologyNamespace: payload.ontologyNamespace,
      ontologyClassification: payload.ontologyClassification,
      educationalIntent: payload.educationalIntent ?? payload.breadcrumbIntent,
      topicSlug: payload.topicSlug,
      competencyId: payload.competencyId,
      pathwayId: payload.pathwayId,
      testing_model: payload.testing_model,
      cognitionReliabilityTier: payload.cognitionReliabilityTier as
        | import("@/lib/breadcrumbs/governance/semantic-telemetry-lineage").CognitionReliabilityTier
        | undefined,
    });
  return {
    ...payload,
    normalizedPathname: lineage.normalizedPathname,
    semanticRouteKind: lineage.semanticRouteKind,
    ontologyNamespace: lineage.ontologyNamespace,
    graphVersion: lineage.graphVersion,
    ontologyRevision: lineage.ontologyRevision,
    testing_model: lineage.testing_model,
    educationalIntent: lineage.educationalIntent,
    cognitionReliabilityTier: lineage.cognitionReliabilityTier,
    lineage,
  };
}

export function trackBreadcrumbTelemetry(payload: BreadcrumbTelemetryPayload): void {
  const enriched = enrichPayload(payload);
  if (enriched.event === "breadcrumb_rendered" || enriched.event === "breadcrumb_schema_emitted") {
    const key = dedupeKey(enriched);
    if (renderedDedupe.has(key)) return;
    renderedDedupe.add(key);
    if (renderedDedupe.size > 500) renderedDedupe.clear();
  }

  safeServerLog("breadcrumb_telemetry", enriched.event, {
    breadcrumb_intent: enriched.breadcrumbIntent,
    breadcrumb_surface: enriched.breadcrumbSurface,
    breadcrumb_depth: String(enriched.breadcrumbDepth),
    canonical_root: enriched.canonicalRoot.slice(0, 64),
    schema_owner: enriched.schemaOwner,
    ontology_classification: enriched.ontologyClassification,
    route_type: enriched.routeType,
    pathname: enriched.pathname.slice(0, 200),
    normalized_pathname: enriched.normalizedPathname?.slice(0, 200),
    semantic_route_kind: enriched.semanticRouteKind,
    ontology_namespace: enriched.ontologyNamespace?.slice(0, 64),
    graph_version: enriched.graphVersion,
    ontology_revision: enriched.lineage?.ontologyRevision?.slice(0, 80),
    testing_model: enriched.lineage?.testing_model?.slice(0, 40),
    educational_intent: enriched.educationalIntent?.slice(0, 40),
    cognition_reliability_tier: enriched.cognitionReliabilityTier,
    crumb_index: enriched.crumbIndex != null ? String(enriched.crumbIndex) : undefined,
    crumb_label: enriched.crumbLabel?.slice(0, 80),
    competency_id: enriched.competencyId?.slice(0, 64),
    topic_slug: enriched.topicSlug?.slice(0, 80),
  });
}

export function trackBreadcrumbRendered(
  args: Omit<BreadcrumbTelemetryPayload, "event" | "routeType"> & { pathname: string },
): void {
  trackBreadcrumbTelemetry({
    ...args,
    event: "breadcrumb_rendered",
    routeType: routeTypeFromPath(args.pathname),
  });
}

export function trackBreadcrumbSchemaEmitted(
  args: Omit<BreadcrumbTelemetryPayload, "event" | "routeType"> & { pathname: string },
): void {
  trackBreadcrumbTelemetry({
    ...args,
    event: "breadcrumb_schema_emitted",
    routeType: routeTypeFromPath(args.pathname),
  });
}

/** @deprecated Prefer `trackLayoutBreadcrumbFallback` from layout-fallback-diagnostics. */
export function trackBreadcrumbFallbackUsed(pathname: string): void {
  trackBreadcrumbTelemetry({
    event: "breadcrumb_fallback_used",
    breadcrumbIntent: "seo",
    breadcrumbSurface: "path_segment_only",
    breadcrumbDepth: 0,
    canonicalRoot: "path_segment",
    schemaOwner: "layout_fallback",
    ontologyClassification: "unknown",
    routeType: routeTypeFromPath(pathname),
    pathname,
  });
}

export function trackBreadcrumbClicked(
  args: Omit<BreadcrumbTelemetryPayload, "event" | "routeType"> & {
    pathname: string;
    crumbIndex: number;
    crumbLabel: string;
  },
): void {
  trackBreadcrumbTelemetry({
    ...args,
    event: "breadcrumb_clicked",
    routeType: routeTypeFromPath(args.pathname),
  });
}

/** Test-only reset */
export function resetBreadcrumbTelemetryDedupeForTests(): void {
  renderedDedupe.clear();
}
