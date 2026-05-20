/**
 * Educational traversal analytics — pathway-safe, graph-normalized, deduped.
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { BreadcrumbIntent } from "@/lib/breadcrumbs/breadcrumb-intent";
import type { BreadcrumbSurface } from "@/lib/breadcrumbs/breadcrumb-surface";
import { normalizeEducationalPathname } from "@/lib/breadcrumbs/pathname-normalization";
import {
  recordRemediationAbandonment,
  recordGraphTraversalInterrupted,
  recordNormalizationFallbackTriggered,
} from "@/lib/breadcrumbs/graph-navigation-observability";
import {
  enrichNavigationTelemetryLineage,
  trackLineageWithDedupe,
  validateTelemetryLineage,
  type CognitionReliabilityTier,
} from "@/lib/breadcrumbs/governance/telemetry-lineage-governance";
import { recordGraphOsEvent } from "@/lib/breadcrumbs/governance/graph-os-aggregation";

export type NavigationAnalyticsEvent =
  | "breadcrumb_rendered"
  | "breadcrumb_click"
  | "breadcrumb_trail_view"
  | "remediation_ladder_opened"
  | "remediation_step_open"
  | "remediation_abandoned"
  | "topic_cluster_nav"
  | "learner_trail_continue"
  | "interpretation_path_opened"
  | "glossary_navigation_opened"
  | "reasoning_chain_engaged"
  | "dashboard_to_remediation"
  | "tutoring_launch_origin"
  | "breadcrumb_abandon";

export type NavigationAnalyticsPayload = {
  event: NavigationAnalyticsEvent;
  breadcrumbIntent: BreadcrumbIntent;
  breadcrumbSurface?: BreadcrumbSurface;
  pathname: string;
  ontologyNamespace?: string;
  educationalIntent?: string;
  testing_model?: string;
  crumbIndex?: number;
  crumbLabel?: string;
  topicSlug?: string;
  competencyId?: string | null;
  remediationPathwayId?: string;
  canonicalRoot?: string;
  learnerStateReason?: string | null;
  graphDepth?: number;
  sourceSurface?: string;
  interpretationChainDepth?: number;
  glossaryTraversalContinuity?: boolean;
  ontologyRevision?: string;
  graphVersion?: string;
  graphTraversalDepth?: number;
  cognitionReliabilityTier?: CognitionReliabilityTier;
  semanticRouteKind?: string;
  /** Never include full BreadcrumbList JSON — labels only. */
  trailLabels?: string[];
  isLearnerRoute?: boolean;
};

const eventDedupe = new Set<string>();

function dedupeKey(p: NavigationAnalyticsPayload): string {
  return `${p.event}:${normalizeEducationalPathname(p.pathname)}:${p.breadcrumbSurface ?? ""}:${p.crumbIndex ?? ""}`;
}

export function resetNavigationAnalyticsDedupeForTests(): void {
  eventDedupe.clear();
}

export function trackNavigationEvent(payload: NavigationAnalyticsPayload): void {
  const lineage = enrichNavigationTelemetryLineage(payload, {
    testing_model: payload.testing_model,
    cognitionReliabilityTier: payload.cognitionReliabilityTier,
    ontologyNamespace: payload.ontologyNamespace,
  });
  const lineageIssues = validateTelemetryLineage(lineage);
  if (lineageIssues.length > 0 && process.env.NODE_ENV === "development") {
    console.warn("[telemetry-lineage]", lineageIssues);
  }
  const pathname = lineage.pathname;
  const isLearnerRoute = payload.isLearnerRoute ?? pathname.startsWith("/app");

  if (payload.event === "glossary_navigation_opened") {
    recordGraphOsEvent("glossary_traversal");
  }
  if (payload.event === "remediation_ladder_opened") {
    recordGraphOsEvent("remediation_start");
  }
  if (payload.event === "remediation_abandoned") {
    recordGraphOsEvent("remediation_abandon");
  }
  if (payload.event === "reasoning_chain_engaged") {
    recordGraphOsEvent("reasoning_chain", { depth: payload.graphDepth ?? payload.graphTraversalDepth });
  }
  if (payload.event === "dashboard_to_remediation") {
    recordGraphOsEvent("pathway_continue");
  }

  if (
    payload.event === "breadcrumb_rendered" ||
    payload.event === "breadcrumb_trail_view" ||
    payload.event === "glossary_navigation_opened"
  ) {
    const key = dedupeKey({ ...payload, pathname });
    if (eventDedupe.has(key) || !trackLineageWithDedupe(lineage)) return;
    eventDedupe.add(key);
    if (eventDedupe.size > 800) eventDedupe.clear();
  }

  if (payload.event === "remediation_abandoned" && payload.remediationPathwayId) {
    recordRemediationAbandonment(
      payload.remediationPathwayId,
      payload.graphTraversalDepth ?? payload.graphDepth ?? 0,
    );
  }
  if (payload.event === "breadcrumb_abandon") {
    recordGraphTraversalInterrupted(pathname, payload.graphTraversalDepth ?? 0);
    recordGraphOsEvent("continuity_interrupt");
  }

  safeServerLog("navigation", payload.event, {
    intent: lineage.breadcrumbIntent,
    surface: lineage.breadcrumbSurface?.slice(0, 40),
    pathname: pathname.slice(0, 200),
    semantic_route_kind: lineage.semanticRouteKind,
    ontology_namespace: lineage.ontologyNamespace?.slice(0, 80),
    ontology_revision: lineage.ontologyRevision,
    graph_version: lineage.graphVersion,
    educational_intent: lineage.educationalIntent?.slice(0, 40),
    testing_model: lineage.testing_model?.slice(0, 40),
    cognition_reliability: lineage.cognitionReliabilityTier,
    crumb_index: payload.crumbIndex != null ? String(payload.crumbIndex) : undefined,
    crumb_label: payload.crumbLabel?.slice(0, 80),
    topic_slug: payload.topicSlug?.slice(0, 80),
    competency_id: payload.competencyId?.slice(0, 64) ?? undefined,
    remediation_pathway_id: payload.remediationPathwayId?.slice(0, 120),
    canonical_root: payload.canonicalRoot?.slice(0, 64),
    learner_state_reason: payload.learnerStateReason?.slice(0, 80) ?? undefined,
    graph_depth:
      lineage.graphTraversalDepth != null
        ? String(lineage.graphTraversalDepth)
        : payload.graphDepth != null
          ? String(payload.graphDepth)
          : undefined,
    source_surface: payload.sourceSurface?.slice(0, 40),
    interpretation_chain_depth:
      payload.interpretationChainDepth != null ? String(payload.interpretationChainDepth) : undefined,
    glossary_continuity: payload.glossaryTraversalContinuity ? "1" : undefined,
    trail_depth: payload.trailLabels?.length != null ? String(payload.trailLabels.length) : undefined,
    learner_route: isLearnerRoute ? "1" : "0",
    graph_continuity_key: lineage.graphContinuityKey?.slice(0, 120),
  });
}

export function trackNavigationWithPsychometricContext(
  payload: NavigationAnalyticsPayload,
  psychometric?: { testingModel?: string; reliabilityTier?: CognitionReliabilityTier },
): void {
  trackNavigationEvent({
    ...payload,
    testing_model: psychometric?.testingModel ?? payload.testing_model,
    cognitionReliabilityTier: psychometric?.reliabilityTier ?? payload.cognitionReliabilityTier,
  });
}

export { recordNormalizationFallbackTriggered };
