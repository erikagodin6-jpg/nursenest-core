"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Severity = "high" | "medium" | "low";

type QueueItem = {
  questionId: string;
  exam: string;
  topic: string | null;
  topicCode: string | null;
  severity: Severity;
  rationaleCompleteness: "full" | "partial" | "thin";
  missingKeyTakeaway: boolean;
  issues: string[];
  stemPreview: string;
  updatedAt: string;
  editHref: string;
};

type QueuePayload = {
  items: QueueItem[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  severity: Severity | null;
};

export function QuestionQualityQueueTable() {
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<QueuePayload | null>(null);
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => {
    const qs = new URLSearchParams({ page: String(page), pageSize: "15" });
    if (severity !== "all") qs.set("severity", severity);
    return qs.toString();
  }, [page, severity]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetch(`/api/admin/question-quality-queue?${query}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setData(json as QueuePayload);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <section className="mt-8 nn-card p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Question quality queue</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Actionable editorial queue from question-quality signals (takeaway/rationale/structure duplication).
          </p>
        </div>
        <label className="text-xs text-muted-foreground">
          Severity
          <select
            className="ml-2 rounded border border-border bg-background px-2 py-1 text-sm"
            value={severity}
            onChange={(e) => {
              const next = e.target.value as Severity | "all";
              setSeverity(next);
              setPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
      </div>

      <div className="mt-4 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs text-muted-foreground">
            <tr>
              <th className="py-2 pr-2">Priority</th>
              <th className="py-2 pr-2">Topic</th>
              <th className="py-2 pr-2">Issues</th>
              <th className="py-2 pr-2">Question</th>
              <th className="py-2 pr-2">Updated</th>
              <th className="py-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {(data?.items ?? []).map((item) => (
              <tr key={item.questionId} className="border-b border-border/50 align-top">
                <td className="py-2 pr-2">
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs font-semibold uppercase">
                    {item.severity}
                  </span>
                </td>
                <td className="py-2 pr-2">
                  <p>{item.topic ?? "Unmapped topic"}</p>
                  <p className="text-xs text-muted-foreground">{item.topicCode ?? "no topicCode"}</p>
                </td>
                <td className="py-2 pr-2 text-xs text-muted-foreground">{item.issues.join(", ")}</td>
                <td className="py-2 pr-2">{item.stemPreview}</td>
                <td className="py-2 pr-2 text-xs text-muted-foreground">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </td>
                <td className="py-2">
                  <Link href={item.editHref} className="text-primary underline">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
            {!loading && (data?.items.length ?? 0) === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-sm text-muted-foreground">
                  No issues found for this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <p>{loading ? "Loading queue…" : `Showing ${(data?.items.length ?? 0)} of ${data?.total ?? 0}`}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded border border-border px-2 py-1 disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span>
            Page {data?.page ?? page}/{data?.pageCount ?? 1}
          </span>
          <button
            type="button"
            className="rounded border border-border px-2 py-1 disabled:opacity-40"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= (data?.pageCount ?? 1)}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
