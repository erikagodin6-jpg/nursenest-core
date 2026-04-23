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
  return region === "US" ? "NCLEX-PN (LPN / LVN) lessons · United States" : "REx-PN (RPN) lessons · Canada";
}

export function publicLessonsHubSectionHeadingNp(region: MarketingRegionToggle): string {
  return region === "US" ? "Nurse Practitioner lessons · United States" : "Nurse Practitioner lessons · Canada";
}

export function publicLessonsHubSectionHeadingAllied(region: MarketingRegionToggle): string {
  return region === "US" ? "Allied health lessons · United States" : "Allied health lessons · Canada";
}

/** Supporting copy under each tier block on `/lessons` — conversion + clarity (not generic “browse”). */
export function publicLessonsHubSectionLeadRn(region: MarketingRegionToggle): string {
  return region === "US"
    ? "NCLEX-RN lesson hubs for US candidates: Client Needs–aligned modules. Open a pathway to preview topics, then study with pathway-scoped questions in the app."
    : "NCLEX-RN lesson hubs for Canadian RN registration: same exam structure, Canadian clinical language where it matters—no US-only scope mixed in.";
}

export function publicLessonsHubSectionLeadPn(region: MarketingRegionToggle): string {
  return region === "US"
    ? "NCLEX-PN (LPN / LVN) prep: practical-nursing scope, delegation, and safety—built for the US exam. Each hub stays LPN/LVN-appropriate."
    : "REx-PN (RPN) prep for Canadian practical nurses: Canadian regulatory context—not US NCLEX-PN content repackaged.";
}

export function publicLessonsHubSectionLeadNp(region: MarketingRegionToggle): string {
  return region === "US"
    ? "Nurse practitioner board review (FNP, AGPCNP, PMHNP, and other US boards): case-style depth beyond RN-level lessons."
    : "Canadian NP and advanced-practice tracks: board-aligned lessons scoped to each pathway.";
}

export function publicLessonsHubSectionLeadAllied(region: MarketingRegionToggle): string {
  return region === "US"
    ? "Allied health certification prep for US tracks—discipline-scoped lessons separate from nursing RN/PN hubs."
    : "Allied health certification prep for Canadian tracks—clear separation from nursing exam content.";
}

/** Compact label for nav strip, quick links, and similar. */
export function nursingTierNavPnLabel(region: MarketingRegionToggle): string {
  return region === "US" ? "NCLEX-PN · LPN / LVN" : "REx-PN · RPN";
}

/** Section headings and gateway titles where parentheses read clearly. */
export function nursingTierHeadingPn(region: MarketingRegionToggle): string {
  return region === "US" ? "NCLEX-PN (LPN / LVN)" : "REx-PN (RPN)";
}

/** Exam-only fragment (no role word) for tight UI. */
export function nursingTierExamPnOnly(region: MarketingRegionToggle): string {
  return region === "US" ? "NCLEX-PN" : "REx-PN";
}

/** English fallbacks when locale bundles omit region-specific SEO keys. */
export function defaultPublicLessonsMetaTitle(region: MarketingRegionToggle): string {
  return region === "US"
    ? "Nursing exam lessons | NCLEX-RN, NCLEX-PN (LPN / LVN), NP | NurseNest"
    : "Nursing exam lessons | NCLEX-RN, REx-PN (RPN), NP | NurseNest";
}

export function defaultPublicLessonsMetaDescription(region: MarketingRegionToggle): string {
  return region === "US"
    ? "Practice NCLEX-RN, NCLEX-PN, and NP lessons with exam-style reasoning for the US. Built for nursing candidates; previews are public and full depth unlocks with a plan."
    : "Practice NCLEX-RN, REx-PN, and NP lessons with exam-style reasoning for Canada. Built for Canadian nurses; previews are public and full depth unlocks with a plan.";
}

export function defaultQuestionBankMetaTitle(region: MarketingRegionToggle): string {
  return region === "US"
    ? "NCLEX-RN & NCLEX-PN (LPN / LVN) practice questions | NurseNest"
    : "NCLEX-RN & REx-PN (RPN) practice questions | NurseNest";
}

export function defaultQuestionBankMetaDescription(region: MarketingRegionToggle): string {
  return region === "US"
    ? "Practice NCLEX-RN and NCLEX-PN questions with rationales and adaptive tests. Built for US nursing candidates; sign in for full banks and saved history."
    : "Practice NCLEX-RN and REx-PN questions with rationales and adaptive tests. Built for Canadian nurses; sign in for full banks and saved history.";
}

export function defaultPracticeExamsMetaTitle(region: MarketingRegionToggle): string {
  return region === "US"
    ? "NCLEX-RN & NCLEX-PN (LPN / LVN) practice exams and mock tests | NurseNest"
    : "NCLEX-RN & REx-PN (RPN) practice exams and mock tests | NurseNest";
}

export function defaultPracticeExamsMetaDescription(region: MarketingRegionToggle): string {
  return region === "US"
    ? "Practice adaptive NCLEX-RN and NCLEX-PN mock exams with realistic pacing. Built for US nursing candidates; create an account to launch full mocks in the app."
    : "Practice adaptive NCLEX-RN and REx-PN mock exams with realistic pacing. Built for Canadian nurses; create an account to launch full mocks in the app.";
}

export function defaultFlashcardsMetaTitle(region: MarketingRegionToggle): string {
  return region === "US"
    ? "NCLEX-RN & NCLEX-PN (LPN / LVN) nursing flashcards | NurseNest"
    : "NCLEX-RN & REx-PN (RPN) nursing flashcards | NurseNest";
}

export function defaultFlashcardsMetaDescription(region: MarketingRegionToggle): string {
  return region === "US"
    ? "Practice NCLEX-RN and NCLEX-PN recall with topic flashcards and clinical review. Built for US nursing candidates; sample cards here, full decks in NurseNest."
    : "Practice NCLEX-RN and REx-PN recall with topic flashcards and clinical review. Built for Canadian nurses; sample cards here, full decks in NurseNest.";
}

export function defaultHomeMetaTitle(region: MarketingRegionToggle): string {
  return region === "US"
    ? "NurseNest | US NCLEX-RN, NCLEX-PN (LPN/LVN), NP & allied exam prep"
    : "NurseNest | Canada-First Nursing Exam Prep for RN, RPN, NP & Allied Health";
}

export function defaultHomeMetaDescription(region: MarketingRegionToggle): string {
  return region === "US"
    ? "NurseNest US hub: NCLEX-RN, NCLEX-PN (LPN/LVN), NP, and allied health exam prep with practice questions, clinical lessons, flashcards, and mock exams—scoped to United States registration language and scope."
    : "NurseNest offers Canada-first, globally relevant nursing and allied health exam prep with practice questions, clinical lessons, flashcards, and mock exams for RN, RPN, NP, NCLEX, and more.";
}
