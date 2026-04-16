import { NextResponse } from "next/server";
import type { DatabaseHealthClassification } from "@/lib/db/db-error-classification";
import { checkDatabaseReadiness } from "@/lib/db/prisma-readiness";
import { recordHealthReadyDatabaseFailure } from "@/lib/observability/production-signal-metrics";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

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
  const readinessTimeoutMs = readinessDbTimeoutMs();
  try {
    const r = await checkDatabaseReadiness(readinessTimeoutMs);
    if (!r.ok) {
      const detail = (r.error ?? "unknown").slice(0, 120);
      safeServerLog("health", "ready_database_failed", {
        detail,
        classification: r.classification,
      });
      recordHealthReadyDatabaseFailure();
      return NextResponse.json(
        {
          ok: false,
          database: "error",
          classification: r.classification,
          service: "nursenest-core",
          readinessTimeoutMs,
          timestamp: new Date().toISOString(),
        },
        { status: 503, headers: NO_STORE },
      );
    }
    if ("latencyMs" in r) {
      return NextResponse.json(
        {
          ok: true,
          database: "ok",
          classification: "OK" satisfies DatabaseHealthClassification,
          latencyMs: r.latencyMs,
          readinessTimeoutMs,
          service: "nursenest-core",
          timestamp: new Date().toISOString(),
        },
        { status: 200, headers: NO_STORE },
      );
    }
    return NextResponse.json(
      {
        ok: true,
        database: "not_configured",
        classification: "DATABASE_URL_NOT_CONFIGURED" satisfies DatabaseHealthClassification,
        service: "nursenest-core",
        readinessTimeoutMs,
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers: NO_STORE },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("health", "ready_handler_error", { detail: msg.slice(0, 120) });
    recordHealthReadyDatabaseFailure();
    return NextResponse.json(
      {
        ok: false,
        database: "error",
        classification: "DB_OTHER" satisfies DatabaseHealthClassification,
        service: "nursenest-core",
        readinessTimeoutMs,
        timestamp: new Date().toISOString(),
      },
      { status: 503, headers: NO_STORE },
    );
  }
}
