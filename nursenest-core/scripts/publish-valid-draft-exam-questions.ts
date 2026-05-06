#!/usr/bin/env tsx
/**
 * Publish `exam_questions` drafts that meet quality gates. Does not touch quarantined rows,
 * ECG-tagged rows (`ecg-video` tag), or `question_format` values excluded from linear bank pools.
 *
 * Default (minimal): valid stem (≥10 chars), non-empty `correct_answer` JSON, rationale optional
 * (when non-empty, ≥5 chars), exam allowlist, non-ECG format + no `ecg-video` tag.
 *
 * Strict (`--strict`): legacy gates — non-empty rationale + topic/body_system/nclex category signal.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/publish-valid-draft-exam-questions.ts
 *   npx tsx scripts/publish-valid-draft-exam-questions.ts --dry-run
 *   npx tsx scripts/publish-valid-draft-exam-questions.ts --strict --dry-run
 */

import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import {
  examKeyNormsForPathwayPool,
  examQuestionExamNormInSql,
} from "../src/lib/content-quality/exam-question-exam-normalization";
import {
  examQuestionDraftPublishableMinimalSql,
  examQuestionDraftPublishableStrictSql,
  EXAM_QUESTION_STATUS_PUBLISHED_SQL,
} from "../src/lib/questions/exam-question-bank-sql";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  const strict = process.argv.includes("--strict");
  const publishWhere = strict ? examQuestionDraftPublishableStrictSql() : examQuestionDraftPublishableMinimalSql();

  const [totalRow] = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions
  `;
  const [pubBefore] = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
  `;
  const [draftBefore] = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE lower(trim(coalesce(status, ''))) = 'draft'
  `;

  console.log("\n=== ExamQuestion counts ===");
  console.log(`  Total rows     : ${Number(totalRow.n).toLocaleString()}`);
  console.log(`  Published      : ${Number(pubBefore.n).toLocaleString()}`);
  console.log(`  Draft          : ${Number(draftBefore.n).toLocaleString()}`);

  const statusDist = await prisma.$queryRaw<{ status: string | null; c: bigint }[]>`
    SELECT status, COUNT(*)::bigint AS c FROM exam_questions GROUP BY status ORDER BY c DESC
  `;
  console.log("\n=== By status ===");
  for (const r of statusDist) {
    console.log(`  ${String(r.status ?? "(null)").padEnd(14)} ${Number(r.c).toLocaleString()}`);
  }

  const examTier = await prisma.$queryRaw<{ exam: string; tier: string; c: bigint }[]>`
    SELECT exam, tier, COUNT(*)::bigint AS c
    FROM exam_questions
    GROUP BY exam, tier
    ORDER BY c DESC
    LIMIT 40
  `;
  console.log("\n=== By exam / tier (top 40) ===");
  for (const r of examTier) {
    console.log(`  ${String(r.exam).padEnd(22)} ${String(r.tier).padEnd(12)} ${Number(r.c).toLocaleString()}`);
  }

  try {
    const byPathwayLink = await prisma.$queryRaw<{ pid: string | null; c: bigint }[]>`
      SELECT study_link_pathway_id AS pid, COUNT(*)::bigint AS c
      FROM exam_questions
      GROUP BY study_link_pathway_id
      ORDER BY c DESC NULLS LAST
      LIMIT 25
    `;
    console.log("\n=== By study_link_pathway_id (top 25, null = unlinked) ===");
    for (const r of byPathwayLink) {
      const k = r.pid ?? "(null)";
      console.log(`  ${k.padEnd(28)} ${Number(r.c).toLocaleString()}`);
    }
  } catch {
    console.log("\n=== By study_link_pathway_id (skipped: column absent in this DB) ===");
  }

  const [eligible] = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE ${publishWhere}
  `;
  const nEligible = Number(eligible.n);
  console.log(
    `\n=== Eligible to publish (${strict ? "strict" : "minimal"} gates: draft + quality + exam allowlist) ===`,
  );
  console.log(`  Rows           : ${nEligible.toLocaleString()}`);

  if (dryRun) {
    console.log("\n[dry-run] No UPDATE executed. Re-run without --dry-run to publish.");
    return;
  }

  const updated = await prisma.$executeRaw`
    UPDATE exam_questions
    SET
      status = 'published',
      published_at = COALESCE(published_at, NOW())
    WHERE ${publishWhere}
  `;

  console.log(`\n=== Update ===`);
  console.log(`  Rows updated   : ${Number(updated).toLocaleString()}`);

  const [pubAfter] = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
  `;
  const [draftAfter] = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE lower(trim(coalesce(status, ''))) = 'draft'
  `;
  console.log(`  Published after: ${Number(pubAfter.n).toLocaleString()}`);
  console.log(`  Draft after    : ${Number(draftAfter.n).toLocaleString()}`);

  const AUDIT_PATHWAYS = [
    { pathwayId: "ca-rn-nclex-rn", examKeys: ["NCLEX-RN", "NCLEX_RN"] },
    { pathwayId: "us-rn-nclex-rn", examKeys: ["NCLEX-RN", "NCLEX_RN"] },
    { pathwayId: "ca-rpn-rex-pn", examKeys: ["NCLEX-PN", "REx-PN", "REX-PN"] },
    { pathwayId: "us-lpn-nclex-pn", examKeys: ["NCLEX-PN", "NCLEX_PN"] },
    { pathwayId: "us-np-fnp", examKeys: ["NP", "FNP", "NP-FNP"] },
    { pathwayId: "ca-np-cnple", examKeys: ["NP", "CNPLE", "CAN-NP"] },
  ] as const;

  console.log("\n=== Published + scoped (exam keys, norm match) + flashcard usability ===");
  for (const pw of AUDIT_PATHWAYS) {
    const examNorms = examKeyNormsForPathwayPool(pw.examKeys);
    const [scoped] = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n
      FROM exam_questions
      WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
        AND coalesce(trim(stem), '') <> ''
        AND correct_answer IS NOT NULL
        AND ${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}
        AND (${examQuestionExamNormInSql(examNorms)})
    `;
    const [pubPath] = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n
      FROM exam_questions
      WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
        AND (${examQuestionExamNormInSql(examNorms)})
    `;
    console.log(
      `  ${pw.pathwayId.padEnd(22)} published(exam-scope)=${Number(pubPath.n).toLocaleString()} usable-scoped=${Number(scoped.n).toLocaleString()}`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
