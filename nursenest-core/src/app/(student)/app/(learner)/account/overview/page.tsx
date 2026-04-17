import Link from "next/link";
import { TrialStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { ExamPlanSettingsCard } from "@/components/student/exam-plan-settings-card";
import { LearnerInsightEnginePanel } from "@/components/student/learner-insight-engine-panel";
import { LearnerAccountToolGrid } from "@/components/student/learner-account-tool-grid";
import { LearnerSilentSectionDegradedFallback } from "@/components/student/learner-silent-section-degraded-fallback";
import { LearnerProfileAccountActions } from "@/components/student/learner-profile-account-actions";
import { AdaptiveStudyOverview } from "@/components/student/adaptive-study-overview";
import { LockedStudyNextPreview } from "@/components/student/locked-study-next-preview";
import { TrackedStudyLoopCatLink } from "@/components/student/tracked-study-loop-cat-link";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { resolveStudyLoopCatHref } from "@/lib/exam-pathways/study-loop-cat-routing";
import { buildAdaptiveRecommendations } from "@/lib/learner/adaptive-recommendations";
import { loadLearnerProfileActivity } from "@/lib/learner/load-learner-profile-activity";
import { loadPremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import {
  remediationCatPracticeHref,
  remediationTopicDrillHref,
  remediationWeakModeTestHrefForPathway,
} from "@/lib/learner/remediation-links";
import { readinessBandLabel } from "@/lib/learner/readiness-score";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import {
  resolveInteractionPriority,
  resolvePriorityTarget,
} from "@/lib/student/interaction-priority";
import type { Metadata } from "next";
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
        title: t("learner.account.overview.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/overview", routeGroup: "student.learner.account_overview" },
  );
}

function tierLabel(t: string): string {
  return t.replace(/_/g, " ");
}

export default async function LearnerAccountOverviewPage() {
  const { t, locale } = await getLearnerMarketingBundle();
  const nowMs = Date.now();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const localeTag = locale.replace(/_/g, "-");
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.overview"));

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.profile.signedOutTitle")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app/account/overview"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  const userRow = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      name: true,
      country: true,
      tier: true,
      trialStatus: true,
      trialEndsAt: true,
      trialStartedAt: true,
      passwordHash: true,
    },
  });

  const subscription = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      status: true,
      planTier: true,
      planCountry: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      createdAt: true,
    },
  });

  let premiumSnapshot = null;
  let topicPerf = null;
  let adaptive = null;
  const activity = await loadLearnerProfileActivity(userId);

  if (entitlement !== "error" && entitlement.hasAccess) {
    try {
      premiumSnapshot = await loadPremiumDashboardSnapshot(userId, entitlement);
    } catch {
      premiumSnapshot = null;
    }
    try {
      topicPerf = await loadUnifiedTopicPerformance(userId, entitlement, 12);
    } catch {
      topicPerf = null;
    }
    if (premiumSnapshot && topicPerf) {
      try {
        const userExam = await prisma.user.findUnique({
          where: { id: userId },
          select: { examDate: true, examDatePlanType: true, studyCadencePreference: true },
        });
        adaptive = buildAdaptiveRecommendations({
          examDatePlanType: userExam?.examDatePlanType,
          examDate: userExam?.examDate ?? null,
          readiness: premiumSnapshot.readiness,
          weakTopics: topicPerf.weakTopics,
          topicTrends: topicPerf.trends,
          streakDays: premiumSnapshot.studyStreakDays,
          lessonPct: premiumSnapshot.overallLessons.pct,
          lessonsCompleted: premiumSnapshot.overallLessons.completed,
          lessonsTotal: premiumSnapshot.overallLessons.total,
          studyCadencePreference: userExam?.studyCadencePreference,
          continueLesson: premiumSnapshot.continueLesson,
          recommendedQuizTopic: premiumSnapshot.recommendedQuizTopic,
          mockCount: premiumSnapshot.mockCount,
          practiceSessionCount: premiumSnapshot.practice.sessionCount,
          subscriberCountry: entitlement.country,
          preferredPathwayId:
            premiumSnapshot.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ?? premiumSnapshot.pathways[0]?.pathwayId ?? null,
          availablePathwayIds: premiumSnapshot.pathways.map((p) => p.pathwayId),
        });
      } catch {
        adaptive = null;
      }
    }
  }

  const hasPassword = Boolean(userRow?.passwordHash);
  const showBillingPortal = Boolean(subscription?.stripeCustomerId?.trim());
  const insights = premiumSnapshot?.insights ?? null;
  const readiness = premiumSnapshot?.readiness;
  const practice = premiumSnapshot?.practice;
  const lessons = premiumSnapshot?.overallLessons;
  const fc = premiumSnapshot?.flashcards;
  const weakTop3 = topicPerf?.weakTopics.slice(0, 3) ?? [];
  const primaryWeakTopic =
    weakTop3[0]?.normalizedTopic?.trim() ||
    weakTop3[0]?.topic?.trim() ||
    premiumSnapshot?.recommendedQuizTopic?.trim() ||
    "";
  const preferredPathwayId =
    premiumSnapshot?.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ??
    premiumSnapshot?.pathways[0]?.pathwayId ??
    null;
  const catStartHref = resolveStudyLoopCatHref({
    authState: "signed_in",
    pathwayId: preferredPathwayId,
    availablePathwayIds: premiumSnapshot?.pathways.map((p) => p.pathwayId),
    intent: "start",
  });
  const practiceNextHref = primaryWeakTopic
    ? remediationTopicDrillHref(primaryWeakTopic, preferredPathwayId)
    : "/app/questions";
  const lessonsNextHref = premiumSnapshot?.continueLesson?.href?.trim() || "/app/lessons";
  const catNextHref = remediationCatPracticeHref(primaryWeakTopic || undefined, preferredPathwayId);
  const hasInProgressLesson = Boolean(premiumSnapshot?.continueLesson?.href);
  const hasWeakAreasDetected = weakTop3.length > 0;
  const hasRecentCompletion = [...activity.mocks.map((m) => m.at), ...activity.practiceTests.map((pt) => pt.at)].some(
    (at) => nowMs - new Date(at).getTime() <= 72 * 60 * 60 * 1000,
  );
  const quickLinkPriority = resolveInteractionPriority({
    hasResume: hasInProgressLesson,
    hasWeakFocus: hasWeakAreasDetected,
    hasRecentCompletion,
  });
  const quickLinkEmphasisTarget = resolvePriorityTarget(quickLinkPriority, {
    resume: "lessons",
    weak_focus: "questions",
    review_recent: "cat",
  });

  return (
    <div className="space-y-7">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.profile.kicker")}</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.overview.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.overview.intro")}</p>
      </div>

      {entitlement !== "error" && entitlement.hasAccess ? <LearnerAccountToolGrid t={t} /> : null}

      <section className="nn-card nn-student-card-lift p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("learner.profile.account.heading")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("learner.profile.account.subtitle")}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.email")}</dt>
            <dd className="mt-0.5 font-medium text-foreground">{userRow?.email ?? t("learner.common.notAvailable")}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.name")}</dt>
            <dd className="mt-0.5 font-medium text-foreground">{userRow?.name ?? t("learner.common.notAvailable")}</dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-border/60 pt-6">
          <LearnerProfileAccountActions
            hasPassword={hasPassword}
            showBillingPortal={showBillingPortal}
            variant="full"
          />
        </div>
      </section>

      <section className="nn-card nn-student-card-lift p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("learner.profile.subscription.heading")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("learner.profile.subscription.subtitle")}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.access")}</dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {entitlement === "error"
                ? t("learner.profile.access.verifyUnknown")
                : entitlement.hasAccess
                  ? t("learner.profile.access.activePaid")
                  : t("learner.profile.access.noSubscription")}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.profileTierCountry")}</dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {userRow ? `${tierLabel(userRow.tier)} · ${userRow.country}` : t("learner.common.notAvailable")}
            </dd>
          </div>
          {subscription ? (
            <>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.stripeSubscription")}</dt>
                <dd className="mt-0.5 font-mono text-xs text-foreground">{subscription.stripeSubscriptionId}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.stripeStatus")}</dt>
                <dd className="mt-0.5 font-medium text-foreground">{subscription.status}</dd>
              </div>
              {subscription.planTier ? (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.planTierCheckout")}</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{tierLabel(subscription.planTier)}</dd>
                </div>
              ) : null}
              {subscription.planCountry ? (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.planCountry")}</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{subscription.planCountry}</dd>
                </div>
              ) : null}
            </>
          ) : null}
          {userRow?.trialStatus && userRow.trialStatus !== TrialStatus.NONE ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.trial")}</dt>
              <dd className="mt-0.5 text-foreground">
                {userRow.trialStatus}
                {userRow.trialEndsAt
                  ? t("learner.profile.trialEndsAt", {
                      date: userRow.trialEndsAt.toLocaleDateString(localeTag),
                    })
                  : ""}
              </dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/pricing"
            className="nn-premium-action-chip inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/80"
          >
            {t("learner.profile.cta.plansPricing")}
          </Link>
          {entitlement !== "error" && entitlement.hasAccess ? (
            <Link
              href="/app/study-plan"
              className="nn-premium-action-chip inline-flex rounded-full border border-role-cta/30 bg-role-cta-soft px-4 py-2 text-sm font-semibold text-role-cta-on-soft hover:bg-[color-mix(in_srgb,var(--role-cta)_14%,var(--bg-card))]"
            >
              {t("learner.profile.cta.studyPlanner")}
            </Link>
          ) : null}
        </div>
      </section>

      {entitlement !== "error" && entitlement.hasAccess ? <ExamPlanSettingsCard /> : null}

      {entitlement !== "error" && entitlement.hasAccess && premiumSnapshot ? (
        <section className="nn-card nn-student-card-lift p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("learner.profile.performance.heading")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("learner.profile.performance.subtitle")}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.profile.snapshot.lessons")}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-primary">
                {lessons && lessons.total > 0 ? `${lessons.pct}%` : t("learner.common.notAvailable")}
              </p>
              <p className="text-xs text-muted-foreground">
                {lessons && lessons.total > 0 ? `${lessons.completed} / ${lessons.total}` : t("learner.profile.snapshot.startLesson")}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.profile.snapshot.scoredAccuracy")}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-primary">
                {practice && practice.gradedTotal > 0 ? `${practice.accuracyPct ?? 0}%` : t("learner.common.notAvailable")}
              </p>
              <p className="text-xs text-muted-foreground">
                {practice && practice.gradedTotal > 0
                  ? t("learner.profile.snapshot.scoredDetail", {
                      graded: practice.gradedTotal,
                      sessions: practice.sessionCount,
                    })
                  : t("learner.profile.snapshot.scoredEmpty")}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.profile.snapshot.streak")}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-primary">
                {premiumSnapshot.studyStreakDays > 0 ? premiumSnapshot.studyStreakDays : t("learner.common.notAvailable")}
              </p>
              <p className="text-xs text-muted-foreground">{t("learner.profile.snapshot.streakSub")}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.profile.snapshot.flashcards")}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-primary">
                {fc ? fc.cardsReviewedTotal : t("learner.common.notAvailable")}
              </p>
              <p className="text-xs text-muted-foreground">{t("learner.profile.snapshot.fcReviews")}</p>
            </div>
          </div>
          {readiness ? (
            <div className="mt-5 rounded-xl border border-role-cta/20 bg-role-cta-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.profile.readiness.label")}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">
                {readiness.score != null ? `${readiness.score}/100` : t("learner.common.notAvailable")}
                <span className="ml-2 text-base font-semibold text-muted-foreground">
                  {readinessBandLabel(readiness.band)}
                </span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{readiness.summary}</p>
              {readiness.calibratedPreview ? (
                <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">{t("learner.profile.readiness.calibrationNote")}</p>
              ) : null}
              {readiness.holdingBack.length > 0 ? (
                <p className="mt-2 text-sm text-foreground">
                  <span className="font-medium">{t("learner.profile.readiness.holdingBack")} </span>
                  {readiness.holdingBack.join(" · ")}
                </p>
              ) : null}
              {readiness.factors.length > 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{t("learner.profile.readiness.helping")} </span>
                  {readiness.factors
                    .filter((f) => f.points > 0)
                    .slice(0, 4)
                    .map((f) => f.label)
                    .join(" · ") || t("learner.profile.readiness.helpingFallback")}
                </p>
              ) : null}
              <div className="mt-4 border-t border-role-cta/25 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.profile.readiness.nextStepsTitle")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("learner.profile.readiness.nextStepsLead")}</p>
                {weakTop3.length > 0 ? (
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("learner.profile.readiness.weakTopicsTitle")}
                    </p>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-foreground">
                      {weakTop3.map((w) => (
                        <li key={w.normalizedTopic ?? w.topic}>
                          {t("learner.profile.readiness.weakTopicItem", { topic: w.topic, rate: w.missRate })}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={practiceNextHref}
                    className="nn-premium-action-chip inline-flex rounded-full border border-role-cta/30 bg-role-cta-soft px-4 py-2 text-sm font-semibold text-role-cta-on-soft hover:bg-[color-mix(in_srgb,var(--role-cta)_14%,var(--bg-card))]"
                  >
                    {t("learner.profile.readiness.ctaPractice")}
                  </Link>
                  <Link
                    href={lessonsNextHref}
                    className="nn-premium-action-chip inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/80"
                  >
                    {t("learner.profile.readiness.ctaLessons")}
                  </Link>
                  <Link
                    href={catNextHref}
                    className="nn-premium-action-chip inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/80"
                  >
                    {t("learner.profile.readiness.ctaCat")}
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      ) : entitlement !== "error" && !entitlement.hasAccess ? (
        <>
          <PremiumEmptyState
            headline={t("learner.profile.performanceGate.heading")}
            body={t("learner.profile.performanceGate.body")}
            hint={emptyStateCopy.entitlementLocked.body}
            tone="locked"
            primaryCta={{ label: t("cta.continuePlan"), href: "/pricing", variant: "primary" }}
            secondaryCtas={[{ label: t("learner.profile.cta.plansPricing"), href: "/pricing", variant: "secondary" }]}
            visualLayout="stack"
            ctaLayout="stack"
          />
          <LockedStudyNextPreview className="nn-card space-y-2 p-6" />
        </>
      ) : null}

      {topicPerf && entitlement !== "error" && entitlement.hasAccess ? (
        <section className="nn-card nn-student-card-lift p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("learner.profile.topics.heading")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("learner.profile.topics.subtitle")}</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.profile.topics.priorityReview")}</p>
              <ul className="mt-2 space-y-2">
                {topicPerf.weakTopics.slice(0, 5).map((w) => {
                  const insight = insights?.weakAreas.find((x) => x.topic === w.topic);
                  const acc = w.attempted > 0 ? Math.round(100 - w.missRate) : null;
                  const missLabel =
                    w.missed === 1
                      ? t("learner.profile.topics.missOne", { count: w.missed })
                      : t("learner.profile.topics.missMany", { count: w.missed });
                  return (
                    <li key={w.topic} className="rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-3 py-2 text-sm">
                      <span className="font-semibold text-foreground">{w.topic}</span>
                      {insight ? (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {t("learner.profile.topics.topicRisk", { tier: insight.tier, risk: insight.risk })}
                        </span>
                      ) : null}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {acc != null ? t("learner.profile.topics.accuracyLine", { pct: acc }) : t("learner.common.notAvailable")} · {missLabel}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <Link
                          href={remediationTopicDrillHref(w.topic, preferredPathwayId)}
                          className="text-xs font-semibold text-primary underline"
                        >
                          {t("learner.profile.topics.remediateQbank")}
                        </Link>
                        <Link href={remediationWeakModeTestHrefForPathway(w.topic, preferredPathwayId)} className="text-xs font-semibold text-primary underline">
                          {t("learner.profile.topics.weakMode")}
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {topicPerf.weakTopics.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">{t("learner.profile.topics.emptyWeak")}</p>
              ) : null}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.profile.topics.strongHeading")}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {topicPerf.strongTopics.slice(0, 8).map((s) => (
                  <li
                    key={s.topic}
                    className="rounded-full border border-[color-mix(in_srgb,var(--role-success)_22%,transparent)] bg-role-success-soft px-3 py-1 text-xs font-medium text-role-success-text"
                  >
                    {s.topic}{" "}
                    <span className="tabular-nums opacity-80">({100 - s.missRate}%)</span>
                  </li>
                ))}
              </ul>
              {topicPerf.strongTopics.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">{t("learner.profile.topics.emptyStrong")}</p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {insights && entitlement !== "error" && entitlement.hasAccess ? (
        <LearnerInsightEnginePanel insights={insights} />
      ) : null}

      {adaptive && entitlement !== "error" && entitlement.hasAccess && topicPerf ? (
        <AdaptiveStudyOverview adaptive={adaptive} compact userId={userId} />
      ) : null}

      {entitlement !== "error" && entitlement.hasAccess ? (
        <section className="nn-card nn-student-card-lift p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("learner.profile.quickLinks.heading")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("learner.profile.quickLinks.subtitle")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/app/lessons"
              className={`nn-premium-action-chip rounded-full border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/80 ${
                quickLinkEmphasisTarget === "lessons"
                  ? "border-[color-mix(in_srgb,var(--semantic-success)_34%,var(--semantic-border-soft))]"
                  : "border-border"
              }`}
            >
              {t("learner.profile.quickLinks.lessons")}
            </Link>
            <Link
              href="/app/questions"
              className={`nn-premium-action-chip rounded-full border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/80 ${
                quickLinkEmphasisTarget === "questions"
                  ? "border-[color-mix(in_srgb,var(--semantic-warning)_34%,var(--semantic-border-soft))]"
                  : "border-border"
              }`}
            >
              {t("learner.profile.quickLinks.questionBank")}
            </Link>
            <Link
              href="/app/flashcards"
              className="nn-premium-action-chip rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/80"
            >
              {t("learner.profile.quickLinks.flashcards")}
            </Link>
            <TrackedStudyLoopCatLink
              href={catStartHref}
              sourceSurface="learner_overview_quick_link"
              pathwayId={preferredPathwayId}
              className={`nn-premium-action-chip rounded-full border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/80 ${
                quickLinkEmphasisTarget === "cat"
                  ? "border-[color-mix(in_srgb,var(--semantic-brand)_34%,var(--semantic-border-soft))]"
                  : "border-border"
              }`}
            >
              {t("learner.profile.quickLinks.catPractice")}
            </TrackedStudyLoopCatLink>
            <Link
              href="/app/study-plan"
              className="nn-premium-action-chip rounded-full border border-role-cta/30 bg-role-cta-soft px-4 py-2 text-sm font-semibold text-role-cta-on-soft"
            >
              {t("learner.profile.quickLinks.studyPlanner")}
            </Link>
          </div>
        </section>
      ) : null}

      {entitlement !== "error" && entitlement.hasAccess ? (
        <section className="nn-card nn-student-card-lift p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("learner.profile.activity.heading")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("learner.profile.activity.subtitle")}</p>
          {activity.degraded?.active ? <div className="mt-4"><LearnerSilentSectionDegradedFallback surfaceName="profile-activity" /></div> : null}
          <div className="mt-4 grid gap-6 lg:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.profile.activity.mocks")}</p>
              <ul className="mt-2 space-y-2 text-sm">
                {activity.mocks.length === 0 ? (
                  <li className="text-muted-foreground">{t("learner.profile.activity.noMocks")}</li>
                ) : (
                  activity.mocks.map((m) => (
                    <li key={m.id}>
                      <Link href={m.href} className="font-medium text-primary underline">
                        {m.title}
                      </Link>
                      <span className="text-muted-foreground">
                        {" "}
                        · {m.pct}% ({m.score}/{m.total})
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.profile.activity.practiceTests")}</p>
              <ul className="mt-2 space-y-2 text-sm">
                {activity.practiceTests.length === 0 ? (
                  <li className="text-muted-foreground">{t("learner.profile.activity.noAdaptive")}</li>
                ) : (
                  activity.practiceTests.map((pt) => (
                    <li key={pt.id}>
                      <Link href={pt.href} className="font-medium text-primary underline">
                        {pt.title ?? t("learner.profile.activity.practiceTestFallback")}
                      </Link>
                      <span className="text-muted-foreground">
                        {" "}
                        · {pt.status}
                        {pt.accuracyPct != null ? ` · ${pt.accuracyPct}%` : ""}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.profile.activity.lessons")}</p>
              <ul className="mt-2 space-y-2 text-sm">
                {activity.lessons.length === 0 ? (
                  <li className="text-muted-foreground">{t("learner.profile.activity.noLessons")}</li>
                ) : (
                  activity.lessons.map((l) => (
                    <li key={l.lessonId}>
                      <Link href={l.href} className="font-medium text-primary underline">
                        {l.title}
                      </Link>
                      <span className="text-muted-foreground">
                        {" "}
                        · {l.completed ? t("learner.profile.activity.status.completed") : t("learner.profile.activity.status.inProgress")}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
