import { BlogBatchScheduleStatus, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  parseTopicLines,
  refreshBlogBatchScheduleStats,
  slotIntervalMs,
} from "@/lib/blog/blog-batch-schedule";
import { normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  topicsText: z.string().max(200_000),
  cadencePerDay: z.number().int().min(1).max(12),
  startAt: z.string().datetime(),
  exam: z.string().min(2).max(80),
  country: z.enum(["US", "CA", "unspecified"]).default("unspecified"),
  defaultTemplate: z.nativeEnum(BlogPostTemplate).default(BlogPostTemplate.TOPIC_EXPLAINED),
  defaultIntent: z.nativeEnum(BlogPostIntent).optional(),
  dryRun: z.boolean().optional(),
});

export async function GET() {
  const gate = await requireAdmin();
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
      createdAt: true,
    },
  });

  return NextResponse.json({ schedules: rows });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const parsed = createSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const { topics, droppedDuplicateLines } = parseTopicLines(d.topicsText);
  if (topics.length === 0) {
    return NextResponse.json({ error: "No valid topics (need at least one line with 3+ characters)." }, { status: 400 });
  }
  if (topics.length > 500) {
    return NextResponse.json({ error: "Too many topics (max 500 after dedupe)." }, { status: 400 });
  }

  const startAt = new Date(d.startAt);
  const interval = slotIntervalMs(d.cadencePerDay);

  if (d.dryRun) {
    const preview = topics.slice(0, 8).map((topic, i) => ({
      topic,
      plannedPublishAt: new Date(startAt.getTime() + i * interval).toISOString(),
    }));
    return NextResponse.json({
      ok: true,
      dryRun: true,
      totalTopics: topics.length,
      droppedDuplicateLines,
      cadencePerDay: d.cadencePerDay,
      slotIntervalMs: interval,
      preview,
    });
  }

  const schedule = await prisma.blogBatchSchedule.create({
    data: {
      status: BlogBatchScheduleStatus.ACTIVE,
      cadencePerDay: d.cadencePerDay,
      startAt,
      totalItems: topics.length,
      exam: d.exam,
      country: d.country,
      defaultTemplate: d.defaultTemplate,
      defaultIntent: d.defaultIntent ?? null,
      createdById: gate.admin.userId,
      nextRunAt: startAt,
    },
  });

  await prisma.blogBatchScheduleItem.createMany({
    data: topics.map((topic, i) => ({
      scheduleId: schedule.id,
      ordinal: i + 1,
      topicRaw: topic,
      canonicalTopicKey: normalizeBlogTopicKey(topic),
      plannedPublishAt: new Date(startAt.getTime() + i * interval),
    })),
  });

  await refreshBlogBatchScheduleStats(schedule.id);

  const fresh = await prisma.blogBatchSchedule.findUnique({
    where: { id: schedule.id },
    include: {
      items: {
        orderBy: { ordinal: "asc" },
        take: 15,
        select: {
          id: true,
          ordinal: true,
          topicRaw: true,
          plannedPublishAt: true,
          status: true,
          blogPostId: true,
          failureReason: true,
        },
      },
    },
  });

  return NextResponse.json({ ok: true, schedule: fresh, droppedDuplicateLines });
}
