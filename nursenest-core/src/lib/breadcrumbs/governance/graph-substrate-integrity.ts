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
  shadowAuthorityViolations: string[];
  adaptiveHeuristicViolations: string[];
};

const FORBIDDEN_PARALLEL_PATTERNS = [
  { re: /function\s+buildLocalBreadcrumbHierarchy/, label: "local breadcrumb hierarchy builder" },
  { re: /const\s+glossaryHierarchy\s*=/, label: "local glossary hierarchy" },
  { re: /remediationLadderFromRouteHeuristic/, label: "route-heuristic remediation ladder" },
  { re: /pathway-unknown/, label: "pathway-unknown adaptive logic" },
  { re: /rankNextAction(?!FromGraph)/, label: "non-graph next-action ranking" },
];

const SHADOW_AUTHORITY_PATTERNS = [
  { re: /new\s+Map\s*<\s*string\s*,\s*.*Breadcrumb/, label: "parallel breadcrumb registry Map" },
  { re: /ontologyMapper\s*=\s*\{/, label: "standalone ontology mapper" },
  { re: /buildRemediationLadder\s*\(/, label: "standalone remediation ladder builder" },
];

const REMEDIATION_NAV = "src/lib/breadcrumbs/remediation-navigation.ts";
const DASHBOARD_ORCH = "src/lib/learner/rn-coaching-intelligence/dashboard-orchestration-v3.ts";

export function auditGraphSubstrateIntegrity(repoRoot = process.cwd()): GraphSubstrateIntegrityReport {
  const parallelRegistryViolations: string[] = [];
  const remediationDivergence: string[] = [];
  const shadowAuthorityViolations: string[] = [];
  const adaptiveHeuristicViolations: string[] = [];

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

  const dashSrc = readFileSync(join(repoRoot, DASHBOARD_ORCH), "utf8");
  if (dashSrc.includes("function buildDashboardCards") && !dashSrc.includes("resolveDashboardSubstrateOrchestration")) {
    adaptiveHeuristicViolations.push("dashboard-orchestration-v3 missing substrate orchestration");
  }
  if (/return\s+buildDashboardCards/.test(dashSrc) && !/resolveDashboardSubstrateOrchestration/.test(dashSrc)) {
    adaptiveHeuristicViolations.push("dashboard cards must prefer graph substrate path");
  }

  const libDir = join(repoRoot, "src/lib");
  scanDir(libDir, parallelRegistryViolations, shadowAuthorityViolations, adaptiveHeuristicViolations, repoRoot);

  const appLearner = join(repoRoot, "src/app/(student)/app/(learner)");
  scanDir(appLearner, parallelRegistryViolations, shadowAuthorityViolations, adaptiveHeuristicViolations, repoRoot);

  return {
    graphVersion: EDUCATIONAL_GRAPH_VERSION,
    ok:
      parallelRegistryViolations.length === 0 &&
      remediationDivergence.length === 0 &&
      shadowAuthorityViolations.length === 0 &&
      adaptiveHeuristicViolations.length === 0,
    parallelRegistryViolations,
    remediationDivergence,
    shadowAuthorityViolations,
    adaptiveHeuristicViolations,
  };
}

function scanDir(
  dir: string,
  violations: string[],
  shadows: string[],
  adaptive: string[],
  repoRoot: string,
): void {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      scanDir(p, violations, shadows, adaptive, repoRoot);
    } else if (p.endsWith(".tsx") || p.endsWith(".ts")) {
      if (p.endsWith(".test.ts") || p.endsWith(".contract.test.ts")) continue;
      const rel = relative(repoRoot, p);
      if (rel.includes("governance/graph-substrate-integrity.ts")) continue;
      const text = readFileSync(p, "utf8");
      const isGovernanceModule = rel.includes("src/lib/breadcrumbs/governance/");
      const isTypeOnlyModule = rel.endsWith("breadcrumb-types.ts");
      if (
        !isTypeOnlyModule &&
        text.includes("<BreadcrumbTrail") &&
        !text.includes("LearnerBreadcrumbTrail") &&
        !text.includes("AnalyticsBreadcrumbTrail") &&
        !text.includes("BreadcrumbsFromResolution") &&
        !text.includes("Breadcrumbs")
      ) {
        violations.push(`ungoverned_trail:${rel}`);
      }
      if (!isGovernanceModule) {
        for (const pat of FORBIDDEN_PARALLEL_PATTERNS) {
          if (pat.re.test(text)) violations.push(`${pat.label}:${rel}`);
        }
        for (const pat of SHADOW_AUTHORITY_PATTERNS) {
          if (pat.re.test(text)) shadows.push(`${pat.label}:${rel}`);
        }
      }
      if (
        p.includes("adaptive-recommendation") &&
        text.includes("rankNextAction") &&
        !text.includes("orchestrateEducationalGraph")
      ) {
        adaptive.push(`non_graph_adaptive:${relative(repoRoot, p)}`);
      }
    }
  }
}
