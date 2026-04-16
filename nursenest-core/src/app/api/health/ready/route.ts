import { NextResponse } from "next/server";
import { checkDatabaseReadiness } from "@/lib/db/prisma-readiness";
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
    if ("skipped" in r && r.skipped) {
      return NextResponse.json(
        {
          ok: true,
          database: "not_configured",
          service: "nursenest-core",
          readinessTimeoutMs,
          timestamp: new Date().toISOString(),
        },
        { status: 200, headers: NO_STORE },
      );
    }
    if (r.ok && "latencyMs" in r) {
      return NextResponse.json(
        {
          ok: true,
          database: "ok",
          latencyMs: r.latencyMs,
          readinessTimeoutMs,
          service: "nursenest-core",
          timestamp: new Date().toISOString(),
        },
        { status: 200, headers: NO_STORE },
      );
    }
    if (!r.ok) {
      const detail = (r.error ?? "unknown").slice(0, 120);
      safeServerLog("health", "ready_database_failed", { detail });
      return NextResponse.json(
        {
          ok: false,
          database: "error",
          service: "nursenest-core",
          readinessTimeoutMs,
          timestamp: new Date().toISOString(),
        },
        { status: 503, headers: NO_STORE },
      );
    }
    const _exhaustive: never = r;
    return NextResponse.json(
      {
        ok: false,
        database: "unexpected",
        detail: String(_exhaustive),
        service: "nursenest-core",
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: NO_STORE },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("health", "ready_handler_error", { detail: msg.slice(0, 120) });
    return NextResponse.json(
      {
        ok: false,
        database: "error",
        service: "nursenest-core",
        readinessTimeoutMs,
        timestamp: new Date().toISOString(),
      },
      { status: 503, headers: NO_STORE },
    );
  }
}
