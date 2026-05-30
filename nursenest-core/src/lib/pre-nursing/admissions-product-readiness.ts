import {
  calculateAdmissionsSliceReadiness,
  getAdmissionsSliceDefinition,
  type AdmissionsSliceId,
} from "@/lib/admissions/admissions-slice-readiness";
import { getAdmissionExamProductBySlug, type AdmissionExamSlug } from "@/lib/admissions/admissions-entrance-exams";

export type AdmissionsProductStatus = "active" | "beta_in_development";

export type AdmissionsProductReadiness = {
  slug: AdmissionExamSlug;
  sliceId: Exclude<AdmissionsSliceId, "pre-nursing">;
  label: string;
  shortLabel: string;
  status: AdmissionsProductStatus;
  statusLabel: string;
  canonicalPath: `/pre-nursing/${AdmissionExamSlug}`;
  summary: string;
  domains: readonly string[];
  currentAccessLabel: string;
};

export const ADMISSIONS_PRODUCT_READINESS: readonly AdmissionsProductReadiness[] = [
  {
    slug: "hesi-a2",
    sliceId: "hesi",
    label: "HESI A2 Admissions Prep",
    shortLabel: "HESI A2",
    status: "active",
    statusLabel: "First-class admissions pathway",
    canonicalPath: "/pre-nursing/hesi-a2",
    summary:
      "A complete HESI A2 preparation pathway for nursing-school admission with prerequisite science, reading, language, vocabulary, math, study plans, practice questions, flashcards, and readiness tracking.",
    domains: [
      "Math",
      "Reading Comprehension",
      "Vocabulary",
      "Grammar",
      "Biology",
      "Chemistry",
      "Anatomy & Physiology",
      "Learning Style",
      "Personality Profile",
    ],
    currentAccessLabel: "Study HESI A2 with exam-scoped lessons, flashcards, practice questions, and performance reports",
  },
  {
    slug: "ati-teas",
    sliceId: "teas",
    label: "ATI TEAS Admissions Prep",
    shortLabel: "ATI TEAS",
    status: "active",
    statusLabel: "First-class admissions pathway",
    canonicalPath: "/pre-nursing/ati-teas",
    summary:
      "A dedicated TEAS preparation pathway covering reading, mathematics, science, and English language usage through lessons, flashcards, practice questions, study plans, and progress analytics.",
    domains: ["Reading", "Mathematics", "Science", "English & Language Usage"],
    currentAccessLabel: "Study ATI TEAS with domain-specific lessons, flashcards, practice questions, and readiness tracking",
  },
  {
    slug: "casper",
    sliceId: "casper",
    label: "CASPER Situational Judgment Prep",
    shortLabel: "CASPER",
    status: "active",
    statusLabel: "First-class admissions pathway",
    canonicalPath: "/pre-nursing/casper",
    summary:
      "A professional judgment preparation ecosystem for CASPER-style scenarios with written response, video response, timed practice, interview preparation, rubrics, structured feedback, and competency analytics.",
    domains: [
      "Professionalism",
      "Ethics",
      "Communication",
      "Empathy",
      "Conflict Resolution",
      "Cultural Safety",
      "Equity & Inclusion",
      "Teamwork",
      "Leadership",
      "Patient Advocacy",
      "Decision Making",
      "Professional Accountability",
    ],
    currentAccessLabel: "Practice CASPER with scenarios, response frameworks, video training, and professional judgment analytics",
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
  const examProduct = getAdmissionExamProductBySlug(product.slug);
  if (examProduct) {
    return [
      `Maintain ${examProduct.shortTitle} lesson, flashcard, and practice-question coverage by exam domain.`,
      `Keep ${examProduct.shortTitle} readiness dashboards tied to actual practice and remediation signals.`,
      `Refresh ${examProduct.shortTitle} marketing screenshots from product UI before major campaign launches.`,
    ];
  }
  const definition = getAdmissionsSliceDefinition(product.sliceId);
  if (!definition) return [];
  return calculateAdmissionsSliceReadiness(definition).nextActions;
}
