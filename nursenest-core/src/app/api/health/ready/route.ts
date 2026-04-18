import { NextResponse } from "next/server";
import type { DatabaseHealthClassification } from "@/lib/db/db-error-classification";
import { checkDatabaseReadiness } from "@/lib/db/prisma-readiness";
import { buildHealthProbeLogEntry } from "@/lib/health/health-probe-log";
import { recordHealthReadyDatabaseFailure } from "@/lib/observability/production-signal-metrics";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };
const HEALTH_READY_SLOW_THRESHOLD_MS = 1000;

/** Default below typical load-balancer / DO health check ceilings; override with `HEALTH_READY_DB_TIMEOUT_MS`. */
function readinessDbTimeoutMs(): number {
  const raw = process.env.HEALTH_READY_DB_TIMEOUT_MS?.trim();
  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 500 && n <= 30_000) return Math.floor(n);
  }
  return 2500;
}

/**
 * Readiness: bounded `SELECT 1` when `DATABASE_URL` is set (after `env-bootstrap`).
 * Liveness: `/healthz` or `/api/health` (no DB). Exempt from global API rate limits (`/api/health` prefix).
 */
export async function GET() {
  const started = Date.now();
  const readinessTimeoutMs = readinessDbTimeoutMs();
  try {
    const r = await checkDatabaseReadiness(readinessTimeoutMs);
    if (!r.ok) {
      const detail = (r.error ?? "unknown").slice(0, 120);
      const entry = buildHealthProbeLogEntry({
        route: "/api/health/ready",
        status: 503,
        durationMs: Date.now() - started,
        uptimeMs: Math.round(process.uptime() * 1000),
        slowThresholdMs: HEALTH_READY_SLOW_THRESHOLD_MS,
        classification: r.classification,
        detail,
      });
      if (entry) {
        safeServerLog("health", entry.event, entry.meta);
      }
      safeServerLog("health", "ready_database_failed", {
        detail,
        classification: r.classification,
      });
      recordHealthReadyDatabaseFailure();
      return NextResponse.json({ ok: false, ready: false, database: "error" }, { status: 503, headers: NO_STORE });
    }
    if ("latencyMs" in r) {
      const entry = buildHealthProbeLogEntry({
        route: "/api/health/ready",
        status: 200,
        durationMs: Date.now() - started,
        uptimeMs: Math.round(process.uptime() * 1000),
        slowThresholdMs: HEALTH_READY_SLOW_THRESHOLD_MS,
      });
      if (entry) {
        safeServerLog("health", entry.event, entry.meta);
      }
      return NextResponse.json({ ok: true, ready: true, database: "ok" }, { status: 200, headers: NO_STORE });
    }
    const entry = buildHealthProbeLogEntry({
      route: "/api/health/ready",
      status: 200,
      durationMs: Date.now() - started,
      uptimeMs: Math.round(process.uptime() * 1000),
      slowThresholdMs: HEALTH_READY_SLOW_THRESHOLD_MS,
      classification: "DATABASE_URL_NOT_CONFIGURED",
    });
    if (entry) {
      safeServerLog("health", entry.event, entry.meta);
    }
    return NextResponse.json({ ok: true, ready: true, database: "not_configured" }, { status: 200, headers: NO_STORE });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const detail = msg.slice(0, 120);
    const entry = buildHealthProbeLogEntry({
      route: "/api/health/ready",
      status: 503,
      durationMs: Date.now() - started,
      uptimeMs: Math.round(process.uptime() * 1000),
      slowThresholdMs: HEALTH_READY_SLOW_THRESHOLD_MS,
      classification: "DB_OTHER",
      detail,
    });
    if (entry) {
      safeServerLog("health", entry.event, entry.meta);
    }
    safeServerLog("health", "ready_handler_error", { detail });
    recordHealthReadyDatabaseFailure();
    return NextResponse.json({ ok: false, ready: false, database: "error" }, { status: 503, headers: NO_STORE });
  }
}
