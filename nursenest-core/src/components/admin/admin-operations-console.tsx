"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import type { AdminDiagnostics } from "@/lib/admin/load-admin-diagnostics";
import type { AdminOperationsHealth } from "@/lib/admin/load-admin-operations-health";
import { JobStatus } from "@prisma/client";

type BgJobRow = {
  id: string;
  type: string;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  lastError: string | null;
  scheduledFor: string;
  createdAt: string;
  updatedAt: string;
};

function toneFor(ok: boolean, warn?: boolean) {
  if (warn) return "border-amber-500/40 bg-amber-500/10";
  return ok ? "border-emerald-500/35 bg-emerald-500/10" : "border-rose-500/40 bg-rose-500/10";
}

function Card({
  title,
  subtitle,
  ok,
  warn,
  children,
}: {
  title: string;
  subtitle?: string;
  ok: boolean;
  warn?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`nn-card border p-4 ${toneFor(ok, warn)}`}>
      <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{title}</h3>
      {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
      {children ? <div className="mt-3 space-y-1 text-sm">{children}</div> : null}
    </div>
  );
}

export function AdminOperationsConsole({
  diagnostics,
  initialHealth,
}: {
  diagnostics: AdminDiagnostics;
  initialHealth: AdminOperationsHealth;
}) {
  const [health, setHealth] = useState(initialHealth);
  const [busy, setBusy] = useState(false);
  const [jobs, setJobs] = useState<BgJobRow[] | null>(null);
  const [jobErr, setJobErr] = useState<string | null>(null);
  const [retryBusy, setRetryBusy] = useState<string | null>(null);

  const refreshHealth = useCallback(async () => {
    setBusy(true);
    setJobErr(null);
    try {
      const res = await fetch("/api/admin/operations-health", { cache: "no-store" });
      const json = (await res.json()) as { ok?: boolean; health?: AdminOperationsHealth; error?: string };
      if (!res.ok || !json.ok || !json.health) {
        setJobErr(json.error ?? "Health refresh failed");
        return;
      }
      setHealth(json.health);
      const jr = await fetch("/api/admin/jobs?take=40&status=FAILED", { cache: "no-store" });
      const jj = (await jr.json()) as { jobs?: BgJobRow[] };
      setJobs(jj.jobs ?? []);
    } finally {
      setBusy(false);
    }
  }, []);

  const onRetryJob = useCallback(async (id: string) => {
    setRetryBusy(id);
    setJobErr(null);
    try {
      const res = await fetch(`/api/admin/jobs/${id}/retry`, { method: "POST" });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setJobErr(json.error ?? "Retry failed");
        return;
      }
      await refreshHealth();
    } finally {
      setRetryBusy(null);
    }
  }, [refreshHealth]);

  const dbOk = diagnostics.dbHealth.status === "ok";
  const h = health;
  const pending = h.backgroundJobs.pendingReady;
  const failedBg = h.backgroundJobs.byStatus.FAILED ?? 0;
  const blogGenFails = h.contentAutomation.failedByCategory
    .filter((c) => c.category === "BLOG_AI_SIMPLE" || c.category === "BLOG_AI_BATCH_ITEM")
    .reduce((a, c) => a + c.count, 0);
  const lessonQFails =
    h.aiGeneration.failedByTool.find((t) => t.tool === "ADMIN_LESSON_BATCH")?.count ?? 0;
  const examQFails = h.aiGeneration.failedByTool.find((t) => t.tool === "EXAM_QUESTION_BATCH")?.count ?? 0;
  const flashFails = h.aiGeneration.failedByTool.find((t) => t.tool === "FLASHCARD_BATCH")?.count ?? 0;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Updated {new Date(h.generatedAt).toLocaleString()} ·{" "}
          <button
            type="button"
            disabled={busy}
            className="font-semibold text-primary underline disabled:opacity-50"
            onClick={() => void refreshHealth()}
          >
            Refresh health &amp; failed jobs
          </button>
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <Link className="rounded-md border border-border px-2 py-1 hover:bg-muted" href="/admin/automation-logs">
            Full automation logs
          </Link>
          <Link className="rounded-md border border-border px-2 py-1 hover:bg-muted" href="/admin/diagnostics">
            Diagnostics dashboard
          </Link>
          <Link className="rounded-md border border-border px-2 py-1 hover:bg-muted" href="/admin/generation">
            Generation hub
          </Link>
          <Link className="rounded-md border border-border px-2 py-1 hover:bg-muted" href="/admin/ai/review">
            AI review queue
          </Link>
        </div>
      </div>

      {h.dataNotes.map((note) => (
        <p key={note.slice(0, 24)} className="text-xs text-muted-foreground">
          {note}
        </p>
      ))}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-[var(--theme-heading-text)]">System status</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Database"
            ok={dbOk}
            subtitle={diagnostics.dbHealth.latencyMs != null ? `${diagnostics.dbHealth.latencyMs}ms probe` : undefined}
          >
            <p>{diagnostics.dbHealth.status}</p>
            {diagnostics.dbHealth.error ? (
              <p className="text-xs text-rose-700 dark:text-rose-300">{diagnostics.dbHealth.error}</p>
            ) : null}
          </Card>
          <Card title="Safe mode" ok={!h.safeMode} warn={h.safeMode} subtitle="Reduced writes / metrics when on">
            <p>{h.safeMode ? "ON" : "Off"}</p>
          </Card>
          <Card
            title="HTTP probes"
            ok={
              !diagnostics.apiHealth.probed ||
              (diagnostics.apiHealth.liveness.ok && diagnostics.apiHealth.readiness.ok)
            }
            subtitle={diagnostics.apiHealth.baseUrl ?? "No public base URL"}
          >
            {diagnostics.apiHealth.probed ? (
              <>
                <p>
                  Liveness {diagnostics.apiHealth.liveness.ok ? "ok" : "fail"}{" "}
                  {diagnostics.apiHealth.liveness.status ? `(${diagnostics.apiHealth.liveness.status})` : ""}
                </p>
                <p>
                  Readiness {diagnostics.apiHealth.readiness.ok ? "ok" : "fail"}{" "}
                  {diagnostics.apiHealth.readiness.status ? `(${diagnostics.apiHealth.readiness.status})` : ""}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">Skipped (no URL)</p>
            )}
          </Card>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-[var(--theme-heading-text)]">Automation &amp; generation</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Background job queue"
            ok={pending < 50 && failedBg < 10}
            warn={pending >= 50 || failedBg >= 10}
            subtitle="Cron worker (`processPendingJobs`)"
          >
            <p>
              Pending (ready): <strong>{pending}</strong> · Future: {h.backgroundJobs.pendingScheduledFuture} · Running:{" "}
              {h.backgroundJobs.running}
            </p>
            <p className="text-xs text-muted-foreground">
              Failed (all time in DB): {failedBg} · See table below for retry.
            </p>
          </Card>
          <Card
            title="Blog / content automation logs"
            ok={h.contentAutomation.recentFailures.length === 0}
            warn={h.contentAutomation.recentFailures.length > 0}
            subtitle={`Failures in last ${h.windows.automationLogHours}h by category (below)`}
          >
            <p>
              Link-check warnings: <strong>{h.contentAutomation.linkCheckWarnings}</strong> · Publish pipeline failures:{" "}
              {h.contentAutomation.publishFailures}
            </p>
            <p className="text-xs text-muted-foreground">Blog generation failures (AI simple + batch): {blogGenFails}</p>
          </Card>
          <Card
            title="AI generation jobs"
            ok={h.aiGeneration.running <= 3 && h.aiGeneration.recentFailures.length === 0}
            warn={h.aiGeneration.recentFailures.length > 0 || h.aiGeneration.running > 5}
            subtitle={`Failed by tool · last ${h.windows.aiJobHours}h`}
          >
            <p>
              Running: <strong>{h.aiGeneration.running}</strong>
            </p>
            <p className="text-xs">
              Lessons: {lessonQFails} · Questions: {examQFails} · Flashcards: {flashFails}
            </p>
          </Card>
          <Card
            title="Lesson &amp; question drafts (review)"
            ok={
              h.draftReview.questionPending + h.draftReview.lessonPending < 200 &&
              h.draftReview.questionRejected + h.draftReview.lessonRejected < 50
            }
            subtitle="Validation / review backlog — not necessarily errors"
          >
            <p>
              Questions pending: {h.draftReview.questionPending} · rejected: {h.draftReview.questionRejected}
            </p>
            <p>
              Lessons pending: {h.draftReview.lessonPending} · rejected: {h.draftReview.lessonRejected}
            </p>
            <p>
              Flashcards pending: {h.draftReview.flashcardPending} · rejected: {h.draftReview.flashcardRejected}
            </p>
          </Card>
          <Card
            title="Publish &amp; schedule"
            ok={h.blogPublishing.postsFailed === 0 && h.blogPublishing.scheduleItemsOverdue === 0}
            warn={h.blogPublishing.scheduleItemsOverdue > 0 || h.blogPublishing.postsFailed > 0}
          >
            <p>Blog posts FAILED: {h.blogPublishing.postsFailed}</p>
            <p>Batch items failed ({h.windows.automationLogHours}h): {h.blogPublishing.draftBatchItemsFailedWindow}</p>
            <p>
              Schedule failed: {h.blogPublishing.scheduleItemsFailed} · Overdue pending:{" "}
              {h.blogPublishing.scheduleItemsOverdue}
            </p>
            <Link href="/admin/blog/scheduler" className="text-xs font-semibold text-primary underline">
              Scheduler →
            </Link>
          </Card>
          <Card
            title="Subscriptions / Stripe"
            ok={h.subscriptionsBilling.pastDue === 0}
            warn={h.subscriptionsBilling.pastDue > 0}
            subtitle="DB subscription rows + webhook dedupe volume (not MRR)"
          >
            <p>
              PAST_DUE: <strong>{h.subscriptionsBilling.pastDue}</strong> · GRACE: {h.subscriptionsBilling.grace}
            </p>
            <p className="text-xs text-muted-foreground">
              Stripe webhook events (24h, deduped): {h.subscriptionsBilling.stripeWebhookEvents24h}
            </p>
            <Link href="/admin/analytics/subscriptions" className="text-xs font-semibold text-primary underline">
              Subscription analytics →
            </Link>
          </Card>
        </div>
      </section>

      <section className="nn-card border border-border/70 p-4">
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">Automation failures by category</h2>
        <p className="mt-1 text-xs text-muted-foreground">Window: last {h.windows.automationLogHours} hours</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-3">Category</th>
                <th className="py-2">Failures</th>
              </tr>
            </thead>
            <tbody>
              {h.contentAutomation.failedByCategory.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 text-muted-foreground">
                    No failures in window.
                  </td>
                </tr>
              ) : (
                h.contentAutomation.failedByCategory.map((row) => (
                  <tr key={row.category} className="border-b border-border/60">
                    <td className="py-2 pr-3 font-mono text-xs">{row.category}</td>
                    <td className="py-2">{row.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Link
          className="mt-3 inline-block text-xs font-semibold text-primary underline"
          href={`/admin/automation-logs?status=FAILED&hours=${h.windows.automationLogHours}`}
        >
          Open filtered automation logs →
        </Link>
      </section>

      <section className="nn-card border border-border/70 p-4">
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">Recent content automation failures</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-2">When</th>
                <th className="py-2 pr-2">Category</th>
                <th className="py-2 pr-2">Job</th>
                <th className="py-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {h.contentAutomation.recentFailures.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-muted-foreground">
                    None in window.
                  </td>
                </tr>
              ) : (
                h.contentAutomation.recentFailures.map((row) => (
                  <tr key={row.id} className="border-b border-border/60 align-top">
                    <td className="whitespace-nowrap py-2 pr-2 text-xs text-muted-foreground">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-2 font-mono text-xs">{row.category}</td>
                    <td className="py-2 pr-2">{row.jobType}</td>
                    <td className="max-w-md py-2 font-mono text-xs text-rose-800 dark:text-rose-200">
                      {(row.error ?? row.summary ?? "—").slice(0, 400)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="nn-card border border-border/70 p-4">
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">AI generation job failures</h2>
        <p className="mt-1 text-xs text-muted-foreground">Last {h.windows.aiJobHours}h · tool = pipeline id</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-2">When</th>
                <th className="py-2 pr-2">Tool</th>
                <th className="py-2">Error</th>
                <th className="py-2 pl-2">Drill-down</th>
              </tr>
            </thead>
            <tbody>
              {h.aiGeneration.recentFailures.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-muted-foreground">
                    None in window.
                  </td>
                </tr>
              ) : (
                h.aiGeneration.recentFailures.map((row) => (
                  <tr key={row.id} className="border-b border-border/60 align-top">
                    <td className="whitespace-nowrap py-2 pr-2 text-xs text-muted-foreground">
                      {new Date(row.updatedAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-2 font-mono text-xs">{row.tool}</td>
                    <td className="max-w-md py-2 font-mono text-xs">{(row.error ?? "—").slice(0, 400)}</td>
                    <td className="py-2 pl-2 text-xs">
                      <code className="mr-2 rounded bg-muted px-1">{row.id}</code>
                      {row.tool === "ADMIN_LESSON_BATCH" ? (
                        <Link className="text-primary underline" href="/admin/lessons/generate-batch">
                          Lesson batch UI
                        </Link>
                      ) : row.tool === "EXAM_QUESTION_BATCH" ? (
                        <Link className="text-primary underline" href="/admin/ai/exam-questions/batch">
                          Question batch UI
                        </Link>
                      ) : row.tool === "FLASHCARD_BATCH" ? (
                        <Link className="text-primary underline" href="/admin/ai/flashcards">
                          Flashcard AI
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="nn-card border border-border/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">Failed background jobs</h2>
            <p className="text-xs text-muted-foreground">Re-queue sends the row back to PENDING for the cron worker.</p>
          </div>
          <button
            type="button"
            className="rounded-md border border-border px-2 py-1 text-xs font-semibold"
            onClick={() => void refreshHealth()}
          >
            Load / refresh
          </button>
        </div>
        {jobErr ? <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{jobErr}</p> : null}
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-2">Type</th>
                <th className="py-2 pr-2">Status</th>
                <th className="py-2 pr-2">Attempts</th>
                <th className="py-2 pr-2">Last error</th>
                <th className="py-2">Retry</th>
              </tr>
            </thead>
            <tbody>
              {(jobs ?? h.backgroundJobs.recentFailed).length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-muted-foreground">
                    No failed jobs loaded. Click &quot;Load / refresh&quot; or use Refresh above.
                  </td>
                </tr>
              ) : (
                (jobs ?? h.backgroundJobs.recentFailed).map((row) => (
                  <tr key={row.id} className="border-b border-border/60 align-top">
                    <td className="py-2 pr-2 font-mono text-xs">{row.type}</td>
                    <td className="py-2 pr-2">{row.status}</td>
                    <td className="py-2 pr-2">
                      {row.attempts}/{row.maxAttempts}
                    </td>
                    <td className="max-w-lg py-2 font-mono text-xs">{(row.lastError ?? "—").slice(0, 320)}</td>
                    <td className="py-2">
                      <button
                        type="button"
                        disabled={retryBusy === row.id}
                        className="rounded-full border border-primary/50 px-2 py-0.5 text-xs font-semibold text-primary disabled:opacity-50"
                        onClick={() => void onRetryJob(row.id)}
                      >
                        {retryBusy === row.id ? "…" : "Re-queue"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="nn-card border border-border/70 p-4">
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">APIs &amp; runbooks</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>
            <Link className="text-primary underline" href="/api/admin/operations-dashboard">
              /api/admin/operations-dashboard
            </Link>{" "}
            — coverage / pathway / question snapshots
          </li>
          <li>
            <Link className="text-primary underline" href="/api/admin/diagnostics">
              /api/admin/diagnostics
            </Link>{" "}
            — JSON diagnostics
          </li>
          <li>
            <Link className="text-primary underline" href="/api/admin/operations-health">
              /api/admin/operations-health
            </Link>{" "}
            — this page&apos;s aggregate JSON
          </li>
        </ul>
      </section>
    </div>
  );
}
