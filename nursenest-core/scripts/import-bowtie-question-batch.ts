import { ContentStatus } from "@prisma/client";
import { randomUUID } from "node:crypto";

import {
  bowtieCorrectAnswerForImport,
  bowtieOptionsForImport,
  examColumnForImport,
  questionBankBulkItemSchema,
  tierColumnForImport,
} from "@/lib/admin/question-bank-bulk-import";
import { canonicalExamQuestionExamForDbWrite } from "@/lib/content-quality/exam-question-exam-normalization";
import { stemHash } from "@/lib/content/stem-hash";
import { prisma } from "@/lib/db";
import { contentStatusToDb } from "@/lib/prisma/content-status";
import { difficultyBandToInt } from "@/lib/prisma/exam-question-maps";
import { bowtieStarterBatchItems } from "./bowtie-starter-batch-data";

const args = new Set(process.argv.slice(2));
const write = args.has("--write");
const chunkSize = Number(process.env.BOWTIE_IMPORT_CHUNK_SIZE ?? 50);

function assertBowtieItem(raw: unknown) {
  const parsed = questionBankBulkItemSchema.parse(raw);
  if (parsed.questionType !== "BOWTIE") throw new Error("Bowtie batch contains a non-bowtie item");
  return parsed;
}

async function main() {
  const parsedItems = bowtieStarterBatchItems.map(assertBowtieItem);
  const hashes = parsedItems.map((item) => stemHash(item.stem));
  const uniqueHashes = new Set(hashes);
  if (uniqueHashes.size !== hashes.length) {
    throw new Error(`Batch contains ${hashes.length - uniqueHashes.size} duplicate stem hashes`);
  }

  const existing = await prisma.examQuestion.findMany({
    where: { stemHash: { in: hashes } },
    select: { id: true, stemHash: true },
  });
  const existingHashes = new Set(existing.map((row) => row.stemHash).filter((hash): hash is string => Boolean(hash)));
  const importable = parsedItems.filter((item) => !existingHashes.has(stemHash(item.stem)));

  if (!write) {
    console.log(
      JSON.stringify(
        {
          mode: "dry-run",
          total: parsedItems.length,
          existing: existingHashes.size,
          importable: importable.length,
          byTier: parsedItems.reduce<Record<string, number>>((acc, item) => {
            acc[item.tier] = (acc[item.tier] ?? 0) + 1;
            return acc;
          }, {}),
        },
        null,
        2,
      ),
    );
    return;
  }

  let created = 0;
  for (let start = 0; start < importable.length; start += chunkSize) {
    const chunk = importable.slice(start, start + chunkSize);
    const statements = chunk.map((item) => {
      const tags = [
        ...item.tags,
        item.clinicalCategory,
        item.clinicalJudgmentFunction,
        ...item.safetyPriorityTags,
        ...(item.professionScope ? [item.professionScope] : []),
      ];
      const distractorRationales = {
        correct: item.correctRationales,
        distractors: item.distractorRationales,
        bankRationales: Object.fromEntries(
          item.bank.filter((bankItem) => bankItem.rationale).map((bankItem) => [bankItem.id, bankItem.rationale]),
        ),
      };
      return prisma.$executeRaw`
        INSERT INTO exam_questions (
          id,
          stem,
          rationale,
          options,
          correct_answer,
          question_type,
          country_code,
          tier,
          status,
          published_at,
          updated_at,
          exam,
          difficulty,
          topic,
          subtopic,
          tags,
          career_type,
          region_scope,
          stem_hash,
          body_system,
          scenario,
          vitals,
          labs,
          question_format,
          cognitive_level,
          distractor_rationales,
          nclex_client_needs_category,
          nclex_client_needs_subcategory
        )
        VALUES (
          ${randomUUID()},
          ${item.stem},
          ${item.rationale},
          ${JSON.stringify(bowtieOptionsForImport(item))}::jsonb,
          ${JSON.stringify(bowtieCorrectAnswerForImport(item))}::jsonb,
          ${"Bowtie"},
          ${item.country},
          ${tierColumnForImport(item.tier)},
          ${contentStatusToDb(ContentStatus.PUBLISHED)},
          ${new Date()},
          ${new Date()},
          ${canonicalExamQuestionExamForDbWrite(examColumnForImport(item))},
          ${difficultyBandToInt(item.difficulty) ?? 3},
          ${item.topicTag},
          ${item.systemTag},
          ${tags},
          ${item.tier === "ALLIED" ? "allied" : "nursing"},
          ${item.regionScope},
          ${stemHash(item.stem)},
          ${item.bodySystem},
          ${item.scenario},
          ${JSON.stringify(item.vitals ?? {})}::jsonb,
          ${JSON.stringify(item.labs ?? {})}::jsonb,
          ${"bowtie"},
          ${item.clinicalJudgmentFunction},
          ${JSON.stringify(distractorRationales)}::jsonb,
          ${item.clientNeedsCategory},
          ${item.clinicalCategory}
        )
      `;
    });
    await prisma.$transaction(statements);
    created += chunk.length;
    console.log(`Imported ${created}/${importable.length} bowtie rows`);
  }

  console.log(JSON.stringify({ mode: "write", created, skippedExisting: existingHashes.size }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
