import { buildAppPracticeTestsTopicHref } from "@/lib/learner/app-study-internal-links";
import { pathwayHubAppFlashcardsHref, pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { resolveStudySurfaceCatHref } from "@/lib/exam-pathways/pathway-cat-flow";

export type EcgStudyLinks = {
  flashcardsHref: string;
  questionBankHref: string;
  lessonsHubHref: string;
  catHref: string;
  practiceTestsTopicHref: string;
};

const CARDIO_TOPIC = "cardiovascular";

export function buildEcgStudyLinks(pathwayId: string | null): EcgStudyLinks {
  const trimmed = pathwayId?.trim() || null;
  const flashcardsHref = trimmed ? pathwayHubAppFlashcardsHref(trimmed, CARDIO_TOPIC) : "/app/flashcards";
  const questionBankHref = trimmed ? pathwayHubAppQuestionsHref(trimmed, CARDIO_TOPIC) : "/app/questions";
  const lessonsHubHref = trimmed
    ? `/app/lessons?pathwayId=${encodeURIComponent(trimmed)}&topicSlug=${encodeURIComponent(CARDIO_TOPIC)}`
    : "/app/lessons";
  const catHref = resolveStudySurfaceCatHref({
    pathwayId: trimmed,
    availablePathwayIds: trimmed ? [trimmed] : [],
    topic: CARDIO_TOPIC,
    preferWeakFocus: true,
  });
  const practiceTestsTopicHref =
    trimmed ? buildAppPracticeTestsTopicHref(trimmed, CARDIO_TOPIC) : "/app/practice-tests";
  return { flashcardsHref, questionBankHref, lessonsHubHref, catHref, practiceTestsTopicHref };
}
