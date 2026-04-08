import type { CountrySlug } from "@/lib/exam-pathways/types";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";

/**
 * Canonical public labels for RN/PN nursing tiers (exam + country-appropriate role wording).
 * RN uses NCLEX-RN in both countries. PN uses NCLEX-PN + LPN (US) or REx-PN + RPN (Canada).
 */
export const NCLEX_RN_PUBLIC_LABEL = "NCLEX-RN" as const;

/** Public /lessons index: only list pathways whose catalog country matches the visitor region (US vs Canada). */
export function pathwayMatchesMarketingRegion(countrySlug: CountrySlug, region: MarketingRegionToggle): boolean {
  return region === "US" ? countrySlug === "us" : countrySlug === "canada";
}

export function publicLessonsHubSectionHeadingRn(region: MarketingRegionToggle): string {
  return region === "US" ? "NCLEX-RN lessons · United States" : "NCLEX-RN lessons · Canada";
}

export function publicLessonsHubSectionHeadingPn(region: MarketingRegionToggle): string {
  return region === "US" ? "NCLEX-PN (LPN) lessons · United States" : "REx-PN (RPN) lessons · Canada";
}

export function publicLessonsHubSectionHeadingNp(region: MarketingRegionToggle): string {
  return region === "US" ? "Nurse Practitioner lessons · United States" : "Nurse Practitioner lessons · Canada";
}

export function publicLessonsHubSectionHeadingAllied(region: MarketingRegionToggle): string {
  return region === "US" ? "Allied health lessons · United States" : "Allied health lessons · Canada";
}

/** Compact label for nav strip, quick links, and similar. */
export function nursingTierNavPnLabel(region: MarketingRegionToggle): string {
  return region === "US" ? "NCLEX-PN · LPN" : "REx-PN · RPN";
}

/** Section headings and gateway titles where parentheses read clearly. */
export function nursingTierHeadingPn(region: MarketingRegionToggle): string {
  return region === "US" ? "NCLEX-PN (LPN)" : "REx-PN (RPN)";
}

/** Exam-only fragment (no role word) for tight UI. */
export function nursingTierExamPnOnly(region: MarketingRegionToggle): string {
  return region === "US" ? "NCLEX-PN" : "REx-PN";
}

/** English fallbacks when locale bundles omit region-specific SEO keys. */
export function defaultPublicLessonsMetaTitle(region: MarketingRegionToggle): string {
  return region === "US"
    ? "Nursing exam lessons | NCLEX-RN, NCLEX-PN (LPN), NP | NurseNest"
    : "Nursing exam lessons | NCLEX-RN, REx-PN (RPN), NP | NurseNest";
}

export function defaultPublicLessonsMetaDescription(region: MarketingRegionToggle): string {
  return region === "US"
    ? "Browse pathway-scoped clinical lessons for US nursing exams: NCLEX-RN, NCLEX-PN (LPN), and NP tracks. Previews are public; full depth unlocks with a matching plan."
    : "Browse pathway-scoped clinical lessons for Canadian nursing exams: NCLEX-RN, REx-PN (RPN), and NP tracks. Previews are public; full depth unlocks with a matching plan.";
}

export function defaultQuestionBankMetaTitle(region: MarketingRegionToggle): string {
  return region === "US"
    ? "NCLEX-RN & NCLEX-PN (LPN) practice questions | NurseNest"
    : "NCLEX-RN & REx-PN (RPN) practice questions | NurseNest";
}

export function defaultQuestionBankMetaDescription(region: MarketingRegionToggle): string {
  return region === "US"
    ? "Public overview of the NurseNest nursing question bank: NCLEX-RN, NCLEX-PN (LPN), NP, and allied tracks for the United States. Sign up to practice in the app."
    : "Public overview of the NurseNest nursing question bank: NCLEX-RN, REx-PN (RPN), NP, and allied tracks for Canada. Sign up to practice in the app.";
}

export function defaultPracticeExamsMetaTitle(region: MarketingRegionToggle): string {
  return region === "US"
    ? "NCLEX-RN & NCLEX-PN (LPN) practice exams and mock tests | NurseNest"
    : "NCLEX-RN & REx-PN (RPN) practice exams and mock tests | NurseNest";
}

export function defaultPracticeExamsMetaDescription(region: MarketingRegionToggle): string {
  return region === "US"
    ? "Timed practice exams for US nursing candidates (NCLEX-RN, NCLEX-PN / LPN, NP). Create an account to launch mocks in the app."
    : "Timed practice exams for Canadian nursing candidates (NCLEX-RN, REx-PN / RPN, NP). Create an account to launch mocks in the app.";
}

export function defaultFlashcardsMetaTitle(region: MarketingRegionToggle): string {
  return region === "US"
    ? "NCLEX-RN & NCLEX-PN (LPN) nursing flashcards | NurseNest"
    : "NCLEX-RN & REx-PN (RPN) nursing flashcards | NurseNest";
}

export function defaultFlashcardsMetaDescription(region: MarketingRegionToggle): string {
  return region === "US"
    ? "Topic-organized nursing flashcards for NCLEX-RN and NCLEX-PN (LPN), plus clinical review. Sample cards here; full study inside NurseNest."
    : "Topic-organized nursing flashcards for NCLEX-RN and REx-PN (RPN), plus clinical review. Sample cards here; full study inside NurseNest.";
}

export function defaultHomeMetaTitle(region: MarketingRegionToggle): string {
  return region === "US"
    ? "NurseNest | NCLEX-RN & NCLEX-PN (LPN) — practice questions & lessons"
    : "NurseNest | NCLEX-RN & REx-PN (RPN) — practice questions & lessons";
}

export function defaultHomeMetaDescription(region: MarketingRegionToggle): string {
  return region === "US"
    ? "NurseNest: NCLEX-RN and NCLEX-PN (LPN) practice questions, clinical lessons, and mock exams for US nursing candidates—plus NP and allied tracks."
    : "NurseNest: NCLEX-RN and REx-PN (RPN) practice questions, clinical lessons, and mock exams for Canadian nursing candidates—plus NP and allied tracks.";
}
