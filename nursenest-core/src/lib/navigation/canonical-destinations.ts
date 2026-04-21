/**
 * Canonical pathway and study destinations — single facade for header, footer, homepage, and CTAs.
 *
 * - **Public marketing** routes: region-aware exam hubs + shared “Explore” targets (pricing, lessons, etc.).
 * - **Learner** `/app` routes: import `@/lib/navigation/learner-primary-nav` (or {@link getLearnerPrimaryNavModule}).
 *
 * Do not duplicate ad hoc `/us/rn/...` strings in UI components; import from here or the underlying
 * `marketing-entry-routes` / `country-exam-offerings` modules via this file’s re-exports.
 */

import type { CountryExamOfferingId } from "@/lib/marketing/country-exam-offerings";
import { defaultPathwayIdForMarketingOffering } from "@/lib/marketing/country-exam-offerings";
import {
  HUB,
  type MarketingRegionToggle,
  rnQuestions,
} from "@/lib/marketing/marketing-entry-routes";
import {
  defaultNursingExamMarketingHub as defaultNursingExamMarketingHubFromNav,
  marketingExamPrepHubs,
} from "@/lib/marketing/marketing-exam-navigation";

export type { MarketingRegionToggle };

/** Session tier aligned with NextAuth user.tier + SiteHeader learner helpers. */
export type NavSessionTier = "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED";

/**
 * Deferred learner nav module — keeps `pathway-cat-flow` and full nav graph off the marketing
 * static import path (see `build-compile-memory-safety.test.ts`).
 */
export function getLearnerPrimaryNavModule() {
  return import("@/lib/navigation/learner-primary-nav");
}

export type { LearnerExamsSurfaceLabel } from "@/lib/navigation/learner-primary-nav";

/**
 * Maps subscription tier → exam offering id for default marketing pathway id resolution
 * (same rule as `SiteHeader` mega-menu emphasis).
 */
export function offeringIdForTier(tier: NavSessionTier): CountryExamOfferingId {
  switch (tier) {
    case "RPN":
    case "LVN_LPN":
      return "pn";
    case "RN":
      return "rn";
    case "NP":
      return "np";
    case "ALLIED":
      return "allied";
    default:
      return "rn";
  }
}

/**
 * Default `pathwayId` query for learner primary nav (matches header’s `learnerPathwayId` useMemo).
 */
export function learnerMarketingPathwayIdFromSession(user: {
  tier?: NavSessionTier | string | null;
  country?: "US" | "CA" | null;
} | null): string | null {
  if (!user?.tier || !user.country) return null;
  const tier = user.tier as NavSessionTier;
  return defaultPathwayIdForMarketingOffering(user.country, offeringIdForTier(tier));
}

// —— Public marketing (anonymous + public nav mode) ——

/** Canonical RN/PN/NP/Allied hub roots for the selected US/CA marketing region. */
export function publicExamPrepHubDestinations(region: MarketingRegionToggle) {
  return marketingExamPrepHubs(region);
}

/**
 * Shared footer / marketing “Explore” column — same targets the header browse strip aligns to
 * (pricing, lessons index, default RN practice entry, tools, etc.).
 */
export function publicMarketingExploreDestinations(region: MarketingRegionToggle) {
  return {
    pricing: HUB.pricing,
    lessons: HUB.examLessons,
    /** RN-track questions URL for the region — default nursing practice entry on marketing surfaces. */
    practiceQuestions: rnQuestions(region),
    questionBank: HUB.questionBank,
    blog: "/blog",
    tools: HUB.tools,
    flashcards: HUB.flashcards,
    practiceExams: HUB.practiceExams,
    signup: HUB.signup,
    login: HUB.login,
  } as const;
}

export function defaultNursingExamMarketingHub(region: MarketingRegionToggle): string {
  return defaultNursingExamMarketingHubFromNav(region);
}

export { HUB };
