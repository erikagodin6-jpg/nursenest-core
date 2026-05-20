export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const READY_HEADERS = {
  "content-type": "text/plain; charset=utf-8",
  "cache-control": "no-store",
};

/**
 * Framework-level readiness contract for local/dev and non-bootstrap runtimes.
 * The standalone watchdog intercepts `/readyz` in production so DO sees a true
 * "handlers are serving" signal instead of generic process liveness.
 */
export function GET() {
  return new Response("ready", {
    status: 200,
    headers: READY_HEADERS,
  });
}

export function HEAD() {
  return new Response(null, {
    status: 200,
    headers: READY_HEADERS,
  });
}
