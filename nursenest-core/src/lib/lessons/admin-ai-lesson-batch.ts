import { createHash } from "node:crypto";
import {
  DraftReviewStatus,
  JobStatus,
  type LessonBatchQueueItem as LessonBatchQueueRow,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";
import { ADMIN_AI_LESSON_GENERATOR_TOOL } from "@/lib/lessons/admin-ai-lesson-pipeline";
import type { AdminAiLessonPathway, AdminAiLessonType } from "@/lib/lessons/admin-ai-lesson-schema";

export const ADMIN_LESSON_BATCH_TOOL = "ADMIN_LESSON_BATCH";

export const STALE_GENERATING_MS = 25 * 60 * 1000;

export type LessonBatchItemStatus =
  | "pending"
  | "generating"
  | "completed"
  | "failed"
  | "skipped_duplicate"
  | "canceled";

/**
 * One queue row as returned to admin API/UI (ISO 8601 timestamps).
 * DB-backed rows are fully populated; legacy JSON may be normalized via `normalizeLessonBatchItemFromLegacy`.
 */
export type LessonBatchItem = {
  itemId: string;
  /** 0-based order within the batch (matches `LessonBatchQueueItem.position`). */
  position: number;
  topic: string;
  /** Normalized topic (trim, collapse spaces, lower case). */
  normalizedTopic: string;
  batchTopicKey: string;
  status: LessonBatchItemStatus;
  /** When the row entered `generating` (claim). */
  startedAt: string | null;
  /** UUID from the HTTP worker that claimed the row (tracing). */
  claimedByRequestId: string | null;
  /** Successful generation output draft id. */
  draftId?: string;
  /** When `skipped_duplicate` — existing draft with same fingerprint. */
  existingDraftId?: string;
  /** Processing attempts (increments on each claim). */
  attemptCount: number;
  lastAttemptAt: string | null;
  lastError: string | null;
  completedAt: string | null;
  skippedAt: string | null;
  /** When the row was set to `canceled` / DB `CANCELLED`. */
  canceledAt: string | null;
  revivedAt: string | null;
  revivalCount: number;
  generatedDraftTitle: string | null;
  /** @deprecated Use `lastError` */
  error?: string;
};

export type LessonBatchResultSummaryV1 = {
  version: 1;
  items: LessonBatchItem[];
  allowDuplicates: boolean;
  /** Echo of settings for UI */
  settings: {
    pathway: AdminAiLessonPathway;
    country: "CA" | "US";
    topicDomain: string;
    lessonType: AdminAiLessonType;
    difficulty?: "foundation" | "intermediate" | "advanced";
    relatedCategoryIds: string[];
  };
  /**
   * Denormalized counts persisted by `syncJobResultSummaryJson` for reporting.
   * Recompute with `resolveLessonBatchDerived` if missing (legacy payloads).
   */
  derived?: LessonBatchDerivedSummary;
};

export type LessonBatchDerivedSummary = {
  total: number;
  pending: number;
  generating: number;
  completed: number;
  failed: number;
  skipped_duplicate: number;
  canceled: number;
  remaining: number;
  /** True when every item is in a terminal state */
  allTerminal: boolean;
};

/** Serialized `AiGenerationJob` fields for lesson batch admin APIs. */
export type AdminLessonBatchJobSnapshot = {
  id: string;
  status: JobStatus;
  model: string | null;
  error: string | null;
  tokensUsed: number | null;
  createdAt: string;
  updatedAt: string;
  /** Present when the batch was canceled via admin API. */
  lessonBatchCanceledAt: string | null;
};

export function normalizeBatchTopic(topic: string): string {
  return topic.trim().replace(/\s+/g, " ").toLowerCase();
}

/** Single fingerprint builder — use from single-lesson and batch flows. */
export function lessonBatchTopicKey(
  topic: string,
  pathway: AdminAiLessonPathway,
  country: "CA" | "US",
  lessonType: AdminAiLessonType,
): string {
  const base = [normalizeBatchTopic(topic), pathway, country, lessonType].join("|");
  return createHash("sha256").update(base).digest("hex").slice(0, 40);
}

/** Parse textarea / CSV-ish input into unique topics (first occurrence wins, preserves display casing). */
export function parseTopicList(raw: string): string[] {
  const parts = raw
    .split(/[\n,;]+/g)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    const k = normalizeBatchTopic(p);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  return out;
}

export function parseBatchSummary(raw: unknown): LessonBatchResultSummaryV1 | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.version !== 1 || !Array.isArray(o.items)) return null;
  return raw as LessonBatchResultSummaryV1;
}

/** Recompute derived counts; prefer persisted `summary.derived` when trusted. */
export function resolveLessonBatchDerived(summary: LessonBatchResultSummaryV1): LessonBatchDerivedSummary {
  return summary.derived ?? computeBatchDerivedSummary(summary.items);
}

/** Build a fully-typed `LessonBatchItem` from partial input (tests, fixtures). */
export function lessonBatchItemWithDefaults(
  partial: Partial<LessonBatchItem> &
    Pick<LessonBatchItem, "itemId" | "topic" | "batchTopicKey" | "status">,
  index = 0,
): LessonBatchItem {
  return normalizeLessonBatchItemFromLegacy(partial, index);
}

/** Coerce legacy or partial JSON items to `LessonBatchItem` (used after `parseBatchSummary`). */
export function normalizeLessonBatchItemFromLegacy(
  it: LessonBatchItem | (Partial<LessonBatchItem> & { itemId: string; topic: string; batchTopicKey: string }),
  index: number,
): LessonBatchItem {
  const legacyErr = "error" in it && typeof (it as { error?: string }).error === "string" ? (it as { error?: string }).error : undefined;
  const normTopic = it.normalizedTopic ?? normalizeBatchTopic(it.topic);
  const status = it.status ?? "pending";
  const attemptCount = typeof it.attemptCount === "number" ? it.attemptCount : 0;
  const revivalCount = typeof it.revivalCount === "number" ? it.revivalCount : 0;
  const pos = typeof it.position === "number" ? it.position : index;
  const toIsoOrNull = (s: string | null | undefined): string | null => {
    if (s == null || s === "") return null;
    const t = Date.parse(s);
    return Number.isNaN(t) ? null : new Date(t).toISOString();
  };
  const lastErr = it.lastError ?? legacyErr ?? null;
  return {
    itemId: it.itemId,
    position: pos,
    topic: it.topic,
    normalizedTopic: normTopic,
    batchTopicKey: it.batchTopicKey,
    status,
    startedAt: toIsoOrNull(it.startedAt ?? undefined) ?? null,
    claimedByRequestId: it.claimedByRequestId ?? null,
    draftId: it.draftId,
    existingDraftId: it.existingDraftId,
    attemptCount,
    lastAttemptAt: toIsoOrNull(it.lastAttemptAt ?? undefined) ?? null,
    lastError: lastErr,
    completedAt: toIsoOrNull(it.completedAt ?? undefined) ?? null,
    skippedAt: toIsoOrNull(it.skippedAt ?? undefined) ?? null,
    canceledAt: toIsoOrNull(it.canceledAt ?? undefined) ?? null,
    revivedAt: toIsoOrNull(it.revivedAt ?? undefined) ?? null,
    revivalCount,
    generatedDraftTitle: it.generatedDraftTitle ?? null,
    error: status === "failed" && lastErr ? lastErr : undefined,
  };
}

export function isTerminalBatchStatus(s: LessonBatchItemStatus): boolean {
  return s === "completed" || s === "failed" || s === "skipped_duplicate" || s === "canceled";
}

function mapDbStatusToApi(s: LessonBatchQueueRow["status"]): LessonBatchItemStatus {
  switch (s) {
    case "PENDING":
      return "pending";
    case "GENERATING":
      return "generating";
    case "COMPLETED":
      return "completed";
    case "FAILED":
      return "failed";
    case "SKIPPED_DUPLICATE":
      return "skipped_duplicate";
    case "CANCELLED":
      return "canceled";
    default:
      return "pending";
  }
}

function toIso(d: Date | null | undefined): string | null | undefined {
  if (d == null) return d === undefined ? undefined : null;
  return d.toISOString();
}

export function queueRowToLessonBatchItem(row: LessonBatchQueueRow): LessonBatchItem {
  const status = mapDbStatusToApi(row.status);
  const lastErr = row.lastError;
  return {
    itemId: row.publicItemId,
    position: row.position,
    topic: row.topic,
    normalizedTopic: row.normalizedTopic,
    batchTopicKey: row.batchTopicKey,
    status,
    startedAt: toIso(row.startedAt) ?? null,
    claimedByRequestId: row.claimedByRequestId,
    draftId: row.generatedDraftId ?? undefined,
    existingDraftId: row.existingDraftId ?? undefined,
    lastError: lastErr,
    error: status === "failed" && lastErr ? lastErr : undefined,
    attemptCount: row.attemptCount,
    lastAttemptAt: toIso(row.lastAttemptAt) ?? null,
    completedAt: toIso(row.completedAt) ?? null,
    skippedAt: toIso(row.skippedAt) ?? null,
    canceledAt: toIso(row.canceledAt) ?? null,
    revivedAt: toIso(row.revivedAt) ?? null,
    revivalCount: row.revivalCount,
    generatedDraftTitle: row.generatedDraftTitle,
  };
}

export function toAdminLessonBatchJobSnapshot(job: {
  id: string;
  status: JobStatus;
  model: string | null;
  error: string | null;
  tokensUsed: number | null;
  createdAt: Date;
  updatedAt: Date;
  lessonBatchCanceledAt: Date | null;
}): AdminLessonBatchJobSnapshot {
  return {
    id: job.id,
    status: job.status,
    model: job.model,
    error: job.error,
    tokensUsed: job.tokensUsed,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    lessonBatchCanceledAt: job.lessonBatchCanceledAt ? job.lessonBatchCanceledAt.toISOString() : null,
  };
}

export function computeBatchDerivedSummary(items: LessonBatchItem[]): LessonBatchDerivedSummary {
  const total = items.length;
  let pending = 0;
  let generating = 0;
  let completed = 0;
  let failed = 0;
  let skipped_duplicate = 0;
  let canceled = 0;
  for (const it of items) {
    switch (it.status) {
      case "pending":
        pending++;
        break;
      case "generating":
        generating++;
        break;
      case "completed":
        completed++;
        break;
      case "failed":
        failed++;
        break;
      case "skipped_duplicate":
        skipped_duplicate++;
        break;
      case "canceled":
        canceled++;
        break;
      default:
        break;
    }
  }
  const remaining = pending + generating;
  const allTerminal = total > 0 && items.every((i) => isTerminalBatchStatus(i.status));
  return {
    total,
    pending,
    generating,
    completed,
    failed,
    skipped_duplicate,
    canceled,
    remaining,
    allTerminal,
  };
}

/** If `generating` for too long (crash mid-request), treat as pending again. (Legacy JSON-only jobs.) */
export function reviveStaleGeneratingItems(summary: LessonBatchResultSummaryV1): {
  summary: LessonBatchResultSummaryV1;
  mutated: boolean;
} {
  const now = Date.now();
  let mutated = false;
  const items = summary.items.map((it, i) => {
    if (it.status !== "generating" || !it.startedAt) return it;
    const t = Date.parse(it.startedAt);
    if (Number.isNaN(t) || now - t < STALE_GENERATING_MS) return it;
    mutated = true;
    return normalizeLessonBatchItemFromLegacy({ ...it, status: "pending", startedAt: null }, i);
  });
  if (!mutated) return { summary, mutated: false };
  const normalized = items.map((it, i) => normalizeLessonBatchItemFromLegacy(it, i));
  const derived = computeBatchDerivedSummary(normalized);
  return { summary: { ...summary, items: normalized, derived }, mutated: true };
}

export function sanitizeLessonBatchError(message: string, max = 2000): string {
  return message
    .replace(/\bsk-[a-zA-Z0-9]{10,}\b/gi, "[redacted]")
    .replace(/\bBearer\s+\S+/gi, "Bearer [redacted]")
    .slice(0, max);
}

/**
 * Find an existing lesson draft for the same topic fingerprint (pending review or approved).
 * Prefers indexed `lessonBatchTopicKey`; falls back to JSON payload for legacy rows.
 */
export async function findLessonDraftDuplicate(
  db: PrismaClient,
  key: string,
  ctx: {
    topic: string;
    pathway: AdminAiLessonPathway;
    country: "CA" | "US";
    lessonType: AdminAiLessonType;
  },
): Promise<{ id: string; titlePreview: string | null } | null> {
  const indexed = await db.generatedLessonDraft.findFirst({
    where: {
      tool: ADMIN_AI_LESSON_GENERATOR_TOOL,
      reviewStatus: { in: [DraftReviewStatus.PENDING_REVIEW, DraftReviewStatus.APPROVED] },
      lessonBatchTopicKey: key,
    },
    select: { id: true, titlePreview: true },
  });
  if (indexed) return indexed;

  const legacy = await db.$queryRaw<Array<{ id: string; titlePreview: string | null }>>`
    SELECT id, "titlePreview" AS "titlePreview"
    FROM "GeneratedLessonDraft"
    WHERE "tool" = ${ADMIN_AI_LESSON_GENERATOR_TOOL}
      AND "reviewStatus" IN ('PENDING_REVIEW', 'APPROVED')
      AND ("lessonBatchTopicKey" IS NULL OR "lessonBatchTopicKey" = '')
      AND (payloadJson->>'batchTopicKey') = ${key}
    LIMIT 1
  `;
  if (legacy[0]) return legacy[0];

  const norm = normalizeBatchTopic(ctx.topic);
  const fuzzy = await db.$queryRaw<Array<{ id: string; titlePreview: string | null }>>`
    SELECT id, "titlePreview" AS "titlePreview"
    FROM "GeneratedLessonDraft"
    WHERE "tool" = ${ADMIN_AI_LESSON_GENERATOR_TOOL}
      AND "reviewStatus" IN ('PENDING_REVIEW', 'APPROVED')
      AND (payloadJson->>'pathway') = ${ctx.pathway}
      AND (payloadJson->>'country') = ${ctx.country}
      AND (payloadJson->>'lessonType') = ${ctx.lessonType}
      AND lower(trim(regexp_replace((payloadJson->>'topic'), '\\s+', ' ', 'g'))) = ${norm}
    LIMIT 1
  `;
  return fuzzy[0] ?? null;
}

/** After stale `GENERATING` recovery, use PENDING unless the batch job was already canceled. */
export function staleGeneratingReviveTargetQueueStatus(
  jobStatus: JobStatus | undefined,
): "PENDING" | "CANCELLED" {
  return jobStatus === JobStatus.CANCELLED ? "CANCELLED" : "PENDING";
}

export async function reviveStaleLessonBatchQueueItems(
  db: PrismaClient | Prisma.TransactionClient,
  jobId: string,
  now: Date = new Date(),
): Promise<{ count: number }> {
  const threshold = new Date(now.getTime() - STALE_GENERATING_MS);
  const stale = await db.lessonBatchQueueItem.findMany({
    where: {
      jobId,
      status: "GENERATING",
      startedAt: { lt: threshold },
    },
    select: { id: true },
  });
  if (stale.length === 0) return { count: 0 };

  const job = await db.aiGenerationJob.findUnique({
    where: { id: jobId },
    select: { status: true },
  });
  const nextStatus = staleGeneratingReviveTargetQueueStatus(job?.status);

  await db.lessonBatchQueueItem.updateMany({
    where: { id: { in: stale.map((s: { id: string }) => s.id) } },
    data: {
      status: nextStatus,
      startedAt: null,
      claimedByRequestId: null,
      revivedAt: now,
      revivalCount: { increment: 1 },
      canceledAt: nextStatus === "CANCELLED" ? now : null,
    },
  });
  return { count: stale.length };
}

/** Self-heal: draft exists for this queue item but row still says generating. */
export async function reconcileGeneratingItemsWithDrafts(
  db: PrismaClient | Prisma.TransactionClient,
  jobId: string,
): Promise<boolean> {
  const stuck = await db.lessonBatchQueueItem.findMany({
    where: { jobId, status: "GENERATING" },
  });
  if (stuck.length === 0) return false;

  const drafts = await db.generatedLessonDraft.findMany({
    where: { jobId, tool: ADMIN_AI_LESSON_GENERATOR_TOOL },
    select: { id: true, titlePreview: true, payloadJson: true },
  });

  const now = new Date();
  let changed = false;
  for (const item of stuck) {
    const draft = drafts.find((d: { id: string; titlePreview: string | null; payloadJson: Prisma.JsonValue }) => {
      const p = d.payloadJson as Record<string, unknown> | null;
      return typeof p?.batchItemId === "string" && p.batchItemId === item.publicItemId;
    });
    if (!draft) continue;
    await db.lessonBatchQueueItem.update({
      where: { id: item.id },
      data: {
        status: "COMPLETED",
        generatedDraftId: draft.id,
        generatedDraftTitle: draft.titlePreview,
        completedAt: now,
        startedAt: null,
        claimedByRequestId: null,
        lastError: null,
      },
    });
    changed = true;
  }
  return changed;
}

function mapApiItemStatusToDb(
  s: LessonBatchItemStatus,
): "PENDING" | "GENERATING" | "COMPLETED" | "FAILED" | "SKIPPED_DUPLICATE" | "CANCELLED" {
  switch (s) {
    case "pending":
      return "PENDING";
    case "generating":
      return "PENDING";
    case "completed":
      return "COMPLETED";
    case "failed":
      return "FAILED";
    case "skipped_duplicate":
      return "SKIPPED_DUPLICATE";
    case "canceled":
      return "CANCELLED";
    default:
      return "PENDING";
  }
}

/**
 * One-time hydrate from legacy `resultSummary` JSON into `lesson_batch_queue_item` rows
 * so atomic claim + reporting work for older jobs.
 */
export async function ensureLessonBatchQueueHydrated(db: PrismaClient, jobId: string): Promise<void> {
  const n = await db.lessonBatchQueueItem.count({ where: { jobId } });
  if (n > 0) return;

  const job = await db.aiGenerationJob.findUnique({ where: { id: jobId } });
  if (!job || job.tool !== ADMIN_LESSON_BATCH_TOOL) return;

  const s = parseBatchSummary(job.resultSummary);
  if (!s || s.items.length === 0) return;

  await db.$transaction(async (tx) => {
    for (let pos = 0; pos < s.items.length; pos++) {
      const it = s.items[pos]!;
      const norm = it.normalizedTopic ?? normalizeBatchTopic(it.topic);
      const wasGenerating = it.status === "generating";
      const dbStatus = mapApiItemStatusToDb(it.status);
      const canceledAtIso =
        typeof it.canceledAt === "string" ? it.canceledAt : undefined;
      const legacyErr =
        "error" in it && typeof (it as { error?: string }).error === "string"
          ? (it as { error?: string }).error
          : undefined;
      await tx.lessonBatchQueueItem.create({
        data: {
          jobId,
          position: pos,
          publicItemId: it.itemId,
          topic: it.topic,
          normalizedTopic: norm,
          batchTopicKey: it.batchTopicKey,
          status: dbStatus,
          attemptCount: it.attemptCount ?? (wasGenerating ? 1 : 0),
          lastError: it.lastError ?? legacyErr ?? null,
          startedAt: wasGenerating ? null : it.startedAt ? new Date(it.startedAt) : null,
          completedAt: it.completedAt ? new Date(it.completedAt) : null,
          skippedAt: it.skippedAt ? new Date(it.skippedAt) : null,
          canceledAt:
            dbStatus === "CANCELLED"
              ? canceledAtIso
                ? new Date(canceledAtIso)
                : new Date()
              : null,
          generatedDraftId: it.draftId ?? null,
          existingDraftId: it.existingDraftId ?? null,
          generatedDraftTitle: it.generatedDraftTitle ?? null,
        },
      });
    }
  });

  await syncJobResultSummaryJson(db, jobId);
}

export async function loadLessonBatchSummaryWithHydration(
  db: PrismaClient,
  jobId: string,
): Promise<LessonBatchResultSummaryV1 | null> {
  await ensureLessonBatchQueueHydrated(db, jobId);
  return buildLessonBatchSummaryFromDb(db, jobId);
}

export async function buildLessonBatchSummaryFromDb(
  db: PrismaClient,
  jobId: string,
): Promise<LessonBatchResultSummaryV1 | null> {
  const job = await db.aiGenerationJob.findUnique({
    where: { id: jobId },
    include: {
      lessonBatchQueueItems: { orderBy: { position: "asc" } },
    },
  });
  if (!job) return null;
  const input = job.inputPayload as Record<string, unknown> | null;
  if (!input || typeof input !== "object") return null;

  const pathway = input.pathway as AdminAiLessonPathway;
  const country = input.country as "CA" | "US";
  const topicDomain = String(input.topicDomain ?? "");
  const lessonType = input.lessonType as AdminAiLessonType;
  const difficulty = input.difficulty as LessonBatchResultSummaryV1["settings"]["difficulty"] | undefined;
  const relatedCategoryIds = Array.isArray(input.relatedCategoryIds)
    ? (input.relatedCategoryIds as string[])
    : [];
  const allowDuplicates = Boolean(input.allowDuplicates);

  if (job.lessonBatchQueueItems.length > 0) {
    const items = job.lessonBatchQueueItems.map(queueRowToLessonBatchItem);
    const derived = computeBatchDerivedSummary(items);
    return {
      version: 1,
      allowDuplicates,
      settings: {
        pathway,
        country,
        topicDomain,
        lessonType,
        difficulty,
        relatedCategoryIds,
      },
      items,
      derived,
    };
  }

  const legacy = parseBatchSummary(job.resultSummary);
  if (!legacy) return null;
  const items = legacy.items.map((it, idx) => normalizeLessonBatchItemFromLegacy(it, idx));
  const derived = computeBatchDerivedSummary(items);
  return {
    ...legacy,
    items,
    derived,
  };
}

export async function syncJobResultSummaryJson(db: PrismaClient, jobId: string): Promise<void> {
  await ensureLessonBatchQueueHydrated(db, jobId);
  const summary = await buildLessonBatchSummaryFromDb(db, jobId);
  if (!summary) return;
  const derived = computeBatchDerivedSummary(summary.items);
  const toPersist: LessonBatchResultSummaryV1 = { ...summary, derived };
  let nextStatus: JobStatus | undefined;
  if (derived.allTerminal) {
    const j = await db.aiGenerationJob.findUnique({ where: { id: jobId }, select: { status: true } });
    if (j?.status === JobStatus.RUNNING || j?.status === JobStatus.PENDING) {
      nextStatus = JobStatus.COMPLETED;
    }
  }
  await db.aiGenerationJob.update({
    where: { id: jobId },
    data: {
      resultSummary: toPersist as object,
      ...(nextStatus ? { status: nextStatus } : {}),
    },
  });
}

export type ClaimNextBatchItemResult =
  | { kind: "claimed"; row: LessonBatchQueueRow }
  | { kind: "idle" }
  | { kind: "job_not_runnable" };

/**
 * Atomically claim the next pending item: PENDING → GENERATING with SKIP LOCKED so only one worker wins.
 */
export async function claimNextLessonBatchItem(
  db: PrismaClient,
  jobId: string,
  requestId: string,
  now: Date = new Date(),
): Promise<ClaimNextBatchItemResult> {
  await ensureLessonBatchQueueHydrated(db, jobId);

  return db.$transaction(async (tx) => {
    const job = await tx.aiGenerationJob.findUnique({
      where: { id: jobId },
      select: { id: true, status: true, tool: true },
    });
    if (!job || job.tool !== ADMIN_LESSON_BATCH_TOOL) {
      return { kind: "job_not_runnable" };
    }
    if (job.status !== JobStatus.RUNNING && job.status !== JobStatus.PENDING) {
      return { kind: "job_not_runnable" };
    }

    await reviveStaleLessonBatchQueueItems(tx, jobId, now);
    await reconcileGeneratingItemsWithDrafts(tx, jobId);

    const picked = await tx.$queryRaw<Array<{ id: string }>>`
      SELECT l.id
      FROM lesson_batch_queue_item l
      INNER JOIN "AiGenerationJob" j ON j.id = l."jobId"
      WHERE l."jobId" = ${jobId}
        AND l.status = 'PENDING'::"LessonBatchQueueItemStatus"
        AND j.status IN ('RUNNING'::"JobStatus", 'PENDING'::"JobStatus")
        AND j.tool = ${ADMIN_LESSON_BATCH_TOOL}
      ORDER BY l.position ASC
      LIMIT 1
      FOR UPDATE OF l SKIP LOCKED
    `;

    if (!picked[0]) {
      return { kind: "idle" };
    }

    const updated = await tx.lessonBatchQueueItem.update({
      where: { id: picked[0].id },
      data: {
        status: "GENERATING",
        startedAt: now,
        claimedByRequestId: requestId,
        lastAttemptAt: now,
        attemptCount: { increment: 1 },
        lastError: null,
      },
    });

    return { kind: "claimed", row: updated };
  });
}

/** RFC 4180-style escaping + Excel/Sheets formula-injection mitigation (leading = + - @ tab CR). */
export function escapeLessonBatchCsvField(value: string | number | null | undefined): string {
  let s = value == null ? "" : String(value);
  if (/^[=+\-@\r\t]/.test(s)) {
    s = `'${s}`;
  }
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function formatLessonBatchCsv(
  jobId: string,
  items: LessonBatchItem[],
  settings: LessonBatchResultSummaryV1["settings"],
): string {
  const headers = [
    "position",
    "jobId",
    "topic",
    "normalizedTopic",
    "pathway",
    "country",
    "lessonType",
    "status",
    "attemptCount",
    "startedAt",
    "completedAt",
    "skippedAt",
    "canceledAt",
    "lastError",
    "claimedByRequestId",
    "revivalCount",
    "revivedAt",
    "generatedDraftId",
    "existingDraftId",
    "generatedDraftTitle",
    "batchTopicKey",
  ] as const;

  const esc = escapeLessonBatchCsvField;

  const lines = [headers.join(",")];
  for (const it of items) {
    lines.push(
      [
        esc(it.position),
        esc(jobId),
        esc(it.topic),
        esc(it.normalizedTopic),
        esc(settings.pathway),
        esc(settings.country),
        esc(settings.lessonType),
        esc(it.status),
        esc(it.attemptCount),
        esc(it.startedAt ?? ""),
        esc(it.completedAt ?? ""),
        esc(it.skippedAt ?? ""),
        esc(it.canceledAt ?? ""),
        esc(it.lastError ?? it.error ?? ""),
        esc(it.claimedByRequestId ?? ""),
        esc(it.revivalCount),
        esc(it.revivedAt ?? ""),
        esc(it.draftId ?? ""),
        esc(it.existingDraftId ?? ""),
        esc(it.generatedDraftTitle ?? ""),
        esc(it.batchTopicKey),
      ].join(","),
    );
  }
  return lines.join("\n") + "\n";
}
