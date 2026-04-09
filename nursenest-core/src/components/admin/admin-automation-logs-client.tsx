"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ContentAutomationLogCategory, ContentAutomationLogStatus } from "@prisma/client";

type LogRow = {
  id: string;
  category: ContentAutomationLogCategory;
  jobType: string;
  status: ContentAutomationLogStatus;
  topic: string | null;
  summary: string | null;
  error: string | null;
  metadata: unknown;
  blogPostId: string | null;
  correlationId: string | null;
  sourceItemId: string | null;
  retryOfId: string | null;
  completedAt: string | null;
  createdAt: string;
  blogPost: { id: string; slug: string; title: string; postStatus: string } | null;
};

function statusClass(s: ContentAutomationLogStatus) {
  const base = "rounded-full px-2 py-0.5 text-xs font-semibold";
  switch (s) {
    case ContentAutomationLogStatus.SUCCEEDED:
      return `${base} bg-emerald-500/15 text-emerald-950 dark:text-emerald-100`;
    case ContentAutomationLogStatus.FAILED:
      return `${base} bg-rose-500/15 text-rose-950 dark:text-rose-100`;
    case ContentAutomationLogStatus.SKIPPED:
      return `${base} bg-zinc-500/15 text-zinc-800 dark:text-zinc-200`;
    case ContentAutomationLogStatus.WARNING:
      return `${base} bg-amber-500/20 text-amber-950 dark:text-amber-100`;
    default:
      return `${base} bg-muted text-foreground`;
  }
}

function canRetry(log: LogRow): boolean {
  if (log.category === ContentAutomationLogCategory.BLOG_AI_BATCH_ITEM && log.status === ContentAutomationLogStatus.FAILED) {
    return Boolean(log.sourceItemId && log.correlationId);
  }
  if (log.category === ContentAutomationLogCategory.BLOG_AI_SIMPLE && log.status === ContentAutomationLogStatus.FAILED) {
    return true;
  }
  return false;
}

export function AdminAutomationLogsClient() {
  const searchParams = useSearchParams();
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(50);
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchApplied, setSearchApplied] = useState<string>("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const c = searchParams.get("category") ?? "";
    const s = searchParams.get("status") ?? "";
    const h = searchParams.get("hours") ?? "";
    const q = searchParams.get("search") ?? "";
    setCategory(c);
    setStatus(s);
    setHours(h);
    setSearchInput(q);
    setSearchApplied(q.trim());
    setOffset(0);
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => setSearchApplied(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const load = useCallback(async () => {
    setErr(null);
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("offset", String(offset));
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (hours && Number(hours) > 0) params.set("hours", hours);
    if (searchApplied.length >= 2) params.set("search", searchApplied);
    const res = await fetch(`/api/admin/automation-logs?${params.toString()}`);
    const json = (await res.json()) as { ok?: boolean; logs?: LogRow[]; total?: number; error?: string };
    if (!res.ok) {
      setErr(json.error ?? "Failed to load logs");
      return;
    }
    setLogs(json.logs ?? []);
    setTotal(json.total ?? 0);
  }, [limit, offset, category, status, hours, searchApplied]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onRetry(id: string) {
    setBusyId(id);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/automation-logs/${id}/retry`, { method: "POST" });
      const json = (await res.json()) as { ok?: boolean; error?: string; process?: { processed?: number } };
      if (!res.ok) {
        setErr(json.error ?? "Retry failed");
        return;
      }
      setMsg(json.process ? `Processed ${json.process.processed ?? 0} batch item(s).` : "Retry completed.");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
        <label className="block space-y-1 text-sm">
          <span className="text-xs font-medium text-muted-foreground">Category</span>
          <select
            className="rounded-md border border-border px-2 py-1.5 text-sm"
            value={category}
            onChange={(e) => {
              setOffset(0);
              setCategory(e.target.value);
            }}
          >
            <option value="">All</option>
            {Object.values(ContentAutomationLogCategory).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-xs font-medium text-muted-foreground">Status</span>
          <select
            className="rounded-md border border-border px-2 py-1.5 text-sm"
            value={status}
            onChange={(e) => {
              setOffset(0);
              setStatus(e.target.value);
            }}
          >
            <option value="">All</option>
            {Object.values(ContentAutomationLogStatus).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-xs font-medium text-muted-foreground">Time window</span>
          <select
            className="rounded-md border border-border px-2 py-1.5 text-sm"
            value={hours}
            onChange={(e) => {
              setOffset(0);
              setHours(e.target.value);
            }}
          >
            <option value="">All time</option>
            <option value="24">Last 24h</option>
            <option value="168">Last 7d</option>
            <option value="720">Last 30d</option>
          </select>
        </label>
        <label className="block min-w-[200px] space-y-1 text-sm">
          <span className="text-xs font-medium text-muted-foreground">Search (error/summary/topic)</span>
          <input
            className="w-full rounded-md border border-border px-2 py-1.5 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Min 2 characters"
          />
        </label>
        <button
          type="button"
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium"
          onClick={() => void load()}
        >
          Refresh
        </button>
        <p className="text-xs text-muted-foreground sm:ml-auto">
          {total} total · showing {logs.length} (offset {offset})
        </p>
      </div>

      {msg ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{msg}</p> : null}
      {err ? <p className="text-sm text-rose-700 dark:text-rose-300">{err}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-border/70">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="p-3 font-semibold">Type</th>
              <th className="p-3 font-semibold">Topic</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Created</th>
              <th className="p-3 font-semibold">Completed</th>
              <th className="p-3 font-semibold">Error / detail</th>
              <th className="p-3 font-semibold">Article</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((row) => (
              <tr key={row.id} className="border-b border-border/60 align-top">
                <td className="p-3">
                  <div className="font-mono text-xs text-muted-foreground">{row.category}</div>
                  <div className="font-medium">{row.jobType}</div>
                  {row.summary ? <div className="mt-0.5 text-xs text-muted-foreground">{row.summary}</div> : null}
                </td>
                <td className="max-w-[200px] p-3 text-sm">{row.topic ?? "—"}</td>
                <td className="p-3">
                  <span className={statusClass(row.status)}>{row.status}</span>
                </td>
                <td className="whitespace-nowrap p-3 text-xs text-muted-foreground">
                  {new Date(row.createdAt).toLocaleString()}
                </td>
                <td className="whitespace-nowrap p-3 text-xs text-muted-foreground">
                  {row.completedAt ? new Date(row.completedAt).toLocaleString() : "—"}
                </td>
                <td className="max-w-[280px] p-3 font-mono text-xs break-words text-rose-800 dark:text-rose-200">
                  {row.error ?? "—"}
                </td>
                <td className="p-3">
                  {row.blogPost ? (
                    <Link
                      href={`/admin/blog/control-panel?id=${encodeURIComponent(row.blogPost.id)}`}
                      className="text-primary underline"
                    >
                      {row.blogPost.slug}
                    </Link>
                  ) : (
                    "—"
                  )}
                  {row.correlationId && row.category === ContentAutomationLogCategory.BLOG_AI_BATCH_ITEM ? (
                    <div className="mt-1">
                      <Link
                        href={`/admin/blog/draft-batch?batch=${encodeURIComponent(row.correlationId)}`}
                        className="text-xs text-primary underline"
                      >
                        Open batch
                      </Link>
                    </div>
                  ) : null}
                </td>
                <td className="p-3">
                  {canRetry(row) ? (
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      className="rounded-full border border-primary/50 px-3 py-1 text-xs font-semibold text-primary disabled:opacity-50"
                      onClick={() => void onRetry(row.id)}
                    >
                      {busyId === row.id ? "…" : "Retry"}
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground">
                  No logs yet. Generate drafts, run the batch queue, publish, or persist from the control panel to populate
                  this view.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={offset === 0}
          className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          onClick={() => setOffset((o) => Math.max(0, o - limit))}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={offset + logs.length >= total}
          className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          onClick={() => setOffset((o) => o + limit)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
