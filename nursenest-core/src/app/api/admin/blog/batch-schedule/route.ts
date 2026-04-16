import {
  BlogBatchPublishMode,
  BlogBatchScheduleStatus,
  BlogPostIntent,
  BlogPostTemplate,
} from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  buildBlogBatchScheduleItemRows,
  refreshBlogBatchScheduleStats,
  slotIntervalMs,
} from "@/lib/blog/blog-batch-schedule";
import { prisma } from "@/lib/db";
import type { GlobalLocaleCode } from "@/lib/i18n/global-regions";
import { GLOBAL_LOCALE_CODES } from "@/lib/i18n/global-regions";

const localizationOptionsSchema = z
  .object({
    locales: z
      .array(z.string().refine((v): v is GlobalLocaleCode => (GLOBAL_LOCALE_CODES as readonly string[]).includes(v)))
      .max(12),
  })
  .strict();

const createSchema = z.object({
  topicsText: z.string().max(200_000),
  cadencePerDay: z.number().int().min(1).max(12),
  startAt: z.string().datetime(),
  exam: z.string().min(2).max(80),
  country: z.enum(["US", "CA", "unspecified"]).default("unspecified"),
  defaultTemplate: z.nativeEnum(BlogPostTemplate).default(BlogPostTemplate.TOPIC_EXPLAINED),
  defaultIntent: z.nativeEnum(BlogPostIntent).optional(),
  publishMode: z.nativeEnum(BlogBatchPublishMode).default(BlogBatchPublishMode.STAGGERED_PUBLISH),
  localizationOptions: localizationOptionsSchema.optional(),
  dryRun: z.boolean().optional(),
});

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
  if (!gate.ok) return gate.response;

  const parsed = createSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const startAt = new Date(d.startAt);
  const interval = slotIntervalMs(d.cadencePerDay);

  const built = buildBlogBatchScheduleItemRows({
    topicsText: d.topicsText,
    publishMode: d.publishMode,
    startAt,
    cadencePerDay: d.cadencePerDay,
  });
  if (!built.ok) {
    return NextResponse.json({ error: built.error }, { status: 400 });
  }
  const { rows, droppedDuplicateLines } = built;

  if (d.dryRun) {
    const preview = rows.slice(0, 8).map((row) => ({
      topic: row.topic,
      plannedPublishAt: row.plannedPublishAt.toISOString(),
    }));
    return NextResponse.json({
      ok: true,
      dryRun: true,
      totalTopics: rows.length,
      droppedDuplicateLines,
      publishMode: d.publishMode,
      cadencePerDay: d.cadencePerDay,
      slotIntervalMs: interval,
      preview,
    });
  }

  const schedule = await prisma.blogBatchSchedule.create({
    data: {
      status: BlogBatchScheduleStatus.ACTIVE,
      publishMode: d.publishMode,
      localizationOptions: d.localizationOptions ?? undefined,
      cadencePerDay: d.cadencePerDay,
      startAt,
      totalItems: rows.length,
      exam: d.exam,
      country: d.country,
      defaultTemplate: d.defaultTemplate,
      defaultIntent: d.defaultIntent ?? null,
      createdById: gate.admin.userId,
      nextRunAt: rows[0]?.plannedPublishAt ?? startAt,
    },
  });

  await prisma.blogBatchScheduleItem.createMany({
    data: rows.map((row, i) => ({
      scheduleId: schedule.id,
      ordinal: i + 1,
      topicRaw: row.topic,
      canonicalTopicKey: row.canonicalTopicKey,
      plannedPublishAt: row.plannedPublishAt,
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
