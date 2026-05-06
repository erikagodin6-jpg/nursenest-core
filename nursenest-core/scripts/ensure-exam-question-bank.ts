#!/usr/bin/env tsx
/**
 * Diagnose `exam_questions`, publish eligible drafts (minimal gates), seed empty bank if needed,
 * then upsert minimal published rows for any core pathway pool that is still zero.
 *
 * Does not modify learner UI or flashcard selection logic — data + operational scripts only.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/ensure-exam-question-bank.ts --dry-run
 *   npx tsx scripts/ensure-exam-question-bank.ts
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { databaseUrlDriftAuditPublic } from "../src/lib/db/database-url-drift-audit";
import { seedMinimalQuestionBankIfEmpty } from "../src/lib/exams/seed-minimal-question-bank";
import {
  CORE_PATHWAY_AUDIT_ROWS,
  countCorePathwayPublishedPool,
  ensureCorePathwayPublishedExamQuestions,
} from "../src/lib/exams/ensure-core-pathway-exam-questions";
import {
  examQuestionDraftPublishableMinimalSql,
  EXAM_QUESTION_STATUS_PUBLISHED_SQL,
} from "../src/lib/questions/exam-question-bank-sql";

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

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  loadDotenvFromPackageRoot();

  const rawUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (!rawUrl) {
    console.log("DATABASE_URL unset — nothing to do.");
    process.exit(0);
  }

  const audit = databaseUrlDriftAuditPublic(rawUrl);
  if (audit) {
    console.log("\nConnected database (redacted — compare to app / production DATABASE_URL):");
    console.log(`  host       : ${audit.host}`);
    console.log(`  port       : ${audit.port}`);
    console.log(`  database   : ${audit.database}`);
    console.log(`  user       : ${audit.username}`);
    console.log(`  url fp(10) : ${audit.fingerprintPrefix10}`);
  }

  console.log("\n=== exam_questions (before) ===");
  const [totalRow] = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions
  `;
  const [pubRow] = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
  `;
  const [draftRow] = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE lower(trim(coalesce(status, ''))) = 'draft'
  `;
  console.log(`  total rows   : ${Number(totalRow.n).toLocaleString()}`);
  console.log(`  published    : ${Number(pubRow.n).toLocaleString()}`);
  console.log(`  draft        : ${Number(draftRow.n).toLocaleString()}`);

  console.log("\n=== Published by exam / tier (top 25) ===");
  const examTier = await prisma.$queryRaw<{ exam: string; tier: string; c: bigint }[]>`
    SELECT exam, tier, COUNT(*)::bigint AS c
    FROM exam_questions
    WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
    GROUP BY exam, tier
    ORDER BY c DESC
    LIMIT 25
  `;
  for (const r of examTier) {
    console.log(`  ${String(r.exam).padEnd(22)} ${String(r.tier).padEnd(12)} ${Number(r.c).toLocaleString()}`);
  }

  try {
    const byLink = await prisma.$queryRaw<{ pid: string | null; c: bigint }[]>`
      SELECT study_link_pathway_id AS pid, COUNT(*)::bigint AS c
      FROM exam_questions
      WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
      GROUP BY study_link_pathway_id
      ORDER BY c DESC NULLS LAST
      LIMIT 20
    `;
    console.log("\n=== Published by study_link_pathway_id (top 20) ===");
    for (const r of byLink) {
      console.log(`  ${(r.pid ?? "(null)").padEnd(30)} ${Number(r.c).toLocaleString()}`);
    }
  } catch {
    console.log("\n(study_link_pathway_id column absent — skip pathwayId breakdown.)");
  }

  console.log("\n=== Core pathway published pools (before actions) ===");
  const beforePools: { pathwayId: string; n: number }[] = [];
  for (const p of CORE_PATHWAY_AUDIT_ROWS) {
    const n = await countCorePathwayPublishedPool(prisma, p.pathwayId);
    beforePools.push({ pathwayId: p.pathwayId, n });
    console.log(`  ${p.pathwayId.padEnd(22)} ${n.toLocaleString().padStart(8)}`);
  }

  if (dryRun) {
    console.log("\n[dry-run] Skipping seed, publish UPDATE, and pathway upserts.");
    return;
  }

  let seededMinimal = false;
  const seedRes = await seedMinimalQuestionBankIfEmpty();
  seededMinimal = seedRes.seeded;
  if (seededMinimal) {
    console.log("\n[seed] Minimal question bank inserted (was completely empty of published rows).");
  }

  const publishWhere = examQuestionDraftPublishableMinimalSql();
  const publishedFromDrafts = await prisma.$executeRaw`
    UPDATE exam_questions
    SET
      status = 'published',
      published_at = COALESCE(published_at, NOW())
    WHERE ${publishWhere}
  `;
  console.log(`\n[publish] Rows updated from draft (minimal gates): ${Number(publishedFromDrafts).toLocaleString()}`);

  const { results: ensureResults, totalInserted: pathwayUpserts } =
    await ensureCorePathwayPublishedExamQuestions(prisma);
  console.log(`\n[pathway-upsert] Rows upserted for empty pools: ${pathwayUpserts.toLocaleString()}`);
  for (const r of ensureResults) {
    if (r.inserted > 0 || r.poolBefore === 0) {
      console.log(
        `  ${r.pathwayId}  pool_before=${r.poolBefore === -1 ? "n/a" : r.poolBefore}  inserted=${r.inserted}`,
      );
    }
  }

  console.log("\n=== Core pathway published pools (after) ===");
  for (const p of CORE_PATHWAY_AUDIT_ROWS) {
    const n = await countCorePathwayPublishedPool(prisma, p.pathwayId);
    console.log(`  ${p.pathwayId.padEnd(22)} ${n.toLocaleString().padStart(8)}`);
  }

  console.log(
    `\n=== Summary ===\n  minimal_seed_triggered: ${seededMinimal}\n  draft_publish_updated   : ${Number(publishedFromDrafts).toLocaleString()}\n  pathway_upserts         : ${pathwayUpserts.toLocaleString()}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
