import Link from "next/link";
import { Activity, ArrowRight, Brain, CheckCircle2, Clock3, Target, TrendingUp } from "lucide-react";
import type { PersonalizedCommandCenterPlan } from "@/lib/learner/personalized-command-center";
import { coerceSafeLearnerNavHref } from "@/lib/learner/safe-app-href";

function formatReadiness(score: number | null): string {
  return score == null ? "Calibrating" : `${score}%`;
}

function ActivityRow({ activity }: { activity: PersonalizedCommandCenterPlan["activities"][number] }) {
  return (
    <Link
      href={coerceSafeLearnerNavHref(activity.href)}
      className="group flex min-w-0 items-start gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3.5 py-3 transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_38%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_04%,var(--semantic-surface))]"
    >
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-success)]">
        <CheckCircle2 className="h-4 w-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-sm font-bold text-[var(--semantic-text-primary)]">{activity.title}</span>
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {activity.minutes} min
          </span>
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
          {activity.detail} · {activity.reason}
        </span>
      </span>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--semantic-brand)]" aria-hidden />
    </Link>
  );
}

function TopicList({ title, items, tone }: { title: string; items: string[]; tone: "strength" | "weak" }) {
  const color = tone === "strength" ? "var(--semantic-success)" : "var(--semantic-warning)";
  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{title}</p>
      {items.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.slice(0, 4).map((item) => (
            <span
              key={item}
              className="rounded-full border px-2.5 py-1 text-xs font-semibold"
              style={{
                borderColor: `color-mix(in srgb, ${color} 28%, var(--semantic-border-soft))`,
                background: `color-mix(in srgb, ${color} 8%, var(--semantic-surface))`,
                color,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">More signals will appear after your next scored session.</p>
      )}
    </div>
  );
}

export function PersonalizedLearningCommandCenter({ plan }: { plan: PersonalizedCommandCenterPlan }) {
  return (
    <section
      id="personalized-command-center"
      className="nn-dash-band nn-dash-band--priority nn-dash-band--stack-tight"
      aria-labelledby="personalized-command-center-title"
      data-testid="personalized-learning-command-center"
    >
      <div className="overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)]">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
                  Personalized command center
                </p>
                <h2 id="personalized-command-center-title" className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">
                  Today's Plan
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                  {plan.explanation} NurseNest has sequenced your next study block so you can start without deciding what to study.
                </p>
              </div>
              <Link
                href={coerceSafeLearnerNavHref(plan.startHref)}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-role-cta px-5 text-sm font-bold text-role-cta-foreground shadow-[0_10px_24px_var(--role-cta-shadow)]"
              >
                {plan.startLabel}
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_04%,var(--semantic-surface))] p-4">
                <div className="flex items-center gap-2 text-[var(--semantic-brand)]">
                  <Clock3 className="h-4 w-4" aria-hidden />
                  <p className="text-[11px] font-bold uppercase tracking-wide">Estimated time</p>
                </div>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-[var(--semantic-text-primary)]">{plan.estimatedMinutes} min</p>
              </div>
              <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
                <div className="flex items-center gap-2 text-[var(--semantic-info)]">
                  <Activity className="h-4 w-4" aria-hidden />
                  <p className="text-[11px] font-bold uppercase tracking-wide">Current readiness</p>
                </div>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-[var(--semantic-text-primary)]">{formatReadiness(plan.currentReadiness)}</p>
              </div>
              <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-success)_06%,var(--semantic-surface))] p-4">
                <div className="flex items-center gap-2 text-[var(--semantic-success)]">
                  <TrendingUp className="h-4 w-4" aria-hidden />
                  <p className="text-[11px] font-bold uppercase tracking-wide">Predicted readiness</p>
                </div>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-[var(--semantic-text-primary)]">{formatReadiness(plan.predictedReadiness)}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {plan.activities.map((activity) => (
                <ActivityRow key={`${activity.kind}:${activity.href}`} activity={activity} />
              ))}
            </div>
          </div>

          <aside className="border-t border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_03%,var(--semantic-surface))] p-5 sm:p-6 lg:border-l lg:border-t-0 lg:p-7">
            <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)]">
                  <Brain className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold text-[var(--semantic-text-primary)]">Focus area</p>
                  <p className="mt-1 text-lg font-extrabold text-[var(--semantic-text-primary)]">{plan.focusTopic}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                    Your plan blends learn, practice, recall, and assessment steps from the same performance signals.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              <TopicList title="Strength areas" items={plan.strengthAreas} tone="strength" />
              <TopicList title="Weak areas" items={plan.weakAreas} tone="weak" />
            </div>

            <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              <div className="flex items-start gap-2">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
                <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                  Start My Session opens the first recommended activity. Finish it, then continue the list in order for a complete adaptive block.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

