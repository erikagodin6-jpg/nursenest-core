/**
 * Glossary + clinical interpretation semantic integration with educational graph.
 */

import type { ClinicalInterpretationEntry } from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import { clinicalInterpretationGuidePath } from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import type { BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";
import {
  clinicalInterpretationGuideBreadcrumbs,
  clinicalInterpretationHubBreadcrumbs,
} from "@/lib/breadcrumbs/clinical-interpretation-breadcrumbs";
import { glossaryTermBreadcrumbs } from "@/lib/breadcrumbs/glossary-breadcrumbs";
import { orchestrateBreadcrumbGraph, remediationPathwayId } from "@/lib/breadcrumbs/breadcrumb-graph-convergence";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import { getBreadcrumbRoot } from "@/lib/breadcrumbs/breadcrumb-root-registry";
import { normalizeGraphTopicSlug } from "@/lib/educational-graph/graph-href-builders";

const GLOSSARY_HUB = "/nursing-glossary";

export type GlossaryTermSemanticContext = {
  termSlug: string;
  termLabel: string;
  topicSlug: string;
  pathway: ExamPathwayDefinition;
};

export type GlossaryGraphSemanticContext = Pick<
  GlossaryTermSemanticContext,
  "termSlug" | "termLabel" | "topicSlug"
> & {
  pathway?: ExamPathwayDefinition;
};

export function resolveGlossaryTermBreadcrumbs(ctx: GlossaryTermSemanticContext): BreadcrumbResolution {
  const examPath = buildExamPathwayPath(ctx.pathway);
  const examLabel = pathwayRegionAwareExamName(ctx.pathway);
  return glossaryTermBreadcrumbs(examLabel, examPath, ctx.termLabel, `${GLOSSARY_HUB}/${ctx.termSlug}`);
}

export function resolveInterpretationGuideBreadcrumbs(entry: ClinicalInterpretationEntry): BreadcrumbResolution {
  return clinicalInterpretationGuideBreadcrumbs({
    category: entry.category,
    guideTitle: entry.h1,
    guideSlug: entry.slug,
  });
}

export function interpretationHubBreadcrumbs(): BreadcrumbResolution {
  return clinicalInterpretationHubBreadcrumbs();
}

/** Links interpretation guide → competency graph for remediation (no duplicate ladders). */
export function interpretationGraphLinkage(entry: ClinicalInterpretationEntry, pathwayId: string | null) {
  const topicSlug =
    entry.related.topicSlugs[0] ?? entry.slug.replace(/-interpretation$/, "").replace(/-/g, "-");
  const traversal = orchestrateBreadcrumbGraph({
    topicSlug,
    topicLabel: entry.h1,
    pathwayId,
    sourceSurface: "topic_hub_public",
    currentLabel: entry.h1,
    currentHref: clinicalInterpretationGuidePath(entry.slug),
  });
  return {
    traversal,
    remediationPathwayId: remediationPathwayId(pathwayId, topicSlug),
    glossaryRoot: getBreadcrumbRoot("glossary"),
    interpretationRoot: getBreadcrumbRoot("clinical_interpretation"),
  };
}

/** Prevent glossary term trails from re-entering glossary as middle crumb. */
export function auditGlossaryTrailLabels(labels: readonly string[]): string | null {
  const lower = labels.map((l) => l.trim().toLowerCase());
  const glossaryHits = lower.filter((l) => l === "glossary").length;
  if (glossaryHits > 1) return "glossary_recursion";
  return null;
}

export type GraphNativeEntityContext = {
  termSlug?: string;
  guideSlug?: string;
  topicSlug: string;
  competencyId: string | null;
  ontologyNamespace: string;
  remediationPathwayId: string;
  canonicalHref: string;
  measurementSemantics?: string | null;
};

export function buildGlossaryGraphEntity(
  ctx: GlossaryGraphSemanticContext,
  pathwayId: string | null,
): GraphNativeEntityContext {
  const traversal = orchestrateBreadcrumbGraph({
    topicSlug: ctx.topicSlug,
    topicLabel: ctx.termLabel,
    pathwayId,
    sourceSurface: "topic_hub_public",
    currentLabel: ctx.termLabel,
    currentHref: `${GLOSSARY_HUB}/${ctx.termSlug}`,
  });
  const glossaryRoot = getBreadcrumbRoot("glossary");
  return {
    termSlug: ctx.termSlug,
    topicSlug: ctx.topicSlug,
    competencyId: traversal.competencyId,
    ontologyNamespace: glossaryRoot?.ontologyNamespace ?? "reference.glossary",
    remediationPathwayId: remediationPathwayId(pathwayId, ctx.topicSlug),
    canonicalHref: `${GLOSSARY_HUB}/${ctx.termSlug}`,
    measurementSemantics: traversal.competencyLabel,
  };
}

export function auditInterpretationHierarchy(labels: readonly string[]): string | null {
  const lower = labels.map((l) => l.trim().toLowerCase());
  if (!lower.includes("clinical interpretation")) return null;
  const idx = lower.indexOf("clinical interpretation");
  const after = lower.slice(idx + 1);
  if (after.includes("clinical interpretation")) return "duplicate_interpretation_hub";
  return null;
}

export function topicSlugForGlossaryTerm(termSlug: string): string {
  return normalizeGraphTopicSlug(termSlug) ?? termSlug;
}
