import { Prisma } from "@prisma/client";
import { stemHash } from "@/lib/content/stem-hash";
import { prisma } from "@/lib/db";
import { bowtieCorrectAnswerForImport, bowtieOptionsForImport } from "@/lib/admin/question-bank-bulk-import";
import { bowtieStarterBatchItems, bowtieStarterBatchConfig } from "./bowtie-starter-batch-data";

const args = new Set(process.argv.slice(2));
const write = args.has("--write");

function oldStemFor(pathwayLabel: string, index: number, bodySystem: string): string {
  return `${pathwayLabel} bowtie ${index + 1}: Which problem, action, and monitoring priority best match this ${bodySystem.toLowerCase()} client?`;
}

async function main() {
  let offset = 0;
  const updates: Array<{ candidateHashes: string[]; item: (typeof bowtieStarterBatchItems)[number] }> = [];
  for (const config of bowtieStarterBatchConfig) {
    for (let index = 0; index < config.count; index++) {
      const item = bowtieStarterBatchItems[offset + index];
      updates.push({
        candidateHashes: [stemHash(oldStemFor(config.pathwayLabel, index, item.bodySystem)), stemHash(item.stem)],
        item,
      });
    }
    offset += config.count;
  }

  const existing = await prisma.$queryRaw<Array<{ stem_hash: string }>>`
    select stem_hash
    from exam_questions
    where stem_hash in (${Prisma.join([...new Set(updates.flatMap((update) => update.candidateHashes))])})
  `;
  const existingHashes = new Set(existing.map((row) => row.stem_hash));

  if (!write) {
    console.log(JSON.stringify({ mode: "dry-run", updateCandidates: existingHashes.size, total: updates.length }, null, 2));
    return;
  }

  let refreshed = 0;
  for (const { candidateHashes, item } of updates) {
    const matchingHashes = candidateHashes.filter((hash) => existingHashes.has(hash));
    if (matchingHashes.length === 0) continue;
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
    const count = await prisma.$executeRaw`
      update exam_questions
      set
        stem = ${item.stem},
        rationale = ${item.rationale},
        options = ${JSON.stringify(bowtieOptionsForImport(item))}::jsonb,
        correct_answer = ${JSON.stringify(bowtieCorrectAnswerForImport(item))}::jsonb,
        tags = ${tags},
        scenario = ${item.scenario},
        vitals = ${JSON.stringify(item.vitals ?? {})}::jsonb,
        labs = ${JSON.stringify(item.labs ?? {})}::jsonb,
        cognitive_level = ${item.clinicalJudgmentFunction},
        distractor_rationales = ${JSON.stringify(distractorRationales)}::jsonb,
        nclex_client_needs_category = ${item.clientNeedsCategory},
        nclex_client_needs_subcategory = ${item.clinicalCategory},
        stem_hash = ${stemHash(item.stem)},
        updated_at = ${new Date()}
      where stem_hash in (${Prisma.join(matchingHashes)})
    `;
    refreshed += Number(count);
  }
  console.log(JSON.stringify({ mode: "write", refreshed }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
