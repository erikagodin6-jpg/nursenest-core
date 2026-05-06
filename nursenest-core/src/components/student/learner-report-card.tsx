import Link from "next/link";
import type { LearnerReportCardViewModel } from "@/lib/learner/learner-report-card-model";

export function LearnerReportCard({ model }: { model: LearnerReportCardViewModel }) {
  return (
    <section
      className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] p-5 shadow-sm"
      aria-labelledby="learner-report-card-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="learner-report-card-heading" className="text-base font-bold text-[var(--semantic-text-primary)]">
            Report card
          </h2>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{model.readinessLabel}</p>
        </div>
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-right">
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

      <div className="mt-4 grid gap-4 min-[720px]:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-chart-4)]">Weak topics</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--semantic-text-secondary)]">
            {model.weakTopics.length === 0 ? <li>None flagged yet — keep practicing.</li> : null}
            {model.weakTopics.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-chart-3)]">Strongest topics</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--semantic-text-secondary)]">
            {model.strongTopics.length === 0 ? <li>Your strengths will appear as you bank more attempts.</li> : null}
            {model.strongTopics.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Recommended next</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--semantic-text-secondary)]">
          {model.recommendedActions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {model.continueCta ? (
          <Link
            href={model.continueCta.href}
            className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-sm"
            style={{ background: "var(--role-cta)" }}
          >
            {model.continueCta.label}
          </Link>
        ) : null}
        {model.links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex min-h-11 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm hover:bg-[var(--semantic-panel-muted)]"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
