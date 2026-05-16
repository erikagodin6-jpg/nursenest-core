import { ExamFamily } from "@prisma/client";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { isCnplePathway } from "@/lib/exam-pathways/cnple-pathway";
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
    // CNPLE uses LOFT sessions (clinical cases), not the CAT adaptive engine.
    if (isCnplePathway(pathway.id)) {
      return opts.viewerSignedIn ? "/app/cases/cnple" : base;
    }
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
  const isCnpleHub = isCnplePathway(pathway.id);

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

  const cnpleIntro = `${examLabel} prep for ${countryLabel}: build Canadian NP clinical reasoning with lessons, domain-tagged practice questions, flashcards, linear LOFT simulation, and timed practice exams.`;
  const cnpleDescription =
    "This NP hub is organized as a full preparation pathway: learn the clinical domain, drill the question bank, reinforce weak areas, then rehearse the fixed-length CNPLE simulation format with post-run remediation.";
  const cnpleIncludedNote =
    "Included for this tier: Canadian NP lessons, explicit CNPLE-tagged practice questions, Canadian-aligned NP question-bank coverage, flashcards, fixed-length LOFT simulation, timed practice exams, and pathway analytics.";
  const cnpleStartHere =
    "Suggested loop: Lessons for clinical framing → Practice Questions for domain-by-domain judgment → Flashcards for weak-area recall → Simulation for LOFT stamina → Practice Exam for timed review and remediation.";
  const cnpleDifferenceBody =
    "Lessons teach Canadian NP assessment, diagnostics, prescribing logic, safety, and follow-up planning. Practice Questions are the main work block for item-level reasoning by domain. Flashcards preserve high-yield recall after misses. Simulation rehearses the CNPLE-style LOFT fixed-length experience, not CAT adaptive shutdown. Practice Exam blocks build timed stamina and expose weak slices before launch day.";

  const actionsCnpleLessons =
    "Canadian NP lessons for assessment, diagnostics, prescribing, chronic disease, pediatrics, women's health, mental health, safety, and follow-up planning.";
  const actionsCnplePractice =
    "Primary work block: CNPLE-tagged and Canadian-aligned NP questions by domain, with rationales connecting symptoms, diagnostics, prescribing, safety, and follow-up.";
  const actionsCnpleFlash =
    "Recall decks for high-yield Canadian NP labs, medications, screening, red flags, guidelines, and weak-area remediation after question misses.";
  const actionsCnpleSimulation =
    "LOFT linear simulation — fixed-length and fixed-sequence practice for CNPLE stamina. No CAT adaptive shutdown.";
  const actionsCnpleExams =
    "Timed linear practice-exam blocks for endurance, domain scoring, and remediation before repeating the full simulation.";

  return {
    audienceLabel,
    examLabel,
    title,
    intro: isGenericIntl
      ? `${examLabel} preparation context for ${countryLabel}: start with lessons and drills that strengthen transferable clinical judgement, then confirm every regulatory step with your official body.`
      : isPnHub
        ? pnIntro
        : isCnpleHub
          ? cnpleIntro
          : `${examLabel} prep for ${countryLabel}: choose lessons, practice questions, flashcards, or adaptive CAT-style exams next.`,
    description: isGenericIntl
      ? `This hub explains how NurseNest can support ${audienceLabel} learners targeting registration in ${countryLabel} without claiming to replace regulator materials.`
      : isPnHub
        ? pnDescription
        : isCnpleHub
          ? cnpleDescription
          : `This area contains ${examLabel} learning and exam-prep resources for ${audienceLabel} learners in ${countryLabel}.`,
    includedNote: isGenericIntl
      ? `Study tiles link to the same lesson, flashcard, and question surfaces used for North American pathways where noted; formats may include NCLEX-style items for cognitive rehearsal and are not copies of regulator-specific examinations.`
      : isPnHub
        ? pnIncludedNote
        : isCnpleHub
          ? cnpleIncludedNote
          : `Included for this tier: ${examLabel} study resources, pathway-specific lessons, exam-style practice, and CAT readiness work for ${audienceLabel} learners in ${countryLabel}.`,
    startHere: isGenericIntl
      ? "Begin with Lessons for orientation, add Practice Questions for drills, then use Flashcards for recall. Treat optional adaptive sessions as reasoning practice only."
      : isPnHub
        ? pnStartHere
        : isCnpleHub
          ? cnpleStartHere
          : "Start with Lessons, then move into Practice Questions, Flashcards, CAT, and Exams as your confidence grows.",
    differenceHeading: isPnHub ? "How the modes fit PN / RPN prep" : isCnpleHub ? "How the modes fit CNPLE prep" : "What is the difference?",
    differenceBody: isGenericIntl
      ? "Lessons summarise concepts, Practice Questions build judgement under time pressure, Flashcards speed recall, and optional adaptive sessions mirror NCLEX-style pacing—not regulator-owned exam designs."
      : isPnHub
        ? pnDifferenceBody
        : isCnpleHub
          ? cnpleDifferenceBody
          : "Use Lessons for core concepts, Practice Questions for focused drills, Flashcards for recall, CAT for adaptive item-level sessions, and Exams for longer linear or timed practice-test sets.",
    actions: [
      {
        id: "lessons",
        label: resolveMarketingDisplayCopy({ curatedCopy: "Lessons" }),
        description: isPnHub ? actionsPnLessons : isCnpleHub ? actionsCnpleLessons : "Review concepts by topic.",
        href: marketingTierHubStudyActionHref(pathway, "lessons"),
      },
      {
        id: "practice_questions",
        label: resolveMarketingDisplayCopy({ curatedCopy: "Practice Questions" }),
        description: isPnHub ? actionsPnPractice : isCnpleHub ? actionsCnplePractice : "Drill by topic or weakness.",
        href: marketingTierHubStudyActionHref(pathway, "practice_questions"),
      },
      {
        id: "flashcards",
        label: resolveMarketingDisplayCopy({ curatedCopy: "Flashcards" }),
        description: isPnHub ? actionsPnFlash : isCnpleHub ? actionsCnpleFlash : "Strengthen recall quickly.",
        href: marketingTierHubStudyActionHref(pathway, "flashcards"),
      },
      {
        id: "cat",
        // CNPLE uses LOFT (linear on-the-fly testing), NOT CAT adaptive.
        // The "cat" action ID is reused for both, but label/description/href differ.
        label: resolveMarketingDisplayCopy({
          curatedCopy: isCnpleHub ? "Simulation" : "CAT",
        }),
        description: isCnpleHub
          ? actionsCnpleSimulation
          : isGenericIntl
            ? "Computer-adaptive practice (NCLEX-style pacing)."
            : isPnHub
              ? actionsPnCat
              : "Adaptive sessions that adjust difficulty from your answers, scoped to this pathway.",
        href: isCnpleHub
          ? buildExamPathwayPath(pathway, "simulation")
          : marketingTierHubStudyActionHref(pathway, "cat"),
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
            : isCnpleHub
              ? actionsCnpleExams
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
