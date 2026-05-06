#!/usr/bin/env tsx
/**
 * Dry-run by default: show planned `exam_questions.exam` rewrites (pathway-aligned canonicals).
 * Pass `--apply` to execute updates (same normalization rules as `normalize-exam-question-exam-values.ts`).
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/repair-exam-question-exam-keys.ts
 *   npx tsx scripts/repair-exam-question-exam-keys.ts --apply
 *   npx tsx scripts/repair-exam-question-exam-keys.ts --json
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
  const apply = process.argv.includes("--apply");
  const asJson = process.argv.includes("--json");

  if (!process.env.DATABASE_URL?.trim()) {
    console.log("DATABASE_URL is unset — nothing to do.");
    process.exit(0);
  }

  const { plan, totalRowsTouched, before, after } = await runExamQuestionExamValueRepair({
    prisma,
    execute: apply,
  });

  if (asJson) {
    const ser = (rows: { exam: string; c: bigint }[]) =>
      rows.map((r) => ({ exam: r.exam, count: r.c.toString() }));
    console.log(
      JSON.stringify(
        {
          dryRun: !apply,
          plan: plan.map((p) => ({ from: p.from, to: p.to, count: p.n.toString() })),
          totalRowsTouched,
          before: ser(before),
          after: ser(after),
        },
        null,
        2,
      ),
    );
    return;
  }

  printDist("BEFORE (exam → count)", before);
  console.log(`\nPlanned rewrites (${plan.length} source values, dependency-ordered):`);
  for (const p of plan) {
    console.log(`  "${p.from}" → "${p.to}"  (${p.n.toString()} rows)`);
  }
  console.log(`\n${apply ? "Applied updates" : "[dry-run] Would touch"} row count: ${totalRowsTouched.toLocaleString()}`);
  printDist(apply ? "AFTER (exam → count)" : "AFTER (unchanged in dry-run)", after);

  if (!apply) {
    console.log("\nRe-run with --apply to execute updates.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
