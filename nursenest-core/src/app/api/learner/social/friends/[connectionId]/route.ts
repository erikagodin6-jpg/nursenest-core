import { NextResponse } from "next/server";
import { z } from "zod";
import { SocialConnectionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { acceptSocialConnection, blockSocialConnection } from "@/lib/social-study/social-study-service";
import type { SocialStudyDb } from "@/lib/social-study/social-study-types";

export const dynamic = "force-dynamic";

const schema = z.object({ action: z.enum(["accept", "decline", "remove", "block"]) });
const socialDb = prisma as unknown as SocialStudyDb;

export async function PATCH(req: Request, ctx: { params: Promise<{ connectionId: string }> }) {
  return runWithApiTelemetry(req, "PATCH /api/learner/social/friends/[connectionId]", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const { connectionId } = await ctx.params;
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400, headers: mergeSubscriberPrivateCacheHeaders() });
    }

    if (parsed.data.action === "accept") {
      const result = await acceptSocialConnection(socialDb, gate.userId, connectionId);
      return NextResponse.json(result, { status: result.ok ? 200 : 404, headers: mergeSubscriberPrivateCacheHeaders() });
    }

    const connection = await prisma.socialConnection.findFirst({
      where: { id: connectionId, OR: [{ requesterUserId: gate.userId }, { addresseeUserId: gate.userId }] },
      select: { id: true, requesterUserId: true, addresseeUserId: true },
    });
    if (!connection) {
      return NextResponse.json({ ok: false, code: "not_found" }, { status: 404, headers: mergeSubscriberPrivateCacheHeaders() });
    }

    if (parsed.data.action === "block") {
      const otherUserId = connection.requesterUserId === gate.userId ? connection.addresseeUserId : connection.requesterUserId;
      const result = await blockSocialConnection(socialDb, gate.userId, otherUserId);
      return NextResponse.json(result, { headers: mergeSubscriberPrivateCacheHeaders() });
    }

    const status = parsed.data.action === "decline" ? SocialConnectionStatus.DECLINED : SocialConnectionStatus.REMOVED;
    const next = await prisma.socialConnection.update({
      where: { id: connection.id },
      data: {
        status,
        respondedAt: new Date(),
        removedAt: status === SocialConnectionStatus.REMOVED ? new Date() : null,
      },
      select: { id: true, requesterUserId: true, addresseeUserId: true, status: true },
    });
    return NextResponse.json({ ok: true, connection: next }, { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}
