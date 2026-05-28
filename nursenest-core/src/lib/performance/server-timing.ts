/**
 * Server-Timing Header Builder
 *
 * Converts RoutePerformanceProfiler output into a standard `Server-Timing` response header.
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing
 *
 * Enables browser DevTools Network tab to display:
 *   - db;dur=32  (total database time)
 *   - render;dur=180  (server render time)
 *   - total;dur=380  (end-to-end request time)
 *   - cache;desc="hit"  (cache disposition)
 *   - queries;desc="3"  (query count)
 *
 * Integration points:
 *   - API routes: call `appendServerTimingToResponse()` in route handlers
 *   - Next.js RSC pages: set via `headers()` from 'next/headers'
 *   - The profiler's complete() return value supplies the metric data
 *
 * Only emits in non-production environments by default (configurable via NN_SERVER_TIMING=1).
 * Never expose internal timing in production unless explicitly opted in.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ServerTimingEntry = {
  /** Metric name (no spaces or semicolons). */
  name: string;
  /** Duration in ms (optional — omit for qualitative entries). */
  durationMs?: number;
  /** Human-readable description (optional). */
  desc?: string;
};

export type ServerTimingInput = {
  totalMs?: number;
  dbMs?: number;
  dbQueryCount?: number;
  renderMs?: number;
  memoryDeltaMb?: number;
  cacheDisposition?: "hit" | "miss" | "stale" | "bypass" | "none";
  /** Extra entries for custom segments. */
  segments?: Array<{ name: string; durationMs: number }>;
};

// ─── Feature flag ─────────────────────────────────────────────────────────────

/**
 * Returns true if Server-Timing headers should be emitted.
 * Enabled in development always; in production only when `NN_SERVER_TIMING=1`.
 */
export function isServerTimingEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.NN_SERVER_TIMING === "1";
}

// ─── Header builder ───────────────────────────────────────────────────────────

/** Sanitize an entry name: remove chars not allowed in Server-Timing token. */
function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-]/g, "_").slice(0, 32);
}

/**
 * Build a `Server-Timing` header value from an array of entries.
 *
 * Output: `total;dur=380, db;dur=32;desc="3 queries", cache;desc="hit"`
 */
export function buildServerTimingValue(entries: ServerTimingEntry[]): string {
  return entries
    .filter((e) => e.durationMs != null || e.desc != null)
    .map((e) => {
      const name = sanitizeName(e.name);
      const parts: string[] = [name];
      if (e.durationMs != null) {
        parts.push(`dur=${Math.round(e.durationMs * 10) / 10}`);
      }
      if (e.desc != null) {
        // Escape quotes in desc values
        const safe = e.desc.replace(/"/g, "'").slice(0, 80);
        parts.push(`desc="${safe}"`);
      }
      return parts.join(";");
    })
    .join(", ");
}

/**
 * Build Server-Timing entries from RoutePerformanceProfiler metrics.
 */
export function buildServerTimingEntries(input: ServerTimingInput): ServerTimingEntry[] {
  const entries: ServerTimingEntry[] = [];

  if (input.totalMs != null) {
    entries.push({ name: "total", durationMs: input.totalMs });
  }

  if (input.renderMs != null) {
    entries.push({ name: "render", durationMs: input.renderMs });
  }

  if (input.dbMs != null) {
    const desc = input.dbQueryCount != null ? `${input.dbQueryCount}q` : undefined;
    entries.push({ name: "db", durationMs: input.dbMs, desc });
  }

  if (input.cacheDisposition && input.cacheDisposition !== "none") {
    entries.push({ name: "cache", desc: input.cacheDisposition });
  }

  if (input.memoryDeltaMb != null && input.memoryDeltaMb > 1) {
    entries.push({ name: "mem", durationMs: undefined, desc: `${Math.round(input.memoryDeltaMb)}MB` });
  }

  // Append custom segments (top 3 by duration to keep header compact)
  if (input.segments) {
    const topSegments = [...input.segments]
      .sort((a, b) => b.durationMs - a.durationMs)
      .slice(0, 3);
    for (const seg of topSegments) {
      entries.push({ name: sanitizeName(seg.name), durationMs: seg.durationMs });
    }
  }

  return entries;
}

/**
 * Build the complete `Server-Timing` header value from profiler metrics.
 * Returns null if Server-Timing is disabled.
 */
export function buildServerTimingHeader(input: ServerTimingInput): string | null {
  if (!isServerTimingEnabled()) return null;
  const entries = buildServerTimingEntries(input);
  if (entries.length === 0) return null;
  return buildServerTimingValue(entries);
}

/**
 * Append `Server-Timing` header to a `Response` object.
 * Mutates the response headers; returns the same response for chaining.
 */
export function appendServerTimingToResponse(
  response: Response,
  input: ServerTimingInput,
): Response {
  const headerValue = buildServerTimingHeader(input);
  if (!headerValue) return response;

  const existing = response.headers.get("Server-Timing");
  const combined = existing ? `${existing}, ${headerValue}` : headerValue;

  // Headers are immutable in the fetch spec — we must create a new Response
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Server-Timing", combined);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

/**
 * Build the Server-Timing value from common route profiler output fields.
 * Convenience wrapper for the most common usage pattern.
 */
export function routeProfilingToServerTiming(opts: {
  totalMs: number;
  dbQueryCount: number;
  dbTotalMs: number;
  memoryDeltaMb: number;
  segments?: Array<{ name: string; durationMs: number }>;
  cacheHit?: boolean;
}): string | null {
  return buildServerTimingHeader({
    totalMs: opts.totalMs,
    dbMs: opts.dbTotalMs,
    dbQueryCount: opts.dbQueryCount,
    memoryDeltaMb: opts.memoryDeltaMb,
    cacheDisposition: opts.cacheHit === true ? "hit" : opts.cacheHit === false ? "miss" : "none",
    segments: opts.segments,
  });
}
