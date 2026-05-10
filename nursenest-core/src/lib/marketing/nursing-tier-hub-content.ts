import { ExamFamily } from "@prisma/client";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { getIntlRnCountrySiteMatrixRow } from "@/lib/international-rn/intl-rn-country-site-matrix";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import {
  marketingTierHubStudyActionHref,
  resolveMarketingTierHubStudyActionHref,
  type MarketingTierHubStudyActionId,
} from "@/lib/navigation/marketing-tier-hub-study-hrefs";
import { resolveMarketingDisplayCopy } from "@/lib/public-display-copy";
import { isPracticalNursingMarketingPathway } from "@/lib/marketing/is-practical-nursing-marketing-pathway";

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

/**
 * Hub `StudyCard` href: guests use `loginWithCallback` for in-app surfaces (`/app/*`); marketing
 * lessons and question-bank hubs stay direct URLs.
 */
export function resolveNursingTierHubStudyCardHref(
  pathway: ExamPathwayDefinition,
  action: NursingTierHubAction,
  opts: { viewerSignedIn: boolean },
): string {
  const base = resolveNursingTierHubActionHref(pathway, action);
  if (action.id === "exams") {
    if (action.disabled) return buildExamPathwayPath(pathway);
    return opts.viewerSignedIn ? base : loginWithCallback(base);
  }
  if (action.id === "cat") {
    if (action.disabled) return buildExamPathwayPath(pathway);
    return opts.viewerSignedIn ? appPathwayCatSessionStartPath(pathway.id) : base;
  }
  if (action.id === "flashcards") {
    return opts.viewerSignedIn ? base : loginWithCallback(base);
  }
  return base;
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
  if (pathway.countrySlug === "india") return "India";
  if (pathway.countrySlug === "nigeria") return "Nigeria";
  if (pathway.countrySlug === "saudi-arabia") return "Saudi Arabia";
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
  const isPnHub = isPracticalNursingMarketingPathway(pathway);

  const pnIntro =
    pathway.countrySlug === "canada"
      ? `${examLabel} prep for ${countryLabel}: build practical-nursing judgement first—prioritization, safe delegation within RPN scope, medications, and acute cues—then rehearse adaptive pacing and longer practice exams when you are ready.`
      : `${examLabel} prep for ${countryLabel}: anchor LVN/LPN scope in lessons, sharpen prioritization and pharmacology with drills, then layer CAT-style sessions and timed practice exams as stamina grows.`;

  const pnDescription = `This hub is scoped for ${audienceLabel} candidates in ${countryLabel}: pathway lessons, question bank, flashcards, labs, medication math, clinical scenarios, OSCE-style drills when enabled, and readiness analytics inside one NurseNest account.`;

  const pnIncludedNote = `Practical-nursing tier: ${examLabel} lessons and items use PN/RPN-appropriate delegation language; adaptive sessions and practice exams stay pathway-tagged so you are not rehearsing RN-only stems by accident.`;

  const pnStartHere =
    "Suggested loop: stabilize concepts in Lessons → run short prioritization and safety sets in Practice Questions → reinforce with Flashcards and weak-area decks → add CAT and Practice Exam blocks once timing feels exam-realistic.";

  const pnDifferenceBody =
    "Lessons emphasize scope-safe assessment and communication; Practice Questions stress who to see first and what can wait; Flashcards keep high-yield meds and labs sticky; CAT adapts item difficulty from your last answers; Practice Exams build full-length stamina—all filtered to this PN/RPN pathway.";

  const actionsPnLessons =
    "Topic lessons framed for practical nursing—assessment, infection control, scope, and acute priorities without RN-only depth creep.";
  const actionsPnFlash =
    "Fast recall for meds, labs, and procedures you will reuse on the floor and on the exam.";
  const actionsPnPractice =
    "Prioritization, delegation within scope, pharmacology safety, and case-style drills with rationales tied to this pathway.";
  const actionsPnCat =
    "Adaptive sessions that adjust difficulty from your responses—exam-shaped pacing for this track, not a regulator copy.";
  const actionsPnExams =
    "Timed and linear practice-test sets in-app, scoped to this pathway, with performance summaries for remediation.";

  return {
    audienceLabel,
    examLabel,
    title,
    intro: isGenericIntl
      ? `${examLabel} preparation context for ${countryLabel}: start with lessons and drills that strengthen transferable clinical judgement, then confirm every regulatory step with your official body.`
      : isPnHub
        ? pnIntro
        : `${examLabel} prep for ${countryLabel}: choose lessons, flashcards, practice questions, or adaptive CAT-style exams next.`,
    description: isGenericIntl
      ? `This hub explains how NurseNest can support ${audienceLabel} learners targeting registration in ${countryLabel} without claiming to replace regulator materials.`
      : isPnHub
        ? pnDescription
        : `This area contains ${examLabel} learning and exam-prep resources for ${audienceLabel} learners in ${countryLabel}.`,
    includedNote: isGenericIntl
      ? `Study tiles link to the same lesson, flashcard, and question surfaces used for North American pathways where noted; formats may include NCLEX-style items for cognitive rehearsal and are not copies of regulator-specific examinations.`
      : isPnHub
        ? pnIncludedNote
        : `Included for this tier: ${examLabel} study resources, pathway-specific lessons, exam-style practice, and CAT readiness work for ${audienceLabel} learners in ${countryLabel}.`,
    startHere: isGenericIntl
      ? "Begin with Lessons for orientation, add Flashcards for recall, then use Practice Questions for drills. Treat optional adaptive sessions as reasoning practice only."
      : isPnHub
        ? pnStartHere
        : "Start with Lessons, then move into Practice Questions, CAT, and Exams as your confidence grows.",
    differenceHeading: isPnHub ? "How the modes fit PN / RPN prep" : "What is the difference?",
    differenceBody: isGenericIntl
      ? "Lessons summarise concepts, Flashcards speed recall, Practice Questions build judgement under time pressure, and optional adaptive sessions mirror NCLEX-style pacing—not regulator-owned exam designs."
      : isPnHub
        ? pnDifferenceBody
        : "Use Lessons for core concepts, Flashcards for recall, Practice Questions for focused drills, CAT for adaptive item-level sessions, and Exams for longer linear or timed practice-test sets.",
    actions: [
      {
        id: "lessons",
        label: resolveMarketingDisplayCopy({ curatedCopy: "Lessons" }),
        description: isPnHub ? actionsPnLessons : "Review concepts by topic.",
        href: marketingTierHubStudyActionHref(pathway, "lessons"),
      },
      {
        id: "flashcards",
        label: resolveMarketingDisplayCopy({ curatedCopy: "Flashcards" }),
        description: isPnHub ? actionsPnFlash : "Strengthen recall quickly.",
        href: marketingTierHubStudyActionHref(pathway, "flashcards"),
      },
      {
        id: "practice_questions",
        label: resolveMarketingDisplayCopy({ curatedCopy: "Practice Questions" }),
        description: isPnHub ? actionsPnPractice : "Drill by topic or weakness.",
        href: marketingTierHubStudyActionHref(pathway, "practice_questions"),
      },
      {
        id: "cat",
        label: resolveMarketingDisplayCopy({ curatedCopy: "CAT" }),
        description: isGenericIntl
          ? "Computer-adaptive practice (NCLEX-style pacing)."
          : isPnHub
            ? actionsPnCat
            : "Adaptive sessions that adjust difficulty from your answers, scoped to this pathway.",
        href: marketingTierHubStudyActionHref(pathway, "cat"),
        disabled: isGenericIntl,
        disabledNote: isGenericIntl
          ? "Adaptive sessions use NCLEX-style formats for cognitive rehearsal only. They are not the NMC CBT, AHPRA/NMBA assessments, or PRC PNLE."
          : undefined,
      },
      {
        id: "exams",
        label: resolveMarketingDisplayCopy({ curatedCopy: isGenericIntl ? "Exams" : "Practice Exam" }),
        description: isGenericIntl
          ? "Optional adaptive sessions (NCLEX-style pacing)."
          : isPnHub
            ? actionsPnExams
            : "Linear and timed practice-test sets in the app, scoped to this pathway.",
        href: marketingTierHubStudyActionHref(pathway, "exams"),
        disabled: isGenericIntl,
        disabledNote: isGenericIntl
          ? "Adaptive sessions use NCLEX-style formats for cognitive rehearsal only. They are not the NMC CBT, AHPRA/NMBA assessments, or PRC PNLE."
          : undefined,
      },
    ],
  };
}
