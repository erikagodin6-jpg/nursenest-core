"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatAdminRateLimitMessageFromJson } from "@/lib/admin/format-admin-rate-limit-message";
import { DRAFT_BATCH_MAX_ITEMS_PER_PROCESS } from "@/lib/blog/blog-draft-generation-batch-constants";

function newIdempotencyKey(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {}
  return `idem_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type JobPhase = "queued" | "running" | "completed" | "cancelled" | "partial";
const JOB_POLL_GATEWAY_SOFT =
  "Could not read job status (gateway or timeout). Click Refresh — processing may still be running.";

function isAuthOrNotFoundStatus(status: number): boolean {
  return status === 401 || status === 403 || status === 404;
}

function isCloudflareGatewayStatus(status: number): boolean {
  return status === 524 || (status >= 520 && status < 530);
}

function shouldSoftenUnreadableJobPoll(res: Response, json: unknown): boolean {
  if (json != null) return false;
  if (isAuthOrNotFoundStatus(res.status)) return false;
  if (res.status === 429) return false;
  if (res.status === 0 || res.status >= 500 || res.status === 408) return true;
  if (isCloudflareGatewayStatus(res.status)) return true;
  return true;
}


type GenerationJobApiPayload = {
  id: string;
  phase: JobPhase;
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
    try {
      const res = await fetch(`/api/admin/blog/generation-jobs/${encodeURIComponent(id)}?statusPoll=1`, {
        credentials: "include",
        cache: "no-store",
      });

      const json = await safeJson<{
        job?: GenerationJobApiPayload;
        error?: string;
        code?: string;
        message?: string;
      }>(res);

      if (!json) {
        if (shouldSoftenUnreadableJobPoll(res, json)) {
          setMsg(JOB_POLL_GATEWAY_SOFT);
          setErr(null);
          return;
        }
        setErr(`Failed to load job (${res.status})`);
        return;
      }

      if (json.code === "JOB_RESPONSE_TIMEOUT") {
        setMsg(JOB_POLL_GATEWAY_SOFT);
        setErr(null);
        return;
      }

      if (!res.ok || !json.job) {
        if (
          !isAuthOrNotFoundStatus(res.status) &&
          (res.status >= 500 || res.status === 503 || res.status === 504 || res.status === 502 || isCloudflareGatewayStatus(res.status))
        ) {
          setMsg(JOB_POLL_GATEWAY_SOFT);
          setErr(null);
          return;
        }
        setErr(json.error ?? `Failed to load job (${res.status})`);
        return;
      }

      setJob(json.job);
      setErr(null);
    } catch {
      setErr("Network error loading job.");
    }
  }, []);

  const shouldPoll = useMemo(() => {
    if (!jobId) return false;
    if (!job) return true;
    if (!job.phase) return false;

    return job.phase === "queued" || job.phase === "running";
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

      const json = await safeJson<{
        jobId?: string;
        job?: GenerationJobApiPayload;
        status?: JobPhase;
        message?: string;
        error?: string;
      }>(res);

      if (!res.ok || !json) {
        setErr(json?.error ?? "Failed to create job");
        return;
      }

      const id = json.jobId ?? json.job?.id;
      if (!id) {
        setErr(json.error ?? "Failed to create job");
        return;
      }

      setJobId(id);
      if (json.job) setJob(json.job);
      else {
        setJob(null);
        void loadJob(id);
      }
      setIdempotencyKey(newIdempotencyKey());
      setMsg(json.message ?? "Job queued successfully.");
    } catch {
      setErr("Network error creating job.");
    } finally {
      setBusy(false);
    }
  }

  async function nudgeTick() {
    if (!jobId) return;

    setBusy(true);
    setErr(null);

    try {
      const res = await fetch(`/api/admin/blog/generation-jobs/${encodeURIComponent(jobId)}/tick`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirm: true,
          limit: DRAFT_BATCH_MAX_ITEMS_PER_PROCESS,
        }),
      });

      const json = await safeJson<{ job?: GenerationJobApiPayload; error?: string }>(res);

      if (!res.ok) {
        setErr(json?.error ?? "Tick failed");
        return;
      }

      if (json?.job) {
        setJob(json.job);
      } else {
        await loadJob(jobId);
      }

      setMsg("Processing nudged.");
    } catch {
      setErr("Network error during tick.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-6">
      <h2 className="text-lg font-semibold">Batch shells</h2>

      {job && (
        <div className="mt-4 text-sm">
          <p>Phase: {job.phase}</p>
          <p>
            Progress: {job.completedItems}/{job.totalItems}
          </p>

          {job.lastProcessorError && (
            <p className="text-red-500">Error: {job.lastProcessorError}</p>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button disabled={busy} onClick={createShellJob}>
          Start job
        </button>

        <button disabled={!jobId || busy} onClick={nudgeTick}>
          Nudge
        </button>

        <button disabled={!jobId || busy} onClick={() => jobId && loadJob(jobId)}>
          Refresh
        </button>
      </div>

      {msg && <p className="mt-2 text-green-600">{msg}</p>}
      {err && <p className="mt-2 text-red-600">{err}</p>}
    </div>
  );
}
