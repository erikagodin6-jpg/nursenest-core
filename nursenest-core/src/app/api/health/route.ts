/** Exempt from aggressive API rate limits via `/api/health` prefix — keep non-cached. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JSON_HEADERS = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
};

/**
 * Liveness: **no Prisma, DB, i18n, or env validation** — App Platform / probes must not depend on schema or secrets.
 * DB readiness: `GET /api/health/ready` (`SELECT 1` with timeout).
 */
export function GET() {
  console.log("api_health_hit");
  return new Response('{"ok":true,"live":true}', {
    status: 200,
    headers: JSON_HEADERS,
  });
}

export function HEAD() {
  return new Response(null, {
    status: 200,
    headers: JSON_HEADERS,
  });
}
