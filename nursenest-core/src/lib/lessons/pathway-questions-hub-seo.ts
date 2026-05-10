/**
 * Pathway-scoped headings for marketing practice-questions hubs (`/{locale}/{slug}/{examCode}/questions`).
 * Mirrors {@link pathwayFlashcardsHubH1} / {@link pathwayLessonHubH1} so RN/PN/NP/allied tracks read distinctly per exam + region.
 */
import { ExamFamily } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";
import {
  pathwayCountryLabel,
  pathwayRegionAwareExamName,
} from "@/lib/lessons/pathway-lesson-hub-seo";

export function pathwayQuestionsMarketingHubH1(pathway: ExamPathwayDefinition): string {
  const place = pathwayCountryLabel(pathway);
  const examName = pathwayRegionAwareExamName(pathway);
  const country = pathway.countrySlug === "canada" ? "CA" : pathway.countrySlug === "us" ? "US" : "US";
  if (pathway.examFamily === ExamFamily.GENERIC && pathway.roleTrack === "rn") {
    return `${examName} practice questions · ${place}`;
  }
  switch (pathway.roleTrack) {
    case "rn":
      return `${examName} practice questions for ${place}`;
    case "lpn":
      return `${examName} (${getNursingRoleLabel({ country, role: "PN" })}) practice questions for ${place}`;
    case "rpn":
      return `${examName} (${getNursingRoleLabel({ country, role: "PN" })}) practice questions for ${place}`;
    case "np":
      return `${examName} exam prep questions for ${place}`;
    case "allied":
      return `Allied health practice questions for ${place}`;
    default:
      return `Practice questions for ${pathway.displayName}`;
  }
}

/**
 * Default hero subtitle when the hub is not narrowed to a single topic (max ~120 chars for {@link PathwayHero}).
 */
export function pathwayQuestionsMarketingHubDefaultSubtitle(pathway: ExamPathwayDefinition): string {
  const place = pathwayCountryLabel(pathway);
  const examName = pathwayRegionAwareExamName(pathway);
  if (pathway.countrySlug === "canada") {
    return `${examName}-scoped items for ${place}: mixed sets, body-system filters, and rationales after each question.`;
  }
  if (pathway.countrySlug === "us") {
    return `${examName}-scoped practice for ${place}: mixed sets, clinical filters, and rationales after each item.`;
  }
  return `Pathway-scoped ${examName} practice for ${place}: pick a mode, filter topics, and learn from rationales.`;
}

export function pathwayQuestionsMarketingHubMetaTitle(pathway: ExamPathwayDefinition): string {
  return `${pathwayQuestionsMarketingHubH1(pathway)} | NurseNest`;
}
