import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { SocialChallengeStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const dynamic = "force-dynamic";

const schema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED", "COMPLETED", "CANCELLED"]),
  completionSummary: z.record(z.string(), z.unknown()).optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ challengeId: string }> }) {
  return runWithApiTelemetry(req, "PATCH /api/learner/social/challenges/[challengeId]", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400, headers: mergeSubscriberPrivateCacheHeaders() });
    }
    const { challengeId } = await ctx.params;
    const participant = await prisma.socialChallengeParticipant.findFirst({
      where: { challengeId, userId: gate.userId },
      select: { id: true },
    });
    if (!participant) {
      return NextResponse.json({ ok: false, code: "not_found" }, { status: 404, headers: mergeSubscriberPrivateCacheHeaders() });
    }
    const status = parsed.data.status as SocialChallengeStatus;
    const completionSummary: Prisma.InputJsonValue | undefined =
      parsed.data.completionSummary === undefined
        ? undefined
        : (JSON.parse(JSON.stringify(parsed.data.completionSummary)) as Prisma.InputJsonValue);
    const updated = await prisma.socialChallengeParticipant.update({
      where: { id: participant.id },
      data: {
        status,
        acceptedAt: status === SocialChallengeStatus.ACCEPTED ? new Date() : undefined,
        declinedAt: status === SocialChallengeStatus.DECLINED ? new Date() : undefined,
        completedAt: status === SocialChallengeStatus.COMPLETED ? new Date() : undefined,
        completionSummary,
      },
      select: { id: true, challengeId: true, status: true, completedAt: true, completionSummary: true },
    });
    return NextResponse.json({ ok: true, participant: updated }, { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}
