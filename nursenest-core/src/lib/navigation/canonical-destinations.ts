/**
 * Canonical pathway and study destinations — single facade for header, footer, homepage, and CTAs.
 *
 * - **Public marketing** routes: region-aware exam hubs + shared “Explore” targets (pricing, lessons, etc.).
 * - **Learner** `/app` routes: import `@/lib/navigation/learner-primary-nav` (or {@link getLearnerPrimaryNavModule}).
 *
 * Do not duplicate ad hoc `/us/rn/...` strings in UI components; import from here or the underlying
 * `marketing-entry-routes` / `country-exam-offerings` modules via this file’s re-exports.
 */

import { CountryCode } from "@prisma/client";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { CountryExamOfferingId } from "@/lib/marketing/country-exam-offerings";
import { defaultPathwayIdForMarketingOffering, marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import { HUB, type MarketingRegionToggle, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { marketingPathwaySubpathBesideExamHub } from "@/lib/lessons/lesson-routes";
import {
  defaultNursingExamMarketingHub as defaultNursingExamMarketingHubFromNav,
  marketingExamPrepHubs,
  publicMarketingCatHrefForOffering,
} from "@/lib/marketing/marketing-exam-navigation";
import { pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayQuery } from "@/lib/scenarios/scenario-routes";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";
import {
  publicNewGradStudyDestinations,
  US_NEW_GRAD_TRANSITION_PATHWAY_ID,
} from "@/lib/navigation/marketing-pathway-nav-destinations";

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
  country?: CountryCode | null;
} | null): string | null {
  if (!user?.tier || !user.country) return null;
  if (user.country !== CountryCode.US && user.country !== CountryCode.CA) return null;
  const tier = String(user.tier);
  if (tier === "PRE_NURSING" || tier === "NEW_GRAD") return null;
  const region = user.country === CountryCode.US ? "US" : "CA";
  return defaultPathwayIdForMarketingOffering(region, offeringIdForTier(tier as NavSessionTier));
}

/** Tiers that map to marketing exam hubs / pre-nursing surfaces (header Learn–Practice row). */
export type MarketingHeaderFlowTier = NavSessionTier | "PRE_NURSING" | "NEW_GRAD";

export type MarketingHeaderFlowContext = {
  tier: MarketingHeaderFlowTier | null;
  country: "US" | "CA" | null;
};

/**
 * Mobile marketing header “Learn → Practice” row: always stay inside a single tier’s hub
 * (never `/lessons` or `/question-bank` mixed-tier indexes once we know the user’s tier).
 */
export function marketingHeaderLearnPracticeFlowDestinations(
  region: MarketingRegionToggle,
  ctx: MarketingHeaderFlowContext,
): { learnHref: string; practiceHref: string; learnMatchBase: string; practiceMatchBase: string } {
  const rnHub = marketingExamHubPath(region, "rn");

  if (ctx.tier === "PRE_NURSING") {
    return {
      learnHref: "/pre-nursing/lessons",
      practiceHref: "/pre-nursing",
      learnMatchBase: "/pre-nursing",
      practiceMatchBase: "/pre-nursing",
    };
  }

  if (ctx.tier === "NEW_GRAD") {
    const d = publicNewGradStudyDestinations(region, rnHub);
    const transitionPathway = getExamPathwayById(US_NEW_GRAD_TRANSITION_PATHWAY_ID);
    const transitionRoot =
      region === "US" && transitionPathway ? buildExamPathwayPath(transitionPathway) : rnHub;
    return {
      learnHref: d.lessons,
      practiceHref: d.questions,
      learnMatchBase: transitionRoot,
      practiceMatchBase: transitionRoot,
    };
  }

  if (ctx.tier && ctx.country) {
    const offering = offeringIdForTier(ctx.tier as NavSessionTier);
    const hub = marketingExamHubPath(region, offering);
    const pathway = getExamPathwayById(defaultPathwayIdForMarketingOffering(region, offering));
    return {
      learnHref: marketingPathwaySubpathBesideExamHub(hub, pathway, "lessons"),
      practiceHref: marketingPathwaySubpathBesideExamHub(hub, pathway, "questions"),
      learnMatchBase: hub,
      practiceMatchBase: hub,
    };
  }

  const hub = marketingExamHubPath(region, "rn");
  const rnPathway = getExamPathwayById(defaultPathwayIdForMarketingOffering(region, "rn"));
  return {
    learnHref: marketingPathwaySubpathBesideExamHub(hub, rnPathway, "lessons"),
    practiceHref: marketingPathwaySubpathBesideExamHub(hub, rnPathway, "questions"),
    learnMatchBase: hub,
    practiceMatchBase: hub,
  };
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

/**
 * Region-scoped study-tool deep links for the marketing footer (RN default pathway).
 * Paths under `/app/*` and `/modules/*` are intended to be wrapped with {@link loginWithCallback}
 * for guests so behavior matches pathway hub premium tiles.
 */
export function publicMarketingFooterStudyToolsDestinations(region: MarketingRegionToggle) {
  const pathwayId = defaultPathwayIdForMarketingOffering(region, "rn");
  return {
    cat: publicMarketingCatHrefForOffering(region, "rn"),
    osce: withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.osce, pathwayId),
    labs: withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.labDrills, pathwayId),
    medicationMathApp: withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.medCalculations, pathwayId),
    /** Public marketing med math explainer + drills hub (no `/app` gate). */
    medicationMathTool: "/tools/med-math",
    pharmacology: pathwayHubAppQuestionsHref(pathwayId, "Pharmacology"),
  } as const;
}

export function defaultNursingExamMarketingHub(region: MarketingRegionToggle): string {
  return defaultNursingExamMarketingHubFromNav(region);
}

export { HUB };
