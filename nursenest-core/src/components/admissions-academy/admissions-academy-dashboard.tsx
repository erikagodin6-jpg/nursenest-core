import Link from "next/link";
import { BookOpen, CalendarDays, ClipboardCheck, Flame, Sparkles, Target, TrendingUp } from "lucide-react";
import type { AdmissionsDashboardModel, AdmissionsDashboardCardTone } from "@/lib/admissions-academy/admissions-dashboard-model";

function toneClassName(tone: AdmissionsDashboardCardTone): string {
  switch (tone) {
    case "brand":
      return "border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_7%,var(--semantic-surface))]";
    case "info":
      return "border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--semantic-surface))]";
    case "positive":
      return "border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_14%,var(--semantic-surface))]";
    case "warning":
      return "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_16%,var(--semantic-surface))]";
    case "neutral":
    default:
      return "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]";
  }
}

function ReadinessBar({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-[var(--theme-heading-text)]">{label}</span>
        <span className="tabular-nums text-[var(--theme-muted-text)]">{pct}%</span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--semantic-border-soft)_60%,transparent)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div
          className="h-full rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_72%,var(--semantic-success))] transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function AdmissionsAcademyDashboard({ model }: { model: AdmissionsDashboardModel }) {
  return (
    <div className="space-y-6" data-nn-qa-admissions-academy-dashboard={model.programId}>
      <section className="relative overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface)),var(--semantic-surface))] p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_18%,transparent)] blur-3xl" aria-hidden />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-surface)_80%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Admissions academy
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-3xl">
              {model.hero.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--theme-body-text)] sm:text-base">
              {model.hero.subtitle}
            </p>
          </div>

          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--semantic-surface))] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-[var(--theme-heading-text)]">Readiness estimate</span>
              <Target className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
            </div>
            <div className="mt-3 text-4xl font-semibold tabular-nums text-[var(--theme-heading-text)]">
              {model.hero.readinessEstimate}%
            </div>
            <p className="mt-2 text-xs leading-5 text-[var(--theme-muted-text)]">
              {model.hero.weeklyGoalHours}h weekly goal · {model.hero.studyStreakDays}-day study streak
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Admissions academy next actions">
        {model.cards.map((card) => (
          <article key={card.id} className={`rounded-2xl border p-5 shadow-sm ${toneClassName(card.tone)}`}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{card.title}</h2>
              {card.id === "continue-learning" ? <BookOpen className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden /> : null}
              {card.id === "timed-diagnostics" ? <ClipboardCheck className="h-4 w-4 text-[var(--semantic-info)]" aria-hidden /> : null}
              {card.id === "remediation-focus" ? <TrendingUp className="h-4 w-4 text-[var(--semantic-warning)]" aria-hidden /> : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--theme-body-text)]">{card.body}</p>
            {card.href && card.ctaLabel ? (
              <Link
                href={card.href}
                className="mt-4 inline-flex rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-brand)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))]"
              >
                {card.ctaLabel}
              </Link>
            ) : null}
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Domain mastery</h2>
              <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
                Track completion, readiness, and weak-domain flags by admissions subject.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs text-[var(--theme-muted-text)]">
              <Flame className="h-3.5 w-3.5 text-[var(--semantic-warning)]" aria-hidden />
              Adaptive focus
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {model.domains.map((domain) => (
              <article
                key={domain.id}
                className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_34%,var(--semantic-surface))] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{domain.label}</h3>
                    <p className="mt-1 text-xs text-[var(--theme-muted-text)]">{domain.lessonsAvailable} starter lesson{domain.lessonsAvailable === 1 ? "" : "s"}</p>
                  </div>
                  {domain.weakArea ? (
                    <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-warning)_16%,var(--semantic-surface))] px-2 py-1 text-[11px] font-semibold text-[var(--semantic-warning)]">
                      Focus
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 space-y-3">
                  <ReadinessBar value={domain.completionPercent} label="Completion" />
                  <ReadinessBar value={domain.readinessEstimate} label="Readiness" />
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_12%,var(--semantic-surface))] p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[var(--semantic-success)]" aria-hidden />
              <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">Today’s study plan</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-[var(--theme-body-text)]">
              <li>1 deep-teaching lesson</li>
              <li>10–15 flashcards from weak domains</li>
              <li>1 timed mini diagnostic</li>
              <li>Review rationales before advancing</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">Continue learning</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--theme-body-text)]">
              {model.continueLearningLessonIds.map((lessonId) => (
                <li key={lessonId} className="rounded-lg bg-[var(--semantic-panel-muted)] px-3 py-2 font-mono text-xs">
                  {lessonId}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </section>
    </div>
  );
}
