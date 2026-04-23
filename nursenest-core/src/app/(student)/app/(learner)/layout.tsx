import type { ReactNode } from "react";
import { Suspense } from "react";
import { MarketingI18nShardLayer } from "@/components/i18n/marketing-i18n-provider";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import {
  loadMarketingMessageShards,
  loadMarketingMessageShardsSync,
} from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_PAGE_BODY_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { LearnerShellUserBar } from "@/components/auth/learner-shell-user-bar";
import { LearnerShellLanguageControl } from "@/components/student/learner-shell-language-control";
import { CheckoutSuccessBanner } from "@/components/student/checkout-success-banner";
import { LearnerExamChromeGate } from "@/components/exam/learner-exam-chrome";
import { LearnerThemeControl } from "@/components/student/learner-theme-control";
import { LearnerAppSectionAnalytics } from "@/components/observability/learner-app-section-analytics";
import { SentryLearnerShell } from "@/components/observability/sentry-learner-shell";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadLearnerStudyNextBlock } from "@/lib/learner/load-learner-study-next-block";
import { learnerPathwayHubChromeHrefForTierFallback } from "@/lib/learner/learner-pathway-hub-chrome-href";
import {
  DEFAULT_LEARNER_PATHWAY_NAV_METADATA,
  formatPathwayContextBar,
  isLearnerPathwayNavMetadata,
  loadLearnerPathwayNavMetadata,
} from "@/lib/learner/load-learner-shell-pathway-metadata";
import { safeOptional } from "@/lib/server/safe-optional";
import { getLearnerFallback, setLearnerFallback } from "@/lib/server/fallback-cache";
import { isDegradedMode } from "@/lib/config/degraded-mode";
import { BaselineAssessmentPrompt } from "@/components/student/baseline-assessment-prompt";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import {
  LearnerShellDesktopStudyLinks,
  LearnerShellMobileBottomNav,
  LearnerShellPathwayPill,
} from "@/components/layout/learner-shell-primary-nav";
import { LearnerStudyPathStrip } from "@/components/student/learner-study-path-strip";
import { LearnerPathwayContextBar } from "@/components/student/learner-pathway-context-bar";
import { LearnerShellBrandHomeLink } from "@/components/student/learner-shell-brand-home-link";
import { LearnerUnauthenticatedGate } from "@/components/student/learner-unauthenticated-gate";
import {
  PageTransitionShell,
  learnerShellShouldDisablePageTransition,
} from "@/lib/motion/page-transition-shell";
import { isLearnerTutorShellEnabled } from "@/lib/learner/tutor/learner-tutor-policy";
import { LearnerFeedbackShell } from "@/components/feedback/learner-feedback-shell";
import { UserFeedbackNavPill } from "@/components/feedback/user-feedback-nav-pill";
import { LearnerExamStudyProviders } from "@/components/exam/learner-exam-study-providers";
import { isCoreOnlyEmergencyMode, shouldSkipNonCriticalLearnerWork } from "@/lib/durability/durability-flags";
import { layoutStderrTrace } from "@/lib/observability/layout-stderr-trace";
import { LearnerSilentSectionBoundary } from "@/components/learner/learner-silent-section-boundary";
import { PaywallHomeStatsProvider } from "@/components/student/paywall-home-stats-context";
import { loadPaywallHomeStatsForShell } from "@/lib/marketing/load-paywall-home-stats-for-shell";
import { LearnerDegradedModeBanner } from "@/components/student/learner-degraded-mode-banner";
import { LearnerMainLandmarkAudit } from "@/components/observability/learner-main-landmark-audit";

import { getStaffSession } from "@/lib/auth/staff-session";
import {
  bannerTitleForPayload,
  getVerifiedAdminLearnerQaSimulation,
  learnerPathwayNavFromQaPayload,
  learnerQaUserBarOverlayFromPayload,
} from "@/lib/admin/admin-learner-qa-simulation";
import { AdminLearnerQaBanner } from "@/components/admin/admin-learner-qa-banner";
import { AdminLearnerQaPosthogSuppressor } from "@/components/admin/admin-learner-qa-posthog-suppressor";
/** Auth is enforced in `src/proxy.ts` (Next.js 16+) so this layout never calls `redirect()` for missing session. Locale + i18n: `app/(student)/app/layout.tsx`. */
export const dynamic = "force-dynamic";

export default async function LearnerShellLayout({ children }: { children: React.ReactNode }) {
  /** Tier 0 — session + entitlement (no safeOptional; resolveEntitlementForPage is internally fail-closed). */
  const session = await getProtectedRouteSession("(student).app.(learner)");
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (isDegradedMode()) {
    layoutStderrTrace("learner_shell", "degraded_mode_active", { active: true });
  }

  if (!userId) {
    return <LearnerUnauthenticatedGate />;
  }

  const [entitlement, paywallHomeStats, staffSession, qaPayload] = await Promise.all([
    resolveEntitlementForPage(userId),
    loadPaywallHomeStatsForShell(),
    getStaffSession().catch(() => null),
    getVerifiedAdminLearnerQaSimulation(userId),
  ]);

  const skipNonCritical = shouldSkipNonCriticalLearnerWork();
  const coreOnlyEmergency = isCoreOnlyEmergencyMode();

  if (skipNonCritical && entitlement !== "error" && entitlement.hasAccess) {
    layoutStderrTrace("learner_shell", "optional_shell_work_skipped", {
      surface: "study_next_strip_analytics",
      reason: "durability_degraded_or_core_only",
    });
  }

  const cachedNav =
    entitlement !== "error" ? getLearnerFallback(userId, entitlement, isLearnerPathwayNavMetadata) : null;

  const pathwayNav = qaPayload
    ? learnerPathwayNavFromQaPayload(qaPayload)
    : await safeOptional(
        async () => {
          const fresh = await loadLearnerPathwayNavMetadata(userId);
          if (entitlement !== "error") {
            setLearnerFallback(userId, entitlement, fresh);
          }
          return fresh;
        },
        cachedNav ?? DEFAULT_LEARNER_PATHWAY_NAV_METADATA,
        {
          label: "learner_pathway_nav_metadata",
          onUsedFallback: (reason) => {
            if (cachedNav != null) {
              layoutStderrTrace("learner_shell", "fallback_used", {
                surface: "pathway_nav",
                reason,
              });
            }
          },
        },
      );

  const { showBaselinePrompt, pathwayId, pathwayShortLabel } = pathwayNav;
  let { pathwayHubHref, examsLabel, pathwayContextBar } = pathwayNav;

  if (!pathwayHubHref) {
    const tier = ((session?.user as { tier?: string | null })?.tier ?? "").toUpperCase();
    const tierHub = await learnerPathwayHubChromeHrefForTierFallback(tier);
    if (tierHub) {
      pathwayHubHref = tierHub;
      if (tier === "RN" || tier === "RPN" || tier === "LVN_LPN" || tier === "NP") examsLabel = "CAT Exams";
    }
  }

  if (!pathwayContextBar && (pathwayId || pathwayHubHref)) {
    const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-product-registry");
    if (pathwayId) {
      const p = getExamPathwayById(pathwayId);
      if (p) pathwayContextBar = formatPathwayContextBar(p);
    }
    if (!pathwayContextBar && pathwayHubHref) {
      const tier = ((session?.user as { tier?: string | null })?.tier ?? "").toUpperCase();
      const fallbackPathwayId =
        tier === "RN"
          ? "us-rn-nclex-rn"
          : tier === "RPN"
            ? "ca-rpn-rex-pn"
            : tier === "LVN_LPN"
              ? "us-lpn-nclex-pn"
              : tier === "NP"
                ? "us-np-fnp"
                : tier === "ALLIED"
                  ? "us-allied-core"
                  : null;
      if (fallbackPathwayId) {
        const p = getExamPathwayById(fallbackPathwayId);
        if (p) pathwayContextBar = formatPathwayContextBar(p);
      }
    }
  }

  /** Tier 2 — study next (optional): skip entirely in degraded / emergency, else safeOptional. */
  let studyNextBlock: Awaited<ReturnType<typeof loadLearnerStudyNextBlock>> = null;
  if (!skipNonCritical && entitlement !== "error" && entitlement.hasAccess) {
    studyNextBlock = await safeOptional(
      () => loadLearnerStudyNextBlock(userId, entitlement),
      null,
      { label: "learner_study_next_block" },
    );
  }

  const tutorContext =
    !coreOnlyEmergency &&
    entitlement !== "error" &&
    entitlement.hasAccess &&
    isLearnerTutorShellEnabled()
      ? { pathwayId, pathwayLabel: pathwayShortLabel }
      : null;

  let paywalledRouteBody: ReactNode = (
    <LearnerSilentSectionBoundary name="route_body">{children}</LearnerSilentSectionBoundary>
  );
  if (entitlement !== "error" && !entitlement.hasAccess) {
    try {
      const locale = await getMarketingLocaleForDefaultRoute();
      const pagesMessages = await loadMarketingMessageShards(locale, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
      const pagesFallback =
        locale === DEFAULT_MARKETING_LOCALE
          ? undefined
          : loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
      paywalledRouteBody = (
        <MarketingI18nShardLayer messages={pagesMessages} fallbackMessages={pagesFallback}>
          <LearnerSilentSectionBoundary name="route_body">{children}</LearnerSilentSectionBoundary>
        </MarketingI18nShardLayer>
      );
    } catch (e) {
      layoutStderrTrace("learner_shell", "paywall_pages_shard_failed", {
        detail: e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200),
      });
    }
  }

  // Keep optional shell features out of the shared learner layout graph unless the current request needs them.
  const LearnerStudyNextBlockComponent = studyNextBlock
    ? (await import("@/components/student/learner-study-next-block")).LearnerStudyNextBlock
    : null;
  const LearnerTutorShellComponent = tutorContext
    ? (await import("@/components/learner-tutor")).LearnerTutorShell
    : null;

  return (
    <SentryLearnerShell userId={userId}>
      <AdminLearnerQaPosthogSuppressor active={Boolean(qaPayload)} />
      <PaywallHomeStatsProvider value={paywallHomeStats}>
        <LearnerExamStudyProviders>
          <LearnerExamChromeGate>
            <LearnerFeedbackShell pathwayId={pathwayId}>
            <div
              className="nn-learner-app mx-auto w-full max-w-6xl px-4 pt-[var(--nn-rhythm-shell-y)] pb-[calc(var(--nn-rhythm-shell-y)+5rem+env(safe-area-inset-bottom,0px))] sm:px-6 md:pb-[var(--nn-rhythm-shell-y)]"
              data-nn-learner-ds
              data-testid="learner-shell"
            >
              <LearnerMainLandmarkAudit />
              <PathwayLessonProgressRefreshListener />
              <LearnerDegradedModeBanner
                serverDegraded={isDegradedMode()}
                serverCoreEmergency={isCoreOnlyEmergencyMode()}
              />
              {qaPayload ? <AdminLearnerQaBanner title={bannerTitleForPayload(qaPayload)} /> : null}
              {!skipNonCritical ? <LearnerAppSectionAnalytics /> : null}
              <div className="nn-learner-exam-chrome-target nn-learner-shell-sticky sticky top-0 z-50 mb-[var(--nn-rhythm-tight-y)] bg-[var(--semantic-bg-base)] pt-1">
                <div className="flex flex-col gap-2">
                  <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 shadow-sm sm:px-4 sm:py-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                        <LearnerShellBrandHomeLink />
                        <LearnerShellPathwayPill pathwayPillLabel={pathwayShortLabel} pathwayHubHref={pathwayHubHref} />
                      </div>
                      <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-2.5">
                        <LearnerShellUserBar
                          pathwayShortLabel={pathwayShortLabel}
                          serverHasStaffSession={staffSession != null && !qaPayload}
                          learnerQaOverlay={qaPayload ? learnerQaUserBarOverlayFromPayload(qaPayload) : null}
                        />
                        {!coreOnlyEmergency ? <UserFeedbackNavPill /> : null}
                        <LearnerShellLanguageControl />
                        <LearnerThemeControl />
                      </div>
                    </div>
                    {pathwayContextBar && pathwayHubHref ? (
                      <LearnerPathwayContextBar label={pathwayContextBar} hubHref={pathwayHubHref} />
                    ) : null}
                  </div>
                  <div className="nn-learner-shell-nav-row rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-2 shadow-[0_1px_0_0_color-mix(in_srgb,var(--semantic-text-primary)_06%,transparent)] sm:px-3">
                    <LearnerShellDesktopStudyLinks pathwayId={pathwayId} examsLabel={examsLabel} />
                  </div>
                  <LearnerStudyPathStrip pathwayId={pathwayId} />
                </div>
                <LearnerShellMobileBottomNav
                  pathwayPillLabel={pathwayShortLabel}
                  pathwayId={pathwayId}
                  pathwayHubHref={pathwayHubHref}
                  examsLabel={examsLabel}
                />
              </div>
              {studyNextBlock ? (
                <LearnerSilentSectionBoundary name="study_next">
                  <div className="nn-learner-exam-chrome-dim mb-[var(--nn-rhythm-tight-y)]">
                    <Suspense
                      fallback={
                        <div
                          className="min-h-[10rem] rounded-xl border border-[var(--nn-presentation-divider)] bg-[var(--nn-presentation-wash)]"
                          aria-hidden
                        />
                      }
                    >
                      {LearnerStudyNextBlockComponent ? (
                        <LearnerStudyNextBlockComponent model={studyNextBlock} />
                      ) : null}
                    </Suspense>
                  </div>
                </LearnerSilentSectionBoundary>
              ) : null}
              <div className="nn-learner-exam-chrome-dim">
                <CheckoutSuccessBanner />
              </div>
              <BaselineAssessmentPrompt show={showBaselinePrompt} />
              <PageTransitionShell shouldDisableTransition={learnerShellShouldDisablePageTransition}>
                {/**
                 * Single document landmark for learner routes — inner pages/components use `<div>`, not nested `<main>`.
                 */}
                <main
                  id="nn-learner-main"
                  data-nn-learner-main=""
                  className="min-w-0 outline-none"
                  tabIndex={-1}
                >
                  {paywalledRouteBody}
                </main>
              </PageTransitionShell>
              {tutorContext ? (
                <LearnerSilentSectionBoundary name="tutor">
                  {LearnerTutorShellComponent ? <LearnerTutorShellComponent context={tutorContext} /> : null}
                </LearnerSilentSectionBoundary>
              ) : null}
            </div>
          </LearnerFeedbackShell>
        </LearnerExamChromeGate>
      </LearnerExamStudyProviders>
      </PaywallHomeStatsProvider>
    </SentryLearnerShell>
  );
}
