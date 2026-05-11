"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Activity, Beaker, BookOpen, Brain, ClipboardList, Layers, Pill, Stethoscope, Target, Waves } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { marketingCatPathForPathway } from "@/lib/exam-pathways/practice-exams-cat-start";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { publicCopyForReadinessConfig, readinessConfigForPathway } from "@/lib/exam-pathways/pathway-readiness-config";
import { ECG_MODULE_ENTRY, pathwayAllowsEcgLinkedLearning } from "@/lib/ecg-module/ecg-linked-learning";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import {
  pathwayHubAppFlashcardsHref,
  pathwayHubAppPracticeTestsHref,
  pathwayHubAppQuestionsHref,
  pathwayHubAppQuestionsPathwayMixedHref,
  pathwayHubAppWeakAreasFlashcardsHref,
} from "@/lib/marketing/pathway-hub-app-questions-href";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { PathwayHubResumePayload } from "@/lib/learner/pathway-lesson-continuation";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayQuery } from "@/lib/scenarios/scenario-routes";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";

type Props = {
  pathway: ExamPathwayDefinition;
  hubPath: string;
  viewerSignedIn: boolean;
  hubResume?: PathwayHubResumePayload | null;
  npSeoAliasSegment?: string;
  /** Matches {@link ExamPathwayHubPremiumModules} / marketing hub ECG publish gate. */
  ecgModulePublic?: boolean;
  /** Server-resolved public scenario gates — avoids client/env drift for lock styling. */
  clinicalScenariosPublic: boolean;
  oscePublic: boolean;
};

function wrapApp(href: string, signedIn: boolean): string {
  if (signedIn) return href;
  return loginWithCallback(href);
}

function MiniReportBand({
  label,
  pct,
  trackClass,
}: {
  label: string;
  pct: number;
  trackClass?: string;
}) {
  const fill = semanticFillClassForAccuracyPct(pct);
  return (
    <div className="min-w-0 space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-xs font-semibold text-[var(--semantic-text-secondary)]">{label}</span>
        <span className="shrink-0 tabular-nums text-xs font-bold text-[var(--palette-heading)]">{Math.round(pct)}%</span>
      </div>
      <div
        className={`nn-progress-track-semantic h-2.5 overflow-hidden rounded-full ${trackClass ?? ""}`}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className={`h-full rounded-full transition-[width] duration-500 ${fill}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function NpPremiumHubWorkstation({
  pathway,
  hubPath,
  viewerSignedIn,
  hubResume = null,
  npSeoAliasSegment,
  ecgModulePublic = false,
  clinicalScenariosPublic,
  oscePublic,
}: Props) {
  const { t } = useMarketingI18n();
  const linkCtx = pathwayMarketingHubLinkContext(pathway, npSeoAliasSegment);
  const rc = useMemo(() => readinessConfigForPathway(pathway), [pathway]);
  const pub = useMemo(() => publicCopyForReadinessConfig(rc, pathway), [rc, pathway]);
  const trackLabel = (pathway.boardLabel ?? pathway.shortName).trim();

  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const catMarketingHref = marketingCatPathForPathway(pathway);
  const catAppHref = appPathwayCatSessionStartPath(pathway.id);
  const pharmHref = pathwayHubAppQuestionsHref(pathway.id, "Pharmacology");
  const diagnosticHref = pathwayHubAppQuestionsPathwayMixedHref(pathway.id);
  const labsHref = "/app/labs";
  const ecgHref = ECG_MODULE_ENTRY;
  const casesHref = withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.clinicalScenarios, pathway.id);
  const osceHref = withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.osce, pathway.id);
  const flashHref = pathwayHubAppFlashcardsHref(pathway.id);
  const practiceHref = pathwayHubAppPracticeTestsHref(pathway.id);
  const weakHref = pathwayHubAppWeakAreasFlashcardsHref(pathway.id);
  const progressHref = "/app/account/progress";
  const examPlanHref = "/app/exam-plan";

  const ecgAllowed = pathwayAllowsEcgLinkedLearning(pathway);
  const ecgLocked = ecgAllowed && !ecgModulePublic;

  const lessonMomentumPct = Math.min(
    100,
    Math.max(18, (hubResume?.lessonsInProgress ?? 0) * 22 + (hubResume?.nextRecommended ? 12 : 0)),
  );
  const calibrationPct = 62;
  const reasoningPct = 78;

  const quickTiles: {
    key: string;
    label: string;
    href: string;
    icon: typeof BookOpen;
    locked?: boolean;
    prefetch?: boolean;
  }[] = [
    { key: "lessons", label: t("components.examPathwayHub.premiumModules.hubLessonsTitle"), href: lessonsHref, icon: BookOpen },
    { key: "flashcards", label: t("components.examPathwayHub.premiumModules.flashcardsTitle"), href: wrapApp(flashHref, viewerSignedIn), icon: Layers, prefetch: false },
    {
      key: "practice",
      label: t("components.examPathwayHub.premiumModules.practiceTestsTitle"),
      href: wrapApp(practiceHref, viewerSignedIn),
      icon: Target,
      prefetch: false,
    },
    {
      key: "cat",
      label: t("components.examPathwayHub.premiumModules.pathwayCatLandingTitle"),
      href: viewerSignedIn ? catAppHref : catMarketingHref,
      icon: Brain,
      prefetch: false,
    },
    { key: "labs", label: t("components.examPathwayHub.premiumModules.labsTitle"), href: wrapApp(labsHref, viewerSignedIn), icon: Beaker, prefetch: false },
    ...(ecgAllowed
      ? [
          {
            key: "ecg",
            label: t("components.examPathwayHub.premiumModules.ecgTitle"),
            href: ecgLocked ? buildExamPathwayPath(pathway) : wrapApp(ecgHref, viewerSignedIn),
            icon: Waves,
            locked: ecgLocked,
            prefetch: false as const,
          },
        ]
      : []),
    {
      key: "cases",
      label: t("components.examPathwayHub.premiumModules.clinicalCasesTitle"),
      href: clinicalScenariosPublic ? wrapApp(casesHref, viewerSignedIn) : buildExamPathwayPath(pathway),
      icon: Stethoscope,
      locked: !clinicalScenariosPublic,
      prefetch: false,
    },
    {
      key: "osce",
      label: t("components.examPathwayHub.premiumModules.osceTitle"),
      href: oscePublic ? wrapApp(osceHref, viewerSignedIn) : buildExamPathwayPath(pathway),
      icon: ClipboardList,
      locked: !oscePublic,
      prefetch: false,
    },
    {
      key: "pharm",
      label: t("components.examPathwayHub.premiumModules.pharmTitle"),
      href: wrapApp(pharmHref, viewerSignedIn),
      icon: Pill,
      prefetch: false,
    },
    {
      key: "diagnostic",
      label: t("components.examPathwayHub.npPremium.diagnosticBlockTitle"),
      href: wrapApp(diagnosticHref, viewerSignedIn),
      icon: Activity,
      prefetch: false,
    },
  ];

  return (
    <div
      className="nn-np-premium-workstation nn-np-premium-workstation--dense mt-8 space-y-7"
      data-nn-np-premium-workstation="1"
      data-pathway-id={pathway.id}
    >
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">
          {t("components.examPathwayHub.npPremium.workstationEyebrow")}
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="min-w-0 space-y-4">
            <h2 className="nn-marketing-h3 text-balance text-[var(--palette-heading)]">
              {t("components.examPathwayHub.npPremium.readinessTitle")}
            </h2>
            <p className="nn-marketing-body-sm max-w-2xl text-pretty text-[var(--semantic-text-secondary)]">
              {t("components.examPathwayHub.npPremium.readinessLead")}
            </p>
            <dl className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_8%,var(--semantic-surface))] p-3">
                <dt className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--semantic-chart-2)]">
                  {t("components.examPathwayHub.npPremium.metricItemBand")}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-[var(--palette-heading)]">{rc.questionRange}</dd>
              </div>
              <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_8%,var(--semantic-surface))] p-3">
                <dt className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--semantic-chart-3)]">
                  {t("components.examPathwayHub.npPremium.metricTimer")}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-[var(--palette-heading)]">{rc.timeEstimate}</dd>
              </div>
              <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_8%,var(--semantic-surface))] p-3">
                <dt className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--semantic-chart-4)]">
                  {t("components.examPathwayHub.npPremium.metricModeShort")}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-[var(--palette-heading)]">{pub.experienceLabel}</dd>
              </div>
            </dl>
            <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{pub.subtitle}</p>
          </div>

          <div className="min-w-0 space-y-4 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_10%,var(--semantic-surface))] p-4 sm:p-5">
            <h3 className="text-sm font-bold text-[var(--palette-heading)]">{t("components.examPathwayHub.npPremium.reportTitle")}</h3>
            <p className="text-xs text-[var(--semantic-text-secondary)]">{t("components.examPathwayHub.npPremium.reportBody")}</p>
            <div className="space-y-4 pt-1">
              <MiniReportBand label={t("components.examPathwayHub.npPremium.reportBandMomentumLabel")} pct={lessonMomentumPct} />
              <MiniReportBand label={t("components.examPathwayHub.npPremium.reportBandConfidenceLabel")} pct={calibrationPct} />
              <MiniReportBand label={t("components.examPathwayHub.npPremium.reportBandExamDepthLabel")} pct={reasoningPct} />
            </div>
            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap">
              <MarketingTrackedLink
                href={wrapApp(weakHref, viewerSignedIn)}
                event={PH.marketingPathwayHubCta}
                eventProps={{
                  ...linkCtx,
                  surface: "np_premium_workstation",
                  pathway_id: pathway.id,
                  signed_in: viewerSignedIn,
                  destination_type: "weak_areas",
                  link_target: "weak_areas",
                  hub_path: hubPath,
                }}
                className="text-xs font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
              >
                {t("components.examPathwayHub.premiumModules.weakAreasCta")}
              </MarketingTrackedLink>
              <MarketingTrackedLink
                href={wrapApp(progressHref, viewerSignedIn)}
                event={PH.marketingPathwayHubCta}
                eventProps={{
                  ...linkCtx,
                  surface: "np_premium_workstation",
                  pathway_id: pathway.id,
                  signed_in: viewerSignedIn,
                  destination_type: "progress",
                  link_target: "account_progress",
                  hub_path: hubPath,
                }}
                className="text-xs font-semibold text-[var(--semantic-info)] underline-offset-2 hover:underline"
              >
                {t("components.examPathwayHub.premiumModules.progressCta")}
              </MarketingTrackedLink>
              <MarketingTrackedLink
                href={wrapApp(examPlanHref, viewerSignedIn)}
                event={PH.marketingPathwayHubCta}
                eventProps={{
                  ...linkCtx,
                  surface: "np_premium_workstation",
                  pathway_id: pathway.id,
                  signed_in: viewerSignedIn,
                  destination_type: "exam_plan",
                  link_target: "exam_plan",
                  hub_path: hubPath,
                }}
                className="text-xs font-semibold text-[var(--semantic-chart-3)] underline-offset-2 hover:underline"
              >
                {t("components.examPathwayHub.premiumModules.examPlanCta")}
              </MarketingTrackedLink>
            </div>
          </div>
        </div>
      </div>

      <section
        className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_8%,var(--semantic-surface))] p-5 sm:p-6"
        aria-labelledby="np-premium-specialty-heading"
      >
        <h2 id="np-premium-specialty-heading" className="nn-marketing-h3 text-[var(--palette-heading)]">
          {t("components.examPathwayHub.npPremium.specialtyTitle", { track: trackLabel })}
        </h2>
        <p className="nn-marketing-body-sm mt-2 max-w-3xl text-pretty text-[var(--semantic-text-secondary)]">
          {t("components.examPathwayHub.npPremium.specialtyLead")}
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          <li className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-chart-2)]">
              {t("components.examPathwayHub.npPremium.diagnosticBlockTitle")}
            </p>
            <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("components.examPathwayHub.npPremium.diagnosticBlockBody")}</p>
            <MarketingTrackedLink
              href={wrapApp(diagnosticHref, viewerSignedIn)}
              className="mt-3 inline-flex text-xs font-semibold text-[var(--semantic-brand)] hover:underline"
              event={PH.marketingPathwayHubCta}
              eventProps={{
                ...linkCtx,
                surface: "np_premium_diagnostic",
                pathway_id: pathway.id,
                signed_in: viewerSignedIn,
                link_target: "mixed_questions",
                hub_path: hubPath,
              }}
            >
              {t("components.examPathwayHub.premiumModules.ngnToolsCta")}
            </MarketingTrackedLink>
            <p className="mt-2 text-[0.65rem] text-[var(--semantic-text-secondary)]">
              {t("components.examPathwayHub.npPremium.diagnosticRouteNote")}
            </p>
          </li>
          <li className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-chart-4)]">
              {t("components.examPathwayHub.npPremium.pharmBlockTitle")}
            </p>
            <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("components.examPathwayHub.npPremium.pharmBlockBody")}</p>
            <MarketingTrackedLink
              href={wrapApp(pharmHref, viewerSignedIn)}
              className="mt-3 inline-flex text-xs font-semibold text-[var(--semantic-chart-4)] hover:underline"
              event={PH.marketingPathwayHubCta}
              eventProps={{
                ...linkCtx,
                surface: "np_premium_pharm",
                pathway_id: pathway.id,
                signed_in: viewerSignedIn,
                link_target: "pharmacology_questions",
                hub_path: hubPath,
              }}
            >
              {t("components.examPathwayHub.premiumModules.pharmCta")}
            </MarketingTrackedLink>
          </li>
          <li className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-5)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-chart-5)]">
              {t("components.examPathwayHub.npPremium.assessmentTitle")}
            </p>
            <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("components.examPathwayHub.npPremium.assessmentBody")}</p>
            <MarketingTrackedLink
              href={buildExamPathwayPath(pathway, "questions")}
              className="mt-3 inline-flex text-xs font-semibold text-[var(--semantic-chart-5)] hover:underline"
              event={PH.marketingPathwayHubCta}
              eventProps={{
                ...linkCtx,
                surface: "np_premium_assessment",
                pathway_id: pathway.id,
                signed_in: viewerSignedIn,
                link_target: "marketing_questions_hub",
                hub_path: hubPath,
              }}
            >
              {t("components.examPathwayHub.premiumModules.practiceTestsCta")}
            </MarketingTrackedLink>
          </li>
        </ul>
      </section>

      <section
        className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--semantic-surface))] p-5 sm:p-6"
        aria-labelledby="np-premium-integration-heading"
      >
        <h2 id="np-premium-integration-heading" className="nn-marketing-h3 text-[var(--palette-heading)]">
          {t("components.examPathwayHub.npPremium.integrationTitle")}
        </h2>
        <p className="nn-marketing-body-sm mt-2 max-w-3xl text-[var(--semantic-text-secondary)]">
          {t("components.examPathwayHub.npPremium.integrationLead")}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {ecgAllowed ? (
            <MarketingTrackedLink
              href={ecgLocked ? buildExamPathwayPath(pathway) : wrapApp(ecgHref, viewerSignedIn)}
              event={PH.marketingPathwayHubCta}
              eventProps={{ ...linkCtx, surface: "np_premium_integration", link_target: "ecg", pathway_id: pathway.id }}
              className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                ecgLocked
                  ? "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)]"
                  : "border-[color-mix(in_srgb,var(--semantic-chart-2)_30%,var(--semantic-border-soft))] text-[var(--semantic-chart-2)] hover:bg-[color-mix(in_srgb,var(--semantic-chart-2)_10%,transparent)]"
              }`}
            >
              {t("components.examPathwayHub.premiumModules.ecgTitle")}
              {ecgLocked ? " · " + t("components.examPathwayHub.premiumModules.comingSoonCta") : ""}
            </MarketingTrackedLink>
          ) : null}
          <MarketingTrackedLink
            href={wrapApp(labsHref, viewerSignedIn)}
            className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-3)_30%,var(--semantic-border-soft))] px-4 py-2 text-xs font-semibold text-[var(--semantic-chart-3)] hover:bg-[color-mix(in_srgb,var(--semantic-chart-3)_10%,transparent)]"
            event={PH.marketingPathwayHubCta}
            eventProps={{ ...linkCtx, surface: "np_premium_integration", link_target: "labs", pathway_id: pathway.id }}
          >
            {t("components.examPathwayHub.premiumModules.labsTitle")}
          </MarketingTrackedLink>
          <MarketingTrackedLink
            href={clinicalScenariosPublic ? wrapApp(casesHref, viewerSignedIn) : buildExamPathwayPath(pathway)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold ${
              clinicalScenariosPublic
                ? "border-[color-mix(in_srgb,var(--semantic-chart-4)_30%,var(--semantic-border-soft))] text-[var(--semantic-chart-4)] hover:bg-[color-mix(in_srgb,var(--semantic-chart-4)_10%,transparent)]"
                : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)]"
            }`}
            event={PH.marketingPathwayHubCta}
            eventProps={{ ...linkCtx, surface: "np_premium_integration", link_target: "cases", pathway_id: pathway.id }}
          >
            {t("components.examPathwayHub.premiumModules.clinicalCasesTitle")}
          </MarketingTrackedLink>
          <MarketingTrackedLink
            href={oscePublic ? wrapApp(osceHref, viewerSignedIn) : buildExamPathwayPath(pathway)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold ${
              oscePublic
                ? "border-[color-mix(in_srgb,var(--semantic-chart-5)_30%,var(--semantic-border-soft))] text-[var(--semantic-chart-5)] hover:bg-[color-mix(in_srgb,var(--semantic-chart-5)_10%,transparent)]"
                : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)]"
            }`}
            event={PH.marketingPathwayHubCta}
            eventProps={{ ...linkCtx, surface: "np_premium_integration", link_target: "osce", pathway_id: pathway.id }}
          >
            {t("components.examPathwayHub.premiumModules.osceTitle")}
          </MarketingTrackedLink>
        </div>
      </section>

      <section aria-labelledby="np-premium-quick-launch">
        <h2 id="np-premium-quick-launch" className="nn-marketing-h3 text-[var(--palette-heading)]">
          {t("components.examPathwayHub.npPremium.quickLaunchTitle")}
        </h2>
        {!viewerSignedIn ? (
          <p className="nn-marketing-body-sm mt-2 text-[var(--semantic-text-secondary)]">{t("components.examPathwayHub.npPremium.guestSignInHint")}</p>
        ) : null}
        <ul className="mt-4 grid list-none grid-cols-2 gap-3 p-0 min-[480px]:grid-cols-3 lg:grid-cols-4">
          {quickTiles.map((tile) => {
            const Icon = tile.icon;
            const locked = tile.locked === true;
            return (
              <li key={tile.key}>
                <Link
                  href={tile.href}
                  prefetch={tile.prefetch === false ? false : undefined}
                  className={`flex min-h-[5.5rem] flex-col justify-between rounded-xl border p-3 text-left transition-colors ${
                    locked
                      ? "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-text-secondary)_6%,var(--semantic-surface))] text-[var(--semantic-text-secondary)]"
                      : "border-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))]"
                  }`}
                  aria-disabled={locked}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
                    <span className="text-xs font-bold leading-snug text-[var(--palette-heading)]">{tile.label}</span>
                  </span>
                  <span className="mt-2 text-[0.65rem] font-semibold text-[var(--semantic-brand)]">
                    {locked ? t("components.examPathwayHub.premiumModules.comingSoonCta") : "→"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
