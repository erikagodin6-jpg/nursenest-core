import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSessionIdentityPayload } from "@/lib/auth/session-identity-from-db";

export const dynamic = "force-dynamic";

/**
 * Returns DB-backed tier / country / subscription mirror for JWT refresh after checkout (webhook updates User + Subscription).
 * Identity matches {@link getSessionIdentityPayload} — same source as the Node `session.update()` merge.
 */
export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getSessionIdentityPayload(userId);
  if (!payload) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    tier: payload.tier,
    country: payload.country,
    subscriptionStatus: payload.subscriptionStatus,
    role: payload.role,
    credentialVersion: payload.credentialVersion,
    subscription: payload.subscription,
  });
}
