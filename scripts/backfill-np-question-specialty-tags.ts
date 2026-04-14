import "../src/lib/db/env-bootstrap";

import { PrismaClient } from "@prisma/client";
import { deriveNpSpecialtyBuckets } from "../src/lib/exam-pathways/np-question-specialty-scope";

const prisma = new PrismaClient();
const BATCH_SIZE = 200;

type Options = {
  apply: boolean;
  dryRun: boolean;
};

function parseOptions(argv: string[]): Options {
  const apply = argv.includes("--apply");
  return { apply, dryRun: !apply || argv.includes("--dry-run") };
}

function desiredTags(existingTags: string[], buckets: ReturnType<typeof deriveNpSpecialtyBuckets>): string[] {
  const withoutExistingSpecialty = existingTags.filter((tag) => !tag.startsWith("np-specialty:"));
  const specialtyTags = buckets.map((bucket) => `np-specialty:${bucket.replace("_", "-")}`);
  return [...new Set([...withoutExistingSpecialty, ...specialtyTags])].sort();
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const rows = await prisma.examQuestion.findMany({
    where: {
      status: "published",
      tier: { in: ["np", "NP"] },
      regionScope: { in: ["US_ONLY", "BOTH"] },
      exam: { in: ["NP", "AANP", "AANP-FNP", "ANCC-FNP", "ANCC-AGPCNP", "AGPCNP", "PMHNP", "WHNP", "PNP-PC"] },
    },
    select: {
      id: true,
      exam: true,
      bodySystem: true,
      tags: true,
    },
    orderBy: { id: "asc" },
  });

  let evaluated = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  let sharedCoreOnly = 0;
  const previews: Array<{ id: string; before: string[]; after: string[] }> = [];

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const chunk = rows.slice(i, i + BATCH_SIZE);
    for (const row of chunk) {
      evaluated += 1;
      const buckets = deriveNpSpecialtyBuckets({ exam: row.exam, bodySystem: row.bodySystem });
      if (buckets.length === 1 && buckets[0] === "shared_core") {
        sharedCoreOnly += 1;
      }
      const nextTags = desiredTags(row.tags, buckets);
      const changed = row.tags.length !== nextTags.length || row.tags.some((tag, index) => tag !== nextTags[index]);
      if (!changed) {
        skipped += 1;
        continue;
      }

      if (previews.length < 20) {
        previews.push({ id: row.id, before: row.tags, after: nextTags });
      }

      if (options.dryRun) {
        updated += 1;
        continue;
      }

      try {
        await prisma.examQuestion.update({
          where: { id: row.id },
          data: { tags: nextTags },
        });
        updated += 1;
      } catch {
        failed += 1;
      }
    }
  }

  const report = {
    mode: options.apply ? "apply" : "dry-run",
    evaluated,
    updated,
    skipped,
    failed,
    sharedCoreOnly,
    preview: previews,
  };
  console.log(JSON.stringify(report, null, 2));
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`backfill failed: ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
