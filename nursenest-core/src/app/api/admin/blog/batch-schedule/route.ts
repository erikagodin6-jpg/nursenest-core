import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { handleBlogBatchScheduleAdminPost } from "@/lib/blog/blog-batch-schedule-admin-post";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const rows = await prisma.blogBatchSchedule.findMany({
    orderBy: { createdAt: "desc" },
    take: 40,
    select: {
      id: true,
      status: true,
      cadencePerDay: true,
      startAt: true,
      nextRunAt: true,
      lastRunAt: true,
      totalItems: true,
      publishedCount: true,
      failedCount: true,
      skippedCount: true,
      exam: true,
      country: true,
      defaultTemplate: true,
      publishMode: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ schedules: rows });
}

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  return handleBlogBatchScheduleAdminPost(req, gate, "save");
}
