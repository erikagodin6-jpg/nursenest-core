import {
  BlogBatchPublishMode,
  BlogBatchScheduleItemStatus,
  BlogBatchScheduleStatus,
  BlogFunnelStage,
  BlogPostIntent,
  BlogPostTemplate,
} from "@prisma/client";
import { normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import {
  normalizeBlogTopicIntent,
  partitionBlogTopicsBySeoIntent,
  validateBlogTopicForSeoArticleGeneration,
} from "@/lib/blog/blog-seo-topic-intent";
import { generateBlogPost } from "@/lib/blog/generate-blog-ai-draft";
import { prepareAdminBlogGenerationInput } from "@/lib/blog/admin-blog-generation-service";
import { runBlogBatchLocalizedFollowup } from "@/lib/blog/blog-batch-localized-followup";
import { getAdminAiGenerationGate } from "@/lib/ai/admin-ai-policy";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  classifyBlogPipelineFailureForRepair,
  formatBlogBatchItemFailureMessage,
  isTransientBlogProviderError,
} from "@/lib/blog/blog-generation-repair-classifier";

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
  /** Used to validate NCLEX-style topic intent (recommended — matches schedule exam). */
  exam?: string | null;
};

export type BlogBatchScheduleBuiltRow = {
  topic: string;
  plannedPublishAt: Date;
  canonicalTopicKey: string | null;
};

export type BlogBatchTopicIntentRejection = { topic: string; reason: string };

export function buildBlogBatchScheduleItemRows(
  input: BlogBatchScheduleRowInput,
):
  | { ok: true; rows: BlogBatchScheduleBuiltRow[]; droppedDuplicateLines: number; rejectedTopics: BlogBatchTopicIntentRejection[] }
  | { ok: false; error: string } {
  const examForIntent = input.exam ?? null;

  if (input.publishMode === BlogBatchPublishMode.CUSTOM_DATES) {
    const parsed = parseCustomDateTopicLines(input.topicsText);
    if ("error" in parsed) return { ok: false, error: parsed.error };
    const rejectedTopics: BlogBatchTopicIntentRejection[] = [];
    const rows: BlogBatchScheduleBuiltRow[] = [];
    for (const r of parsed.rows) {
      const gate = validateBlogTopicForSeoArticleGeneration(r.topic, examForIntent);
      if (!gate.ok) {
        rejectedTopics.push({ topic: r.topic, reason: gate.reason });
        continue;
      }
      const normalized = normalizeBlogTopicIntent(r.topic, examForIntent);
      const topicForSchedule = normalized.accepted ? normalized.normalizedTopic : r.topic;
      rows.push({
        topic: topicForSchedule,
        plannedPublishAt: r.at,
        canonicalTopicKey: normalizeBlogTopicKey(topicForSchedule),
      });
    }
    if (rows.length === 0) {
      return {
        ok: false,
        error:
          parsed.rows.length > 0 ?
            "All dated topics failed nursing SEO intent validation. Fix titles to be NCLEX-style (questions, priorities, vs, labs, nurse-first stems) and include exam context."
          : "No valid dated topic lines.",
      };
    }
    return { ok: true, rows, droppedDuplicateLines: parsed.droppedDuplicateLines, rejectedTopics };
  }

  const { topics, droppedDuplicateLines } = parseTopicLines(input.topicsText);
  if (topics.length === 0) {
    return { ok: false, error: "No valid topics (need at least one line with 3+ characters)." };
  }
  if (topics.length > 500) {
    return { ok: false, error: "Too many topics (max 500 after dedupe)." };
  }

  const { approved, rejected } = partitionBlogTopicsBySeoIntent(topics, examForIntent);
  if (approved.length === 0) {
    return {
      ok: false,
      error:
        "All topics failed nursing SEO intent validation. Use high-intent stems (e.g. NCLEX questions for…, priority nursing interventions for…, condition A vs B nursing differences) and tie each line to a clinical domain plus exam context.",
    };
  }

  const interval = slotIntervalMs(input.cadencePerDay);

  if (input.publishMode === BlogBatchPublishMode.PUBLISH_IMMEDIATE) {
    const slot = input.startAt;
    const rows = approved.map((topic) => ({
      topic,
      plannedPublishAt: slot,
      canonicalTopicKey: normalizeBlogTopicKey(topic),
    }));
    return { ok: true, rows, droppedDuplicateLines, rejectedTopics: rejected };
  }

  const rows = approved.map((topic, i) => ({
    topic,
    plannedPublishAt: new Date(input.startAt.getTime() + i * interval),
    canonicalTopicKey: normalizeBlogTopicKey(topic),
  }));
  return { ok: true, rows, droppedDuplicateLines, rejectedTopics: rejected };
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
const AUTOPILOT_QUEUE_TARGET_MIN = 20;
const AUTOPILOT_QUEUE_TARGET_MAX = 50;
const AUTOPILOT_REFILL_TRIGGER = 5;

const AUTOPILOT_SYMPTOM_TOPICS = [
  "chest pain triage priorities",
  "shortness of breath initial nursing actions",
  "sudden confusion and delirium workup cues",
  "new onset edema assessment priorities",
  "fever source tracing in inpatient units",
  "acute abdominal pain red flags",
  "post-op hypotension bedside response",
  "headache danger signs and escalation",
];

const AUTOPILOT_CLINICAL_TOPICS = [
  "sepsis bundle nursing breakdown",
  "DKA nursing management flow",
  "heart failure exacerbation bedside algorithm",
  "stroke code nursing timeline",
  "postpartum hemorrhage first-hour actions",
  "acute kidney injury monitoring plan",
  "GI bleed stabilization checklist",
  "respiratory failure escalation ladder",
];

const AUTOPILOT_COMPARISON_TOPICS = [
  "hypovolemia vs sepsis in early presentation",
  "stable angina vs myocardial infarction priorities",
  "COPD exacerbation vs asthma exacerbation response",
  "DKA vs HHS bedside nursing differences",
  "SIADH vs diabetes insipidus exam traps",
  "ischemic stroke vs hemorrhagic stroke first actions",
];

type DailyBlogAutopilotResult = {
  dailyCadence: number;
  queueSize: number;
  queueTargetMin: number;
  queueTargetMax: number;
  generationTriggered: boolean;
  generatedTopicsAdded: number;
  activeScheduleId: string | null;
  nextPublishAt: string | null;
  contentTypes: string[];
  notes: string[];
};

function configuredDailyCadence(): number {
  const raw = Number(process.env.BLOG_AUTOPILOT_DAILY_POSTS ?? "2");
  if (!Number.isFinite(raw)) return 2;
  return Math.max(1, Math.min(3, Math.round(raw)));
}

function buildAutopilotTopic(index: number, exam: string): string {
  const symptom = AUTOPILOT_SYMPTOM_TOPICS[index % AUTOPILOT_SYMPTOM_TOPICS.length];
  const clinical = AUTOPILOT_CLINICAL_TOPICS[index % AUTOPILOT_CLINICAL_TOPICS.length];
  const comparison = AUTOPILOT_COMPARISON_TOPICS[index % AUTOPILOT_COMPARISON_TOPICS.length];
  const kind = index % 5;
  if (kind === 0) return `NCLEX questions for ${clinical} (${exam})`;
  if (kind === 1) return `Priority nursing interventions for ${symptom} (${exam})`;
  if (kind === 2) return `${comparison} for ${exam} clinical judgment`;
  if (kind === 3) return `Labs for ${clinical.split(/\s+/).slice(0, 6).join(" ")} explained for nurses (${exam})`;
  return `What should the nurse do first in ${clinical}? (${exam})`;
}

export async function ensureDailyBlogQueue(now: Date = new Date()): Promise<DailyBlogAutopilotResult> {
  const cadence = configuredDailyCadence();
  const notes: string[] = [];
  const contentTypes = [
    "NCLEX-style question stems",
    "priority intervention drills",
    "vs comparison judgment",
    "labs-for-nurses explainers",
    "nurse-do-first triage stems",
  ];

  const [queueSize, existingActiveSchedule] = await Promise.all([
    prisma.blogBatchScheduleItem.count({
      where: {
        status: BlogBatchScheduleItemStatus.PENDING,
        schedule: { status: BlogBatchScheduleStatus.ACTIVE },
      },
    }),
    prisma.blogBatchSchedule.findFirst({
      where: { status: BlogBatchScheduleStatus.ACTIVE, publishMode: BlogBatchPublishMode.STAGGERED_PUBLISH },
      orderBy: { createdAt: "desc" },
      select: { id: true, cadencePerDay: true, exam: true, country: true },
    }),
  ]);

  let activeScheduleId = existingActiveSchedule?.id ?? null;
  if (queueSize >= AUTOPILOT_QUEUE_TARGET_MIN) {
    return {
      dailyCadence: cadence,
      queueSize,
      queueTargetMin: AUTOPILOT_QUEUE_TARGET_MIN,
      queueTargetMax: AUTOPILOT_QUEUE_TARGET_MAX,
      generationTriggered: false,
      generatedTopicsAdded: 0,
      activeScheduleId,
      nextPublishAt: null,
      contentTypes,
      notes,
    };
  }

  const needsGeneration = queueSize < AUTOPILOT_REFILL_TRIGGER;
  if (needsGeneration) {
    notes.push(`Queue below ${AUTOPILOT_REFILL_TRIGGER}; triggering queue generation.`);
  } else {
    notes.push(`Queue below target ${AUTOPILOT_QUEUE_TARGET_MIN}; topping up.`);
  }

  const targetQueueSize = AUTOPILOT_QUEUE_TARGET_MIN;
  const desiredAdds = Math.max(0, Math.min(AUTOPILOT_QUEUE_TARGET_MAX - queueSize, targetQueueSize - queueSize));
  if (desiredAdds === 0) {
    return {
      dailyCadence: cadence,
      queueSize,
      queueTargetMin: AUTOPILOT_QUEUE_TARGET_MIN,
      queueTargetMax: AUTOPILOT_QUEUE_TARGET_MAX,
      generationTriggered: needsGeneration,
      generatedTopicsAdded: 0,
      activeScheduleId,
      nextPublishAt: null,
      contentTypes,
      notes,
    };
  }

  const intervalMs = slotIntervalMs(cadence);
  const [lastPending, existingKeysFromQueue, existingKeysFromPosts] = await Promise.all([
    prisma.blogBatchScheduleItem.findFirst({
      where: {
        status: BlogBatchScheduleItemStatus.PENDING,
        schedule: { status: BlogBatchScheduleStatus.ACTIVE },
      },
      orderBy: { plannedPublishAt: "desc" },
      select: { plannedPublishAt: true },
    }),
    prisma.blogBatchScheduleItem.findMany({
      where: {
        status: { in: [BlogBatchScheduleItemStatus.PENDING, BlogBatchScheduleItemStatus.GENERATING] },
        canonicalTopicKey: { not: null },
        schedule: { status: BlogBatchScheduleStatus.ACTIVE },
      },
      select: { canonicalTopicKey: true },
      take: 1000,
    }),
    prisma.blogPost.findMany({
      where: {
        OR: [{ targetKeyword: { not: null } }, { keywordCluster: { not: null } }],
      },
      select: { targetKeyword: true, keywordCluster: true },
      take: 3000,
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const knownKeys = new Set<string>();
  for (const row of existingKeysFromQueue) {
    if (row.canonicalTopicKey) knownKeys.add(row.canonicalTopicKey);
  }
  for (const row of existingKeysFromPosts) {
    if (row.targetKeyword) knownKeys.add(normalizeBlogTopicKey(row.targetKeyword));
    if (row.keywordCluster) knownKeys.add(normalizeBlogTopicKey(row.keywordCluster));
  }

  const exam = existingActiveSchedule?.exam ?? "NCLEX-RN";
  const country = existingActiveSchedule?.country ?? "US";
  const baseAt = lastPending?.plannedPublishAt && lastPending.plannedPublishAt > now ? lastPending.plannedPublishAt : now;

  const topics: Array<{ topic: string; key: string }> = [];
  let cursor = queueSize;
  while (topics.length < desiredAdds && cursor < queueSize + desiredAdds * 6) {
    const candidate = buildAutopilotTopic(cursor, exam);
    const key = normalizeBlogTopicKey(candidate);
    cursor += 1;
    if (!key || knownKeys.has(key)) continue;
    knownKeys.add(key);
    topics.push({ topic: candidate, key });
  }

  if (topics.length === 0) {
    notes.push("No unique topics available for autopilot queue refill.");
    return {
      dailyCadence: cadence,
      queueSize,
      queueTargetMin: AUTOPILOT_QUEUE_TARGET_MIN,
      queueTargetMax: AUTOPILOT_QUEUE_TARGET_MAX,
      generationTriggered: needsGeneration,
      generatedTopicsAdded: 0,
      activeScheduleId,
      nextPublishAt: null,
      contentTypes,
      notes,
    };
  }

  if (!existingActiveSchedule) {
    const created = await prisma.blogBatchSchedule.create({
      data: {
        status: BlogBatchScheduleStatus.ACTIVE,
        publishMode: BlogBatchPublishMode.STAGGERED_PUBLISH,
        cadencePerDay: cadence,
        startAt: now,
        totalItems: 0,
        exam,
        country,
        defaultTemplate: BlogPostTemplate.TOPIC_EXPLAINED,
        defaultIntent: BlogPostIntent.EXAM_PREP,
        nextRunAt: now,
      },
      select: { id: true },
    });
    activeScheduleId = created.id;
    notes.push("Created an autopilot batch schedule.");
  }

  if (!activeScheduleId) {
    return {
      dailyCadence: cadence,
      queueSize,
      queueTargetMin: AUTOPILOT_QUEUE_TARGET_MIN,
      queueTargetMax: AUTOPILOT_QUEUE_TARGET_MAX,
      generationTriggered: needsGeneration,
      generatedTopicsAdded: 0,
      activeScheduleId: null,
      nextPublishAt: null,
      contentTypes,
      notes: [...notes, "No active schedule available for queue refill."],
    };
  }

  const currentTotal = await prisma.blogBatchScheduleItem.count({ where: { scheduleId: activeScheduleId } });
  const rows = topics.map((topic, index) => ({
    scheduleId: activeScheduleId,
    ordinal: currentTotal + index + 1,
    topicRaw: topic.topic,
    canonicalTopicKey: topic.key,
    plannedPublishAt: new Date(baseAt.getTime() + (index + 1) * intervalMs),
  }));
  await prisma.blogBatchScheduleItem.createMany({ data: rows });
  await prisma.blogBatchSchedule.update({
    where: { id: activeScheduleId },
    data: {
      cadencePerDay: cadence,
      totalItems: { increment: rows.length },
      nextRunAt: rows[0]?.plannedPublishAt ?? now,
    },
  });
  await refreshBlogBatchScheduleStats(activeScheduleId);

  const nextPublishAt = rows[0]?.plannedPublishAt ?? null;
  return {
    dailyCadence: cadence,
    queueSize: queueSize + rows.length,
    queueTargetMin: AUTOPILOT_QUEUE_TARGET_MIN,
    queueTargetMax: AUTOPILOT_QUEUE_TARGET_MAX,
    generationTriggered: needsGeneration,
    generatedTopicsAdded: rows.length,
    activeScheduleId,
    nextPublishAt: nextPublishAt ? nextPublishAt.toISOString() : null,
    contentTypes,
    notes,
  };
}

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

  const aiGate = getAdminAiGenerationGate();
  if (!aiGate.runnable) {
    safeServerLog("blog_batch_schedule", "skipped_ai_disabled", {
      mode: aiGate.mode,
      flagEnabled: aiGate.flagEnabled,
      openAiKeyPresent: aiGate.openAiKeyPresent,
    });
    return { processedItems: 0, schedulesTouched: [], errors: [aiGate.summaryLine] };
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

  let providerThrottleBackoffMs = Math.min(
    60_000,
    Math.max(2000, Number(process.env.BLOG_BG_DRAFT_THROTTLE_BACKOFF_MS?.trim()) || 10_000),
  );

  for (const item of due) {
    const { schedule } = item;
    schedulesTouched.add(schedule.id);

    try {
      await prisma.blogBatchScheduleItem.update({
        where: { id: item.id },
        data: { status: BlogBatchScheduleItemStatus.GENERATING },
      });

      const legacyCompat = process.env.BLOG_LEGACY_COMPAT_TOPIC_INTENT?.trim().toLowerCase() === "true";
      const topicIntent = normalizeBlogTopicIntent(item.topicRaw, schedule.exam, { legacyCompatible: legacyCompat });
      if (!topicIntent.accepted) {
        await prisma.blogBatchScheduleItem.update({
          where: { id: item.id },
          data: {
            status: BlogBatchScheduleItemStatus.FAILED,
            failureReason: `topic_intent_rejected: ${topicIntent.reason ?? "rejected"}`.slice(0, 4000),
          },
        });
        processedItems += 1;
        await refreshBlogBatchScheduleStats(schedule.id);
        continue;
      }

      const template = schedule.defaultTemplate ?? BlogPostTemplate.TOPIC_EXPLAINED;
      const intent = schedule.defaultIntent ?? BlogPostIntent.EXAM_PREP;

      const publishAt = effectivePublishAtForBatchItem(schedule.publishMode, item.plannedPublishAt, now);
      const prepared = await prepareAdminBlogGenerationInput({
        rawTitle: topicIntent.normalizedTopic,
        exam: schedule.exam,
        targetKeyword: topicIntent.normalizedTopic,
        publishMode: publishAt ? (publishAt <= now ? "publish_now" : "schedule") : "draft",
        scheduledAt: publishAt,
      });

      const result = await generateBlogPost({
        topic: prepared.topic,
        exam: schedule.exam,
        country: schedule.country === "US" || schedule.country === "CA" ? schedule.country : "unspecified",
        template,
        intent,
        funnelStage: BlogFunnelStage.CONSIDERATION,
        targetKeyword: prepared.targetKeyword,
        slug: prepared.uniqueSlug,
        publishAt,
        generationIdempotencyKey: `batch-schedule:${schedule.id}:${item.id}`,
        legacyCompatible: legacyCompat,
      });

      if (!result.ok) {
        const cl = classifyBlogPipelineFailureForRepair({
          stage: result.stage ?? "body",
          error: result.error,
          code: result.code,
          details: result.details,
        });
        const repairPasses = result.repairPassesUsed ?? 0;
        const failureReason = formatBlogBatchItemFailureMessage({
          originalError: result.error,
          repairAttempts: repairPasses,
          terminal: !cl.recoverable,
        });
        await prisma.blogBatchScheduleItem.update({
          where: { id: item.id },
          data: {
            status: BlogBatchScheduleItemStatus.FAILED,
            failureReason: failureReason.slice(0, 4000),
          },
        });
        processedItems += 1;
        await refreshBlogBatchScheduleStats(schedule.id);
        if (isTransientBlogProviderError(result.error)) {
          safeServerLog("blog_batch_schedule", "provider_throttle_backoff", {
            scheduleId: schedule.id,
            itemId: item.id,
            backoffMs: providerThrottleBackoffMs,
          });
          await new Promise((r) => setTimeout(r, providerThrottleBackoffMs));
          providerThrottleBackoffMs = Math.min(60_000, Math.floor(providerThrottleBackoffMs * 1.5));
        }
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
      const clCatch = classifyBlogPipelineFailureForRepair({ stage: "body", error: msg });
      const failureReason = formatBlogBatchItemFailureMessage({
        originalError: msg,
        repairAttempts: 0,
        terminal: !clCatch.recoverable,
      });
      await prisma.blogBatchScheduleItem
        .update({
          where: { id: item.id },
          data: {
            status: BlogBatchScheduleItemStatus.FAILED,
            failureReason: failureReason.slice(0, 4000),
          },
        })
        .catch(() => {});
      await refreshBlogBatchScheduleStats(schedule.id);
      if (isTransientBlogProviderError(msg)) {
        await new Promise((r) => setTimeout(r, providerThrottleBackoffMs));
        providerThrottleBackoffMs = Math.min(60_000, Math.floor(providerThrottleBackoffMs * 1.5));
      }
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
