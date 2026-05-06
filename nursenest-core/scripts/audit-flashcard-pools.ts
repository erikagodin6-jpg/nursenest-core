#!/usr/bin/env tsx
/**
 * nursenest-core/scripts/audit-flashcard-pools.ts
 *
 * Audits flashcard pool data for all active pathways and reports:
 * - pathwayId / tier / exam
 * - total ExamQuestion count (all published)
 * - usable flashcard-derived count (excl. ECG/video; stem≥10 + correct_answer JSON + topic/body)
 * - count by raw topic/body_system category
 * - categories returning zero
 * - whether Flashcard table is empty
 * - suspected reason for zero pools
 *
 * Usage (from nursenest-core/ directory):
 *   npx tsx scripts/audit-flashcard-pools.ts
 *   npx tsx scripts/audit-flashcard-pools.ts --pathway ca-rn-nclex-rn
 *   npx tsx scripts/audit-flashcard-pools.ts --verbose
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  examKeyNormsForPathwayPool,
  examQuestionExamNormInSql,
} from "../src/lib/content-quality/exam-question-exam-normalization";
import { databaseUrlDriftAuditPublic } from "../src/lib/db/database-url-drift-audit";
import {
  EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL,
  EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL,
  EXAM_QUESTION_STATUS_PUBLISHED_SQL,
  EXAM_QUESTION_TOPIC_OR_BODY_SQL,
} from "../src/lib/questions/exam-question-bank-sql";

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

const AUDIT_PATHWAYS = [
  { pathwayId: "ca-rn-nclex-rn",   tier: "RN",     examKeys: ["NCLEX-RN", "NCLEX_RN"],           region: "CA" },
  { pathwayId: "us-rn-nclex-rn",   tier: "RN",     examKeys: ["NCLEX-RN", "NCLEX_RN"],           region: "US" },
  { pathwayId: "ca-rpn-rex-pn",    tier: "RPN",    examKeys: ["NCLEX-PN", "REx-PN", "REX-PN"],   region: "CA" },
  { pathwayId: "us-lpn-nclex-pn",  tier: "LVN/LPN",examKeys: ["NCLEX-PN", "NCLEX_PN"],           region: "US" },
  { pathwayId: "us-np-fnp",        tier: "NP",     examKeys: ["NP", "FNP", "NP-FNP"],            region: "US" },
  { pathwayId: "ca-np-cnple",      tier: "NP",     examKeys: ["NP", "CNPLE", "CAN-NP"],          region: "CA" },
];

const VERBOSE = process.argv.includes("--verbose");
const PATHWAY_FILTER = (() => {
  const idx = process.argv.indexOf("--pathway");
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

type CountRow   = { n: bigint };
type CatRow     = { grp_value: string; cnt: bigint };
type ExamDbRow  = { exam_val: string; tier_val: string; cnt: bigint };

type AuditResult =
  | { ok: true;  pathwayId: string; totalPublished: number; usableTotal: number; scopedTotal: number; flashcardTableCount: number; categoryCount: number; reason: string }
  | { ok: false; pathwayId: string; reason: string };

function fmt(n: number | bigint): string {
  return Number(n).toLocaleString();
}

function inferReason(p: {
  totalPublished: number;
  usableTotal: number;
  scopedTotal: number;
  flashcardTableCount: number;
  zeroCategoryCount: number;
  totalCategoryCount: number;
}): string {
  if (p.totalPublished === 0) return "NO_PUBLISHED_EXAM_QUESTIONS_IN_DB";
  if (p.usableTotal === 0) return "ALL_QUESTIONS_ECG_VIDEO_OR_MISSING_STEM_ANSWER";
  if (p.scopedTotal === 0) return "EXAM_KEY_OR_TIER_MISMATCH_SCOPE_FILTERS_ALL_OUT";
  if (p.zeroCategoryCount > 0 && p.zeroCategoryCount === p.totalCategoryCount) return "CATEGORY_MAPPING_ALL_FAILED";
  if (p.zeroCategoryCount > 0) return "SOME_CATEGORIES_UNRESOLVED_CHECK_TOPIC_BODY_SYSTEM";
  if (p.flashcardTableCount === 0 && p.scopedTotal > 0) return "FLASHCARD_TABLE_EMPTY_BUT_EXAM_QUESTIONS_EXIST_OK";
  return "OK";
}

async function auditOne(pw: typeof AUDIT_PATHWAYS[number]): Promise<AuditResult> {
  const { pathwayId, tier, examKeys, region } = pw;

  console.log(`\n${"═".repeat(68)}`);
  console.log(`  PATHWAY : ${pathwayId}`);
  console.log(`  Tier    : ${tier}  |  Exam Keys : ${examKeys.join(", ")}  |  Region : ${region}`);
  console.log("═".repeat(68));

  // 1. All published
  const [totalRow] = await prisma.$queryRaw<CountRow[]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
  `;
  const totalPublished = Number(totalRow?.n ?? 0);
  console.log(`  All published questions               : ${fmt(totalPublished)}`);

  // 2. Usable (no ECG/video, has stem + correct_answer)
  const [usableRow] = await prisma.$queryRaw<CountRow[]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions
    WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
      AND length(trim(coalesce(stem, ''))) >= 10
      AND ${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}
      AND ${EXAM_QUESTION_TOPIC_OR_BODY_SQL}
      AND ${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}
  `;
  const usableTotal = Number(usableRow?.n ?? 0);
  console.log(`  Usable for flashcards                : ${fmt(usableTotal)}`);
  console.log(`  Excluded (ECG/video/no-stem/no-ans)  : ${fmt(totalPublished - usableTotal)}`);

  // 3. Scoped by exam keys (norm matches pathway keys: case + underscore/hyphen tolerant)
  const examNorms = examKeyNormsForPathwayPool(examKeys);
  const scopedRow = await prisma.$queryRaw<CountRow[]>(
    Prisma.sql`
      SELECT COUNT(*)::bigint AS n FROM exam_questions
      WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
        AND length(trim(coalesce(stem, ''))) >= 10
        AND ${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}
        AND ${EXAM_QUESTION_TOPIC_OR_BODY_SQL}
        AND ${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}
        AND (${examQuestionExamNormInSql(examNorms)})
    `,
  );
  const scopedTotal = Number(scopedRow[0]?.n ?? 0);
  console.log(`  Scoped by exam keys (case-ins.)      : ${fmt(scopedTotal)}`);

  // 4. Exam-key distribution in DB
  const examDbRows = await prisma.$queryRaw<ExamDbRow[]>`
    SELECT
      lower(coalesce(exam,  '(null)')) AS exam_val,
      lower(coalesce(tier,  '(null)')) AS tier_val,
      COUNT(*)::bigint                 AS cnt
    FROM exam_questions
    WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
    GROUP BY 1, 2
    ORDER BY cnt DESC
    LIMIT 20
  `;

  if (VERBOSE) {
    console.log(`\n  Exam/tier distribution in DB (top 20):`);
    for (const r of examDbRows) {
      console.log(`    exam=${String(r.exam_val).padEnd(20)} tier=${String(r.tier_val).padEnd(12)} count=${fmt(r.cnt)}`);
    }
  }

  const matched = examDbRows.filter((r) => examLower.includes(r.exam_val));
  if (matched.length === 0 && scopedTotal === 0 && totalPublished > 0) {
    console.log(`\n  ⚠️  NO DB ROWS MATCH contentExamKeys — exam key mismatch!`);
    console.log(`     Expected (lowercase) : ${examLower.join(", ")}`);
    const found = [...new Set(examDbRows.map((r) => r.exam_val))].slice(0, 8).join(", ");
    console.log(`     Found in DB          : ${found || "(none)"}`);
    console.log(`     FALLBACK ACTIVE      : flashcard hub will skip exam scope and use entitlement WHERE only.`);
    console.log(`     PERMANENT FIX        : re-seed ExamQuestion rows with exam matching one of the exam keys above.`);
  }

  // 5. Category breakdown
  const catRows = await prisma.$queryRaw<CatRow[]>`
    SELECT
      coalesce(nullif(trim(topic), ''), nullif(trim(body_system), ''), 'Uncategorized') AS grp_value,
      COUNT(*)::bigint AS cnt
    FROM exam_questions
    WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
      AND length(trim(coalesce(stem, ''))) >= 10
      AND ${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}
      AND ${EXAM_QUESTION_TOPIC_OR_BODY_SQL}
      AND ${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}
    GROUP BY 1
    ORDER BY cnt DESC
    LIMIT 50
  `;

  console.log(`\n  Category breakdown (top 50, by usable count):`);
  let withCount = 0;
  let zeroCount = 0;
  for (const r of catRows) {
    const n = Number(r.cnt);
    if (n > 0) withCount++;
    else zeroCount++;
    if (VERBOSE || n > 0) {
      console.log(`    ${String(r.grp_value).padEnd(44)} ${fmt(n).padStart(6)}`);
    }
  }
  console.log(`  Categories with count > 0  : ${withCount}`);
  if (zeroCount > 0) console.log(`  Categories with count = 0  : ${zeroCount}`);

  // 6. Flashcard table
  let flashcardTableCount = 0;
  try {
    const [fcRow] = await prisma.$queryRaw<CountRow[]>`SELECT COUNT(*)::bigint AS n FROM flashcards`;
    flashcardTableCount = Number(fcRow?.n ?? 0);
  } catch {
    flashcardTableCount = -1;
  }
  const fcDisplay = flashcardTableCount === -1 ? "TABLE NOT FOUND" : fmt(flashcardTableCount);
  console.log(`\n  Flashcard table rows (all pathways) : ${fcDisplay}`);

  // 7. Diagnosis
  const reason = inferReason({
    totalPublished,
    usableTotal,
    scopedTotal,
    flashcardTableCount: Math.max(flashcardTableCount, 0),
    zeroCategoryCount: zeroCount,
    totalCategoryCount: catRows.length,
  });
  const icon = reason === "OK" || reason.endsWith("_OK") ? "✅" : "❌";
  console.log(`\n  ${icon}  Diagnosis : ${reason}`);

  return {
    ok: true,
    pathwayId,
    totalPublished,
    usableTotal,
    scopedTotal,
    flashcardTableCount: Math.max(flashcardTableCount, 0),
    categoryCount: withCount,
    reason,
  };
}

async function main() {
  loadDotenvFromPackageRoot();
  console.log("╔══════════════════════════════════════════════════════════════════════╗");
  console.log("║         NurseNest — Flashcard Pool Audit                            ║");
  console.log("╚══════════════════════════════════════════════════════════════════════╝");
  console.log(`  ${new Date().toISOString()}`);
  if (PATHWAY_FILTER) console.log(`  Filter  : ${PATHWAY_FILTER}`);
  if (VERBOSE) console.log(`  Verbose : ON`);

  const rawUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (!rawUrl) {
    console.log("\n  DATABASE_URL is unset — Prisma CLI / this script cannot reach a database.");
    console.log("  Set DATABASE_URL to the same value as the Next.js app (compare in hosting env UI).\n");
    process.exit(0);
  }
  const audit = databaseUrlDriftAuditPublic(rawUrl);
  if (audit) {
    console.log("\n  Connected database target (redacted, compare to app / production):");
    console.log(`    host       : ${audit.host}`);
    console.log(`    port       : ${audit.port}`);
    console.log(`    database   : ${audit.database}`);
    console.log(`    user       : ${audit.username}`);
    console.log(`    url fp(10) : ${audit.fingerprintPrefix10}`);
    console.log(
      "\n  If every pathway shows NO_PUBLISHED_EXAM_QUESTIONS_IN_DB but production should have rows,",
    );
    console.log("  this fingerprint almost certainly does not match the app's DATABASE_URL.\n");
  }

  const [totAll] = await prisma.$queryRaw<CountRow[]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions
  `;
  const [pubAll] = await prisma.$queryRaw<CountRow[]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
  `;
  const [unpubAll] = await prisma.$queryRaw<CountRow[]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE NOT (${EXAM_QUESTION_STATUS_PUBLISHED_SQL})
  `;
  console.log("  exam_questions: total=", fmt(totAll.n), " published=", fmt(pubAll.n), " unpublished=", fmt(unpubAll.n));

  const targets = PATHWAY_FILTER
    ? AUDIT_PATHWAYS.filter((p) => p.pathwayId === PATHWAY_FILTER)
    : AUDIT_PATHWAYS;

  if (targets.length === 0) {
    console.error(`\n  ERROR: No pathway matching "${PATHWAY_FILTER}"`);
    console.error(`  Valid : ${AUDIT_PATHWAYS.map((p) => p.pathwayId).join(", ")}`);
    process.exit(1);
  }

  const results: AuditResult[] = [];
  for (const entry of targets) {
    try {
      results.push(await auditOne(entry));
    } catch (err) {
      console.error(`\n  ERROR auditing ${entry.pathwayId}:`, err);
      results.push({ ok: false, pathwayId: entry.pathwayId, reason: "AUDIT_ERROR" });
    }
  }

  console.log(`\n${"═".repeat(68)}`);
  console.log("  SUMMARY");
  console.log("═".repeat(68));
  for (const r of results) {
    const icon = r.reason === "OK" || r.reason.endsWith("_OK") ? "✅" : "❌";
    if (r.ok) {
      console.log(
        `  ${icon} ${r.pathwayId.padEnd(28)}` +
        `  usable=${fmt(r.usableTotal).padStart(6)}` +
        `  scoped=${fmt(r.scopedTotal).padStart(6)}` +
        `  ${r.reason}`,
      );
    } else {
      console.log(`  ❌ ${r.pathwayId.padEnd(28)}  ${r.reason}`);
    }
  }

  const hasIssues = results.some((r) => r.reason !== "OK" && !r.reason.endsWith("_OK"));
  if (hasIssues) {
    console.log(`\n  ❌  Action required — review individual pathway reports above.`);
    process.exit(1);
  }
  console.log(`\n  ✅  All audited pathways have usable flashcard question pools.`);
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
