import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { MasteryLegend } from "@/components/student/product/mastery-legend";
import { ReadinessScoreCard } from "@/components/student/dashboard/readiness-score-card";
import { QuickActionPanel } from "@/components/student/dashboard/quick-action-panel";
import { ProgressSummary } from "@/components/student/dashboard/progress-summary";
import { RecentPerformance } from "@/components/student/dashboard/recent-performance";
import { CategoryBreakdown } from "@/components/student/dashboard/category-breakdown";
import { DashboardWeakAreasCard } from "@/components/student/dashboard/dashboard-weak-areas";
import { ExamHistory } from "@/components/student/dashboard/exam-history";

const MAX_TOPIC = 8;
const MAX_WEAK = 6;

/**
 * Legacy-style dashboard analytics region: readiness KPI, actions, progress, categories, weak areas, trend, mocks.
 */
export function LearnerDashboardAnalytics({
  snapshot,
  t,
}: {
  snapshot: PremiumDashboardSnapshot;
  t: LearnerMarketingT;
}) {
  const byTopic = snapshot.insights?.performance.byTopic.slice(0, MAX_TOPIC) ?? [];
  const weakAreas = snapshot.insights?.weakAreas.slice(0, MAX_WEAK) ?? [];
  const continueLesson = snapshot.continueLesson;
  const trend = snapshot.insights?.performance.trendSummary?.trim();
  const practiceLine =
    snapshot.practice.gradedTotal > 0
      ? t("learner.dashboard.recentPerformance.gradedLine", {
          correct: snapshot.practice.gradedCorrect,
          total: snapshot.practice.gradedTotal,
          sessions: snapshot.practice.sessionCount,
        })
      : "";

  return (
    <div className="space-y-6" aria-label={t("learner.dashboard.insight.regionLabel")}>
      <ReadinessScoreCard readiness={snapshot.readiness} t={t} />

      <QuickActionPanel
        t={t}
        id="dashboard-quick-actions"
        guided={{
          continueLesson,
          hasWeakAreas: weakAreas.length > 0,
        }}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <ProgressSummary snapshot={snapshot} t={t} />
        <RecentPerformance
          t={t}
          trendSummary={trend}
          practiceAccuracyPct={snapshot.practice.accuracyPct}
          practiceGradedLine={practiceLine}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CategoryBreakdown rows={byTopic} t={t} maxRows={MAX_TOPIC} />
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">{t("learner.dashboard.masteryKey.title")}</p>
            <MasteryLegend t={t} className="mt-2" />
          </div>
          <DashboardWeakAreasCard weakAreas={weakAreas} t={t} maxRows={MAX_WEAK} />
        </div>
      </div>

      <ExamHistory mocks={snapshot.recentMocks} t={t} />
    </div>
  );
}
