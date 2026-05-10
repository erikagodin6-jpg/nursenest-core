import Link from "next/link";
import {
  Activity,
  BookOpen,
  Brain,
  Calculator,
  Crosshair,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  LayoutList,
  ListChecks,
  Pill,
  ScanSearch,
  Stethoscope,
  Theater,
} from "lucide-react";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { catStartHrefFromPremiumSnapshot } from "@/lib/learner/learner-dashboard-cat-start-href";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import {
  buildOptionalClinicalScenariosShellNavItem,
  buildOptionalOsceScenarioShellNavItems,
  CANONICAL_LEARNER_ROUTES,
  CLINICAL_SCENARIOS_SHELL_NAV_ID,
  OSCE_SHELL_NAV_ID,
} from "@/lib/navigation/learner-primary-nav";
import { isStudyToolsPubliclyEnabled } from "@/lib/study-tools/study-tools-feature-flag";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { isPracticalNursingMarketingPathway } from "@/lib/marketing/is-practical-nursing-marketing-pathway";
import { isNpPremiumConvergencePathway } from "@/lib/marketing/np-premium-convergence-pathways";
import { pathwayAllowsEcgLinkedLearning } from "@/lib/ecg-module/ecg-linked-learning";
import {
  pathwayHubAppQuestionsHref,
  pathwayHubAppQuestionsPathwayMixedHref,
} from "@/lib/marketing/pathway-hub-app-questions-href";

function withPathwayQuery(base: string, pathwayId: string | null): string {
  if (!pathwayId) return base;
  const q = `pathwayId=${encodeURIComponent(pathwayId)}`;
  return base.includes("?") ? `${base}&${q}` : `${base}?${q}`;
}

type LaunchTone = "success" | "info" | "chart3" | "chart4" | "brand" | "warning";

function toneClasses(tone: LaunchTone): { wrap: string; icon: string; cta: string } {
  switch (tone) {
    case "success":
      return {
        wrap: "border-[color-mix(in_srgb,var(--semantic-success)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_07%,var(--semantic-surface))]",
        icon: "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-success)]",
        cta: "text-[var(--semantic-success)]",
      };
    case "info":
      return {
        wrap: "border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))]",
        icon: "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] text-[var(--semantic-info)]",
        cta: "text-[var(--semantic-info)]",
      };
    case "chart3":
      return {
        wrap: "border-[color-mix(in_srgb,var(--semantic-chart-3)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_07%,var(--semantic-surface))]",
        icon: "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-3)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-3)_92%,var(--semantic-text-primary))]",
        cta: "text-[color-mix(in_srgb,var(--semantic-chart-3)_88%,var(--semantic-text-primary))]",
      };
    case "chart4":
      return {
        wrap: "border-[color-mix(in_srgb,var(--semantic-chart-4)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_09%,var(--semantic-surface))]",
        icon: "border-[color-mix(in_srgb,var(--semantic-chart-4)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-4)_92%,var(--semantic-text-primary))]",
        cta: "text-[color-mix(in_srgb,var(--semantic-chart-4)_90%,var(--semantic-text-primary))]",
      };
    case "brand":
      return {
        wrap: "border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))]",
        icon: "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)]",
        cta: "text-[var(--semantic-brand)]",
      };
    case "warning":
    default:
      return {
        wrap: "border-[color-mix(in_srgb,var(--semantic-warning)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))]",
        icon: "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] text-[var(--semantic-warning)]",
        cta: "text-[color-mix(in_srgb,var(--semantic-warning)_85%,var(--semantic-text-primary))]",
      };
  }
}

type TileSpec = {
  key: string;
  href: string;
  title: string;
  desc: string;
  cta: string;
  tone: LaunchTone;
  icon: typeof BookOpen;
};

/**
 * Horizontal quick-launch for clinical workstations — same DOM for Ocean / Blossom / Midnight.
 * PN/RPN practical pathways swap ECG for medication math + clinical skills hub emphasis (policy-aligned).
 */
export function LearnerHubClinicalQuickLaunch({
  t,
  snapshot,
}: {
  t: LearnerMarketingT;
  snapshot: PremiumDashboardSnapshot;
}) {
  const pathwayId =
    snapshot.pathways.find((p) => p.pathwayId === snapshot.learnerPath)?.pathwayId ??
    snapshot.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ??
    snapshot.pathways[0]?.pathwayId ??
    null;

  const pathwayDef = pathwayId ? getExamPathwayById(pathwayId) : null;
  const pnPractical = pathwayDef ? isPracticalNursingMarketingPathway(pathwayDef) : false;
  const npPremium = pathwayDef ? isNpPremiumConvergencePathway(pathwayDef) : false;

  const lessonsHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.lessons, pathwayId);
  const flashHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.flashcards, pathwayId);
  const practiceHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.practice, pathwayId);
  const practiceTestsHref = withPathwayQuery("/app/practice-tests", pathwayId);
  const catHref = catStartHrefFromPremiumSnapshot(snapshot);
  const labsHref = "/app/labs";
  const ecgHref = "/modules/ecg/basic/lessons";
  const medCalcHref = withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.medCalculations, pathwayId);
  const clinicalSkillsHref = withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.hub, pathwayId);

  const osceItems = buildOptionalOsceScenarioShellNavItems(pathwayId);
  const clinical = buildOptionalClinicalScenariosShellNavItem(pathwayId);
  const studyToolsPublic = isStudyToolsPubliclyEnabled()
    ? { href: withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.hub, pathwayId) }
    : null;

  const labsTile: TileSpec = {
    key: "labs",
    href: labsHref,
    title: t("learner.studyHome.quickLaunch.labsTitle"),
    desc: t("learner.studyHome.quickLaunch.labsDesc"),
    cta: t("learner.studyHome.quickLaunch.labsCta"),
    tone: "info",
    icon: FlaskConical,
  };

  const ecgTile: TileSpec = {
    key: "ecg",
    href: ecgHref,
    title: t("learner.studyHome.quickLaunch.ecgTitle"),
    desc: t("learner.studyHome.quickLaunch.ecgDesc"),
    cta: t("learner.studyHome.quickLaunch.ecgCta"),
    tone: "warning",
    icon: Activity,
  };

  const headTiles: TileSpec[] = [
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
      key: "cat",
      href: catHref,
      title: t("learner.shell.nav.cat"),
      desc: t("learner.studyHome.quickLaunch.catDesc"),
      cta: t("learner.studyModes.cat.cta"),
      tone: "chart4",
      icon: Crosshair,
    },
  ];

  let coreTiles: TileSpec[];

  if (pnPractical) {
    coreTiles = [...headTiles, labsTile];
    coreTiles.push(
      {
        key: "medCalculations",
        href: medCalcHref,
        title: t("components.examPathwayHub.premiumModules.medCalcTitle"),
        desc: t("components.examPathwayHub.premiumModules.medCalcBody"),
        cta: t("components.examPathwayHub.premiumModules.medCalcCta"),
        tone: "warning",
        icon: Calculator,
      },
      {
        key: "clinicalSkills",
        href: clinicalSkillsHref,
        title: t("components.examPathwayHub.premiumModules.skillsRefresherTitle"),
        desc: t("components.examPathwayHub.premiumModules.skillsRefresherBody"),
        cta: t("components.examPathwayHub.premiumModules.skillsRefresherCta"),
        tone: "chart3",
        icon: HeartPulse,
      },
    );
  } else if (npPremium && pathwayId) {
    coreTiles = [...headTiles];
    if (pathwayDef && pathwayAllowsEcgLinkedLearning(pathwayDef)) {
      coreTiles.push(ecgTile);
    }
    coreTiles.push(
      labsTile,
      {
        key: "pharmacology",
        href: pathwayHubAppQuestionsHref(pathwayId, "Pharmacology"),
        title: t("components.examPathwayHub.premiumModules.pharmTitle"),
        desc: t("learner.studyHome.quickLaunch.npPharmDesc"),
        cta: t("components.examPathwayHub.premiumModules.pharmCta"),
        tone: "chart4",
        icon: Pill,
      },
      {
        key: "diagnosticReasoning",
        href: pathwayHubAppQuestionsPathwayMixedHref(pathwayId),
        title: t("components.examPathwayHub.npPremium.diagnosticBlockTitle"),
        desc: t("learner.studyHome.quickLaunch.npDiagnosticDesc"),
        cta: t("learner.studyHome.quickLaunch.npDiagnosticCta"),
        tone: "brand",
        icon: ScanSearch,
      },
    );
  } else {
    coreTiles = [...headTiles, labsTile, ecgTile];
  }

  const tiles: TileSpec[] = [...coreTiles];

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

  return (
    <div
      className={`nn-cockpit-quick-actions nn-dash-hub-quick-launch flex min-w-0 gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden${pnPractical ? " nn-dash-hub-quick-launch--pn-practical" : ""}${npPremium ? " nn-dash-hub-quick-launch--np-premium" : ""}`}
      data-testid="learner-hub-clinical-quick-launch"
      {...(pnPractical ? { "data-nn-pn-practical-quick-launch": "" } : {})}
      {...(npPremium ? { "data-nn-np-premium-quick-launch": "" } : {})}
    >
      {tiles.map((tile) => {
        const tc = toneClasses(tile.tone);
        const Icon = tile.icon;
        return (
          <Link
            key={tile.key}
            href={tile.href}
            className={`group flex min-h-[7.5rem] min-w-[10.5rem] max-w-[14rem] shrink-0 snap-start flex-col justify-between rounded-2xl border p-3.5 shadow-[var(--semantic-shadow-soft)] transition-[transform,box-shadow] duration-200 sm:min-h-0 sm:min-w-0 sm:max-w-none sm:flex-1 sm:p-4 ${tc.wrap} hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none`}
            {...(tile.key === "labs" ? { "data-nn-qa-dash-labs-launch": "1" as const } : {})}
            {...(tile.key === OSCE_SHELL_NAV_ID ? { "data-nn-qa-dash-osce-launch": "1" as const } : {})}
            {...(tile.key === CLINICAL_SCENARIOS_SHELL_NAV_ID ? { "data-nn-qa-dash-clinical-scenarios": "1" as const } : {})}
            {...(tile.key === "medCalculations" ? { "data-nn-qa-dash-med-calc-launch": "1" as const } : {})}
          >
            <div className="flex items-start gap-2.5">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-[1.02] ${tc.icon}`}
              >
                <Icon className="h-4 w-4" aria-hidden strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <h3 className="text-xs font-bold leading-tight text-[var(--semantic-text-primary)]">{tile.title}</h3>
                <p className="mt-1 text-[10px] leading-snug text-[var(--semantic-text-secondary)]">{tile.desc}</p>
              </div>
            </div>
            <span className={`mt-2 text-[10px] font-semibold sm:text-xs ${tc.cta} group-hover:underline`}>{tile.cta}</span>
          </Link>
        );
      })}
    </div>
  );
}
