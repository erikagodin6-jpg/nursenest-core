/**
 * Phase 8 — Real User Monitoring (RUM)
 *
 * Receives Web Vitals, route transition times, API latency, and DB latency
 * from real browsers. Stores anonymized metrics. Provides admin P50/P75/P95/P99
 * percentile queries by page and metric.
 */

import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import rateLimit from "express-rate-limit";
import { createHash } from "crypto";

/* ------------------------------------------------------------------ */
/*  SCHEMA                                                              */
/* ------------------------------------------------------------------ */

export async function ensureRumTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rum_metrics (
        id          bigserial PRIMARY KEY,
        page        text      NOT NULL,
        metric      text      NOT NULL,
        value       numeric   NOT NULL,
        rating      text      NOT NULL DEFAULT 'unknown',
        session_id  text,
        user_hash   text,
        recorded_at timestamptz NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_rum_page_metric
        ON rum_metrics (page, metric, recorded_at DESC);
      CREATE INDEX IF NOT EXISTS idx_rum_recorded_at
        ON rum_metrics (recorded_at DESC);
    `);
  } catch (e: any) {
    console.warn("[RUM] Table init error:", e.message);
  }
}

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                           */
/* ------------------------------------------------------------------ */

const ALLOWED_METRICS = new Set([
  "TTFB", "FCP", "LCP", "INP", "CLS",
  "route_transition",
  "api_latency",
  "db_latency",
]);

const ALLOWED_PAGES = new Set([
  "home", "pricing", "lessons", "flashcards",
  "practice_questions", "cat", "simulation", "ecg",
  "other",
]);

const ALLOWED_RATINGS = new Set(["good", "needs_improvement", "poor", "unknown"]);

const MAX_BATCH = 30;

function anonymizeUserId(rawId: string | undefined): string | null {
  if (!rawId || typeof rawId !== "string") return null;
  return createHash("sha256").update(rawId + "rum_salt_v1").digest("hex").slice(0, 16);
}

function sanitizePage(raw: unknown): string {
  if (typeof raw !== "string") return "other";
  const s = raw.trim().toLowerCase().slice(0, 80).replace(/[^a-z0-9_/-]/g, "");
  return ALLOWED_PAGES.has(s) ? s : "other";
}

function sanitizeMetric(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  return ALLOWED_METRICS.has(raw.trim()) ? raw.trim() : null;
}

function sanitizeValue(raw: unknown): number | null {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || n > 60000) return null;
  return Math.round(n * 100) / 100;
}

function sanitizeRating(raw: unknown): string {
  if (typeof raw !== "string") return "unknown";
  const s = raw.trim().toLowerCase();
  return ALLOWED_RATINGS.has(s) ? s : "unknown";
}

function sanitizeSessionId(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  return raw.trim().slice(0, 64).replace(/[^a-z0-9-]/gi, "") || null;
}

/* ------------------------------------------------------------------ */
/*  PERCENTILE HELPER                                                   */
/* ------------------------------------------------------------------ */

function percentileQuery(alias: string, col: string, pct: number): string {
  return `PERCENTILE_CONT(${pct}) WITHIN GROUP (ORDER BY ${col}) AS ${alias}`;
}

/* ------------------------------------------------------------------ */
/*  ROUTES                                                              */
/* ------------------------------------------------------------------ */

const ingestLimiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => false,
});

export function registerRumRoutes(app: Express): void {
  /* ---- Ingest (public, rate-limited) ---- */
  app.post("/api/rum/ingest", ingestLimiter, async (req: Request, res: Response) => {
    try {
      const events: unknown[] = Array.isArray(req.body?.events)
        ? req.body.events.slice(0, MAX_BATCH)
        : [];

      if (events.length === 0) {
        return res.status(204).end();
      }

      const rawUserId = req.body?.userId as string | undefined;
      const userHash = anonymizeUserId(rawUserId);

      const rows: Array<[string, string, number, string, string | null, string | null]> = [];

      for (const ev of events) {
        if (!ev || typeof ev !== "object") continue;
        const e = ev as Record<string, unknown>;

        const metric = sanitizeMetric(e.metric);
        if (!metric) continue;

        const value = sanitizeValue(e.value);
        if (value === null) continue;

        const page = sanitizePage(e.page);
        const rating = sanitizeRating(e.rating);
        const sessionId = sanitizeSessionId(e.sessionId);

        rows.push([page, metric, value, rating, sessionId, userHash]);
      }

      if (rows.length === 0) {
        return res.status(204).end();
      }

      // Batch insert
      const placeholders = rows
        .map((_, i) => {
          const base = i * 6;
          return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`;
        })
        .join(", ");

      await pool.query(
        `INSERT INTO rum_metrics (page, metric, value, rating, session_id, user_hash)
         VALUES ${placeholders}`,
        rows.flat(),
      );

      return res.status(204).end();
    } catch (e: any) {
      console.error("[RUM] Ingest error:", e.message);
      return res.status(500).json({ error: "ingest_failed" });
    }
  });

  /* ---- Admin dashboard query ---- */
  app.get("/api/admin/rum/dashboard", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const hours = Math.max(1, Math.min(168, Number(req.query.hours ?? 24)));
      const cutoff = `NOW() - INTERVAL '${hours} hours'`;
      const pageFilter = sanitizePage(req.query.page ?? "");

      const whereExtra = pageFilter !== "other" || req.query.page === "other"
        ? `AND page = '${pageFilter}'`
        : "";

      /* Percentiles by page × metric */
      const { rows: byPageMetric } = await pool.query(`
        SELECT
          page,
          metric,
          COUNT(*)::int                                                       AS sample_count,
          ${percentileQuery("p50", "value", 0.50)},
          ${percentileQuery("p75", "value", 0.75)},
          ${percentileQuery("p95", "value", 0.95)},
          ${percentileQuery("p99", "value", 0.99)},
          AVG(value)::numeric(10,2)                                           AS avg_value,
          COUNT(*) FILTER (WHERE rating = 'good')::int                       AS good_count,
          COUNT(*) FILTER (WHERE rating = 'needs_improvement')::int          AS needs_improvement_count,
          COUNT(*) FILTER (WHERE rating = 'poor')::int                       AS poor_count
        FROM rum_metrics
        WHERE recorded_at > ${cutoff}
        ${whereExtra}
        GROUP BY page, metric
        ORDER BY page, metric
      `);

      /* Hourly trend for LCP on all pages */
      const { rows: trend } = await pool.query(`
        SELECT
          date_trunc('hour', recorded_at)                              AS hour,
          page,
          metric,
          ${percentileQuery("p75", "value", 0.75)},
          COUNT(*)::int                                                AS samples
        FROM rum_metrics
        WHERE recorded_at > ${cutoff}
          AND metric IN ('LCP','FCP','INP','CLS','TTFB')
        GROUP BY 1, 2, 3
        ORDER BY 1 DESC, 2, 3
        LIMIT 500
      `);

      /* Slowest route transitions */
      const { rows: slowRoutes } = await pool.query(`
        SELECT
          page,
          ${percentileQuery("p95", "value", 0.95)},
          COUNT(*)::int AS samples
        FROM rum_metrics
        WHERE recorded_at > ${cutoff}
          AND metric = 'route_transition'
        GROUP BY page
        ORDER BY p95 DESC
        LIMIT 20
      `);

      /* Sample counts by page for last window */
      const { rows: pageCounts } = await pool.query(`
        SELECT page, COUNT(*)::int AS events
        FROM rum_metrics
        WHERE recorded_at > ${cutoff}
        GROUP BY page
        ORDER BY events DESC
      `);

      return res.json({
        windowHours: hours,
        byPageMetric,
        trend,
        slowRoutes,
        pageCounts,
        generatedAt: new Date().toISOString(),
      });
    } catch (e: any) {
      console.error("[RUM] Dashboard error:", e.message);
      return res.status(500).json({ error: "dashboard_failed" });
    }
  });

  /* ---- Admin: purge old data (retention) ---- */
  app.delete("/api/admin/rum/purge", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const days = Math.max(7, Math.min(365, Number(req.query.days ?? 90)));
    try {
      const { rowCount } = await pool.query(
        `DELETE FROM rum_metrics WHERE recorded_at < NOW() - INTERVAL '${days} days'`,
      );
      return res.json({ deleted: rowCount ?? 0 });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });
}
