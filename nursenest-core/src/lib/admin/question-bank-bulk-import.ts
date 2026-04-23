import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { stemHash } from "@/lib/content/stem-hash";
import { examQuestionTaxonomyFromCorpus } from "@/lib/taxonomy/content-write-taxonomy";
import { prisma } from "@/lib/db";
import { contentStatusToDb } from "@/lib/prisma/content-status";
import {
  adminQuestionTypeToDb,
  difficultyBandToInt,
  examFamilyToExamColumn,
  tierCodeToExamDbTier,
} from "@/lib/prisma/exam-question-maps";

const tierEnum = z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED"]);
const qTypeEnum = z.enum(["MCQ", "SATA", "NGN_CASE", "ORDERING", "FIB_NUMERIC"]);

/** One row in a JSON bank import — matches admin single-create shape; all imports land as draft unless overridden. */
export const questionBankBulkItemSchema = z.object({
  stem: z.string().min(10),
  rationale: z.string().min(10),
  options: z.array(z.union([z.string(), z.number()])).min(1),
  answerKey: z.array(z.union([z.string(), z.number()])).min(1),
  questionType: qTypeEnum,
  country: z.enum(["CA", "US"]),
  tier: tierEnum,
  categoryId: z.string().min(5),
  examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).optional(),
  difficulty: z.enum(["FOUNDATION", "INTERMEDIATE", "ADVANCED"]).optional(),
  topicTag: z.string().optional(),
  systemTag: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type QuestionBankBulkItem = z.infer<typeof questionBankBulkItemSchema>;

export type BulkRowReport = {
  index: number;
  ok: boolean;
  stemHash?: string;
  errors?: string[];
  /** Another row in this file shares the same stem hash. */
  duplicateOfIndex?: number;
  /** Already in `exam_questions`. */
  existingQuestionId?: string;
};

const MAX_ITEMS = 200;

function normalizeItems(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && Array.isArray((raw as { items?: unknown }).items)) {
    return (raw as { items: unknown[] }).items;
  }
  return [];
}

export async function runQuestionBankBulkImportReport(itemsRaw: unknown): Promise<{
  rowReports: BulkRowReport[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    batchDuplicateHashes: number;
    existingDbHashes: number;
    /** Rows that could be inserted (valid, not in-file dupe, stem not already in DB). */
    importable: number;
  };
}> {
  const arr = normalizeItems(itemsRaw);
  const capped = arr.slice(0, MAX_ITEMS);
  const rowReports: BulkRowReport[] = [];
  const hashFirstIndex = new Map<string, number>();

  for (let i = 0; i < capped.length; i++) {
    const parsed = questionBankBulkItemSchema.safeParse(capped[i]);
    if (!parsed.success) {
      rowReports.push({
        index: i,
        ok: false,
        errors: parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`),
      });
      continue;
    }
    const data = parsed.data;
    const sh = stemHash(data.stem);
    const first = hashFirstIndex.get(sh);
    if (first !== undefined) {
      rowReports.push({
        index: i,
        ok: true,
        stemHash: sh,
        duplicateOfIndex: first,
      });
      continue;
    }
    hashFirstIndex.set(sh, i);
    rowReports.push({ index: i, ok: true, stemHash: sh });
  }

  const validHashes = rowReports.filter((r) => r.ok && r.stemHash && r.duplicateOfIndex === undefined).map((r) => r.stemHash!);
  const uniqueHashes = [...new Set(validHashes)];

  const existingByHash = new Map<string, string>();
  if (uniqueHashes.length > 0) {
    const found = await prisma.examQuestion.findMany({
      where: { stemHash: { in: uniqueHashes } },
      select: { id: true, stemHash: true },
    });
    for (const q of found) {
      if (q.stemHash) existingByHash.set(q.stemHash, q.id);
    }
  }

  for (const r of rowReports) {
    if (!r.ok || !r.stemHash || r.duplicateOfIndex !== undefined) continue;
    const ex = existingByHash.get(r.stemHash);
    if (ex) r.existingQuestionId = ex;
  }

  const batchDupes = rowReports.filter((r) => r.duplicateOfIndex !== undefined).length;
  const valid = rowReports.filter((r) => r.ok && r.duplicateOfIndex === undefined).length;
  const invalid = rowReports.filter((r) => !r.ok).length;
  const importable = rowReports.filter(
    (r) => r.ok && r.duplicateOfIndex === undefined && r.stemHash && !existingByHash.has(r.stemHash),
  ).length;

  return {
    rowReports,
    summary: {
      total: capped.length,
      valid,
      invalid,
      batchDuplicateHashes: batchDupes,
      existingDbHashes: existingByHash.size,
      importable,
    },
  };
}

/**
 * Inserts new draft questions for rows that passed validation, are not batch-dupes, and have no DB stem_hash hit.
 * Super-admin only + env secret (see route). Uses per-row creates inside a transaction.
 */
export async function applyQuestionBankBulkImport(
  itemsRaw: unknown,
  opts: { userId: string },
): Promise<{ created: number; skipped: number; rowReports: BulkRowReport[] }> {
  const { rowReports, summary } = await runQuestionBankBulkImportReport(itemsRaw);
  if (summary.total === 0) {
    return { created: 0, skipped: 0, rowReports };
  }

  const items = normalizeItems(itemsRaw);
  const toCreate = rowReports.filter(
    (r) => r.ok && r.duplicateOfIndex === undefined && !r.existingQuestionId && r.stemHash,
  );

  const categoryIds = new Set<string>();
  for (const r of toCreate) {
    const p = questionBankBulkItemSchema.safeParse(items[r.index]);
    if (p.success) categoryIds.add(p.data.categoryId);
  }
  const categories = await prisma.category.findMany({
    where: { id: { in: [...categoryIds] } },
    select: { id: true, name: true, slug: true },
  });
  const catById = new Map(categories.map((c) => [c.id, c]));

  let created = 0;

  await prisma.$transaction(async (tx) => {
    for (const r of toCreate) {
      const parsed = questionBankBulkItemSchema.safeParse(items[r.index]);
      if (!parsed.success) continue;
      const data = parsed.data;
      if (!catById.has(data.categoryId)) continue;

      const cat = catById.get(data.categoryId);
      const topic = [cat?.name, data.topicTag].filter(Boolean).join(" · ") || cat?.slug;
      const hash = stemHash(data.stem);

      const taxonomy = examQuestionTaxonomyFromCorpus({
        stem: data.stem,
        rationale: data.rationale,
        topic: topic ?? null,
        subtopic: data.systemTag ?? null,
        tags: data.tags ?? [],
      });
      if (taxonomy.violations.length > 0) {
        continue;
      }

      const again = await tx.examQuestion.findFirst({ where: { stemHash: hash }, select: { id: true } });
      if (again) {
        r.existingQuestionId = again.id;
        continue;
      }

      await tx.examQuestion.create({
        data: {
          stem: data.stem,
          rationale: data.rationale,
          options: data.options,
          correctAnswer: data.answerKey,
          questionType: adminQuestionTypeToDb(data.questionType),
          countryCode: data.country,
          tier: tierCodeToExamDbTier(data.tier),
          status: contentStatusToDb(ContentStatus.DRAFT),
          exam: examFamilyToExamColumn(data.examFamily),
          difficulty: difficultyBandToInt(data.difficulty) ?? 3,
          topic: topic ?? undefined,
          subtopic: data.systemTag,
          tags: data.tags ?? [],
          careerType: "nursing",
          regionScope: "BOTH",
          stemHash: hash,
          bodySystem: taxonomy.bodySystem,
        },
      });
      created += 1;
    }
  });

  void opts.userId;
  const skipped = summary.total - created;
  return { created, skipped, rowReports };
}

export const QUESTION_BANK_BULK_IMPORT_MAX_ITEMS = MAX_ITEMS;
