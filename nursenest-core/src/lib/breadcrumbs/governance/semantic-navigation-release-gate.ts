/**
 * Semantic navigation release gate — static checks before Playwright runtime validation.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { computeSemanticRouteCoverage } from "@/lib/breadcrumbs/governance/semantic-route-coverage";
import { auditGraphSubstrateIntegrity } from "@/lib/breadcrumbs/governance/graph-substrate-integrity";
import { detectOntologyNamespaceConflicts } from "@/lib/breadcrumbs/breadcrumb-root-registry";
import { ACADEMY_PATHNAME_REGISTRY } from "@/lib/breadcrumbs/pathname-normalization";

export type SemanticReleaseGateFailure = {
  code: string;
  detail: string;
};

export type SemanticReleaseGateReport = {
  ok: boolean;
  failures: SemanticReleaseGateFailure[];
  coverage: ReturnType<typeof computeSemanticRouteCoverage>;
  substrate: ReturnType<typeof auditGraphSubstrateIntegrity>;
  ontologyConflicts: string[];
  artifactDir?: string;
};

export function runStaticSemanticReleaseGate(repoRoot = process.cwd()): SemanticReleaseGateReport {
  const failures: SemanticReleaseGateFailure[] = [];
  const coverage = computeSemanticRouteCoverage(repoRoot);
  const substrate = auditGraphSubstrateIntegrity(repoRoot);
  const ontologyConflicts = detectOntologyNamespaceConflicts();

  if (coverage.semanticCoverageScore < 85) {
    failures.push({
      code: "semantic_coverage_low",
      detail: `score=${coverage.semanticCoverageScore} issues=${coverage.issues.slice(0, 8).join(";")}`,
    });
  }
  for (const issue of coverage.issues) {
    if (issue.startsWith("pathname_missing")) {
      failures.push({ code: "pathname_normalization", detail: issue });
    }
    if (issue.startsWith("ontology_conflict") || issue.startsWith("glossary_orphan")) {
      failures.push({ code: issue.split(":")[0] ?? "coverage", detail: issue });
    }
  }

  for (const v of substrate.parallelRegistryViolations) {
    failures.push({ code: "parallel_navigation_registry", detail: v });
  }
  for (const v of substrate.remediationDivergence) {
    failures.push({ code: "remediation_traversal_divergence", detail: v });
  }

  for (const c of ontologyConflicts) {
    failures.push({ code: "ontology_namespace_conflict", detail: c });
  }

  const registrySize = Object.keys(ACADEMY_PATHNAME_REGISTRY).length;
  if (registrySize < 10) {
    failures.push({ code: "academy_registry_incomplete", detail: `count=${registrySize}` });
  }

  return {
    ok: failures.length === 0,
    failures,
    coverage,
    substrate,
    ontologyConflicts,
  };
}

export function writeSemanticReleaseGateArtifacts(
  report: SemanticReleaseGateReport,
  outDir = join(process.cwd(), "test-results/semantic-navigation-gate"),
): string {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "ontology-conflicts.json"), JSON.stringify(report.ontologyConflicts, null, 2));
  writeFileSync(join(outDir, "semantic-coverage.json"), JSON.stringify(report.coverage, null, 2));
  writeFileSync(join(outDir, "substrate-integrity.json"), JSON.stringify(report.substrate, null, 2));
  writeFileSync(
    join(outDir, "structured-data-governance-snapshot.json"),
    JSON.stringify({ failures: report.failures, ok: report.ok }, null, 2),
  );
  report.artifactDir = outDir;
  return outDir;
}

/** CLI entry: `node --import tsx src/lib/breadcrumbs/governance/semantic-navigation-release-gate.ts` */
function main(): void {
  const report = runStaticSemanticReleaseGate();
  if (process.env.SEMANTIC_GATE_WRITE_ARTIFACTS === "1") {
    writeSemanticReleaseGateArtifacts(report);
  }
  if (!report.ok) {
    console.error("[semantic-navigation-release-gate] FAILED");
    for (const f of report.failures) {
      console.error(`  ${f.code}: ${f.detail}`);
    }
    process.exit(1);
  }
  console.error(
    `[semantic-navigation-release-gate] OK coverage=${report.coverage.semanticCoverageScore} academy=${report.coverage.governedAcademyPageCount}`,
  );
}

const invokedDirectly =
  typeof process.argv[1] === "string" &&
  (process.argv[1].endsWith("semantic-navigation-release-gate.ts") ||
    process.argv[1].endsWith("semantic-navigation-release-gate.mjs"));
if (invokedDirectly) main();
