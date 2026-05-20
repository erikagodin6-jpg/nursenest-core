/**
 * Runtime semantic integrity — shadow authority detection and safe degradation.
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  assertSingleBreadcrumbOwner,
  type AssertSingleBreadcrumbOwnerInput,
  type BreadcrumbOwnershipViolation,
} from "@/lib/breadcrumbs/breadcrumb-schema-governance";
import { normalizeEducationalPathname } from "@/lib/breadcrumbs/pathname-normalization";
import { validateOntologyRuntimeIntegrity } from "@/lib/breadcrumbs/governance/ontology-runtime-integrity";
import { auditSeoSurfaceTrail } from "@/lib/breadcrumbs/governance/seo-surface-breadcrumb-governance";
import type { BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";

export type SemanticIntegrityTier =
  | "healthy"
  | "degraded"
  | "conflicting"
  | "orphaned"
  | "shadow-authority-detected";

export type RuntimeSemanticIntegrityResult = {
  tier: SemanticIntegrityTier;
  violations: BreadcrumbOwnershipViolation[];
  issues: string[];
  repairHints: string[];
  pathname: string;
};

function strictSemanticEnabled(): boolean {
  return (
    process.env.NN_SEMANTIC_AUTHORITY_STRICT === "1" ||
    process.env.NN_BREADCRUMB_STRICT_FALLBACK === "1" ||
    process.env.NN_QA_BREADCRUMB_STRICT === "1"
  );
}

export function evaluateRuntimeSemanticIntegrity(
  input: AssertSingleBreadcrumbOwnerInput & {
    resolution?: BreadcrumbResolution;
    ontologyNamespace?: string;
    shadowIndicators?: readonly string[];
  },
): RuntimeSemanticIntegrityResult {
  const pathname = normalizeEducationalPathname(input.pathname);
  const violations = assertSingleBreadcrumbOwner(input);
  const issues: string[] = violations.map((v) => `${v.code}:${v.detail}`);
  const repairHints: string[] = [];

  const ontology = validateOntologyRuntimeIntegrity({
    pathname,
    ontologyNamespace: input.ontologyNamespace,
    canonicalRootId: input.canonicalRootId,
    trailLabels: input.crumbs?.map((c) => c.name),
    topicSlug: input.crumbs?.find((c) => !c.href)?.name,
  });
  issues.push(...ontology.issues);
  repairHints.push(...ontology.repairHints);

  if (input.resolution) {
    const seoIssues = auditSeoSurfaceTrail(input.resolution, {
      pathname,
      canonicalRootId: input.canonicalRootId,
      surfaceKind: pathname.startsWith("/app") ? "geo_acquisition" : "programmatic",
    });
    for (const s of seoIssues) {
      issues.push(`seo_surface:${s.code}:${s.detail}`);
    }
  }

  const labelSet = new Set((input.crumbs ?? []).map((c) => c.name.trim().toLowerCase()));
  if (labelSet.has("home") && (input.crumbs ?? []).filter((c) => c.name.toLowerCase() === "home").length > 1) {
    issues.push("duplicate_semantic_root:home");
    repairHints.push("collapse duplicate Home crumbs to single canonical root");
  }

  if (pathname.startsWith("/app") && input.pageEmitsBreadcrumbList) {
    issues.push("acquisition_learner_namespace_crossover");
  }

  if (input.shadowIndicators?.length) {
    for (const indicator of input.shadowIndicators) {
      issues.push(`shadow_authority:${indicator}`);
    }
  }

  let tier: SemanticIntegrityTier = "healthy";
  if (issues.some((i) => i.startsWith("shadow_authority"))) {
    tier = "shadow-authority-detected";
  } else if (
    violations.some((v) =>
      ["duplicate_breadcrumb_list", "nested_breadcrumb_list", "ecg_alias_leakage"].includes(v.code),
    ) ||
    issues.some((i) => i.includes("namespace_collision") || i.includes("namespace_mismatch"))
  ) {
    tier = "conflicting";
  } else if (
    issues.some((i) => i.includes("orphan") || i.includes("disconnect") || i.includes("orphan_trail"))
  ) {
    tier = "orphaned";
  } else if (issues.length > 0 || violations.length > 0) {
    tier = "degraded";
  }

  if (tier !== "healthy") {
    safeServerLog("semantic_integrity", tier, {
      pathname: pathname.slice(0, 200),
      violation_count: String(violations.length),
      issue_count: String(issues.length),
    });
  }

  if (strictSemanticEnabled() && (tier === "shadow-authority-detected" || tier === "conflicting")) {
    throw new Error(
      `runtime_semantic_integrity_strict: ${pathname} tier=${tier} ${issues.slice(0, 3).join("; ")}`,
    );
  }

  return { tier, violations, issues, repairHints, pathname };
}
