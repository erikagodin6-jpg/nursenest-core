export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const READY_HEADERS = {
  "content-type": "text/plain; charset=utf-8",
  "cache-control": "no-store",
};

/**
 * Internal-only startup alias for older bootstrap wrappers that still probe the
 * historical path. Keep this outside `/api/*` and independent from the proxy/auth
 * stack so it stays usable during cold start.
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
