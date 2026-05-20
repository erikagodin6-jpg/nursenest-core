/**
 * Graph substrate integrity — validates orchestration authorities stay unified.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { EDUCATIONAL_GRAPH_VERSION } from "@/lib/breadcrumbs/governance/graph-os-constants";

export type GraphSubstrateIntegrityReport = {
  graphVersion: string;
  ok: boolean;
  parallelRegistryViolations: string[];
  remediationDivergence: string[];
};

const FORBIDDEN_PARALLEL_PATTERNS = [
  { re: /function\s+buildLocalBreadcrumbHierarchy/, label: "local breadcrumb hierarchy builder" },
  { re: /const\s+glossaryHierarchy\s*=/, label: "local glossary hierarchy" },
  { re: /remediationLadderFromRouteHeuristic/, label: "route-heuristic remediation ladder" },
];

const REMEDIATION_NAV = "src/lib/breadcrumbs/remediation-navigation.ts";

export function auditGraphSubstrateIntegrity(repoRoot = process.cwd()): GraphSubstrateIntegrityReport {
  const parallelRegistryViolations: string[] = [];
  const remediationDivergence: string[] = [];

  const remNav = readFileSync(join(repoRoot, REMEDIATION_NAV), "utf8");
  if (!remNav.includes("orchestrateBreadcrumbGraph")) {
    remediationDivergence.push("remediation-navigation must use orchestrateBreadcrumbGraph");
  }
  if (remNav.includes("buildRnRemediationGraphSteps") && !remNav.includes("orchestrateEducationalGraph")) {
    remediationDivergence.push("remediation-navigation must not bypass orchestrateEducationalGraph");
  }

  const learnerNav = readFileSync(join(repoRoot, "src/lib/breadcrumbs/learner-navigation.ts"), "utf8");
  if (learnerNav.includes("buildRnRemediationGraphSteps")) {
    remediationDivergence.push("learner-navigation must not call buildRnRemediationGraphSteps directly");
  }

  const appLearner = join(repoRoot, "src/app/(student)/app/(learner)");
  scanDir(appLearner, parallelRegistryViolations, repoRoot);

  return {
    graphVersion: EDUCATIONAL_GRAPH_VERSION,
    ok: parallelRegistryViolations.length === 0 && remediationDivergence.length === 0,
    parallelRegistryViolations,
    remediationDivergence,
  };
}

function scanDir(dir: string, violations: string[], repoRoot: string): void {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) scanDir(p, violations, repoRoot);
    else if (p.endsWith(".tsx") || p.endsWith(".ts")) {
      const text = readFileSync(p, "utf8");
      if (
        text.includes("<BreadcrumbTrail") &&
        !text.includes("LearnerBreadcrumbTrail") &&
        !text.includes("AnalyticsBreadcrumbTrail")
      ) {
        violations.push(`ungoverned_trail:${relative(repoRoot, p)}`);
      }
      for (const pat of FORBIDDEN_PARALLEL_PATTERNS) {
        if (pat.re.test(text)) violations.push(`${pat.label}:${relative(repoRoot, p)}`);
      }
    }
  }
}
