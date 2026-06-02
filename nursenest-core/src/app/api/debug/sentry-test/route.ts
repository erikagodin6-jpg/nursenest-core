import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";

/**
 * Intentional Sentry error for verifying the SDK (Issues + optional Session Replay on error).
 * Disabled in production unless `SENTRY_ENABLE_TEST_ROUTE=1` (set briefly during setup only).
 * Super-admin only when enabled (nn-db-final-005).
 */
export async function GET(req: Request) {
  const enabled =
    process.env.NODE_ENV !== "production" ||
    process.env.SENTRY_ENABLE_TEST_ROUTE === "1" ||
    process.env.SENTRY_DEBUG_ROUTE === "1";
  if (!enabled) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  throw new Error("Sentry test error (intentional — remove or disable SENTRY_ENABLE_TEST_ROUTE after verification)");
}
