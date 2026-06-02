import type { FaqJsonLdItem } from "@/components/seo/faq-json-ld";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/** Short FAQPage entries for pathway overview URLs; complements on-page copy. */
export function pathwayHubFaqSchema(pathway: ExamPathwayDefinition): FaqJsonLdItem[] {
  const label = pathway.shortName;
  return [
    {
      question: `Is NurseNest scoped to ${label}, or generic nursing trivia?`,
      answer: `Content and checkout use the ${label} pathway: questions, lessons, and timed practice are filtered for this track and ${pathway.countryCode} billing tier where applicable.`,
    },
    {
      question: `Where do I start if my exam is in a few weeks?`,
      answer:
        "Open the question bank for a short diagnostic run, then pair weak categories with the lesson hub for this pathway. Use timed practice exams once you are hitting consistent accuracy.",
    },
    {
      question: "Do I need an account for everything?",
      answer:
        "You can preview pathway content and short bank passes from marketing routes. Saving progress, longer sessions, and full subscription features use your NurseNest account.",
    },
  ];
}
