/**
 * Discovery / acquisition breadcrumb governance — canonical roots, no education intent leakage.
 */

import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/breadcrumbs/breadcrumb-types";
import { intentForSurface } from "@/lib/breadcrumbs/breadcrumb-surface";
import { assertBreadcrumbDepth } from "@/lib/breadcrumbs/breadcrumb-depth-governance";
import { getBreadcrumbRoot } from "@/lib/breadcrumbs/breadcrumb-root-registry";
import { canonicalBreadcrumbHref, canonicalMarketingPath } from "@/lib/breadcrumbs/canonical-breadcrumb-href-builder";
import { applyGovernedBreadcrumbResolution } from "@/lib/breadcrumbs/governed-breadcrumb-resolution";
import type { GovernedBreadcrumbResolution } from "@/lib/breadcrumbs/governed-breadcrumb-resolution";

export type DiscoveryBreadcrumbInput = {
  hubLabel: string;
  hubPath: string;
  leafLabel: string;
  leafPath?: string;
  pathname: string;
};

function homeCrumb(): BreadcrumbCrumb {
  const home = getBreadcrumbRoot("home");
  return { name: home?.label ?? "Home", href: home?.href ?? "/" };
}

/**
 * Governed discovery trail: Home → hub → leaf (acquisition SEO hierarchy).
 */
export function resolveDiscoveryBreadcrumbResolution(
  input: DiscoveryBreadcrumbInput,
): GovernedBreadcrumbResolution {
  const hubHref = canonicalMarketingPath(input.hubPath);
  const crumbs: BreadcrumbCrumb[] = [
    homeCrumb(),
    { name: input.hubLabel, href: hubHref },
    { name: input.leafLabel, href: input.leafPath ? canonicalMarketingPath(input.leafPath) : undefined },
  ];

  const schemaItems: BreadcrumbSchemaItem[] = crumbs.map((c, i) => ({
    name: c.name,
    item: c.href ? canonicalBreadcrumbHref(c.href) : canonicalBreadcrumbHref(input.pathname),
  }));

  const intent = intentForSurface("landing");
  const depth = assertBreadcrumbDepth(intent, crumbs);
  const finalCrumbs = depth.ok ? crumbs : crumbs.slice(-4);

  return applyGovernedBreadcrumbResolution({
    resolution: { crumbs: finalCrumbs, schemaItems },
    surface: "landing",
    pathname: canonicalMarketingPath(input.pathname),
    canonicalRootId: "home",
  });
}

export function auditDiscoveryTrailLabels(crumbs: readonly BreadcrumbCrumb[]): string | null {
  const roots = crumbs.map((c) => c.name.trim().toLowerCase());
  const homeCount = roots.filter((n) => n === "home").length;
  if (homeCount > 1) return "duplicate Home label in discovery trail";
  const forbidden = ["ecg academy", "heart rhythms", "telemetry academy"];
  for (const name of roots) {
    if (forbidden.includes(name)) return `forbidden discovery alias: ${name}`;
  }
  return null;
}
