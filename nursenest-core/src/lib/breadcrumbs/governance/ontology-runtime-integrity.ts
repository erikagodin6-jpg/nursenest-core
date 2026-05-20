/**
 * Runtime ontology integrity — degrade safely, never crash presentation adapters.
 */

import { detectOntologyNamespaceConflicts, getBreadcrumbRoot } from "@/lib/breadcrumbs/breadcrumb-root-registry";
import { normalizeEducationalPathname } from "@/lib/breadcrumbs/pathname-normalization";
import { auditGlossaryTrailLabels, auditInterpretationHierarchy } from "@/lib/breadcrumbs/breadcrumb-semantic-integration";
import { orchestrateBreadcrumbGraph } from "@/lib/breadcrumbs/breadcrumb-graph-convergence";
import {
  recordGraphObservability,
  recordGlossaryOrphan,
  recordReasoningChainInvalid,
} from "@/lib/breadcrumbs/graph-navigation-observability";
import { BREADCRUMB_ONTOLOGY_REVISION } from "@/lib/breadcrumbs/governance/graph-os-constants";
import {
  validateHydrationLineageParity,
  resolvePsychometricLineageStamp,
} from "@/lib/breadcrumbs/governance/psychometric-lineage-validation";
import { assertReplayLineageConsistent } from "@/lib/breadcrumbs/governance/graph-telemetry-replay";
import type { GraphTelemetryReplaySnapshot } from "@/lib/breadcrumbs/governance/graph-telemetry-replay";
import { validateGlossaryGraphNode, buildGlossaryGraphNode } from "@/lib/educational-graph/glossary-graph-node";
import type { GlossaryTermSemanticContext } from "@/lib/breadcrumbs/breadcrumb-semantic-integration";

export type OntologyIntegrityTier =
  | "healthy"
  | "degraded"
  | "conflicting"
  | "orphaned"
  | "replay-divergent";

export type OntologyIntegrityResult = {
  tier: OntologyIntegrityTier;
  ontologyRevision: string;
  issues: string[];
  repairHints: string[];
};

export function validateOntologyMigrationReplay(args: {
  priorRevision: string;
  currentRevision: string;
  pathname: string;
}): string[] {
  const issues: string[] = [];
  if (args.priorRevision && args.currentRevision && args.priorRevision !== args.currentRevision) {
    issues.push(`ontology_migration:${args.priorRevision}→${args.currentRevision}`);
    recordGraphObservability({
      metric: "ontology_namespace.conflict",
      pathname: args.pathname,
      detail: `migration_replay ${args.priorRevision}→${args.currentRevision}`,
    });
  }
  return issues;
}

export function salvageRemediationChain(topicSlug: string, pathname: string): string[] {
  const repairHints: string[] = [];
  try {
    const traversal = orchestrateBreadcrumbGraph({
      topicSlug,
      sourceSurface: "app_remediation",
      currentLabel: topicSlug,
    });
    if (traversal.steps.length === 0) {
      repairHints.push("remediation_salvage:re-orchestrate with pathwayId");
    } else {
      repairHints.push(`remediation_salvage:${traversal.steps.length}_steps`);
    }
  } catch {
    repairHints.push("remediation_salvage:graph_orchestration_error");
    recordGraphObservability({
      metric: "graph_traversal.interrupted",
      pathname,
      detail: "remediation_chain_salvage_failed",
    });
  }
  return repairHints;
}

export function recoverGlossaryLineage(
  ctx: GlossaryTermSemanticContext,
  pathwayId: string | null,
): string | null {
  const node = buildGlossaryGraphNode(ctx, pathwayId);
  return validateGlossaryGraphNode(node);
}

export function validateReplayDivergence(snapshot: GraphTelemetryReplaySnapshot): string[] {
  return assertReplayLineageConsistent(snapshot);
}

export function validateOntologyRuntimeIntegrity(args: {
  pathname: string;
  ontologyNamespace?: string;
  canonicalRootId?: string;
  trailLabels?: readonly string[];
  topicSlug?: string;
  glossaryTermSlug?: string;
  pathwayId?: string | null;
  replaySnapshot?: GraphTelemetryReplaySnapshot;
  priorOntologyRevision?: string;
}): OntologyIntegrityResult {
  const issues: string[] = [];
  const repairHints: string[] = [];
  const pathname = normalizeEducationalPathname(args.pathname);

  const conflicts = detectOntologyNamespaceConflicts();
  if (conflicts.length) {
    issues.push(...conflicts.map((c) => `namespace_collision:${c}`));
    repairHints.push("dedupe telemetryNamespace in breadcrumb-root-registry");
  }

  if (args.priorOntologyRevision) {
    issues.push(
      ...validateOntologyMigrationReplay({
        priorRevision: args.priorOntologyRevision,
        currentRevision: BREADCRUMB_ONTOLOGY_REVISION,
        pathname,
      }),
    );
  }

  if (args.canonicalRootId) {
    const root = getBreadcrumbRoot(args.canonicalRootId);
    if (!root) {
      issues.push(`unknown_root:${args.canonicalRootId}`);
    } else if (root.deprecated) {
      issues.push(`deprecated_root:${args.canonicalRootId}`);
      repairHints.push(`migrate trail off deprecated root ${args.canonicalRootId}`);
    } else if (args.ontologyNamespace && args.ontologyNamespace !== root.ontologyNamespace) {
      issues.push(`namespace_mismatch:${args.ontologyNamespace}!=${root.ontologyNamespace}`);
      recordGraphObservability({
        metric: "ontology_namespace.conflict",
        pathname,
        ontologyNamespace: args.ontologyNamespace,
        detail: `expected=${root.ontologyNamespace}`,
      });
    }
  }

  if (args.trailLabels?.length) {
    const glossaryIssue = auditGlossaryTrailLabels(args.trailLabels);
    if (glossaryIssue) {
      issues.push(glossaryIssue);
      if (args.glossaryTermSlug) recordGlossaryOrphan(args.glossaryTermSlug);
      if (args.topicSlug && args.glossaryTermSlug) {
        const recovery = recoverGlossaryLineage(
          {
            termSlug: args.glossaryTermSlug,
            termLabel: args.glossaryTermSlug,
            topicSlug: args.topicSlug,
          },
          args.pathwayId ?? null,
        );
        if (recovery) repairHints.push(`glossary_recovery:${recovery}`);
        else repairHints.push("glossary_recovery:node_valid");
      }
    }
    const interpretationIssue = auditInterpretationHierarchy(args.trailLabels);
    if (interpretationIssue) issues.push(interpretationIssue);
  }

  if (args.topicSlug) {
    repairHints.push(...salvageRemediationChain(args.topicSlug, pathname));
    try {
      const traversal = orchestrateBreadcrumbGraph({
        topicSlug: args.topicSlug,
        sourceSurface: "app_remediation",
        currentLabel: args.topicSlug,
      });
      if (traversal.steps.length === 0) {
        issues.push("remediation_graph_disconnect");
      }
      if ((traversal.reasoningChain?.length ?? 0) < 1) {
        issues.push("reasoning_chain_empty");
        recordReasoningChainInvalid(pathname, "empty_chain");
      }
    } catch {
      issues.push("graph_orchestration_error");
      repairHints.push("check orchestrateEducationalGraph inputs");
    }
  }

  if (args.replaySnapshot) {
    const replayIssues = validateReplayDivergence(args.replaySnapshot);
    if (replayIssues.length) {
      issues.push(...replayIssues.map((i) => `replay_divergent:${i}`));
      repairHints.push("replay_hydration_parity:align SSR and client stamps");
    }
  }

  if (args.pathwayId) {
    const ssr = resolvePsychometricLineageStamp({ pathwayId: args.pathwayId });
    const hydrated = resolvePsychometricLineageStamp({ pathwayId: args.pathwayId });
    const parity = validateHydrationLineageParity({ ssrStamp: ssr, hydratedStamp: hydrated, pathname });
    if (parity.length) {
      issues.push(...parity.map((p) => `hydration_lineage:${p.code}`));
    }
  }

  if (pathname.startsWith("/app/account/focus-areas/") && pathname.split("/").length < 5) {
    issues.push("invalid_focus_area_link");
  }

  let tier: OntologyIntegrityTier = "healthy";
  if (issues.some((i) => i.startsWith("replay_divergent") || i.startsWith("hydration_lineage"))) {
    tier = "replay-divergent";
  } else if (issues.some((i) => i.startsWith("namespace_collision") || i.startsWith("namespace_mismatch"))) {
    tier = "conflicting";
  } else if (issues.some((i) => i.includes("orphan") || i.includes("disconnect"))) {
    tier = "orphaned";
  } else if (issues.length > 0) {
    tier = "degraded";
  }

  return {
    tier,
    ontologyRevision: BREADCRUMB_ONTOLOGY_REVISION,
    issues,
    repairHints,
  };
}

/** Safe wrapper for UI adapters — logs and returns tier without throwing. */
export function guardOntologyIntegrityForSurface(
  args: Parameters<typeof validateOntologyRuntimeIntegrity>[0],
): OntologyIntegrityTier {
  const result = validateOntologyRuntimeIntegrity(args);
  if (result.tier !== "healthy" && process.env.NODE_ENV === "development") {
    console.warn("[ontology-integrity]", result.tier, result.issues);
  }
  return result.tier;
}
