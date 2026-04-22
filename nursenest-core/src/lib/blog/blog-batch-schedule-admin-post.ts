import {
  BlogBatchPublishMode,
  BlogBatchScheduleStatus,
  BlogPostIntent,
  BlogPostTemplate,
} from "@prisma/client";
import { NextResponse, type NextResponse as NextResponseType } from "next/server";
import { z } from "zod";
import type { AdminSession } from "@/lib/admin/admin-types";
import {
  buildBlogBatchScheduleItemRows,
  refreshBlogBatchScheduleStats,
  slotIntervalMs,
} from "@/lib/blog/blog-batch-schedule";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
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

export const blogBatchScheduleCreateSchema = z.object({
  topicsText: z.string().max(200_000),
  cadencePerDay: z.number().int().min(1).max(12),
  startAt: z.string().datetime(),
  exam: z.string().min(2).max(80),
  country: z.enum(["US", "CA", "unspecified"]).default("unspecified"),
  defaultTemplate: z.nativeEnum(BlogPostTemplate).default(BlogPostTemplate.TOPIC_EXPLAINED),
  defaultIntent: z.nativeEnum(BlogPostIntent).optional(),
  publishMode: z.nativeEnum(BlogBatchPublishMode).default(BlogBatchPublishMode.STAGGERED_PUBLISH),
  localizationOptions: localizationOptionsSchema.optional(),
  /** Ignored for preview-only route; rejected on save route. */
  dryRun: z.boolean().optional(),
});

export type BlogBatchSchedulePostMode = "preview" | "save";

export type BlogBatchScheduleAdminGate =
  | { ok: false; response: NextResponseType }
  | { ok: true; admin: AdminSession };

/**
 * Shared create / preview handler for admin blog batch scheduling.
 * Preview uses dedicated rate-limit + route so save/processor traffic does not share the same bucket.
 */
export async function handleBlogBatchScheduleAdminPost(
  req: Request,
  gate: BlogBatchScheduleAdminGate,
  mode: BlogBatchSchedulePostMode,
): Promise<NextResponseType> {
  if (!gate.ok) return gate.response;

  const parsed = blogBatchScheduleCreateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  if (mode === "save") {
    const aiBlock = adminAiGenerationHttpBlock();
    if (aiBlock) return aiBlock;
  }

  if (mode === "save" && d.dryRun) {
    return NextResponse.json(
      {
        error: "Use POST /api/admin/blog/batch-schedule/preview for slot preview (dry run).",
        code: "use_preview_endpoint",
      },
      { status: 400 },
    );
  }

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

  if (mode === "preview") {
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
