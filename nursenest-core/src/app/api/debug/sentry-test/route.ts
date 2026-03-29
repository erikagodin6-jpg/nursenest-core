import { NextResponse } from "next/server";

/**
 * Intentional Sentry error for verifying the SDK (Issues + optional Session Replay on error).
 * Disabled in production unless `SENTRY_ENABLE_TEST_ROUTE=1` (set briefly during setup only).
 */
export async function GET() {
  const enabled =
    process.env.NODE_ENV !== "production" || process.env.SENTRY_ENABLE_TEST_ROUTE === "1" || process.env.SENTRY_DEBUG_ROUTE === "1";
  if (!enabled) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  throw new Error("Sentry test error (intentional — remove or disable SENTRY_ENABLE_TEST_ROUTE after verification)");
}
