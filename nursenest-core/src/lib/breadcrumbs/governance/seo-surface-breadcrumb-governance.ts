/**
 * SEO / programmatic surface breadcrumb governance — single authority for acquisition trails.
 */

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";
import { applyGovernedBreadcrumbResolution } from "@/lib/breadcrumbs/governed-breadcrumb-resolution";
import type { GovernedBreadcrumbResolution } from "@/lib/breadcrumbs/governed-breadcrumb-resolution";
import { normalizeEducationalPathname } from "@/lib/breadcrumbs/pathname-normalization";
import { canonicalBreadcrumbHref, canonicalMarketingPath } from "@/lib/breadcrumbs/canonical-breadcrumb-href-builder";
import { detectForbiddenRootAlias } from "@/lib/breadcrumbs/breadcrumb-root-registry";
import { assertBreadcrumbDepth } from "@/lib/breadcrumbs/breadcrumb-depth-governance";
import { intentForSurface } from "@/lib/breadcrumbs/breadcrumb-surface";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";
import { buildProgrammaticSeoBreadcrumbResolution } from "@/lib/seo/programmatic-breadcrumbs";
import {
  pathwayOverviewBreadcrumbs,
  type PathwayMarketingHubBreadcrumbOpts,
} from "@/lib/seo/pathway-breadcrumbs";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { auditDiscoveryTrailLabels } from "@/lib/breadcrumbs/discovery-breadcrumb-governance";

export type SeoSurfaceKind =
  | "programmatic"
  | "pathway_overview"
  | "exam_cluster"
  | "authority_cluster"
  | "geo_acquisition";

export type SeoSurfaceGovernanceIssue = {
  code:
    | "alias_leakage"
    | "depth_inflation"
    | "duplicate_canonical_chain"
    | "glossary_root_drift"
    | "ontology_namespace_missing"
    | "ungoverned_href";
  detail: string;
};

export function auditSeoSurfaceTrail(
  resolution: BreadcrumbResolution,
  opts: { pathname: string; canonicalRootId?: string; surfaceKind: SeoSurfaceKind },
): SeoSurfaceGovernanceIssue[] {
  const issues: SeoSurfaceGovernanceIssue[] = [];
  const pathname = normalizeEducationalPathname(opts.pathname);
  const labels = resolution.crumbs.map((c) => c.name);

  if (opts.canonicalRootId) {
    const alias = detectForbiddenRootAlias(opts.canonicalRootId, labels);
    if (alias) issues.push({ code: "alias_leakage", detail: alias });
  }

  const discoveryIssue = auditDiscoveryTrailLabels(resolution.crumbs);
  if (discoveryIssue) issues.push({ code: "alias_leakage", detail: discoveryIssue });

  const intent =
    opts.surfaceKind === "pathway_overview" || opts.surfaceKind === "geo_acquisition"
      ? "discovery"
      : intentForSurface(opts.surfaceKind === "programmatic" ? "landing" : "lesson");
  const depth = assertBreadcrumbDepth(intent, resolution.crumbs);
  if (!depth.ok) {
    issues.push({
      code: "depth_inflation",
      detail: depth.issue ? `${depth.issue.code}:${depth.issue.depth}/${depth.issue.max}` : "depth_exceeded",
    });
  }

  const hrefs = resolution.schemaItems.map((s) => s.item).filter(Boolean);
  const seen = new Set<string>();
  for (const href of hrefs) {
    const norm = canonicalMarketingPath(href);
    if (seen.has(norm)) {
      issues.push({ code: "duplicate_canonical_chain", detail: norm });
    }
    seen.add(norm);
  }

  if (pathname.includes("glossary") && !pathname.startsWith("/nursing-glossary")) {
    issues.push({ code: "glossary_root_drift", detail: pathname });
  }

  return issues;
}

function governSeoResolution(
  raw: BreadcrumbResolution,
  args: {
    pathname: string;
    surface: "landing" | "overview" | "lesson";
    canonicalRootId?: string;
    topicSlug?: string;
  },
): GovernedBreadcrumbResolution {
  const pathname = normalizeEducationalPathname(args.pathname);
  const surface =
    args.surface === "overview" ? "overview" : args.surface === "landing" ? "landing" : "lesson";
  return applyGovernedBreadcrumbResolution({
    resolution: raw,
    surface,
    pathname,
    canonicalRootId: args.canonicalRootId ?? "home",
    topicSlug: args.topicSlug,
  });
}

export function resolveProgrammaticSeoSurfaceBreadcrumbs(
  page: SeoPageDefinition,
  locale: string,
  options?: { localized?: boolean; pathname?: string },
): GovernedBreadcrumbResolution {
  const raw = buildProgrammaticSeoBreadcrumbResolution(page, locale, options);
  const pathname =
    options?.pathname ??
    (options?.localized ? `/${locale}/${page.slug}` : `/${page.slug}`);
  return governSeoResolution(raw, {
    pathname,
    surface: "landing",
    canonicalRootId: "home",
  });
}

export function resolvePathwayOverviewSeoBreadcrumbs(
  pathway: ExamPathwayDefinition,
  opts?: PathwayMarketingHubBreadcrumbOpts & { pathname?: string },
): GovernedBreadcrumbResolution {
  const raw = pathwayOverviewBreadcrumbs(pathway, opts);
  const pathname = opts?.pathname ?? opts?.hubBasePath ?? buildExamPathwayPath(pathway);
  return governSeoResolution(raw, {
    pathname,
    surface: "overview",
    canonicalRootId: "lessons",
    topicSlug: pathway.id,
  });
}

export function resolveExamClusterSeoBreadcrumbs(
  breadcrumbs: BreadcrumbResolution,
  pathname: string,
): GovernedBreadcrumbResolution {
  return governSeoResolution(breadcrumbs, {
    pathname,
    surface: "lesson",
    canonicalRootId: "lessons",
  });
}

/** Govern a pre-built SEO resolution (hub overrides, cluster templates). */
export function governSeoSurfaceBreadcrumbs(
  resolution: BreadcrumbResolution,
  pathname: string,
  surfaceKind: SeoSurfaceKind,
): GovernedBreadcrumbResolution {
  const surface =
    surfaceKind === "pathway_overview" || surfaceKind === "geo_acquisition"
      ? "overview"
      : surfaceKind === "programmatic"
        ? "landing"
        : "lesson";
  return governSeoResolution(resolution, {
    pathname,
    surface,
    canonicalRootId: surfaceKind === "authority_cluster" ? "home" : "lessons",
  });
}

/** Normalize schema items to absolute canonical hrefs for JSON-LD. */
export function normalizeSeoSchemaItems(
  resolution: GovernedBreadcrumbResolution,
): GovernedBreadcrumbResolution {
  return {
    ...resolution,
    schemaItems: resolution.schemaItems.map((item) => ({
      ...item,
      item: item.item ? canonicalBreadcrumbHref(item.item) : item.item,
    })),
  };
}
