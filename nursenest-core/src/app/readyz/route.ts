export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const READY_HEADERS = {
  "content-type": "text/plain; charset=utf-8",
  "cache-control": "no-store",
};

/**
 * Lightweight app-boot readiness signal. Keep this outside `/api/*` so it does not
 * flow through proxy/auth/admin/DB runtime paths.
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
