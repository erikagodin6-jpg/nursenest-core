import { databaseUrlDriftAuditPublic } from "@/lib/db/database-url-drift-audit";

/** Exempt from aggressive API rate limits via `/api/health` prefix — keep non-cached. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JSON_HEADERS = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
};

/**
 * Liveness: **no Prisma, DB, i18n, or env validation** — App Platform / probes must not depend on schema or secrets.
 * Exposes only `dbUrlFingerprintPrefix10` (SHA-256 prefix of full URL) when `DATABASE_URL` is set and parseable — no password, host, or user in this public payload.
 * DB readiness: `GET /api/health/ready` (`SELECT 1` with timeout).
 */
export function GET() {
  console.log("api_health_hit");
  const body: Record<string, unknown> = { ok: true, live: true };
  const raw = process.env.DATABASE_URL?.trim();
  if (raw) {
    const audit = databaseUrlDriftAuditPublic(raw);
    if (audit) body.dbUrlFingerprintPrefix10 = audit.fingerprintPrefix10;
  }
  return new Response(JSON.stringify(body), {
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
