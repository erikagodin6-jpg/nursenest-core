#!/usr/bin/env tsx
/**
 * One-shot: normalize `exam_questions.exam` to pathway-aligned canonical strings
 * (see `src/lib/content-quality/exam-question-exam-normalization.ts`).
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/normalize-exam-question-exam-values.ts --dry-run
 *   npx tsx scripts/normalize-exam-question-exam-values.ts
 *   npx tsx scripts/normalize-exam-question-exam-values.ts --dry-run --json
 *
 * Prefer `scripts/repair-exam-question-exam-keys.ts` for default-dry-run UX (`--apply` to write).
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { runExamQuestionExamValueRepair } from "../src/lib/content-quality/run-exam-question-exam-value-repair";

const prisma = new PrismaClient();

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

function printDist(label: string, rows: { exam: string; c: bigint }[]): void {
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

  const { plan, totalRowsTouched, before, after } = await runExamQuestionExamValueRepair({
    prisma,
    execute: !dryRun,
  });

  printDist("BEFORE (exam → count)", before);

  console.log(`\nPlanned rewrites (${plan.length} source values, dependency-ordered):`);
  for (const p of plan) {
    console.log(`  "${p.from}" → "${p.to}"  (${p.n.toString()} rows)`);
  }

  console.log(`\n${dryRun ? "[dry-run] Would update" : "Updated"} row count: ${totalRowsTouched.toLocaleString()}`);

  printDist(dryRun ? "AFTER (unchanged in dry-run)" : "AFTER (exam → count)", after);

  if (process.argv.includes("--json")) {
    const ser = (rows: { exam: string; c: bigint }[]) =>
      rows.map((r) => ({ exam: r.exam, count: r.c.toString() }));
    console.log(
      JSON.stringify(
        {
          dryRun,
          before: ser(before),
          after: ser(after),
          plan: plan.map((p) => ({ from: p.from, to: p.to, count: p.n.toString() })),
          totalUpdatedRows: totalRowsTouched,
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
