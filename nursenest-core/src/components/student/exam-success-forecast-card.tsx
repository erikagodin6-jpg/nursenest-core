import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Target, TrendingUp } from "lucide-react";
import type { ExamSuccessForecast } from "@/lib/learner/exam-success-forecast";
import { coerceSafeLearnerNavHref } from "@/lib/learner/safe-app-href";

function trendLabel(trend: ExamSuccessForecast["trend"]): string {
  switch (trend) {
    case "improving":
      return "Improving";
    case "declining":
      return "Needs attention";
    case "stable":
      return "Stable";
    default:
      return "Calibrating";
  }
}

function probabilityText(forecast: ExamSuccessForecast): string {
  if (!forecast.allowsPassProbability) return "Competency forecast";
  return forecast.passProbability == null ? "Calibrating" : `${forecast.passProbability}%`;
}

function intervalText(forecast: ExamSuccessForecast): string {
  if (!forecast.allowsPassProbability) return "Pass probability hidden for this testing model";
  if (!forecast.confidenceInterval) return "Complete more scored study to narrow the range";
  return `${forecast.confidenceInterval.low}-${forecast.confidenceInterval.high}% confidence interval`;
}

export function ExamSuccessForecastCard({ forecast }: { forecast: ExamSuccessForecast }) {
  return (
    <section
      className="rounded-3xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
      aria-labelledby="exam-success-forecast-title"
      data-testid="exam-success-forecast-card"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--semantic-info)]">
            Exam success forecast
          </p>
          <h2 id="exam-success-forecast-title" className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--semantic-text-primary)]">
            Know where you are headed
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {forecast.summary}
          </p>
        </div>
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] px-5 py-4 text-right">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Current pass probability
          </p>
          <p className="mt-1 text-4xl font-extrabold tabular-nums text-[var(--semantic-text-primary)]">
            {probabilityText(forecast)}
          </p>
          <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{intervalText(forecast)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Metric
          icon={CalendarDays}
          label="Projected exam readiness"
          value={forecast.projectedReadinessDate ?? "Calibrating"}
          hint="Estimated date for stable exam-ready performance"
        />
        <Metric
          icon={Clock3}
          label="Study hours remaining"
          value={forecast.estimatedStudyHoursRemaining == null ? "Calibrating" : `${forecast.estimatedStudyHoursRemaining}h`}
          hint="Based on current pace and readiness gap"
        />
        <Metric
          icon={TrendingUp}
          label="Weekly improvement"
          value={forecast.weeklyImprovement == null ? "Calibrating" : `+${forecast.weeklyImprovement}%`}
          hint={`${trendLabel(forecast.trend)} trend · ${forecast.confidenceLabel} confidence`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.45fr)]">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_03%,var(--semantic-surface))] p-4">
          <p className="text-sm font-bold text-[var(--semantic-text-primary)]">Recommended next actions</p>
          <div className="mt-3 space-y-2">
            {forecast.recommendedNextActions.map((action) => (
              <Link
                key={`${action.href}:${action.label}`}
                href={coerceSafeLearnerNavHref(action.href)}
                className="group flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2.5 text-sm transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_36%,var(--semantic-border-soft))]"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-[var(--semantic-text-primary)]">{action.label}</span>
                  <span className="text-xs text-[var(--semantic-text-muted)]">{action.minutes} minutes</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--semantic-brand)]" aria-hidden />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] text-[var(--semantic-warning)]">
              <Target className="h-4 w-4" aria-hidden />
            </span>
            <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              {forecast.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
      <div className="flex items-center gap-2 text-[var(--semantic-brand)]">
        <Icon className="h-4 w-4" aria-hidden />
        <p className="text-[11px] font-bold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-extrabold tabular-nums text-[var(--semantic-text-primary)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{hint}</p>
    </div>
  );
}

