import { NextResponse } from "next/server";
import { checkDatabaseReadiness } from "@/lib/db/prisma-readiness";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";

const READINESS_TIMEOUT_MS = 3000;

/**
 * Readiness: verifies Postgres when `DATABASE_URL` is set (or `PROD_DATABASE_URL` if `DATABASE_URL` is unset).
 * Liveness stays on `/healthz` and `/api/health` (no DB).
 */
export async function GET() {
  const r = await checkDatabaseReadiness(READINESS_TIMEOUT_MS);
  if ("skipped" in r && r.skipped) {
    return NextResponse.json(
      { ok: true, database: "not_configured", service: "nursenest-core", timestamp: new Date().toISOString() },
      { status: 200 },
    );
  }
  if (r.ok && "latencyMs" in r) {
    return NextResponse.json(
      {
        ok: true,
        database: "ok",
        latencyMs: r.latencyMs,
        readinessTimeoutMs: READINESS_TIMEOUT_MS,
        service: "nursenest-core",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  }
  if (!r.ok) {
    safeServerLog("health", "ready_database_failed", { detail: r.error.slice(0, 120) });
    return NextResponse.json(
      {
        ok: false,
        database: "error",
        service: "nursenest-core",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
  return NextResponse.json(
    { ok: false, database: "unexpected", service: "nursenest-core", timestamp: new Date().toISOString() },
    { status: 500 },
  );
}
