import "@/app/learner-exam-shell.css";
import "@/app/learner-exam-session-premium.css";
import "@/app/learner-loft-simulation.css";
import "@/app/learner-flashcard-premium.css";
import "@/app/learner-cockpit-premium.css";
import "@/app/learner-surface-primitives.css";
import "@/app/learner-lesson-readable.css";
import "../../../../../styles/tokens.css";
import "../../../../../styles/learner-ds.css";
// Learner-specific styles extracted from premium-redesign-2026.css (moved to marketing layout).
// Contains: learner-ds-ambient, learner-dashboard-hero, CAT exam chrome, practice exam runner,
// flashcard session surfaces.
import "@/app/learner-premium-ds.css";
// Phase 2 extraction: CAT exam, practice session, lesson detail, dashboard, review,
// coach, study queue, question/option rendering, confidence controls from globals.css.
import "@/app/styles/learner/learner-global.css";

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
import { PremiumLayoutVersionMarker } from "@/components/layout/premium-layout-version-marker";
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