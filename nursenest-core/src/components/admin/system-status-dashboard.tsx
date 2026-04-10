"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import type {
  OverallSystemStatus,
  SystemCheckResult,
  SystemStatusOperationalSummary,
  SystemStatusPayload,
} from "@/lib/admin/system-status-types";

function overallBannerClass(overall: OverallSystemStatus): string {
  if (overall === "healthy") return "border-emerald-500/40 bg-emerald-500/[0.08] text-emerald-950 dark:text-emerald-50";
  if (overall === "degraded") return "border-amber-500/40 bg-amber-500/[0.08] text-amber-950 dark:text-amber-50";
  return "border-red-500/40 bg-red-500/[0.08] text-red-950 dark:text-red-50";
}

function pillClass(status: SystemCheckResult["status"]): string {
  if (status === "healthy") return "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100";
  if (status === "degraded") return "bg-amber-500/15 text-amber-900 dark:text-amber-100";
  return "bg-red-500/15 text-red-900 dark:text-red-100";
}

/** API uses `failed`; banner copy matches spec “down”. */
function overallDisplayLabel(overall: OverallSystemStatus): string {
  if (overall === "failed") return "Down";
  return overall.charAt(0).toUpperCase() + overall.slice(1);
}

type QueueHealthDetails = {
  lessonBatchStuckGenerating?: number;
  oldestPendingJobAgeMinutes?: number | null;
};

function fmtStat(n: number | null): string {
  if (n === null) return "—";
  return n.toLocaleString();
}

function fmtMs(n: number | null): string {
  if (n === null) return "—";
  return `${n} ms`;
}

function SummaryStat({ label, value, title }: { label: string; value: string; title?: string }) {
  return (
    <div
      className="min-w-0 rounded-lg border border-border/60 bg-[var(--theme-card-bg)] px-3 py-2 shadow-sm"
      title={title}
    >
      <p className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 tabular-nums text-lg font-semibold text-[var(--theme-heading-text)]">{value}</p>
    </div>
  );
}

function OperationalSummaryRow({
  summary,
  checkedAt,
}: {
  summary: SystemStatusOperationalSummary;
  checkedAt: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/15 p-3 sm:p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Operational snapshot</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <SummaryStat label="Active AI jobs" value={fmtStat(summary.activeAiJobs)} />
        <SummaryStat
          label="Stuck AI jobs"
          value={fmtStat(summary.stuckAiJobs)}
          title="Lesson batch queue items stuck in GENERATING past the stale threshold"
        />
        <SummaryStat label="Failed AI jobs" value={fmtStat(summary.failedAiJobs)} />
        <SummaryStat label="Lesson drafts (review)" value={fmtStat(summary.lessonDraftsPendingReview)} />
        <SummaryStat label="Question drafts (review)" value={fmtStat(summary.questionDraftsPendingReview)} />
        <SummaryStat label="DB latency" value={fmtMs(summary.databaseLatencyMs)} />
        <SummaryStat label="Last checked" value={new Date(checkedAt).toLocaleString()} />
      </div>
    </div>
  );
}

function CheckCard({ check }: { check: SystemCheckResult }) {
  const [open, setOpen] = useState(false);
  const qd = check.details as QueueHealthDetails;
  const warnQueue =
    check.id === "queueHealth" &&
    check.status !== "healthy" &&
    ((qd.lessonBatchStuckGenerating ?? 0) > 0 ||
      (qd.oldestPendingJobAgeMinutes != null && qd.oldestPendingJobAgeMinutes > 120));

  return (
    <article
      className={`rounded-xl border border-border/80 bg-[var(--theme-card-bg)] p-4 shadow-sm ${
        warnQueue ? "ring-2 ring-amber-500/30" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-[var(--theme-heading-text)]">{check.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{check.summary}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${pillClass(check.status)}`}>
          {check.status}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {check.responseTimeMs} ms · checked {new Date(check.checkedAt).toLocaleString()}
      </p>
      <button
        type="button"
        className="mt-2 text-sm font-medium text-primary hover:underline"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Hide details" : "Show details"}
      </button>
      {open ? (
        <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-muted/50 p-3 text-xs leading-relaxed text-foreground">
          {JSON.stringify(check.details, null, 2)}
        </pre>
      ) : null}
    </article>
  );
}

export function SystemStatusDashboard({ initial }: { initial: SystemStatusPayload }) {
  const [data, setData] = useState<SystemStatusPayload>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/system-status", { credentials: "include", cache: "no-store" });
      const json = (await res.json()) as SystemStatusPayload | { ok?: boolean; error?: string };
      if (!res.ok || !("checks" in json) || !json.checks || !("summary" in json) || !json.summary) {
        setError("error" in json && json.error ? json.error : `HTTP ${res.status}`);
        return;
      }
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const queueDetails = data.checks.find((c) => c.id === "queueHealth")?.details as QueueHealthDetails | undefined;
  const stuckLessonBatch = queueDetails?.lessonBatchStuckGenerating ?? 0;
  const oldPending = queueDetails?.oldestPendingJobAgeMinutes;
  const showQueueBanner =
    stuckLessonBatch > 0 || (oldPending != null && oldPending > 120);

  return (
    <div className="space-y-8">
      <div className={`rounded-xl border px-4 py-3 ${overallBannerClass(data.overall)}`}>
        <p className="text-sm font-semibold uppercase tracking-wide">Overall</p>
        <p className="mt-1 text-2xl font-bold">{overallDisplayLabel(data.overall)}</p>
        <p className="mt-1 text-sm opacity-90">
          Snapshot {new Date(data.checkedAt).toLocaleString()} · total probe wall time {data.totalResponseTimeMs} ms
        </p>
        {showQueueBanner ? (
          <p className="mt-2 text-sm font-semibold text-amber-900 dark:text-amber-100">
            {stuckLessonBatch > 0 ? (
              <>
                Warning: {stuckLessonBatch} lesson batch item(s) stuck in GENERATING past the stale threshold.{" "}
              </>
            ) : null}
            {oldPending != null && oldPending > 120 ? (
              <>Oldest PENDING AI job is ~{oldPending} minutes old. </>
            ) : null}
            See the queue card and{" "}
            <Link href="/admin/automation-logs" className="underline">
              automation logs
            </Link>
            .
          </p>
        ) : null}
      </div>

      <OperationalSummaryRow summary={data.summary} checkedAt={data.checkedAt} />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh status"}
        </button>
        <span className="text-sm text-muted-foreground">Runs a fresh probe (not cached).</span>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-900 dark:text-red-100">
          {error}
        </div>
      ) : null}

      <section>
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Checks</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {data.checks.map((c) => (
            <CheckCard key={c.id} check={c} />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border/70 bg-muted/20 p-4">
        <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">Quick links</h2>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-primary">
          <li>
            <Link href="/admin/lessons/generate-batch" className="underline-offset-4 hover:underline">
              Lesson batch AI
            </Link>
          </li>
          <li>
            <Link href="/admin/ai/exam-questions/batch" className="underline-offset-4 hover:underline">
              Question batch AI
            </Link>
          </li>
          <li>
            <Link href="/admin/lessons" className="underline-offset-4 hover:underline">
              Lesson library
            </Link>
          </li>
          <li>
            <Link href="/admin/lessons/generate" className="underline-offset-4 hover:underline">
              Lesson AI (single)
            </Link>
          </li>
          <li>
            <Link href="/admin/blog/studio" className="underline-offset-4 hover:underline">
              Blog article studio
            </Link>
          </li>
          <li>
            <Link href="/admin/ai/exam-questions" className="underline-offset-4 hover:underline">
              Exam question AI
            </Link>
          </li>
          <li>
            <Link href="/admin/ai/review" className="underline-offset-4 hover:underline">
              AI review queue (drafts)
            </Link>
          </li>
          <li>
            <Link href="/admin/diagnostics" className="underline-offset-4 hover:underline">
              Diagnostics
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
