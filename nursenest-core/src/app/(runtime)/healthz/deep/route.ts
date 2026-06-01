import { checkDatabaseReadiness } from "@/lib/db/prisma-readiness";
import { buildHealthProbeLogEntry } from "@/lib/health/health-probe-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JSON_HEADERS = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
};

const DEEP_HEALTH_DB_TIMEOUT_MS = 2500;
const DEEP_HEALTH_SLOW_THRESHOLD_MS = 1000;

/**
 * Diagnostic health only. This endpoint may touch downstream dependencies and
 * must not be wired to load balancer readiness checks.
 */
export async function GET() {
  const started = Date.now();
  const database = await checkDatabaseReadiness(DEEP_HEALTH_DB_TIMEOUT_MS);
  const status = database.ok ? 200 : 503;
  const durationMs = Date.now() - started;
  const entry = buildHealthProbeLogEntry({
    route: "/healthz/deep",
    status,
    durationMs,
    uptimeMs: Math.round(process.uptime() * 1000),
    slowThresholdMs: DEEP_HEALTH_SLOW_THRESHOLD_MS,
    classification: database.ok ? undefined : database.classification,
    detail: database.ok ? undefined : database.error,
  });
  if (entry) {
    console.error(`[nursenest-core] health ${entry.event} ${JSON.stringify(entry.meta)}`);
  }

  const body = {
    ok: database.ok,
    live: true,
    ready: true,
    diagnosticsOnly: true,
    database: database.ok
      ? "latencyMs" in database
        ? { ok: true, latencyMs: database.latencyMs }
        : { ok: true, skipped: true }
      : { ok: false, classification: database.classification, error: database.error },
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS,
  });
}

export async function HEAD() {
  const database = await checkDatabaseReadiness(DEEP_HEALTH_DB_TIMEOUT_MS);
  return new Response(null, {
    status: database.ok ? 200 : 503,
    headers: JSON_HEADERS,
  });
}
