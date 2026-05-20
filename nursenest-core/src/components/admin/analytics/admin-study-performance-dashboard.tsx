"use client";

import type { AdminStudyPerformanceData } from "@/lib/admin/load-admin-study-performance-analytics";
import { Progress } from "@/components/ui/progress";
import { Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

type Q = { fromDay: string; toDay: string };

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function HBar({ label, value, max, suffix = "" }: { label: string; value: number; max: number; suffix?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-2 text-xs">
        <span className="truncate text-muted-foreground">{label}</span>
        <span className="shrink-0 tabular-nums font-medium">
          {value.toLocaleString()}
          {suffix}
        </span>
      </div>
      <Progress value={pct} variant="accent" className="border-0 bg-muted/60" />
    </div>
  );
}

export function AdminStudyPerformanceDashboard({
  initialData,
  initialQuery,
}: {
  initialData: AdminStudyPerformanceData | null;
  initialQuery: Q;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<Q>(initialQuery);

  useEffect(() => {
    setForm(initialQuery);
  }, [initialQuery.fromDay, initialQuery.toDay]);

  const d = initialData;

  const href = useMemo(() => {
    const p = new URLSearchParams();
    p.set("from", form.fromDay);
    p.set("to", form.toDay);
    return `/admin/analytics/study-performance?${p.toString()}`;
  }, [form]);

  function apply() {
    startTransition(() => router.push(href));
  }

  async function refresh() {
    setBusy(true);
    try {
      const p = new URLSearchParams();
      p.set("from", initialQuery.fromDay);
      p.set("to", initialQuery.toDay);
      const res = await fetch(`/api/admin/analytics/study-performance?${p}`, { cache: "no-store" });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!d) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm">
        <p className="font-semibold">Unavailable</p>
        <p className="mt-2 text-muted-foreground">
          <Link className="underline" href="/admin/operations">
            Operations
          </Link>
        </p>
      </div>
    );
  }

  const maxLessonRows = Math.max(1, ...d.lessons.topLessons.map((x) => x.progressRows));
  const maxTopicAtt = Math.max(1, ...d.questions.topTopicsByAttempts.map((x) => x.attempts));
  const maxCatPath = Math.max(1, ...d.cat.pathwayDistribution.map((x) => x.sessions));
  const maxPathLesson = Math.max(1, ...d.lessons.pathwayDistribution.map((x) => x.progressRows));
  const dauSeries = d.engagement.dailyActiveUsers;
  const maxDau = Math.max(1, ...dauSeries.map((x) => x.users));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <label className="text-xs font-medium text-muted-foreground">
            From
            <input
              type="date"
              className="mt-1 block rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
              value={form.fromDay}
              onChange={(e) => setForm((f) => ({ ...f, fromDay: e.target.value }))}
            />
          </label>
          <label className="text-xs font-medium text-muted-foreground">
            To
            <input
              type="date"
              className="mt-1 block rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
              value={form.toDay}
              onChange={(e) => setForm((f) => ({ ...f, toDay: e.target.value }))}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={apply}
            disabled={pending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </button>
          <button
            type="button"
            onClick={refresh}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Window {d.query.fromDay} → {d.query.toDay} · {d.degraded ? "Some sections may be partial." : "All sections loaded."}
      </p>

      {d.warnings.length > 0 ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          <ul className="list-inside list-disc">
            {d.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <Section title="Data notes" subtitle="What each metric means and what we do not store.">
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {d.dataNotes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </Section>

      <Section title="Engagement &amp; retention" subtitle={d.engagement.note}>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">Lesson drop-off (never engaged ÷ progress rows in window)</p>
            <p className="text-2xl font-bold tabular-nums">
              {d.engagement.lessonDropOffRatePct != null ? `${d.engagement.lessonDropOffRatePct}%` : "—"}
            </p>
          </div>
          <div className="rounded-xl bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">Avg practice test length (completed, with timer)</p>
            <p className="text-2xl font-bold tabular-nums">
              {d.engagement.avgPracticeTestMinutes != null ? `${d.engagement.avgPracticeTestMinutes} min` : "—"}
            </p>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-foreground">Daily active learners (distinct users / UTC day)</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Union of lesson progress updates, practice test starts, and exam session activity. Sparse days are normal.
        </p>
        <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {dauSeries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity in window.</p>
          ) : (
            dauSeries.slice(-42).map((row) => (
              <HBar key={row.day} label={row.day} value={row.users} max={maxDau} suffix=" learners" />
            ))
          )}
        </div>
      </Section>

      <Section title="Lessons" subtitle={d.lessons.note}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Most active lessons (progress updates)</h3>
            <div className="mt-3 space-y-3">
              {d.lessons.topLessons.length === 0 ? (
                <p className="text-sm text-muted-foreground">No progress in window.</p>
              ) : (
                d.lessons.topLessons.slice(0, 15).map((row) => (
                  <div key={row.lessonKey} className="space-y-1 border-b border-border/40 pb-3 last:border-0">
                    <HBar label={row.title ?? row.lessonKey} value={row.progressRows} max={maxLessonRows} />
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                      <span>Complete {row.completionRatePct ?? "—"}%</span>
                      <span>Never engaged {row.neverEngagedRows}</span>
                      <span>Learners {row.distinctLearners}</span>
                      {row.pathwayId ? <span className="font-mono">{row.pathwayId}</span> : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Pathway distribution (lesson activity)</h3>
            <div className="mt-3 space-y-2">
              {d.lessons.pathwayDistribution.length === 0 ? (
                <p className="text-sm text-muted-foreground">No rows.</p>
              ) : (
                d.lessons.pathwayDistribution.map((p) => (
                  <HBar
                    key={String(p.pathwayId)}
                    label={String(p.pathwayId)}
                    value={p.progressRows}
                    max={maxPathLesson}
                    suffix={` · ${p.distinctLearners} learners`}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Question bank (topics)" subtitle="Aggregated accuracy from UserTopicStat.">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">Most attempted topics (min 5 attempts)</h3>
            <div className="mt-3 space-y-2">
              {d.questions.topTopicsByAttempts.map((t) => (
                <HBar
                  key={t.topic}
                  label={t.topic}
                  value={t.attempts}
                  max={maxTopicAtt}
                  suffix={t.accuracyPct != null ? ` · ${t.accuracyPct}% acc` : ""}
                />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Hardest topics (min 20 attempts, lowest accuracy)</h3>
            <div className="mt-3 space-y-2">
              {d.questions.hardestTopics.map((t) => (
                <div
                  key={t.topic}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm"
                >
                  <span className="truncate font-medium">{t.topic}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {t.accuracyPct}% ({t.attempts} att)
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{d.questions.rationaleNote}</p>
          </div>
        </div>
      </Section>

      <Section title="CAT &amp; adaptive practice" subtitle={d.cat.note}>
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">CAT practice starts</p>
            <p className="text-2xl font-bold tabular-nums">{d.cat.practiceTestsCatStarted}</p>
          </div>
          <div className="rounded-xl bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">CAT practice completed</p>
            <p className="text-2xl font-bold tabular-nums">{d.cat.practiceTestsCatCompleted}</p>
          </div>
          <div className="rounded-xl bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">Avg accuracy (completed)</p>
            <p className="text-2xl font-bold tabular-nums">
              {d.cat.practiceTestsCatAvgAccuracyPct != null ? `${d.cat.practiceTestsCatAvgAccuracyPct}%` : "—"}
            </p>
          </div>
          <div className="rounded-xl bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">ExamSession (adaptive state)</p>
            <p className="text-sm font-semibold">
              {d.cat.examSessionsCatTouched} touched · {d.cat.examSessionsCatCompleted} completed
            </p>
          </div>
        </div>

        <h3 className="text-sm font-semibold">CAT practice by pathway (started in window)</h3>
        <div className="mt-2 space-y-2">
          {d.cat.pathwayDistribution.map((p) => (
            <HBar
              key={String(p.pathwayId)}
              label={String(p.pathwayId)}
              value={p.sessions}
              max={maxCatPath}
              suffix={` · done ${p.completed}`}
            />
          ))}
        </div>

        <h3 className="mt-8 text-sm font-semibold">Readiness label trend (completed CAT, by UTC week)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3">Week</th>
                <th className="py-2 pr-3">Readiness</th>
                <th className="py-2 pr-3">Sessions</th>
              </tr>
            </thead>
            <tbody>
              {d.cat.readinessByWeek.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 text-muted-foreground">
                    No readiness labels in window (or no completed CAT rows with results).
                  </td>
                </tr>
              ) : (
                d.cat.readinessByWeek.map((r, i) => (
                  <tr key={`${r.weekStart}-${r.label ?? "null"}-${i}`} className="border-b border-border/40">
                    <td className="py-2 pr-3 font-mono text-xs">{r.weekStart}</td>
                    <td className="py-2 pr-3">{r.label ?? "—"}</td>
                    <td className="py-2 pr-3 tabular-nums">{r.sessions}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
