import Link from "next/link";
import { GraduationCap } from "lucide-react";
import type { RecentMock } from "@/lib/learner/load-learner-dashboard";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

export function ExamHistory({ mocks, t, maxRows = 6 }: { mocks: RecentMock[]; t: LearnerMarketingT; maxRows?: number }) {
  const rows = mocks.slice(0, maxRows);

  return (
    <section className="nn-card nn-student-card-lift border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_08%,var(--semantic-surface))]">
            <GraduationCap className="h-4 w-4 text-[var(--semantic-chart-1)]" aria-hidden strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">{t("learner.dashboard.examHistory.title")}</h3>
            <p className="text-xs text-[var(--semantic-text-secondary)]">{t("learner.dashboard.examHistory.subtitle")}</p>
          </div>
        </div>
        <Link href="/app/exams" className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline">
          {t("learner.dashboard.insight.openMocksCta")}
        </Link>
      </div>

      {rows.length > 0 ? (
        <ul className="mt-4 divide-y divide-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)]">
          {rows.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm first:pt-0">
              <div className="min-w-0">
                <p className="font-medium text-[var(--semantic-text-primary)]">{m.examTitle}</p>
                <p className="text-xs text-[var(--semantic-text-muted)]">
                  {new Date(m.at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ${
                    m.pct >= 75
                      ? "border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] text-[var(--semantic-success-contrast)]"
                      : m.pct >= 60
                        ? "nn-badge-semantic-warning"
                        : "border border-[color-mix(in_srgb,var(--semantic-danger)_32%,var(--semantic-border-soft))] bg-[var(--semantic-danger-soft)] text-[var(--semantic-danger-contrast)]"
                  }`}
                >
                  {m.pct}%
                </span>
                <span className="tabular-nums text-[var(--semantic-text-secondary)]">
                  {m.score}/{m.total}
                </span>
                <Link href={`/app/exams/attempts/${m.id}`} className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline">
                  {t("learner.dashboard.insight.viewReport")}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-6 text-sm text-[var(--semantic-text-secondary)]">
          <p>{t("learner.dashboard.insight.recentEmpty")}</p>
          <Link href="/app/exams" className="nn-dashboard-empty-cta">
            {t("learner.dashboard.insight.openMocksCta")}
          </Link>
        </div>
      )}
    </section>
  );
}
