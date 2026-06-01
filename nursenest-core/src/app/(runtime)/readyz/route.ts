import { buildHealthProbeLogEntry } from "@/lib/health/health-probe-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const READY_HEADERS = {
  "content-type": "text/plain; charset=utf-8",
  "cache-control": "no-store",
};

const READYZ_SLOW_THRESHOLD_MS = 25;

/**
 * Framework-level readiness contract for local/dev and non-bootstrap runtimes.
 * Keep this dependency-free: process alive + Next route handler reached. In
 * standalone production, the parent bootstrap only proxies here after its
 * internal probe has marked request handlers registered.
 */
export function GET() {
  const started = Date.now();
  const status = 200;
  const durationMs = Date.now() - started;
  const entry = buildHealthProbeLogEntry({
    route: "/readyz",
    status,
    durationMs,
    uptimeMs: Math.round(process.uptime() * 1000),
    slowThresholdMs: READYZ_SLOW_THRESHOLD_MS,
  });
  if (entry) {
    console.error(`[nursenest-core] health ${entry.event} ${JSON.stringify(entry.meta)}`);
  }

  return new Response("ready", {
    status,
    headers: READY_HEADERS,
  });
}

export function HEAD() {
  return new Response(null, {
    status: 200,
    headers: READY_HEADERS,
  });
}
