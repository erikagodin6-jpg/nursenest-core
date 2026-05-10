import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { leaveSocialGroup } from "@/lib/social-study/social-study-service";
import type { SocialStudyDb } from "@/lib/social-study/social-study-types";

export const dynamic = "force-dynamic";

const socialDb = prisma as unknown as SocialStudyDb;

export async function DELETE(req: Request, ctx: { params: Promise<{ groupId: string }> }) {
  return runWithApiTelemetry(req, "DELETE /api/learner/social/groups/[groupId]/membership", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const { groupId } = await ctx.params;
    const result = await leaveSocialGroup(socialDb, gate.userId, groupId);
    return NextResponse.json(result, { status: result.ok ? 200 : 404, headers: mergeSubscriberPrivateCacheHeaders() });
  });
}
