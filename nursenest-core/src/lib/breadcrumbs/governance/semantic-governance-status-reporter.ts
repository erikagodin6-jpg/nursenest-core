/**
 * Semantic governance status — CI/dashboard aggregates for org-level enforcement.
 */

import { computeSemanticRouteCoverage } from "@/lib/breadcrumbs/governance/semantic-route-coverage";
import { runStaticSemanticReleaseGate } from "@/lib/breadcrumbs/governance/semantic-navigation-release-gate";
import { auditGraphSubstrateIntegrity } from "@/lib/breadcrumbs/governance/graph-substrate-integrity";
import { detectOntologyNamespaceConflicts } from "@/lib/breadcrumbs/breadcrumb-root-registry";
import { getEducatorGraphSummary } from "@/lib/breadcrumbs/governance/graph-os-aggregation";
import { buildEducatorGraphInsights } from "@/lib/breadcrumbs/governance/educator-graph-insights";

export type SemanticGovernanceStatus = {
  ok: boolean;
  semanticCoverageScore: number;
  ontologyConflictCount: number;
  orphanedRouteCount: number;
  hydrationParityFailures: number;
  telemetryLineageViolations: number;
  graphContinuityInterruptions: number;
  substrateOk: boolean;
  releaseGateFailures: number;
  educatorInsights: ReturnType<typeof buildEducatorGraphInsights>;
  generatedAt: string;
};

export function reportSemanticGovernanceStatus(repoRoot?: string): SemanticGovernanceStatus {
  const coverage = computeSemanticRouteCoverage(repoRoot);
  const gate = runStaticSemanticReleaseGate(repoRoot);
  const substrate = auditGraphSubstrateIntegrity(repoRoot);
  const ontologyConflicts = detectOntologyNamespaceConflicts();
  const educator = getEducatorGraphSummary();
  const insights = buildEducatorGraphInsights(educator, coverage);

  const hydrationParityFailures = coverage.issues.filter((i) =>
    i.includes("pathname_missing"),
  ).length;
  const telemetryLineageViolations = gate.failures.filter((f) =>
    f.code.includes("lineage") || f.code.includes("ontology"),
  ).length;

  const ok =
    gate.ok &&
    substrate.ok &&
    ontologyConflicts.length === 0 &&
    coverage.semanticCoverageScore >= 85;

  return {
    ok,
    semanticCoverageScore: coverage.semanticCoverageScore,
    ontologyConflictCount: coverage.ontologyConflictCount + ontologyConflicts.length,
    orphanedRouteCount: coverage.orphanedRouteCount,
    hydrationParityFailures,
    telemetryLineageViolations,
    graphContinuityInterruptions: Math.round(educator.continuityInterruptionRate * 100),
    substrateOk: substrate.ok,
    releaseGateFailures: gate.failures.length,
    educatorInsights: insights,
    generatedAt: new Date().toISOString(),
  };
}
