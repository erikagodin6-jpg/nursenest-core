import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";

/**
 * Canonical public labels for RN/PN nursing tiers (exam + country-appropriate role wording).
 * RN uses NCLEX-RN in both countries. PN uses NCLEX-PN + LPN (US) or REx-PN + RPN (Canada).
 */
export const NCLEX_RN_PUBLIC_LABEL = "NCLEX-RN" as const;

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
