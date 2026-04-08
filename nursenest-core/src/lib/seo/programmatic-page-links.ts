import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { ALLIED, HUB, NP, PN, RN } from "@/lib/marketing/marketing-entry-routes";
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
 * Resolves marketing-safe URLs for lessons, pathway questions, public hubs, tools, and flashcards.
 * Subscriber app links are avoided for core product surfaces so SEO pages do not funnel straight to login walls.
 */
export function resolveProgrammaticProductLinks(
  page: SeoPageDefinition,
  locale: string,
): ProgrammaticProductLinks {
  const loc = (p: string) => withMarketingLocale(locale, p);
  const pack = page.linkPack ?? inferLinkPackFromCluster(page.cluster);

  const tools = loc(HUB.tools);
  const testBank = loc(HUB.questionBank);
  const exams = loc(HUB.practiceExams);
  const flashcards = loc("/flashcards");

  switch (pack) {
    case "nclex-rn":
      return {
        lessons: loc(HUB.examLessons),
        questions: loc(RN.usQuestions),
        testBank,
        exams,
        tools,
        flashcards,
      };
    case "nclex-pn":
      return {
        lessons: loc(HUB.examLessons),
        questions: loc(PN.usQuestions),
        testBank,
        exams,
        tools,
        flashcards,
      };
    case "np":
      return {
        lessons: loc(HUB.examLessons),
        questions: loc(NP.fnpQuestions),
        testBank,
        exams,
        tools,
        flashcards,
      };
    case "allied":
      return {
        lessons: loc(HUB.examLessons),
        questions: loc(ALLIED.usQuestions),
        testBank,
        exams,
        tools,
        flashcards,
      };
    case "general":
    default:
      return {
        lessons: loc(HUB.examLessons),
        questions: clusterQuestionBankHref(locale, page.cluster),
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
