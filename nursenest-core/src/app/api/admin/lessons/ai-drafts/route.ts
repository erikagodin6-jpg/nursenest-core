import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { ADMIN_AI_LESSON_GENERATOR_TOOL } from "@/lib/lessons/admin-ai-lesson-pipeline";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(5, Number(sp.get("pageSize") ?? "20")));

  const where = { tool: ADMIN_AI_LESSON_GENERATOR_TOOL };

  const [total, rows] = await Promise.all([
    prisma.generatedLessonDraft.count({ where }),
    prisma.generatedLessonDraft.findMany({
      where,
      select: {
        id: true,
        titlePreview: true,
        reviewStatus: true,
        createdAt: true,
        updatedAt: true,
        promotedEntityId: true,
        payloadJson: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({ page, pageSize, total, drafts: rows });
}
