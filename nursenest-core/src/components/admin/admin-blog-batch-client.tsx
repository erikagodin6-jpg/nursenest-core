"use client";

import { useState } from "react";

export function AdminBlogBatchClient() {
  const [cursor, setCursor] = useState(0);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [total, setTotal] = useState<number | null>(null);

  async function runChunk() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/blog/batch-chunk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cursor, limit: 5, dryRun: false }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        done?: boolean;
        cursor?: number;
        created?: string[];
        skipped?: string[];
        errors?: string[];
        totalAvailable?: number;
      };
      if (!res.ok) {
        setLog((l) => [...l, `HTTP ${res.status}`]);
        return;
      }
      setTotal(json.totalAvailable ?? null);
      setCursor(json.cursor ?? cursor);
      setDone(Boolean(json.done));
      const lines = [
        `Processed cursor→${json.cursor}: created ${json.created?.length ?? 0}, skipped ${json.skipped?.length ?? 0}`,
        ...(json.created?.length ? [`Created: ${json.created.join(", ")}`] : []),
        ...(json.skipped?.length ? [`Skipped (exists): ${json.skipped.join(", ")}`] : []),
        ...(json.errors?.length ? json.errors : []),
      ];
      setLog((l) => [...l, ...lines]);
    } finally {
      setBusy(false);
    }
  }

  async function runAll() {
    setLog([]);
    setDone(false);
    let c = 0;
    let finished = false;
    setBusy(true);
    try {
      while (!finished) {
        const res = await fetch("/api/admin/blog/batch-chunk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cursor: c, limit: 5, dryRun: false }),
        });
        const json = (await res.json()) as {
          cursor?: number;
          done?: boolean;
          created?: string[];
          skipped?: string[];
          totalAvailable?: number;
          errors?: string[];
        };
        if (!res.ok) break;
        setTotal(json.totalAvailable ?? null);
        c = json.cursor ?? c;
        setCursor(c);
        finished = Boolean(json.done);
        setLog((l) => [
          ...l,
          `cursor ${c}: +${json.created?.length ?? 0} created, +${json.skipped?.length ?? 0} skipped`,
          ...(json.errors ?? []),
        ]);
        if (finished) break;
      }
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-6">
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Batch shells (RN topic map)</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Creates DRAFT <code className="rounded bg-muted px-1">BlogPost</code> rows from{" "}
        <code className="rounded bg-muted px-1">master-topic-map.json</code> (same editorial pattern as{" "}
        <code className="rounded bg-muted px-1">scripts/blog-bulk-schedule.mjs</code>). Chunked API. Safe for serverless timeouts.
      </p>
      {total != null ? <p className="mt-2 text-sm">Total rows in map: {total}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void runChunk()}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          Process next 5
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void runAll()}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          Run all chunks
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setCursor(0);
            setLog([]);
            setDone(false);
          }}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
        >
          Reset cursor
        </button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Current cursor: {cursor}</p>
      {done ? <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">Batch complete.</p> : null}
      <pre className="mt-4 max-h-64 overflow-auto rounded-lg bg-muted/40 p-3 text-xs">{log.join("\n") || "N/A"}</pre>
    </div>
  );
}
