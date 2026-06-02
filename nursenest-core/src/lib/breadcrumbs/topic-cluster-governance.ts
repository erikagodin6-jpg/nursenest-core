/**
 * Topic cluster governance — education-first trails vs SEO inflation.
 */

import type { BreadcrumbCrumb } from "@/lib/breadcrumbs/breadcrumb-types";
import { hasGeoDepthPollution, validateEducationFirstTrail } from "@/lib/breadcrumbs/navigation-ontology";
import type { EducationalNavigationTrail } from "@/lib/breadcrumbs/navigation-ontology";

export type TopicClusterAuditResult = {
  ok: boolean;
  issues: string[];
  crumbCount: number;
};

/** Validates a marketing lesson/topic cluster crumb list. */
export function auditTopicClusterCrumbs(crumbs: BreadcrumbCrumb[], educationFirst = true): TopicClusterAuditResult {
  const labels = crumbs.map((c) => c.name);
  const issues: string[] = [];

  if (educationFirst && hasGeoDepthPollution(labels)) {
    issues.push("reject_geo_pollution: use pathway hub label instead of country → role → exam chain");
  }

  if (crumbs.length > 6) {
    issues.push("reject_chain_length: max 6 visible crumbs; collapse competency middle nodes");
  }

  const duplicateLabels = new Set<string>();
  for (const c of crumbs) {
    const key = c.name.trim().toLowerCase();
    if (duplicateLabels.has(key)) issues.push(`duplicate_label:${c.name}`);
    duplicateLabels.add(key);
  }

  const trail: EducationalNavigationTrail = {
    intent: "education",
    educationFirst,
    nodes: crumbs.map((c, i) => ({
      layer: i === 0 ? "site" : i === crumbs.length - 1 ? "lesson" : "topic_cluster",
      label: c.name,
      href: c.href,
    })),
  };
  const validation = validateEducationFirstTrail(trail);
  issues.push(...validation.issues);

  return { ok: issues.length === 0, issues, crumbCount: crumbs.length };
}
