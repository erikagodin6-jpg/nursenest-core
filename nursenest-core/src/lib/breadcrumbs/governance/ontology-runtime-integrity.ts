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

export type OntologyIntegrityTier = "healthy" | "degraded" | "conflicting" | "orphaned";

export type OntologyIntegrityResult = {
  tier: OntologyIntegrityTier;
  ontologyRevision: string;
  issues: string[];
  repairHints: string[];
};

export function validateOntologyRuntimeIntegrity(args: {
  pathname: string;
  ontologyNamespace?: string;
  canonicalRootId?: string;
  trailLabels?: readonly string[];
  topicSlug?: string;
  glossaryTermSlug?: string;
}): OntologyIntegrityResult {
  const issues: string[] = [];
  const repairHints: string[] = [];
  const pathname = normalizeEducationalPathname(args.pathname);

  const conflicts = detectOntologyNamespaceConflicts();
  if (conflicts.length) {
    issues.push(...conflicts.map((c) => `namespace_collision:${c}`));
    repairHints.push("dedupe telemetryNamespace in breadcrumb-root-registry");
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
    }
    const interpretationIssue = auditInterpretationHierarchy(args.trailLabels);
    if (interpretationIssue) issues.push(interpretationIssue);
  }

  if (args.topicSlug) {
    try {
      const traversal = orchestrateBreadcrumbGraph({
        topicSlug: args.topicSlug,
        sourceSurface: "app_remediation",
        currentLabel: args.topicSlug,
      });
      if (traversal.steps.length === 0) {
        issues.push("remediation_graph_disconnect");
        repairHints.push("verify competency mapping for topic in educational-graph-orchestrator");
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

  if (pathname.startsWith("/app/account/focus-areas/") && pathname.split("/").length < 5) {
    issues.push("invalid_focus_area_link");
  }

  const seen = new Set<string>();
  if (seen.has(pathname)) issues.push("duplicate_canonical_pathname");
  seen.add(pathname);

  let tier: OntologyIntegrityTier = "healthy";
  if (issues.some((i) => i.startsWith("namespace_collision") || i.startsWith("namespace_mismatch"))) {
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
