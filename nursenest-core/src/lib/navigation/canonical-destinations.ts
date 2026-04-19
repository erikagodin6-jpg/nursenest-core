/**
 * Canonical pathway and study destinations — single facade for header, footer, homepage, and CTAs.
 *
 * - **Public marketing** routes: region-aware exam hubs + shared “Explore” targets (pricing, lessons, etc.).
 * - **Learner** `/app` routes: delegate to {@link buildLearnerPrimaryNavItems} / {@link CANONICAL_LEARNER_ROUTES}.
 *
 * Do not duplicate ad hoc `/us/rn/...` strings in UI components; import from here or the underlying
 * `marketing-entry-routes` / `country-exam-offerings` modules via this file’s re-exports.
 */

import { defaultPathwayIdForMarketingOffering, type CountryExamOfferingId } from "@/lib/marketing/country-exam-offerings";
import {
  defaultNursingExamMarketingHub,
  marketingExamPrepHubs,
} from "@/lib/marketing/marketing-exam-navigation";
import {
  HUB,
  type MarketingRegionToggle,
  rnQuestions,
} from "@/lib/marketing/marketing-entry-routes";
import type { LearnerExamsSurfaceLabel } from "@/lib/navigation/learner-primary-nav";

export type { MarketingRegionToggle };

type LearnerPrimaryNavModule = typeof import("@/lib/navigation/learner-primary-nav");
type LearnerPrimaryNavKey = Parameters<LearnerPrimaryNavModule["learnerPrimaryNavLabelKey"]>[0];
type CanonicalLearnerRoutes = LearnerPrimaryNavModule["CANONICAL_LEARNER_ROUTES"];

let learnerPrimaryNavModuleCache: LearnerPrimaryNavModule | null = null;

function getLearnerPrimaryNavModule(): LearnerPrimaryNavModule {
  if (learnerPrimaryNavModuleCache) return learnerPrimaryNavModuleCache;
  const moduleId = ["@/lib/navigation", "learner-primary-nav"].join("/");
  learnerPrimaryNavModuleCache = require(moduleId) as LearnerPrimaryNavModule;
  return learnerPrimaryNavModuleCache;
}

/** Session tier aligned with NextAuth user.tier + SiteHeader learner helpers. */
export type NavSessionTier = "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED";

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

export const CANONICAL_LEARNER_ROUTES: CanonicalLearnerRoutes = {
  get lessons() {
    return getLearnerPrimaryNavModule().CANONICAL_LEARNER_ROUTES.lessons;
  },
  get practice() {
    return getLearnerPrimaryNavModule().CANONICAL_LEARNER_ROUTES.practice;
  },
  get flashcards() {
    return getLearnerPrimaryNavModule().CANONICAL_LEARNER_ROUTES.flashcards;
  },
  get cat() {
    return getLearnerPrimaryNavModule().CANONICAL_LEARNER_ROUTES.cat;
  },
  get catBuilder() {
    return getLearnerPrimaryNavModule().CANONICAL_LEARNER_ROUTES.catBuilder;
  },
  get reports() {
    return getLearnerPrimaryNavModule().CANONICAL_LEARNER_ROUTES.reports;
  },
  get profile() {
    return getLearnerPrimaryNavModule().CANONICAL_LEARNER_ROUTES.profile;
  },
} as CanonicalLearnerRoutes;

export { defaultNursingExamMarketingHub, HUB };

// —— Learner ——

export type { LearnerExamsSurfaceLabel };

export function buildLearnerPrimaryNavItems(
  pathwayId: string | null,
  options?: { examsLabel?: LearnerExamsSurfaceLabel },
) {
  return getLearnerPrimaryNavModule().buildLearnerPrimaryNavItems(pathwayId, options);
}

export function learnerPrimaryNavLabelKey(key: LearnerPrimaryNavKey): string {
  return getLearnerPrimaryNavModule().learnerPrimaryNavLabelKey(key);
}

/**
 * Ordered learner study links — same hrefs as {@link buildLearnerPrimaryNavItems} (learner shell).
 * Marketing chrome keeps public “Explore” links; these remain for in-app / learner surfaces.
 */
export function learnerPrimaryStudyDestinations(
  pathwayId: string | null,
  options?: { examsLabel?: LearnerExamsSurfaceLabel },
) {
  return buildLearnerPrimaryNavItems(pathwayId, options);
}
