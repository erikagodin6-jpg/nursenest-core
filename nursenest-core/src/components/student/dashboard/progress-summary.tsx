import { Flame, Library, CheckCircle2 } from "lucide-react";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

function BigPctRing({ pct, color, size = 64, stroke = 6 }: { pct: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, pct)) / 100) * circ;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--semantic-border-soft)" strokeWidth={stroke} opacity={0.4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold tabular-nums" style={{ color }}>{pct}%</span>
      </div>
    </div>
  );
}

/**
 * Lessons + question bank accuracy + streak — each metric shows a mini ring + bar for
 * dual-encoding clarity (number + shape + colour).
 */
export function ProgressSummary({ snapshot, t }: { snapshot: PremiumDashboardSnapshot; t: LearnerMarketingT }) {
  const { overallLessons, practice, studyStreakDays, mockCount } = snapshot;
  const lessonPct = overallLessons.total > 0 ? Math.round(overallLessons.pct) : 0;
  const bankPct = Math.round(practice.accuracyPct ?? 0);
  const hasBank = practice.gradedTotal > 0;

  return (
    <section className="nn-card nn-student-card-lift border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
      <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">{t("learner.dashboard.progressSummary.title")}</h3>
      <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{t("learner.dashboard.progressSummary.subtitle")}</p>

      <div className="mt-5 space-y-5">
        {/* Lessons */}
        <div className="flex items-center gap-4">
          <BigPctRing pct={lessonPct} color="var(--semantic-info)" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--semantic-text-primary)]">
                <Library className="h-3.5 w-3.5 text-[var(--semantic-info)]" aria-hidden />
                {t("learner.dashboard.progressSummary.lessons")}
              </span>
              <span className="tabular-nums text-xs text-[var(--semantic-text-secondary)]">
                {overallLessons.total > 0 ? `${overallLessons.completed} / ${overallLessons.total}` : "—"}
              </span>
            </div>
            <div
              className="nn-progress-track-semantic nn-progress-track-semantic--md mt-2"
              role="progressbar"
              aria-valuenow={lessonPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t("learner.dashboard.progressSummary.lessons")}
            >
              <div
                className="h-full rounded-full nn-progress-fill-semantic-info nn-progress-fill-reveal transition-[width] duration-500"
                style={{ width: `${lessonPct}%` }}
              />
            </div>
            {overallLessons.total === 0 ? (
              <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">Start a lesson to track progress</p>
            ) : null}
          </div>
        </div>

        {/* Question bank accuracy */}
        <div className="flex items-center gap-4">
          <BigPctRing pct={hasBank ? bankPct : 0} color={hasBank ? "var(--semantic-success)" : "var(--semantic-border-soft)"} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-[var(--semantic-text-primary)]">{t("learner.dashboard.progressSummary.bank")}</span>
              <span className="tabular-nums text-xs text-[var(--semantic-text-secondary)]">
                {hasBank ? `${practice.gradedCorrect} / ${practice.gradedTotal}` : "—"}
              </span>
            </div>
            <div
              className="nn-progress-track-semantic nn-progress-track-semantic--md mt-2"
              role="progressbar"
              aria-valuenow={hasBank ? bankPct : 0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t("learner.dashboard.progressSummary.bank")}
            >
              <div
                className={`h-full rounded-full nn-progress-fill-reveal transition-[width] duration-500 ${hasBank ? "nn-progress-fill-semantic-success" : "nn-progress-fill-semantic-muted"}`}
                style={{ width: `${hasBank ? bankPct : 0}%` }}
              />
            </div>
            {!hasBank ? (
              <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">Answer questions to see accuracy here</p>
            ) : null}
          </div>
        </div>

        {/* Stats chips: streak + mocks */}
        <div className="flex flex-wrap gap-3 border-t border-[var(--semantic-border-soft)] pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-brand)]">
            <Flame className="h-3.5 w-3.5" aria-hidden />
            {studyStreakDays > 0
              ? t("learner.dashboard.progressSummary.streakLine", { n: studyStreakDays })
              : t("learner.dashboard.progressSummary.streakZero")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-1)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_08%,var(--semantic-surface))] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-chart-1)]">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            {t("learner.dashboard.progressSummary.mocksLine", { n: mockCount })}
          </span>
        </div>
      </div>
    </section>
  );
}
