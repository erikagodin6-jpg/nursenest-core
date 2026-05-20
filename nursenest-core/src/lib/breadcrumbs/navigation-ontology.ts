/**
 * Educational navigation ontology — hierarchy layers for trails, schema, and competency graphs.
 *
 * Good: Home → NCLEX-RN → Lessons → Cardiovascular → Heart Failure → Loop Diuretics
 * Bad:  Home → Canada → RN → NCLEX → Medical → Topic → Page (geo-depth pollution)
 */

import type { BreadcrumbIntent } from "@/lib/breadcrumbs/breadcrumb-intent";

/** Ordered layers from site root to leaf content. */
export type EducationalNavLayer =
  | "site"
  | "pathway"
  | "academy"
  | "topic_cluster"
  | "competency"
  | "mechanism"
  | "lesson"
  | "interpretation"
  | "glossary"
  | "remediation"
  | "learner_session";

export type EducationalHierarchyNode = {
  layer: EducationalNavLayer;
  label: string;
  href?: string;
  /** Stable slug for competency graph / analytics (not always a URL segment). */
  slug?: string;
};

export type EducationalNavigationTrail = {
  intent: BreadcrumbIntent;
  nodes: EducationalHierarchyNode[];
  /** When true, trail must not include country/role geo segments between exam and content. */
  educationFirst: boolean;
};

const GEO_POLLUTION_SEGMENTS = new Set([
  "canada",
  "us",
  "uk",
  "australia",
  "philippines",
  "india",
  "nigeria",
  "medical",
  "topic",
]);

/**
 * Detects over-deep geo/programmatic chains that dilute educational clarity.
 */
export function hasGeoDepthPollution(labels: string[]): boolean {
  const lower = labels.map((l) => l.toLowerCase().trim());
  let geoHits = 0;
  for (const label of lower) {
    if (GEO_POLLUTION_SEGMENTS.has(label)) geoHits++;
  }
  return geoHits >= 2 && lower.length >= 5;
}

/** Max recommended visible crumbs (UX); schema may be shorter when items omit archive URLs. */
export const RECOMMENDED_MAX_VISIBLE_CRUMBS = 5;

export function validateEducationFirstTrail(trail: EducationalNavigationTrail): {
  ok: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  if (!trail.educationFirst) return { ok: true, issues };
  const labels = trail.nodes.map((n) => n.label);
  if (hasGeoDepthPollution(labels)) {
    issues.push("geo_depth_pollution: collapse country/role into pathway hub label");
  }
  if (trail.nodes.length > RECOMMENDED_MAX_VISIBLE_CRUMBS + 1) {
    issues.push("chain_too_long: consider collapsing middle competency nodes in UI");
  }
  return { ok: issues.length === 0, issues };
}
