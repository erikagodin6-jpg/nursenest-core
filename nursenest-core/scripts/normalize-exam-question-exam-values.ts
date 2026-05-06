#!/usr/bin/env tsx
/**
 * One-shot: normalize `exam_questions.exam` to pathway-aligned canonical strings
 * (see `src/lib/content-quality/exam-question-exam-normalization.ts`).
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/normalize-exam-question-exam-values.ts --dry-run
 *   npx tsx scripts/normalize-exam-question-exam-values.ts
 *   npx tsx scripts/normalize-exam-question-exam-values.ts --dry-run --json
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import {
  normalizeExamQuestionExamForStorage,
  orderExamQuestionExamRewritesForBackfill,
} from "../src/lib/content-quality/exam-question-exam-normalization";

function loadDotenvFromPackageRoot(): void {
  const root = process.cwd();
  for (const name of [".env", ".env.local", ".env.production"]) {
    const p = resolve(root, name);
    if (!existsSync(p)) continue;
    const parsed = parseDotenv(readFileSync(p, "utf8"));
    for (const [k, v] of Object.entries(parsed)) {
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
}

const prisma = new PrismaClient();

type DistRow = { exam: string };
type CountRow = { exam: string; c: bigint };

async function examDistribution(): Promise<CountRow[]> {
  return prisma.$queryRaw<CountRow[]>`
    SELECT exam, COUNT(*)::bigint AS c
    FROM exam_questions
    GROUP BY exam
    ORDER BY c DESC
  `;
}

function printDist(label: string, rows: CountRow[]): void {
  console.log(`\n${label}`);
  console.log("-".repeat(56));
  let total = 0;
  for (const r of rows) {
    const n = Number(r.c);
    total += n;
    console.log(`  ${String(r.exam).padEnd(28)} ${n.toLocaleString()}`);
  }
  console.log(`  ${"TOTAL".padEnd(28)} ${total.toLocaleString()}`);
}

async function main(): Promise<void> {
  loadDotenvFromPackageRoot();
  const dryRun = process.argv.includes("--dry-run");

  if (!process.env.DATABASE_URL?.trim()) {
    console.log("DATABASE_URL is unset — nothing to do.");
    process.exit(0);
  }

  const before = await examDistribution();
  printDist("BEFORE (exam → count)", before);

  const distinct = await prisma.$queryRaw<DistRow[]>`
    SELECT DISTINCT exam FROM exam_questions
    WHERE exam IS NOT NULL AND trim(exam) <> ''
    ORDER BY exam
  `;

  const plan: { from: string; to: string; n: bigint }[] = [];
  for (const { exam } of distinct) {
    const to = normalizeExamQuestionExamForStorage(exam);
    if (!to || to === exam) continue;
    const [{ c }] = await prisma.$queryRaw<{ c: bigint }[]>`
      SELECT COUNT(*)::bigint AS c FROM exam_questions WHERE exam = ${exam}
    `;
    if (c > 0n) plan.push({ from: exam, to, n: c });
  }

  const orderedPlan = orderExamQuestionExamRewritesForBackfill(plan);

  console.log(`\nPlanned rewrites (${orderedPlan.length} source values, dependency-ordered):`);
  for (const p of orderedPlan) {
    console.log(`  "${p.from}" → "${p.to}"  (${p.n.toString()} rows)`);
  }

  let totalUpdated = 0;
  if (!dryRun) {
    for (const p of orderedPlan) {
      const r = await prisma.examQuestion.updateMany({ where: { exam: p.from }, data: { exam: p.to } });
      totalUpdated += r.count;
    }
  } else {
    for (const p of orderedPlan) {
      totalUpdated += Number(p.n);
    }
  }

  console.log(`\n${dryRun ? "[dry-run] Would update" : "Updated"} row count: ${totalUpdated.toLocaleString()}`);

  const after = dryRun ? before : await examDistribution();
  printDist(dryRun ? "AFTER (unchanged in dry-run)" : "AFTER (exam → count)", after);

  if (process.argv.includes("--json")) {
    const ser = (rows: CountRow[]) =>
      rows.map((r) => ({ exam: r.exam, count: r.c.toString() }));
    console.log(
      JSON.stringify(
        {
          dryRun,
          before: ser(before),
          after: ser(after),
          plan: orderedPlan.map((p) => ({ from: p.from, to: p.to, count: p.n.toString() })),
          totalUpdatedRows: totalUpdated,
        },
        null,
        2,
      ),
    );
  }

  if (dryRun) {
    console.log("\nRe-run without --dry-run to apply updates.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
