import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";

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

export type NursingTierHubActionId = "lessons" | "flashcards" | "practice_questions" | "exams";

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

/** Rejects placeholder / unsafe hrefs so tier hub tiles still use canonical builders per {@link NursingTierHubActionId}. */
function isNavigableTierHubActionHref(href: string): boolean {
  const h = href.trim();
  if (!h) return false;
  const lower = h.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("vbscript:")) return false;
  if (h === "#" || lower === "#/") return false;
  if (h.startsWith("#")) return false;
  return h.startsWith("/") || lower.startsWith("https://") || lower.startsWith("http://");
}

/**
 * Final navigation target for a hub study tile. If `action.href` is missing or a placeholder
 * (`#`, fragment-only, `javascript:`, etc.), falls back to pathway-scoped URLs from the builders.
 */
export function resolveNursingTierHubActionHref(pathway: ExamPathwayDefinition, action: NursingTierHubAction): string {
  const trimmed = action.href?.trim();
  if (trimmed && isNavigableTierHubActionHref(trimmed)) return trimmed;
  switch (action.id) {
    case "lessons":
      return marketingPathwayLessonsIndexPath(pathway);
    case "flashcards":
      return `/app/flashcards?pathwayId=${encodeURIComponent(pathway.id)}`;
    case "practice_questions":
      return buildExamPathwayPath(pathway, "questions");
    case "exams":
      return buildExamPathwayPath(pathway, "cat");
    default:
      return buildExamPathwayPath(pathway);
  }
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
        href: marketingPathwayLessonsIndexPath(pathway),
      },
      {
        id: "flashcards",
        label: "Flashcards",
        description: "Strengthen recall quickly.",
        href: `/app/flashcards?pathwayId=${encodeURIComponent(pathway.id)}`,
      },
      {
        id: "practice_questions",
        label: "Practice Questions",
        description: "Drill by topic or weakness.",
        href: buildExamPathwayPath(pathway, "questions"),
      },
      {
        id: "exams",
        label: "Exams",
        description: "Take exam-style sessions.",
        href: buildExamPathwayPath(pathway, "cat"),
      },
    ],
  };
}
