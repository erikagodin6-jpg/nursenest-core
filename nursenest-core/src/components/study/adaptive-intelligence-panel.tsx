import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Brain,
  Flame,
  LineChart,
  Radar,
  Route,
  ShieldCheck,
} from "lucide-react";
import type { AdaptiveIntelligenceProfile } from "@/lib/learner/adaptive-intelligence-profile";

function scoreLabel(score: number | null): string {
  return score == null ? "Building" : `${score}/100`;
}

function riskTone(risk: "low" | "medium" | "high"): string {
  if (risk === "high") return "var(--semantic-warning)";
  if (risk === "medium") return "var(--semantic-info)";
  return "var(--semantic-success)";
}

export function AdaptiveIntelligencePanel({
  profile,
}: {
  profile: AdaptiveIntelligenceProfile;
}) {
  const topCompetencies = profile.competencies
    .filter((item) => item.score != null)
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
    .slice(0, 6);
  const topSystems = profile.systems
    .filter((item) => item.score != null || item.retentionRisk !== "low")
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
    .slice(0, 6);
  const prescribed = [
    ...profile.prescriptions.criticalWeakAreas,
    ...profile.prescriptions.today,
    ...profile.prescriptions.thisWeek,
  ]
    .filter(
      (item, index, arr) =>
        arr.findIndex((candidate) => candidate.id === item.id) === index,
    )
    .slice(0, 5);

  return (
    <section
      aria-labelledby="adaptive-intelligence-heading"
      className="overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)]"
    >
      <div className="border-b border-[var(--semantic-border-soft)] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
              <Brain className="h-4 w-4" aria-hidden />
              Adaptive intelligence
            </p>
            <h2
              id="adaptive-intelligence-heading"
              className="mt-2 text-xl font-bold text-[var(--semantic-text-primary)]"
            >
              What NurseNest thinks you should study next
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">
              This hidden analytics layer blends readiness, questions, lessons,
              flashcards, CAT, skills, pharmacology, ECG, and topic signals. It
              stays out of study mode so practice remains focused.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:min-w-[28rem]">
            <Metric
              label="Readiness"
              value={scoreLabel(profile.readiness.examReadinessScore)}
              icon={Radar}
            />
            <Metric
              label="Probability"
              value={profile.readiness.passingProbability}
              icon={ShieldCheck}
            />
            <Metric
              label="Stability"
              value={scoreLabel(profile.readiness.confidenceStability)}
              icon={LineChart}
            />
            <Metric
              label="Momentum"
              value={scoreLabel(profile.readiness.momentumScore)}
              icon={Flame}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {topCompetencies.map((item) => (
              <CompetencyCard key={item.id} item={item} />
            ))}
          </div>

          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-alt)] p-4">
            <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">
              System map
            </h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {topSystems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[var(--semantic-surface)] px-3 py-2"
                >
                  <span className="text-sm font-medium text-[var(--semantic-text-primary)]">
                    {item.label}
                  </span>
                  <span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: riskTone(item.retentionRisk) }}
                  >
                    {scoreLabel(item.score)}
                  </span>
                </div>
              ))}
              {topSystems.length === 0 ? (
                <p className="text-sm text-[var(--semantic-text-secondary)]">
                  More system-level practice will unlock the competency map.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-alt)] p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--semantic-text-primary)]">
              <Route
                className="h-4 w-4 text-[var(--semantic-brand)]"
                aria-hidden
              />
              Prescribed next steps
            </h3>
            <div className="mt-4 space-y-3">
              {prescribed.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group block rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 transition hover:border-[var(--semantic-brand)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[var(--semantic-text-primary)]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--semantic-text-secondary)]">
                        {item.reason}
                      </p>
                    </div>
                    <ArrowRight
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-brand)] transition group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-3 text-xs font-medium text-[var(--semantic-text-muted)]">
                    {item.expectedImpact}
                  </p>
                </Link>
              ))}
              {prescribed.length === 0 ? (
                <p className="text-sm text-[var(--semantic-text-secondary)]">
                  Keep studying. Prescriptions appear once enough signals exist
                  to justify a specific route.
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-alt)] p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--semantic-text-primary)]">
              <Activity
                className="h-4 w-4 text-[var(--semantic-brand)]"
                aria-hidden
              />
              Signal coverage
            </h3>
            <div className="mt-3 space-y-2">
              {profile.signalCoverage.map((signal) => (
                <div
                  key={signal.surface}
                  className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                      {signal.label}
                    </p>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]"
                      style={{
                        background: signal.active
                          ? "color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface))"
                          : "color-mix(in srgb, var(--semantic-text-muted) 10%, var(--semantic-surface))",
                        color: signal.active
                          ? "var(--semantic-success)"
                          : "var(--semantic-text-muted)",
                      }}
                    >
                      {signal.active ? "Active" : "Waiting"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[var(--semantic-text-secondary)]">
                    {signal.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Brain;
}) {
  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-alt)] p-3">
      <Icon className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--semantic-text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold capitalize text-[var(--semantic-text-primary)]">
        {value}
      </p>
    </div>
  );
}

function CompetencyCard({
  item,
}: {
  item: AdaptiveIntelligenceProfile["competencies"][number];
}) {
  const pct = item.score ?? 0;
  return (
    <article className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-alt)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">
            {item.label}
          </h3>
          <p className="mt-1 text-xs capitalize text-[var(--semantic-text-muted)]">
            {item.direction} · {item.confidence} confidence
          </p>
        </div>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: riskTone(item.retentionRisk) }}
        >
          {scoreLabel(item.score)}
        </span>
      </div>
      {item.score != null ? (
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--semantic-border-soft)_70%,var(--semantic-surface))]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: riskTone(item.retentionRisk),
            }}
          />
        </div>
      ) : null}
      <p className="mt-3 text-xs leading-5 text-[var(--semantic-text-secondary)]">
        {item.evidence[0]}
      </p>
    </article>
  );
}
