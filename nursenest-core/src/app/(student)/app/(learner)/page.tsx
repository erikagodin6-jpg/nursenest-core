import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { LearnerDailyMomentumCard } from "@/components/student/learner-daily-momentum-card";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LockedStudyNextPreview } from "@/components/student/locked-study-next-preview";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildLearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { loadTodayGoalProgress } from "@/lib/learner/load-today-goal-progress";
import { loadPremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { loadRecentLearnerNotesSummary } from "@/lib/learner/load-recent-learner-notes-summary";
import { LearnerStudentDashboard } from "@/components/student/learner-student-dashboard";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

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
    const [snap, nextSnap, notes, todayGoal] = await Promise.all([
      loadPremiumDashboardSnapshot(userId, entitlement),
      buildLearnerStudySnapshot(userId, entitlement, undefined),
      loadRecentLearnerNotesSummary(userId),
      loadTodayGoalProgress(userId),
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

      return (
        <main className="space-y-6">
          <BreadcrumbTrail items={crumbs} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.dashboard.kicker")}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">{t("learner.dashboard.title")}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.dashboard.subtitle.subscriber")}</p>
          </div>
          {todayGoal ? (
            <LearnerDailyMomentumCard
              t={t}
              streakDays={snapshot.studyStreakDays}
              todayGoal={todayGoal}
              resume={resume}
              momentumLine={momentumLine}
              focusTopic={weakTopicTitles[0] ?? null}
            />
          ) : null}
          <LearnerStudentDashboard snapshot={snapshot} studySnap={studySnap} recentNotes={notes} t={t} />
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
