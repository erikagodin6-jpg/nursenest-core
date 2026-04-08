import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import {
  HUB,
  NP,
  PN,
  RN,
  alliedQuestions,
  pnLessons,
  pnQuestions,
  rnLessons,
  rnQuestions,
} from "@/lib/marketing/marketing-entry-routes";
import type { SeoCluster, SeoPageDefinition } from "@/lib/seo/programmatic-registry";
import { clusterQuestionBankHref } from "@/lib/seo/programmatic-seo-cluster-links";

export type ProgrammaticProductLinks = {
  lessons: string;
  questions: string;
  testBank: string;
  exams: string;
  tools: string;
  flashcards: string;
};

/**
 * Map programmatic slug → canonical pathway lessons/questions when the slug encodes a specific exam
 * (REx-PN vs NCLEX-PN; CNPLE vs US NP). Umbrella NP slugs follow the marketing region cookie.
 */
function pathwayLessonsQuestionsFromProgrammaticSlug(
  slug: string,
  region: MarketingRegionToggle,
): { lessons: string; questions: string } | null {
  if (slug.startsWith("rex-pn")) {
    return { lessons: PN.caLessons, questions: PN.caQuestions };
  }
  if (slug.startsWith("nclex-pn")) {
    return { lessons: PN.usLessons, questions: PN.usQuestions };
  }
  if (slug === "cnple-practice-questions" || slug === "np-study-guide-canada" || slug === "canada-np-exam-prep") {
    return { lessons: NP.caNpLessons, questions: NP.caNpQuestions };
  }
  if (slug === "np-exam-practice-questions" || slug === "np-exam-prep") {
    return region === "CA"
      ? { lessons: NP.caNpLessons, questions: NP.caNpQuestions }
      : { lessons: NP.fnpLessons, questions: NP.fnpQuestions };
  }
  if (slug === "np-clinical-cases") {
    return region === "CA"
      ? { lessons: NP.caNpLessons, questions: NP.caNpQuestions }
      : { lessons: NP.fnpLessons, questions: NP.fnpQuestions };
  }
  return null;
}

/**
 * Resolves marketing-safe URLs for lessons, pathway questions, public hubs, tools, and flashcards.
 * Subscriber app links are avoided for core product surfaces so SEO pages do not funnel straight to login walls.
 */
export function resolveProgrammaticProductLinks(
  page: SeoPageDefinition,
  locale: string,
  marketingRegion: MarketingRegionToggle = "US",
): ProgrammaticProductLinks {
  const loc = (p: string) => withMarketingLocale(locale, p);
  const pack = page.linkPack ?? inferLinkPackFromCluster(page.cluster);

  const tools = loc(HUB.tools);
  const testBank = loc(HUB.questionBank);
  const exams = loc(HUB.practiceExams);
  const flashcards = loc("/flashcards");

  const slugHub = pathwayLessonsQuestionsFromProgrammaticSlug(page.slug, marketingRegion);
  if (slugHub) {
    return {
      lessons: loc(slugHub.lessons),
      questions: loc(slugHub.questions),
      testBank,
      exams,
      tools,
      flashcards,
    };
  }

  switch (pack) {
    case "nclex-rn":
      return {
        lessons: loc(rnLessons(marketingRegion)),
        questions: loc(rnQuestions(marketingRegion)),
        testBank,
        exams,
        tools,
        flashcards,
      };
    case "nclex-pn":
      return {
        lessons: loc(pnLessons(marketingRegion)),
        questions: loc(pnQuestions(marketingRegion)),
        testBank,
        exams,
        tools,
        flashcards,
      };
    case "np":
      return {
        lessons: loc(marketingRegion === "CA" ? NP.caNpLessons : NP.fnpLessons),
        questions: loc(marketingRegion === "CA" ? NP.caNpQuestions : NP.fnpQuestions),
        testBank,
        exams,
        tools,
        flashcards,
      };
    case "allied":
      return {
        lessons: loc(HUB.examLessons),
        questions: loc(alliedQuestions(marketingRegion)),
        testBank,
        exams,
        tools,
        flashcards,
      };
    case "general":
    default:
      return {
        lessons: loc(HUB.examLessons),
        questions: clusterQuestionBankHref(locale, page.cluster, marketingRegion),
        testBank,
        exams,
        tools,
        flashcards,
      };
  }
}

function inferLinkPackFromCluster(cluster: SeoCluster): SeoPageDefinition["linkPack"] {
  switch (cluster) {
    case "exam-nclex":
      return "nclex-rn";
    case "exam-pn":
      return "nclex-pn";
    case "exam-np":
      return "np";
    case "allied":
      return "allied";
    default:
      return "general";
  }
}
