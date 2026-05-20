import { GET as healthGet } from "../api/health/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Internal-only startup alias for older bootstrap wrappers that still probe the
 * historical path. Keep it lightweight and identical to `/api/health`.
 */
export async function GET() {
  return healthGet();
}

export async function HEAD() {
  const response = await healthGet();
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  });
}
