import { catPathwayExamCodeLabel, catPathwayRegionalExamLine } from "@/lib/exam-pathways/cat-pathway-labels";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { resolvePreferredCatPathwayId } from "@/lib/exam-pathways/pathway-cat-flow";
import { resolveStudyLoopCatDestination } from "@/lib/exam-pathways/study-loop-cat-routing";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { MasteryLegend } from "@/components/student/product/mastery-legend";
import { ReadinessScoreCard } from "@/components/student/dashboard/readiness-score-card";
import { ReadinessViewTracker } from "@/components/student/dashboard/readiness-view-tracker";
import { QuickActionPanel } from "@/components/student/dashboard/quick-action-panel";
import { ProgressSummary } from "@/components/student/dashboard/progress-summary";
import { RecentPerformance } from "@/components/student/dashboard/recent-performance";
import { CategoryBreakdown } from "@/components/student/dashboard/category-breakdown";
import { DashboardWeakAreasCard } from "@/components/student/dashboard/dashboard-weak-areas";
import { ExamHistory } from "@/components/student/dashboard/exam-history";

const MAX_TOPIC = 8;
const MAX_WEAK = 6;

function catQuickFromSnapshot(snapshot: PremiumDashboardSnapshot): {
  catStartHref: string;
  catDestinationKind: "app_start" | "generic_chooser";
  catPathwayLabel: string | null;
  catPathwayLine: string | null;
} {
  const ids = snapshot.pathways.map((p) => p.pathwayId);
  const preferred = resolvePreferredCatPathwayId(snapshot.learnerPath, ids);
  const destination = resolveStudyLoopCatDestination({
    authState: "signed_in",
    pathwayId: snapshot.learnerPath,
    availablePathwayIds: ids,
    intent: "start",
  });
  if (!preferred) {
    return {
      catStartHref: destination.href,
      catDestinationKind: destination.kind === "app_start" ? "app_start" : "generic_chooser",
      catPathwayLabel: null,
      catPathwayLine: null,
    };
  }
  const pw = getExamPathwayById(preferred);
  if (!pw) {
    return {
      catStartHref: destination.href,
      catDestinationKind: destination.kind === "app_start" ? "app_start" : "generic_chooser",
      catPathwayLabel: null,
      catPathwayLine: null,
    };
  }
  return {
    catStartHref: destination.href,
    catDestinationKind: destination.kind === "app_start" ? "app_start" : "generic_chooser",
    catPathwayLabel: catPathwayExamCodeLabel(pw),
    catPathwayLine: catPathwayRegionalExamLine(pw),
  };
}

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
  const trend = snapshot.insights?.performance.trendSummary?.trim();
  const hasRecentCompletion = snapshot.recentMocks.some((m) => Date.now() - new Date(m.at).getTime() <= 72 * 60 * 60 * 1000);
  const practiceLine =
    snapshot.practice.gradedTotal > 0
      ? t("learner.dashboard.recentPerformance.gradedLine", {
          correct: snapshot.practice.gradedCorrect,
          total: snapshot.practice.gradedTotal,
          sessions: snapshot.practice.sessionCount,
        })
      : "";

  const catQuick = catQuickFromSnapshot(snapshot);

  return (
    <div className="space-y-6" aria-label={t("learner.dashboard.insight.regionLabel")}>
      {/* ── 1. Quick actions — primary call to action, always above fold ── */}
      <QuickActionPanel
        t={t}
        id="dashboard-quick-actions"
        guided={{
          continueLesson,
          hasWeakAreas: weakAreas.length > 0,
          hasRecentCompletion,
          catStartHref: catQuick.catStartHref,
          catDestinationKind: catQuick.catDestinationKind,
          catPathwayLabel: catQuick.catPathwayLabel,
          catPathwayLine: catQuick.catPathwayLine,
        }}
      />

      {/* ── 2. Readiness KPI + progress metrics grid ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <ReadinessViewTracker score={snapshot.readiness.score} band={snapshot.readiness.band} trend={snapshot.readiness.trend}>
          <ReadinessScoreCard readiness={snapshot.readiness} t={t} />
        </ReadinessViewTracker>
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
          <DashboardWeakAreasCard
            weakAreas={weakAreas}
            t={t}
            maxRows={MAX_WEAK}
            pathwayId={resolvePreferredCatPathwayId(snapshot.learnerPath, snapshot.pathways.map((p) => p.pathwayId))}
          />
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
