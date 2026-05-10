import { NextResponse } from "next/server";
import { SocialGroupKind } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { createSocialGroup } from "@/lib/social-study/social-study-service";
import type { SocialStudyDb } from "@/lib/social-study/social-study-types";

export const dynamic = "force-dynamic";

const socialDb = prisma as unknown as SocialStudyDb;

const postSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(600).nullable().optional(),
  leaderboardEnabled: z.boolean().default(false),
});

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/social/groups", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const rows = await prisma.socialGroupMembership.findMany({
      where: { userId: gate.userId, active: true },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: {
        id: true,
        role: true,
        group: { select: { id: true, kind: true, name: true, description: true, displayCode: true, leaderboardEnabled: true } },
      },
    });
    return NextResponse.json({ memberships: rows }, { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/social/groups", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const parsed = postSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400, headers: mergeSubscriberPrivateCacheHeaders() });
    }
    const result = await createSocialGroup(socialDb, gate.userId, {
      kind: SocialGroupKind.GROUP,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      leaderboardEnabled: parsed.data.leaderboardEnabled,
    });
    return NextResponse.json(result, { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}
