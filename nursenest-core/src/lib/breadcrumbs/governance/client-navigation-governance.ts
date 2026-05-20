/**
 * Client-navigation + hydration parity governance (SSR vs hydrated breadcrumb trails).
 */

import type { BreadcrumbCrumb } from "@/lib/breadcrumbs/breadcrumb-types";
import { normalizeEducationalPathname } from "@/lib/breadcrumbs/pathname-normalization";
import { recordGraphObservability } from "@/lib/breadcrumbs/graph-navigation-observability";

export type HydrationParitySnapshot = {
  pathname: string;
  ssrTrailLabels: string[];
  hydratedTrailLabels: string[];
  breadcrumbListCount: number;
  matched: boolean;
  issues: string[];
};

export function compareBreadcrumbHydrationParity(args: {
  pathname: string;
  ssrCrumbs: readonly BreadcrumbCrumb[];
  hydratedCrumbs: readonly BreadcrumbCrumb[];
  breadcrumbListCount: number;
}): HydrationParitySnapshot {
  const pathname = normalizeEducationalPathname(args.pathname);
  const ssrTrailLabels = args.ssrCrumbs.map((c) => c.name);
  const hydratedTrailLabels = args.hydratedCrumbs.map((c) => c.name);
  const issues: string[] = [];

  if (ssrTrailLabels.join("|") !== hydratedTrailLabels.join("|")) {
    issues.push("hydration_trail_mismatch");
    recordGraphObservability({
      metric: "navigation_telemetry.leakage",
      pathname,
      detail: "hydration_trail_mismatch",
    });
  }

  const maxList = pathname.startsWith("/app") ? 0 : 1;
  if (args.breadcrumbListCount > maxList) {
    issues.push(`breadcrumb_list_count_${args.breadcrumbListCount}`);
  }

  return {
    pathname,
    ssrTrailLabels,
    hydratedTrailLabels,
    breadcrumbListCount: args.breadcrumbListCount,
    matched: issues.length === 0,
    issues,
  };
}

export function assertClientTransitionContinuity(args: {
  fromPath: string;
  toPath: string;
  fromBreadcrumbListCount: number;
  toBreadcrumbListCount: number;
}): string[] {
  const issues: string[] = [];
  const to = normalizeEducationalPathname(args.toPath);
  const maxTo = to.startsWith("/app") ? 0 : 1;

  if (args.toBreadcrumbListCount > maxTo) {
    issues.push("client_transition_schema_drift");
  }
  if (args.fromPath.startsWith("/nursing-glossary") && !to.startsWith("/nursing-glossary")) {
    if (args.toBreadcrumbListCount > 1) issues.push("glossary_exit_schema_leak");
  }
  return issues;
}

export function buildReplaySnapshot(snapshot: HydrationParitySnapshot): Record<string, unknown> {
  return {
    pathname: snapshot.pathname,
    matched: snapshot.matched,
    issues: snapshot.issues,
    ssr: snapshot.ssrTrailLabels,
    hydrated: snapshot.hydratedTrailLabels,
    breadcrumbListCount: snapshot.breadcrumbListCount,
    capturedAt: new Date().toISOString(),
  };
}
