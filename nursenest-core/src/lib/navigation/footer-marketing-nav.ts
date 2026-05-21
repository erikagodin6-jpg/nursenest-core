/**
 * Canonical marketing footer link targets — keep SiteFooter columns aligned with header IA.
 */
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { defaultPathwayIdForMarketingOffering } from "@/lib/marketing/country-exam-offerings";
import { marketingPathwaySubpathBesideExamHub } from "@/lib/lessons/lesson-routes";
import {
  HUB,
  loginWithCallback,
  type MarketingRegionToggle,
} from "@/lib/marketing/marketing-entry-routes";
import {
  publicExamPrepHubDestinations,
  publicMarketingExploreDestinations,
  publicMarketingFooterStudyToolsDestinations,
} from "@/lib/navigation/canonical-destinations";

export type FooterMarketingNav = {
  platform: {
    lessons: string;
    flashcards: string;
    practiceExams: string;
    cat: string;
    ecg: string;
    readinessAnalytics: string;
    pricing: string;
    features: string;
  };
  resources: {
    nclexStudyGuides: string;
    clinicalReasoning: string;
    testTakingStrategies: string;
    faq: string;
    blog: string;
  };
  support: {
    contact: string;
    helpCenter: string;
    accessibility: string;
    providerLinks: string;
    findCare: string;
    howItWorks: string;
  };
  exams: ReturnType<typeof publicExamPrepHubDestinations> & {
    preNursing: string;
  };
};

export function footerMarketingNav(region: MarketingRegionToggle): FooterMarketingNav {
  const examHubs = publicExamPrepHubDestinations(region);
  const explore = publicMarketingExploreDestinations(region);
  const studyTools = publicMarketingFooterStudyToolsDestinations(region);
  const rnPathway = getExamPathwayById(defaultPathwayIdForMarketingOffering(region, "rn"));
  const rnHub = examHubs.rn;

  return {
    platform: {
      lessons: explore.lessons,
      flashcards: explore.flashcards,
      practiceExams: explore.practiceExams,
      cat: studyTools.cat,
      ecg: "/ecg",
      readinessAnalytics: loginWithCallback("/app/account/progress"),
      pricing: explore.pricing,
      features: "/features",
    },
    resources: {
      nclexStudyGuides: marketingPathwaySubpathBesideExamHub(rnHub, rnPathway, "lessons"),
      clinicalReasoning: "/blog",
      testTakingStrategies: "/nclex-study-plan",
      faq: "/faq",
      blog: explore.blog,
    },
    support: {
      contact: "/contact",
      helpCenter: "/support",
      accessibility: "/support",
      providerLinks: "/providers/resources",
      findCare: "/patients/find-care",
      howItWorks: "/how-it-works",
    },
    exams: {
      ...examHubs,
      preNursing: "/pre-nursing",
    },
  };
}
