import "@/app/workspace.css";
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
import "@/app/learning-module-shell.css";

import { type ReactNode, Suspense } from "react";
import { cookies } from "next/headers";

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
import { CheckoutSuccessBanner } from "@/components/student/checkout-success-banner";
import { LearnerExamChromeGate } from "@/components/exam/learner-exam-chrome";
import { LearnerAppSectionAnalytics } from "@/components/observability/learner-app-section-analytics";
import { LearnerActivityLifecycleBeacon } from "@/components/observability/learner-activity-lifecycle-beacon";
import { SentryLearnerShell } from "@/components/observability/sentry-learner-shell";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import {
  learnerPathwayHubChromeHref,
  learnerPathwayHubChromeHrefForTierFallback,
} from "@/lib/learner/learner-pathway-hub-chrome-href";
import {
  DEFAULT_LEARNER_PATHWAY_NAV_METADATA,
  isLearnerPathwayNavMetadata,
  loadLearnerPathwayNavMetadata,
  pathwayVisibleForLearnerChrome,
} from "@/lib/learner/load-learner-shell-pathway-metadata";
import { safeOptional } from "@/lib/server/safe-optional";
import { getLearnerFallback, setLearnerFallback } from "@/lib/server/fallback-cache";
import { isDegradedMode } from "@/lib/config/degraded-mode";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import { BaselineAssessmentPrompt } from "@/components/student/baseline-assessment-prompt";
import { classifyActivityRoute } from "@/lib/performance/activity-route-classification";
import { LearnerUnauthenticatedGate } from "@/components/student/learner-unauthenticated-gate";
import {
  PageTransitionShell,
  learnerShellShouldDisablePageTransition,
} from "@/lib/motion/page-transition-shell";
import { isLearnerTutorShellEnabled } from "@/lib/learner/tutor/learner-tutor-policy";
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
import { SiteHeaderServer } from "@/components/layout/site-header-server";
import { learnerShellFlags } from "@/lib/learner/learner-shell-mode";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { ContinueStudyingCardServer } from "@/components/workspace/continue-studying-card.server";
import { ContinueStudyingCardSkeleton } from "@/components/workspace/continue-studying-card";
import type { ProgramOption } from "@/components/workspace/program-switcher";
import { resolveNpCertificationPathwayId } from "@/lib/np/np-certification-selection";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { getSessionHubLabel } from "@/lib/learner/session-hub-label";
import { resolveLearnerRequestPathname } from "@/lib/learner/resolve-learner-request-pathname";
import { LearnerShellDevDiagnostics } from "@/components/dev/learner-shell-dev-diagnostics";
import type { AdminViewAsLearnerContext } from "@/lib/admin/admin-view-as-learner-context";
import { loadLearnerRequestUser } from "@/lib/learner/load-learner-request-user";
import { safeServerLog } from "@/lib/observability/safe-server-log";
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
  const user = await loadLearnerRequestUser(userId);
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
  const shellStart = performance.now();
  const requestPathname = await resolveLearnerRequestPathname();
  const shellFlags = learnerShellFlags(requestPathname);
  const activityRoute = classifyActivityRoute(requestPathname);
  const isPerformanceSensitiveActivityRoute = activityRoute !== null;
  const isFocusedExamShell = shellFlags.suppressFullChrome;
  const isFocusedStudySurface = shellFlags.suppressStudyWidgets;
  const shouldRenderGlobalSiteHeader = !isFocusedExamShell && shellFlags.mode !== "flashcards-study";
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
          import("@/components/admin/admin-view-as-banner"),
        ]),
      )
    : null;
  const AdminLearnerQaPosthogSuppressor = adminQaModules?.[0].AdminLearnerQaPosthogSuppressor ?? null;
  const AdminLearnerQaAppToolbar = adminQaModules?.[1].AdminLearnerQaAppToolbar ?? null;
  const AdminViewAsBanner = adminQaModules?.[2].AdminViewAsBanner ?? null;

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

  if (skipNonCritical && entitlement !== "error" && entitlement.hasAccess) {
    layoutStderrTrace("learner_shell", "optional_shell_work_skipped", {
      surface: "analytics",
      reason: "durability_degraded_or_core_only",
    });
  }

  const cachedNav =
    entitlement !== "error" ? getLearnerFallback(userId, entitlement, isLearnerPathwayNavMetadata) : null;

  // ── Tier 2 parallel load ─────────────────────────────────────────────────────
  // paywallStats, pathwayNav, and nclexTargetDate all have
  // no inter-dependencies — run them concurrently to cap layout latency at
  // max(individual timeout) instead of sum(individual timeouts).
  // Previously sequential worst-case: 900 + 2500 + 900 = 4300 ms.
  // Parallel worst-case: max(2500, 900) = 2500 ms.
  const nclexTargetDateEnabled =
    entitlement !== "error" &&
    entitlement.hasAccess &&
    !isFocusedExamShell &&
    !isPerformanceSensitiveActivityRoute;

  // Build workspace program list from accessible pathways (fast — pure catalog lookup)
  let workspacePrograms: ProgramOption[] = [];
  if (entitlement !== "error" && entitlement.hasAccess) {
    try {
      const pathways = await listPathwaysCompatibleWithSubscription(entitlement);
      const roleShortLabel: Record<string, string> = {
        rn: "RN", rpn: "RPN", lpn: "LPN", np: "NP", allied: "Allied",
      };
      workspacePrograms = pathways
        .filter((p) => p.status !== "hidden" && p.status !== "upcoming")
        .map((p) => ({
          id: p.id,
          label: p.shortName,
          shortLabel: roleShortLabel[p.roleTrack] ?? p.shortName.slice(0, 5),
        }));
    } catch {
      workspacePrograms = [];
    }
  }

  const [paywallHomeStats, pathwayNav, nclexTargetDateState] = await Promise.all([
    // Paywall stats — only needed when not subscribed; fast fallback otherwise.
    isFocusedStudySurface
      ? Promise.resolve(shellFallbackStats)
      : entitlement === "error" || !entitlement.hasAccess
        ? safeOptional(
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
        : Promise.resolve(shellFallbackStats),

    // Pathway nav — provides hub links, pathway label, and exam chrome data.
    qaShell
      ? Promise.resolve(
          adminQaSimulationHelpers?.learnerPathwayNavFromQaPayload(qaShell) ?? DEFAULT_LEARNER_PATHWAY_NAV_METADATA,
        )
      : safeOptional(
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
        ),

    // NCLEX target date — exam countdown modal data (non-critical).
    nclexTargetDateEnabled
      ? safeOptional(() => loadLearnerExamDateState(userId), null, {
          label: "learner_exam_date_state",
          timeoutMs: 900,
        })
      : Promise.resolve(null),
  ] as const);
  // ── End parallel load ────────────────────────────────────────────────────────

  const { showBaselinePrompt, pathwayId, pathwayShortLabel } = pathwayNav;
  let { pathwayHubHref } = pathwayNav;
  const selectedNpPathwayId =
    learnerTier === "NP"
      ? resolveNpCertificationPathwayId({
          cookieStore: await cookies(),
          profilePathwayId: pathwayId,
          requireExplicitSelection: false,
        })
      : null;
  const effectivePathwayId = selectedNpPathwayId ?? pathwayId;
  if (selectedNpPathwayId) {
    const selected = getExamPathwayById(selectedNpPathwayId);
    if (pathwayVisibleForLearnerChrome(selected)) {
      pathwayHubHref = learnerPathwayHubChromeHref(selected);
    }
  }

  if (!pathwayHubHref) {
    const tierHub = await learnerPathwayHubChromeHrefForTierFallback(learnerTier);
    if (tierHub) {
      pathwayHubHref = tierHub;
    }
  }

  const tutorContext =
    !coreOnlyEmergency &&
    entitlement !== "error" &&
    entitlement.hasAccess &&
    isLearnerTutorShellEnabled()
      ? { pathwayId: effectivePathwayId, pathwayLabel: pathwayShortLabel }
      : null;

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
  const LearnerTutorShellComponent = tutorContext
    ? (await import("@/components/learner-tutor")).LearnerTutorShell
    : null;

  if (activityRoute) {
    const shellServerMs = Math.round(performance.now() - shellStart);
    safeServerLog("perf", "activity_shell_server_timing", {
      activity: activityRoute.activity,
      routeFamily: activityRoute.routeFamily,
      route: normalizedLearnerPathname.slice(0, 120),
      shellServerMs,
      targetBudgetMs: activityRoute.targetBudgetMs,
      optionalStudyNextSkipped: "1",
      optionalExamDateSkipped: nclexTargetDateEnabled ? "0" : "1",
    });
  }

  // Resolve user's first name for workspace header avatar
  const userName: string | null =
    (session?.user as { name?: string | null } | undefined)?.name?.split(" ")[0] ?? null;

  // Continue Studying card streams in via Suspense — does not block layout render
  const continueStudyingSlot = (
    <Suspense fallback={<ContinueStudyingCardSkeleton />}>
      <ContinueStudyingCardServer
        userId={userId}
        pathwayId={effectivePathwayId}
        fallbackHref={pathwayHubHref || "/app/command-center"}
      />
    </Suspense>
  );

  // All inner shell content — shared between focused and workspace modes
  const shellContent = (
    <>
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
              pathwayId: effectivePathwayId,
              targetUserId: qaShell.targetUserId ?? null,
              targetEmail: qaShell.targetEmail ?? null,
              experienceLevel: qaShell.experienceLevel ?? null,
              isRealUser: Boolean(qaShell.targetUserId),
            }
          }
        />
      ) : null}
      {/* Persistent bottom banner for all view-as sessions (real user + simulated) */}
      {qaShell && AdminViewAsBanner ? (
        <AdminViewAsBanner
          state={
            adminQaSimulationHelpers?.publicQaStateFromPayload(qaShell) ?? {
              active: true,
              track: qaShell.track,
              lifecycle: qaShell.lifecycle,
              country: qaShell.country,
              npSpecialty: qaShell.npSpecialty ?? null,
              alliedCareer: qaShell.alliedCareer ?? null,
              planVariant: qaShell.planVariant ?? null,
              billingRegionSlug: null,
              bannerTitle: adminQaSimulationHelpers?.bannerTitleForPayload(qaShell) ?? "View-as session active",
              pathwayId: effectivePathwayId,
              targetUserId: qaShell.targetUserId ?? null,
              targetEmail: qaShell.targetEmail ?? null,
              experienceLevel: qaShell.experienceLevel ?? null,
              isRealUser: Boolean(qaShell.targetUserId),
            }
          }
          entitlementDebug={
            entitlement !== "error"
              ? {
                  hasAccess: entitlement.hasAccess,
                  reason: entitlement.reason,
                  tier: entitlement.tier ? String(entitlement.tier) : null,
                  country: entitlement.country ? String(entitlement.country) : null,
                  adminLearnerQaSimulation: Boolean(entitlement.adminLearnerQaSimulation),
                  pathwayId: effectivePathwayId,
                  planStatus: null,
                  lifecycle: qaShell.lifecycle,
                }
              : null
          }
        />
      ) : null}
      {!skipNonCritical && !qaShell ? (
        <>
          <LearnerAppSectionAnalytics />
          <LearnerActivityLifecycleBeacon />
        </>
      ) : null}
      <div className="nn-learner-exam-chrome-dim">
        <CheckoutSuccessBanner />
      </div>
      {entitlement === "error" ? (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_55%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-primary)] shadow-sm"
        >
          <span className="font-semibold">Having trouble verifying your subscription.</span>{" "}
          Your access may be temporarily unavailable.{" "}
          <a href="/app" className="font-semibold underline hover:no-underline">
            Refresh to try again
          </a>{" "}
          or contact{" "}
          <a href="mailto:support@nursenest.io" className="font-semibold underline hover:no-underline">
            support
          </a>
          {" "}if this persists.
        </div>
      ) : null}
      {entitlement !== "error" &&
      entitlement.hasAccess &&
      entitlement.reason === "active_trial" &&
      !isFocusedExamShell &&
      !isFocusedStudySurface ? (
        <div
          className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_05%,var(--semantic-surface))] px-4 py-2.5 text-sm text-[var(--semantic-text-primary)] shadow-sm"
        >
          <span>
            <span className="font-semibold">Free trial active.</span>{" "}
            Upgrade anytime to keep your progress after the trial ends.
          </span>
          <a
            href="/pricing"
            className="inline-flex min-h-8 items-center rounded-full bg-[var(--role-cta)] px-4 text-xs font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_10px_var(--role-cta-shadow)]"
          >
            View plans
          </a>
        </div>
      ) : null}
      <BaselineAssessmentPrompt show={showBaselinePrompt} />
      <PageTransitionShell shouldDisableTransition={learnerShellShouldDisablePageTransition}>
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
    </>
  );

  return (
    <SentryLearnerShell userId={userId}>
      {AdminLearnerQaPosthogSuppressor ? (
        <AdminLearnerQaPosthogSuppressor active={Boolean(qaShell)} />
      ) : null}
      <PaywallHomeStatsProvider value={paywallHomeStats}>
        <LearnerExamStudyProviders>
          <LearnerExamChromeGate hubLabel={sessionHubLabel} hubHref={pathwayHubHref || "/app"}>
            <LearnerShellDevDiagnostics />
            {isFocusedExamShell ? (
              /* ── Focused exam/flashcard shell: full-width, original container, retains marketing header ── */
              <>
                {shouldRenderGlobalSiteHeader ? (
                  <SiteHeaderServer serverHasStaffSession={staffSession != null && !qaShell} />
                ) : null}
                <div
                  className="nn-learner-app nn-learner-ds-ambient nn-brand-learner-atmosphere relative isolate mx-auto w-full max-w-6xl px-4 pt-[var(--nn-rhythm-shell-y)] pb-[var(--nn-rhythm-shell-y)] sm:px-5 md:px-6"
                  data-nn-learner-ds
                  data-nn-learner-workspace=""
                  data-learner-exam-chrome="hidden"
                  data-testid="learner-shell"
                >
                  {shellContent}
                </div>
              </>
            ) : (
              /* ── Workspace shell: sidebar + slim header + max-w-1600 content ── */
              <div
                data-nn-learner-ds
                data-nn-learner-workspace=""
                data-testid="learner-shell"
                className="nn-learner-ds-ambient nn-brand-learner-atmosphere"
              >
                <WorkspaceShell
                  pathwayId={effectivePathwayId}
                  programs={workspacePrograms}
                  userName={userName}
                  isFocused={false}
                  continueStudyingSlot={continueStudyingSlot}
                >
                  {shellContent}
                </WorkspaceShell>
              </div>
            )}
          </LearnerExamChromeGate>
        </LearnerExamStudyProviders>
      </PaywallHomeStatsProvider>
    </SentryLearnerShell>
  );
  },
  { name: "LearnerShellLayout" },
);

export default LearnerShellLayout;
