import { BarChart3, Flame, GraduationCap, Library } from "lucide-react";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { AnalyticsMetricTile } from "@/components/student/product/analytics-metric-tile";
import { MasteryLegend } from "@/components/student/product/mastery-legend";
import { ProductCard } from "@/components/student/product/product-card";

/**
 * Dense KPI row + mastery key — uses real snapshot fields only (no fabricated metrics).
 */
export function LearnerDashboardCommandCenter({
  snapshot,
  t,
}: {
  snapshot: PremiumDashboardSnapshot;
  t: LearnerMarketingT;
}) {
  const acc =
    snapshot.practice.accuracyPct != null
      ? `${snapshot.practice.accuracyPct}%`
      : t("learner.dashboard.commandCenter.na");

  const lessonLine =
    snapshot.overallLessons.total > 0
      ? `${snapshot.overallLessons.completed}/${snapshot.overallLessons.total}`
      : t("learner.dashboard.commandCenter.lessonsPending");

  return (
    <section aria-label={t("learner.dashboard.commandCenter.regionAria")}>
      <ProductCard accent paddingClass="p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-chart-3)]">
              {t("learner.dashboard.commandCenter.kicker")}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">{t("learner.dashboard.commandCenter.title")}</h2>
            <p className="mt-1 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">{t("learner.dashboard.commandCenter.subtitle")}</p>
          </div>
          <MasteryLegend t={t} className="sm:pt-1" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AnalyticsMetricTile
            icon={Flame}
            accent="c4"
            label={t("learner.dashboard.commandCenter.streak")}
            value={snapshot.studyStreakDays}
            hint={t("learner.dashboard.commandCenter.streakHint")}
          />
          <AnalyticsMetricTile
            icon={BarChart3}
            accent="c3"
            label={t("learner.dashboard.commandCenter.bankAccuracy")}
            value={acc}
            hint={
              snapshot.practice.gradedTotal > 0
                ? t("learner.dashboard.commandCenter.bankHintGraded", {
                    correct: snapshot.practice.gradedCorrect,
                    total: snapshot.practice.gradedTotal,
                  })
                : t("learner.dashboard.commandCenter.bankHintEmpty")
            }
          />
          <AnalyticsMetricTile
            icon={Library}
            accent="c2"
            label={t("learner.dashboard.commandCenter.lessons")}
            value={lessonLine}
            hint={t("learner.dashboard.commandCenter.lessonsHint")}
          />
          <AnalyticsMetricTile
            icon={GraduationCap}
            accent="c1"
            label={t("learner.dashboard.commandCenter.mocks")}
            value={snapshot.mockCount}
            hint={t("learner.dashboard.commandCenter.mocksHint")}
          />
        </div>
      </ProductCard>
    </section>
  );
}
