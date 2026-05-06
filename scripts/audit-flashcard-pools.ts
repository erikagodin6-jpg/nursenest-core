#!/usr/bin/env tsx
/**
 * scripts/audit-flashcard-pools.ts
 *
 * Audits the flashcard pool data for all active pathways and reports:
 * - pathwayId / tier / exam
 * - total ExamQuestion count (all published)
 * - usable flashcard-derived ExamQuestion count (excl. ECG/video, requires stem + correct_answer)
 * - count by resolved builder category
 * - categories returning zero
 * - whether Flashcard table is empty
 * - suspected reason for zero pools
 *
 * Usage:
 *   npx tsx scripts/audit-flashcard-pools.ts
 *   npx tsx scripts/audit-flashcard-pools.ts --pathway ca-rn-nclex-rn
 *   npx tsx scripts/audit-flashcard-pools.ts --verbose
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Pathway definitions to audit
const AUDIT_PATHWAY_IDS = [
  { pathwayId: "ca-rn-nclex-rn", tier: "RN", examKeys: ["NCLEX-RN", "NCLEX_RN"], region: "CA" },
  { pathwayId: "us-rn-nclex-rn", tier: "RN", examKeys: ["NCLEX-RN", "NCLEX_RN"], region: "US" },
  { pathwayId: "ca-rpn-rex-pn", tier: "RPN", examKeys: ["NCLEX-PN", "REx-PN", "REX-PN"], region: "CA" },
  { pathwayId: "us-lpn-nclex-pn", tier: "LVN_LPN", examKeys: ["NCLEX-PN", "NCLEX_PN"], region: "US" },
  { pathwayId: "us-np-fnp", tier: "NP", examKeys: ["NP", "FNP", "NP-FNP"], region: "US" },
  { pathwayId: "ca-np-cnple", tier: "NP", examKeys: ["NP", "CNPLE", "CAN-NP"], region: "CA" },
] as const;

const VERBOSE = process.argv.includes("--verbose");
const PATHWAY_FILTER = (() => {
  const idx = process.argv.indexOf("--pathway");
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

type Row = { n: bigint };
type CategoryRow = { grp_value: string; cnt: bigint };
type ExamRow = { exam: string | null; tier: string | null; cnt: bigint };

function fmt(n: number | bigint): string {
  return Number(n).toLocaleString();
}

function inferZeroReason(info: {
  totalPublished: number;
  usableTotal: number;
  scopedTotal: number;
  flashcardTableCount: number;
  categoryZeroCount: number;
  totalCategoryCount: number;
}): string {
  if (info.totalPublished === 0) return "NO_PUBLISHED_EXAM_QUESTIONS_IN_DB";
  if (info.usableTotal === 0 && info.totalPublished > 0) return "ALL_QUESTIONS_ARE_ECG_VIDEO_OR_MISSING_STEM_ANSWER";
  if (info.scopedTotal === 0 && info.usableTotal > 0) return "EXAM_KEY_OR_TIER_MISMATCH_SCOPE_FILTERS_ALL_OUT";
  if (info.categoryZeroCount > 0 && info.categoryZeroCount === info.totalCategoryCount) return "CATEGORY_MAPPING_FAILED_ALL_GROUPS_UNRESOLVED";
  if (info.categoryZeroCount > 0) return "SOME_CATEGORIES_UNRESOLVED_CHECK_TOPIC_BODY_SYSTEM_FIELDS";
  if (info.flashcardTableCount === 0 && info.scopedTotal > 0) return "FLASHCARD_TABLE_EMPTY_BUT_EXAM_QUESTIONS_EXIST_OK";
  return "OK";
}

async function auditPathway(entry: (typeof AUDIT_PATHWAY_IDS)[number]) {
  const { pathwayId, tier, examKeys, region } = entry;

  console.log(`\n${"═".repeat(70)}`);
  console.log(`  PATHWAY: ${pathwayId}`);
  console.log(`  Tier: ${tier} | Exam Keys: ${examKeys.join(", ")} | Region: ${region}`);
  console.log(`${"═".repeat(70)}`);

  // 1. Total published ExamQuestions (no scope)
  const [totalPublishedRow] = await prisma.$queryRaw<Row[]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE status = 'PUBLISHED'
  `;
  const totalPublished = Number(totalPublishedRow?.n ?? 0);
  console.log(`  Total published ExamQuestions (all pathways): ${fmt(totalPublished)}`);

  // 2. Usable for flashcards (no ECG/video, has stem + correct_answer)
  const [usableTotalRow] = await prisma.$queryRaw<Row[]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions
    WHERE status = 'PUBLISHED'
      AND (question_format IS NULL OR lower(trim(question_format)) NOT IN ('ecg', 'ekg', 'video', 'video_case', 'media', 'image_only'))
      AND coalesce(trim(stem), '') <> ''
      AND correct_answer IS NOT NULL
  `;
  const usableTotal = Number(usableTotalRow?.n ?? 0);
  const ecgOrInvalidCount = totalPublished - usableTotal;
  console.log(`  Usable for flashcards (no ECG/video, has stem+answer): ${fmt(usableTotal)}`);
  console.log(`  ECG / video / invalid excluded: ${fmt(ecgOrInvalidCount)}`);

  // 3. Scoped by pathway exam keys (same as contentExamKeys filter)
  const examKeyList = examKeys.map((k) => k.toLowerCase());
  const [scopedTotalRow] = await prisma.$queryRaw<Row[]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions
    WHERE status = 'PUBLISHED'
      AND (question_format IS NULL OR lower(trim(question_format)) NOT IN ('ecg', 'ekg', 'video', 'video_case', 'media', 'image_only'))
      AND coalesce(trim(stem), '') <> ''
      AND correct_answer IS NOT NULL
      AND lower(coalesce(exam, '')) IN (${examKeyList.join("', '") as unknown as ReturnType<typeof String>})
  `;
  const scopedTotal = Number(scopedTotalRow?.n ?? 0);
  console.log(`  Scoped by exam keys (case-insensitive): ${fmt(scopedTotal)}`);

  // 4. Exam key distribution in DB
  const examDistRows = await prisma.$queryRaw<ExamRow[]>`
    SELECT lower(coalesce(exam, '(null)')) AS exam, lower(coalesce(tier, '(null)')) AS tier, COUNT(*)::bigint AS cnt
    FROM exam_questions
    WHERE status = 'PUBLISHED'
    GROUP BY 1, 2
    ORDER BY cnt DESC
    LIMIT 20
  `;
  if (VERBOSE) {
    console.log(`\n  Exam key distribution in DB (top 20):`);
    for (const r of examDistRows) {
      console.log(`    exam=${r.exam ?? "(null)"}  tier=${r.tier ?? "(null)"}  count=${fmt(r.cnt)}`);
    }
  }

  // Check if any of our exam keys match DB rows
  const matchedExamRows = examDistRows.filter((r) =>
    examKeyList.includes((r.exam ?? "").toLowerCase()),
  );
  if (matchedExamRows.length === 0 && scopedTotal === 0) {
    console.log(`  ⚠️  NO DB ROWS MATCH contentExamKeys — exam key mismatch!`);
    console.log(`     Expected (lowercase): ${examKeyList.join(", ")}`);
    console.log(`     Found in DB: ${examDistRows.map((r) => r.exam ?? "(null)").slice(0, 10).join(", ")}`);
  }

  // 5. Category breakdown of usable questions
  const categoryRows = await prisma.$queryRaw<CategoryRow[]>`
    SELECT
      COALESCE(NULLIF(trim(topic), ''), NULLIF(trim(body_system), ''), 'Uncategorized') AS grp_value,
      COUNT(*)::bigint AS cnt
    FROM exam_questions
    WHERE status = 'PUBLISHED'
      AND (question_format IS NULL OR lower(trim(question_format)) NOT IN ('ecg', 'ekg', 'video', 'video_case', 'media', 'image_only'))
      AND coalesce(trim(stem), '') <> ''
      AND correct_answer IS NOT NULL
    GROUP BY 1
    ORDER BY cnt DESC
    LIMIT 50
  `;

  console.log(`\n  Category breakdown (top 50 by count):`);
  let categoriesWithCount = 0;
  let zeroCategories = 0;
  for (const r of categoryRows) {
    const n = Number(r.cnt);
    if (n > 0) categoriesWithCount++;
    else zeroCategories++;
    if (VERBOSE || n > 0) {
      console.log(`    ${String(r.grp_value).padEnd(45)} ${fmt(n).padStart(6)}`);
    }
  }
  console.log(`  Categories with count > 0: ${categoriesWithCount}`);
  if (zeroCategories > 0) console.log(`  Categories with count = 0: ${zeroCategories}`);

  // 6. Flashcard table count for this pathway
  let flashcardTableCount = 0;
  try {
    const [fcRow] = await prisma.$queryRaw<Row[]>`
      SELECT COUNT(*)::bigint AS n FROM flashcards
    `;
    flashcardTableCount = Number(fcRow?.n ?? 0);
  } catch {
    flashcardTableCount = -1; // table doesn't exist
  }
  console.log(`\n  Flashcard table rows (all pathways): ${flashcardTableCount === -1 ? "TABLE NOT FOUND" : fmt(flashcardTableCount)}`);

  // 7. Suspected reason for zero pools
  const reason = inferZeroReason({
    totalPublished,
    usableTotal,
    scopedTotal,
    flashcardTableCount: Math.max(flashcardTableCount, 0),
    categoryZeroCount: zeroCategories,
    totalCategoryCount: categoryRows.length,
  });
  const icon = reason === "OK" || reason.includes("OK") ? "✅" : "❌";
  console.log(`\n  ${icon}  Diagnosis: ${reason}`);

  if (reason.includes("MISMATCH") || reason.includes("FAILED")) {
    console.log(`\n  RECOMMENDED FIX:`);
    if (reason.includes("MISMATCH")) {
      console.log(`    ExamQuestion rows have exam=${examDistRows[0]?.exam ?? "?"} but pathway expects ${examKeyList.join("|")}.`);
      console.log(`    The flashcard hub will now fall back to the entitlement WHERE (no exam scope).`);
      console.log(`    To permanently fix: re-seed ExamQuestion rows with exam='NCLEX-RN' (uppercase hyphen).`);
    }
  }

  return {
    pathwayId,
    totalPublished,
    usableTotal,
    scopedTotal,
    flashcardTableCount,
    categoryCount: categoriesWithCount,
    reason,
  };
}

async function main() {
  console.log("╔══════════════════════════════════════════════════════════════════════╗");
  console.log("║         NurseNest Flashcard Pool Audit                              ║");
  console.log("╚══════════════════════════════════════════════════════════════════════╝");
  console.log(`  Time: ${new Date().toISOString()}`);
  if (PATHWAY_FILTER) console.log(`  Filtering to pathway: ${PATHWAY_FILTER}`);
  if (VERBOSE) console.log(`  Verbose mode: ON`);

  const targets = PATHWAY_FILTER
    ? AUDIT_PATHWAY_IDS.filter((p) => p.pathwayId === PATHWAY_FILTER)
    : AUDIT_PATHWAY_IDS;

  if (targets.length === 0) {
    console.error(`\n  ERROR: No pathway found matching "${PATHWAY_FILTER}"`);
    console.error(`  Available: ${AUDIT_PATHWAY_IDS.map((p) => p.pathwayId).join(", ")}`);
    process.exit(1);
  }

  const results = [];
  for (const entry of targets) {
    try {
      const result = await auditPathway(entry);
      results.push(result);
    } catch (err) {
      console.error(`\n  ERROR auditing ${entry.pathwayId}:`, err);
      results.push({ pathwayId: entry.pathwayId, reason: "AUDIT_ERROR" });
    }
  }

  console.log(`\n${"═".repeat(70)}`);
  console.log("  SUMMARY");
  console.log(`${"═".repeat(70)}`);
  for (const r of results) {
    const icon = (r.reason === "OK" || (r.reason ?? "").includes("OK")) ? "✅" : "❌";
    const usable = "usableTotal" in r ? fmt(r.usableTotal) : "?";
    const scoped = "scopedTotal" in r ? fmt(r.scopedTotal) : "?";
    console.log(`  ${icon} ${r.pathwayId.padEnd(30)} usable=${String(usable).padStart(6)}  scoped=${String(scoped).padStart(6)}  ${r.reason}`);
  }

  const hasIssues = results.some((r) => r.reason !== "OK" && !(r.reason ?? "").includes("OK"));
  if (hasIssues) {
    console.log(`\n  ❌ Action required — see individual pathway reports above.`);
    process.exit(1);
  } else {
    console.log(`\n  ✅ All pathways have usable flashcard question pools.`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
