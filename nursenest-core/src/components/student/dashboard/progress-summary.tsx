import { Flame, Library } from "lucide-react";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

/**
 * Lessons + bank + streak — info/success/brand accents (progress narrative).
 */
export function ProgressSummary({ snapshot, t }: { snapshot: PremiumDashboardSnapshot; t: LearnerMarketingT }) {
  const { overallLessons, practice, studyStreakDays, mockCount } = snapshot;
  const lessonPct = overallLessons.total > 0 ? overallLessons.pct : 0;
  const bankPct = practice.accuracyPct ?? 0;
  const hasBank = practice.gradedTotal > 0;

  return (
    <section className="nn-card nn-student-card-lift border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
      <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">{t("learner.dashboard.progressSummary.title")}</h3>
      <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{t("learner.dashboard.progressSummary.subtitle")}</p>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="inline-flex items-center gap-2 font-medium text-[var(--semantic-text-primary)]">
              <Library className="h-4 w-4 text-[var(--semantic-info)]" aria-hidden />
              {t("learner.dashboard.progressSummary.lessons")}
            </span>
            <span className="tabular-nums text-xs text-[var(--semantic-text-secondary)]">
              {overallLessons.total > 0 ? `${overallLessons.completed}/${overallLessons.total}` : "—"}
            </span>
          </div>
          <div className="nn-progress-track-semantic nn-progress-track-semantic--md mt-2">
            <div
              className="h-full rounded-full nn-progress-fill-semantic-info nn-progress-fill-reveal transition-[width] duration-500"
              style={{ width: `${lessonPct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium text-[var(--semantic-text-primary)]">{t("learner.dashboard.progressSummary.bank")}</span>
            <span className="tabular-nums text-xs text-[var(--semantic-text-secondary)]">
              {hasBank ? `${practice.gradedCorrect}/${practice.gradedTotal}` : "—"}
            </span>
          </div>
          <div className="nn-progress-track-semantic nn-progress-track-semantic--md mt-2">
            <div
              className={`h-full rounded-full nn-progress-fill-reveal transition-[width] duration-500 ${hasBank ? "nn-progress-fill-semantic-success" : "nn-progress-fill-semantic-muted"}`}
              style={{ width: `${hasBank ? bankPct : 0}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-brand)]">
            <Flame className="h-3.5 w-3.5" aria-hidden />
            {studyStreakDays > 0
              ? t("learner.dashboard.progressSummary.streakLine", { n: studyStreakDays })
              : t("learner.dashboard.progressSummary.streakZero")}
          </span>
          <span className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-1)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_08%,var(--semantic-surface))] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-chart-1)]">
            {t("learner.dashboard.progressSummary.mocksLine", { n: mockCount })}
          </span>
        </div>
      </div>
    </section>
  );
}
