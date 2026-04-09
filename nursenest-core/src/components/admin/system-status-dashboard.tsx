"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import type { OverallSystemStatus, SystemCheckResult, SystemStatusPayload } from "@/lib/admin/system-status-types";

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

function CheckCard({ check }: { check: SystemCheckResult }) {
  const [open, setOpen] = useState(false);
  const warnQueue =
    check.id === "queueHealth" &&
    check.status !== "healthy" &&
    (Number((check.details as { stuckRunningOlderThan30Min?: number }).stuckRunningOlderThan30Min) > 0 ||
      (check.details as { oldestPendingAgeMinutes?: number | null }).oldestPendingAgeMinutes != null);

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
      if (!res.ok || !("checks" in json) || !json.checks) {
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

  const stuck =
    data.checks.find((c) => c.id === "queueHealth")?.details as
      | { stuckRunningOlderThan30Min?: number }
      | undefined;

  return (
    <div className="space-y-8">
      <div className={`rounded-xl border px-4 py-3 ${overallBannerClass(data.overall)}`}>
        <p className="text-sm font-semibold uppercase tracking-wide">Overall</p>
        <p className="mt-1 text-2xl font-bold capitalize">{data.overall}</p>
        <p className="mt-1 text-sm opacity-90">
          Snapshot {new Date(data.checkedAt).toLocaleString()} · total probe wall time {data.totalResponseTimeMs} ms
        </p>
        {(stuck?.stuckRunningOlderThan30Min ?? 0) > 0 ? (
          <p className="mt-2 text-sm font-semibold text-amber-900 dark:text-amber-100">
            Warning: AI jobs stuck in RUNNING ({stuck?.stuckRunningOlderThan30Min}) older than 30 minutes — see queue card and{" "}
            <Link href="/admin/automation-logs" className="underline">
              automation logs
            </Link>
            .
          </p>
        ) : null}
      </div>

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
            <Link href="/admin/ai/review" className="underline-offset-4 hover:underline">
              AI review queue
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
