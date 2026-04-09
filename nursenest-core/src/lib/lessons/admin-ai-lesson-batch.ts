import { createHash } from "node:crypto";
import { DraftReviewStatus, type PrismaClient } from "@prisma/client";
import { ADMIN_AI_LESSON_GENERATOR_TOOL } from "@/lib/lessons/admin-ai-lesson-pipeline";
import type { AdminAiLessonPathway, AdminAiLessonType } from "@/lib/lessons/admin-ai-lesson-schema";

export const ADMIN_LESSON_BATCH_TOOL = "ADMIN_LESSON_BATCH";

export type LessonBatchItemStatus =
  | "pending"
  | "generating"
  | "completed"
  | "failed"
  | "skipped_duplicate";

export type LessonBatchItem = {
  itemId: string;
  topic: string;
  batchTopicKey: string;
  status: LessonBatchItemStatus;
  /** ISO time when status became `generating` — used to recover stale locks */
  startedAt?: string | null;
  draftId?: string;
  /** When skipped_duplicate — link to existing draft */
  existingDraftId?: string;
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
};

export function normalizeBatchTopic(topic: string): string {
  return topic.trim().replace(/\s+/g, " ").toLowerCase();
}

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

export function isTerminalBatchStatus(s: LessonBatchItemStatus): boolean {
  return s === "completed" || s === "failed" || s === "skipped_duplicate";
}

const STALE_GENERATING_MS = 25 * 60 * 1000;

/** If `generating` for too long (crash mid-request), treat as pending again. */
export function reviveStaleGeneratingItems(summary: LessonBatchResultSummaryV1): {
  summary: LessonBatchResultSummaryV1;
  mutated: boolean;
} {
  const now = Date.now();
  let mutated = false;
  const items = summary.items.map((it) => {
    if (it.status !== "generating" || !it.startedAt) return it;
    const t = Date.parse(it.startedAt);
    if (Number.isNaN(t) || now - t < STALE_GENERATING_MS) return it;
    mutated = true;
    return { ...it, status: "pending" as const, startedAt: null };
  });
  return { summary: mutated ? { ...summary, items } : summary, mutated };
}

/**
 * Find an existing lesson draft for the same topic fingerprint (pending review or approved).
 * Scans recent generator drafts — sufficient for admin duplicate guard.
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
): Promise<{ id: string } | null> {
  const norm = normalizeBatchTopic(ctx.topic);
  const rows = await db.generatedLessonDraft.findMany({
    where: {
      tool: ADMIN_AI_LESSON_GENERATOR_TOOL,
      reviewStatus: { in: [DraftReviewStatus.PENDING_REVIEW, DraftReviewStatus.APPROVED] },
    },
    select: { id: true, payloadJson: true },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  for (const r of rows) {
    const p = r.payloadJson as Record<string, unknown> | null;
    if (!p || typeof p !== "object") continue;
    if (typeof p.batchTopicKey === "string" && p.batchTopicKey === key) {
      return { id: r.id };
    }
    if (
      typeof p.topic === "string" &&
      typeof p.pathway === "string" &&
      typeof p.country === "string" &&
      typeof p.lessonType === "string" &&
      normalizeBatchTopic(p.topic) === norm &&
      p.pathway === ctx.pathway &&
      p.country === ctx.country &&
      p.lessonType === ctx.lessonType
    ) {
      return { id: r.id };
    }
  }
  return null;
}
