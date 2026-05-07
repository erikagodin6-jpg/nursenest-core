import Link from "next/link";
import type { LearnerReportCardViewModel } from "@/lib/learner/learner-report-card-model";

export function LearnerReportCard({ model }: { model: LearnerReportCardViewModel }) {
  return (
    <section
      className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)]"
      aria-labelledby="learner-report-card-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 id="learner-report-card-heading" className="text-base font-bold tracking-tight text-[var(--semantic-text-primary)]">
            Report card
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{model.readinessLabel}</p>
        </div>
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,var(--semantic-surface))] px-3 py-2 text-right shadow-[inset_0_1px_0_color-mix(in_srgb,var(--semantic-text-primary)_05%,transparent)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Lessons</p>
          <p className="text-lg font-bold text-[var(--semantic-text-primary)]">
            {model.lessonsCompleted}/{model.lessonsTotal}
          </p>
        </div>
      </div>

      {model.recentSummary ? (
        <p className="mt-3 text-xs text-[var(--semantic-text-secondary)]">
          <span className="font-semibold text-[var(--semantic-text-primary)]">Recent activity:</span> {model.recentSummary}
        </p>
      ) : null}

      <div className="mt-5 grid gap-5 min-[720px]:grid-cols-2 min-[720px]:gap-6">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-chart-4)]">Weak topics</p>
          <ul className="mt-2 space-y-2 text-sm text-[var(--semantic-text-secondary)]">
            {model.weakTopics.length === 0 ? (
              <li className="list-none">
                <span className="block rounded-lg border border-[color-mix(in_srgb,var(--semantic-chart-4)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_55%,var(--semantic-surface))] px-3 py-2 text-sm leading-snug text-[var(--semantic-text-secondary)]">
                  No weak topics flagged yet — keep practicing.
                </span>
              </li>
            ) : null}
            {model.weakTopics.map((t) => (
              <li key={t} className="leading-snug">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-chart-3)]">Strongest topics</p>
          <ul className="mt-2 space-y-2 text-sm text-[var(--semantic-text-secondary)]">
            {model.strongTopics.length === 0 ? (
              <li className="list-none">
                <span className="block rounded-lg border border-[color-mix(in_srgb,var(--semantic-chart-3)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_45%,var(--semantic-surface))] px-3 py-2 text-sm leading-snug text-[var(--semantic-text-secondary)]">
                  Strong topics appear as you log more attempts.
                </span>
              </li>
            ) : null}
            {model.strongTopics.map((t) => (
              <li key={t} className="leading-snug">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] pt-5">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Recommended next</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          {model.recommendedActions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {model.continueCta ? (
          <Link
            href={model.continueCta.href}
            className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-sm transition-[filter,transform] motion-safe:duration-200 hover:brightness-[1.03] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_38%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--semantic-surface)]"
            style={{ background: "var(--role-cta)" }}
          >
            {model.continueCta.label}
          </Link>
        ) : null}
        {model.links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex min-h-11 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition-colors motion-safe:duration-200 hover:bg-[var(--semantic-panel-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_30%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--semantic-surface)]"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
