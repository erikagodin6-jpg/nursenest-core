import type { ReactNode } from "react";
import Link from "next/link";
import type { ProductIntelligenceData } from "@/lib/admin/load-admin-product-intelligence";

/** Renders `**bold**` segments without HTML injection. */
function EvidenceLine({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  if (parts.length === 1) return <span>{text}</span>;
  const nodes: ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) nodes.push(<strong key={i}>{parts[i]}</strong>);
    else if (parts[i]) nodes.push(<span key={i}>{parts[i]}</span>);
  }
  return <>{nodes}</>;
}

function InsightCard({ insight }: { insight: ProductIntelligenceData["insights"][number] }) {
  const border =
    insight.tone === "attention"
      ? "border-l-rose-500/70 bg-gradient-to-br from-rose-500/[0.07] to-transparent"
      : insight.tone === "healthy"
        ? "border-l-emerald-500/70 bg-gradient-to-br from-emerald-500/[0.07] to-transparent"
        : "border-l-sky-500/60 bg-gradient-to-br from-sky-500/[0.06] to-transparent";
  return (
    <article className={`rounded-2xl border border-border/60 border-l-4 p-5 shadow-sm ${border}`}>
      <h3 className="text-base font-semibold leading-snug text-[var(--theme-heading-text)]">{insight.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{insight.body}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-foreground/90">
        {insight.evidence.map((e, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" aria-hidden />
            <span className="[&_strong]:font-semibold">
              <EvidenceLine text={e} />
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-[var(--theme-heading-text)]">{value}</p>
      {hint ? <p className="mt-1 text-xs leading-snug text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-2 text-xs">
        <span className="truncate text-muted-foreground">{label}</span>
        <span className="shrink-0 tabular-nums font-medium text-foreground">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/70 to-sky-500/60"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function AdminProductIntelligenceView({ data }: { data: ProductIntelligenceData }) {
  const d = data.study;
  const lastDau = d?.engagement.dailyActiveUsers.length
    ? d.engagement.dailyActiveUsers[d.engagement.dailyActiveUsers.length - 1]?.users ?? 0
    : 0;
  const feedbackTotal = data.signals.feedbackBySurface.reduce((a, r) => a + r.total, 0);
  const catRate =
    d && d.cat.practiceTestsCatStarted > 0
      ? Math.round((d.cat.practiceTestsCatCompleted / d.cat.practiceTestsCatStarted) * 1000) / 10
      : null;

  return (
    <div className="space-y-10">
      <form method="get" className="flex flex-wrap items-end gap-4 rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
        <label className="text-xs font-semibold text-muted-foreground">
          From
          <input
            type="date"
            name="from"
            defaultValue={data.query.fromDay}
            className="mt-1 block min-h-[42px] rounded-xl border border-border bg-background px-3 text-sm"
          />
        </label>
        <label className="text-xs font-semibold text-muted-foreground">
          To
          <input
            type="date"
            name="to"
            defaultValue={data.query.toDay}
            className="mt-1 block min-h-[42px] rounded-xl border border-border bg-background px-3 text-sm"
          />
        </label>
        <button
          type="submit"
          className="min-h-[42px] rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm"
        >
          Apply window
        </button>
        <p className="text-xs text-muted-foreground">
          Window <span className="font-mono">{data.query.fromDay}</span> → <span className="font-mono">{data.query.toDay}</span>
        </p>
      </form>

      {data.warnings.length > 0 ? (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-50">
          <p className="font-semibold">Partial data</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {data.warnings.slice(0, 8).map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Executive insights */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">What the data is saying</h2>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Plain-language signals from Postgres (and PostHog where configured). Each card cites the evidence behind
              the claim — no vanity charts.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Generated {data.generatedAt.slice(0, 19)} UTC</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {data.insights.map((ins, i) => (
            <InsightCard key={i} insight={ins} />
          ))}
        </div>
      </section>

      {/* KPI strip */}
      {d ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi
            label="Learners active (last day in window)"
            value={lastDau.toLocaleString()}
            hint="Distinct users that day across lessons, practice tests, and exam sessions."
          />
          <Kpi
            label="Lesson never-engaged rate"
            value={d.engagement.lessonDropOffRatePct != null ? `${d.engagement.lessonDropOffRatePct}%` : "—"}
            hint="Share of progress rows in-window with no engage timestamp."
          />
          <Kpi
            label="CAT practice completion"
            value={catRate != null ? `${catRate}%` : "—"}
            hint="Completed ÷ started for CAT-style practice tests in-window."
          />
          <Kpi label="Feedback reports" value={feedbackTotal.toLocaleString()} hint="User-submitted reports in-window." />
        </section>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-2">
        {/* Usage */}
        <section className="rounded-2xl border border-border/70 bg-gradient-to-br from-card/95 via-card/70 to-muted/10 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Usage &amp; popularity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Most-touched lessons by progress rows; learner app sections from PostHog when available.
          </p>
          {d ? (
            <div className="mt-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Lessons (top by progress activity)</h3>
              <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                {d.lessons.topLessons.slice(0, 12).map((l) => {
                  const max = Math.max(1, ...d.lessons.topLessons.map((x) => x.progressRows));
                  return (
                    <BarRow
                      key={l.lessonKey}
                      label={`${l.title ?? l.lessonKey} · ${l.completionRatePct ?? "—"}% done`}
                      value={l.progressRows}
                      max={max}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Study aggregates unavailable.</p>
          )}
          <div className="mt-8 border-t border-border/50 pt-6">
            <h3 className="text-sm font-semibold text-foreground">Learner app sections (PostHog)</h3>
            {data.signals.appSectionViews && data.signals.appSectionViews.length > 0 ? (
              <div className="mt-3 max-h-[280px] space-y-2 overflow-y-auto">
                {(() => {
                  const max = Math.max(1, ...data.signals.appSectionViews.map((s) => s.views));
                  return data.signals.appSectionViews.map((s) => (
                    <BarRow key={s.section} label={s.section} value={s.views} max={max} />
                  ));
                })()}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                {data.signals.posthogAppSectionError
                  ? data.signals.posthogAppSectionError
                  : "Configure PostHog personal API + project id to rank `app_section_view`."}
              </p>
            )}
          </div>
        </section>

        {/* Funnels & drop-off */}
        <section className="rounded-2xl border border-border/70 bg-gradient-to-br from-card/95 via-card/70 to-primary/[0.04] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Funnels &amp; drop-off (database)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These are not marketing visit→signup funnels (see{" "}
            <Link className="font-semibold text-primary underline" href="/admin/analytics/funnels">
              Funnels
            </Link>
            ). They describe study-mode progression proxies.
          </p>
          {d ? (
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-foreground/90">
              <li className="rounded-xl border border-border/50 bg-background/60 p-4">
                <strong className="text-foreground">Lesson start → completion:</strong> completion rate is{" "}
                <span className="font-mono">{d.engagement.lessonDropOffRatePct ?? "—"}%</span> never-engaged (bounce proxy)
                across all lesson progress rows touched in-window.
              </li>
              <li className="rounded-xl border border-border/50 bg-background/60 p-4">
                <strong className="text-foreground">CAT practice:</strong>{" "}
                <span className="font-mono">{d.cat.practiceTestsCatStarted}</span> starts →{" "}
                <span className="font-mono">{d.cat.practiceTestsCatCompleted}</span> completes
                {catRate != null ? ` (${catRate}%)` : ""}. Exam sessions with adaptive state:{" "}
                <span className="font-mono">{d.cat.examSessionsCatTouched}</span> touched,{" "}
                <span className="font-mono">{d.cat.examSessionsCatCompleted}</span> completed.
              </li>
              <li className="rounded-xl border border-border/50 bg-background/60 p-4">
                <strong className="text-foreground">Exam sessions (window activity):</strong> in-progress touches{" "}
                <span className="font-mono">{data.signals.examSessionInProgressWindow}</span>, completed{" "}
                <span className="font-mono">{data.signals.examSessionCompletedWindow}</span>. Stale in-progress (48h+
                idle): <span className="font-mono">{data.signals.staleExamSessionsInProgress}</span> globally.
              </li>
              <li className="rounded-xl border border-border/50 bg-background/60 p-4">
                <strong className="text-foreground">Practice tests by status</strong> (started in-window):
                <span className="mt-2 flex flex-wrap gap-2 font-mono text-xs">
                  {data.signals.practiceTestByStatus.map((r) => (
                    <span key={r.status} className="rounded-md bg-muted/50 px-2 py-1">
                      {r.status}: {r.n}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          ) : null}
        </section>
      </div>

      {/* Friction & quality */}
      <div className="grid gap-8 xl:grid-cols-2">
        <section className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Friction from feedback</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Surfaces with the most reports; “friction” counts bug + broken content + confusing question + lesson issue.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-semibold">Surface</th>
                  <th className="px-3 py-2 font-semibold">Reports</th>
                  <th className="px-3 py-2 font-semibold">Friction</th>
                </tr>
              </thead>
              <tbody>
                {data.signals.feedbackBySurface.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">
                      No feedback in this window.
                    </td>
                  </tr>
                ) : (
                  data.signals.feedbackBySurface.slice(0, 14).map((r) => (
                    <tr key={r.surface} className="border-b border-border/40">
                      <td className="max-w-[280px] truncate px-3 py-2 font-mono text-xs">{r.surface}</td>
                      <td className="px-3 py-2 tabular-nums">{r.total}</td>
                      <td className="px-3 py-2 tabular-nums">{r.friction}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Triage in{" "}
            <Link href="/admin/feedback" className="font-semibold text-primary underline">
              Feedback inbox
            </Link>
            .
          </p>
        </section>

        <section className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Question frustration (bank)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Topics where learners still carry high wrong streaks (proxy for “stuck loops”).
          </p>
          <div className="mt-4 max-h-[280px] space-y-2 overflow-y-auto">
            {data.signals.frustratedTopics.length === 0 ? (
              <p className="text-sm text-muted-foreground">No high streak rows in this snapshot.</p>
            ) : (
              data.signals.frustratedTopics.map((t) => (
                <div key={t.topic} className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-sm">
                  <span className="font-medium">{t.topic}</span>
                  <span className="text-muted-foreground"> · </span>
                  <span className="text-xs text-muted-foreground">
                    {t.frustratedLearners} learners with streak ≥4 / {t.learners} total rows
                  </span>
                </div>
              ))
            )}
          </div>
          {d ? (
            <div className="mt-6 border-t border-border/50 pt-4">
              <h3 className="text-sm font-semibold text-foreground">Hardest topics (aggregate accuracy)</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {d.questions.hardestTopics.slice(0, 6).map((h) => (
                  <li key={h.topic}>
                    <span className="font-medium text-foreground">{h.topic}</span> — {h.accuracyPct}% over {h.attempts}{" "}
                    attempts
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </div>

      {/* Journey / cohort note */}
      <section className="rounded-2xl border border-border/70 bg-muted/15 p-6">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Learner strength vs struggle (coarse)</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Buckets from `UserTopicStat` accuracy with a minimum attempt threshold — useful for directionality, not
          individual diagnosis.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {data.signals.learnerAccuracyBuckets.map((b) => (
            <div key={b.bucket} className="rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{b.bucket}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{b.learners}</p>
              <p className="text-xs text-muted-foreground">learners</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Flashcard touches in-window:</strong>{" "}
          {data.signals.flashcardSessionTouches.toLocaleString()} (`flashcard_study_sessions.updated_at`).
        </p>
      </section>

      {/* Data maturity */}
      <section className="rounded-2xl border border-dashed border-border/80 bg-background/50 p-6">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Data availability &amp; next telemetry</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
          {data.dataMaturity.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        {d ? (
          <ul className="mt-4 list-inside list-disc space-y-1 border-t border-border/40 pt-4 text-xs text-muted-foreground">
            {d.dataNotes.slice(0, 4).map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
