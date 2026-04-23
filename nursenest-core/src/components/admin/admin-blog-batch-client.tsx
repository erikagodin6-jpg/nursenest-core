"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatAdminRateLimitMessageFromJson } from "@/lib/admin/format-admin-rate-limit-message";
import { DRAFT_BATCH_MAX_ITEMS_PER_PROCESS } from "@/lib/blog/blog-draft-generation-batch-constants";

function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `idem_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

type JobPhase = "queued" | "running" | "completed" | "cancelled" | "partial";

type GenerationJobApiPayload = {
  id: string;
  phase: JobPhase;
  rnTopicMapShellJob: boolean;
  totalItems: number;
  completedItems: number;
  failedItems: number;
  skippedItems: number;
  pendingItems: number;
  generatingItems: number;
  lastProcessorError: string | null;
  processorStartedAt: string | null;
};

export function AdminBlogBatchClient() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<GenerationJobApiPayload | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey);

  const loadJob = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/blog/generation-jobs/${id}`, { credentials: "include", cache: "no-store" });
    let json: {
      ok?: boolean;
      job?: GenerationJobApiPayload;
      error?: string;
      message?: string;
      code?: string;
      details?: unknown;
    };
    try {
      json = (await res.json()) as typeof json;
    } catch {
      setErr(`Could not read job response (HTTP ${res.status}).`);
      return;
    }
    if (!res.ok || !json.job) {
      const fromBody =
        (typeof json.message === "string" && json.message.trim()) ||
        (typeof json.error === "string" && json.error.trim()) ||
        "";
      let detail = "";
      if (json.details != null) {
        try {
          detail = typeof json.details === "string" ? json.details : JSON.stringify(json.details);
        } catch {
          detail = "";
        }
      }
      const combined = [fromBody, detail].filter(Boolean).join(detail ? "\n" : "");
      setErr(
        res.status === 429
          ? formatAdminRateLimitMessageFromJson(json)
          : combined.trim() || `Request failed (HTTP ${res.status}).`,
      );
      return;
    }
    setJob(json.job);
    setErr(null);
  }, []);

  const shouldPoll = useMemo(() => {
    if (!jobId || !job) return false;
    if (job.phase === "queued" || job.phase === "running") return true;
    return job.pendingItems > 0 || job.generatingItems > 0;
  }, [jobId, job]);

  useEffect(() => {
    if (!jobId || !shouldPoll) return;
    const t = setInterval(() => {
      void loadJob(jobId);
    }, 3000);
    return () => clearInterval(t);
  }, [jobId, shouldPoll, loadJob]);

  async function createShellJob() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/blog/generation-jobs", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobKind: "rn_topic_map_shell",
          idempotencyKey,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        jobId?: string;
        job?: GenerationJobApiPayload;
        idempotentReplay?: boolean;
      };
      if (!res.ok) {
        setErr(res.status === 429 ? formatAdminRateLimitMessageFromJson(json) : (json.error ?? "Create failed"));
        return;
      }
      const id = json.jobId ?? json.job?.id;
      if (!id || !json.job) {
        setErr("Missing job id");
        return;
      }
      setJobId(id);
      setJob(json.job);
      if (!json.idempotentReplay) {
        setIdempotencyKey(newIdempotencyKey());
      }
      setMsg(
        json.idempotentReplay
          ? "Returned the same active job (duplicate submit within the idempotency window)."
          : "Server job queued. Progress is saved on the server — you can close this tab; platform cron keeps processing.",
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function nudgeTick() {
    if (!jobId) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/blog/generation-jobs/${jobId}/tick`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: DRAFT_BATCH_MAX_ITEMS_PER_PROCESS }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; job?: GenerationJobApiPayload };
      if (!res.ok) {
        setErr(
          res.status === 429
            ? formatAdminRateLimitMessageFromJson(json)
            : (json.error ?? "Tick failed"),
        );
        return;
      }
      if (json.job) setJob(json.job);
      else await loadJob(jobId);
      setMsg(`Nudged server processing (up to ${DRAFT_BATCH_MAX_ITEMS_PER_PROCESS} items).`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const terminal =
    job &&
    (job.phase === "completed" || job.phase === "partial" || job.phase === "cancelled") &&
    job.pendingItems === 0 &&
    job.generatingItems === 0;

  return (
    <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-6">
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Batch shells (RN topic map)</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Queues a single server job that creates DRAFT <code className="rounded bg-muted px-1">BlogPost</code> rows from{" "}
        <code className="rounded bg-muted px-1">master-topic-map.json</code> (same pattern as{" "}
        <code className="rounded bg-muted px-1">scripts/blog-bulk-schedule.mjs</code>). Processing runs on the server in
        small chunks (cron + optional nudge); this page only creates the job and polls status — it does not run a
        browser loop.
      </p>
      {job ? (
        <div className="mt-4 space-y-2 rounded-lg border border-border/60 bg-muted/20 p-4 text-sm">
          <p>
            <span className="font-medium text-foreground">Phase:</span> {job.phase}
          </p>
          <p>
            <span className="font-medium text-foreground">Progress:</span> {job.completedItems + job.failedItems + job.skippedItems} /{" "}
            {job.totalItems} touched — completed {job.completedItems}, failed {job.failedItems}, skipped {job.skippedItems},{" "}
            pending {job.pendingItems}
            {job.generatingItems ? `, in progress ${job.generatingItems}` : ""}
          </p>
          {job.lastProcessorError ? (
            <p className="text-rose-700 dark:text-rose-300">
              <span className="font-medium">Last processor error:</span> {job.lastProcessorError}
            </p>
          ) : null}
          {job.processorStartedAt ? (
            <p className="text-xs text-muted-foreground">Processor started at: {job.processorStartedAt}</p>
          ) : null}
          <p className="text-xs text-muted-foreground">Job id: {job.id}</p>
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void createShellJob()}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          Start server job
        </button>
        <button
          type="button"
          disabled={busy || !jobId}
          onClick={() => void nudgeTick()}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          Nudge processing
        </button>
        <button
          type="button"
          disabled={busy || !jobId}
          onClick={() => void loadJob(jobId!)}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          Refresh status
        </button>
      </div>
      {msg ? <p className="mt-2 text-sm text-muted-foreground">{msg}</p> : null}
      {err ? <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{err}</p> : null}
      {terminal ? (
        <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">Job finished (see counts above).</p>
      ) : null}
    </div>
  );
}
