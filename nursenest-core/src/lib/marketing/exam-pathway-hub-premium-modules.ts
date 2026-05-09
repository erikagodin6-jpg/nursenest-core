import type { LucideIcon } from "lucide-react";
import {
  Beaker,
  Calculator,
  CalendarClock,
  ClipboardCheck,
  FileStack,
  GitBranch,
  Layers,
  LineChart,
  Pill,
  RefreshCw,
  Route,
  Stethoscope,
  Waves,
} from "lucide-react";
import type { CardVariant } from "@/components/ui/study-card";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { pathwayAllowsEcgLinkedLearning } from "@/lib/ecg-module/ecg-linked-learning";
import {
  pathwayHubAppFlashcardsHref,
  pathwayHubAppPracticeTestsHref,
  pathwayHubAppQuestionsHref,
} from "@/lib/marketing/pathway-hub-app-questions-href";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayQuery } from "@/lib/scenarios/scenario-routes";
import { isClinicalScenariosPubliclyEnabled } from "@/lib/clinical-scenarios/clinical-scenarios-feature-flag";
import { isOsceScenariosPubliclyEnabled } from "@/lib/scenarios/osce-scenarios-feature-flag";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";

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
  | "skills_refresher";

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
  qaMarker?: "ecg";
};

function isNewGradPathway(pathway: ExamPathwayDefinition): boolean {
  return pathway.id.includes("new-grad");
}

function isNpPathway(pathway: ExamPathwayDefinition): boolean {
  return pathway.roleTrack === "np";
}

/**
 * Marketing-only premium tiles beneath the primary Lessons / Questions / CAT cards.
 * Server-safe: callers pass flags when they need deterministic tests without env mutation.
 */
export function buildPremiumMarketingModuleCards(
  pathway: ExamPathwayDefinition,
  opts?: {
    clinicalScenariosPublic?: boolean;
    oscePublic?: boolean;
  },
): { studyTools: PremiumModuleCardModel[]; readiness: PremiumModuleCardModel[] } {
  const clinicalOn = opts?.clinicalScenariosPublic ?? isClinicalScenariosPubliclyEnabled();
  const osceOn = opts?.oscePublic ?? isOsceScenariosPubliclyEnabled();

  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const questionsHref = buildExamPathwayPath(pathway, "questions");

  const studyTools: PremiumModuleCardModel[] = [];

  studyTools.push({
    key: "labs",
    icon: Beaker,
    variant: "default",
    extraClass: "nn-exam-hub-study-card--lessons",
    titleKey: "components.examPathwayHub.premiumModules.labsTitle",
    bodyKey: "components.examPathwayHub.premiumModules.labsBody",
    ctaKey: "components.examPathwayHub.premiumModules.labsCta",
    lockedCtaKey: "components.examPathwayHub.premiumModules.comingSoonCta",
    href: withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.labDrills, pathway.id),
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
    href: withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.medCalculations, pathway.id),
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
    href: pathwayHubAppQuestionsHref(pathway.id, "Pharmacology"),
    wrapGuestWithLoginCallback: true,
  });

  studyTools.push({
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
    href: pathwayHubAppPracticeTestsHref(pathway.id),
    wrapGuestWithLoginCallback: true,
  });

  if (isNewGradPathway(pathway)) {
    studyTools.push({
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
    });
    studyTools.push({
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
    });
    studyTools.push({
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
      href: "/modules/ecg/basic/lessons",
      wrapGuestWithLoginCallback: true,
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
    });
  }

  studyTools.push({
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
  });

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

  return { studyTools, readiness };
}

export function resolvePremiumCardHref(model: PremiumModuleCardModel, isSignedIn: boolean): string {
  if (model.locked) return "/";
  if (!model.wrapGuestWithLoginCallback || isSignedIn) return model.href;
  return loginWithCallback(model.href);
}
