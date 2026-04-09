"use client";

import type { AdminAnalyticsDashboardData } from "@/lib/admin/load-admin-analytics-dashboard";
import { Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function MiniBars({
  points,
  label,
}: {
  points: Array<{ label: string; value: number }>;
  label: string;
}) {
  const max = Math.max(1, ...points.map((p) => p.value));
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="flex h-28 items-end gap-0.5">
        {points.map((p) => (
          <div key={p.label} className="flex min-w-0 flex-1 flex-col items-center gap-1" title={`${p.label}: ${p.value}`}>
            <div
              className="w-full max-w-[14px] rounded-t bg-primary/80 transition hover:bg-primary"
              style={{ height: `${Math.max(4, (p.value / max) * 100)}%` }}
            />
            <span className="truncate text-[9px] text-muted-foreground">{p.label.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-2 text-xs">
        <span className="truncate text-muted-foreground">{label}</span>
        <span className="shrink-0 tabular-nums font-medium">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted/60">
        <div className="h-2 rounded-full bg-gradient-to-r from-primary/70 to-emerald-500/80" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SectionCard({
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

export function AdminAnalyticsDashboard({ initialData }: { initialData: AdminAnalyticsDashboardData | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/analytics/dashboard", { cache: "no-store" });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!initialData) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm">
        <p className="font-semibold text-amber-950 dark:text-amber-100">Analytics data unavailable</p>
        <p className="mt-2 text-muted-foreground">
          The database may be offline or the app is in safe mode. Check{" "}
          <Link className="font-semibold text-primary underline" href="/admin/operations">
            Operations
          </Link>{" "}
          and environment configuration.
        </p>
      </div>
    );
  }

  const d = initialData;
  const maxPathLessons = Math.max(1, ...d.pathwayInterest.lessonsPublishedByPathway.map((x) => x.count));
  const maxGoal = Math.max(1, ...d.pathwayInterest.learnerGoalPathways.map((x) => x.learners));
  const maxLessonProg = Math.max(1, ...d.lessonUsage.topLessonsByProgressRows.map((x) => x.progressRows));
  const maxExamAtt = Math.max(1, ...d.questionUsage.topExamsByAttempts7d.map((x) => x.attempts));
  const maxTopic = Math.max(1, ...d.questionUsage.topTopicsByVolume.map((x) => x.totalAttempts));

  const signupsSum = d.subscriptions.newUsersByDay.reduce((a, p) => a + p.value, 0);
  const subsSum = d.subscriptions.newSubscriptionsByDay.reduce((a, p) => a + p.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Last loaded {new Date(d.generatedAt).toLocaleString()}
          {d.degraded ? " · Some sections reported warnings — see below." : ""}
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted/60 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <RefreshCw className="h-3.5 w-3.5" aria-hidden />}
          Refresh
        </button>
      </div>

      {d.warnings.length > 0 ? (
        <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
          <p className="font-semibold">Partial data</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            {d.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-2xl border border-sky-500/25 bg-sky-500/[0.07] px-4 py-3 text-sm">
        <p className="font-semibold text-[var(--theme-heading-text)]">What this dashboard does not include</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          {d.dataGaps.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-primary/[0.07] to-transparent p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Active subscriptions</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">
            {d.subscriptions.active.toLocaleString()}
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Grace {d.subscriptions.grace} · Past due {d.subscriptions.pastDue}
          </p>
        </div>
        <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Exam attempts (7d)</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">{d.questionUsage.examAttempts7d.toLocaleString()}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">From ExamAttempt rows</p>
        </div>
        <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Lesson progress rows</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">{d.lessonUsage.progressRowsTotal.toLocaleString()}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Distinct learners (7d): {d.lessonUsage.distinctLearnersWithProgress7d.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">New users ({d.subscriptions.chartDays}d)</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">{signupsSum.toLocaleString()}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">Subscriptions started: {subsSum.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Acquisition & subscriptions (database)"
          subtitle={`Daily new users vs new Subscription rows — last ${d.subscriptions.chartDays} days.`}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <MiniBars points={d.subscriptions.newUsersByDay} label="New users / day" />
            <MiniBars points={d.subscriptions.newSubscriptionsByDay} label="New subscriptions / day" />
          </div>
        </SectionCard>

        <SectionCard title="Site traffic" subtitle="Honest gap — not in Postgres.">
          <p className="text-sm text-muted-foreground">{d.traffic.siteTrafficNote}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Tip: use PostHog dashboards or Vercel Analytics for sessions, top pages, and referrers.
          </p>
        </SectionCard>
      </div>

      <SectionCard title="Blog content performance" subtitle={d.traffic.blogPerformanceNote}>
        {d.traffic.blogPerformance.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published posts with perf fields populated yet.</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-2">Post</th>
                  <th className="py-2 text-right">Impr.</th>
                  <th className="py-2 text-right">Clicks</th>
                  <th className="py-2 text-right">CTR</th>
                  <th className="py-2 text-right">Internal</th>
                </tr>
              </thead>
              <tbody>
                {d.traffic.blogPerformance.map((r) => (
                  <tr key={r.slug} className="border-b border-border/40">
                    <td className="py-2">
                      <a className="font-medium text-primary underline" href={r.href} target="_blank" rel="noreferrer">
                        {r.slug}
                      </a>
                      <div className="line-clamp-1 text-xs text-muted-foreground">{r.title}</div>
                    </td>
                    <td className="py-2 text-right tabular-nums">{r.impressions ?? "—"}</td>
                    <td className="py-2 text-right tabular-nums">{r.clicks ?? "—"}</td>
                    <td className="py-2 text-right tabular-nums">{r.ctr != null ? `${(r.ctr * 100).toFixed(2)}%` : "—"}</td>
                    <td className="py-2 text-right tabular-nums">{r.internalClicks ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Pathway interest" subtitle={d.pathwayInterest.note}>
          <div className="space-y-4">
            <p className="text-xs font-semibold text-muted-foreground">Published lessons by pathway</p>
            <div className="space-y-3">
              {d.pathwayInterest.lessonsPublishedByPathway.slice(0, 10).map((r) => (
                <HBar key={r.pathwayId} label={r.pathwayId} value={r.count} max={maxPathLessons} />
              ))}
            </div>
            <p className="mt-6 text-xs font-semibold text-muted-foreground">Learner goal pathways (profile)</p>
            <div className="space-y-3">
              {d.pathwayInterest.learnerGoalPathways.length === 0 ? (
                <p className="text-sm text-muted-foreground">No targetExamPathwayId values on learners yet.</p>
              ) : (
                d.pathwayInterest.learnerGoalPathways.slice(0, 10).map((r) => (
                  <HBar key={r.pathwayId} label={r.pathwayId} value={r.learners} max={maxGoal} />
                ))
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Lesson usage" subtitle={d.lessonUsage.note}>
          <div className="space-y-3">
            {d.lessonUsage.topLessonsByProgressRows.map((r) => (
              <HBar
                key={r.lessonId}
                label={`${r.title.slice(0, 42)}${r.title.length > 42 ? "…" : ""}`}
                value={r.progressRows}
                max={maxLessonProg}
              />
            ))}
            {d.lessonUsage.topLessonsByProgressRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No Progress rows yet.</p>
            ) : null}
          </div>
          <Link className="mt-4 inline-block text-xs font-semibold text-primary underline" href="/admin/lessons">
            Open lesson library
          </Link>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Question & exam practice" subtitle={d.questionUsage.note}>
          <p className="mb-4 text-sm">
            Total attempts (7d):{" "}
            <strong className="tabular-nums">{d.questionUsage.examAttempts7d.toLocaleString()}</strong>
          </p>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Top exams by attempts (7d)</p>
          <div className="space-y-3">
            {d.questionUsage.topExamsByAttempts7d.map((r) => (
              <HBar
                key={r.examId}
                label={r.examTitle ?? r.examId.slice(0, 8)}
                value={r.attempts}
                max={maxExamAtt}
              />
            ))}
            {d.questionUsage.topExamsByAttempts7d.length === 0 ? (
              <p className="text-sm text-muted-foreground">No attempts in window.</p>
            ) : null}
          </div>
          <p className="mb-2 mt-6 text-xs font-semibold text-muted-foreground">Topic volume (UserTopicStat)</p>
          <div className="space-y-3">
            {d.questionUsage.topTopicsByVolume.map((r) => (
              <HBar key={r.topic} label={r.topic} value={r.totalAttempts} max={maxTopic} />
            ))}
            {d.questionUsage.topTopicsByVolume.length === 0 ? (
              <p className="text-sm text-muted-foreground">No topic stats yet.</p>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard title="CAT / adaptive usage (7d)" subtitle={d.catUsage.note}>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-2xl font-bold tabular-nums">{d.catUsage.examSessionsAdaptive7d}</p>
              <p className="text-[11px] text-muted-foreground">ExamSession with adaptive state</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-2xl font-bold tabular-nums">{d.catUsage.examSessionsLinear7d}</p>
              <p className="text-[11px] text-muted-foreground">Other exam sessions (incl. linear)</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-2xl font-bold tabular-nums">{d.catUsage.practiceTestsAdaptiveCompleted7d}</p>
              <p className="text-[11px] text-muted-foreground">Adaptive practice tests completed</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-2xl font-bold tabular-nums">{d.catUsage.practiceTestsCompleted7d}</p>
              <p className="text-[11px] text-muted-foreground">All practice tests completed</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Content generation (AI jobs)"
          subtitle="AiGenerationJob — last 7 days rollups + recent runs."
        >
          <div className="mb-4 flex flex-wrap gap-4 text-sm">
            <span>
              Completed: <strong>{d.contentGeneration.jobs7d.completed}</strong>
            </span>
            <span>
              Failed: <strong className="text-rose-700 dark:text-rose-300">{d.contentGeneration.jobs7d.failed}</strong>
            </span>
            <span>
              Pending/running: <strong>{d.contentGeneration.jobs7d.pendingOrRunning}</strong>
            </span>
          </div>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 border-b border-border bg-[var(--theme-card-bg)] text-muted-foreground">
                <tr>
                  <th className="py-1">Tool</th>
                  <th className="py-1">Status</th>
                  <th className="py-1">When</th>
                </tr>
              </thead>
              <tbody>
                {d.contentGeneration.recentJobs.map((j) => (
                  <tr key={j.id} className="border-b border-border/30">
                    <td className="py-1.5 font-mono">{j.tool}</td>
                    <td className="py-1.5">{j.status}</td>
                    <td className="py-1.5 text-muted-foreground">{new Date(j.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link className="mt-3 inline-block text-xs font-semibold text-primary underline" href="/admin/ai/exam-questions">
            AI tools
          </Link>
        </SectionCard>

        <SectionCard title="Admin automation activity" subtitle="ContentAutomationLog — most recent first.">
          <div className="overflow-auto max-h-72">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 border-b border-border bg-[var(--theme-card-bg)] text-muted-foreground">
                <tr>
                  <th className="py-1">Category</th>
                  <th className="py-1">Job</th>
                  <th className="py-1">Status</th>
                  <th className="py-1">When</th>
                </tr>
              </thead>
              <tbody>
                {d.automation.recentLogs.map((l) => (
                  <tr key={l.id} className="border-b border-border/30 align-top">
                    <td className="py-1.5">{l.category}</td>
                    <td className="py-1.5 font-mono">{l.jobType}</td>
                    <td className="py-1.5">{l.status}</td>
                    <td className="py-1.5 text-muted-foreground whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {d.automation.recentLogs.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No automation logs yet.</p>
          ) : null}
        </SectionCard>
      </div>

      <SectionCard title="Errors & failures" subtitle="Background jobs, AI jobs with stored errors, and failed content automation.">
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">BackgroundJob (FAILED)</p>
            <ul className="mt-2 space-y-2 text-xs">
              {d.failures.backgroundJobsFailed.map((j) => (
                <li key={j.id} className="rounded-lg border border-border/50 bg-muted/20 p-2">
                  <span className="font-mono">{j.type}</span>
                  <p className="mt-1 line-clamp-3 text-rose-800 dark:text-rose-200">{j.lastError ?? "—"}</p>
                </li>
              ))}
            </ul>
            {d.failures.backgroundJobsFailed.length === 0 ? <p className="text-xs text-muted-foreground">None.</p> : null}
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">AiGenerationJob (error field)</p>
            <ul className="mt-2 space-y-2 text-xs">
              {d.failures.aiJobsWithErrors.map((j) => (
                <li key={j.id} className="rounded-lg border border-border/50 bg-muted/20 p-2">
                  <span className="font-mono">{j.tool}</span>
                  <p className="mt-1 line-clamp-3">{j.errorPreview}</p>
                </li>
              ))}
            </ul>
            {d.failures.aiJobsWithErrors.length === 0 ? <p className="text-xs text-muted-foreground">None.</p> : null}
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">ContentAutomationLog (FAILED)</p>
            <ul className="mt-2 space-y-2 text-xs">
              {d.failures.automationFailures.map((a) => (
                <li key={a.id} className="rounded-lg border border-border/50 bg-muted/20 p-2">
                  <span>
                    {a.category} · <span className="font-mono">{a.jobType}</span>
                  </span>
                  <p className="mt-1 line-clamp-3 text-rose-800 dark:text-rose-200">{a.errorPreview}</p>
                </li>
              ))}
            </ul>
            {d.failures.automationFailures.length === 0 ? <p className="text-xs text-muted-foreground">None.</p> : null}
          </div>
        </div>
        <Link className="mt-4 inline-block text-xs font-semibold text-primary underline" href="/admin/diagnostics">
          Full diagnostics
        </Link>
      </SectionCard>
    </div>
  );
}
