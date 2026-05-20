#!/usr/bin/env tsx
/**
 * Distinct `exam_questions.exam` values with counts; optional tier + study pathway breakdown.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/audit-exam-question-exam-keys.ts
 *   npx tsx scripts/audit-exam-question-exam-keys.ts --json
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import {
  examQuestionExamPublishAllowlist,
  normalizeExamQuestionExamForStorage,
  normExamKeyForMatching,
} from "../src/lib/content-quality/exam-question-exam-normalization";

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

async function hasStudyLinkPathwayColumn(): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'exam_questions'
        AND column_name = 'study_link_pathway_id'
    ) AS exists
  `;
  return Boolean(rows[0]?.exists);
}

async function main(): Promise<void> {
  loadDotenvFromPackageRoot();
  const asJson = process.argv.includes("--json");

  if (!process.env.DATABASE_URL?.trim()) {
    console.log("DATABASE_URL is unset — nothing to do.");
    process.exit(0);
  }

  const allow = examQuestionExamPublishAllowlist();
  const rows = await prisma.$queryRaw<{ exam: string; c: bigint }[]>`
    SELECT exam, COUNT(*)::bigint AS c
    FROM exam_questions
    WHERE exam IS NOT NULL AND trim(exam) <> ''
    GROUP BY exam
    ORDER BY c DESC
  `;

  const byTier = await prisma.$queryRaw<{ exam: string; tier: string | null; c: bigint }[]>`
    SELECT exam, tier, COUNT(*)::bigint AS c
    FROM exam_questions
    WHERE exam IS NOT NULL AND trim(exam) <> ''
    GROUP BY exam, tier
    ORDER BY c DESC
    LIMIT 500
  `;

  const linkCol = await hasStudyLinkPathwayColumn();
  const byPathway = linkCol
    ? await prisma.$queryRaw<{ exam: string; study_link_pathway_id: string | null; c: bigint }[]>`
        SELECT exam, study_link_pathway_id, COUNT(*)::bigint AS c
        FROM exam_questions
        WHERE exam IS NOT NULL AND trim(exam) <> ''
        GROUP BY exam, study_link_pathway_id
        ORDER BY c DESC
        LIMIT 500
      `
    : [];

  const suggestions = rows.map((r) => {
    const canon = normalizeExamQuestionExamForStorage(r.exam);
    const n = normExamKeyForMatching(r.exam);
    const onAllowlist = allow.has(r.exam.trim());
    const suggested = canon && canon !== r.exam ? canon : null;
    return { exam: r.exam, count: r.c, norm: n, onAllowlist, suggested };
  });

  if (asJson) {
    console.log(
      JSON.stringify(
        {
          distinctCount: rows.length,
          rows: rows.map((r) => ({ exam: r.exam, count: r.c.toString() })),
          byTier: byTier.map((r) => ({
            exam: r.exam,
            tier: r.tier,
            count: r.c.toString(),
          })),
          byPathway: byPathway.map((r) => ({
            exam: r.exam,
            study_link_pathway_id: r.study_link_pathway_id,
            count: r.c.toString(),
          })),
          suggestions,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`Distinct non-empty exam values: ${rows.length}`);
  console.log("-".repeat(72));
  for (const r of rows.slice(0, 80)) {
    const s = suggestions.find((x) => x.exam === r.exam);
    const flag = s?.onAllowlist ? "allowlist" : "non-allowlist";
    const hint = s?.suggested ? ` → ${s.suggested}` : "";
    console.log(`${String(r.exam).padEnd(32)} ${Number(r.c).toLocaleString().padStart(10)}  ${flag}${hint}`);
  }
  if (rows.length > 80) console.log(`  … ${rows.length - 80} more rows (use --json for full export)`);

  console.log("\nBy exam + tier (top 500 groups):");
  for (const r of byTier.slice(0, 40)) {
    console.log(`  ${r.exam} | tier=${r.tier ?? "(null)"} | ${Number(r.c).toLocaleString()}`);
  }

  if (linkCol && byPathway.length) {
    console.log("\nBy exam + study_link_pathway_id (top 500 groups):");
    for (const r of byPathway.slice(0, 40)) {
      console.log(`  ${r.exam} | pathway=${r.study_link_pathway_id ?? "(null)"} | ${Number(r.c).toLocaleString()}`);
    }
  } else if (!linkCol) {
    console.log("\n(study_link_pathway_id column absent — skipped pathway breakdown.)");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
