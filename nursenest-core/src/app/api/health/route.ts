/** Exempt from aggressive API rate limits via `/api/health` prefix — keep non-cached. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JSON_HEADERS = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
};

/**
 * Liveness: **no Prisma, DB, i18n, env fingerprinting, or validation**.
 * App Platform / probes must not depend on schema, secrets, or downstream services.
 * Deep dependency diagnostics: `GET /healthz/deep` (`SELECT 1` with timeout).
 */
export function GET() {
  return new Response(JSON.stringify({ ok: true, live: true }), {
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
