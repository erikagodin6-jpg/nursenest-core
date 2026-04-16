import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { ADMIN_AI_LESSON_GENERATOR_TOOL } from "@/lib/lessons/admin-ai-lesson-pipeline";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const draft = await prisma.generatedLessonDraft.findFirst({
    where: { id, tool: ADMIN_AI_LESSON_GENERATOR_TOOL },
  });
  if (!draft) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ draft });
}
