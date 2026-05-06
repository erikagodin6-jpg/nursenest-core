#!/usr/bin/env tsx
/**
 * Populate `exam_questions` for flashcards, linear practice, and CAT.
 *
 * **Scale (300+ RN items, etc.)** comes from a Replit monolith export (`exam_questions.json`) +
 * `npm run import:replit-data:apply` (or this script with `--apply` when that file is present).
 * Without an export bundle, this script runs **`ensure-exam-question-bank`** only: minimal curated
 * seeds + publish valid drafts + pathway minimum upserts (non-zero pools, not full bank volume).
 *
 * Usage (from `nursenest-core/` package root):
 *   npx tsx scripts/populate-exam-question-bank.ts              # dry-run: print DB + counts + next step
 *   npx tsx scripts/populate-exam-question-bank.ts --apply      # run import (if export) + ensure pipeline
 *
 * Env:
 *   NN_REPLIT_EXPORT_DIR   Override folder that contains `exam_questions.json` (default: ./data/replit-exports)
 *   NN_POPULATE_REQUIRE_MIN=1   After --apply, exit 1 if US RN pathway pool is under 300 (smoke for prod dumps)
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { databaseUrlDriftAuditPublic } from "../src/lib/db/database-url-drift-audit";
import {
  CORE_PATHWAY_AUDIT_ROWS,
  countCorePathwayPublishedPool,
} from "../src/lib/exams/ensure-core-pathway-exam-questions";
import {
  EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL,
  EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL,
  EXAM_QUESTION_STATUS_PUBLISHED_SQL,
  EXAM_QUESTION_TOPIC_OR_BODY_SQL,
} from "../src/lib/questions/exam-question-bank-sql";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const NS_CORE = resolve(__dirname, "..");
const WORKSPACE_ROOT = resolve(NS_CORE, "..");

function loadDotenvFromPackageRoot(): void {
  for (const name of [".env", ".env.local", ".env.production"]) {
    const p = resolve(NS_CORE, name);
    if (!existsSync(p)) continue;
    const parsed = parseDotenv(readFileSync(p, "utf8"));
    for (const [k, v] of Object.entries(parsed)) {
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
}

function exportDir(): string {
  const fromEnv = process.env.NN_REPLIT_EXPORT_DIR?.trim();
  if (fromEnv) return resolve(fromEnv);
  return resolve(NS_CORE, "data/replit-exports");
}

function examQuestionsJsonPath(): string {
  return resolve(exportDir(), "exam_questions.json");
}

async function printCounts(prisma: PrismaClient, label: string): Promise<void> {
  const [tot] = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions
  `;
  const [pub] = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
  `;
  const [usable] = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions
    WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
      AND ${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}
      AND length(trim(coalesce(stem, ''))) >= 10
      AND ${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}
      AND ${EXAM_QUESTION_TOPIC_OR_BODY_SQL}
  `;
  console.log(`\n=== ${label} ===`);
  console.log(`  exam_questions total     : ${Number(tot.n).toLocaleString()}`);
  console.log(`  published (norm status)  : ${Number(pub.n).toLocaleString()}`);
  console.log(`  usable flashcard/practice: ${Number(usable.n).toLocaleString()}`);
  console.log("\n  Per core pathway (published pool, same gates as ensure-core-pathway):");
  for (const row of CORE_PATHWAY_AUDIT_ROWS) {
    const n = await countCorePathwayPublishedPool(prisma, row.pathwayId);
    console.log(`    ${row.pathwayId.padEnd(22)} ${n === -1 ? "n/a" : n.toLocaleString()}`);
  }
}

function run(cmd: string, args: string[], cwd: string): boolean {
  console.log(`\n> ${cmd} ${args.join(" ")}  (cwd=${cwd})`);
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", shell: false, env: process.env });
  if (r.error) {
    console.error(r.error);
    return false;
  }
  if (r.status !== 0) {
    console.error(`exit ${r.status}`);
    return false;
  }
  return true;
}

async function main(): Promise<void> {
  loadDotenvFromPackageRoot();
  const apply = process.argv.includes("--apply");
  const requireMin = process.env.NN_POPULATE_REQUIRE_MIN === "1";

  console.log("╔══════════════════════════════════════════════════════════════════════╗");
  console.log("║  Populate ExamQuestion bank (import + ensure)                       ║");
  console.log("╚══════════════════════════════════════════════════════════════════════╝");

  const rawUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (!rawUrl) {
    console.log("\nDATABASE_URL is unset. Set it to the same value as the running app, then re-run.\n");
    process.exit(1);
  }
  const audit = databaseUrlDriftAuditPublic(rawUrl);
  if (audit) {
    console.log("\nPrisma / app DATABASE_URL target (redacted):");
    console.log(`  host       : ${audit.host}`);
    console.log(`  port       : ${audit.port}`);
    console.log(`  database   : ${audit.database}`);
    console.log(`  user       : ${audit.username}`);
    console.log(`  url fp(10) : ${audit.fingerprintPrefix10}`);
    console.log("\nCompare host + database + fingerprint with your deployment env (DigitalOcean / Vercel / etc.).");
  }

  const prisma = new PrismaClient();
  try {
    await printCounts(prisma, "Before");

    const exFile = examQuestionsJsonPath();
    const hasMonolith = existsSync(exFile);
    console.log(`\nExport dir : ${exportDir()}`);
    console.log(`exam_questions.json present: ${hasMonolith ? "yes → full monolith import available" : "no"}`);

    if (!apply) {
      console.log("\n[dry-run] Pass --apply to:");
      if (hasMonolith) {
        console.log(
          "  1) Run workspace orchestrated Replit import (writes exam_questions + related phases)\n  2) Run ensure-exam-question-bank (publish drafts + pathway minimums)",
        );
      } else {
        console.log(
          "  Run ensure-exam-question-bank only.\n  For 300+ RN / 200+ PN / NP items, add `exam_questions.json` under the export dir (or set NN_REPLIT_EXPORT_DIR) and re-run with --apply.",
        );
      }
      console.log(
        "\nFull import (manual):\n  cd .. && npx tsx scripts/replit-export-import/orchestrated-import.ts --apply --dir nursenest-core/data/replit-exports",
      );
      return;
    }

    if (hasMonolith) {
      const ok = run("npx", ["tsx", "scripts/replit-export-import/orchestrated-import.ts", "--apply", `--dir=${exportDir()}`], WORKSPACE_ROOT);
      if (!ok) {
        console.error("\nOrchestrated import failed.");
        process.exit(1);
      }
    } else {
      console.log("\n(no exam_questions.json — skipping monolith import)");
    }

    const okEnsure = run("npx", ["tsx", "scripts/ensure-exam-question-bank.ts"], NS_CORE);
    if (!okEnsure) {
      console.error("\nensure-exam-question-bank failed.");
      process.exit(1);
    }

    await printCounts(prisma, "After");

    if (requireMin) {
      const rnPool = await countCorePathwayPublishedPool(prisma, "us-rn-nclex-rn");
      if (rnPool >= 0 && rnPool < 300) {
        console.error(
          `\nNN_POPULATE_REQUIRE_MIN=1: US RN pathway pool (${rnPool}) is below 300. Add monolith export or generate/promote admin AI drafts.`,
        );
        process.exit(1);
      }
    }

    console.log("\nDone. Re-run: npx tsx scripts/audit-flashcard-pools.ts --verbose\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
