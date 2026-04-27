import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  marketingTierHubStudyActionHref,
  resolveMarketingTierHubStudyActionHref,
  type MarketingTierHubStudyActionId,
} from "@/lib/navigation/marketing-tier-hub-study-hrefs";

/**
 * SERP-aligned hub headline (H1): primary exam keyword + country, without the brand suffix.
 * Kept in sync with pathway `seoTitle` patterns in `exam-pathways-data-*`.
 */
export function nursingTierMarketingHeadline(pathway: ExamPathwayDefinition): string {
  const { countrySlug, examCode, shortName, roleTrack } = pathway;
  if (countrySlug === "canada") {
    if (examCode === "rex-pn") return `${shortName} practice questions for Canada`;
    if (examCode === "nclex-rn") return `${shortName} practice questions for Canada`;
    if (examCode === "cnple") return "NP exam prep for Canada";
    if (examCode === "allied-health") return "Allied health exam prep for Canada";
  }
  if (countrySlug === "us") {
    if (examCode === "nclex-pn") return `${shortName} practice questions for the US`;
    if (examCode === "nclex-rn") return `${shortName} practice questions for the US`;
    if (roleTrack === "np") return `${shortName} NP exam prep for the US`;
    if (examCode === "allied-health") return "Allied health exam prep for the US";
  }
  const stripped = pathway.seoTitle.replace(/\s*\|\s*NurseNest\s*$/i, "").trim();
  return stripped.length > 0 ? stripped : `${shortName} exam prep`;
}

export type NursingTierHubActionId = MarketingTierHubStudyActionId;

export type NursingTierHubAction = {
  id: NursingTierHubActionId;
  label: string;
  description: string;
  href?: string;
  disabled?: boolean;
  disabledNote?: string;
};

export type NursingTierHubContent = {
  audienceLabel: string;
  examLabel: string;
  title: string;
  intro: string;
  description: string;
  includedNote: string;
  startHere: string;
  differenceHeading: string;
  differenceBody: string;
  actions: NursingTierHubAction[];
};

/**
 * Final navigation target for a hub study tile. Uses {@link resolveMarketingTierHubStudyActionHref}
 * so empty, fragment-only, or unsafe `action.href` values cannot override pathway-scoped URLs.
 */
export function resolveNursingTierHubActionHref(pathway: ExamPathwayDefinition, action: NursingTierHubAction): string {
  return resolveMarketingTierHubStudyActionHref(pathway, action.id, action.href);
}

function normalizeDash(value: string): string {
  return value.replace(/\u2013|\u2014/g, "-");
}

function audienceLabelFor(pathway: ExamPathwayDefinition): string {
  switch (pathway.roleTrack) {
    case "lpn":
      return "LPN / LVN";
    case "rpn":
      return "RPN";
    case "rn":
      return "RN";
    case "np":
      return "NP";
    case "allied":
      return "Allied health";
    default:
      return pathway.shortName;
  }
}

function examLabelFor(pathway: ExamPathwayDefinition): string {
  if (pathway.roleTrack === "np") {
    return normalizeDash(pathway.boardLabel ?? pathway.shortName);
  }
  return pathway.shortName;
}

function countryLabelFor(pathway: ExamPathwayDefinition): string {
  return pathway.countrySlug === "canada" ? "Canada" : "the United States";
}

export function buildNursingTierHubContent(pathway: ExamPathwayDefinition): NursingTierHubContent {
  const audienceLabel = audienceLabelFor(pathway);
  const examLabel = examLabelFor(pathway);
  const countryLabel = countryLabelFor(pathway);
  const title = nursingTierMarketingHeadline(pathway);

  return {
    audienceLabel,
    examLabel,
    title,
    intro: `${examLabel} prep for ${countryLabel}: choose lessons, flashcards, practice questions, or adaptive CAT-style exams next.`,
    description: `This area contains ${examLabel} learning and exam-prep resources for ${audienceLabel} learners in ${countryLabel}.`,
    includedNote: `Included for this tier: ${examLabel} study resources, pathway-specific lessons, exam-style practice, and CAT readiness work for ${audienceLabel} learners in ${countryLabel}.`,
    startHere: "Start with Lessons, then move into Practice Questions and Exams as your confidence grows.",
    differenceHeading: "What is the difference?",
    differenceBody: "Use Lessons for core concepts, Flashcards for recall, Practice Questions for focused drills, and Exams for longer exam-style sessions.",
    actions: [
      {
        id: "lessons",
        label: "Lessons",
        description: "Review concepts by topic.",
        href: marketingTierHubStudyActionHref(pathway, "lessons"),
      },
      {
        id: "flashcards",
        label: "Flashcards",
        description: "Strengthen recall quickly.",
        href: marketingTierHubStudyActionHref(pathway, "flashcards"),
      },
      {
        id: "practice_questions",
        label: "Practice Questions",
        description: "Drill by topic or weakness.",
        href: marketingTierHubStudyActionHref(pathway, "practice_questions"),
      },
      {
        id: "exams",
        label: "Exams",
        description: "Take exam-style sessions.",
        href: marketingTierHubStudyActionHref(pathway, "exams"),
      },
    ],
  };
}
