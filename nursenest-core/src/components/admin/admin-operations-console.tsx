"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { AdminDiagnostics } from "@/lib/admin/load-admin-diagnostics";
import type { AdminOperationsHealth } from "@/lib/admin/load-admin-operations-health";

type JobRow = {
  id: string;
  type: string;
  status: string;
  attempts: number;
  maxAttempts: number;
  lastError: string | null;
  scheduledFor: string;
  createdAt: string;
  updatedAt: string;
};

function toneForSeverity(ok: boolean, warn?: boolean) {
  if (ok && !warn) return "border-emerald-500/30 bg-emerald-500/5";
  if (warn) return "border-amber-500/40 bg-amber-500/10";
  return "border-rose-500/40 bg-rose-500/10";
}

export function AdminOperationsConsole({
  initialHealth,
  diagnostics,
}: {
  initialHealth: AdminOperationsHealth;
  diagnostics: AdminDiagnostics;
}) {
  const [health, setHealth] = useState(initialHealth);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [retryJobId, setRetryJobId] = useState<string | null>(null);

  const [jobFilter, setJobFilter] = useState<string>("");
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  const refreshHealth = useCallback(async () => {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/operations-health", { cache: "no-store" });
      const json = (await res.json()) as { ok?: boolean; health?: AdminOperationsHealth; error?: string };
      if (!res.ok || !json.ok || !json.health) {
        setErr(json.error ?? "Failed to load health");
        return;
      }
      setHealth(json.health);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, []);

  const loadJobs = useCallback(async () => {
    setJobsLoading(true);
    try {
      const q = new URLSearchParams();
      q.set("take", "60");
      q.set("offset", "0");
      if (jobFilter) q.set("status", jobFilter);
      const res = await fetch(`/api/admin/jobs?${q}`, { cache: "no-store" });
      const json = (await res.json()) as { jobs?: JobRow[] };
      setJobs(json.jobs ?? []);
    } finally {
      setJobsLoading(false);
    }
  }, [jobFilter]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  async function retryBackgroundJob(id: string) {
    setRetryJobId(id);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/jobs/${id}/retry`, { method: "POST" });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setErr(json.error ?? "Retry failed");
        return;
      }
      await refreshHealth();
      await loadJobs();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setRetryJobId(null);
    }
  }

  const h = health;
  const dbOk = h.database.status === "ok" || h.database.status === "skipped";
  const cronFailed = h.backgroundJobs.byStatus["FAILED"] ?? 0;
  const cronPending = h.backgroundJobs.pendingReady;
  const aiFailedTotal = h.aiGenerationJobs.failedByTool7d.reduce((s, x) => s + x.count, 0);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Snapshot {new Date(h.generatedAt).toLocaleString()} ·{" "}
          <button
            type="button"
            disabled={busy}
            className="font-semibold text-primary underline disabled:opacity-50"
            onClick={() => void refreshHealth()}
          >
            {busy ? "Refreshing…" : "Refresh metrics"}
          </button>
        </p>
        <div className="flex flex-wrap gap-2 text-sm font-semibold">
          <Link href="/admin/automation-logs" className="text-primary underline">
            Automation logs
          </Link>
          <Link href="/admin/diagnostics" className="text-muted-foreground underline">
            Diagnostics
          </Link>
          <Link href="/admin/analytics" className="text-muted-foreground underline">
            Analytics hub
          </Link>
          <Link href="/admin/ai/review" className="text-muted-foreground underline">
            AI review queue
          </Link>
        </div>
      </div>

      {err ? <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-900 dark:text-rose-100">{err}</p> : null}

      {h.dataNotes.length > 0 ? (
        <div className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Data notes</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {h.dataNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <section>
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">System status</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className={`nn-card rounded-xl border p-4 ${toneForSeverity(dbOk)}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Database</p>
            <p className="mt-1 text-2xl font-bold capitalize">{h.database.status}</p>
            {h.database.latencyMs != null ? <p className="mt-1 text-sm text-muted-foreground">{h.database.latencyMs}ms</p> : null}
            {h.database.error ? <p className="mt-1 text-sm text-rose-800 dark:text-rose-200">{h.database.error}</p> : null}
          </div>
          <div className={`nn-card rounded-xl border p-4 ${toneForSeverity(!h.safeMode, h.safeMode)}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Safe mode</p>
            <p className="mt-1 text-2xl font-bold">{h.safeMode ? "On" : "Off"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {h.safeMode ? "Reduced writes / some metrics may be skipped." : "Normal runtime."}
            </p>
          </div>
          <div className={`nn-card rounded-xl border p-4 ${toneForSeverity(diagnostics.apiHealth.probed ? diagnostics.apiHealth.liveness.ok : true)}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">HTTP probes</p>
            {diagnostics.apiHealth.probed ? (
              <ul className="mt-2 space-y-1 text-sm">
                <li>
                  {diagnostics.apiHealth.liveness.path}:{" "}
                  <span className={diagnostics.apiHealth.liveness.ok ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700"}>
                    {diagnostics.apiHealth.liveness.ok ? "ok" : "fail"}
                  </span>
                </li>
                <li>
                  {diagnostics.apiHealth.readiness.path}:{" "}
                  <span className={diagnostics.apiHealth.readiness.ok ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700"}>
                    {diagnostics.apiHealth.readiness.ok ? "ok" : "fail"}
                  </span>
                </li>
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No public base URL — probes skipped.</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Automation & generation</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cron worker jobs, blog/content automation logs, and AI studio runs. Use filters on the full automation log page
          for deep dives.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className={`nn-card rounded-xl border p-4 ${toneForSeverity(cronFailed === 0, cronFailed > 0 || cronPending > 50)}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Background queue</p>
            <p className="mt-1 text-sm">
              Pending (ready): <strong>{cronPending}</strong> · Scheduled future:{" "}
              <strong>{h.backgroundJobs.pendingScheduledFuture}</strong>
            </p>
            <p className="mt-1 text-sm">
              Failed total: <strong>{cronFailed}</strong>
            </p>
          </div>
          <div className={`nn-card rounded-xl border p-4 ${toneForSeverity(aiFailedTotal === 0, aiFailedTotal > 0 || h.aiGenerationJobs.runningCount > 3)}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI generation jobs</p>
            <p className="mt-1 text-sm">
              Running: <strong>{h.aiGenerationJobs.runningCount}</strong> · Failed (7d, by tool below)
            </p>
            {h.aiGenerationJobs.failedByTool7d.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No failures in window.</p>
            ) : (
              <ul className="mt-2 max-h-24 space-y-0.5 overflow-y-auto font-mono text-xs">
                {h.aiGenerationJobs.failedByTool7d.map((x) => (
                  <li key={x.tool}>
                    {x.tool}: {x.count}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div
            className={`nn-card rounded-xl border p-4 ${toneForSeverity(
              h.contentAutomation.linkCheckWarnings7d === 0,
              h.contentAutomation.linkCheckWarnings7d > 0,
            )}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Broken-link checks</p>
            <p className="mt-1 text-3xl font-bold">{h.contentAutomation.linkCheckWarnings7d}</p>
            <p className="mt-1 text-xs text-muted-foreground">Warnings (7d) · BLOG_INTERNAL_LINK_CHECK</p>
            <Link href="/admin/automation-logs?category=BLOG_INTERNAL_LINK_CHECK&status=WARNING" className="mt-2 inline-block text-sm text-primary underline">
              View logs →
            </Link>
          </div>
          <div
            className={`nn-card rounded-xl border p-4 ${toneForSeverity(
              h.blogAndPublish.postsFailed === 0,
              (h.blogAndPublish.postsFailed ?? 0) > 0,
            )}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Publish & schedules</p>
            <p className="mt-1 text-sm">
              Blog posts FAILED: <strong>{h.blogAndPublish.postsFailed}</strong>
            </p>
            <p className="mt-1 text-sm">
              Batch items failed (7d): <strong>{h.blogAndPublish.draftBatchItemsFailed7d}</strong>
            </p>
            <p className="mt-1 text-sm">
              Schedule failed / overdue: <strong>{h.blogAndPublish.scheduleItemsFailed}</strong> /{" "}
              <strong>{h.blogAndPublish.scheduleItemsOverdue}</strong>
            </p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
              <Link href="/admin/blog" className="text-primary underline">
                Blog hub
              </Link>
              <Link href="/admin/blog/scheduler" className="text-primary underline">
                Scheduler
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Content validation & drafts</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="nn-card rounded-xl border border-border/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Question drafts</p>
            <p className="mt-1 text-sm">
              Pending review: <strong>{h.draftReview.questionDrafts.pending}</strong> · Rejected:{" "}
              <strong>{h.draftReview.questionDrafts.rejected}</strong>
            </p>
            <Link href="/admin/ai/review" className="mt-2 inline-block text-sm text-primary underline">
              Review queue →
            </Link>
          </div>
          <div className="nn-card rounded-xl border border-border/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lesson drafts</p>
            <p className="mt-1 text-sm">
              Pending review: <strong>{h.draftReview.lessonDrafts.pending}</strong> · Rejected:{" "}
              <strong>{h.draftReview.lessonDrafts.rejected}</strong>
            </p>
            <Link href="/admin/ai/review" className="mt-2 inline-block text-sm text-primary underline">
              Review queue →
            </Link>
          </div>
          <div className="nn-card rounded-xl border border-border/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Flashcard drafts</p>
            <p className="mt-1 text-sm">
              Pending review: <strong>{h.draftReview.flashcardDrafts.pending}</strong> · Rejected:{" "}
              <strong>{h.draftReview.flashcardDrafts.rejected}</strong>
            </p>
            <Link href="/admin/ai/review" className="mt-2 inline-block text-sm text-primary underline">
              Review queue →
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Billing signals (DB)</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="nn-card rounded-xl border border-border/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Subscriptions</p>
            <p className="mt-1 text-sm">
              PAST_DUE: <strong>{h.subscriptionsBilling.pastDue}</strong> · GRACE: <strong>{h.subscriptionsBilling.grace}</strong>
            </p>
            <Link href="/admin/subscriptions" className="mt-2 inline-block text-sm text-primary underline">
              Subscription rows →
            </Link>
            <Link href="/admin/analytics/subscriptions" className="ml-3 inline-block text-sm text-primary underline">
              Subscription analytics →
            </Link>
          </div>
          <div className="nn-card rounded-xl border border-border/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stripe webhooks (24h)</p>
            <p className="mt-1 text-3xl font-bold">{h.subscriptionsBilling.stripeWebhookEvents24h}</p>
            <p className="mt-1 text-xs text-muted-foreground">Dedup event rows received — not a health score by itself.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Blog / content automation (7d)</h2>
            <p className="mt-1 text-sm text-muted-foreground">Failures by category — drill down via automation logs.</p>
          </div>
          <Link
            href="/admin/automation-logs?status=FAILED&hours=168"
            className="text-sm font-semibold text-primary underline"
          >
            Open filtered logs →
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border/70">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Failures</th>
              </tr>
            </thead>
            <tbody>
              {h.contentAutomation.failedByCategory.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-4 text-muted-foreground">
                    No failures in the last 7 days.
                  </td>
                </tr>
              ) : (
                h.contentAutomation.failedByCategory.map((row) => (
                  <tr key={row.category} className="border-b border-border/60">
                    <td className="p-3 font-mono text-xs">{row.category}</td>
                    <td className="p-3">{row.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-sm font-semibold text-muted-foreground">Recent automation failures (7d)</h3>
        <div className="mt-2 overflow-x-auto rounded-xl border border-border/70">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
                <th className="p-2 font-semibold">When</th>
                <th className="p-2 font-semibold">Category</th>
                <th className="p-2 font-semibold">Summary / error</th>
                <th className="p-2 font-semibold">Drill-down</th>
              </tr>
            </thead>
            <tbody>
              {h.contentAutomation.recentFailures.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-muted-foreground">
                    None.
                  </td>
                </tr>
              ) : (
                h.contentAutomation.recentFailures.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 align-top">
                    <td className="whitespace-nowrap p-2 text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="p-2 font-mono text-xs">{r.category}</td>
                    <td className="max-w-md p-2 text-xs">
                      {r.summary ? <div>{r.summary}</div> : null}
                      {r.error ? <div className="mt-1 text-rose-800 dark:text-rose-200">{r.error}</div> : null}
                    </td>
                    <td className="p-2">
                      <Link href={`/admin/automation-logs?id=${encodeURIComponent(r.id)}`} className="text-primary underline">
                        Open log
                      </Link>
                      {r.blogPostId ? (
                        <Link
                          href={`/admin/blog/control-panel?id=${encodeURIComponent(r.blogPostId)}`}
                          className="ml-2 text-primary underline"
                        >
                          Post
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Cron background jobs</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Worker-processed queue. Failed jobs can be re-queued when safe (does not run inline).
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Filter</span>
            <select
              className="rounded-md border border-border px-2 py-1.5"
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="FAILED">FAILED</option>
              <option value="PENDING">PENDING</option>
              <option value="RUNNING">RUNNING</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </label>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-border/70">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
                <th className="p-2 font-semibold">Type</th>
                <th className="p-2 font-semibold">Status</th>
                <th className="p-2 font-semibold">Attempts</th>
                <th className="p-2 font-semibold">Updated</th>
                <th className="p-2 font-semibold">Error</th>
                <th className="p-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobsLoading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-muted-foreground">
                    No jobs match.
                  </td>
                </tr>
              ) : (
                jobs.map((j) => (
                  <tr key={j.id} className="border-b border-border/60 align-top">
                    <td className="p-2 font-mono text-xs">{j.type}</td>
                    <td className="p-2">{j.status}</td>
                    <td className="p-2">
                      {j.attempts}/{j.maxAttempts}
                    </td>
                    <td className="whitespace-nowrap p-2 text-xs text-muted-foreground">
                      {new Date(j.updatedAt).toLocaleString()}
                    </td>
                    <td className="max-w-md p-2 font-mono text-xs text-rose-800 dark:text-rose-200">{j.lastError ?? "—"}</td>
                    <td className="p-2">
                      {j.status === "FAILED" ? (
                        <button
                          type="button"
                          disabled={retryJobId === j.id}
                          className="rounded-full border border-primary/50 px-2 py-1 text-xs font-semibold text-primary disabled:opacity-50"
                          onClick={() => void retryBackgroundJob(j.id)}
                        >
                          {retryJobId === j.id ? "…" : "Re-queue"}
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-sm font-semibold text-muted-foreground">Recent FAILED (snapshot)</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {h.backgroundJobs.recentFailed.length === 0 ? (
            <li className="text-muted-foreground">None.</li>
          ) : (
            h.backgroundJobs.recentFailed.map((j) => (
              <li key={j.id} className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2">
                <span className="font-mono text-xs">{j.type}</span> · {j.attempts}/{j.maxAttempts} attempts
                {j.lastError ? <span className="mt-1 block text-xs text-rose-800 dark:text-rose-200">{j.lastError}</span> : null}
              </li>
            ))
          )}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">AI job failures (7d)</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border/70">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
                <th className="p-2 font-semibold">Tool</th>
                <th className="p-2 font-semibold">Error</th>
                <th className="p-2 font-semibold">Updated</th>
                <th className="p-2 font-semibold">Drill-down</th>
              </tr>
            </thead>
            <tbody>
              {h.aiGenerationJobs.recentFailures.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-muted-foreground">
                    None in window.
                  </td>
                </tr>
              ) : (
                h.aiGenerationJobs.recentFailures.map((j) => (
                  <tr key={j.id} className="border-b border-border/60 align-top">
                    <td className="p-2 font-mono text-xs">{j.tool}</td>
                    <td className="max-w-lg p-2 font-mono text-xs">{j.error ?? "—"}</td>
                    <td className="whitespace-nowrap p-2 text-xs text-muted-foreground">
                      {new Date(j.updatedAt).toLocaleString()}
                    </td>
                    <td className="p-2">
                      <Link href={`/admin/generation`} className="text-primary underline">
                        Generation hub
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-border/70 bg-muted/15 px-4 py-4 text-sm">
        <p className="font-semibold text-[var(--theme-heading-text)]">JSON &amp; runbooks</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>
            <Link className="text-primary underline" href="/api/admin/diagnostics">
              /api/admin/diagnostics
            </Link>
          </li>
          <li>
            <Link className="text-primary underline" href="/api/admin/operations-health">
              /api/admin/operations-health
            </Link>
          </li>
          <li>
            <Link className="text-primary underline" href="/api/admin/operations-dashboard">
              /api/admin/operations-dashboard
            </Link>{" "}
            — content coverage / pathways
          </li>
        </ul>
      </section>
    </div>
  );
}
