import Link from "next/link";
import { SubscriptionStatus, TrialStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ExamPlanSettingsCard } from "@/components/student/exam-plan-settings-card";
import { LearnerInsightEnginePanel } from "@/components/student/learner-insight-engine-panel";
import { LearnerProfileAccountActions } from "@/components/student/learner-profile-account-actions";
import { AdaptiveStudyOverview } from "@/components/student/adaptive-study-overview";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildAdaptiveRecommendations } from "@/lib/learner/adaptive-recommendations";
import { loadLearnerProfileActivity } from "@/lib/learner/load-learner-profile-activity";
import { loadPremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { readinessBandLabel } from "@/lib/learner/readiness-score";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile & account",
  robots: { index: false, follow: false },
};

function tierLabel(t: string): string {
  return t.replace(/_/g, " ");
}

export default async function LearnerProfilePage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-6">
        <h1 className="text-3xl font-bold text-[var(--theme-heading-text)]">Profile</h1>
        <p className="text-sm text-muted-foreground">Sign in to manage your account.</p>
      </main>
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
  let activity = await loadLearnerProfileActivity(userId);

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
          select: { examDate: true, examDatePlanType: true },
        });
        adaptive = buildAdaptiveRecommendations({
          examDatePlanType: userExam?.examDatePlanType,
          examDate: userExam?.examDate ?? null,
          readiness: premiumSnapshot.readiness,
          weakTopics: topicPerf.weakTopics,
          topicTrends: topicPerf.trends,
          streakDays: premiumSnapshot.studyStreakDays,
          lessonPct: premiumSnapshot.overallLessons.pct,
          continueLesson: premiumSnapshot.continueLesson,
          recommendedQuizTopic: premiumSnapshot.recommendedQuizTopic,
          mockCount: premiumSnapshot.mockCount,
          practiceSessionCount: premiumSnapshot.practice.sessionCount,
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

  return (
    <main className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Control center</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Profile & account</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Manage your sign-in, subscription, and see how you are performing—then jump straight into the next best session.
        </p>
      </div>

      <section className="nn-card p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">Identity and password security.</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</dt>
            <dd className="mt-0.5 font-medium text-foreground">{userRow?.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</dt>
            <dd className="mt-0.5 font-medium text-foreground">{userRow?.name ?? "—"}</dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-border/60 pt-6">
          <LearnerProfileAccountActions hasPassword={hasPassword} showBillingPortal={showBillingPortal} />
        </div>
      </section>

      <section className="nn-card p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Subscription</h2>
        <p className="mt-1 text-sm text-muted-foreground">What your account is scoped to in NurseNest.</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Access</dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {entitlement === "error"
                ? "Could not verify subscription status."
                : entitlement.hasAccess
                  ? "Active paid access"
                  : "No active subscription"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Profile tier & country</dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {userRow ? `${tierLabel(userRow.tier)} · ${userRow.country}` : "—"}
            </dd>
          </div>
          {subscription ? (
            <>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Stripe subscription</dt>
                <dd className="mt-0.5 font-mono text-xs text-foreground">{subscription.stripeSubscriptionId}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Stripe status</dt>
                <dd className="mt-0.5 font-medium text-foreground">{subscription.status}</dd>
              </div>
              {subscription.planTier ? (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Plan tier (checkout)</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{tierLabel(subscription.planTier)}</dd>
                </div>
              ) : null}
              {subscription.planCountry ? (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Plan country</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{subscription.planCountry}</dd>
                </div>
              ) : null}
            </>
          ) : null}
          {userRow?.trialStatus && userRow.trialStatus !== TrialStatus.NONE ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Trial</dt>
              <dd className="mt-0.5 text-foreground">
                {userRow.trialStatus}
                {userRow.trialEndsAt ? ` · ends ${userRow.trialEndsAt.toLocaleDateString()}` : ""}
              </dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/pricing"
            className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/80"
          >
            Plans & pricing
          </Link>
          {entitlement !== "error" && entitlement.hasAccess ? (
            <Link
              href="/app/study-plan"
              className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15"
            >
              Study planner
            </Link>
          ) : null}
        </div>
      </section>

      {entitlement !== "error" && entitlement.hasAccess ? <ExamPlanSettingsCard /> : null}

      {entitlement !== "error" && entitlement.hasAccess && premiumSnapshot ? (
        <section className="nn-card p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Performance snapshot</h2>
          <p className="mt-1 text-sm text-muted-foreground">Aggregates from your subscription scope and graded activity.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Lessons</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-primary">
                {lessons && lessons.total > 0 ? `${lessons.pct}%` : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {lessons && lessons.total > 0 ? `${lessons.completed} / ${lessons.total}` : "Start a lesson"}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Scored accuracy</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-primary">
                {practice && practice.gradedTotal > 0 ? `${practice.accuracyPct ?? 0}%` : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {practice && practice.gradedTotal > 0
                  ? `${practice.gradedTotal} graded · ${practice.sessionCount} session(s)`
                  : "Finish a bank or mock block"}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Streak</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-primary">
                {premiumSnapshot.studyStreakDays > 0 ? premiumSnapshot.studyStreakDays : "—"}
              </p>
              <p className="text-xs text-muted-foreground">Days with activity</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Flashcards</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-primary">
                {fc ? fc.cardsReviewedTotal : "—"}
              </p>
              <p className="text-xs text-muted-foreground">Reviews logged</p>
            </div>
          </div>
          {readiness ? (
            <div className="mt-5 rounded-xl border border-primary/15 bg-primary/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Readiness</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">
                {readiness.score != null ? `${readiness.score}/100` : "—"}
                <span className="ml-2 text-base font-semibold text-muted-foreground">
                  {readinessBandLabel(readiness.band)}
                </span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{readiness.summary}</p>
              {readiness.holdingBack.length > 0 ? (
                <p className="mt-2 text-sm text-foreground">
                  <span className="font-medium">Holding back: </span>
                  {readiness.holdingBack.join(" · ")}
                </p>
              ) : null}
              {readiness.factors.length > 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Helping: </span>
                  {readiness.factors
                    .filter((f) => f.points > 0)
                    .slice(0, 4)
                    .map((f) => f.label)
                    .join(" · ") || "Keep practicing—signals will sharpen."}
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : entitlement !== "error" && !entitlement.hasAccess ? (
        <section className="nn-card p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Performance</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Subscribe to unlock full lesson pools, the question bank, CAT practice tests, flashcards, and readiness tracking.
          </p>
          <Link href="/pricing" className="mt-3 inline-block text-sm font-semibold text-primary underline">
            View plans
          </Link>
        </section>
      ) : null}

      {topicPerf && entitlement !== "error" && entitlement.hasAccess ? (
        <section className="nn-card p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Strong & weak topics</h2>
          <p className="mt-1 text-sm text-muted-foreground">From graded question bank, practice tests, and mocks.</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Priority review</p>
              <ul className="mt-2 space-y-2">
                {topicPerf.weakTopics.slice(0, 5).map((w) => {
                  const insight = insights?.weakAreas.find((x) => x.topic === w.topic);
                  const acc = w.attempted > 0 ? Math.round(100 - w.missRate) : null;
                  return (
                    <li key={w.topic} className="rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-3 py-2 text-sm">
                      <span className="font-semibold text-foreground">{w.topic}</span>
                      {insight ? (
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({insight.tier} risk · {insight.risk})
                        </span>
                      ) : null}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {acc != null ? `${acc}% accuracy` : "—"} · {w.missed} miss{w.missed === 1 ? "" : "es"}
                      </p>
                      <Link
                        href={`/app/questions?preset=topic_drill&topic=${encodeURIComponent(w.topic)}`}
                        className="mt-2 inline-block text-xs font-semibold text-primary underline"
                      >
                        Drill this topic
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {topicPerf.weakTopics.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  No weak-topic signal yet—complete a graded bank block or practice test to populate this list.
                </p>
              ) : null}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Strong topics</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {topicPerf.strongTopics.slice(0, 8).map((s) => (
                  <li
                    key={s.topic}
                    className="rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-medium text-emerald-900 dark:text-emerald-100"
                  >
                    {s.topic}{" "}
                    <span className="tabular-nums opacity-80">({100 - s.missRate}%)</span>
                  </li>
                ))}
              </ul>
              {topicPerf.strongTopics.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">Strong topics appear after enough graded volume per topic.</p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {insights && entitlement !== "error" && entitlement.hasAccess ? (
        <LearnerInsightEnginePanel insights={insights} />
      ) : null}

      {adaptive && entitlement !== "error" && entitlement.hasAccess && topicPerf ? (
        <AdaptiveStudyOverview adaptive={adaptive} compact />
      ) : null}

      {entitlement !== "error" && entitlement.hasAccess ? (
        <section className="nn-card p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Quick links</h2>
          <p className="mt-1 text-sm text-muted-foreground">Jump into your study tools.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/app/lessons"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/80"
            >
              Lessons
            </Link>
            <Link
              href="/app/questions"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/80"
            >
              Question bank
            </Link>
            <Link
              href="/app/flashcards"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/80"
            >
              Flashcards
            </Link>
            <Link
              href="/app/practice-tests"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/80"
            >
              CAT / practice tests
            </Link>
            <Link
              href="/app/study-plan"
              className="rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
            >
              Study planner
            </Link>
          </div>
        </section>
      ) : null}

      {entitlement !== "error" && entitlement.hasAccess ? (
        <section className="nn-card p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Recent activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">Resume where you left off when possible.</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mocks</p>
              <ul className="mt-2 space-y-2 text-sm">
                {activity.mocks.length === 0 ? (
                  <li className="text-muted-foreground">No mock attempts yet.</li>
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
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Practice tests</p>
              <ul className="mt-2 space-y-2 text-sm">
                {activity.practiceTests.length === 0 ? (
                  <li className="text-muted-foreground">No adaptive or linear tests yet.</li>
                ) : (
                  activity.practiceTests.map((t) => (
                    <li key={t.id}>
                      <Link href={t.href} className="font-medium text-primary underline">
                        {t.title ?? "Practice test"}
                      </Link>
                      <span className="text-muted-foreground">
                        {" "}
                        · {t.status}
                        {t.accuracyPct != null ? ` · ${t.accuracyPct}%` : ""}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lessons</p>
              <ul className="mt-2 space-y-2 text-sm">
                {activity.lessons.length === 0 ? (
                  <li className="text-muted-foreground">No lesson progress yet.</li>
                ) : (
                  activity.lessons.map((l) => (
                    <li key={l.lessonId}>
                      <Link href={l.href} className="font-medium text-primary underline">
                        {l.title}
                      </Link>
                      <span className="text-muted-foreground">
                        {" "}
                        · {l.completed ? "completed" : "in progress"}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
