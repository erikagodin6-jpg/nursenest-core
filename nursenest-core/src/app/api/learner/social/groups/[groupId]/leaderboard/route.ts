import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { refreshSocialStatSnapshots } from "@/lib/social-study/refresh-social-stat-snapshots";
import { listSocialGroupLeaderboard } from "@/lib/social-study/social-study-service";
import type { SocialStudyDb } from "@/lib/social-study/social-study-types";

export const dynamic = "force-dynamic";

const socialDb = prisma as unknown as SocialStudyDb;

export async function GET(req: Request, ctx: { params: Promise<{ groupId: string }> }) {
  return runWithApiTelemetry(req, "GET /api/learner/social/groups/[groupId]/leaderboard", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const { groupId } = await ctx.params;
    const memberships = await prisma.socialGroupMembership.findMany({
      where: { groupId, active: true },
      take: 50,
      select: { userId: true },
    });
    await Promise.all(memberships.map((membership) => refreshSocialStatSnapshots(prisma, membership.userId)));
    const result = await listSocialGroupLeaderboard(socialDb, gate.userId, groupId);
    return NextResponse.json(result, { status: result.ok ? 200 : 403, headers: mergeSubscriberPrivateCacheHeaders() });
  });
}
