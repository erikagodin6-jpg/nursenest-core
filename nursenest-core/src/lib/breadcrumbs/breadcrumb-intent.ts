/**
 * Breadcrumb intent — explicit semantics for trail + schema emission.
 *
 * - discovery: geo/program/exam acquisition (overview, pricing, CAT, QBank)
 * - education: competency hierarchy (lessons, categories, academies, case studies)
 * - learner: /app UX only — never JSON-LD
 * - seo: reserved for layout fallback normalization (path-segment trails)
 */

export type BreadcrumbIntent = "discovery" | "education" | "learner" | "seo";

export const BREADCRUMB_INTENT_LABELS: Record<BreadcrumbIntent, string> = {
  discovery: "discovery",
  education: "education",
  learner: "learner",
  seo: "seo",
};

/** Whether this intent may emit `BreadcrumbList` JSON-LD on public pages. */
export function intentEmitsBreadcrumbSchema(intent: BreadcrumbIntent): boolean {
  return intent === "discovery" || intent === "education" || intent === "seo";
}

/** Default intent when callers omit `intent` on resolver input (by kind). */
export function defaultIntentForResolverKind(kind: string): BreadcrumbIntent {
  switch (kind) {
    case "learner-pathway-lesson":
      return "learner";
    case "pathway-lesson-detail":
    case "pathway-lessons-category":
    case "pathway-lessons-hub":
    case "pathway-topic-cluster":
    case "ecg-hub":
    case "ecg-topic":
    case "ecg-advanced-hub":
    case "ecg-advanced-leaf":
    case "labs-hub":
    case "labs-leaf":
    case "glossary-term":
    case "case-studies":
    case "simple-marketing":
      return "education";
    case "pathway-overview":
    case "pathway-questions-hub":
    case "pathway-cat":
    case "pathway-pricing":
    case "pre-nursing-hub":
    case "pre-nursing-lessons-hub":
    case "pre-nursing-module":
    case "pre-nursing-study-plan":
    case "marketing-pricing":
    case "tools-index":
    case "tools-slug":
    case "for-institutions":
      return "discovery";
    default:
      return "education";
  }
}

export function attachIntentToResolution<T extends { crumbs: unknown[]; schemaItems: unknown[] }>(
  resolution: T,
  intent: BreadcrumbIntent,
): T & { intent: BreadcrumbIntent } {
  return { ...resolution, intent };
}
