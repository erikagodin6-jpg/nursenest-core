import { NextResponse } from "next/server";
import { SocialGroupKind } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { createSocialGroup } from "@/lib/social-study/social-study-service";
import type { SocialStudyDb } from "@/lib/social-study/social-study-types";

export const dynamic = "force-dynamic";

const socialDb = prisma as unknown as SocialStudyDb;

const schema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(600).nullable().optional(),
  leaderboardEnabled: z.boolean().default(false),
});

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/admin/social/classrooms", "admin", async () => {
    const gate = await requireAdmin(req);
    if (!gate.ok) return gate.response;
    const classrooms = await prisma.socialGroup.findMany({
      where: { kind: SocialGroupKind.CLASSROOM },
      orderBy: { updatedAt: "desc" },
      take: 100,
      select: { id: true, name: true, description: true, displayCode: true, active: true, leaderboardEnabled: true },
    });
    return NextResponse.json({ classrooms });
  });
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/admin/social/classrooms", "admin", async () => {
    const gate = await requireAdmin(req);
    if (!gate.ok) return gate.response;
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
    const result = await createSocialGroup(socialDb, gate.admin.userId, {
      kind: SocialGroupKind.CLASSROOM,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      ownerUserId: null,
      leaderboardEnabled: parsed.data.leaderboardEnabled,
    });
    return NextResponse.json(result);
  });
}
