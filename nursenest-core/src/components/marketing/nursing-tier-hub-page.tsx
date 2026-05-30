"use client";

import Link from "next/link";
import { Activity, BookOpen, Brain, ClipboardList, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { catPathwayExamCodeLabel, catPathwayRegionalExamLine } from "@/lib/exam-pathways/cat-pathway-labels";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { ExamPathwayHubPremiumModules } from "@/components/exam-pathways/exam-pathway-hub-premium-modules";
import { MarketingPathwayHubHeroBand } from "@/components/marketing/marketing-pathway-hub-hero-band";
import {
  MarketingHubGuidedStudyPathStrip,
  type MarketingHubGuidedPathTone,
} from "@/components/marketing/marketing-hub-guided-study-path";
import { FunnelExamHubViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { StudyCard } from "@/components/ui/study-card";
import type { PathwayHubResumePayload } from "@/lib/learner/pathway-lesson-continuation";
import { isNewGradTransitionPathway } from "@/lib/marketing/is-new-grad-transition-pathway";
import type { NursingTierHubActionId, NursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";
import {
  resolveNursingTierHubStudyCardHref,
  resolveNursingTierHubActionHref,
} from "@/lib/marketing/nursing-tier-hub-content";
import { isPracticalNursingMarketingPathway } from "@/lib/marketing/is-practical-nursing-marketing-pathway";
import { pathwayHubAppQuestionsPathwayMixedHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { LearnerSurfaceCard } from "@/components/ui/learner-surface-card";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { formatTitleCase } from "@/lib/format/text-case";
import { isNpPremiumConvergencePathway } from "@/lib/marketing/np-premium-convergence-pathways";
import { NpPremiumHubWorkstation } from "@/components/marketing/np-premium-hub-workstation";
import { MarketingPathwayHubProductPreview } from "@/components/marketing/marketing-pathway-hub-product-preview";

const ACTION_ICON: Record<NursingTierHubActionId, LucideIcon> = {
  lessons: BookOpen,
  flashcards: ClipboardList,
  practice_questions: Target,
  cat: Brain,
  exams: Activity,
};

/** Stable Playwright hooks — hub `StudyCard` applies this on the whole-card `Link`. */
const ACTION_QA_CLASS: Partial<Record<NursingTierHubActionId, string>> = {
  lessons: "nn-qa-nursing-tier-hub-lessons-card",
  flashcards: "nn-qa-nursing-tier-hub-flashcards-card",
  practice_questions: "nn-qa-nursing-tier-hub-practice-card",
  cat: "nn-qa-nursing-tier-hub-cat-card",
  exams: "nn-qa-nursing-tier-hub-exams-card",
};

/** Matches `globals.css` hub role modifiers (see pre-nursing hub tiles). */
const ACTION_HUB_ROLE_CLASS: Record<NursingTierHubActionId, string> = {
  lessons: "nn-exam-hub-study-card--lessons",
  flashcards: "nn-exam-hub-study-card--flashcards",
  practice_questions: "nn-exam-hub-study-card--practice",
  cat: "nn-exam-hub-study-card--cat",
  exams: "nn-exam-hub-study-card--cat",
};

const ACTION_GUIDED_TONE: Record<NursingTierHubActionId, MarketingHubGuidedPathTone> = {
  lessons: "success",
  flashcards: "chart1",
  practice_questions: "info",
  cat: "chart2",
  exams: "warning",
};

export function NursingTierHubPage({
  pathway,
  hubPath,
  content,
  npSeoAliasSegment,
  emphasizeCatPracticeTests = false,
  hubResume = null,
  viewerSignedIn = false,
  viewerHasPathwayLessonAccess: _viewerHasPathwayLessonAccess,
  ecgModulePublic,
  clinicalScenariosPublic = false,
  oscePublic = false,
}: {
  pathway: ExamPathwayDefinition;
  hubPath: string;
  content: NursingTierHubContent | null; // 🔥 allow null
  /** When set (NP practice-test SEO alias URLs), analytics props match {@link ExamPathwayHub}. */
  npSeoAliasSegment?: string;
  /** NP SEO alias hubs: highlight CAT practice-test intent — mirrors {@link ExamPathwayHubBody}. */
  emphasizeCatPracticeTests?: boolean;
  hubResume?: PathwayHubResumePayload | null; // surfaced on New Grad transition hub when present
  viewerSignedIn?: boolean;
  viewerHasPathwayLessonAccess?: boolean;
  /** Server-resolved ECG inventory for hub premium grid (see `resolveMarketingHubEcgModulePublic`). */
  ecgModulePublic?: boolean;
  /** Public clinical scenarios gate — matches premium module locks. */
  clinicalScenariosPublic?: boolean;
  /** Public OSCE gate — matches premium module locks. */
  oscePublic?: boolean;
}) {
  const { t } = useMarketingI18n();
  const { status, data: clientSession } = useSession();
  const clientSignedIn = status === "authenticated" && Boolean((clientSession?.user as { id?: string } | undefined)?.id);
  const effectiveViewerSignedIn = viewerSignedIn || clientSignedIn;
  const linkCtx = pathwayMarketingHubLinkContext(pathway, npSeoAliasSegment);
  const catAppStartHref = appPathwayCatSessionStartPath(pathway.id);
  const catExamLabel = catPathwayExamCodeLabel(pathway);
  const catPathwayLine = catPathwayRegionalExamLine(pathway);
  const pnHub = isPracticalNursingMarketingPathway(pathway);

  // 🔥 HARD GUARD — prevents ALL crashes
  if (!content || !Array.isArray(content.actions)) {
    console.error("[NURSING HUB] invalid content", content);

    return (
      <div className="text-center py-12 text-red-500">
        Hub content failed to load
      </div>
    );
  }

  const actionsById = new Map(
    content.actions.map((action) => [action.id, action])
  );

  const orderedActions = (
    ["lessons", "flashcards", "practice_questions", "cat", "exams"] as NursingTierHubActionId[]
  )
    .map((id) => actionsById.get(id))
    .filter(Boolean);

  const rawTitle = content.title || pathway.shortName;
  const heading = formatTitleCase(rawTitle);
  const countryLabel = pathway.countrySlug === "canada" ? "Canada" : pathway.countrySlug === "us" ? "United States" : pathway.countrySlug;
  const eyebrow = countryLabel;
  const isNewGradHub = isNewGradTransitionPathway(pathway);
  const npPremiumConvergence = isNpPremiumConvergencePathway(pathway);
  const lessonsAction = actionsById.get("lessons");
  const practiceAction = actionsById.get("practice_questions");
  const ngnMixedHref = effectiveViewerSignedIn
    ? pathwayHubAppQuestionsPathwayMixedHref(pathway.id)
    : loginWithCallback(pathwayHubAppQuestionsPathwayMixedHref(pathway.id));

  const guidedSteps =
    isNewGradHub && orderedActions.length > 0
      ? orderedActions
          .filter((a): a is NonNullable<typeof a> => Boolean(a))
          .map((action) => ({
            title:
              action.id === "cat"
                ? t("components.examPathwayHub.studyModes.practiceCatTitle", { exam: catExamLabel })
                : action.label || "Open",
            hint:
              action.disabled === true && action.disabledNote
                ? action.disabledNote
                : action.id === "cat"
                  ? t("components.examPathwayHub.studyModes.practiceCatBody", { pathwayLine: catPathwayLine })
                  : action.description || content.startHere,
            href: resolveNursingTierHubStudyCardHref(pathway, action, {
              viewerSignedIn: effectiveViewerSignedIn,
            }),
            tone: ACTION_GUIDED_TONE[action.id],
          }))
      : [];

  const pnGuidedSteps =
    pnHub && lessonsAction && practiceAction
      ? [
          {
            title: t("components.examPathwayHub.pnMarketingHub.stepLessonsTitle"),
            hint: t("components.examPathwayHub.pnMarketingHub.stepLessonsHint"),
            href: resolveNursingTierHubStudyCardHref(pathway, lessonsAction, {
              viewerSignedIn: effectiveViewerSignedIn,
            }),
            tone: "success" as const,
          },
          {
            title: t("components.examPathwayHub.pnMarketingHub.stepPracticeTitle"),
            hint: t("components.examPathwayHub.pnMarketingHub.stepPracticeHint"),
            href: resolveNursingTierHubStudyCardHref(pathway, practiceAction, {
              viewerSignedIn: effectiveViewerSignedIn,
            }),
            tone: "info" as const,
          },
          {
            title: t("components.examPathwayHub.pnMarketingHub.stepNgnTitle"),
            hint: t("components.examPathwayHub.pnMarketingHub.stepNgnHint"),
            href: ngnMixedHref,
            tone: "chart5" as const,
          },
        ]
      : [];

  const marketingQuestionsHref = practiceAction
    ? resolveNursingTierHubActionHref(pathway, practiceAction)
    : `${hubPath}/questions`;
  const marketingLessonsHref = lessonsAction
    ? resolveNursingTierHubActionHref(pathway, lessonsAction)
    : `${hubPath}/lessons`;

  return (
    <>
      <FunnelExamHubViewBeacon pathway={pathway} hubPath={hubPath} />

      <div
        className={`nn-premium-pathway-hub${isNewGradHub ? " nn-premium-pathway-hub--new-grad nn-new-grad-hub" : ""}${pnHub ? " nn-premium-pathway-hub--pn-rpn" : ""}${
          npPremiumConvergence ? " nn-premium-pathway-hub--np-convergence" : ""
        }`}
        data-nn-nursing-tier-hub="surface"
        data-nn-new-grad-convergence={isNewGradHub ? "1" : undefined}
        data-pathway-track={pathway.roleTrack}
        data-premium-layout-version="2026-05-tests-hubs-v1"
      >
        <section className="nn-hub-tier-study-band" aria-labelledby="nn-nursing-tier-hub-title">
          {pnHub ? (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-stretch">
              <div className="mb-1">
                <Link href={hubPath} className="nn-text-xs nn-text-muted no-underline hover:underline">
                  ← Back to Overview
                </Link>
              </div>
              <MarketingPathwayHubHeroBand
                className="min-w-0 nn-pn-pathway-hero-premium"
                eyebrow={<p className="nn-premium-home-eyebrow max-w-full whitespace-normal text-[var(--semantic-text-muted)]">{eyebrow}</p>}
                title={
                  <h1
                    id="nn-nursing-tier-hub-title"
                    className="nn-marketing-h1 max-w-[min(100%,44rem)] text-balance text-[var(--palette-heading)]"
                  >
                    {heading}
                  </h1>
                }
                intro={null}
              />
              <div
                className="flex min-w-0 flex-col gap-4 sm:gap-5"
                data-nn-pn-hub-insight-rail="1"
                aria-label={t("components.examPathwayHub.pnMarketingHub.insightRailAria")}
              >
                <LearnerSurfaceCard variant="secondary" className="p-5 sm:p-6 shadow-[var(--semantic-shadow-soft)]">
                  <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-success)]">
                    {t("components.examPathwayHub.pnMarketingHub.panelPriorKicker")}
                  </p>
                  <p className="mt-2 nn-marketing-h4 text-[var(--palette-heading)]">
                    {t("components.examPathwayHub.pnMarketingHub.panelPriorTitle")}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                    {t("components.examPathwayHub.pnMarketingHub.panelPriorBody")}
                  </p>
                  <MarketingTrackedLink
                    href={marketingQuestionsHref}
                    event={PH.marketingPathwayHubCta}
                    eventProps={{
                      ...linkCtx,
                      surface: "pn_insight_rail",
                      pathway_id: pathway.id,
                      signed_in: effectiveViewerSignedIn,
                      destination_type: "marketing_questions",
                      link_target: "prioritization_lane",
                    }}
                    className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                  >
                    {t("components.examPathwayHub.pnMarketingHub.panelPriorCta")}
                  </MarketingTrackedLink>
                </LearnerSurfaceCard>
                <LearnerSurfaceCard variant="secondary" className="p-5 sm:p-6 shadow-[var(--semantic-shadow-soft)]">
                  <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-info)]">
                    {t("components.examPathwayHub.pnMarketingHub.panelWorkflowKicker")}
                  </p>
                  <p className="mt-2 nn-marketing-h4 text-[var(--palette-heading)]">
                    {t("components.examPathwayHub.pnMarketingHub.panelWorkflowTitle")}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                    {t("components.examPathwayHub.pnMarketingHub.panelWorkflowBody")}
                  </p>
                  <MarketingTrackedLink
                    href={marketingLessonsHref}
                    event={PH.marketingPathwayHubCta}
                    eventProps={{
                      ...linkCtx,
                      surface: "pn_insight_rail",
                      pathway_id: pathway.id,
                      signed_in: effectiveViewerSignedIn,
                      destination_type: "marketing_lessons",
                      link_target: "workflow_lane",
                    }}
                    className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                  >
                    {t("components.examPathwayHub.pnMarketingHub.panelWorkflowCta")}
                  </MarketingTrackedLink>
                </LearnerSurfaceCard>
                <LearnerSurfaceCard variant="secondary" className="p-5 sm:p-6 shadow-[var(--semantic-shadow-soft)]">
                  <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
                    {t("components.examPathwayHub.pnMarketingHub.panelNgnKicker")}
                  </p>
                  <p className="mt-2 nn-marketing-h4 text-[var(--palette-heading)]">
                    {t("components.examPathwayHub.pnMarketingHub.panelNgnTitle")}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                    {t("components.examPathwayHub.pnMarketingHub.panelNgnBody")}
                  </p>
                  <MarketingTrackedLink
                    href={ngnMixedHref}
                    event={PH.marketingPathwayHubCta}
                    eventProps={{
                      ...linkCtx,
                      surface: "pn_insight_rail",
                      pathway_id: pathway.id,
                      signed_in: effectiveViewerSignedIn,
                      destination_type: "app_ngn_mixed",
                      link_target: "ngn_mixed_bank",
                    }}
                    className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                    prefetch={false}
                  >
                    {t("components.examPathwayHub.pnMarketingHub.panelNgnCta")}
                  </MarketingTrackedLink>
                </LearnerSurfaceCard>
              </div>
            </div>
          ) : (
            <div className="nn-non-pn-hero-wrapper">
              <div className="mb-1">
                <Link href={hubPath} className="nn-text-xs nn-text-muted no-underline hover:underline">
                  ← Back to Overview
                </Link>
              </div>
              <MarketingPathwayHubHeroBand
                className={`min-w-0${npPremiumConvergence ? " nn-np-pathway-hero-premium" : ""}`}
                eyebrow={<p className="nn-premium-home-eyebrow max-w-full whitespace-normal text-[var(--semantic-text-muted)]">{eyebrow}</p>}
              title={
                <h1
                  id="nn-nursing-tier-hub-title"
                  className="nn-marketing-h1 max-w-[min(100%,42rem)] text-balance text-[var(--palette-heading)]"
                >
                  {heading}
                </h1>
              }
              intro={null}
            />
            </div>
          )}

          <MarketingPathwayHubProductPreview pathway={pathway} className="mt-8" />

          {pnHub && !npPremiumConvergence ? (
            <div className="mt-10 space-y-8" data-nn-pn-hub-readiness-band="1">
              <div>
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
                  Exam-ready system
                </p>
                <h2 className="nn-marketing-h2 mt-2 text-balance text-[var(--palette-heading)]">
                  {t("components.examPathwayHub.pnMarketingHub.readinessHeading")}
                </h2>
                <p className="nn-marketing-body-sm mt-3 max-w-3xl text-pretty text-[var(--semantic-text-secondary)]">
                  {t("components.examPathwayHub.pnMarketingHub.readinessLead")}
                </p>
                <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
                  <li className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)]">
                    <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-success)]">
                      {t("components.examPathwayHub.pnMarketingHub.metricPassingLabel")}
                    </p>
                    <p className="mt-2 text-[15px] font-bold leading-snug text-[var(--palette-heading)]">
                      {t("components.examPathwayHub.pnMarketingHub.metricPassingValue")}
                    </p>
                  </li>
                  <li className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)]">
                    <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-info)]">
                      {t("components.examPathwayHub.pnMarketingHub.metricVolumeLabel")}
                    </p>
                    <p className="mt-2 text-[15px] font-bold leading-snug text-[var(--palette-heading)]">
                      {t("components.examPathwayHub.pnMarketingHub.metricVolumeValue")}
                    </p>
                  </li>
                  <li className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)]">
                    <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-chart-5)]">
                      {t("components.examPathwayHub.pnMarketingHub.metricAccuracyLabel")}
                    </p>
                    <p className="mt-2 text-[15px] font-bold leading-snug text-[var(--palette-heading)]">
                      {t("components.examPathwayHub.pnMarketingHub.metricAccuracyValue")}
                    </p>
                  </li>
                </ul>
              </div>

              <LearnerSurfaceCard
                variant="secondary"
                className="border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] p-5 sm:p-6 shadow-[var(--semantic-shadow-soft)]"
              >
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
                  {t("components.examPathwayHub.pnMarketingHub.adaptiveKicker")}
                </p>
                <p className="mt-2 nn-marketing-h4 text-[var(--palette-heading)]">
                  {t("components.examPathwayHub.pnMarketingHub.adaptiveTitle")}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                  {t("components.examPathwayHub.pnMarketingHub.adaptiveBody")}
                </p>
                <MarketingTrackedLink
                  href={marketingQuestionsHref}
                  event={PH.marketingPathwayHubCta}
                  eventProps={{
                    ...linkCtx,
                    surface: "pn_readiness_adaptive",
                    pathway_id: pathway.id,
                    signed_in: effectiveViewerSignedIn,
                    destination_type: "marketing_questions",
                    link_target: "pn_adaptive_lane",
                  }}
                  className="mt-3 inline-flex text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                >
                  {t("components.examPathwayHub.pnMarketingHub.adaptiveCta")}
                </MarketingTrackedLink>
              </LearnerSurfaceCard>

              <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_5%,var(--semantic-surface))] p-5 sm:p-6 shadow-[var(--semantic-shadow-soft)]">
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-info)]">
                  {t("components.examPathwayHub.pnMarketingHub.remediationKicker")}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                  {t("components.examPathwayHub.pnMarketingHub.remediationLead")}
                </p>
                <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                  <li className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_9%,var(--semantic-surface))] px-3 py-1.5 text-xs font-semibold text-[var(--palette-heading)]">
                    {t("components.examPathwayHub.pnMarketingHub.remediationChip1")}
                  </li>
                  <li className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_9%,var(--semantic-surface))] px-3 py-1.5 text-xs font-semibold text-[var(--palette-heading)]">
                    {t("components.examPathwayHub.pnMarketingHub.remediationChip2")}
                  </li>
                  <li className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_9%,var(--semantic-surface))] px-3 py-1.5 text-xs font-semibold text-[var(--palette-heading)]">
                    {t("components.examPathwayHub.pnMarketingHub.remediationChip3")}
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))] p-5 sm:p-6 shadow-[var(--semantic-shadow-soft)]">
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
                  {t("components.examPathwayHub.pnMarketingHub.studyPlanKicker")}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                  {t("components.examPathwayHub.pnMarketingHub.studyPlanBody")}
                </p>
              </div>
            </div>
          ) : null}

          {npPremiumConvergence ? (
            <NpPremiumHubWorkstation
              pathway={pathway}
              hubPath={hubPath}
              viewerSignedIn={effectiveViewerSignedIn}
              hubResume={hubResume}
              npSeoAliasSegment={npSeoAliasSegment}
              ecgModulePublic={ecgModulePublic}
              clinicalScenariosPublic={clinicalScenariosPublic}
              oscePublic={oscePublic}
            />
          ) : null}

          {isNewGradHub && hubResume && (hubResume.nextRecommended || hubResume.lastTouched) ? (
            <div
              className="mt-6 rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-chart-4)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_7%,var(--semantic-surface))] p-4 sm:p-5"
              data-nn-new-grad-today-focus="1"
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-chart-4)]">
                Today focus
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                {hubResume.nextRecommended ? (
                  <Link
                    href={hubResume.nextRecommended.href}
                    className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                  >
                    Continue: {hubResume.nextRecommended.title}
                  </Link>
                ) : null}
                {hubResume.lastTouched && !hubResume.nextRecommended ? (
                  <Link
                    href={hubResume.lastTouched.href}
                    className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                  >
                    Resume: {hubResume.lastTouched.title}
                  </Link>
                ) : null}
                {hubResume.lessonsInProgress > 0 ? (
                  <span className="text-xs text-[var(--semantic-text-secondary)]">
                    {hubResume.lessonsInProgress} lesson{hubResume.lessonsInProgress === 1 ? "" : "s"} in progress on this
                    pathway
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}

          {guidedSteps.length > 0 ? (
            <MarketingHubGuidedStudyPathStrip
              className="mt-6"
              headingId="new-grad-guided-study-path-heading"
              title="Guided transition flow"
              subtitle={content.startHere}
              steps={guidedSteps}
            />
          ) : null}

          {pnGuidedSteps.length > 0 ? (
            <MarketingHubGuidedStudyPathStrip
              className="mt-8"
              headingId="pn-practical-nursing-guided-path-heading"
              title={t("components.examPathwayHub.pnMarketingHub.guidedPathTitle")}
              subtitle={t("components.examPathwayHub.pnMarketingHub.guidedPathSubtitle")}
              steps={pnGuidedSteps}
            />
          ) : null}

          <ul
            className="mx-auto mt-6 grid w-full max-w-[76rem] list-none grid-cols-1 items-stretch justify-center gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
            data-nn-hub-section="quick-actions"
          >
            {orderedActions.map((action) => {
              if (!action) return null;

              const Icon = ACTION_ICON[action.id];
              const href = resolveNursingTierHubStudyCardHref(pathway, action, {
                viewerSignedIn: effectiveViewerSignedIn,
              });
              const locked = action.disabled === true;
              const hubRoleClass = ACTION_HUB_ROLE_CLASS[action.id];
              const qaClass = ACTION_QA_CLASS[action.id];
              const cardClass = [qaClass, hubRoleClass].filter(Boolean).join(" ");
              const isAppFlashcardsTile = action.id === "flashcards" && href.startsWith("/app/flashcards");
              const isAppPracticeTestsTile = action.id === "exams" && href.startsWith("/app/practice-tests");
              const isAppCatLaunchTile = action.id === "cat" && href.startsWith("/app/practice-tests/cat-launch");

              const cardTitle =
                action.id === "cat"
                  ? `${catExamLabel} CAT`
                  : action.label || "Open";
              const cardDescription =
                action.id === "cat"
                  ? locked && action.disabledNote
                    ? action.disabledNote
                    : t("components.examPathwayHub.studyModes.practiceCatBody", { pathwayLine: catPathwayLine })
                  : locked && action.disabledNote
                    ? action.disabledNote
                    : action.description || "";
              const cardCta =
                action.id === "cat" && !locked
                  ? "Start"
                  : locked
                    ? action.disabledNote || "Lessons Unavailable for This Pathway"
                    : "Start";

              return (
                <li key={action.id}>
                  <StudyCard
                    surface="hub"
                    variant={locked ? "locked" : "featured"}
                    href={locked ? buildExamPathwayPath(pathway) : href}
                    prefetch={
                      isAppFlashcardsTile || isAppPracticeTestsTile || isAppCatLaunchTile ? false : undefined
                    }
                    className={cardClass}
                    icon={Icon}
                    title={cardTitle}
                    description={locked ? cardDescription : undefined}
                    cta={cardCta}
                  />
                </li>
              );
            })}
          </ul>
        </section>

        <ExamPathwayHubPremiumModules
          pathway={pathway}
          isSignedIn={effectiveViewerSignedIn}
          npSeoAliasSegment={npSeoAliasSegment}
          ecgModulePublic={ecgModulePublic}
        />

        {emphasizeCatPracticeTests ? (
          <div className="nn-study-callout mt-6 px-4 py-4 sm:px-5">
            <p className="nn-marketing-h4">{t("components.examPathwayHub.body.catStripTitle")}</p>
            <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">{t("components.examPathwayHub.body.catStripBody")}</p>
            {effectiveViewerSignedIn ? (
              <MarketingTrackedLink
                href={catAppStartHref}
                event={PH.marketingPathwayHubCta}
                eventProps={{
                  ...linkCtx,
                  surface: "cat_practice_strip",
                  pathway_id: pathway.id,
                  signed_in: true,
                  destination_type: "cat_practice_tests",
                  link_target: "app_pathway_cat_start",
                }}
                className="nn-marketing-body-sm mt-3 inline-flex font-semibold text-primary hover:underline"
              >
                {t("components.examPathwayHub.body.catCtaSignedIn", { exam: catExamLabel })}
              </MarketingTrackedLink>
            ) : (
              <MarketingTrackedLink
                href="/signup"
                event={PH.marketingPathwayHubCta}
                eventProps={{
                  ...linkCtx,
                  surface: "cat_practice_strip",
                  pathway_id: pathway.id,
                  signed_in: false,
                  destination_type: "signup",
                  link_target: "signup",
                }}
                className="nn-marketing-body-sm mt-3 inline-flex font-semibold text-primary hover:underline"
              >
                {t("components.examPathwayHub.body.catCtaSignup", { exam: catExamLabel })}
              </MarketingTrackedLink>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
