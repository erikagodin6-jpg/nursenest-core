import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const rows = await prisma.internalCourse.findMany({
    orderBy: { updatedAt: "desc" },
    take: 200,
    select: {
      id: true,
      code: true,
      title: true,
      description: true,
      status: true,
      pathwayIds: true,
      updatedAt: true,
      _count: { select: { modules: true } },
    },
  });

  return NextResponse.json({
    courses: rows.map((r) => ({
      id: r.id,
      code: r.code,
      title: r.title,
      description: r.description,
      status: r.status,
      pathwayIds: r.pathwayIds,
      updatedAt: r.updatedAt.toISOString(),
      moduleCount: r._count.modules,
    })),
  });
}
