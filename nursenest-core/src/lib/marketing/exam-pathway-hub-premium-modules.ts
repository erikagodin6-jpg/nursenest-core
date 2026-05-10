import { TierCode } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Beaker,
  BookMarked,
  BookOpen,
  Brain,
  Briefcase,
  Calculator,
  CalendarClock,
  ClipboardCheck,
  Dna,
  FileStack,
  FlaskConical,
  GitBranch,
  GraduationCap,
  HeartPulse,
  Layers,
  LayoutGrid,
  LineChart,
  ListOrdered,
  MessageSquare,
  Microscope,
  Pill,
  RefreshCw,
  Route,
  Scale,
  Shield,
  Stethoscope,
  Target,
  Waves,
  Zap,
} from "lucide-react";
import type { CardVariant } from "@/components/ui/study-card";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { marketingCatPathForPathway } from "@/lib/exam-pathways/practice-exams-cat-start";
import { pathwayAllowsEcgLinkedLearning } from "@/lib/ecg-module/ecg-linked-learning";
import { isEcgModuleMarketingInventoryEnabled } from "@/lib/ecg-module/ecg-module-config";
import {
  pathwayHubAppFlashcardsHref,
  pathwayHubAppPracticeTestsHref,
  pathwayHubAppQuestionsHref,
  pathwayHubAppQuestionsPathwayMixedHref,
  pathwayHubAppWeakAreasFlashcardsHref,
} from "@/lib/marketing/pathway-hub-app-questions-href";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { alliedHealthSegmentPath, withAlliedProfessionMarketingQuery } from "@/lib/lessons/lesson-routes";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import {
  SCENARIO_LEARNER_ROUTES,
  withScenarioPathwayAndProfessionQuery,
  withScenarioPathwayQuery,
} from "@/lib/scenarios/scenario-routes";
import { isClinicalScenariosPubliclyEnabled } from "@/lib/clinical-scenarios/clinical-scenarios-feature-flag";
import { isOsceScenariosPubliclyEnabled } from "@/lib/scenarios/osce-scenarios-feature-flag";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";
import {
  alliedHubCatSurfaceUnlocked,
  applyAlliedOccupationPremiumModuleLocks,
} from "@/lib/marketing/allied-hub-premium-module-policy";

export type PremiumHubModuleKey =
  | "labs"
  | "med_calc"
  | "pharmacology"
  | "flashcards"
  | "practice_tests"
  | "ecg"
  | "clinical_cases"
  | "osce"
  | "progress"
  | "exam_plan"
  | "transition"
  | "clinical_judgment"
  /** Public marketing CAT landing for New Grad RN transition pathway (`data-nn-qa-hub-premium-module`). */
  | "new_grad_pathway_cat"
  | "skills_refresher"
  | "ngn_tools"
  | "weak_areas"
  | "pn_lesson_library"
  | "pn_anatomy"
  | "pn_cell_biology"
  | "pn_microbiology"
  | "pn_chemistry"
  | "pn_terminology"
  | "pn_study_plan"
  | "pn_study_skills"
  | "pn_clinical_reasoning"
  | "pn_patient_safety"
  | "pn_communication_pro"
  | "pn_skills_assessment"
  | "pn_ethics_professional"
  | "pn_mini_cat"
  | "pn_pathway_cat"
  | "pn_questions_hub"
  /** Marketing CAT landing for allied occupation hubs when {@link alliedHubCatSurfaceUnlocked}. */
  | "pathway_cat"
  /** Public marketing blog deep-link for the active allied occupation track. */
  | "allied_career_resources"
  /** Pathway marketing lessons directory (nursing tier hubs). */
  | "hub_lessons"
  /** Public marketing CAT explainer route (`/us/rn/nclex-rn/cat`, etc.) — nursing pathways only. */
  | "pathway_cat_landing"
  /** In-app clinical scenarios for RN/RPN/LPN tracks when the public scenarios flag is on (NP uses `clinical_cases`). */
  | "clinical_scenarios"
  /** New Grad strip — prioritization & delegation question focus. */
  | "new_grad_delegation";

export type PremiumModuleCardModel = {
  key: PremiumHubModuleKey;
  icon: LucideIcon;
  variant: CardVariant;
  extraClass?: string;
  titleKey: string;
  bodyKey: string;
  ctaKey: string;
  lockedCtaKey: string;
  /** Target href when unlocked (signed-in learners); guests may wrap with login callback. */
  href: string;
  /** When true, guests are sent through `/login?callbackUrl=` */
  wrapGuestWithLoginCallback: boolean;
  locked?: boolean;
  /** QA: RN/NP ECG surface — omitted entirely for PN/RPN tiers. */
  qaMarker?: "ecg" | "np_clinical" | "clinical_scenarios";
};

/** US/CA Pre-Nursing paid tier hubs (`pre-nursing`, `pre-nursing-ca`) — foundations ecosystem + subscriber apps. */
export function isPreNursingPremiumPathway(pathway: ExamPathwayDefinition): boolean {
  return pathway.stripeTier === TierCode.PRE_NURSING;
}

function isNewGradPathway(pathway: ExamPathwayDefinition): boolean {
  return pathway.id.includes("new-grad");
}

function isNpPathway(pathway: ExamPathwayDefinition): boolean {
  return pathway.roleTrack === "np";
}

export type PremiumMarketingModuleSections = {
  studyTools: PremiumModuleCardModel[];
  readiness: PremiumModuleCardModel[];
  /** Populated only for new graduate RN transition pathways — grouped separately from core study tools. */
  newGrad: PremiumModuleCardModel[];
};

/** Options for {@link buildPremiumMarketingModuleCards}. */
export type BuildPremiumMarketingModuleCardsOpts = {
  clinicalScenariosPublic?: boolean;
  oscePublic?: boolean;
  /**
   * When set (e.g. from `resolveMarketingHubEcgModulePublic`), hub ECG tile matches in-app publish gate.
   * When omitted, falls back to `isEcgModuleMarketingInventoryEnabled` for client-only surfaces.
   */
  ecgModulePublic?: boolean;
  alliedProfessionKey?: string | null;
};

function scopeAlliedAppHref(
  pathway: ExamPathwayDefinition,
  href: string,
  alliedProfessionKey?: string | null,
): string {
  const k = alliedProfessionKey?.trim();
  if (pathway.roleTrack !== "allied" || !k) return href;
  return withAlliedProfessionMarketingQuery(href, k);
}

function pushCoreStudyToolCards(
  pathway: ExamPathwayDefinition,
  clinicalOn: boolean,
  osceOn: boolean,
  ecgOn: boolean,
  studyTools: PremiumModuleCardModel[],
  alliedProfessionKey?: string | null,
): void {
  if (pathway.roleTrack !== "allied") {
    studyTools.push({
      key: "hub_lessons",
      icon: BookOpen,
      variant: "featured",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.hubLessonsTitle",
      bodyKey: "components.examPathwayHub.premiumModules.hubLessonsBody",
      ctaKey: "components.examPathwayHub.premiumModules.hubLessonsCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: buildExamPathwayPath(pathway, "lessons"),
      wrapGuestWithLoginCallback: false,
    });
  }

  studyTools.push({
    key: "flashcards",
    icon: Layers,
    variant: "default",
    extraClass: "nn-exam-hub-study-card--lessons",
    titleKey: "components.examPathwayHub.premiumModules.flashcardsTitle",
    bodyKey: "components.examPathwayHub.premiumModules.flashcardsBody",
    ctaKey: "components.examPathwayHub.premiumModules.flashcardsCta",
    lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
    href: scopeAlliedAppHref(pathway, pathwayHubAppFlashcardsHref(pathway.id), alliedProfessionKey),
    wrapGuestWithLoginCallback: true,
  });

  studyTools.push({
    key: "practice_tests",
    icon: FileStack,
    variant: "default",
    extraClass: "nn-exam-hub-study-card--cat",
    titleKey: "components.examPathwayHub.premiumModules.practiceTestsTitle",
    bodyKey: "components.examPathwayHub.premiumModules.practiceTestsBody",
    ctaKey: "components.examPathwayHub.premiumModules.practiceTestsCta",
    lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
    href: scopeAlliedAppHref(pathway, pathwayHubAppPracticeTestsHref(pathway.id), alliedProfessionKey),
    wrapGuestWithLoginCallback: true,
  });

  if (pathway.roleTrack !== "allied") {
    studyTools.push({
      key: "pathway_cat_landing",
      icon: Activity,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      titleKey: "components.examPathwayHub.premiumModules.pathwayCatLandingTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pathwayCatLandingBody",
      ctaKey: "components.examPathwayHub.premiumModules.pathwayCatLandingCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: marketingCatPathForPathway(pathway),
      wrapGuestWithLoginCallback: false,
    });
  }

  studyTools.push({
    key: "labs",
    icon: Beaker,
    variant: "default",
    extraClass: "nn-exam-hub-study-card--lessons",
    titleKey: "components.examPathwayHub.premiumModules.labsTitle",
    bodyKey: "components.examPathwayHub.premiumModules.labsBody",
    ctaKey: "components.examPathwayHub.premiumModules.labsCta",
    lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
    /** Core integrated Labs workstation (`/app/labs`) — same surface as learner dashboard quick-launch. */
    href: scopeAlliedAppHref(
      pathway,
      pathway.id?.trim()
        ? `/app/labs?pathwayId=${encodeURIComponent(pathway.id.trim())}`
        : "/app/labs",
      alliedProfessionKey,
    ),
    wrapGuestWithLoginCallback: true,
  });

  studyTools.push({
    key: "med_calc",
    icon: Calculator,
    variant: "default",
    extraClass: "nn-exam-hub-study-card--cat",
    titleKey: "components.examPathwayHub.premiumModules.medCalcTitle",
    bodyKey: "components.examPathwayHub.premiumModules.medCalcBody",
    ctaKey: "components.examPathwayHub.premiumModules.medCalcCta",
    lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
    href: scopeAlliedAppHref(
      pathway,
      withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.medCalculations, pathway.id),
      alliedProfessionKey,
    ),
    wrapGuestWithLoginCallback: true,
  });

  studyTools.push({
    key: "pharmacology",
    icon: Pill,
    variant: "featured",
    extraClass: "nn-exam-hub-study-card--featured",
    titleKey: "components.examPathwayHub.premiumModules.pharmTitle",
    bodyKey: "components.examPathwayHub.premiumModules.pharmBody",
    ctaKey: "components.examPathwayHub.premiumModules.pharmCta",
    lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
    href: scopeAlliedAppHref(pathway, pathwayHubAppQuestionsHref(pathway.id, "Pharmacology"), alliedProfessionKey),
    wrapGuestWithLoginCallback: true,
  });

  // NCLEX Next Gen tooling copy is nursing-pathway specific; allied hubs use the same mixed-questions
  // route via Practice exams + flashcards without implying RN/NP NGN branding.
  if (pathway.roleTrack !== "allied") {
    studyTools.push({
      key: "ngn_tools",
      icon: Brain,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.ngnToolsTitle",
      bodyKey: "components.examPathwayHub.premiumModules.ngnToolsBody",
      ctaKey: "components.examPathwayHub.premiumModules.ngnToolsCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: scopeAlliedAppHref(pathway, pathwayHubAppQuestionsPathwayMixedHref(pathway.id), alliedProfessionKey),
      wrapGuestWithLoginCallback: true,
    });
  }

  studyTools.push({
    key: "weak_areas",
    icon: BarChart3,
    variant: "default",
    extraClass: "nn-exam-hub-study-card--lessons",
    titleKey: "components.examPathwayHub.premiumModules.weakAreasTitle",
    bodyKey: "components.examPathwayHub.premiumModules.weakAreasBody",
    ctaKey: "components.examPathwayHub.premiumModules.weakAreasCta",
    lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
    href: scopeAlliedAppHref(pathway, pathwayHubAppWeakAreasFlashcardsHref(pathway.id), alliedProfessionKey),
    wrapGuestWithLoginCallback: true,
  });

  if (pathway.roleTrack !== "allied" && !isNpPathway(pathway)) {
    studyTools.push({
      key: "clinical_scenarios",
      icon: Briefcase,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.clinicalScenariosHubTitle",
      bodyKey: "components.examPathwayHub.premiumModules.clinicalScenariosHubBody",
      ctaKey: "components.examPathwayHub.premiumModules.clinicalScenariosHubCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.clinicalScenarios, pathway.id),
      wrapGuestWithLoginCallback: true,
      locked: !clinicalOn,
      qaMarker: "clinical_scenarios",
    });
  }

  if (pathwayAllowsEcgLinkedLearning(pathway)) {
    studyTools.push({
      key: "ecg",
      icon: Waves,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      titleKey: "components.examPathwayHub.premiumModules.ecgTitle",
      bodyKey: "components.examPathwayHub.premiumModules.ecgBody",
      ctaKey: "components.examPathwayHub.premiumModules.ecgCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: scopeAlliedAppHref(pathway, "/modules/ecg/basic/lessons", alliedProfessionKey),
      wrapGuestWithLoginCallback: true,
      locked: !ecgOn,
      qaMarker: "ecg",
    });
  }

  if (isNpPathway(pathway)) {
    studyTools.push({
      key: "clinical_cases",
      icon: GitBranch,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--lessons",
      titleKey: "components.examPathwayHub.premiumModules.clinicalCasesTitle",
      bodyKey: "components.examPathwayHub.premiumModules.clinicalCasesBody",
      ctaKey: "components.examPathwayHub.premiumModules.clinicalCasesCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.clinicalScenarios, pathway.id),
      wrapGuestWithLoginCallback: true,
      locked: !clinicalOn,
      qaMarker: "np_clinical",
    });
  }

  const osceHref =
    pathway.roleTrack === "allied"
      ? withScenarioPathwayAndProfessionQuery(SCENARIO_LEARNER_ROUTES.osce, pathway.id, alliedProfessionKey)
      : withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.osce, pathway.id);

  studyTools.push({
    key: "osce",
    icon: ClipboardCheck,
    variant: "default",
    extraClass: "nn-exam-hub-study-card--featured",
    titleKey: "components.examPathwayHub.premiumModules.osceTitle",
    bodyKey: "components.examPathwayHub.premiumModules.osceBody",
    ctaKey: "components.examPathwayHub.premiumModules.osceCta",
    lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
    href: osceHref,
    wrapGuestWithLoginCallback: true,
    locked: !osceOn,
  });
}

/** Premium grid additions for allied pathway hubs — CAT landing, scenarios, drills, career blog. */
function pushAlliedSupplementalPremiumStudyTools(
  pathway: ExamPathwayDefinition,
  clinicalOn: boolean,
  studyTools: PremiumModuleCardModel[],
  alliedProfessionKey?: string | null,
): void {
  if (pathway.roleTrack !== "allied") return;

  studyTools.push({
    key: "skills_refresher",
    icon: RefreshCw,
    variant: "default",
    extraClass: "nn-exam-hub-study-card--cat",
    titleKey: "components.examPathwayHub.premiumModules.skillsRefresherTitle",
    bodyKey: "components.examPathwayHub.premiumModules.skillsRefresherBodyAllied",
    ctaKey: "components.examPathwayHub.premiumModules.skillsRefresherCta",
    lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
    href: scopeAlliedAppHref(
      pathway,
      withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.medicationDrills, pathway.id),
      alliedProfessionKey,
    ),
    wrapGuestWithLoginCallback: true,
  });

  const k = alliedProfessionKey?.trim() ?? "";
  if (!k) return;

  if (alliedHubCatSurfaceUnlocked(k)) {
    studyTools.push({
      key: "pathway_cat",
      icon: Activity,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      titleKey: "components.examPathwayHub.premiumModules.pathwayCatTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pathwayCatBody",
      ctaKey: "components.examPathwayHub.premiumModules.pathwayCatCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: scopeAlliedAppHref(pathway, buildExamPathwayPath(pathway, "cat"), alliedProfessionKey),
      wrapGuestWithLoginCallback: false,
    });
  }

  if (isAlliedMarketingCorePathwayId(pathway.id)) {
    studyTools.push({
      key: "clinical_cases",
      icon: GitBranch,
      variant: "featured",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.alliedClinicalScenariosTitle",
      bodyKey: "components.examPathwayHub.premiumModules.alliedClinicalScenariosBody",
      ctaKey: "components.examPathwayHub.premiumModules.alliedClinicalScenariosCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.alliedClinicalScenariosLockedCta",
      href: withScenarioPathwayAndProfessionQuery(
        SCENARIO_LEARNER_ROUTES.clinicalScenarios,
        pathway.id,
        alliedProfessionKey,
      ),
      wrapGuestWithLoginCallback: true,
      locked: !clinicalOn,
    });
  }

  const prof = getAlliedProfessionByProfessionKey(k);
  if (prof) {
    studyTools.push({
      key: "allied_career_resources",
      icon: Briefcase,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--lessons",
      titleKey: "components.examPathwayHub.premiumModules.alliedCareerResourcesTitle",
      bodyKey: "components.examPathwayHub.premiumModules.alliedCareerResourcesBody",
      ctaKey: "components.examPathwayHub.premiumModules.alliedCareerResourcesCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: `${alliedHealthSegmentPath(prof.segment)}/blog`,
      wrapGuestWithLoginCallback: false,
    });
  }
}

function buildNewGradOnlyCards(pathway: ExamPathwayDefinition): PremiumModuleCardModel[] {
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = marketingCatPathForPathway(pathway);

  return [
    {
      key: "transition",
      icon: Route,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--lessons",
      titleKey: "components.examPathwayHub.premiumModules.transitionTitle",
      bodyKey: "components.examPathwayHub.premiumModules.transitionBody",
      ctaKey: "components.examPathwayHub.premiumModules.transitionCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: lessonsHref,
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "clinical_judgment",
      icon: Stethoscope,
      variant: "featured",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.clinicalJudgmentTitle",
      bodyKey: "components.examPathwayHub.premiumModules.clinicalJudgmentBody",
      ctaKey: "components.examPathwayHub.premiumModules.clinicalJudgmentCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: questionsHref,
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "new_grad_pathway_cat",
      icon: Activity,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      titleKey: "components.examPathwayHub.premiumModules.newGradPathwayCatTitle",
      bodyKey: "components.examPathwayHub.premiumModules.newGradPathwayCatBody",
      ctaKey: "components.examPathwayHub.premiumModules.newGradPathwayCatCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: catHref,
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "skills_refresher",
      icon: RefreshCw,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      titleKey: "components.examPathwayHub.premiumModules.skillsRefresherTitle",
      bodyKey: "components.examPathwayHub.premiumModules.skillsRefresherBody",
      ctaKey: "components.examPathwayHub.premiumModules.skillsRefresherCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.medicationDrills, pathway.id),
      wrapGuestWithLoginCallback: true,
    },
    {
      key: "new_grad_delegation",
      icon: ListOrdered,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--lessons",
      titleKey: "components.examPathwayHub.premiumModules.newGradDelegationTitle",
      bodyKey: "components.examPathwayHub.premiumModules.newGradDelegationBody",
      ctaKey: "components.examPathwayHub.premiumModules.newGradDelegationCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: pathwayHubAppQuestionsHref(pathway.id, "Prioritization"),
      wrapGuestWithLoginCallback: true,
    },
  ];
}

function preNursingLesson(slug: string): string {
  return `/pre-nursing/lessons/${slug}`;
}

/** Premium parity for `pre-nursing` / `pre-nursing-ca` marketing hubs — public foundations + subscriber apps. */
function buildPreNursingPremiumMarketingModuleCards(
  pathway: ExamPathwayDefinition,
  osceOn: boolean,
): PremiumMarketingModuleSections {
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catMarketingHref = buildExamPathwayPath(pathway, "cat");

  const studyTools: PremiumModuleCardModel[] = [
    {
      key: "pn_lesson_library",
      icon: LayoutGrid,
      variant: "featured",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.pnLessonLibraryTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnLessonLibraryBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnLessonLibraryCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: "/pre-nursing/lessons",
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "pn_anatomy",
      icon: HeartPulse,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--lessons",
      titleKey: "components.examPathwayHub.premiumModules.pnAnatomyTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnAnatomyBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnAnatomyCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: preNursingLesson("anatomy-physiology"),
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "pn_cell_biology",
      icon: Microscope,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      titleKey: "components.examPathwayHub.premiumModules.pnCellBiologyTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnCellBiologyBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnCellBiologyCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: preNursingLesson("cell-biology"),
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "pn_microbiology",
      icon: Dna,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--lessons",
      titleKey: "components.examPathwayHub.premiumModules.pnMicrobiologyTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnMicrobiologyBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnMicrobiologyCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: preNursingLesson("microbiology"),
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "pn_chemistry",
      icon: FlaskConical,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.pnChemistryTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnChemistryBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnChemistryCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: preNursingLesson("chemistry"),
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "pn_terminology",
      icon: BookMarked,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      titleKey: "components.examPathwayHub.premiumModules.pnTerminologyTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnTerminologyBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnTerminologyCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: preNursingLesson("medical-terminology"),
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "pn_study_skills",
      icon: GraduationCap,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--lessons",
      titleKey: "components.examPathwayHub.premiumModules.pnStudySkillsTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnStudySkillsBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnStudySkillsCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: preNursingLesson("study-strategies"),
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "pn_clinical_reasoning",
      icon: Brain,
      variant: "featured",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.pnClinicalReasoningTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnClinicalReasoningBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnClinicalReasoningCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: preNursingLesson("diagnostics"),
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "pn_patient_safety",
      icon: Shield,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      titleKey: "components.examPathwayHub.premiumModules.pnPatientSafetyTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnPatientSafetyBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnPatientSafetyCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: preNursingLesson("infection-control"),
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "pn_communication_pro",
      icon: MessageSquare,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--lessons",
      titleKey: "components.examPathwayHub.premiumModules.pnCommunicationTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnCommunicationBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnCommunicationCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: preNursingLesson("communication"),
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "pn_skills_assessment",
      icon: Stethoscope,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.pnSkillsAssessmentTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnSkillsAssessmentBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnSkillsAssessmentCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: preNursingLesson("health-assessment"),
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "pn_ethics_professional",
      icon: Scale,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      titleKey: "components.examPathwayHub.premiumModules.pnEthicsProfessionalTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnEthicsProfessionalBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnEthicsProfessionalCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: preNursingLesson("ethics-legal"),
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "pn_study_plan",
      icon: Target,
      variant: "featured",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.pnStudyPlanTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnStudyPlanBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnStudyPlanCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: "/pre-nursing/study-plan",
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "labs",
      icon: Beaker,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--lessons",
      titleKey: "components.examPathwayHub.premiumModules.labsTitle",
      bodyKey: "components.examPathwayHub.premiumModules.labsBody",
      ctaKey: "components.examPathwayHub.premiumModules.labsCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: pathway.id?.trim()
        ? `/app/labs?pathwayId=${encodeURIComponent(pathway.id.trim())}`
        : "/app/labs",
      wrapGuestWithLoginCallback: true,
    },
    {
      key: "med_calc",
      icon: Calculator,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      titleKey: "components.examPathwayHub.premiumModules.medCalcTitle",
      bodyKey: "components.examPathwayHub.premiumModules.medCalcBody",
      ctaKey: "components.examPathwayHub.premiumModules.medCalcCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.medCalculations, pathway.id),
      wrapGuestWithLoginCallback: true,
    },
    {
      key: "pharmacology",
      icon: Pill,
      variant: "featured",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.pharmTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pharmBody",
      ctaKey: "components.examPathwayHub.premiumModules.pharmCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: pathwayHubAppQuestionsHref(pathway.id, "Pharmacology"),
      wrapGuestWithLoginCallback: true,
    },
    {
      key: "flashcards",
      icon: Layers,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--lessons",
      titleKey: "components.examPathwayHub.premiumModules.flashcardsTitle",
      bodyKey: "components.examPathwayHub.premiumModules.flashcardsBody",
      ctaKey: "components.examPathwayHub.premiumModules.flashcardsCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: pathwayHubAppFlashcardsHref(pathway.id),
      wrapGuestWithLoginCallback: true,
    },
    {
      key: "practice_tests",
      icon: FileStack,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      titleKey: "components.examPathwayHub.premiumModules.practiceTestsTitle",
      bodyKey: "components.examPathwayHub.premiumModules.practiceTestsBody",
      ctaKey: "components.examPathwayHub.premiumModules.practiceTestsCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: pathwayHubAppPracticeTestsHref(pathway.id),
      wrapGuestWithLoginCallback: true,
    },
    {
      key: "weak_areas",
      icon: BarChart3,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--lessons",
      titleKey: "components.examPathwayHub.premiumModules.weakAreasTitle",
      bodyKey: "components.examPathwayHub.premiumModules.weakAreasBody",
      ctaKey: "components.examPathwayHub.premiumModules.weakAreasCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: pathwayHubAppWeakAreasFlashcardsHref(pathway.id),
      wrapGuestWithLoginCallback: true,
    },
    {
      key: "pn_questions_hub",
      icon: BookOpen,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--lessons",
      titleKey: "components.examPathwayHub.premiumModules.pnQuestionsHubTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnQuestionsHubBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnQuestionsHubCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: questionsHref,
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "pn_mini_cat",
      icon: Zap,
      variant: "featured",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.pnMiniCatTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnMiniCatBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnMiniCatCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: "/pre-nursing/mini-cat",
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "pn_pathway_cat",
      icon: Activity,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      titleKey: "components.examPathwayHub.premiumModules.pnPathwayCatTitle",
      bodyKey: "components.examPathwayHub.premiumModules.pnPathwayCatBody",
      ctaKey: "components.examPathwayHub.premiumModules.pnPathwayCatCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: catMarketingHref,
      wrapGuestWithLoginCallback: false,
    },
    {
      key: "osce",
      icon: ClipboardCheck,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.osceTitle",
      bodyKey: "components.examPathwayHub.premiumModules.osceBody",
      ctaKey: "components.examPathwayHub.premiumModules.osceCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.osce, pathway.id),
      wrapGuestWithLoginCallback: true,
      locked: !osceOn,
    },
  ];

  const readiness: PremiumModuleCardModel[] = [
    {
      key: "progress",
      icon: LineChart,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.progressTitle",
      bodyKey: "components.examPathwayHub.premiumModules.progressBody",
      ctaKey: "components.examPathwayHub.premiumModules.progressCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: "/app/account/progress",
      wrapGuestWithLoginCallback: true,
    },
    {
      key: "exam_plan",
      icon: CalendarClock,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      titleKey: "components.examPathwayHub.premiumModules.examPlanTitle",
      bodyKey: "components.examPathwayHub.premiumModules.examPlanBody",
      ctaKey: "components.examPathwayHub.premiumModules.examPlanCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: "/app/exam-plan",
      wrapGuestWithLoginCallback: true,
    },
  ];

  return { studyTools, readiness, newGrad: [] };
}

/**
 * Marketing-only premium tiles beneath the primary Lessons / Questions / CAT cards.
 * Server-safe: callers pass flags when they need deterministic tests without env mutation.
 */
export function buildPremiumMarketingModuleCards(
  pathway: ExamPathwayDefinition,
  opts?: BuildPremiumMarketingModuleCardsOpts,
): PremiumMarketingModuleSections {
  const clinicalOn = opts?.clinicalScenariosPublic ?? isClinicalScenariosPubliclyEnabled();
  const osceOn = opts?.oscePublic ?? isOsceScenariosPubliclyEnabled();
  const ecgOn = opts?.ecgModulePublic !== undefined ? opts.ecgModulePublic : isEcgModuleMarketingInventoryEnabled();
  const alliedProf = opts?.alliedProfessionKey ?? null;

  if (isPreNursingPremiumPathway(pathway)) {
    return buildPreNursingPremiumMarketingModuleCards(pathway, osceOn);
  }

  const studyTools: PremiumModuleCardModel[] = [];
  pushCoreStudyToolCards(pathway, clinicalOn, osceOn, ecgOn, studyTools, alliedProf);
  pushAlliedSupplementalPremiumStudyTools(pathway, clinicalOn, studyTools, alliedProf);
  if (pathway.roleTrack === "allied") {
    applyAlliedOccupationPremiumModuleLocks(alliedProf, studyTools);
  }

  const readiness: PremiumModuleCardModel[] = [
    {
      key: "progress",
      icon: LineChart,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--featured",
      titleKey: "components.examPathwayHub.premiumModules.progressTitle",
      bodyKey: "components.examPathwayHub.premiumModules.progressBody",
      ctaKey: "components.examPathwayHub.premiumModules.progressCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: scopeAlliedAppHref(pathway, "/app/account/progress", alliedProf),
      wrapGuestWithLoginCallback: true,
    },
    {
      key: "exam_plan",
      icon: CalendarClock,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      titleKey: "components.examPathwayHub.premiumModules.examPlanTitle",
      bodyKey: "components.examPathwayHub.premiumModules.examPlanBody",
      ctaKey: "components.examPathwayHub.premiumModules.examPlanCta",
      lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
      href: scopeAlliedAppHref(pathway, "/app/exam-plan", alliedProf),
      wrapGuestWithLoginCallback: true,
    },
  ];

  const newGrad = isNewGradPathway(pathway)
    ? buildNewGradOnlyCards(pathway).map((c) => ({
        ...c,
        href: scopeAlliedAppHref(pathway, c.href, alliedProf),
      }))
    : [];

  return { studyTools, readiness, newGrad };
}

export function resolvePremiumCardHref(model: PremiumModuleCardModel, isSignedIn: boolean): string {
  if (model.locked) return "/";
  if (!model.wrapGuestWithLoginCallback || isSignedIn) return model.href;
  return loginWithCallback(model.href);
}
