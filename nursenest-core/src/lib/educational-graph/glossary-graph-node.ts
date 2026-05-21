/**
 * Glossary as first-class graph traversal node — native continuity, not SEO-only linkage.
 */

import { buildGlossaryGraphEntity } from "@/lib/breadcrumbs/breadcrumb-semantic-integration";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import type { GlossaryTermGraphContext } from "@/lib/breadcrumbs/breadcrumb-semantic-integration";
import type { EducationalGraphTraversal } from "@/lib/educational-graph/graph-step-contract";
import { buildReasoningChainNavigation } from "@/lib/breadcrumbs/reasoning-chain-navigation";

export type GlossaryGraphNode = {
  nodeId: string;
  termSlug: string;
  termLabel: string;
  topicSlug: string;
  canonicalHref: string;
  competencyId: string | null;
  remediationPathwayId: string;
  ontologyNamespace: string;
  traversal: EducationalGraphTraversal;
  reasoningDepth: number;
  telemetryNamespace: string;
};

export function buildGlossaryGraphNode(
  ctx: GlossaryTermGraphContext,
  pathwayId: string | null,
): GlossaryGraphNode {
  const entity = buildGlossaryGraphEntity(ctx, pathwayId);
  const traversal = orchestrateEducationalGraph({
    topicSlug: ctx.topicSlug,
    topicLabel: ctx.termLabel,
    pathwayId,
    sourceSurface: "glossary_traversal",
  });
  const reasoning = buildReasoningChainNavigation({
    topicSlug: ctx.topicSlug,
    topicLabel: ctx.termLabel,
    pathwayId,
    pathname: entity.canonicalHref,
    sourceSurface: "glossary_traversal",
  });

  return {
    nodeId: `glossary:${ctx.termSlug}`,
    termSlug: ctx.termSlug,
    termLabel: ctx.termLabel,
    topicSlug: ctx.topicSlug,
    canonicalHref: entity.canonicalHref,
    competencyId: entity.competencyId,
    remediationPathwayId: entity.remediationPathwayId,
    ontologyNamespace: entity.ontologyNamespace,
    traversal,
    reasoningDepth: reasoning.depth,
    telemetryNamespace: "reference.glossary",
  };
}

export function validateGlossaryGraphNode(node: GlossaryGraphNode): string | null {
  if (!node.termSlug?.trim()) return "glossary_orphan:empty_slug";
  if (!node.topicSlug?.trim()) return "glossary_orphan:no_topic";
  if (node.traversal.steps.length === 0) return "glossary_disconnect:no_steps";
  return null;
}
