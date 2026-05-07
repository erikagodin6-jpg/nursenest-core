/**
 * Pathway-specific marketing nav destinations that must stay aligned across
 * mega menus, homepage cards, and other entry surfaces (not global `/lessons` shortcuts).
 */
import { marketingCatPathForPathwayId } from "@/lib/exam-pathways/practice-exams-cat-start";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { defaultPathwayIdForMarketingOffering } from "@/lib/marketing/country-exam-offerings";
import { marketingPathwaySubpathBesideExamHub } from "@/lib/lessons/lesson-routes";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { publicMarketingCatHrefForOffering } from "@/lib/marketing/marketing-exam-navigation";
import {
  CANADA_NEW_GRAD_MARKETING_HUB_PATH,
  US_NEW_GRAD_MARKETING_HUB_PATH,
  MEGA_MENU_STRIPPED_ACTIVE_PREFIXES,
  type MarketingPathwayMegaMenuKey,
} from "@/lib/navigation/marketing-mega-menu-active-prefixes";

export {
  CANADA_NEW_GRAD_MARKETING_HUB_PATH,
  US_NEW_GRAD_MARKETING_HUB_PATH,
  MEGA_MENU_STRIPPED_ACTIVE_PREFIXES,
  type MarketingPathwayMegaMenuKey,
};

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
 * Public "New Grad" study destinations: US marketing hub is `/us/new-grad` while lessons,
 * questions, and CAT stay on the `us-rn-new-grad-transition` pathway URLs. Canada keeps the
 * dedicated `/canada/new-grad` landing with RN-hub lesson surfaces (no duplicate RN tab href).
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
      const rnPathway = getExamPathwayById(defaultPathwayIdForMarketingOffering(region, "rn"));
      return {
        hubHref: rnHub,
        lessons: marketingPathwaySubpathBesideExamHub(rnHub, rnPathway, "lessons"),
        questions: marketingPathwaySubpathBesideExamHub(rnHub, rnPathway, "questions"),
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
      hubHref: US_NEW_GRAD_MARKETING_HUB_PATH,
      lessons,
      questions: buildExamPathwayPath(pathway, "questions"),
      cat,
      flashcards,
      practiceExams,
      howItWorks,
    };
  }

  const rnPathway = getExamPathwayById(defaultPathwayIdForMarketingOffering(region, "rn"));
  /** Canada has no `ca-*-new-grad-transition` pathway — dedicated hub avoids duplicate RN tab hrefs. */
  return {
    hubHref: CANADA_NEW_GRAD_MARKETING_HUB_PATH,
    lessons: marketingPathwaySubpathBesideExamHub(rnHub, rnPathway, "lessons"),
    questions: marketingPathwaySubpathBesideExamHub(rnHub, rnPathway, "questions"),
    cat: publicMarketingCatHrefForOffering(region, "rn"),
    flashcards,
    practiceExams,
    howItWorks,
  };
}
