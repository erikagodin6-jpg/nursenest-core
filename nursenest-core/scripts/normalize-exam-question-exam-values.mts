#!/usr/bin/env npx tsx
/**
 * Normalize `exam_questions.exam` values to canonical registry-compatible strings.
 *
 * Dry-run by default:
 *   npx tsx scripts/normalize-exam-question-exam-values.mts
 *
 * Apply updates:
 *   npx tsx scripts/normalize-exam-question-exam-values.mts --apply
 */
import "../src/lib/db/script-env-bootstrap";

import { PrismaClient } from "@prisma/client";
import { canonicalizeExamQuestionExam } from "../src/lib/exam-questions/exam-question-exam-key";

type DistributionRow = {
  exam: string;
  count: number;
};

type PlannedUpdate = {
  from: string;
  to: string;
  count: number;
};

function parseArgs(): { apply: boolean } {
  return { apply: process.argv.includes("--apply") };
}

function printableDistribution(rows: DistributionRow[]): Record<string, number> {
  return Object.fromEntries(rows.map((row) => [row.exam, row.count]));
}

async function examDistribution(prisma: PrismaClient): Promise<DistributionRow[]> {
  const rows = await prisma.examQuestion.groupBy({
    by: ["exam"],
    _count: { _all: true },
    orderBy: { exam: "asc" },
  });

  return rows.map((row) => ({ exam: row.exam, count: row._count._all }));
}

function planUpdates(rows: readonly DistributionRow[]): { planned: PlannedUpdate[]; unmapped: DistributionRow[] } {
  const planned: PlannedUpdate[] = [];
  const unmapped: DistributionRow[] = [];

  for (const row of rows) {
    const canonical = canonicalizeExamQuestionExam(row.exam);
    if (!canonical) {
      unmapped.push(row);
      continue;
    }
    if (canonical !== row.exam) {
      planned.push({ from: row.exam, to: canonical, count: row.count });
    }
  }

  return { planned, unmapped };
}

async function main() {
  const { apply } = parseArgs();
  const prisma = new PrismaClient();

  try {
    const before = await examDistribution(prisma);
    const { planned, unmapped } = planUpdates(before);

    console.log("before", JSON.stringify(printableDistribution(before), null, 2));
    console.log("plannedUpdates", JSON.stringify(planned, null, 2));

    if (unmapped.length > 0) {
      console.error("unmappedExamValues", JSON.stringify(unmapped, null, 2));
      throw new Error("Refusing to update while unmapped ExamQuestion.exam values exist.");
    }

    let totalRowsUpdated = 0;
    if (apply) {
      for (const update of planned) {
        const result = await prisma.examQuestion.updateMany({
          where: { exam: update.from },
          data: { exam: update.to },
        });
        totalRowsUpdated += result.count;
      }
    }

    const after = apply ? await examDistribution(prisma) : before;
    console.log("after", JSON.stringify(printableDistribution(after), null, 2));
    console.log("totalRowsUpdated", totalRowsUpdated);
    console.log("mode", apply ? "applied" : "dry-run");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
