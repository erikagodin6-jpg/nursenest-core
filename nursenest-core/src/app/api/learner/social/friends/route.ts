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
        requester: { select: { id: true, name: true } },
        addressee: { select: { id: true, name: true } },
      },
    });
    const friends = rows.map((row) => {
      const other = row.requesterUserId === gate.userId ? row.addressee : row.requester;
      return {
        id: row.id,
        requesterUserId: row.requesterUserId,
        addresseeUserId: row.addresseeUserId,
        status: row.status,
        updatedAt: row.updatedAt,
        direction: row.requesterUserId === gate.userId ? "outgoing" : "incoming",
        otherUser: {
          id: other.id,
          displayName: other.name?.trim() || "NurseNest learner",
        },
      };
    });
    return NextResponse.json({ friends }, { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}
