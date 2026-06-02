import { GET as readyGet, HEAD as readyHead } from "../health/ready/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Backward-compatible cheap readiness alias. DB diagnostics moved to `/healthz/deep`.
 */
export function GET() {
  return readyGet();
}

export function HEAD() {
  return readyHead();
}
