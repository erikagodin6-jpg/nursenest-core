import "@/app/learner-cockpit-premium.css";
import "@/app/learner-dashboard-report.css";
import "@/app/learner-surface-primitives.css";
import "../../../../../styles/tokens.css";
import "../../../../../styles/learner-ds.css";
// Learner-specific styles extracted from premium-redesign-2026.css (moved to marketing layout).
// Contains: learner-ds-ambient, learner-dashboard-hero, CAT exam chrome, practice exam runner,
// flashcard session surfaces.
import "@/app/learner-premium-ds.css";
// Phase 2 extraction: CAT exam, practice session, lesson detail, dashboard, review,
// coach, study queue, question/option rendering, confidence controls from globals.css.
import "@/app/styles/learner/learner-global.css";
import "@/app/learner-dashboard-performance.css";

import type { ReactNode } from "react";
import { Suspense } from "react";

import {
  createTraceInfo,
  traceLayout,
  traceProvider,
  withBuildTrace,
} from "@/build/tracing";
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
import { SignOutButton } from "@/components/auth/sign-out-button";
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
import { LearnerNavigationFeedback } from "@/components/learner/learner-navigation-feedback";
import { PaywallHomeStatsProvider } from "@/components/student/paywall-home-stats-context";
import { loadPaywallHomeStatsForShell } from "@/lib/marketing/load-paywall-home-stats-for-shell";
import { getDegradedPublicHomeStatsFallback } from "@/lib/marketing/public-home-stats-payload";
import { LearnerDegradedModeBanner } from "@/components/student/learner-degraded-mode-banner";
import { MarketingCountryChromeProvider } from "@/components/marketing/marketing-country-chrome-context";
import { LearnerAppFooter } from "@/components/student/learner-app-footer";
import { NclexTargetDateModal } from "@/components/student/nclex-target-date-modal";
import type { CountryCode } from "@/lib/marketing/countries/types";
import { LearnerMainLandmarkAudit } from "@/components/observability/learner-main-landmark-audit";
import { PremiumLayoutVersionMarker } from "@/components/layout/premium-layout-version-marker";
import { learnerShellFlags } from "@/lib/learner/learner-shell-mode";
import { getSessionHubLabel } from "@/lib/learner/session-hub-label";
import { resolveLearnerRequestPathname } from "@/lib/learner/resolve-learner-request-pathname";
import { LearnerShellDevDiagnostics } from "@/components/dev/learner-shell-dev-diagnostics";
import type { AdminViewAsLearnerContext } from "@/lib/admin/admin-view-as-learner-context";
import { prisma } from "@/lib/db";
/** Auth is enforced in `src/proxy.ts` (Next.js 16+) so this layout never calls `redirect()` for missing session. Locale + i18n: `app/(app)/app/layout.tsx`. */
export const dynamic = "force-dynamic";

function marketingChromeCountryFromSession(country: string | null | undefined): CountryCode {
  return country === "US" ? "us" : "canada";
}

type AdminLearnerQaSimulationModule = typeof import("@/lib/admin/admin-learner-qa-simulation");

const protectedSessionTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "getProtectedRouteSession",
  phase: "layout",
});

const resolveEntitlementTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "resolveEntitlementForPage",
  phase: "layout",
});

const paywallStatsTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "loadPaywallHomeStatsForShell",
  phase: "layout",
});

const learnerPathwayNavTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "loadLearnerPathwayNavMetadata",
  phase: "layout",
});

const learnerStudyNextTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "loadLearnerStudyNextBlock",
  phase: "layout",
});

const adminQaModulesTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "adminQaModuleImports",
  phase: "layout",
});

const learnerMarketingShardTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "loadMarketingMessageShards",
  phase: "layout",
});

type LearnerExamDateState = {
  examDate: string | null;
  examDatePlanType: "unsure" | "proposed" | "confirmed" | null;
  examGoalSetAt: string | null;
};

async function loadLearnerExamDateState(userId: string): Promise<LearnerExamDateState | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      examDate: true,
      examDatePlanType: true,
      examGoalSetAt: true,
    },
  });
  if (!user) return null;
  return {
    examDate: user.examDate?.toISOString() ?? null,
    examDatePlanType: user.examDatePlanType
      ? (user.examDatePlanType.toLowerCase() as LearnerExamDateState["examDatePlanType"])
      : null,
    examGoalSetAt: user.examGoalSetAt?.toISOString() ?? null,
  };
}

const getAdminViewAsLearnerContextSafe = traceProvider(
  import.meta,
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
  },
  { name: "LearnerShellLayout.getAdminViewAsLearnerContextSafe" },
);

const loadAdminLearnerQaSimulationHelpersSafe = traceProvider(
  import.meta,
  async function loadAdminLearnerQaSimulationHelpersSafe(): Promise<AdminLearnerQaSimulationModule | null> {
    try {
      return await import("@/lib/admin/admin-learner-qa-simulation");
    } catch (error) {
      layoutStderrTrace("learner_shell", "admin_qa_helpers_import_failed", {
        detail: error instanceof Error ? error.message.slice(0, 200) : String(error).slice(0, 200),
      });
      return null;
    }
  },
  { name: "LearnerShellLayout.loadAdminLearnerQaSimulationHelpersSafe" },
);

const LearnerShellLayout = traceLayout(
  import.meta,
  async function LearnerShellLayout({ children }: { children: React.ReactNode }) {
  const requestPathname = await resolveLearnerRequestPathname();
  const shellFlags = learnerShellFlags(requestPathname);
  const isFocusedExamShell = shellFlags.suppressFullChrome;
  const isFocusedStudySurface = shellFlags.suppressStudyWidgets;
  const isLearnerDashboardRoute = shellFlags.isDashboard;
  const normalizedLearnerPathname = (requestPathname?.split("?")[0] ?? "").replace(/\/+$/, "") || "/app";
  /** Tier 0 — session + entitlement (no safeOptional; resolveEntitlementForPage is internally fail-closed). */
  const session = await withBuildTrace(protectedSessionTrace, async () =>
    getProtectedRouteSession("(student).app.(learner)"),
  );
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

  const [entitlement, viewAsCtx] = await Promise.all([
    withBuildTrace(resolveEntitlementTrace, () => resolveEntitlementForPage(userId)),
    getAdminViewAsLearnerContextSafe(userId),
  ]);
  const { staffSession, simulation: qaShell } = viewAsCtx;
  const adminQaSimulationHelpers = qaShell ? await loadAdminLearnerQaSimulationHelpersSafe() : null;

  const adminQaModules = qaShell
    ? await withBuildTrace(adminQaModulesTrace, () =>
        Promise.all([
          import("@/components/admin/admin-learner-qa-posthog-suppressor"),
          import("@/components/admin/admin-learner-qa-app-toolbar"),
        ]),
      )
    : null;
  const AdminLearnerQaPosthogSuppressor = adminQaModules?.[0].AdminLearnerQaPosthogSuppressor ?? null;
  const AdminLearnerQaAppToolbar = adminQaModules?.[1].AdminLearnerQaAppToolbar ?? null;

  // Tier for hub label and pathway fallback — compute once, reuse everywhere.
  const learnerTier = (
    qaShell && adminQaSimulationHelpers
      ? adminQaSimulationHelpers.learnerQaChromeTierFallbackString(qaShell.track)
      : ((session?.user as { tier?: string | null })?.tier ?? "")
  ).toUpperCase();
  const sessionHubLabel = getSessionHubLabel(learnerTier);

  const skipNonCritical = shouldSkipNonCriticalLearnerWork();
  const coreOnlyEmergency = isCoreOnlyEmergencyMode();
  const shellFallbackStats = getDegradedPublicHomeStatsFallback("learner_shell_route_safe_fallback", { silent: true });
  const paywallHomeStats =
    isFocusedStudySurface
      ? shellFallbackStats
      : entitlement === "error" || !entitlement.hasAccess
        ? await safeOptional(
            async () => await withBuildTrace(paywallStatsTrace, () => loadPaywallHomeStatsForShell()),
            shellFallbackStats,
            {
              label: "learner_shell_paywall_home_stats",
              timeoutMs: 900,
              onUsedFallback: (reason) => {
                layoutStderrTrace("learner_shell", "fallback_used", {
                  surface: "paywall_home_stats",
                  route: normalizedLearnerPathname,
                  reason,
                });
              },
            },
          )
        : shellFallbackStats;

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
          const fresh = await withBuildTrace(learnerPathwayNavTrace, () => loadLearnerPathwayNavMetadata(userId));
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
    const tierHub = await learnerPathwayHubChromeHrefForTierFallback(learnerTier);
    if (tierHub) {
      pathwayHubHref = tierHub;
      if (learnerTier === "RN" || learnerTier === "RPN" || learnerTier === "LVN_LPN" || learnerTier === "NP") examsLabel = "CAT Exams";
    }
  }

  if (!pathwayContextBar && (pathwayId || pathwayHubHref)) {
    const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-product-registry");
    if (pathwayId) {
      const p = getExamPathwayById(pathwayId);
      if (pathwayVisibleForLearnerChrome(p)) pathwayContextBar = formatPathwayContextBar(p);
    }
    if (!pathwayContextBar && pathwayHubHref) {
      const fallbackPathwayId =
        learnerTier === "RN"
          ? "us-rn-nclex-rn"
          : learnerTier === "RPN"
            ? "ca-rpn-rex-pn"
            : learnerTier === "LVN_LPN"
              ? "us-lpn-nclex-pn"
              : learnerTier === "NP"
                ? "us-np-fnp"
                : learnerTier === "ALLIED"
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
      async () => await withBuildTrace(learnerStudyNextTrace, () => loadLearnerStudyNextBlock(userId, entitlement)),
      null,
      { label: "learner_study_next_block" },
    );
  }

  const nclexTargetDateEnabled = entitlement !== "error" && entitlement.hasAccess && !isFocusedExamShell;
  const nclexTargetDateState = nclexTargetDateEnabled
    ? await safeOptional(() => loadLearnerExamDateState(userId), null, {
        label: "learner_exam_date_state",
        timeoutMs: 900,
      })
    : null;

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
      const pagesMessages = await withBuildTrace(learnerMarketingShardTrace, () =>
        loadMarketingMessageShards(locale, MARKETING_PAGE_BODY_MESSAGE_SHARDS),
      );
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
          <LearnerExamChromeGate hubLabel={sessionHubLabel} hubHref={pathwayHubHref || "/app"}>
            <LearnerShellDevDiagnostics />
            <div
              className="nn-learner-app nn-learner-ds-ambient nn-brand-learner-atmosphere relative isolate mx-auto w-full max-w-6xl px-4 pt-[var(--nn-rhythm-shell-y)] pb-[calc(var(--nn-rhythm-shell-y)+var(--nn-learner-bottom-nav-reserve))] sm:px-5 md:px-6 md:pb-[var(--nn-rhythm-shell-y)]"
              data-nn-learner-ds
              data-nn-learner-workspace=""
              data-learner-exam-chrome={isFocusedExamShell ? "hidden" : undefined}
              data-testid="learner-shell"
            >
              <PremiumLayoutVersionMarker surface="learner-app" />
              <LearnerNavigationFeedback />
              <NclexTargetDateModal
                enabled={nclexTargetDateEnabled}
                initialExamDateState={nclexTargetDateState}
              />
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
              !entitlement.adminLearnerQaSimulation &&
              !isFocusedStudySurface ? (
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
                          learnerQaOverlay={
                            qaShell && adminQaSimulationHelpers
                              ? adminQaSimulationHelpers.learnerQaUserBarOverlayFromPayload(qaShell)
                              : null
                          }
                        />
                        <SignOutButton className="inline-flex min-h-10 shrink-0 touch-manipulation items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-xs font-semibold text-[var(--semantic-text-secondary)] shadow-sm transition hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_72%,var(--semantic-surface))] hover:text-[var(--semantic-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]" />
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
                  {!isFocusedStudySurface ? <LearnerStudyPathStrip pathwayId={pathwayId} /> : null}
                </div>
                <LearnerShellMobileBottomNav
                  pathwayPillLabel={pathwayShortLabel}
                  pathwayId={pathwayId}
                  pathwayHubHref={pathwayHubHref}
                  examsLabel={examsLabel}
                  printablesNavVisible={printablesNavVisible}
                />
              </div>
              {studyNextBlock && !isLearnerDashboardRoute && !isFocusedStudySurface ? (
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
                  className="min-h-[40vh] min-w-0 outline-none"
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
              <MarketingCountryChromeProvider
                country={marketingChromeCountryFromSession(
                  (session?.user as { country?: string | null } | undefined)?.country,
                )}
              >
                <div className="nn-learner-exam-chrome-dim nn-learner-site-footer-bleed mt-10">
                  <LearnerAppFooter />
                </div>
              </MarketingCountryChromeProvider>
            </div>
          </LearnerExamChromeGate>
        </LearnerExamStudyProviders>
      </PaywallHomeStatsProvider>
    </SentryLearnerShell>
  );
  },
  { name: "LearnerShellLayout" },
);

export default LearnerShellLayout;
