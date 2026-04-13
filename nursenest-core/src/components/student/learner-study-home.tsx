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
import { CoachReadinessCard } from "@/components/study/coach-readiness-card";
import { CoachPriorityList } from "@/components/study/coach-priority-list";
import { CoachPatternInsights } from "@/components/study/coach-pattern-insights";
import { CoachInterventionBanner } from "@/components/study/coach-intervention-banner";
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
import type { CoachDashboardSummary } from "@/lib/coach/study-coach-types";
import type { StudySettings } from "@/lib/learner/study-settings";
import {
  LearnerFilterChips,
  LearnerKickerHeading,
  LearnerStudySurfaceSection,
  LearnerSurface,
} from "@/components/learner-ui";
import { BrandLeafIcon } from "@/components/brand/brand-leaf-icon";

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
      <div className="flex items-start gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_04%,var(--semantic-surface))] px-4 py-3">
        <span className="mt-0.5 shrink-0 rounded-lg border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))] p-1.5">
          <BrandLeafIcon tone="muted" size={22} />
        </span>
        <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.studyHome.recentGainsEmpty")}</p>
      </div>
    );
  }
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {improving.length > 0 ? (
        <LearnerSurface tone="success" padding="md" radius="lg" accentTop>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-success)]">{t("learner.studyHome.recentGainsImprovingLabel")}</p>
          <ul className="mt-3 space-y-2.5">
            {improving.slice(0, 4).map((row) => (
              <li key={row.topic}>
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{row.topic}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{row.summary}</p>
              </li>
            ))}
          </ul>
        </LearnerSurface>
      ) : null}
      {strengths.length > 0 ? (
        <LearnerSurface tone="supportive" padding="md" radius="lg">
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
        </LearnerSurface>
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
  coachSummary?: CoachDashboardSummary | null;
  studySettings: StudySettings;
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
  coachSummary,
  studySettings,
}: LearnerStudyHomeProps) {
  const trends = studySnap?.topicTrends ?? [];
  const strongHighlight = studySnap?.strongTopicsHighlight ?? [];
  const showAdvancedInsights = studySettings.showAdvancedInsights;
  const showHeatmap = studySettings.showHeatmap;
  const showWeaknessAlerts = studySettings.enableWeaknessAlerts;
  const showDecayAlerts = studySettings.enableSpacedRepetition && studySettings.enableDecayAlerts;
  const showAdaptivePlan = studySettings.enableAdaptivePlan;
  const heroContextLine = progressFeedbackLine ?? personalNote ?? momentumLine;
  const heroFocusTopic = weakTopicTitles[0] ?? strongHighlight[0]?.topic ?? null;

  return (
    <main className="nn-dash nn-dash--learner-home">
      <BreadcrumbTrail items={crumbs} />

      {/* Editorial hero */}
      <header className="nn-dash-hero-shell">
        <div
          className="nn-dash-hero-shell__glow"
          aria-hidden
        />
        <div className="nn-dash-hero-shell__grid">
          <div className="nn-dash-hero-shell__body">
            <div className="relative flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
                {identity.pill}
              </span>
              <p className="text-[0.6875rem] font-medium text-[var(--semantic-text-secondary)]">{identity.subtitle}</p>
            </div>
            <p className="nn-dash-hero-shell__eyebrow">{t("learner.studyHome.heroEyebrow")}</p>
            <h1 className="nn-dash-hero-shell__title">{heroHeading}</h1>
            <p className="nn-dash-hero-shell__lead">{t("learner.studyHome.heroLead")}</p>
            <div className="nn-dash-hero-shell__chips">
              <LearnerFilterChips
                aria-label={t("learner.studyHome.quickLinksAria")}
                items={[
                  { id: "plan", label: t("learner.studyHome.linkStudyPlan"), href: "/app/study-plan" },
                  { id: "exam", label: t("learner.studyHome.linkExamPlan"), href: "/app/exam-plan" },
                  { id: "reviews", label: t("learner.studyHome.linkReviewQueue"), href: "/app/account/review-queue" },
                ]}
              />
            </div>
          </div>
          <div className="nn-dash-hero-shell__aside">
            {resume ? (
              <Link href={resume.href} className="nn-dash-context-link">
                <span className="nn-dash-context-link__kicker">Resume</span>
                <span className="nn-dash-context-link__title">{resume.title}</span>
              </Link>
            ) : null}
            {heroContextLine || heroFocusTopic ? (
              <LearnerSurface tone="supportive" padding="sm" radius="lg" shadow={false} className="nn-dash-hero-note">
                {heroFocusTopic ? (
                  <p className="nn-dash-hero-note__eyebrow">Current focus</p>
                ) : null}
                {heroFocusTopic ? (
                  <p className="nn-dash-hero-note__title">{heroFocusTopic}</p>
                ) : null}
                {heroContextLine ? (
                  <p className="nn-dash-hero-note__body">{heroContextLine}</p>
                ) : null}
              </LearnerSurface>
            ) : null}
          </div>
        </div>
      </header>

      {/* Continue + exam pacing */}
      <LearnerStudySurfaceSection
        id="study-priority"
        eyebrow={t("learner.studyHome.sectionPriorityEyebrow")}
        title={t("learner.studyHome.sectionPriorityTitle")}
        intro={t("learner.studyHome.sectionPriorityIntro")}
        tone="primary"
        className="nn-dash-band nn-dash-band--priority"
      >
        <div className="nn-dash-priority-grid">
          <div className="nn-dash-priority-grid__main">
            <PrimaryActionCard action={nextAction} />
          </div>
          <div className="nn-dash-priority-grid__rail">
            <ExamCountdownCard countdown={countdown} questionsPerDay={questionsPerDay} />
          </div>
        </div>
      </LearnerStudySurfaceSection>

      {/* Readiness snapshot */}
      <section className="nn-dash-section nn-dash-section--snapshot" aria-labelledby="readiness-snapshot-heading">
        <LearnerKickerHeading
          id="readiness-snapshot-heading"
          kicker={t("learner.studyHome.sectionReadinessEyebrow")}
          title={t("learner.studyHome.sectionReadinessTitle")}
        />
        <div className="nn-dash-snapshot-grid">
          <div className="nn-dash-snapshot-grid__main">
            <ReadinessScoreCard readiness={snapshot.readiness} t={t} maxFactors={showAdvancedInsights ? 4 : 2} />
            {showCoach && coachSummary ? (
              <div
                className={`mt-5 grid gap-4 ${coachSummary.topIntervention ? "lg:grid-cols-2" : ""}`}
              >
                <CoachReadinessCard readiness={coachSummary.readiness} />
                {coachSummary.topIntervention ? (
                  <CoachInterventionBanner intervention={coachSummary.topIntervention} dismissible />
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="nn-dash-snapshot-grid__aside">
            <LearnerDashboardCommandCenter snapshot={snapshot} t={t} />
            {benchmark ? <BenchmarkCard data={benchmark} /> : null}
          </div>
        </div>
      </section>

      {/* Today + due reviews */}
      <LearnerStudySurfaceSection
        id="study-today"
        eyebrow={t("learner.studyHome.sectionTodayEyebrow")}
        title={t("learner.studyHome.sectionTodayTitle")}
        intro={t("learner.studyHome.sectionTodayIntro")}
        tone="warm"
        className="nn-dash-band nn-dash-band--today"
      >
        <div className="nn-dash-today-grid">
          {todayGoal ? (
            <div className="nn-dash-today-grid__main">
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
            </div>
          ) : null}
          <div className="nn-dash-today-grid__rail">
            {showDecayAlerts ? (
              <div className="min-w-0">
                <SpacedReviewReminder />
              </div>
            ) : null}
            <div className="min-w-0">
              <EngagementNudgeStrip
                maxItems={showDecayAlerts ? 3 : 2}
                includeWeaknessAlerts={showWeaknessAlerts}
                includeDecayAlerts={showDecayAlerts}
              />
            </div>
          </div>
        </div>
      </LearnerStudySurfaceSection>

      {/* Attention map */}
      <LearnerStudySurfaceSection
        id="study-attention"
        eyebrow={t("learner.studyHome.sectionAttentionEyebrow")}
        title={t("learner.studyHome.sectionAttentionTitle")}
        intro={t("learner.studyHome.sectionAttentionIntro")}
        tone="supportive"
        className="nn-dash-band nn-dash-band--attention"
      >
        <div className="nn-dash-attention-grid">
          {showAdvancedInsights ? (
            <div className="nn-dash-attention-grid__wide">
              <LearnerDashboardInsightPanels snapshot={snapshot} t={t} />
            </div>
          ) : null}
          {showHeatmap && heatmapTopics.length > 0 ? (
            <div className="nn-dash-attention-grid__full">
              <WeaknessHeatmap topics={heatmapTopics} />
            </div>
          ) : null}
          {showCoach && weakTopicTitles.length > 0 ? (
            <div className="nn-dash-attention-grid__aside">
              <CoachWeakSummary
                weakTopics={weakTopicTitles}
                examTarget={undefined}
                daysUntilExam={daysLeft}
              />
            </div>
          ) : null}
        </div>
      </LearnerStudySurfaceSection>

      {/* Recent gains + plan depth */}
      <LearnerStudySurfaceSection
        id="study-momentum"
        eyebrow={t("learner.studyHome.sectionMomentumEyebrow")}
        title={t("learner.studyHome.sectionMomentumTitle")}
        intro={t("learner.studyHome.sectionMomentumIntro")}
        tone="success"
        className="nn-dash-band nn-dash-band--momentum"
      >
        <div className="nn-dash-momentum-grid">
          <div className="nn-dash-momentum-grid__main">
            <RecentGainsBlock trends={trends} strongTopics={strongHighlight} t={t} />
            {showAdaptivePlan && studySnap ? <LearnerAdaptiveFocusCard snapshot={studySnap} /> : null}
          </div>
          <div className="nn-dash-momentum-grid__aside">
            {showCoach && coachSummary ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                <CoachPriorityList priorities={coachSummary.priorities} />
                <CoachPatternInsights patterns={coachSummary.patterns} />
              </div>
            ) : null}
            {showCoach ? (
              <DashboardCoachCard weakTopics={weakTopicTitles} examTarget={undefined} daysUntilExam={daysLeft} />
            ) : null}
          </div>
        </div>
      </LearnerStudySurfaceSection>

      {/* Explore kit */}
      <LearnerStudySurfaceSection
        id="study-explore"
        eyebrow={t("learner.studyHome.sectionExploreEyebrow")}
        title={t("learner.studyHome.sectionExploreTitle")}
        intro={t("learner.studyHome.sectionExploreIntro")}
        tone="primary"
        className="nn-dash-band nn-dash-band--explore"
      >
        <div className="nn-dash-explore-grid">
          <div className="nn-dash-explore-grid__primary">
            <LearnerContinueLearningCard t={t} links={continueLinks} />
          </div>
          <div className="nn-dash-explore-grid__secondary">
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
          </div>
        </div>
        <div className="nn-dash-explore-stack">
          <SmartActionsBar showAdaptiveAction={showAdaptivePlan} showWeaknessAction={showWeaknessAlerts} />
          <LearnerDashboardAdvantageStrip t={t} />
          <LearnerSurface tone="secondary" padding="md" radius="lg" shadow={false} className="nn-dash-account-cta">
            <p className="text-sm text-muted-foreground">{t("learner.dashboard.accountTeaser")}</p>
            <Link
              href="/app/account/overview"
              className="inline-flex w-full shrink-0 justify-center rounded-full border border-role-cta/30 bg-role-cta-soft px-4 py-2.5 text-sm font-semibold text-role-cta-on-soft sm:w-auto"
            >
              {t("learner.dashboard.openAccountHub")}
            </Link>
          </LearnerSurface>
        </div>
      </LearnerStudySurfaceSection>
    </main>
  );
}
