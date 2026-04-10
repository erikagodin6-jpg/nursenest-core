import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
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
 * Dashboard analytics region — prioritised layout:
 *   1. Quick actions (resume + CAT + weak topics) — always visible immediately
 *   2. Readiness KPI ring + metric grid (progress + recent performance)
 *   3. Category breakdown + weak areas
 *   4. Exam history (lowest priority, furthest scroll)
 */
export function LearnerDashboardAnalytics({
  snapshot,
  t,
}: {
  snapshot: PremiumDashboardSnapshot;
  t: LearnerMarketingT;
}) {
  const byTopic = snapshot.insights?.performance.byTopic.slice(0, MAX_TOPIC) ?? [];
  const topicTrends = snapshot.insights?.topicTrends ?? [];
  const weakAreas = snapshot.insights?.weakAreas.slice(0, MAX_WEAK) ?? [];
  const continueLesson = snapshot.continueLesson;
  const preferredPathwayId = snapshot.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ?? snapshot.pathways[0]?.pathwayId ?? null;
  const catStartHref = preferredPathwayId ? appPathwayCatSessionStartPath(preferredPathwayId) : "/app/practice-tests/start";
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
      {/* ── 1. Quick actions — primary call to action, always above fold ── */}
      <QuickActionPanel
        t={t}
        id="dashboard-quick-actions"
        guided={{
          continueLesson,
          hasWeakAreas: weakAreas.length > 0,
          catStartHref,
        }}
      />

      {/* ── 2. Readiness KPI + progress metrics grid ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <ReadinessScoreCard readiness={snapshot.readiness} t={t} />
        <div className="flex flex-col gap-4">
          <ProgressSummary snapshot={snapshot} t={t} />
          <RecentPerformance
            t={t}
            trendSummary={trend}
            practiceAccuracyPct={snapshot.practice.accuracyPct}
            practiceGradedLine={practiceLine}
            recentMocks={snapshot.recentMocks}
          />
        </div>
      </div>

      {/* ── 3. Topic breakdown + weak areas (with mastery key inline) ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <CategoryBreakdown rows={byTopic} t={t} maxRows={MAX_TOPIC} topicTrends={topicTrends} />
        <div className="space-y-4">
          <DashboardWeakAreasCard weakAreas={weakAreas} t={t} maxRows={MAX_WEAK} />
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">{t("learner.dashboard.masteryKey.title")}</p>
            <MasteryLegend t={t} className="mt-2" />
          </div>
        </div>
      </div>

      {/* ── 4. Exam history ── */}
      <ExamHistory mocks={snapshot.recentMocks} t={t} />
    </div>
  );
}
