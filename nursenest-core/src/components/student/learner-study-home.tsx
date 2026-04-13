import Link from "next/link";
import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PrimaryActionCard } from "@/components/student/dashboard/primary-action-card";
import { ExamCountdownCard } from "@/components/student/dashboard/exam-countdown-card";
import { ReadinessScoreCard } from "@/components/student/dashboard/readiness-score-card";
import { LearnerDailyMomentumCard } from "@/components/student/learner-daily-momentum-card";
import { EngagementNudgeStrip } from "@/components/student/engagement-nudge-strip";
import { SpacedReviewReminder } from "@/components/student/spaced-review-reminder";
import { LearnerDashboardCommandCenter } from "@/components/student/learner-dashboard-command-center";
import { LearnerDashboardInsightPanels } from "@/components/student/learner-dashboard-insight-panels";
import { BenchmarkCard } from "@/components/student/dashboard/benchmark-card";
import { WeaknessHeatmap, type HeatmapTopic } from "@/components/student/dashboard/weakness-heatmap";
import { SmartActionsBar } from "@/components/student/dashboard/smart-actions-bar";
import { LearnerAdaptiveFocusCard } from "@/components/student/learner-adaptive-focus-card";
import { LearnerContinueLearningCard } from "@/components/student/learner-continue-learning-card";
import { PremiumLearnerHub, type RecentLearnerNoteSummary } from "@/components/student/premium-learner-hub";
import { LearnerDashboardAdvantageStrip } from "@/components/student/learner-dashboard-advantage-strip";
import { DashboardCoachCard } from "@/components/student/dashboard/coach-card";
import { CoachWeakSummary } from "@/components/study/coach-weak-summary";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import type { ContinueLearningLink } from "@/lib/learner/build-continue-learning-items";
import type { NextBestAction } from "@/lib/learner/next-best-action";
import type { CountdownCopy } from "@/lib/learner/exam-timeline";
import type { TodayGoalProgress } from "@/lib/learner/load-today-goal-progress";
import type { DailyQuestionGoalProgress } from "@/lib/learner/load-daily-question-goal-progress";
import type { BenchmarkData } from "@/lib/learner/benchmark-engine";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import type { DashboardIdentity } from "@/lib/learner/resolve-dashboard-identity";

function StudySurface({
  id,
  eyebrow,
  title,
  intro,
  variant,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string | null;
  variant: "brand" | "cool" | "warm" | "positive";
  children: React.ReactNode;
}) {
  const shell =
    variant === "cool"
      ? "border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_42%,var(--semantic-surface))]"
      : variant === "warm"
        ? "border-[color-mix(in_srgb,var(--semantic-warning)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_38%,var(--semantic-surface))]"
        : variant === "positive"
          ? "border-[color-mix(in_srgb,var(--semantic-success)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_36%,var(--semantic-surface))]"
          : "border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_7%,var(--semantic-surface))]";

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`nn-dash-section rounded-3xl border px-4 py-8 sm:px-7 sm:py-9 ${shell}`}
    >
      <header className="mb-6 max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--semantic-text-muted)]">{eyebrow}</p>
        <h2 id={`${id}-heading`} className="mt-2 text-xl font-semibold tracking-tight text-[var(--semantic-text-primary)] sm:text-2xl">
          {title}
        </h2>
        {intro ? <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{intro}</p> : null}
      </header>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

function RecentGainsBlock({
  trends,
  strongTopics,
  t,
}: {
  trends: TopicTrendRow[];
  strongTopics: WeakTopicRow[];
  t: LearnerMarketingT;
}) {
  const improving = trends.filter((r) => r.momentum === "improving");
  const strengths = strongTopics.slice(0, 4);
  if (improving.length === 0 && strengths.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.studyHome.recentGainsEmpty")}</p>
    );
  }
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {improving.length > 0 ? (
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_6%,transparent)] p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-success)]">{t("learner.studyHome.recentGainsImprovingLabel")}</p>
          <ul className="mt-3 space-y-2.5">
            {improving.slice(0, 4).map((row) => (
              <li key={row.topic}>
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{row.topic}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{row.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {strengths.length > 0 ? (
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_8%,transparent)] p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-3)_90%,var(--semantic-text-primary))]">
            {t("learner.studyHome.recentGainsStrengthLabel")}
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-[var(--semantic-text-secondary)]">
            {strengths.map((s) => (
              <li key={s.topic} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-chart-3)]" aria-hidden />
                <span>{s.topic}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export type LearnerStudyHomeProps = {
  crumbs: BreadcrumbCrumb[];
  t: LearnerMarketingT;
  identity: DashboardIdentity;
  heroHeading: string;
  snapshot: PremiumDashboardSnapshot;
  studySnap: LearnerStudySnapshot | null;
  benchmark: BenchmarkData | null;
  heatmapTopics: HeatmapTopic[];
  weakTopicTitles: string[];
  continueLinks: ContinueLearningLink[];
  nextAction: NextBestAction;
  todayGoal: TodayGoalProgress | null;
  questionBankGoal: DailyQuestionGoalProgress | null;
  resume: { title: string; href: string } | null;
  momentumLine: string | null;
  personalNote: string | null;
  streakProtect: boolean;
  progressFeedbackLine: string | null;
  countdown: CountdownCopy;
  questionsPerDay: number | null;
  daysLeft: number | null;
  recentNotes: RecentLearnerNoteSummary[];
  readinessDeferHint: string;
  showCoach: boolean;
};

export function LearnerStudyHome({
  crumbs,
  t,
  identity,
  heroHeading,
  snapshot,
  studySnap,
  benchmark,
  heatmapTopics,
  weakTopicTitles,
  continueLinks,
  nextAction,
  todayGoal,
  questionBankGoal,
  resume,
  momentumLine,
  personalNote,
  streakProtect,
  progressFeedbackLine,
  countdown,
  questionsPerDay,
  daysLeft,
  recentNotes,
  readinessDeferHint,
  showCoach,
}: LearnerStudyHomeProps) {
  const trends = studySnap?.topicTrends ?? [];
  const strongHighlight = studySnap?.strongTopicsHighlight ?? [];

  return (
    <main className="nn-dash">
      <BreadcrumbTrail items={crumbs} />

      {/* Editorial hero */}
      <header className="relative overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-gradient-to-br from-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] via-[var(--semantic-surface)] to-[color-mix(in_srgb,var(--semantic-panel-cool)_55%,var(--semantic-surface))] px-5 py-8 sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--semantic-chart-4)_18%,transparent),transparent_62%)] blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
            {identity.pill}
          </span>
          <p className="text-[0.6875rem] font-medium text-[var(--semantic-text-secondary)]">{identity.subtitle}</p>
        </div>
        <p className="relative mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--semantic-text-muted)]">{t("learner.studyHome.heroEyebrow")}</p>
        <h1 className="relative mt-2 text-2xl font-extrabold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">{heroHeading}</h1>
        <p className="relative mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.studyHome.heroLead")}</p>
      </header>

      {/* Continue + exam pacing */}
      <StudySurface
        id="study-priority"
        eyebrow={t("learner.studyHome.sectionPriorityEyebrow")}
        title={t("learner.studyHome.sectionPriorityTitle")}
        intro={t("learner.studyHome.sectionPriorityIntro")}
        variant="brand"
      >
        <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-8">
            <PrimaryActionCard action={nextAction} />
          </div>
          <div className="flex flex-col gap-4 lg:col-span-4">
            <ExamCountdownCard countdown={countdown} questionsPerDay={questionsPerDay} />
            <nav
              className="flex flex-wrap gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,transparent)] p-3"
              aria-label={t("learner.studyHome.quickLinksAria")}
            >
              <Link
                href="/app/study-plan"
                className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))]"
              >
                {t("learner.studyHome.linkStudyPlan")}
              </Link>
              <Link
                href="/app/exam-plan"
                className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))]"
              >
                {t("learner.studyHome.linkExamPlan")}
              </Link>
              <Link
                href="/app/account/review-queue"
                className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))]"
              >
                {t("learner.studyHome.linkReviewQueue")}
              </Link>
            </nav>
          </div>
        </div>
      </StudySurface>

      <div className="nn-dash-divider" />

      {/* Readiness snapshot */}
      <section className="nn-dash-section" aria-labelledby="readiness-snapshot-heading">
        <header>
          <p className="nn-dash-section-label">{t("learner.studyHome.sectionReadinessEyebrow")}</p>
          <h2 id="readiness-snapshot-heading" className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">
            {t("learner.studyHome.sectionReadinessTitle")}
          </h2>
        </header>
        <ReadinessScoreCard readiness={snapshot.readiness} t={t} maxFactors={4} />
      </section>

      <div className="nn-dash-divider" />

      {/* Today + due reviews */}
      <StudySurface
        id="study-today"
        eyebrow={t("learner.studyHome.sectionTodayEyebrow")}
        title={t("learner.studyHome.sectionTodayTitle")}
        intro={t("learner.studyHome.sectionTodayIntro")}
        variant="warm"
      >
        {todayGoal ? (
          <LearnerDailyMomentumCard
            t={t}
            streakDays={snapshot.studyStreakDays}
            todayGoal={todayGoal}
            questionGoal={questionBankGoal}
            resume={resume}
            momentumLine={momentumLine}
            focusTopic={weakTopicTitles[0] ?? null}
            personalNote={personalNote}
            showStreakProtectNudge={streakProtect}
            progressFeedbackLine={progressFeedbackLine}
          />
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
          <div className="min-w-0 flex-1 sm:min-w-[240px]">
            <SpacedReviewReminder />
          </div>
          <div className="min-w-0 flex-[2]">
            <EngagementNudgeStrip maxItems={3} />
          </div>
        </div>
      </StudySurface>

      <div className="nn-dash-divider" />

      {/* KPI snapshot */}
      <section className="nn-dash-section" aria-labelledby="numbers-h">
        <p id="numbers-h" className="nn-dash-section-label">
          {t("learner.studyHome.sectionNumbersEyebrow")}
        </p>
        <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{t("learner.studyHome.sectionNumbersTitle")}</h2>
        <LearnerDashboardCommandCenter snapshot={snapshot} t={t} />
      </section>

      <div className="nn-dash-divider" />

      {/* Attention map */}
      <StudySurface
        id="study-attention"
        eyebrow={t("learner.studyHome.sectionAttentionEyebrow")}
        title={t("learner.studyHome.sectionAttentionTitle")}
        intro={t("learner.studyHome.sectionAttentionIntro")}
        variant="cool"
      >
        <LearnerDashboardInsightPanels snapshot={snapshot} t={t} />
        {benchmark ? <BenchmarkCard data={benchmark} /> : null}
        {heatmapTopics.length > 0 ? <WeaknessHeatmap topics={heatmapTopics} /> : null}
        {showCoach && weakTopicTitles.length > 0 ? (
          <CoachWeakSummary weakTopics={weakTopicTitles} examTarget={undefined} daysUntilExam={daysLeft} />
        ) : null}
      </StudySurface>

      <div className="nn-dash-divider" />

      {/* Recent gains + plan depth */}
      <StudySurface
        id="study-momentum"
        eyebrow={t("learner.studyHome.sectionMomentumEyebrow")}
        title={t("learner.studyHome.sectionMomentumTitle")}
        intro={t("learner.studyHome.sectionMomentumIntro")}
        variant="positive"
      >
        <RecentGainsBlock trends={trends} strongTopics={strongHighlight} t={t} />
        {studySnap ? <LearnerAdaptiveFocusCard snapshot={studySnap} /> : null}
        {showCoach ? (
          <DashboardCoachCard weakTopics={weakTopicTitles} examTarget={undefined} daysUntilExam={daysLeft} />
        ) : null}
      </StudySurface>

      <div className="nn-dash-divider" />

      {/* Explore kit */}
      <StudySurface
        id="study-explore"
        eyebrow={t("learner.studyHome.sectionExploreEyebrow")}
        title={t("learner.studyHome.sectionExploreTitle")}
        intro={t("learner.studyHome.sectionExploreIntro")}
        variant="brand"
      >
        <LearnerContinueLearningCard t={t} links={continueLinks} />
        <PremiumLearnerHub
          snapshot={snapshot}
          weakTopicTitles={weakTopicTitles}
          recentNotes={recentNotes}
          suppressFlashcardWeakLine={weakTopicTitles.length > 0}
          compactIntro
          omitReadinessBreakdown
          omitRecentMocks
          readinessDeferHint={readinessDeferHint}
        />
        <SmartActionsBar />
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
      </StudySurface>
    </main>
  );
}
