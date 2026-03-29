import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

/** Paginated JSON export for backups / migrations (admin only). */
export async function GET(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const url = new URL(req.url);
  const take = Math.min(2000, Math.max(50, Number(url.searchParams.get("take") ?? "500")));
  const cursor = url.searchParams.get("cursor");

  const rows = await prisma.examQuestion.findMany({
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { id: "asc" },
    where: { status: { in: ["published", "in_review", "draft"] } },
    select: {
      id: true,
      stem: true,
      rationale: true,
      questionType: true,
      countryCode: true,
      tier: true,
      status: true,
      exam: true,
      topic: true,
      tags: true,
      updatedAt: true,
    },
  });

  const nextCursor = rows.length > take ? rows[take - 1]?.id : null;
  const page = nextCursor ? rows.slice(0, take) : rows;

  return NextResponse.json({
    exported: "questions",
    count: page.length,
    nextCursor,
    rows: page,
  });
}
