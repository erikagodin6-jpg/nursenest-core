import { BlogBatchScheduleStatus } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { refreshBlogBatchScheduleStats } from "@/lib/blog/blog-batch-schedule";
import { prisma } from "@/lib/db";

const patchSchema = z.object({
  status: z.enum([BlogBatchScheduleStatus.ACTIVE, BlogBatchScheduleStatus.PAUSED, BlogBatchScheduleStatus.CANCELLED]),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  const { params } = context;
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const { id } = await params;

  const schedule = await prisma.blogBatchSchedule.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { ordinal: "asc" },
        take: 200,
        select: {
          id: true,
          ordinal: true,
          topicRaw: true,
          canonicalTopicKey: true,
          plannedPublishAt: true,
          status: true,
          blogPostId: true,
          failureReason: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!schedule) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ schedule });
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { params } = context;
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const { id } = await params;

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.blogBatchSchedule.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.blogBatchSchedule.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  await refreshBlogBatchScheduleStats(id);

  const schedule = await prisma.blogBatchSchedule.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { ordinal: "desc" },
        take: 30,
        select: {
          id: true,
          ordinal: true,
          topicRaw: true,
          plannedPublishAt: true,
          status: true,
          failureReason: true,
        },
      },
    },
  });

  return NextResponse.json({ ok: true, schedule });
}
