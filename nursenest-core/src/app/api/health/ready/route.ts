import { NextResponse } from "next/server";

import { buildHealthProbeLogEntry } from "@/lib/health/health-probe-log";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };
const HEALTH_READY_SLOW_THRESHOLD_MS = 25;

/**
 * Cheap readiness alias for tooling that historically used `/api/health/ready`.
 * Do not add Prisma, CMS, content counts, cache warmup, or filesystem work here.
 * Deep diagnostics live at `/healthz/deep`.
 */
export function GET() {
  const started = Date.now();
  const durationMs = Date.now() - started;
  const entry = buildHealthProbeLogEntry({
    route: "/api/health/ready",
    status: 200,
    durationMs,
    uptimeMs: Math.round(process.uptime() * 1000),
    slowThresholdMs: HEALTH_READY_SLOW_THRESHOLD_MS,
  });
  if (entry) {
    safeServerLog("health", entry.event, entry.meta);
  }

  return NextResponse.json(
    {
      ok: true,
      ready: true,
      process: "alive",
      nextServer: "booted",
      handlers: "registered",
      deepHealthPath: "/healthz/deep",
    },
    { status: 200, headers: NO_STORE },
  );
}

export function HEAD() {
  return new Response(null, {
    status: 200,
    headers: NO_STORE,
  });
}
