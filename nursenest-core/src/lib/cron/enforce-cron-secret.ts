import { NextResponse } from "next/server";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Shared guard for `/api/cron/*` POST handlers.
 * Production-like envs require `CRON_SECRET` to be set and sent as `Authorization: Bearer <secret>`.
 * Returns `null` when the request may proceed; otherwise a finished error response.
 */
export function enforceCronSecretOrResponse(req: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET?.trim();
  const correlation = correlationIdFromRequest(req) ?? "";
  let path = "";
  try {
    path = new URL(req.url).pathname.slice(0, 160);
  } catch {
    /* ignore */
  }
  const prodLike =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.NURSE_NEST_ENFORCE_CRON_SECRET === "1";

  if (prodLike) {
    if (!secret) {
      safeServerLog("cron", "reject_missing_cron_secret", { prodLike: true, severity: "error" });
      return NextResponse.json({ error: "Service misconfigured" }, { status: 503 });
    }
    const authz = req.headers.get("authorization");
    if (authz !== `Bearer ${secret}`) {
      safeServerLog("cron", "authorization_failed", {
        correlation,
        path,
        severity: "expected_denial",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return null;
  }

  if (secret) {
    const authz = req.headers.get("authorization");
    if (authz !== `Bearer ${secret}`) {
      safeServerLog("cron", "authorization_failed", {
        correlation,
        path,
        severity: "expected_denial",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return null;
}
