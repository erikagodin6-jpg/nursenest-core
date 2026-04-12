import {
  BlogBatchPublishMode,
  BlogBatchScheduleItemStatus,
  BlogBatchScheduleStatus,
  BlogFunnelStage,
  BlogPostIntent,
  BlogPostTemplate,
} from "@prisma/client";
import { normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { generateBlogAiDraft } from "@/lib/blog/generate-blog-ai-draft";
import { runBlogBatchLocalizedFollowup } from "@/lib/blog/blog-batch-localized-followup";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Min interval between slots: 1 post per day max spacing when cadence is 1. */
export function slotIntervalMs(cadencePerDay: number): number {
  const safe = Math.max(1, Math.min(24, cadencePerDay));
  return (24 * 60 * 60 * 1000) / safe;
}

export type ParsedTopicLines = {
  topics: string[];
  /** Lines dropped as duplicate canonical intent within the paste. */
  droppedDuplicateLines: number;
};

/** One topic per line; trim; drop empties; first occurrence wins per canonical key. */
export function parseTopicLines(raw: string): ParsedTopicLines {
  const lines = raw.split(/\r?\n/);
  const seen = new Set<string>();
  const topics: string[] = [];
  let droppedDuplicateLines = 0;
  for (const line of lines) {
    const t = line.trim();
    if (t.length < 3) continue;
    const key = normalizeBlogTopicKey(t);
    if (!key) continue;
    if (seen.has(key)) {
      droppedDuplicateLines += 1;
      continue;
    }
    seen.add(key);
    topics.push(t);
  }
  return { topics, droppedDuplicateLines };
}

function splitTabbedTopicAndIsoDate(line: string): { topic: string; at: Date } | null {
  const parts = line
    .split("\t")
    .map((s) => s.trim())
    .filter((p) => p.length > 0);
  if (parts.length !== 2) return null;
  const [a, b] = parts;
  const tryA = Date.parse(a);
  const tryB = Date.parse(b);
  const aOk = !Number.isNaN(tryA);
  const bOk = !Number.isNaN(tryB);
  if (aOk && !bOk) return { at: new Date(tryA), topic: b };
  if (bOk && !aOk) return { at: new Date(tryB), topic: a };
  return null;
}

function parseCustomDateTopicLines(
  raw: string,
): { rows: { topic: string; at: Date }[]; droppedDuplicateLines: number } | { error: string } {
  const lines = raw.split(/\r?\n/);
  const seen = new Set<string>();
  const rows: { topic: string; at: Date }[] = [];
  let droppedDuplicateLines = 0;
  let lineNum = 0;
  for (const line of lines) {
    lineNum += 1;
    const trimmed = line.trim();
    if (trimmed.length < 3) continue;
    const parsed = splitTabbedTopicAndIsoDate(trimmed);
    if (!parsed) {
      return {
        error: `Line ${lineNum}: expected "ISO8601<TAB>topic" or "topic<TAB>ISO8601" (tab-separated date + topic).`,
      };
    }
    const key = normalizeBlogTopicKey(parsed.topic);
    if (!key) {
      return { error: `Line ${lineNum}: topic is too short or invalid after parsing.` };
    }
    if (seen.has(key)) {
      droppedDuplicateLines += 1;
      continue;
    }
    seen.add(key);
    rows.push({ topic: parsed.topic, at: parsed.at });
  }
  if (rows.length === 0) {
    return { error: "No valid dated topic lines (each non-empty line needs a tab-separated ISO date and topic)." };
  }
  if (rows.length > 500) {
    return { error: "Too many topics (max 500 after dedupe)." };
  }
  return { rows, droppedDuplicateLines };
}

export type BlogBatchScheduleRowInput = {
  topicsText: string;
  publishMode: BlogBatchPublishMode;
  startAt: Date;
  cadencePerDay: number;
};

export type BlogBatchScheduleBuiltRow = {
  topic: string;
  plannedPublishAt: Date;
  canonicalTopicKey: string | null;
};

export function buildBlogBatchScheduleItemRows(
  input: BlogBatchScheduleRowInput,
):
  | { ok: true; rows: BlogBatchScheduleBuiltRow[]; droppedDuplicateLines: number }
  | { ok: false; error: string } {
  if (input.publishMode === BlogBatchPublishMode.CUSTOM_DATES) {
    const parsed = parseCustomDateTopicLines(input.topicsText);
    if ("error" in parsed) return { ok: false, error: parsed.error };
    const rows = parsed.rows.map((r) => ({
      topic: r.topic,
      plannedPublishAt: r.at,
      canonicalTopicKey: normalizeBlogTopicKey(r.topic),
    }));
    return { ok: true, rows, droppedDuplicateLines: parsed.droppedDuplicateLines };
  }

  const { topics, droppedDuplicateLines } = parseTopicLines(input.topicsText);
  if (topics.length === 0) {
    return { ok: false, error: "No valid topics (need at least one line with 3+ characters)." };
  }
  if (topics.length > 500) {
    return { ok: false, error: "Too many topics (max 500 after dedupe)." };
  }

  const interval = slotIntervalMs(input.cadencePerDay);

  if (input.publishMode === BlogBatchPublishMode.PUBLISH_IMMEDIATE) {
    const slot = input.startAt;
    const rows = topics.map((topic) => ({
      topic,
      plannedPublishAt: slot,
      canonicalTopicKey: normalizeBlogTopicKey(topic),
    }));
    return { ok: true, rows, droppedDuplicateLines };
  }

  const rows = topics.map((topic, i) => ({
    topic,
    plannedPublishAt: new Date(input.startAt.getTime() + i * interval),
    canonicalTopicKey: normalizeBlogTopicKey(topic),
  }));
  return { ok: true, rows, droppedDuplicateLines };
}

function effectivePublishAtForBatchItem(
  publishMode: BlogBatchPublishMode,
  itemPlannedPublishAt: Date,
  now: Date,
): Date | undefined {
  if (publishMode === BlogBatchPublishMode.DRAFT_ONLY) return undefined;
  if (publishMode === BlogBatchPublishMode.PUBLISH_IMMEDIATE) return now;
  return itemPlannedPublishAt;
}

export type ProcessBatchSchedulesResult = {
  processedItems: number;
  schedulesTouched: string[];
  errors: string[];
};

const MAX_ITEMS_PER_INVOCATION = 12;

/**
 * Picks due PENDING items (plannedPublishAt <= now), generates AI drafts, schedules publication.
 * Safe to run from cron every few minutes. One failure does not stop other items.
 */
export async function processDueBlogBatchScheduleItems(now: Date = new Date()): Promise<ProcessBatchSchedulesResult> {
  const errors: string[] = [];
  const schedulesTouched = new Set<string>();
  let processedItems = 0;

  const stale = await prisma.blogBatchScheduleItem.findMany({
    where: {
      status: BlogBatchScheduleItemStatus.GENERATING,
      updatedAt: { lt: new Date(now.getTime() - 25 * 60 * 1000) },
    },
    select: { id: true, scheduleId: true },
  });
  for (const s of stale) {
    schedulesTouched.add(s.scheduleId);
  }
  if (stale.length > 0) {
    await prisma.blogBatchScheduleItem.updateMany({
      where: {
        status: BlogBatchScheduleItemStatus.GENERATING,
        updatedAt: { lt: new Date(now.getTime() - 25 * 60 * 1000) },
      },
      data: {
        status: BlogBatchScheduleItemStatus.FAILED,
        failureReason: "stale_generating_timeout",
      },
    });
    for (const sid of schedulesTouched) {
      await refreshBlogBatchScheduleStats(sid);
    }
  }

  const aiEnabled = isAdminAiGenerationEnabled();
  const keyCheck = assertOpenAiKeyConfigured();
  if (!aiEnabled || !keyCheck.ok) {
    const hint = !keyCheck.ok ? keyCheck.message : "AI_ADMIN_GENERATION_ENABLED=false";
    safeServerLog("blog_batch_schedule", "skipped_ai_disabled", { aiEnabled, keyOk: keyCheck.ok });
    return { processedItems: 0, schedulesTouched: [], errors: [hint] };
  }

  const due = await prisma.blogBatchScheduleItem.findMany({
    where: {
      status: BlogBatchScheduleItemStatus.PENDING,
      plannedPublishAt: { lte: now },
      schedule: { status: BlogBatchScheduleStatus.ACTIVE },
    },
    orderBy: [{ plannedPublishAt: "asc" }, { ordinal: "asc" }],
    take: MAX_ITEMS_PER_INVOCATION,
    include: {
      schedule: true,
    },
  });

  for (const item of due) {
    const { schedule } = item;
    schedulesTouched.add(schedule.id);

    try {
      await prisma.blogBatchScheduleItem.update({
        where: { id: item.id },
        data: { status: BlogBatchScheduleItemStatus.GENERATING },
      });

      const template = schedule.defaultTemplate ?? BlogPostTemplate.TOPIC_EXPLAINED;
      const intent = schedule.defaultIntent ?? BlogPostIntent.EXAM_PREP;

      const publishAt = effectivePublishAtForBatchItem(schedule.publishMode, item.plannedPublishAt, now);

      const result = await generateBlogAiDraft({
        topic: item.topicRaw,
        exam: schedule.exam,
        country: schedule.country === "US" || schedule.country === "CA" ? schedule.country : "unspecified",
        template,
        intent,
        funnelStage: BlogFunnelStage.CONSIDERATION,
        targetKeyword: item.topicRaw,
        publishAt,
      });

      if (!result.ok) {
        await prisma.blogBatchScheduleItem.update({
          where: { id: item.id },
          data: {
            status: BlogBatchScheduleItemStatus.FAILED,
            failureReason: result.error.slice(0, 4000),
          },
        });
        processedItems += 1;
        await refreshBlogBatchScheduleStats(schedule.id);
        continue;
      }

      if (result.skipped) {
        const reason =
          result.reason === "duplicate_topic" ?
            `duplicate_topic:existing=${result.existingSlug ?? "?"}`
          : `skipped:${result.reason}`;
        const existingId =
          result.reason === "duplicate_topic" && result.existingSlug ?
            await prisma.blogPost.findUnique({ where: { slug: result.existingSlug }, select: { id: true } })
          : null;

        await prisma.blogBatchScheduleItem.update({
          where: { id: item.id },
          data: {
            status: BlogBatchScheduleItemStatus.SKIPPED,
            failureReason: reason.slice(0, 4000),
            blogPostId: existingId?.id ?? null,
          },
        });
        processedItems += 1;
        await refreshBlogBatchScheduleStats(schedule.id);
        continue;
      }

      await prisma.blogBatchScheduleItem.update({
        where: { id: item.id },
        data: {
          status: BlogBatchScheduleItemStatus.PUBLISHED,
          blogPostId: result.post.id,
          failureReason: null,
        },
      });
      processedItems += 1;
      await refreshBlogBatchScheduleStats(schedule.id);

      const locRaw = schedule.localizationOptions;
      const locObj =
        locRaw && typeof locRaw === "object" && !Array.isArray(locRaw) ?
          (locRaw as { locales?: unknown }).locales
        : null;
      if (Array.isArray(locObj) && locObj.length > 0) {
        const locales = locObj.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
        if (locales.length > 0) {
          try {
            await runBlogBatchLocalizedFollowup({
              canonicalArticleId: result.post.id,
              locales,
              scheduleCountry: schedule.country,
              exam: schedule.exam,
            });
          } catch (e) {
            const m = e instanceof Error ? e.message : String(e);
            errors.push(`localization:${result.post.slug}:${m}`);
            safeServerLog("blog_batch_schedule", "localized_followup_failed", { postId: result.post.id, message: m });
          }
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${item.id}: ${msg}`);
      await prisma.blogBatchScheduleItem
        .update({
          where: { id: item.id },
          data: {
            status: BlogBatchScheduleItemStatus.FAILED,
            failureReason: msg.slice(0, 4000),
          },
        })
        .catch(() => {});
      await refreshBlogBatchScheduleStats(schedule.id);
    }
  }

  if (schedulesTouched.size > 0) {
    await prisma.blogBatchSchedule.updateMany({
      where: { id: { in: [...schedulesTouched] } },
      data: { lastRunAt: now },
    });
  }

  return { processedItems, schedulesTouched: [...schedulesTouched], errors };
}

export async function refreshBlogBatchScheduleStats(scheduleId: string): Promise<void> {
  const schedule = await prisma.blogBatchSchedule.findUnique({
    where: { id: scheduleId },
    select: { id: true, status: true },
  });
  if (!schedule) return;

  const counts = await prisma.blogBatchScheduleItem.groupBy({
    by: ["status"],
    where: { scheduleId },
    _count: { id: true },
  });
  const map = Object.fromEntries(counts.map((c) => [c.status, c._count.id])) as Record<string, number>;
  const published = map.PUBLISHED ?? 0;
  const failed = map.FAILED ?? 0;
  const skipped = map.SKIPPED ?? 0;
  const pending = map.PENDING ?? 0;
  const generating = map.GENERATING ?? 0;

  const nextPending = await prisma.blogBatchScheduleItem.findFirst({
    where: { scheduleId, status: BlogBatchScheduleItemStatus.PENDING },
    orderBy: { plannedPublishAt: "asc" },
    select: { plannedPublishAt: true },
  });

  let nextStatus = schedule.status;
  if (
    schedule.status === BlogBatchScheduleStatus.ACTIVE &&
    pending === 0 &&
    generating === 0
  ) {
    nextStatus = BlogBatchScheduleStatus.COMPLETED;
  }

  await prisma.blogBatchSchedule.update({
    where: { id: scheduleId },
    data: {
      publishedCount: published,
      failedCount: failed,
      skippedCount: skipped,
      nextRunAt: nextPending?.plannedPublishAt ?? null,
      status: nextStatus,
    },
  });
}
