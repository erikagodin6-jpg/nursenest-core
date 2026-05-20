/**
 * Semantic route coverage diagnostics — academy registry, graph routes, governed surfaces.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { ACADEMY_PATHNAME_REGISTRY, normalizeEducationalPathname } from "@/lib/breadcrumbs/pathname-normalization";
import { detectOntologyNamespaceConflicts, listBreadcrumbRoots } from "@/lib/breadcrumbs/breadcrumb-root-registry";
import { listNursingGlossaryTerms } from "@/lib/seo/nursing-glossary-registry";
import { focusAreaDetailPathname } from "@/lib/breadcrumbs/focus-area-graph-route";

export type SemanticRouteCoverageReport = {
  semanticCoverageScore: number;
  shadowAuthorityCount: number;
  orphanedNodeCount: number;
  unresolvedCanonicalCount: number;
  orphanedRouteCount: number;
  ontologyConflictCount: number;
  unreachableGraphNodeCount: number;
  academyRegistryCount: number;
  governedAcademyPageCount: number;
  glossaryEntityCount: number;
  focusAreaRouteCount: number;
  issues: string[];
};

const REPO_ROOT = join(process.cwd());
const LEGACY_MANUAL_BREADCRUMB_ALLOWLIST = new Set([
  "src/app/(marketing)/(default)/allied-health/[slug]/blog/[postSlug]/page.tsx",
  "src/app/(marketing)/(default)/allied-health/[slug]/blog/page.tsx",
  "src/app/(marketing)/(default)/blog/rn/[slug]/page.tsx",
  "src/app/(marketing)/(default)/blog/rn/page.tsx",
  "src/app/(marketing)/(default)/nursing/[careerSlug]/blog/[postSlug]/page.tsx",
  "src/app/(marketing)/(default)/nursing/[careerSlug]/blog/page.tsx",
  "src/app/(marketing)/(default)/pre-nursing/mini-cat/page.tsx",
  "src/app/(marketing)/(default)/pre-nursing/practice/[slug]/page.tsx",
]);

function walkPages(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkPages(p, acc);
    else if (p.endsWith("page.tsx")) acc.push(p);
  }
  return acc;
}

export function computeSemanticRouteCoverage(repoRoot = REPO_ROOT): SemanticRouteCoverageReport {
  const issues: string[] = [];
  const marketing = join(repoRoot, "src/app/(marketing)/(default)");
  const learner = join(repoRoot, "src/app/(student)/app/(learner)");

  let governedAcademy = 0;
  let shadowAuthorityCount = 0;
  for (const file of walkPages(marketing)) {
    const text = readFileSync(file, "utf8");
    const rel = relative(repoRoot, file);
    if (
      text.includes("<BreadcrumbTrail") &&
      !LEGACY_MANUAL_BREADCRUMB_ALLOWLIST.has(rel) &&
      !/BreadcrumbsFromResolution|AcademyBreadcrumbBar|Breadcrumbs\b/.test(text)
    ) {
      shadowAuthorityCount += 1;
      issues.push(`shadow_authority:${rel}`);
    }
    if (/\bappShellBreadcrumbs\s*\(/.test(text)) {
      shadowAuthorityCount += 1;
      issues.push(`legacy_app_shell:${rel}`);
    }
    if (!text.includes("AcademyBreadcrumbBar") && !text.includes("BreadcrumbsFromResolution")) continue;
    governedAcademy += 1;
    if (text.includes("const PATH =") && !text.includes("pathname={PATH}") && !text.includes('pathname="')) {
      issues.push(`pathname_missing:${rel}`);
    }
  }

  const unresolvedCanonicalCount = issues.filter((i) => i.startsWith("pathname_missing")).length;
  const orphanedNodeCount = issues.filter((i) => i.startsWith("glossary_orphan")).length;

  const focusAreaDetail = join(learner, "account/focus-areas/[topic]/page.tsx");
  const focusAreaRouteCount = existsSync(focusAreaDetail) && statSync(focusAreaDetail).isFile() ? 1 : 0;
  if (!focusAreaRouteCount) {
    issues.push("focus_area_detail_route_missing");
  }

  const glossaryTerms = listNursingGlossaryTerms();
  let orphanedGlossary = 0;
  for (const term of glossaryTerms) {
    if (!term.topicSlug?.trim()) {
      orphanedGlossary += 1;
      issues.push(`glossary_orphan:${term.slug}`);
    }
  }

  const ontologyConflicts = detectOntologyNamespaceConflicts();
  for (const c of ontologyConflicts) issues.push(`ontology_conflict:${c}`);

  const registryPaths = Object.values(ACADEMY_PATHNAME_REGISTRY);
  const duplicateCanonical = registryPaths.filter(
    (p, i) => registryPaths.indexOf(p) !== i,
  );
  if (duplicateCanonical.length) {
    issues.push(`duplicate_canonical:${duplicateCanonical.join(",")}`);
  }

  const roots = listBreadcrumbRoots();
  const deadRemediation = roots.filter((r) => r.remediationPathwayIds.length === 0 && r.rootId !== "home");
  if (deadRemediation.length > 3) {
    issues.push(`roots_without_remediation_paths:${deadRemediation.map((r) => r.rootId).join(",")}`);
  }

  const academyRegistryCount = registryPaths.length;
  const glossaryEntityCount = glossaryTerms.length;
  const focusAreaRoutes = glossaryTerms.slice(0, 12).map((t) => focusAreaDetailPathname(t.topicSlug));

  const orphanedRouteCount =
    issues.filter((i) => i.startsWith("pathname_missing") || i.startsWith("glossary_orphan")).length;
  const ontologyConflictCount = ontologyConflicts.length;
  const unreachableGraphNodeCount = issues.filter((i) => i.startsWith("focus_area")).length;

  const totalChecks = academyRegistryCount + glossaryEntityCount + governedAcademy + focusAreaRouteCount;
  const failedWeight =
    orphanedRouteCount +
    ontologyConflictCount * 2 +
    unreachableGraphNodeCount * 3 +
    shadowAuthorityCount * 4;
  const semanticCoverageScore =
    totalChecks > 0 ? Math.max(0, Math.round(100 - (failedWeight / totalChecks) * 100)) : 100;

  return {
    semanticCoverageScore,
    shadowAuthorityCount,
    orphanedNodeCount,
    unresolvedCanonicalCount,
    orphanedRouteCount,
    ontologyConflictCount,
    unreachableGraphNodeCount,
    academyRegistryCount,
    governedAcademyPageCount: governedAcademy,
    glossaryEntityCount,
    focusAreaRouteCount: focusAreaRoutes.length,
    issues,
  };
}
