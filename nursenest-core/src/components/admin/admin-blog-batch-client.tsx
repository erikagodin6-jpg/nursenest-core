"use client";

import { useRef, useState } from "react";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchBatchChunk(
  cursorArg: number,
  signal: AbortSignal,
): Promise<{ res: Response; json: Record<string, unknown> }> {
  const res = await fetch("/api/admin/blog/batch-chunk", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cursor: cursorArg, limit: 5, dryRun: false }),
    signal,
  });
  let json: Record<string, unknown> = {};
  try {
    json = (await res.json()) as Record<string, unknown>;
  } catch {
    json = {};
  }
  return { res, json };
}

/** Bounded wait for Retry-After / JSON hint — avoids tight 429 loops. */
async function backoffAfter429(res: Response, json: Record<string, unknown>, attempt: number): Promise<void> {
  const headerSec = Number.parseInt(res.headers.get("retry-after") ?? "", 10);
  const bodySec = typeof json.retryAfterSec === "number" ? json.retryAfterSec : NaN;
  const base = Number.isFinite(headerSec) && headerSec > 0 ? headerSec : Number.isFinite(bodySec) && bodySec > 0 ? bodySec : 3;
  const capped = Math.min(120, base + attempt * 2);
  const jitter = Math.floor(Math.random() * 350);
  await sleep(capped * 1000 + jitter);
}

export function AdminBlogBatchClient() {
  const [cursor, setCursor] = useState(0);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function runChunk() {
    if (busy) return;
    const ac = new AbortController();
    abortRef.current = ac;
    setBusy(true);
    try {
      let res: Response | null = null;
      let json: Record<string, unknown> = {};
      for (let attempt = 0; attempt <= 3; attempt += 1) {
        try {
          const out = await fetchBatchChunk(cursor, ac.signal);
          res = out.res;
          json = out.json;
        } catch (e) {
          if (e instanceof DOMException && e.name === "AbortError") {
            setLog((l) => [...l, "Cancelled."]);
            return;
          }
          throw e;
        }
        if (res.ok) break;
        if (res.status === 429 && attempt < 3) {
          setLog((l) => [
            ...l,
            `HTTP 429 (rate limit) — retry ${attempt + 1}/3 after backoff (${(json as { scope?: string }).scope ?? "unknown"})`,
          ]);
          await backoffAfter429(res, json, attempt + 1);
          continue;
        }
        const msg =
          typeof json.error === "string"
            ? json.error
            : `HTTP ${res.status}${(json as { scope?: string }).scope ? ` (${(json as { scope: string }).scope})` : ""}`;
        setLog((l) => [...l, msg]);
        return;
      }
      if (!res?.ok) return;
      const parsed = json as {
        ok?: boolean;
        done?: boolean;
        cursor?: number;
        created?: string[];
        skipped?: string[];
        errors?: string[];
        totalAvailable?: number;
      };
      setTotal(parsed.totalAvailable ?? null);
      setCursor(parsed.cursor ?? cursor);
      setDone(Boolean(parsed.done));
      const lines = [
        `Processed cursor→${parsed.cursor}: created ${parsed.created?.length ?? 0}, skipped ${parsed.skipped?.length ?? 0}`,
        ...(parsed.created?.length ? [`Created: ${parsed.created.join(", ")}`] : []),
        ...(parsed.skipped?.length ? [`Skipped (exists): ${parsed.skipped.join(", ")}`] : []),
        ...(parsed.errors?.length ? parsed.errors : []),
      ];
      setLog((l) => [...l, ...lines]);
    } finally {
      if (abortRef.current === ac) abortRef.current = null;
      setBusy(false);
    }
  }

  async function runAll() {
    if (busy) return;
    const ac = new AbortController();
    abortRef.current = ac;
    setLog([]);
    setDone(false);
    let c = 0;
    let finished = false;
    setBusy(true);
    try {
      while (!finished) {
        let res: Response | null = null;
        let json: {
          cursor?: number;
          done?: boolean;
          created?: string[];
          skipped?: string[];
          totalAvailable?: number;
          errors?: string[];
        } = {};
        for (let attempt = 0; attempt <= 3; attempt += 1) {
          try {
            const out = await fetchBatchChunk(c, ac.signal);
            res = out.res;
            json = out.json as typeof json;
          } catch (e) {
            if (e instanceof DOMException && e.name === "AbortError") {
              setLog((l) => [...l, "Run all cancelled."]);
              setDone(false);
              return;
            }
            throw e;
          }
          if (res.ok) break;
          if (res.status === 429 && attempt < 3) {
            setLog((l) => [
              ...l,
              `cursor ${c}: HTTP 429 — retry ${attempt + 1}/3 (${(json as { scope?: string }).scope ?? "rate limit"})`,
            ]);
            await backoffAfter429(res, json as Record<string, unknown>, attempt + 1);
            continue;
          }
          break;
        }
        if (!res?.ok) {
          setLog((l) => [
            ...l,
            typeof (json as { error?: string }).error === "string"
              ? (json as { error: string }).error
              : `Stopped: HTTP ${res?.status ?? "error"}`,
          ]);
          setDone(false);
          return;
        }
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
        await sleep(150);
      }
      setDone(true);
    } finally {
      if (abortRef.current === ac) abortRef.current = null;
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
            if (busy) return;
            setCursor(0);
            setLog([]);
            setDone(false);
          }}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
        >
          Reset cursor
        </button>
        {busy ? (
          <button
            type="button"
            onClick={() => {
              abortRef.current?.abort();
            }}
            className="rounded-full border border-rose-500/50 px-4 py-2 text-sm font-semibold text-rose-700 dark:text-rose-300"
          >
            Cancel
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Current cursor: {cursor}</p>
      {done ? <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">Batch complete.</p> : null}
      <pre className="mt-4 max-h-64 overflow-auto rounded-lg bg-muted/40 p-3 text-xs">{log.join("\n") || "N/A"}</pre>
    </div>
  );
}
