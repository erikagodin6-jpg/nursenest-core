/**
 * Type-safe breadcrumb surfaces — intent is derived, never caller-supplied.
 */

import type { BreadcrumbIntent } from "@/lib/breadcrumbs/breadcrumb-intent";

/** Education / competency-oriented public surfaces. */
export type EducationalBreadcrumbSurface =
  | "academy"
  | "lesson"
  | "topic_cluster"
  | "glossary"
  | "case_study"
  | "competency"
  | "interpretation_guide";

/** Authenticated learner surfaces (no JSON-LD). */
export type LearnerBreadcrumbSurface =
  | "dashboard"
  | "remediation"
  | "study_plan"
  | "post_exam"
  | "review_session";

/** Acquisition / geo program surfaces. */
export type DiscoveryBreadcrumbSurface = "overview" | "pricing" | "qbank" | "cat" | "landing";

/** Layout or legacy path-only trails. */
export type SeoBreadcrumbSurface = "unknown" | "legacy" | "path_segment_only";

export type BreadcrumbSurface =
  | EducationalBreadcrumbSurface
  | LearnerBreadcrumbSurface
  | DiscoveryBreadcrumbSurface
  | SeoBreadcrumbSurface;

const EDUCATIONAL_SURFACES = new Set<EducationalBreadcrumbSurface>([
  "academy",
  "lesson",
  "topic_cluster",
  "glossary",
  "case_study",
  "competency",
  "interpretation_guide",
]);

const LEARNER_SURFACES = new Set<LearnerBreadcrumbSurface>([
  "dashboard",
  "remediation",
  "study_plan",
  "post_exam",
  "review_session",
]);

const DISCOVERY_SURFACES = new Set<DiscoveryBreadcrumbSurface>([
  "overview",
  "pricing",
  "qbank",
  "cat",
  "landing",
]);

/** Maps marketing resolver `kind` → surface (single source of truth). */
const RESOLVER_KIND_TO_SURFACE: Record<string, BreadcrumbSurface> = {
  "pathway-lesson-detail": "lesson",
  "pathway-lessons-category": "competency",
  "pathway-lessons-hub": "lesson",
  "pathway-topic-cluster": "topic_cluster",
  "learner-pathway-lesson": "review_session",
  "ecg-hub": "academy",
  "ecg-topic": "academy",
  "ecg-advanced-hub": "academy",
  "ecg-advanced-leaf": "academy",
  "ecg-standalone-leaf": "academy",
  "labs-hub": "academy",
  "labs-leaf": "academy",
  "labs-hub-child": "academy",
  "glossary-index": "glossary",
  "glossary-term": "glossary",
  "nursing-glossary-hub": "glossary",
  "nursing-glossary-term": "glossary",
  "case-studies": "case_study",
  "pathway-overview": "overview",
  "pathway-questions-hub": "qbank",
  "pathway-cat": "cat",
  "pathway-pricing": "pricing",
  "clinical-interpretation-hub": "interpretation_guide",
  "clinical-interpretation-guide": "interpretation_guide",
};

/** Maps learner resolver `kind` → surface. */
const LEARNER_KIND_TO_SURFACE: Record<string, LearnerBreadcrumbSurface> = {
  dashboard: "dashboard",
  "labs-hub": "dashboard",
  "labs-category": "review_session",
  "labs-lesson": "review_session",
  "practice-tests": "review_session",
  "practice-test-leaf": "review_session",
  coach: "remediation",
  review: "review_session",
  "exam-plan": "study_plan",
  "exam-attempt": "post_exam",
  guided: "study_plan",
  "clinical-skills-hub": "review_session",
  "clinical-skill": "review_session",
  "med-cal-hub": "review_session",
  "med-cal-lesson": "review_session",
  "account-hub": "dashboard",
  "account-leaf": "dashboard",
  "study-trail": "review_session",
  "weak-area": "remediation",
  "remediation-ladder": "remediation",
  "interpretation-study": "review_session",
  "ai-tutor": "remediation",
  "session-recovery": "review_session",
  "focus-areas": "remediation",
  "focus-area-detail": "remediation",
};

export function resolveSurfaceFromResolverKind(kind: string): BreadcrumbSurface {
  return RESOLVER_KIND_TO_SURFACE[kind] ?? "unknown";
}

export function resolveSurfaceFromLearnerKind(kind: string): LearnerBreadcrumbSurface {
  return LEARNER_KIND_TO_SURFACE[kind] ?? "review_session";
}

export function intentForSurface(surface: BreadcrumbSurface): BreadcrumbIntent {
  if (EDUCATIONAL_SURFACES.has(surface as EducationalBreadcrumbSurface)) return "education";
  if (LEARNER_SURFACES.has(surface as LearnerBreadcrumbSurface)) return "learner";
  if (DISCOVERY_SURFACES.has(surface as DiscoveryBreadcrumbSurface)) return "discovery";
  return "seo";
}

export function isEducationalSurface(surface: BreadcrumbSurface): surface is EducationalBreadcrumbSurface {
  return EDUCATIONAL_SURFACES.has(surface as EducationalBreadcrumbSurface);
}

export function isLearnerSurface(surface: BreadcrumbSurface): surface is LearnerBreadcrumbSurface {
  return LEARNER_SURFACES.has(surface as LearnerBreadcrumbSurface);
}
