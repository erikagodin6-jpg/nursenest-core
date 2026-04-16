import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Authenticated session diagnostic for incident response.
 * Does not expose secrets, tokens, or raw cookies.
 *
 * - **Minimal:** `{ authenticated: boolean }` only — safe for any caller (no PII).
 * - **Detailed** (user id, email, role, …): only after {@link requireAdmin} — super tier per RBAC
 *   (`/api/debug/session` is super-only). Enabled in non-production, or in production when
 *   `DEBUG_SESSION_ROUTE_ENABLED=1` or `SENTRY_DEBUG_ROUTE=1` (same gate as before).
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ authenticated: false });
  }

  const detailEnvEnabled =
    process.env.NODE_ENV !== "production" ||
    process.env.DEBUG_SESSION_ROUTE_ENABLED === "1" ||
    process.env.SENTRY_DEBUG_ROUTE === "1";

  if (!detailEnvEnabled) {
    return NextResponse.json({ authenticated: true });
  }

  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

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
