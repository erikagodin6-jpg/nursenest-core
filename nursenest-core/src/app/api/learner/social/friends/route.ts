import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/social/friends", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const rows = await prisma.socialConnection.findMany({
      where: {
        OR: [{ requesterUserId: gate.userId }, { addresseeUserId: gate.userId }],
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: {
        id: true,
        requesterUserId: true,
        addresseeUserId: true,
        status: true,
        updatedAt: true,
      },
    });
    return NextResponse.json({ friends: rows }, { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}
