/**
 * Breadcrumb depth ceilings — prevent silent hierarchy inflation.
 */

import type { BreadcrumbIntent } from "@/lib/breadcrumbs/breadcrumb-intent";
import type { BreadcrumbCrumb } from "@/lib/breadcrumbs/breadcrumb-types";

export const BREADCRUMB_DEPTH_CEILING: Record<BreadcrumbIntent, number> = {
  discovery: 4,
  education: 5,
  learner: 3,
  seo: 3,
};

export type DepthGovernanceIssue = {
  code: "depth_exceeded";
  intent: BreadcrumbIntent;
  depth: number;
  max: number;
};

export function breadcrumbDepth(crumbs: readonly BreadcrumbCrumb[]): number {
  return crumbs.length;
}

export function maxDepthForIntent(intent: BreadcrumbIntent): number {
  return BREADCRUMB_DEPTH_CEILING[intent];
}

export function assertBreadcrumbDepth(
  intent: BreadcrumbIntent,
  crumbs: readonly BreadcrumbCrumb[],
): { ok: boolean; issue: DepthGovernanceIssue | null } {
  const depth = breadcrumbDepth(crumbs);
  const max = maxDepthForIntent(intent);
  if (depth <= max) return { ok: true, issue: null };
  return {
    ok: false,
    issue: { code: "depth_exceeded", intent, depth, max },
  };
}

/** Truncate visible crumbs for learner UX while preserving schema items if within ceiling. */
export function clampCrumbsForIntent(
  intent: BreadcrumbIntent,
  crumbs: BreadcrumbCrumb[],
): BreadcrumbCrumb[] {
  const max = maxDepthForIntent(intent);
  if (crumbs.length <= max) return crumbs;
  if (intent === "learner") {
    return [crumbs[0]!, ...crumbs.slice(-(max - 1))];
  }
  return crumbs.slice(0, max);
}
