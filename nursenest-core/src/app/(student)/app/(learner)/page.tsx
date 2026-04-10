import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { LearnerDailyMomentumCard } from "@/components/student/learner-daily-momentum-card";
import { LearnerDashboardAdvantageStrip } from "@/components/student/learner-dashboard-advantage-strip";
import { LearnerDashboardCommandCenter } from "@/components/student/learner-dashboard-command-center";
import { PremiumLearnerHub } from "@/components/student/premium-learner-hub";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LockedStudyNextPreview } from "@/components/student/locked-study-next-preview";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildLearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import {
  buildContinueLearningItems,
  continueLearningItemsToLinks,
} from "@/lib/learner/build-continue-learning-items";
import { loadLearnerRetentionPreferences } from "@/lib/learner/load-learner-retention-preferences";
import { loadTodayGoalProgress } from "@/lib/learner/load-today-goal-progress";
import { loadPremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { loadRecentLearnerNotesSummary } from "@/lib/learner/load-recent-learner-notes-summary";
import { LearnerAdaptiveFocusCard } from "@/components/student/learner-adaptive-focus-card";
import { LearnerContinueLearningCard } from "@/components/student/learner-continue-learning-card";
import { LearnerDashboardInsightPanels } from "@/components/student/learner-dashboard-insight-panels";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

function retentionPersonalNote(t: LearnerMarketingT, prefs: Awaited<ReturnType<typeof loadLearnerRetentionPreferences>>): string | null {
  if (!prefs) return null;
  if (prefs.dailyStudyMinutes != null) {
    return t("learner.retention.personalMinutesHint", { n: prefs.dailyStudyMinutes });
  }
  if (prefs.studyGoal?.trim()) {
    return t("learner.retention.studyGoalEcho", { goal: prefs.studyGoal.trim() });
  }
  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLearnerMarketingBundle();
  return {
    title: t("learner.dashboard.metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function LearnerDashboardPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const crumbs = appShellBreadcrumbs("dashboard");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <h1 className="text-3xl font-bold text-[var(--theme-heading-text)]">{t("learner.dashboard.signedOutTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("learner.dashboard.signedOutHint")}</p>
      </main>
    );
  }

  if (entitlement === "error") {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.entitlement.verifyFailed")}</p>
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.dashboard.kicker")}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">{t("learner.dashboard.title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.dashboard.subtitle.locked")}</p>
        </div>
        <LockedStudyNextPreview className="nn-card space-y-2 p-6" />
        <SubscriptionPaywall context="dashboard" />
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/app/account/overview" className="font-semibold text-primary underline underline-offset-2">
            {t("learner.dashboard.accountHubLink")}
          </Link>
        </p>
      </main>
    );
  }

  let snapshot = null;
  let studySnap: Awaited<ReturnType<typeof buildLearnerStudySnapshot>> = null;
  let weakTopicTitles: string[] = [];
  try {
    const [snap, nextSnap, notes, todayGoal, retentionPrefs] = await Promise.all([
      loadPremiumDashboardSnapshot(userId, entitlement),
      buildLearnerStudySnapshot(userId, entitlement, undefined),
      loadRecentLearnerNotesSummary(userId),
      loadTodayGoalProgress(userId),
      loadLearnerRetentionPreferences(userId),
    ]);
    snapshot = snap;
    studySnap = nextSnap;
    weakTopicTitles = studySnap?.weakTopics.map((w) => w.topic) ?? [];
    if (snapshot) {
      const resume =
        snapshot.continueLesson ??
        (snapshot.lessonContinuations[0]
          ? { title: snapshot.lessonContinuations[0].title, href: snapshot.lessonContinuations[0].href }
          : null);
      const momentumLine = snapshot.momentumMessages[0] ?? null;
      const continueLinks = continueLearningItemsToLinks(buildContinueLearningItems(snapshot), t);
      const personalNote = retentionPersonalNote(t, retentionPrefs);
      const streakProtect =
        todayGoal != null && snapshot.studyStreakDays > 0 && todayGoal.credits < todayGoal.target;

      return (
        <main className="space-y-6">
          <BreadcrumbTrail items={crumbs} />

          {/* Page header */}
          <div className="nn-learner-page-hero">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">{t("learner.dashboard.kicker")}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)]">{t("learner.dashboard.title")}</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">{t("learner.dashboard.subtitle.subscriber")}</p>
          </div>

          {/* KPI snapshot: streak, bank accuracy, lessons, mocks — visible above the fold */}
          <LearnerDashboardCommandCenter snapshot={snapshot} t={t} />

          {/* Daily goal + streak protection nudge */}
          {todayGoal ? (
            <LearnerDailyMomentumCard
              t={t}
              streakDays={snapshot.studyStreakDays}
              todayGoal={todayGoal}
              resume={resume}
              momentumLine={momentumLine}
              focusTopic={weakTopicTitles[0] ?? null}
              personalNote={personalNote}
              showStreakProtectNudge={streakProtect}
            />
          ) : null}

          {/* Core analytics: readiness score, quick actions, progress, performance, weak areas */}
          <LearnerDashboardInsightPanels snapshot={snapshot} t={t} />

          {/* Adaptive focus: deterministic next steps from the same study snapshot */}
          {studySnap ? <LearnerAdaptiveFocusCard snapshot={studySnap} /> : null}

          {/* Continue learning — detail after the analytics, for students who want to pick back up */}
          <LearnerContinueLearningCard t={t} links={continueLinks} />

          {/* Full learner hub */}
          <PremiumLearnerHub
            snapshot={snapshot}
            weakTopicTitles={weakTopicTitles}
            recentNotes={notes}
            suppressFlashcardWeakLine={weakTopicTitles.length > 0}
            compactIntro
            omitReadinessBreakdown
            omitRecentMocks
            readinessDeferHint={t("learner.dashboard.hub.readinessDeferHint")}
          />

          {/* Feature discovery — moved to bottom so it doesn't interrupt data flow */}
          <LearnerDashboardAdvantageStrip t={t} />

          <section className="nn-card flex flex-col gap-3 p-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">{t("learner.dashboard.accountTeaser")}</p>
            <Link
              href="/app/account/overview"
              className="inline-flex w-full shrink-0 justify-center rounded-full border border-role-cta/30 bg-role-cta-soft px-4 py-2.5 text-sm font-semibold text-role-cta-on-soft sm:w-auto"
            >
              {t("learner.dashboard.openAccountHub")}
            </Link>
          </section>
        </main>
      );
    }
  } catch {
    snapshot = null;
  }

  return (
    <main className="space-y-4">
      <BreadcrumbTrail items={crumbs} />
      <p className="text-sm text-muted-foreground">{t("learner.dashboard.loadFailed")}</p>
      <Link href="/app/account/overview" className="text-sm font-semibold text-primary underline">
        {t("learner.dashboard.openAccountHub")}
      </Link>
    </main>
  );
}
