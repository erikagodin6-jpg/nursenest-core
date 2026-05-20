import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().max(600).nullable().optional(),
  active: z.boolean().optional(),
  leaderboardEnabled: z.boolean().optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ groupId: string }> }) {
  return runWithApiTelemetry(req, "PATCH /api/admin/social/classrooms/[groupId]", "admin", async () => {
    const gate = await requireAdmin(req);
    if (!gate.ok) return gate.response;
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
    const { groupId } = await ctx.params;
    const classroom = await prisma.socialGroup.update({
      where: { id: groupId },
      data: parsed.data,
      select: { id: true, name: true, description: true, active: true, leaderboardEnabled: true },
    });
    return NextResponse.json({ ok: true, classroom });
  });
}
