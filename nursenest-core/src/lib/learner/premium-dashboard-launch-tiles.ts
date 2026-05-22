import { TierCode } from "@prisma/client";
import {
  Activity,
  BookOpen,
  Brain,
  Calculator,
  Crosshair,
  FlaskConical,
  GitBranch,
  GraduationCap,
  HeartPulse,
  LayoutList,
  ListChecks,
  Pill,
  ScanSearch,
  Stethoscope,
  Theater,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { catStartHrefFromPremiumSnapshot } from "@/lib/learner/learner-dashboard-cat-start-href";
import {
  buildOptionalClinicalScenariosShellNavItem,
  buildOptionalOsceScenarioShellNavItems,
  CANONICAL_LEARNER_ROUTES,
  CLINICAL_SCENARIOS_SHELL_NAV_ID,
  OSCE_SHELL_NAV_ID,
} from "@/lib/navigation/learner-primary-nav";
import { isStudyToolsPubliclyEnabled } from "@/lib/study-tools/study-tools-feature-flag";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { isCnplePathway } from "@/lib/exam-pathways/cnple-pathway";
import { isPracticalNursingMarketingPathway } from "@/lib/marketing/is-practical-nursing-marketing-pathway";
import { isNpPremiumConvergencePathway } from "@/lib/marketing/np-premium-convergence-pathways";
import { pathwayAllowsEcgLinkedLearning } from "@/lib/ecg-module/ecg-linked-learning";
import { pathwayHubAppQuestionsHref, pathwayHubAppQuestionsPathwayMixedHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayQuery } from "@/lib/scenarios/scenario-routes";
import { isRtVentilatorLearnerModuleEnabled } from "@/lib/rt-ventilator/rt-ventilator-module-config";

export type PremiumLaunchTone = "success" | "info" | "chart3" | "chart4" | "brand" | "warning";

export type PremiumDashboardLaunchTile = {
  key: string;
  href: string;
  title: string;
  desc: string;
  cta: string;
  tone: PremiumLaunchTone;
  icon: LucideIcon;
};

function withPathwayQuery(base: string, pathwayId: string | null): string {
  if (!pathwayId) return base;
  const q = `pathwayId=${encodeURIComponent(pathwayId)}`;
  return base.includes("?") ? `${base}&${q}` : `${base}?${q}`;
}

function labsHref(pathwayId: string | null): string {
  return pathwayId?.trim()
    ? `/app/labs?pathwayId=${encodeURIComponent(pathwayId.trim())}`
    : "/app/labs";
}

export type PremiumDashboardLaunchVariant = "pn-practical" | "np-premium" | "standard";

/**
 * Canonical premium module order for dashboard quick-launch — Ocean structure, semantic tokens only.
 * Appends OSCE / scenarios / optional study-tools based on flags (same shell as marketing hubs).
 */
export function buildPremiumDashboardLaunchTiles(args: {
  t: LearnerMarketingT;
  snapshot: PremiumDashboardSnapshot;
  pathwayDef: ExamPathwayDefinition | null;
  pathwayId: string | null;
}): {
  tiles: PremiumDashboardLaunchTile[];
  variant: PremiumDashboardLaunchVariant;
  studyToolsPublic: { href: string } | null;
} {
  const { t, snapshot, pathwayDef, pathwayId } = args;

  const pnPractical = pathwayDef ? isPracticalNursingMarketingPathway(pathwayDef) : false;
  const npPremium = pathwayDef ? isNpPremiumConvergencePathway(pathwayDef) : false;
  const cnple = isCnplePathway(pathwayId ?? pathwayDef?.id ?? null);

  const lessonsHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.lessons, pathwayId);
  const flashHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.flashcards, pathwayId);
  const practiceHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.practice, pathwayId);
  const practiceTestsHref = withPathwayQuery("/app/practice-tests", pathwayId);
  const catHref = cnple ? "/app/cases/cnple" : catStartHrefFromPremiumSnapshot(snapshot);
  const labsTileHref = labsHref(pathwayId);
  const ecgHref = "/modules/ecg";
  const medCalcHref = withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.medCalculations, pathwayId);
  const clinicalSkillsHref = withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.clinicalSkills, pathwayId);

  const headTiles: PremiumDashboardLaunchTile[] = [
    {
      key: "lessons",
      href: lessonsHref,
      title: t("learner.shell.nav.lessons"),
      desc: t("learner.studyHome.quickLaunch.lessonsDesc"),
      cta: t("learner.studyModes.lessons.cta"),
      tone: "success",
      icon: BookOpen,
    },
    {
      key: "flashcards",
      href: flashHref,
      title: t("learner.shell.nav.flashcards"),
      desc: t("learner.studyHome.quickLaunch.flashcardsDesc"),
      cta: t("learner.studyModes.flashcards.cta"),
      tone: "chart3",
      icon: Brain,
    },
    {
      key: "practice",
      href: practiceHref,
      title: t("learner.shell.nav.practice"),
      desc: t("learner.studyHome.quickLaunch.practiceDesc"),
      cta: t("learner.studyModes.practice.cta"),
      tone: "info",
      icon: LayoutList,
    },
    {
      key: "practiceTests",
      href: practiceTestsHref,
      title: t("learner.studyHome.quickLaunch.practiceExamsTitle"),
      desc: t("learner.studyHome.quickLaunch.practiceExamsDesc"),
      cta: t("learner.studyHome.quickLaunch.practiceExamsCta"),
      tone: "brand",
      icon: ListChecks,
    },
    {
      key: cnple ? "cnpleLoftSimulation" : "cat",
      href: catHref,
      title: cnple ? "LOFT Simulation" : t("learner.shell.nav.cat"),
      desc: cnple
        ? "Practice the CNPLE linear case flow with Canadian NP clinical judgment scenarios."
        : t("learner.studyHome.quickLaunch.catDesc"),
      cta: t("learner.studyModes.cat.cta"),
      tone: "chart4",
      icon: cnple ? Theater : Crosshair,
    },
  ];

  const labsTile: PremiumDashboardLaunchTile = {
    key: "labs",
    href: labsTileHref,
    title: t("learner.studyHome.quickLaunch.labsTitle"),
    desc: t("learner.studyHome.quickLaunch.labsDesc"),
    cta: t("learner.studyHome.quickLaunch.labsCta"),
    tone: "info",
    icon: FlaskConical,
  };

  const ecgTile: PremiumDashboardLaunchTile = {
    key: "ecg",
    href: ecgHref,
    title: t("learner.studyHome.quickLaunch.ecgTitle"),
    desc: t("learner.studyHome.quickLaunch.ecgDesc"),
    cta: t("learner.studyHome.quickLaunch.ecgCta"),
    tone: "warning",
    icon: Activity,
  };

  const medCalcTile: PremiumDashboardLaunchTile = {
    key: "medCalculations",
    href: medCalcHref,
    title: t("components.examPathwayHub.premiumModules.medCalcTitle"),
    desc: t("components.examPathwayHub.premiumModules.medCalcBody"),
    cta: t("components.examPathwayHub.premiumModules.medCalcCta"),
    tone: "warning",
    icon: Calculator,
  };

  const clinicalSkillsTile: PremiumDashboardLaunchTile = {
    key: "clinicalSkills",
    href: clinicalSkillsHref,
    title: t("components.examPathwayHub.premiumModules.skillsRefresherTitle"),
    desc: t("components.examPathwayHub.premiumModules.skillsRefresherBody"),
    cta: t("components.examPathwayHub.premiumModules.skillsRefresherCta"),
    tone: "chart3",
    icon: HeartPulse,
  };

  const pid = pathwayId?.trim() ?? "";
  const pharmacologyTile: PremiumDashboardLaunchTile | null =
    pid.length > 0
      ? {
          key: "pharmacology",
          href: pathwayHubAppQuestionsHref(pid, "Pharmacology"),
          title: t("components.examPathwayHub.premiumModules.pharmTitle"),
          desc: t("components.examPathwayHub.premiumModules.pharmBody"),
          cta: t("components.examPathwayHub.premiumModules.pharmCta"),
          tone: "chart4",
          icon: Pill,
        }
      : null;

  const diagnosticTile: PremiumDashboardLaunchTile | null =
    pid.length > 0
      ? {
          key: "diagnosticReasoning",
          href: pathwayHubAppQuestionsPathwayMixedHref(pid),
          title: t("components.examPathwayHub.npPremium.diagnosticBlockTitle"),
          desc: t("learner.studyHome.quickLaunch.npDiagnosticDesc"),
          cta: t("learner.studyHome.quickLaunch.npDiagnosticCta"),
          tone: "brand",
          icon: ScanSearch,
        }
      : null;

  const clinicalCasesTile: PremiumDashboardLaunchTile | null =
    npPremium && pid.length > 0
      ? {
          key: "clinicalCases",
          href: withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.clinicalScenarios, pathwayId),
          title: t("components.examPathwayHub.premiumModules.clinicalCasesTitle"),
          desc: t("components.examPathwayHub.premiumModules.clinicalCasesBody"),
          cta: t("components.examPathwayHub.premiumModules.clinicalCasesCta"),
          tone: "chart4",
          icon: GitBranch,
        }
      : null;

  let coreTiles: PremiumDashboardLaunchTile[];
  let variant: PremiumDashboardLaunchVariant;

  if (pnPractical) {
    variant = "pn-practical";
    coreTiles = [labsTile, medCalcTile, clinicalSkillsTile];
    if (pharmacologyTile) coreTiles.push(pharmacologyTile);
    if (diagnosticTile) coreTiles.push(diagnosticTile);
    coreTiles = [...headTiles, ...coreTiles];
  } else if (npPremium && pathwayId) {
    variant = "np-premium";
    coreTiles = [...headTiles];
    if (pathwayDef && pathwayAllowsEcgLinkedLearning(pathwayDef)) {
      coreTiles.push(ecgTile);
    }
    coreTiles.push(labsTile, medCalcTile, clinicalSkillsTile);
    if (pharmacologyTile) coreTiles.push(pharmacologyTile);
    if (diagnosticTile) coreTiles.push(diagnosticTile);
    if (clinicalCasesTile) coreTiles.push(clinicalCasesTile);
  } else {
    variant = "standard";
    coreTiles = [...headTiles];
    if (pathwayDef && pathwayAllowsEcgLinkedLearning(pathwayDef)) {
      coreTiles.push(ecgTile);
    }
    coreTiles.push(labsTile, medCalcTile, clinicalSkillsTile);
    if (pharmacologyTile) coreTiles.push(pharmacologyTile);
    if (diagnosticTile) coreTiles.push(diagnosticTile);
  }

  const osceItems = buildOptionalOsceScenarioShellNavItems(pathwayId);
  const clinical = buildOptionalClinicalScenariosShellNavItem(pathwayId);
  const studyToolsPublic = isStudyToolsPubliclyEnabled()
    ? { href: withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.hub, pathwayId) }
    : null;

  const tiles: PremiumDashboardLaunchTile[] = [...coreTiles];

  for (const o of osceItems) {
    tiles.push({
      key: o.id,
      href: o.href,
      title: t(o.labelKey),
      desc: t("learner.studyHome.quickLaunch.osceDesc"),
      cta: t("learner.studyHome.quickLaunch.osceCta"),
      tone: "brand",
      icon: Stethoscope,
    });
  }

  if (clinical) {
    tiles.push({
      key: clinical.id,
      href: clinical.href,
      title: t(clinical.labelKey),
      desc: t("learner.studyHome.quickLaunch.scenariosDesc"),
      cta: t("learner.studyHome.quickLaunch.scenariosCta"),
      tone: "success",
      icon: Theater,
    });
  }

  if (studyToolsPublic && !pnPractical && !npPremium) {
    tiles.push({
      key: "study-tools",
      href: studyToolsPublic.href,
      title: t("learner.shell.nav.studyTools"),
      desc: t("learner.studyHome.quickLaunch.studyToolsDesc"),
      cta: t("learner.studyHome.quickLaunch.studyToolsCta"),
      tone: "chart3",
      icon: GraduationCap,
    });
  }

  if (
    isRtVentilatorLearnerModuleEnabled() &&
    snapshot.studyBootstrap.tier === TierCode.ALLIED &&
    snapshot.studyBootstrap.alliedProfessionKey === "respiratory"
  ) {
    tiles.push({
      key: "rtVentilator",
      href: "/modules/rt-ventilator",
      title: t("learner.studyHome.quickLaunch.rtVentilatorTitle"),
      desc: t("learner.studyHome.quickLaunch.rtVentilatorDesc"),
      cta: t("learner.studyHome.quickLaunch.rtVentilatorCta"),
      tone: "warning",
      icon: Wind,
    });
  }

  return { tiles, variant, studyToolsPublic };
}
