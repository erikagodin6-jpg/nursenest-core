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

export function AdminAutomationLogsClient() {
  const searchParams = useSearchParams();

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
    } catch (e) {
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
      {msg && <p className="text-sm text-emerald-600">{msg}</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Type</th>
            <th>Status</th>
            <th>Created</th>
            <th>Error</th>
            <th>Article</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {logs.map((row) => (
            <tr key={row.id}>
              <td>{row.jobType}</td>

              <td>{row.status}</td>

              <td>{safeDate(row.createdAt)}</td>

              <td className="text-red-500">{row.error ?? "—"}</td>

              <td>
                {row.blogPost ? (
                  <Link href={`/admin/blog/control-panel?id=${row.blogPost.id}`}>
                    {row.blogPost.slug}
                  </Link>
                ) : (
                  "—"
                )}
              </td>

              <td>
                <button disabled={busyId === row.id} onClick={() => onRetry(row.id)}>
                  Retry
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}