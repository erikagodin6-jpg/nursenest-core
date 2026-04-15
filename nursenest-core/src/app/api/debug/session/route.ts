import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Temporary authenticated session diagnostic for incident response.
 * Does not expose secrets, tokens, or raw cookies.
 *
 * In production, returns a minimal payload unless `DEBUG_SESSION_ROUTE_ENABLED=1`
 * (same pattern as `/api/debug/sentry-test`).
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ authenticated: false });
  }

  const enabledInProd =
    process.env.NODE_ENV !== "production" ||
    process.env.DEBUG_SESSION_ROUTE_ENABLED === "1" ||
    process.env.SENTRY_DEBUG_ROUTE === "1";
  if (!enabledInProd) {
    return NextResponse.json({ authenticated: true });
  }

  const u = session.user as {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: string;
    tier?: string;
    country?: string;
    subscriptionStatus?: string;
    credentialVersion?: number;
    alliedProfessionKey?: string | null;
  };

  return NextResponse.json({
    authenticated: true,
    userId: typeof u.id === "string" ? u.id : "",
    email: typeof u.email === "string" ? u.email : "",
    name: typeof u.name === "string" ? u.name : "",
    role: typeof u.role === "string" ? u.role : "LEARNER",
    tier: typeof u.tier === "string" ? u.tier : undefined,
    country: typeof u.country === "string" ? u.country : undefined,
    subscriptionStatus: typeof u.subscriptionStatus === "string" ? u.subscriptionStatus : undefined,
    credentialVersion: typeof u.credentialVersion === "number" ? u.credentialVersion : 0,
    alliedProfessionKey: u.alliedProfessionKey ?? null,
  });
}
