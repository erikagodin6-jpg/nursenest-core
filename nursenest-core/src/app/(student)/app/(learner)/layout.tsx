import type { ReactNode } from "react";
import { Suspense } from "react";
import { headers } from "next/headers";
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
  pathwayVisibleForLearnerChrome,
} from "@/lib/learner/load-learner-shell-pathway-metadata";
import { safeOptional } from "@/lib/server/safe-optional";
import { getLearnerFallback, setLearnerFallback } from "@/lib/server/fallback-cache";
import { isDegradedMode } from "@/lib/config/degraded-mode";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import { BaselineAssessmentPrompt } from "@/components/student/baseline-assessment-prompt";
import {
  LearnerShellDesktopStudyLinks,
  LearnerShellMobileBottomNav,
  LearnerShellPathwayPill,
} from "@/components/layout/learner-shell-primary-nav";
import { isPrintableStorePublicNavEnabled } from "@/lib/printables/printable-store-flags";
import { LearnerStudyPathStrip } from "@/components/student/learner-study-path-strip";
import { LearnerPathwayContextBar } from "@/components/student/learner-pathway-context-bar";
import { LearnerShellBrandHomeLink } from "@/components/student/learner-shell-brand-home-link";
import { LearnerUnauthenticatedGate } from "@/components/student/learner-unauthenticated-gate";
import {
  PageTransitionShell,
  learnerShellShouldDisablePageTransition,
} from "@/lib/motion/page-transition-shell";
import { isLearnerTutorShellEnabled } from "@/lib/learner/tutor/learner-tutor-policy";
import { SupportEmailHeaderLink } from "@/components/support/support-email-header-link";
import { LearnerExamStudyProviders } from "@/components/exam/learner-exam-study-providers";
import { isCoreOnlyEmergencyMode, shouldSkipNonCriticalLearnerWork } from "@/lib/durability/durability-flags";
import { layoutStderrTrace } from "@/lib/observability/layout-stderr-trace";
import { getOperationalStartupTraceFields } from "@/lib/ops/operational-startup-diagnostics";
import { LearnerSilentSectionBoundary } from "@/components/learner/learner-silent-section-boundary";
import { PaywallHomeStatsProvider } from "@/components/student/paywall-home-stats-context";
import { loadPaywallHomeStatsForShell } from "@/lib/marketing/load-paywall-home-stats-for-shell";
import { LearnerDegradedModeBanner } from "@/components/student/learner-degraded-mode-banner";
import { LearnerMainLandmarkAudit } from "@/components/observability/learner-main-landmark-audit";
import { isFocusedPracticeTestSessionPath } from "@/lib/learner/focused-exam-shell";
import type { AdminViewAsLearnerContext } from "@/lib/admin/admin-view-as-learner-context";
/** Auth is enforced in `src/proxy.ts` (Next.js 16+) so this layout never calls `redirect()` for missing session. Locale + i18n: `app/(student)/app/layout.tsx`. */
export const dynamic = "force-dynamic";

type AdminLearnerQaSimulationModule = typeof import("@/lib/admin/admin-learner-qa-simulation");

async function getAdminViewAsLearnerContextSafe(userId: string): Promise<AdminViewAsLearnerContext> {
  try {
    const { getAdminViewAsLearnerContext } = await import("@/lib/admin/admin-view-as-learner-context");
    return await getAdminViewAsLearnerContext(userId);
  } catch (error) {
    layoutStderrTrace("learner_shell", "admin_view_as_context_import_failed", {
      detail: error instanceof Error ? error.message.slice(0, 200) : String(error).slice(0, 200),
    });
    return {
      staffSession: null,
      simulation: null,
    };
  }
}

async function loadAdminLearnerQaSimulationHelpersSafe(): Promise<AdminLearnerQaSimulationModule | null> {
  try {
    return await import("@/lib/admin/admin-learner-qa-simulation");
  } catch (error) {
    layoutStderrTrace("learner_shell", "admin_qa_helpers_import_failed", {
      detail: error instanceof Error ? error.message.slice(0, 200) : String(error).slice(0, 200),
    });
    return null;
  }
}

export default async function LearnerShellLayout({ children }: { children: React.ReactNode }) {
  const requestPathname = (await headers()).get("x-nn-request-pathname")?.trim() ?? "";
  const isFocusedExamShell = isFocusedPracticeTestSessionPath(requestPathname);
  const normalizedLearnerPathname = requestPathname.split("?")[0]?.replace(/\/+$/, "") || "/app";
  const isLearnerDashboardRoute = normalizedLearnerPathname === "/app";
  /** Tier 0 — session + entitlement (no safeOptional; resolveEntitlementForPage is internally fail-closed). */
  const session = await getProtectedRouteSession("(student).app.(learner)");
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (isDegradedMode()) {
    layoutStderrTrace("learner_shell", "degraded_mode_active", {
      active: true,
      ...getOperationalStartupTraceFields(),
    });
  }

  if (!userId) {
    return <LearnerUnauthenticatedGate />;
  }

  const [entitlement, paywallHomeStats, viewAsCtx] = await Promise.all([
    resolveEntitlementForPage(userId),
    loadPaywallHomeStatsForShell(),
    getAdminViewAsLearnerContextSafe(userId),
  ]);
  const { staffSession, simulation: qaShell } = viewAsCtx;
  const adminQaSimulationHelpers = qaShell ? await loadAdminLearnerQaSimulationHelpersSafe() : null;

  const adminQaModules = qaShell
    ? await Promise.all([
        import("@/components/admin/admin-learner-qa-posthog-suppressor"),
        import("@/components/admin/admin-learner-qa-app-toolbar"),
      ])
    : null;
  const AdminLearnerQaPosthogSuppressor = adminQaModules?.[0].AdminLearnerQaPosthogSuppressor ?? null;
  const AdminLearnerQaAppToolbar = adminQaModules?.[1].AdminLearnerQaAppToolbar ?? null;

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

  const pathwayNav = qaShell
    ? adminQaSimulationHelpers?.learnerPathwayNavFromQaPayload(qaShell) ?? DEFAULT_LEARNER_PATHWAY_NAV_METADATA
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
    const tier = (
      qaShell && adminQaSimulationHelpers
        ? adminQaSimulationHelpers.learnerQaChromeTierFallbackString(qaShell.track)
        : ((session?.user as { tier?: string | null })?.tier ?? "")
    ).toUpperCase();
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
      if (pathwayVisibleForLearnerChrome(p)) pathwayContextBar = formatPathwayContextBar(p);
    }
    if (!pathwayContextBar && pathwayHubHref) {
      const tier = (
        qaShell && adminQaSimulationHelpers
          ? adminQaSimulationHelpers.learnerQaChromeTierFallbackString(qaShell.track)
          : ((session?.user as { tier?: string | null })?.tier ?? "")
      ).toUpperCase();
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
        if (pathwayVisibleForLearnerChrome(p)) pathwayContextBar = formatPathwayContextBar(p);
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

  const printablesNavVisible = isPrintableStorePublicNavEnabled();

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
      {AdminLearnerQaPosthogSuppressor ? (
        <AdminLearnerQaPosthogSuppressor active={Boolean(qaShell)} />
      ) : null}
      <PaywallHomeStatsProvider value={paywallHomeStats}>
        <LearnerExamStudyProviders>
          <LearnerExamChromeGate>
            <div
              className="nn-learner-app nn-learner-ds-ambient nn-brand-learner-atmosphere relative isolate mx-auto w-full max-w-6xl px-4 pt-[var(--nn-rhythm-shell-y)] pb-[calc(var(--nn-rhythm-shell-y)+var(--nn-learner-bottom-nav-reserve))] sm:px-5 md:px-6 md:pb-[var(--nn-rhythm-shell-y)]"
              data-nn-learner-ds
              data-learner-exam-chrome={isFocusedExamShell ? "hidden" : undefined}
              data-testid="learner-shell"
            >
              <LearnerMainLandmarkAudit />
              <PathwayLessonProgressRefreshListener />
              <LearnerDegradedModeBanner
                serverDegraded={isDegradedMode()}
                serverCoreEmergency={isCoreOnlyEmergencyMode()}
              />
              {entitlement !== "error" &&
              entitlement.hasAccess &&
              entitlement.reason === "admin_override" &&
              !qaShell &&
              !entitlement.adminLearnerQaSimulation ? (
                <div
                  role="region"
                  aria-label="Staff access override"
                  data-nn-staff-access-banner
                  className="mb-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_18%,var(--semantic-surface))] px-3 py-2.5 text-sm text-[var(--semantic-text-primary)] shadow-sm ring-1 ring-[color-mix(in_srgb,var(--semantic-warning)_14%,transparent)] sm:px-4"
                >
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className="nn-badge-semantic-warning inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                      Staff access
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                      Admin / QA — not a subscription
                    </span>
                  </div>
                  <p className="m-0 text-sm leading-snug text-[var(--semantic-text-primary)]">
                    You have full learner access from your staff role. This is not paid billing or a subscriber
                    entitlement, and it is separate from simulated learner QA.
                  </p>
                </div>
              ) : null}
              {qaShell && AdminLearnerQaAppToolbar ? (
                <AdminLearnerQaAppToolbar
                  bannerTitle={adminQaSimulationHelpers?.bannerTitleForPayload(qaShell) ?? "Simulated learner view"}
                  initialPublicState={
                    adminQaSimulationHelpers?.publicQaStateFromPayload(qaShell) ?? {
                      active: true,
                      track: qaShell.track,
                      lifecycle: qaShell.lifecycle,
                      country: qaShell.country,
                      npSpecialty: qaShell.npSpecialty ?? null,
                      alliedCareer: qaShell.alliedCareer ?? null,
                      planVariant: qaShell.planVariant ?? null,
                      billingRegionSlug: null,
                      bannerTitle: "Simulated learner view",
                      pathwayId: pathwayId,
                    }
                  }
                />
              ) : null}
              {!skipNonCritical && !qaShell ? <LearnerAppSectionAnalytics /> : null}
              <div className="nn-learner-exam-chrome-target nn-learner-shell-sticky sticky top-0 z-50 mb-[var(--nn-rhythm-tight-y)] overflow-x-clip bg-[var(--semantic-bg-base)] pt-0.5 md:pt-1">
                <div className="flex min-h-0 flex-col gap-2 md:gap-2.5">
                  <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 shadow-[var(--shadow-card)] sm:px-4 sm:py-2.5 md:px-4 md:py-2">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 sm:gap-x-3 md:gap-x-3 md:gap-y-2.5">
                      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                        <LearnerShellBrandHomeLink />
                        <LearnerShellPathwayPill pathwayPillLabel={pathwayShortLabel} pathwayHubHref={pathwayHubHref} />
                      </div>
                      <div className="flex min-w-0 flex-shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2.5">
                        <LearnerShellUserBar
                          pathwayShortLabel={pathwayShortLabel}
                          serverHasStaffSession={staffSession != null && !qaShell}
                          learnerQaOverlay={
                            qaShell && adminQaSimulationHelpers
                              ? adminQaSimulationHelpers.learnerQaUserBarOverlayFromPayload(qaShell)
                              : null
                          }
                        />
                        {!coreOnlyEmergency ? <SupportEmailHeaderLink /> : null}
                        <LearnerShellLanguageControl />
                        <LearnerThemeControl />
                      </div>
                    </div>
                    {pathwayContextBar && pathwayHubHref ? (
                      <LearnerPathwayContextBar label={pathwayContextBar} hubHref={pathwayHubHref} />
                    ) : null}
                  </div>
                  <div className="nn-learner-shell-nav-row rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-1.5 shadow-[var(--shadow-card)] sm:px-3 sm:py-2 md:px-3.5 md:py-2.5">
                    <LearnerShellDesktopStudyLinks
                      pathwayId={pathwayId}
                      examsLabel={examsLabel}
                      printablesNavVisible={printablesNavVisible}
                    />
                  </div>
                  <LearnerStudyPathStrip pathwayId={pathwayId} />
                </div>
                <LearnerShellMobileBottomNav
                  pathwayPillLabel={pathwayShortLabel}
                  pathwayId={pathwayId}
                  pathwayHubHref={pathwayHubHref}
                  examsLabel={examsLabel}
                  printablesNavVisible={printablesNavVisible}
                />
              </div>
              {studyNextBlock && !isLearnerDashboardRoute ? (
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
                        <LearnerStudyNextBlockComponent model={studyNextBlock} variant="pulse" />
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
        </LearnerExamChromeGate>
      </LearnerExamStudyProviders>
      </PaywallHomeStatsProvider>
    </SentryLearnerShell>
  );
}
