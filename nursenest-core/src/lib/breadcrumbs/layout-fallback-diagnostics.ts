/**
 * Marketing layout breadcrumb fallback — structured telemetry and QA strict mode.
 */

import type { BreadcrumbIntent } from "@/lib/breadcrumbs/breadcrumb-intent";
import { trackBreadcrumbTelemetry } from "@/lib/breadcrumbs/breadcrumb-telemetry";
import { resolveBreadcrumbSchemaOwner } from "@/lib/breadcrumbs/breadcrumb-schema-governance";

export type BreadcrumbFallbackReason =
  | "no_page_resolver"
  | "path_segment_only"
  | "missing_canonical_root"
  | "schema_owner_layout_fallback";

export type BreadcrumbFallbackDiagnostics = {
  pathname: string;
  reason: BreadcrumbFallbackReason;
  missingResolverKind?: string;
  missingCanonicalRootId?: string;
  schemaOwner: ReturnType<typeof resolveBreadcrumbSchemaOwner>;
  breadcrumbIntent: BreadcrumbIntent;
  crumbCount: number;
};

function strictFallbackEnabled(): boolean {
  return (
    process.env.NN_SEMANTIC_AUTHORITY_STRICT === "1" ||
    process.env.NN_BREADCRUMB_STRICT_FALLBACK === "1" ||
    process.env.NN_QA_BREADCRUMB_STRICT === "1"
  );
}

export type FallbackLineageSnapshot = {
  pathname: string;
  reason: BreadcrumbFallbackReason;
  schemaOwner: BreadcrumbFallbackDiagnostics["schemaOwner"];
  crumbCount: number;
  capturedAt: string;
};

const fallbackSnapshots: FallbackLineageSnapshot[] = [];

export function recordFallbackLineageSnapshot(diagnostics: BreadcrumbFallbackDiagnostics): FallbackLineageSnapshot {
  const snapshot: FallbackLineageSnapshot = {
    pathname: diagnostics.pathname,
    reason: diagnostics.reason,
    schemaOwner: diagnostics.schemaOwner,
    crumbCount: diagnostics.crumbCount,
    capturedAt: new Date().toISOString(),
  };
  fallbackSnapshots.push(snapshot);
  if (fallbackSnapshots.length > 100) fallbackSnapshots.shift();
  return snapshot;
}

export function getFallbackLineageSnapshots(): readonly FallbackLineageSnapshot[] {
  return fallbackSnapshots;
}

export function diagnoseLayoutBreadcrumbFallback(
  pathname: string,
  crumbCount: number,
  opts?: {
    reason?: BreadcrumbFallbackReason;
    missingResolverKind?: string;
    missingCanonicalRootId?: string;
  },
): BreadcrumbFallbackDiagnostics {
  const schemaOwner = resolveBreadcrumbSchemaOwner(pathname);
  const reason =
    opts?.reason ??
    (schemaOwner === "layout_fallback" ? "schema_owner_layout_fallback" : "no_page_resolver");

  return {
    pathname,
    reason,
    missingResolverKind: opts?.missingResolverKind,
    missingCanonicalRootId: opts?.missingCanonicalRootId,
    schemaOwner,
    breadcrumbIntent: "seo",
    crumbCount,
  };
}

export function trackLayoutBreadcrumbFallback(diagnostics: BreadcrumbFallbackDiagnostics): void {
  recordFallbackLineageSnapshot(diagnostics);
  trackBreadcrumbTelemetry({
    event: "breadcrumb_fallback_used",
    breadcrumbIntent: diagnostics.breadcrumbIntent,
    breadcrumbSurface: "path_segment_only",
    breadcrumbDepth: diagnostics.crumbCount,
    canonicalRoot: diagnostics.missingCanonicalRootId ?? "path_segment",
    schemaOwner: "layout_fallback",
    ontologyClassification: "unknown",
    routeType: diagnostics.pathname.startsWith("/app") ? "learner" : "marketing",
    pathname: diagnostics.pathname,
  });

  if (process.env.NODE_ENV === "development") {
    console.warn("[breadcrumb] layout fallback", {
      pathname: diagnostics.pathname,
      reason: diagnostics.reason,
      missingResolverKind: diagnostics.missingResolverKind,
      missingCanonicalRootId: diagnostics.missingCanonicalRootId,
      crumbCount: diagnostics.crumbCount,
    });
  }

  if (
    strictFallbackEnabled() &&
    (diagnostics.pathname.startsWith("/ecg") ||
      diagnostics.pathname.startsWith("/nursing-glossary") ||
      pageOwnsIndexableFallback(diagnostics.pathname))
  ) {
    throw new Error(
      `breadcrumb_layout_fallback_strict: ${diagnostics.pathname} (${diagnostics.reason})`,
    );
  }
}

function pageOwnsIndexableFallback(pathname: string): boolean {
  const p = pathname.toLowerCase().replace(/\/$/, "") || "/";
  return ["/ecg", "/labs-interpretation", "/clinical-modules", "/nursing-glossary"].some(
    (prefix) => p === prefix || p.startsWith(`${prefix}/`),
  );
}
