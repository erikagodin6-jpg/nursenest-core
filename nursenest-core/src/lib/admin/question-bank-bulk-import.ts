import { ContentStatus, type Prisma } from "@prisma/client";
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
import { canonicalExamQuestionExamForDbWrite } from "@/lib/content-quality/exam-question-exam-normalization";
import { BOWTIE_SLOT_KEYS, type BowtieSlotKey } from "@/lib/questions/bowtie-adapter";
import { validateBowtieQuestionPayload } from "@/lib/questions/bowtie-question-schema";
import { scoreHintQuality } from "@/lib/questions/hint-quality-score";

const tierEnum = z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED", "PRE_NURSING", "NEW_GRAD"]);
const qTypeEnum = z.enum(["MCQ", "SATA", "NGN_CASE", "ORDERING", "FIB_NUMERIC"]);
const regionScopeEnum = z.enum(["BOTH", "CA_ONLY", "US_ONLY"]);
const bowtieBankItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(2),
  rationale: z.string().min(10).optional(),
});
const bowtieSlotLabelsSchema = z.object({
  condition: z.string().min(2),
  intervention: z.string().min(2),
  monitoring: z.string().min(2),
});
const bowtieCorrectMappingSchema = z.object({
  condition: z.string().min(1),
  intervention: z.string().min(1),
  monitoring: z.string().min(1),
});

const conventionalQuestionBankBulkItemSchema = z.object({
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
  hint: z.string().optional(),
});

const canonicalBowtieQuestionBankBulkItemSchema = z
  .object({
    stem: z.string().min(10),
    rationale: z.string().min(10),
    options: z.record(z.string(), z.unknown()),
    answerKey: z.object({
      correctMapping: bowtieCorrectMappingSchema,
    }),
    questionType: z.enum(["BOWTIE", "NGN_BOWTIE", "TREND", "NGN_TREND"]),
    country: z.enum(["CA", "US"]),
    tier: tierEnum,
    categoryId: z.string().min(5),
    examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).optional(),
    difficulty: z.enum(["FOUNDATION", "INTERMEDIATE", "ADVANCED"]).optional(),
    topicTag: z.string().optional(),
    systemTag: z.string().optional(),
    tags: z.array(z.string()).optional(),
    hint: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const result = validateBowtieQuestionPayload({
      questionType: data.questionType,
      stem: data.stem,
      options: data.options,
      correctAnswer: data.answerKey,
      rationale: data.rationale,
      topic: data.topicTag,
      bodySystem: data.systemTag,
      publishMode: false,
      requireRationale: true,
    });
    if (!result.ok) {
      for (const error of result.errors) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: error });
      }
    }
  });

const bowtieQuestionBankBulkItemSchema = z
  .object({
    stem: z.string().min(10),
    scenario: z.string().min(20),
    patientContext: z.string().min(10).optional(),
    rationale: z.string().min(10),
    questionType: z.literal("BOWTIE"),
    country: z.enum(["CA", "US"]),
    tier: tierEnum,
    exam: z.string().min(2).optional(),
    examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).optional(),
    categoryId: z.string().min(5).optional(),
    difficulty: z.enum(["FOUNDATION", "INTERMEDIATE", "ADVANCED"]).optional(),
    topicTag: z.string().min(2),
    systemTag: z.string().min(2),
    bodySystem: z.string().min(2),
    clinicalCategory: z.string().min(2),
    clientNeedsCategory: z.string().min(2),
    clinicalJudgmentFunction: z.string().min(2),
    safetyPriorityTags: z.array(z.string().min(1)).default([]),
    tags: z.array(z.string().min(1)).default([]),
    regionScope: regionScopeEnum.default("BOTH"),
    bank: z.array(bowtieBankItemSchema).min(6),
    slotLabels: bowtieSlotLabelsSchema.default({
      condition: "Condition/problem",
      intervention: "Action to take",
      monitoring: "Parameter/finding to monitor",
    }),
    correctMapping: bowtieCorrectMappingSchema,
    correctRationales: bowtieCorrectMappingSchema,
    distractorRationales: z.record(z.string(), z.string().min(10)).default({}),
    vitals: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
    labs: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
    professionScope: z.string().min(2).optional(),
    hint: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const bankIds = new Set(data.bank.map((item) => item.id));
    for (const slot of BOWTIE_SLOT_KEYS) {
      const id = data.correctMapping[slot];
      if (!bankIds.has(id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["correctMapping", slot],
          message: `Correct ${slot} id "${id}" must exist in bank`,
        });
      }
    }
    if (data.tier === "ALLIED" && !data.professionScope) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["professionScope"],
        message: "Allied bowtie rows require professionScope to avoid nursing-language leakage",
      });
    }
  });

/** One row in a JSON bank import — matches admin single-create shape; all imports land as draft unless overridden. */
export const questionBankBulkItemSchema = z.union([
  conventionalQuestionBankBulkItemSchema,
  canonicalBowtieQuestionBankBulkItemSchema,
  bowtieQuestionBankBulkItemSchema,
]);

export type QuestionBankBulkItem = z.infer<typeof questionBankBulkItemSchema>;
export type BowtieQuestionBankBulkItem = z.infer<typeof bowtieQuestionBankBulkItemSchema>;
export type CanonicalBowtieQuestionBankBulkItem = z.infer<typeof canonicalBowtieQuestionBankBulkItemSchema>;

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

/** Prisma JSON columns — runtime-clone so Zod `record(unknown)` shapes satisfy `InputJsonValue`. */
function examQuestionJsonField(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function isBowtieBulkItem(data: QuestionBankBulkItem): data is BowtieQuestionBankBulkItem {
  return data.questionType === "BOWTIE" && "bank" in data && "correctMapping" in data;
}

function isCanonicalBowtieBulkItem(data: QuestionBankBulkItem): data is CanonicalBowtieQuestionBankBulkItem {
  return "answerKey" in data && typeof data.questionType === "string" && data.questionType.includes("BOWTIE");
}

export function bowtieOptionsForImport(data: BowtieQuestionBankBulkItem): {
  format: "bowtie";
  scenario: string;
  slotLabels: Record<BowtieSlotKey, string>;
  bank: Array<{ id: string; label: string }>;
} {
  return {
    format: "bowtie",
    scenario: data.scenario,
    slotLabels: data.slotLabels,
    bank: data.bank.map(({ id, label }) => ({ id, label })),
  };
}

export function bowtieCorrectAnswerForImport(data: BowtieQuestionBankBulkItem): {
  correctMapping: Record<BowtieSlotKey, string>;
} {
  return { correctMapping: data.correctMapping };
}

export function examColumnForImport(data: QuestionBankBulkItem): string {
  return canonicalExamQuestionExamForDbWrite(
    isBowtieBulkItem(data) && data.exam ? data.exam : examFamilyToExamColumn(data.examFamily),
  );
}

export function tierColumnForImport(tier: z.infer<typeof tierEnum>): string {
  if (tier === "PRE_NURSING") return "pre_nursing";
  if (tier === "NEW_GRAD") return "new_grad";
  return tierCodeToExamDbTier(tier);
}

function normalizeItems(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && Array.isArray((raw as { items?: unknown }).items)) {
    return (raw as { items: unknown[] }).items;
  }
  return [];
}

function hintForImport(data: QuestionBankBulkItem): string | undefined {
  return "hint" in data && typeof data.hint === "string" && data.hint.trim() ? data.hint.trim() : undefined;
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
    const hint = hintForImport(data);
    if (hint) {
      const hintQuality = scoreHintQuality({
        hint,
        stem: data.stem,
        correctAnswer: isBowtieBulkItem(data)
          ? Object.values(data.correctMapping)
          : "answerKey" in data
            ? Object.values(data.answerKey).map(String)
            : data.answerKey.map(String),
        pathway: data.examFamily ?? data.tier,
        topic: data.topicTag ?? data.systemTag,
        questionType: data.questionType,
      });
      if (hintQuality.gate === "hard_fail") {
        rowReports.push({
          index: i,
          ok: false,
          errors: [`hint: score ${hintQuality.score}; ${hintQuality.issues.join(", ")}`],
        });
        continue;
      }
    }
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
    if (p.success && !isBowtieBulkItem(p.data)) categoryIds.add(p.data.categoryId);
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
      const cat = !isBowtieBulkItem(data) ? catById.get(data.categoryId) : null;
      if (!isBowtieBulkItem(data) && !cat) continue;

      const topic = [cat?.name, data.topicTag].filter(Boolean).join(" · ") || cat?.slug;
      const hint = hintForImport(data);
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
          options: examQuestionJsonField(
            isBowtieBulkItem(data) ? bowtieOptionsForImport(data) : data.options,
          ),
          correctAnswer: examQuestionJsonField(
            isBowtieBulkItem(data) ? bowtieCorrectAnswerForImport(data) : data.answerKey,
          ),
          questionType: isBowtieBulkItem(data)
            ? "Bowtie"
            : isCanonicalBowtieBulkItem(data)
              ? adminQuestionTypeToDb(data.questionType)
              : adminQuestionTypeToDb(data.questionType),
          countryCode: data.country,
          tier: tierColumnForImport(data.tier),
          status: contentStatusToDb(ContentStatus.DRAFT),
          exam: examColumnForImport(data),
          difficulty: difficultyBandToInt(data.difficulty) ?? 3,
          topic: topic ?? undefined,
          subtopic: data.systemTag,
          tags: [
            ...(data.tags ?? []),
            ...(hint ? [`hint:${hint}`] : []),
            ...(isBowtieBulkItem(data)
              ? [data.clinicalCategory, data.clinicalJudgmentFunction, ...data.safetyPriorityTags]
              : []),
          ],
          careerType: data.tier === "ALLIED" ? "allied" : "nursing",
          regionScope: isBowtieBulkItem(data) ? data.regionScope : "BOTH",
          stemHash: hash,
          bodySystem: isBowtieBulkItem(data) ? data.bodySystem : taxonomy.bodySystem,
          scenario: isBowtieBulkItem(data) ? data.scenario : undefined,
          vitals: isBowtieBulkItem(data) ? data.vitals : undefined,
          labs: isBowtieBulkItem(data) ? data.labs : undefined,
          questionFormat: isBowtieBulkItem(data) || isCanonicalBowtieBulkItem(data) ? "bowtie" : undefined,
          cognitiveLevel: isBowtieBulkItem(data) ? data.clinicalJudgmentFunction : undefined,
          distractorRationales: isBowtieBulkItem(data)
            ? {
                correct: data.correctRationales,
                distractors: data.distractorRationales,
                bankRationales: Object.fromEntries(
                  data.bank.filter((item) => item.rationale).map((item) => [item.id, item.rationale]),
                ),
              }
            : undefined,
          nclexClientNeedsCategory: isBowtieBulkItem(data) ? data.clientNeedsCategory : undefined,
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
