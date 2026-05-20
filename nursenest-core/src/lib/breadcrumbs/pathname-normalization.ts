/**
 * Canonical pathname + telemetry context for graph-derived educational surfaces.
 */

import type { BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";
import { remediationPathwayId } from "@/lib/breadcrumbs/breadcrumb-graph-convergence";
import { getBreadcrumbRoot, type BreadcrumbRootDefinition } from "@/lib/breadcrumbs/breadcrumb-root-registry";
import type { BreadcrumbSurface } from "@/lib/breadcrumbs/breadcrumb-surface";
import type { BreadcrumbIntent } from "@/lib/breadcrumbs/breadcrumb-intent";
import { intentForSurface } from "@/lib/breadcrumbs/breadcrumb-surface";
import type { EducationalGraphTraversal } from "@/lib/educational-graph/graph-step-contract";

export type EducationalNavigationTelemetryContext = {
  pathname: string;
  ontologyNamespace: string;
  telemetryNamespace: string;
  canonicalRoot: string;
  educationalIntent: BreadcrumbRootDefinition["educationalIntent"] | "orientation";
  breadcrumbIntent: BreadcrumbIntent;
  breadcrumbSurface?: BreadcrumbSurface;
  competencyId?: string | null;
  remediationPathwayId?: string;
  graphDepth?: number;
  topicSlug?: string;
  sourceSurface?: string;
};

export function normalizeEducationalPathname(pathname: string): string {
  const trimmed = pathname.trim();
  if (!trimmed.startsWith("/")) return `/${trimmed.replace(/^\/+/, "")}`;
  const noQuery = trimmed.split("?")[0] ?? trimmed;
  const noHash = noQuery.split("#")[0] ?? noQuery;
  if (noHash.length > 1 && noHash.endsWith("/")) return noHash.slice(0, -1);
  return noHash || "/";
}

/** Derive pathname from governed trail when page constant omitted (fallback only). */
export function derivePathnameFromResolution(resolution: BreadcrumbResolution): string | null {
  const linked = [...resolution.crumbs].reverse().find((c) => c.href?.startsWith("/"));
  if (!linked?.href) return null;
  return normalizeEducationalPathname(linked.href);
}

export function resolveEducationalPathnameForTelemetry(args: {
  declaredPathname?: string | null;
  resolution?: BreadcrumbResolution;
  canonicalRootId?: string;
}): string {
  if (args.declaredPathname?.trim()) {
    return normalizeEducationalPathname(args.declaredPathname);
  }
  if (args.resolution) {
    const derived = derivePathnameFromResolution(args.resolution);
    if (derived) return derived;
  }
  const root = args.canonicalRootId ? getBreadcrumbRoot(args.canonicalRootId) : null;
  if (root?.href) return normalizeEducationalPathname(root.href);
  return "/";
}

export function resolveGraphNavigationTelemetryContext(args: {
  pathname: string;
  surface: BreadcrumbSurface;
  canonicalRootId?: string;
  topicSlug?: string;
  pathwayId?: string | null;
  traversal?: EducationalGraphTraversal | null;
  sourceSurface?: string;
}): EducationalNavigationTelemetryContext {
  const pathname = normalizeEducationalPathname(args.pathname);
  const rootId = args.canonicalRootId ?? inferRootIdFromPath(pathname);
  const root = getBreadcrumbRoot(rootId);
  const ontologyNamespace = root?.ontologyNamespace ?? root?.telemetryNamespace ?? rootId;
  const telemetryNamespace = root?.telemetryNamespace ?? ontologyNamespace;
  const topicSlug = args.topicSlug ?? args.traversal?.topicSlug;
  const competencyId = args.traversal?.competencyId ?? null;
  const graphDepth = args.traversal?.steps?.length ?? 0;

  return {
    pathname,
    ontologyNamespace,
    telemetryNamespace,
    canonicalRoot: rootId,
    educationalIntent: root?.educationalIntent ?? "orientation",
    breadcrumbIntent: intentForSurface(args.surface),
    breadcrumbSurface: args.surface,
    competencyId,
    remediationPathwayId:
      topicSlug != null ? remediationPathwayId(args.pathwayId ?? null, topicSlug) : undefined,
    graphDepth,
    topicSlug,
    sourceSurface: args.sourceSurface,
  };
}

function inferRootIdFromPath(pathname: string): string {
  if (pathname.startsWith("/ecg") || pathname.includes("ecg")) return "ecg";
  if (pathname.startsWith("/nursing-glossary")) return "glossary";
  if (pathname.startsWith("/clinical-interpretation")) return "clinical_interpretation";
  if (pathname.startsWith("/clinical-modules")) return "clinical_modules";
  if (pathname.startsWith("/case-studies")) return "case_studies";
  if (pathname.includes("/lessons")) return "lessons";
  if (pathname.startsWith("/app/account/focus-areas")) return "lessons";
  if (pathname.startsWith("/app")) return "lessons";
  return "home";
}

/** Academy marketing routes that must declare pathname for analytics (CI registry). */
export const ACADEMY_PATHNAME_REGISTRY: Readonly<Record<string, string>> = {
  "/ecg": "/ecg",
  "/telemetry-nursing": "/telemetry-nursing",
  "/pediatric-ecg": "/pediatric-ecg",
  "/pals-rhythms": "/pals-rhythms",
  "/shock-and-perfusion": "/shock-and-perfusion",
  "/pulmonary-artery-catheter": "/pulmonary-artery-catheter",
  "/labs-interpretation": "/labs-interpretation",
  "/hemodynamics-monitoring": "/hemodynamics-monitoring",
  "/ecg-telemetry-mastery": "/ecg-telemetry-mastery",
  "/hemodynamic-monitoring": "/hemodynamic-monitoring",
  "/ecg-practice-questions": "/ecg-practice-questions",
  "/ecg-interpretation": "/ecg-interpretation",
  "/critical-care-bundle": "/critical-care-bundle",
  "/clinical-modules": "/clinical-modules",
  "/advanced-labs-interpretation": "/advanced-labs-interpretation",
  "/arterial-line-interpretation": "/arterial-line-interpretation",
  "/cardiac-output-monitoring": "/cardiac-output-monitoring",
  "/advanced-hemodynamic-monitoring": "/advanced-hemodynamic-monitoring",
  "/advanced-ecg-nursing": "/advanced-ecg-nursing",
  "/advanced-ecg-nursing/rhythm-practice": "/advanced-ecg-nursing/rhythm-practice",
  "/advanced-ecg-nursing/telemetry-monitoring": "/advanced-ecg-nursing/telemetry-monitoring",
  "/advanced-ecg-nursing/pediatric-ecg": "/advanced-ecg-nursing/pediatric-ecg",
  "/advanced-ecg-nursing/electrolyte-ecg-changes": "/advanced-ecg-nursing/electrolyte-ecg-changes",
  "/advanced-ecg-nursing/medication-induced-ecg-changes": "/advanced-ecg-nursing/medication-induced-ecg-changes",
  "/advanced-ecg-nursing/acls-rhythms": "/advanced-ecg-nursing/acls-rhythms",
  "/advanced-ecg-nursing/ecg-case-simulations": "/advanced-ecg-nursing/ecg-case-simulations",
  "/advanced-ecg-nursing/critical-care-ecg": "/advanced-ecg-nursing/critical-care-ecg",
  "/advanced-ecg-nursing/12-lead-stemi": "/advanced-ecg-nursing/12-lead-stemi",
  "/acls-rhythms": "/acls-rhythms",
  "/nursing-glossary": "/nursing-glossary",
  "/clinical-interpretation": "/clinical-interpretation",
  "/case-studies": "/case-studies",
};
