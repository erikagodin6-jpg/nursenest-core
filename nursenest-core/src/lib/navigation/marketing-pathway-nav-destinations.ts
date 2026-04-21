/**
 * Pathway-specific marketing nav destinations that must stay aligned across
 * mega menus, homepage cards, and other entry surfaces (not global `/lessons` shortcuts).
 */
import { marketingCatPathForPathwayId } from "@/lib/exam-pathways/practice-exams-cat-start";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { publicMarketingCatHrefForOffering } from "@/lib/marketing/marketing-exam-navigation";
import {
  MEGA_MENU_STRIPPED_ACTIVE_PREFIXES,
  type MarketingPathwayMegaMenuKey,
} from "@/lib/navigation/marketing-mega-menu-active-prefixes";

export { MEGA_MENU_STRIPPED_ACTIVE_PREFIXES, type MarketingPathwayMegaMenuKey };

/** US-only product pathway: new graduate RN transition lessons (not pre-nursing). */
export const US_NEW_GRAD_TRANSITION_PATHWAY_ID = "us-rn-new-grad-transition" as const;

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
        lessons: `${rnHub}/lessons`,
        questions: `${rnHub}/questions`,
        cat: publicMarketingCatHrefForOffering(region, "rn"),
        flashcards,
        practiceExams,
        howItWorks,
      };
    }
    const lessons = buildExamPathwayPath(pathway, "lessons");
    const cat =
      marketingCatPathForPathwayId(US_NEW_GRAD_TRANSITION_PATHWAY_ID) ?? buildExamPathwayPath(pathway, "cat");
    const hubRoot = buildExamPathwayPath(pathway);
    return {
      hubHref: hubRoot,
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
    lessons: `${rnHub}/lessons`,
    questions: `${rnHub}/questions`,
    cat: publicMarketingCatHrefForOffering(region, "rn"),
    flashcards,
    practiceExams,
    howItWorks,
  };
}
