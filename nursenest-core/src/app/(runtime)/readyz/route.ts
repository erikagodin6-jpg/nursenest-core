import { checkDatabaseReadiness } from "@/lib/db/prisma-readiness";
import { buildHealthProbeLogEntry } from "@/lib/health/health-probe-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const READY_HEADERS = {
  "content-type": "text/plain; charset=utf-8",
  "cache-control": "no-store",
};

const READYZ_DB_TIMEOUT_MS = 450;
const READYZ_SLOW_THRESHOLD_MS = 500;

/**
 * Framework-level readiness contract for local/dev and non-bootstrap runtimes.
 * Keep this bounded and dependency-minimal: runtime process + fast database
 * connectivity only. The parent bootstrap owns startup gating; the child
 * preload must not synthesize public `/readyz` responses.
 */
export async function GET() {
  const started = Date.now();
  const database = await checkDatabaseReadiness(READYZ_DB_TIMEOUT_MS);
  const status = database.ok ? 200 : 503;
  const durationMs = Date.now() - started;
  const entry = buildHealthProbeLogEntry({
    route: "/readyz",
    status,
    durationMs,
    uptimeMs: Math.round(process.uptime() * 1000),
    slowThresholdMs: READYZ_SLOW_THRESHOLD_MS,
    classification: database.ok ? undefined : database.classification,
    detail: database.ok ? undefined : database.error,
  });
  if (entry) {
    console.error(`[nursenest-core] health ${entry.event} ${JSON.stringify(entry.meta)}`);
  }

  return new Response(database.ok ? "ready" : "not ready", {
    status,
    headers: READY_HEADERS,
  });
}

export async function HEAD() {
  const database = await checkDatabaseReadiness(READYZ_DB_TIMEOUT_MS);
  return new Response(null, {
    status: database.ok ? 200 : 503,
    headers: READY_HEADERS,
  });
}
