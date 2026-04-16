import type { TierCode } from "@prisma/client";
import {
  ALLIED,
  NP,
  PN,
  rnLessons,
  rnQuestions,
  pnLessons,
  pnQuestions,
  type MarketingRegionToggle,
} from "@/lib/marketing/marketing-entry-routes";

/** Tier on session JWT; undefined while loading or for edge cases. */
export type BrandingSessionTier = TierCode | undefined;

export function paywallTierLineI18nKey(tier: BrandingSessionTier): string {
  if (tier === "RN" || tier === "LVN_LPN" || tier === "RPN" || tier === "NP" || tier === "ALLIED") {
    return `paywall.tierLine.${tier}`;
  }
  return "paywall.tierLine.default";
}

const ALLIED_LESSONS: Record<MarketingRegionToggle, string> = {
  US: "/us/allied/allied-health/lessons",
  CA: "/canada/allied/allied-health/lessons",
};

export function sampleLessonHref(region: MarketingRegionToggle, tier: BrandingSessionTier): string {
  switch (tier) {
    case "LVN_LPN":
      return pnLessons(region);
    case "RPN":
      return PN.caLessons;
    case "NP":
      return region === "US" ? NP.fnpLessons : NP.caNpLessons;
    case "ALLIED":
      return ALLIED_LESSONS[region];
    case "RN":
    default:
      return rnLessons(region);
  }
}

export function sampleQuestionsHref(region: MarketingRegionToggle, tier: BrandingSessionTier): string {
  switch (tier) {
    case "LVN_LPN":
      return pnQuestions(region);
    case "RPN":
      return PN.caQuestions;
    case "NP":
      return region === "US" ? NP.fnpQuestions : NP.caNpQuestions;
    case "ALLIED":
      return region === "US" ? ALLIED.usQuestions : ALLIED.caQuestions;
    case "RN":
    default:
      return rnQuestions(region);
  }
}
