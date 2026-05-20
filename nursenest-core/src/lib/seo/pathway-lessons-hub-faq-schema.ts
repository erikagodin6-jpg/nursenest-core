import type { FaqJsonLdItem } from "@/components/seo/faq-json-ld";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayCountryLabel, pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";

/** FAQPage entries for public `…/lessons` hubs — complements on-page study guidance. */
export function pathwayLessonsHubFaqSchema(pathway: ExamPathwayDefinition): FaqJsonLdItem[] {
  const examName = pathwayRegionAwareExamName(pathway);
  const country = pathwayCountryLabel(pathway);
  return [
    {
      question: `How are ${examName} lessons organized on NurseNest?`,
      answer: `Lessons are grouped by clinical category (for example cardiovascular, pharmacology, or prioritization) and by topic filters on this hub. Each lesson links to pathway-scoped practice questions and flashcards when you are ready to test recall.`,
    },
    {
      question: `Can I study ${examName} lessons without a subscription?`,
      answer:
        "You can preview lessons and explore the library from this public hub. Saving progress, full lesson bodies where gated, and longer practice sessions use your NurseNest account and plan for this pathway.",
    },
    {
      question: `What should I do after finishing a lesson category?`,
      answer: `Run a short question set in the same topic from the ${examName} question bank, then use adaptive practice or timed exams when your accuracy is stable. Canadian learners should confirm lab values and scope cues match ${country} exam expectations.`,
    },
  ];
}
