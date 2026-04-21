/**
 * Pathway-specific marketing nav destinations that must stay aligned across
 * mega menus, homepage cards, and other entry surfaces (not global `/lessons` shortcuts).
 */
import { marketingCatPathForPathwayId } from "@/lib/exam-pathways/practice-exams-cat-start";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { HUB, rnLessons, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { publicMarketingCatHrefForOffering } from "@/lib/marketing/marketing-exam-navigation";

/** US-only product pathway: new graduate RN transition lessons (not pre-nursing). */
export const US_NEW_GRAD_TRANSITION_PATHWAY_ID = "us-rn-new-grad-transition" as const;

export type MarketingPathwayMegaMenuKey = "rn" | "pn" | "np" | "newgrad" | "allied";

/**
 * Stripped marketing pathname prefixes (after {@link stripMarketingLocalePrefix}) that
 * should light up each exam mega-menu tab. Keep narrow: shared hubs like `/lessons` must
 * not activate "New Grad" just because the mega menu once linked there.
 */
export const MEGA_MENU_STRIPPED_ACTIVE_PREFIXES: Record<MarketingPathwayMegaMenuKey, readonly string[]> = {
  rn: ["/us/rn/", "/canada/rn/"],
  pn: ["/us/pn/", "/canada/pn/"],
  np: ["/us/np/", "/canada/np/"],
  newgrad: ["/us/rn/new-grad-transition/", "/us/new-grad", "/canada/new-grad"],
  allied: ["/us/allied/", "/canada/allied/"],
} as const;

export type PublicNewGradStudyDestinations = {
  hubHref: string;
  lessons: string;
  questions: string;
  cat: string;
  flashcards: string;
  practiceExams: string;
  howItWorks: string;
};

/**
 * Public "New Grad" study destinations: US uses the dedicated transition pathway; Canada
 * follows the same policy as `[locale]/new-grad` (RN hub + RN lesson surfaces).
 */
export function publicNewGradStudyDestinations(
  region: MarketingRegionToggle,
  rnHub: string,
): PublicNewGradStudyDestinations {
  const flashcards = HUB.flashcards;
  const practiceExams = HUB.practiceExams;
  const howItWorks = "/how-it-works";

  if (region === "US") {
    const pathway = getExamPathwayById(US_NEW_GRAD_TRANSITION_PATHWAY_ID);
    if (!pathway) {
      return {
        hubHref: rnHub,
        lessons: rnLessons(region),
        questions: rnQuestions(region),
        cat: publicMarketingCatHrefForOffering(region, "rn"),
        flashcards,
        practiceExams,
        howItWorks,
      };
    }
    const lessons = buildExamPathwayPath(pathway, "lessons");
    const cat =
      marketingCatPathForPathwayId(US_NEW_GRAD_TRANSITION_PATHWAY_ID) ?? buildExamPathwayPath(pathway, "cat");
    return {
      hubHref: lessons,
      lessons,
      questions: buildExamPathwayPath(pathway, "questions"),
      cat,
      flashcards,
      practiceExams,
      howItWorks,
    };
  }

  return {
    hubHref: rnHub,
    lessons: rnLessons(region),
    questions: rnQuestions(region),
    cat: publicMarketingCatHrefForOffering(region, "rn"),
    flashcards,
    practiceExams,
    howItWorks,
  };
}
