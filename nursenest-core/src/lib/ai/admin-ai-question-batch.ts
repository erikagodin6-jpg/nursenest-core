import { createHash } from "node:crypto";
import { DraftReviewStatus, type PrismaClient } from "@prisma/client";
import { ADMIN_AI_QUESTION_TOOL } from "@/lib/ai/admin-ai-question-pipeline";

export const ADMIN_QUESTION_BATCH_JOB_TOOL = "ADMIN_QUESTION_BATCH";

export type QuestionBatchItemStatus =
  | "pending"
  | "generating"
  | "completed"
  | "failed"
  | "skipped_duplicate"
  | "skipped_duplicate_stem";

export type QuestionBatchSettings = {
  tier: string;
  country: "CA" | "US";
  examFamily: string;
  pathwayLabel: string;
  difficulty: string;
  questionTypeMode: "auto" | "mcq" | "sata";
  questionStyleHints: string[];
  lessonTargetIds: string[];
  lessonId: string | null;
  categoryId: string | null;
};

export type QuestionBatchItem = {
  itemId: string;
  topic: string;
  batchTopicKey: string;
  /** Base concept line when using {@link variationDirective} (prompt + tagging). */
  baseTopic?: string;
  /** Extra prompt block from the variation engine (age, setting, archetype, etc.). */
  variationDirective?: string;
  status: QuestionBatchItemStatus;
  startedAt?: string | null;
  draftId?: string;
  existingDraftId?: string;
  existingQuestionBankId?: string;
  error?: string;
};

export type QuestionBatchResultSummaryV1 = {
  version: 1;
  items: QuestionBatchItem[];
  allowDuplicates: boolean;
  settings: QuestionBatchSettings;
  /** Normalized stems for near-duplicate detection within this job (no full-bank scan). */
  nearDupStemNorms?: string[];
  /** Correct-option index fingerprints (MCQ/SATA) used within this job. */
  usedAnswerPatterns?: string[];
};

function normalizeTopic(topic: string): string {
  return topic.trim().replace(/\s+/g, " ").toLowerCase();
}

export function parseQuestionBatchTopicList(raw: string): string[] {
  const parts = raw
    .split(/[\n,;]+/g)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    const k = normalizeTopic(p);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  return out;
}

export function questionBatchTopicKey(
  topic: string,
  settings: QuestionBatchSettings,
  /** When set, differentiates variations of the same base topic. */
  variationSignature?: string,
): string {
  const parts = [
    normalizeTopic(topic),
    settings.tier,
    settings.country,
    settings.examFamily,
    settings.questionTypeMode,
    settings.difficulty,
    normalizeTopic(settings.pathwayLabel),
    settings.categoryId ?? "",
    settings.lessonId ?? "",
    settings.lessonTargetIds.slice().sort().join(","),
    settings.questionStyleHints.slice().sort().join(","),
  ];
  if (variationSignature?.trim()) {
    parts.push(normalizeTopic(variationSignature));
  }
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 40);
}

export function parseQuestionBatchSummary(raw: unknown): QuestionBatchResultSummaryV1 | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.version !== 1 || !Array.isArray(o.items)) return null;
  return raw as QuestionBatchResultSummaryV1;
}

export function isTerminalQuestionBatchStatus(s: QuestionBatchItemStatus): boolean {
  return (
    s === "completed" ||
    s === "failed" ||
    s === "skipped_duplicate" ||
    s === "skipped_duplicate_stem"
  );
}

const STALE_GENERATING_MS = 25 * 60 * 1000;

export function reviveStaleQuestionBatchItems(summary: QuestionBatchResultSummaryV1): {
  summary: QuestionBatchResultSummaryV1;
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

/** Existing draft with same `batchTopicKey` on payload (pending/approved). */
export async function findQuestionDraftByBatchTopicKey(
  db: PrismaClient,
  key: string,
): Promise<{ id: string } | null> {
  const rows = await db.generatedQuestionDraft.findMany({
    where: {
      tool: ADMIN_AI_QUESTION_TOOL,
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
  }
  return null;
}
