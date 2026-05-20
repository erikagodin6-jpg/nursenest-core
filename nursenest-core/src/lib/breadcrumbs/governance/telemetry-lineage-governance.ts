/**
 * Cross-system telemetry lineage — navigation ↔ cognition ↔ remediation correlation.
 */

import type { NavigationAnalyticsPayload } from "@/lib/breadcrumbs/navigation-analytics";
import { normalizeEducationalPathname } from "@/lib/breadcrumbs/pathname-normalization";
import { resolvePsychometricLineageStamp } from "@/lib/breadcrumbs/governance/psychometric-lineage-validation";
import type { BreadcrumbSurface } from "@/lib/breadcrumbs/breadcrumb-surface";

export type SemanticRouteKind =
  | "academy"
  | "glossary"
  | "interpretation"
  | "learner_focus"
  | "learner_remediation"
  | "pathway_lesson"
  | "unknown";

export type CognitionReliabilityTier = "high" | "medium" | "low" | "unknown";

export type NavigationTelemetryLineage = {
  pathname: string;
  semanticRouteKind: SemanticRouteKind;
  ontologyNamespace: string;
  ontologyRevision: string;
  graphVersion: string;
  educationalIntent?: string;
  testing_model?: string;
  remediationPathwayIds?: readonly string[];
  graphTraversalDepth?: number;
  cognitionReliabilityTier: CognitionReliabilityTier;
  graphContinuityKey?: string;
};

const lineageDedupe = new Set<string>();

export function inferSemanticRouteKind(pathname: string): SemanticRouteKind {
  const p = normalizeEducationalPathname(pathname);
  if (p.startsWith("/app/account/focus-areas")) return "learner_focus";
  if (p.startsWith("/app")) return "learner_remediation";
  if (p.startsWith("/nursing-glossary")) return "glossary";
  if (p.startsWith("/clinical-interpretation")) return "interpretation";
  if (p.includes("/lessons/")) return "pathway_lesson";
  if (
    p.startsWith("/ecg") ||
    p.includes("hemodynamic") ||
    p.includes("telemetry") ||
    p.startsWith("/clinical-modules") ||
    p.startsWith("/labs-interpretation")
  ) {
    return "academy";
  }
  return "unknown";
}

export function enrichNavigationTelemetryLineage(
  payload: NavigationAnalyticsPayload,
  extras?: {
    testing_model?: string;
    cognitionReliabilityTier?: CognitionReliabilityTier;
    remediationPathwayIds?: readonly string[];
    ontologyNamespace?: string;
    breadcrumbSurface?: BreadcrumbSurface;
    pathwayId?: string | null;
  },
): NavigationTelemetryLineage & NavigationAnalyticsPayload {
  const pathname = normalizeEducationalPathname(payload.pathname);
  const semanticRouteKind = inferSemanticRouteKind(pathname);
  const ontologyNamespace = extras?.ontologyNamespace ?? payload.ontologyNamespace ?? semanticRouteKind;
  const graphTraversalDepth = payload.graphDepth;
  const graphContinuityKey = [
    payload.remediationPathwayId ?? "",
    payload.competencyId ?? "",
    pathname,
  ].join(":");
  const psych = resolvePsychometricLineageStamp({
    pathwayId: extras?.pathwayId ?? payload.remediationPathwayId ?? null,
    educationalIntent: payload.educationalIntent,
    cognitionReliabilityTier: extras?.cognitionReliabilityTier ?? payload.cognitionReliabilityTier,
  });

  return {
    ...payload,
    pathname,
    semanticRouteKind,
    ontologyNamespace,
    ontologyRevision: payload.ontologyRevision ?? psych.ontologyRevision,
    graphVersion: payload.graphVersion ?? psych.graphVersion,
    educationalIntent: payload.educationalIntent ?? psych.educationalIntent,
    testing_model: extras?.testing_model ?? payload.testing_model ?? psych.testing_model,
    remediationPathwayIds: extras?.remediationPathwayIds,
    graphTraversalDepth,
    cognitionReliabilityTier:
      extras?.cognitionReliabilityTier ?? payload.cognitionReliabilityTier ?? psych.cognitionReliabilityTier,
    graphContinuityKey,
  };
}

export function validateTelemetryLineage(lineage: NavigationTelemetryLineage): string[] {
  const issues: string[] = [];
  if (!lineage.pathname.startsWith("/")) issues.push("invalid_pathname");
  if (!lineage.ontologyNamespace?.trim()) issues.push("missing_ontology_namespace");
  if (!lineage.graphVersion) issues.push("missing_graph_version");
  if (lineage.pathname.startsWith("/app") && lineage.semanticRouteKind === "academy") {
    issues.push("learner_marked_as_academy");
  }
  if (
    lineage.graphTraversalDepth != null &&
    lineage.graphTraversalDepth > 12
  ) {
    issues.push("graph_depth_overflow");
  }
  return issues;
}

export function trackLineageWithDedupe(lineage: NavigationTelemetryLineage): boolean {
  const key = `${lineage.pathname}:${lineage.semanticRouteKind}:${lineage.graphVersion}`;
  if (lineageDedupe.has(key)) return false;
  lineageDedupe.add(key);
  if (lineageDedupe.size > 1000) lineageDedupe.clear();
  return true;
}

export function resetTelemetryLineageDedupeForTests(): void {
  lineageDedupe.clear();
}

/** Correlate navigation event with cognition/remediation IDs (integrity check). */
export function assertNavigationCognitionCorrelation(args: {
  remediationPathwayId?: string;
  competencyId?: string | null;
  topicSlug?: string;
}): string | null {
  if (args.remediationPathwayId && args.topicSlug) {
    const normalized = args.topicSlug.toLowerCase().replace(/\s+/g, "-");
    if (!args.remediationPathwayId.toLowerCase().includes(normalized.split("-")[0] ?? "")) {
      return "remediation_pathway_topic_mismatch";
    }
  }
  if (args.remediationPathwayId && !args.competencyId && args.remediationPathwayId.includes(":")) {
    return null;
  }
  return null;
}
