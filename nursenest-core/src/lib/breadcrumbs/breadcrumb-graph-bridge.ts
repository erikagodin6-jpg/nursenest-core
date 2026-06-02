/**
 * Educational graph ↔ breadcrumb bridge — shared ontology for traversal and trails.
 */

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";
import { pathwayTopicClusterEducationBreadcrumbs } from "@/lib/breadcrumbs/pathway-education-breadcrumbs";
import { buildCompetencyNavigationFrame } from "@/lib/breadcrumbs/competency-navigation";
import { applyGovernedBreadcrumbResolution } from "@/lib/breadcrumbs/governed-breadcrumb-resolution";
import { resolveSurfaceFromResolverKind } from "@/lib/breadcrumbs/breadcrumb-surface";
import { pathwayExamRoot } from "@/lib/breadcrumbs/breadcrumb-root-registry";
import type { EducationalNavigationTrail } from "@/lib/breadcrumbs/navigation-ontology";
import { validateEducationFirstTrail } from "@/lib/breadcrumbs/navigation-ontology";
import { orchestrateBreadcrumbGraph } from "@/lib/breadcrumbs/breadcrumb-graph-convergence";
import type { GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";

export type BreadcrumbGraphBridgeInput = {
  pathway: ExamPathwayDefinition;
  topicSlug: string;
  topicLabel: string;
  sourceSurface: GraphSourceSurface;
  resolverKind?: "pathway-topic-cluster" | "pathway-lesson-detail";
};

/**
 * Resolves breadcrumbs for a topic hub using the same competency + topic IDs as the educational graph.
 */
export function breadcrumbResolutionFromEducationalGraph(
  input: BreadcrumbGraphBridgeInput,
): BreadcrumbResolution {
  const kind = input.resolverKind ?? "pathway-topic-cluster";
  const surface = resolveSurfaceFromResolverKind(kind);
  const competency = buildCompetencyNavigationFrame({
    topicSlug: input.topicSlug,
    pathwayId: input.pathway.id,
  });

  const raw = pathwayTopicClusterEducationBreadcrumbs(
    input.pathway,
    input.topicSlug,
    input.topicLabel,
  );

  const governed = applyGovernedBreadcrumbResolution({
    resolution: raw,
    surface,
    pathname: `/graph/${input.pathway.id}/${input.topicSlug}`,
    canonicalRootId: "lessons",
    competencyId: competency?.competencyId,
    topicSlug: input.topicSlug,
  });

  return governed;
}

/** Builds parallel graph traversal for remediation UI (same topic/competency keys as breadcrumbs). */
export function educationalGraphStepsForTopic(input: BreadcrumbGraphBridgeInput) {
  return orchestrateBreadcrumbGraph({
    topicSlug: input.topicSlug,
    topicLabel: input.topicLabel,
    pathwayId: input.pathway.id,
    sourceSurface: input.sourceSurface,
    currentLabel: input.topicLabel,
  });
}

export function educationalTrailFromResolution(
  resolution: BreadcrumbResolution,
  pathway: ExamPathwayDefinition,
): EducationalNavigationTrail {
  const examRoot = pathwayExamRoot(pathway);
  return {
    intent: resolution.intent ?? "education",
    educationFirst: true,
    nodes: resolution.crumbs.map((c, i) => ({
      layer: i === 0 ? "site" : i === 1 ? "pathway" : i === resolution.crumbs.length - 1 ? "topic_cluster" : "competency",
      label: c.name,
      href: c.href,
    })),
  };
}

export function validateGraphAlignedTrail(
  resolution: BreadcrumbResolution,
  pathway: ExamPathwayDefinition,
): { ok: boolean; issues: string[] } {
  const trail = educationalTrailFromResolution(resolution, pathway);
  return validateEducationFirstTrail(trail);
}
