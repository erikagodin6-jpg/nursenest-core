import { ExamFamily } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { getIntlRnCountrySiteMatrixRow } from "@/lib/international-rn/intl-rn-country-site-matrix";
import {
  marketingTierHubStudyActionHref,
  resolveMarketingTierHubStudyActionHref,
  type MarketingTierHubStudyActionId,
} from "@/lib/navigation/marketing-tier-hub-study-hrefs";
import { resolveMarketingDisplayCopy } from "@/lib/public-display-copy";

/**
 * SERP-aligned hub headline (H1): primary exam keyword + country, without the brand suffix.
 * Kept in sync with pathway `seoTitle` patterns in `exam-pathways-data-*`.
 */
export function nursingTierMarketingHeadline(pathway: ExamPathwayDefinition): string {
  const matrixH1 = getIntlRnCountrySiteMatrixRow(pathway.id)?.h1Phrase;
  if (matrixH1) return matrixH1;

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
  if (pathway.countrySlug === "canada") return "Canada";
  if (pathway.countrySlug === "us") return "the United States";
  if (pathway.countrySlug === "uk") return "the United Kingdom";
  if (pathway.countrySlug === "australia") return "Australia";
  if (pathway.countrySlug === "philippines") return "the Philippines";
  return pathway.countrySlug;
}

export function buildNursingTierHubContent(pathway: ExamPathwayDefinition): NursingTierHubContent {
  const audienceLabel = audienceLabelFor(pathway);
  const examLabel = examLabelFor(pathway);
  const countryLabel = countryLabelFor(pathway);
  const title = resolveMarketingDisplayCopy({
    curatedCopy: nursingTierMarketingHeadline(pathway),
    slug: pathway.id,
  });

  const isGenericIntl = pathway.examFamily === ExamFamily.GENERIC;

  return {
    audienceLabel,
    examLabel,
    title,
    intro: isGenericIntl
      ? `${examLabel} preparation context for ${countryLabel}: start with lessons and drills that strengthen transferable clinical judgement, then confirm every regulatory step with your official body.`
      : `${examLabel} prep for ${countryLabel}: choose lessons, flashcards, practice questions, or adaptive CAT-style exams next.`,
    description: isGenericIntl
      ? `This hub explains how NurseNest can support ${audienceLabel} learners targeting registration in ${countryLabel} without claiming to replace regulator materials.`
      : `This area contains ${examLabel} learning and exam-prep resources for ${audienceLabel} learners in ${countryLabel}.`,
    includedNote: isGenericIntl
      ? `Study tiles link to the same lesson, flashcard, and question surfaces used for North American pathways where noted; formats may include NCLEX-style items for cognitive rehearsal and are not copies of regulator-specific examinations.`
      : `Included for this tier: ${examLabel} study resources, pathway-specific lessons, exam-style practice, and CAT readiness work for ${audienceLabel} learners in ${countryLabel}.`,
    startHere: isGenericIntl
      ? "Begin with Lessons for orientation, add Flashcards for recall, then use Practice Questions for drills. Treat optional adaptive sessions as reasoning practice only."
      : "Start with Lessons, then move into Practice Questions and Exams as your confidence grows.",
    differenceHeading: "What is the difference?",
    differenceBody: isGenericIntl
      ? "Lessons summarise concepts, Flashcards speed recall, Practice Questions build judgement under time pressure, and optional adaptive sessions mirror NCLEX-style pacing—not regulator-owned exam designs."
      : "Use Lessons for core concepts, Flashcards for recall, Practice Questions for focused drills, and Exams for longer exam-style sessions.",
    actions: [
      {
        id: "lessons",
        label: resolveMarketingDisplayCopy({ curatedCopy: "Lessons" }),
        description: "Review concepts by topic.",
        href: marketingTierHubStudyActionHref(pathway, "lessons"),
      },
      {
        id: "flashcards",
        label: resolveMarketingDisplayCopy({ curatedCopy: "Flashcards" }),
        description: "Strengthen recall quickly.",
        href: marketingTierHubStudyActionHref(pathway, "flashcards"),
      },
      {
        id: "practice_questions",
        label: resolveMarketingDisplayCopy({ curatedCopy: "Practice Questions" }),
        description: "Drill by topic or weakness.",
        href: marketingTierHubStudyActionHref(pathway, "practice_questions"),
      },
      {
        id: "exams",
        label: resolveMarketingDisplayCopy({ curatedCopy: "Exams" }),
        description: isGenericIntl
          ? "Optional adaptive sessions (NCLEX-style pacing)."
          : "Take exam-style sessions.",
        href: marketingTierHubStudyActionHref(pathway, "exams"),
        disabled: isGenericIntl,
        disabledNote: isGenericIntl
          ? "Adaptive sessions use NCLEX-style formats for cognitive rehearsal only. They are not the NMC CBT, AHPRA/NMBA assessments, or PRC PNLE."
          : undefined,
      },
    ],
  };
}
