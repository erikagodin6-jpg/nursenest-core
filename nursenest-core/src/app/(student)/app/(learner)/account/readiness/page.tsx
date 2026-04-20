import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountCrossLinks } from "@/components/student/learner-account-cross-links";
import { LearnerPerformanceWorkspaceNav } from "@/components/student/learner-performance-workspace-nav";
import { LearnerSilentSectionDegradedFallback } from "@/components/student/learner-silent-section-degraded-fallback";
import { LearnerStudyQuickLinksCard } from "@/components/student/learner-study-quick-links-card";
import { LockedStudyNextPreview } from "@/components/student/locked-study-next-preview";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { ReadinessHeroCard } from "@/components/study/readiness-hero-card";
import { ReadinessDimensionTabs } from "@/components/study/readiness-dimension-tabs";
import { ReadinessStrengthGrid } from "@/components/study/readiness-strength-grid";
import { ReadinessFocusPlan } from "@/components/study/readiness-focus-plan";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { resolveStudyLoopCatHref } from "@/lib/exam-pathways/study-loop-cat-routing";
import { loadReadinessDashboardData } from "@/lib/learner/readiness-dashboard-data";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.account.readiness.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/readiness", routeGroup: "student.learner.account_readiness" },
  );
}

export default async function AccountReadinessPage() {
  const { t, locale } = await getLearnerMarketingBundle();
  const session = await getProtectedRouteSession("(student).app.(learner).account.readiness");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.readiness"));
  const localeTag = locale.replace(/_/g, "-");
  void localeTag;

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.readiness.title")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app/account/readiness"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <LearnerPerformanceWorkspaceNav t={t} pathname="/app/account/readiness" />
        <PremiumEmptyState
          headline={t("learner.account.readiness.title")}
          body={t("learner.entitlement.verifyFailed")}
          tone="default"
          primaryCta={{ label: t("paywall.cta.openStudyHub"), href: "/app", variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <LearnerPerformanceWorkspaceNav t={t} pathname="/app/account/readiness" />
        <PremiumEmptyState
          headline={t("learner.account.readiness.title")}
          body={t("learner.profile.performanceGate.body")}
          hint={emptyStateCopy.entitlementLocked.body}
          tone="locked"
          primaryCta={{ label: t("cta.continuePlan"), href: "/pricing", variant: "primary" }}
          secondaryCtas={[{ label: t("paywall.cta.openStudyHub"), href: "/app", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
        <LockedStudyNextPreview className="nn-card space-y-2 p-6" />
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }

  const payload = await loadReadinessDashboardData(userId, entitlement);
  const preferredPathwayId =
    payload?.snapshot.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ??
    payload?.snapshot.pathways[0]?.pathwayId ??
    null;

  const catHref = resolveStudyLoopCatHref({
    authState: "signed_in",
    pathwayId: preferredPathwayId,
    availablePathwayIds: payload?.snapshot.pathways.map((p) => p.pathwayId),
    intent: "start",
  });

  if (!payload || payload.degraded?.active) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <LearnerPerformanceWorkspaceNav t={t} pathname="/app/account/readiness" />
        <div className="nn-learner-page-hero">
          <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">
            {t("learner.account.readiness.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
            {t("learner.account.readiness.intro")}
          </p>
        </div>
        <LearnerStudyQuickLinksCard t={t} id="readiness-study-quick-links" catHref={catHref} />
        <LearnerSilentSectionDegradedFallback surfaceName="readiness-dashboard" />
        <LearnerAccountCrossLinks variant="readiness" t={t} />
      </div>
    );
  }

  const { snapshot, topicPerf, catSignal, dimensions, catTrend, benchmark } = payload;
  const { readiness, practice, studyStreakDays } = snapshot;

  const weakTopics = topicPerf?.weakTopics ?? [];
  const strongTopics = topicPerf?.strongTopics ?? [];
  const trends = topicPerf?.trends ?? [];

  // Overall accuracy from UserTopicStat aggregated via practice stats
  const overallAccuracyPct =
    practice.gradedTotal > 0 && practice.gradedCorrect != null
      ? Math.round((practice.gradedCorrect / practice.gradedTotal) * 100)
      : practice.accuracyPct ?? null;

  return (
    <div className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <LearnerPerformanceWorkspaceNav t={t} pathname="/app/account/readiness" />

      {/* Page heading */}
      <div className="nn-learner-page-hero">
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">
          {t("learner.account.readiness.title")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
          {t("learner.account.readiness.intro")}
        </p>
      </div>

      {/* Quick-access links */}
      <LearnerStudyQuickLinksCard t={t} id="readiness-study-quick-links" catHref={catHref} />

      {/* ─── Premium Hero: gauge + score + trend + percentile ─── */}
      <ReadinessHeroCard
        score={readiness.score}
        band={readiness.band}
        summary={readiness.summary}
        confidence={readiness.confidence}
        studyStreakDays={studyStreakDays}
        catSessionCount={catSignal?.completedCount ?? 0}
        overallAccuracyPct={overallAccuracyPct}
        catTrend={catTrend}
        benchmark={benchmark}
      />

      {/* ─── Two-column: Readiness Breakdown + Readiness Factors ─── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Dimension breakdown tabs — client component */}
        <ReadinessDimensionTabs dimensions={dimensions} />

        {/* Readiness signal factors — right column */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            background: "var(--bg-card, var(--theme-card-bg))",
            border: "1px solid var(--border-subtle, var(--theme-border))",
          }}
        >
          <div className="px-5 py-4 sm:px-6">
            <h2
              className="text-sm font-bold"
              style={{ color: "var(--theme-heading-text, var(--foreground))" }}
            >
              Score Signals
            </h2>
            <p
              className="mt-0.5 text-xs"
              style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
            >
              The four factors that make up your readiness index
            </p>
          </div>
          <div
            className="border-t px-5 py-4 sm:px-6"
            style={{ borderColor: "var(--border-subtle, var(--theme-border))" }}
          >
            {readiness.factors.length > 0 ? (
              <ul className="space-y-4">
                {readiness.factors.map((factor) => {
                  const hasWeight = factor.maxPoints > 0;
                  const pct = hasWeight
                    ? Math.round((factor.points / factor.maxPoints) * 100)
                    : null;
                  const accent =
                    pct == null
                      ? "var(--semantic-text-muted)"
                      : pct >= 75
                      ? "var(--semantic-success)"
                      : pct >= 50
                      ? "var(--semantic-info)"
                      : "var(--semantic-warning)";
                  const fillClass =
                    pct == null
                      ? "nn-progress-fill-semantic-brand"
                      : pct >= 75
                      ? "nn-progress-fill-semantic-success"
                      : pct >= 50
                      ? "nn-progress-fill-semantic-info"
                      : "nn-progress-fill-semantic-warning";

                  return (
                    <li key={factor.id} className="nn-semantic-inset p-4 rounded-xl" style={{
                      background: `color-mix(in srgb, ${accent} 5%, var(--bg-card))`,
                      border: `1px solid color-mix(in srgb, ${accent} 15%, var(--border-subtle))`,
                    }}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3
                          className="text-xs font-semibold"
                          style={{ color: "var(--theme-heading-text, var(--foreground))" }}
                        >
                          {factor.label}
                        </h3>
                        {hasWeight ? (
                          <span
                            className="text-xs font-bold tabular-nums"
                            style={{ color: accent }}
                          >
                            {factor.points}/{factor.maxPoints} pts
                          </span>
                        ) : (
                          <span
                            className="text-[10px]"
                            style={{ color: "var(--semantic-text-muted)" }}
                          >
                            Omitted
                          </span>
                        )}
                      </div>
                      {pct != null ? (
                        <div
                          className="nn-progress-track-semantic nn-progress-track-semantic--xs mt-2"
                          role="progressbar"
                          aria-valuenow={pct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className={`h-full rounded-full ${fillClass} nn-progress-fill-reveal transition-[width] duration-500 ease-out`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      ) : null}
                      <p
                        className="mt-2 text-[11px] leading-relaxed"
                        style={{ color: "var(--semantic-text-secondary, var(--muted-foreground))" }}
                      >
                        {factor.detail}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p
                className="text-sm"
                style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
              >
                Complete practice sessions to see your score signals.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Strongest + Weakest areas grid ─── */}
      <ReadinessStrengthGrid
        strongTopics={strongTopics}
        weakTopics={weakTopics}
        trends={trends}
        pathwayId={preferredPathwayId}
      />

      {/* ─── Recommended focus areas ─── */}
      <ReadinessFocusPlan
        band={readiness.band}
        catSessionCount={catSignal?.completedCount ?? 0}
        studyStreakDays={studyStreakDays}
        weakTopics={weakTopics}
        holdingBack={readiness.holdingBack}
        nextActions={readiness.nextActions}
        benchmark={benchmark}
      />

      {/* ─── Cross-links ─── */}
      <LearnerAccountCrossLinks variant="readiness" t={t} />
    </div>
  );
}
