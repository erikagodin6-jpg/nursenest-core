"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ContentAutomationLogCategory, ContentAutomationLogStatus } from "@prisma/client";
import {
  formatDisplayLabel,
  formatPrismaEnumLabel,
  humanizeAdminOperationalMessage,
} from "@/lib/ui/format-display-label";

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

function safeJson<T>(res: Response): Promise<T | null> {
  return res
    .json()
    .then((d) => d as T)
    .catch(() => null);
}

function safeDate(d: string | null): string {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleString();
}

function statusPillClass(status: ContentAutomationLogStatus): string {
  if (status === "SUCCEEDED") return "nn-badge-semantic-success border-transparent";
  if (status === "FAILED") return "nn-badge-semantic-danger border-transparent";
  if (status === "SKIPPED")
    return "rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]/60 px-2 py-0.5 text-[var(--semantic-text-secondary)]";
  return "nn-badge-semantic-warning border-transparent";
}

export function AdminAutomationLogsClient() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(50);

  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);

    try {
      const res = await fetch(`/api/admin/automation-logs?limit=${limit}&offset=${offset}`);
      const json = await safeJson<{ logs?: LogRow[]; total?: number; error?: string }>(res);

      if (!res.ok) {
        setErr(json?.error ?? `Failed (${res.status})`);
        return;
      }

      setLogs(json?.logs ?? []);
      setTotal(json?.total ?? 0);
    } catch {
      setErr("Network error loading logs");
    }
  }, [limit, offset]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onRetry(id: string) {
    setBusyId(id);
    setErr(null);

    try {
      const res = await fetch(`/api/admin/automation-logs/${encodeURIComponent(id)}/retry`, {
        method: "POST",
      });

      const json = await safeJson<{ error?: string }>(res);

      if (!res.ok) {
        setErr(json?.error ?? "Retry failed");
        return;
      }

      setMsg("Retry triggered");
      await load();
    } catch {
      setErr("Network error retrying");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      {msg ? <p className="text-sm text-[var(--semantic-success)]">{msg}</p> : null}
      {err ? <p className="text-sm text-[var(--semantic-danger)]">{err}</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
        <p>
          Showing <span className="font-semibold text-[var(--semantic-text-primary)]">{logs.length}</span> of{" "}
          <span className="font-semibold text-[var(--semantic-text-primary)]">{total.toLocaleString()}</span>{" "}
          automation events (newest first).
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="nn-btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold"
            disabled={offset === 0}
            onClick={() => setOffset((o) => Math.max(0, o - limit))}
          >
            Previous page
          </button>
          <button
            type="button"
            className="nn-btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold"
            disabled={offset + limit >= total}
            onClick={() => setOffset((o) => o + limit)}
          >
            Next page
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]/40 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Job Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Summary / Error</th>
              <th className="px-4 py-3">Article</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((row) => {
              const humanError = row.error ? humanizeAdminOperationalMessage(row.error) : "";
              const showTechnical =
                row.error && humanError.trim() !== String(row.error).trim();
              return (
                <tr key={row.id} className="border-b border-[var(--semantic-border-soft)]/80 last:border-0">
                  <td className="align-top px-4 py-3 text-[var(--semantic-text-primary)]">
                    <span className="font-medium leading-snug">{formatDisplayLabel(row.category)}</span>
                  </td>
                  <td className="align-top px-4 py-3">
                    <span className="font-medium text-[var(--semantic-text-primary)]" title={row.jobType}>
                      {formatDisplayLabel(row.jobType)}
                    </span>
                    {row.topic ? (
                      <p className="mt-1 line-clamp-2 text-xs text-[var(--semantic-text-muted)]">{row.topic}</p>
                    ) : null}
                  </td>
                  <td className="align-top px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusPillClass(row.status)}`}>
                      {formatPrismaEnumLabel(row.status)}
                    </span>
                  </td>
                  <td className="align-top px-4 py-3 tabular-nums text-[var(--semantic-text-secondary)]">
                    {safeDate(row.createdAt)}
                  </td>
                  <td className="max-w-md align-top px-4 py-3">
                    {row.summary ? (
                      <p className="text-[var(--semantic-text-secondary)]">{row.summary}</p>
                    ) : null}
                    {row.error ? (
                      <div className="mt-1 space-y-1">
                        <p className="text-sm font-medium text-[var(--semantic-danger)]">{humanError}</p>
                        {showTechnical ? (
                          <details className="text-xs text-[var(--semantic-text-muted)]">
                            <summary className="cursor-pointer font-semibold text-[var(--semantic-text-secondary)]">
                              Technical detail
                            </summary>
                            <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words rounded-md bg-[var(--semantic-panel-muted)]/50 p-2 font-mono text-[11px]">
                              {row.error}
                            </pre>
                          </details>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-[var(--semantic-text-muted)]">—</span>
                    )}
                  </td>
                  <td className="align-top px-4 py-3">
                    {row.blogPost ? (
                      <Link className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline" href={`/admin/blog?id=${row.blogPost.id}`}>
                        {row.blogPost.title || row.blogPost.slug}
                      </Link>
                    ) : (
                      <span className="text-[var(--semantic-text-muted)]">—</span>
                    )}
                  </td>
                  <td className="align-top px-4 py-3 text-right">
                    <button
                      type="button"
                      className="nn-btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold"
                      disabled={busyId === row.id}
                      onClick={() => onRetry(row.id)}
                    >
                      {busyId === row.id ? "Retrying…" : "Retry"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
