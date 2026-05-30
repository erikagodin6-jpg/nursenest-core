import {
  calculateAdmissionsSliceReadiness,
  getAdmissionsSliceDefinition,
  type AdmissionsSliceId,
} from "@/lib/admissions/admissions-slice-readiness";

export type AdmissionsProductStatus = "coming_soon" | "beta_in_development";

export type AdmissionsProductReadiness = {
  slug: "hesi-a2" | "ati-teas" | "casper";
  sliceId: Exclude<AdmissionsSliceId, "pre-nursing">;
  label: string;
  shortLabel: string;
  status: AdmissionsProductStatus;
  statusLabel: string;
  canonicalPath: `/pre-nursing/${"hesi-a2" | "ati-teas" | "casper"}`;
  summary: string;
  domains: readonly string[];
  currentAccessLabel: string;
};

export const ADMISSIONS_PRODUCT_READINESS: readonly AdmissionsProductReadiness[] = [
  {
    slug: "hesi-a2",
    sliceId: "hesi",
    label: "HESI A2 Readiness",
    shortLabel: "HESI A2",
    status: "coming_soon",
    statusLabel: "Coming soon",
    canonicalPath: "/pre-nursing/hesi-a2",
    summary:
      "A dedicated HESI A2 product is not production-ready yet. NurseNest is building the required domains, diagnostics, analytics, study plans, flashcards, practice questions, and entitlement flow before public launch.",
    domains: [
      "Reading Comprehension",
      "Vocabulary",
      "Grammar",
      "Biology",
      "Chemistry",
      "Anatomy & Physiology",
      "Mathematics",
      "Critical Thinking",
    ],
    currentAccessLabel: "Use Pre-Nursing foundations while HESI A2 is completed",
  },
  {
    slug: "ati-teas",
    sliceId: "teas",
    label: "ATI TEAS Readiness",
    shortLabel: "ATI TEAS",
    status: "coming_soon",
    statusLabel: "Coming soon",
    canonicalPath: "/pre-nursing/ati-teas",
    summary:
      "A dedicated ATI TEAS product is not production-ready yet. NurseNest is building TEAS-specific diagnostics, readiness scoring, lessons, flashcards, question banks, analytics, and remediation before public launch.",
    domains: ["Reading", "Science", "English & Language Usage", "Mathematics"],
    currentAccessLabel: "Use Pre-Nursing foundations while ATI TEAS is completed",
  },
  {
    slug: "casper",
    sliceId: "casper",
    label: "CASPer Situational Judgment Prep",
    shortLabel: "CASPer",
    status: "beta_in_development",
    statusLabel: "Beta in development",
    canonicalPath: "/pre-nursing/casper",
    summary:
      "CASPer is under active product development and is not yet a complete admissions-prep ecosystem. NurseNest is building scenario practice, timed written and video response workflows, rubrics, feedback, and competency analytics before full launch.",
    domains: [
      "Ethics",
      "Professionalism",
      "Communication",
      "Conflict Resolution",
      "Empathy",
      "Bias Awareness",
      "Reflection",
    ],
    currentAccessLabel: "Review admissions foundations while CASPer beta is completed",
  },
];

export function getAdmissionsProductReadinessBySlug(slug: string): AdmissionsProductReadiness | undefined {
  return ADMISSIONS_PRODUCT_READINESS.find((product) => product.slug === slug);
}

export function getAdmissionsProductCompletionPercent(product: AdmissionsProductReadiness): number {
  const definition = getAdmissionsSliceDefinition(product.sliceId);
  if (!definition) return 0;
  return calculateAdmissionsSliceReadiness(definition).readinessPercent;
}

export function getAdmissionsProductLaunchGaps(product: AdmissionsProductReadiness): string[] {
  const definition = getAdmissionsSliceDefinition(product.sliceId);
  if (!definition) return [];
  return calculateAdmissionsSliceReadiness(definition).nextActions;
}
