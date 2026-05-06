#!/usr/bin/env tsx
/**
 * Publish `exam_questions` drafts that meet quality gates. Does not touch quarantined rows,
 * ECG-tagged rows (`ecg-video` tag), or `question_format` values excluded from linear bank pools.
 *
 * Modes:
 * - Default (minimal): stem ≥10 chars, JSON `correct_answer` present, rationale optional (when present ≥5 chars),
 *   topic OR body_system, exam allowlist, non-ECG format + no `ecg-video` tag.
 * - `--require-rationale`: minimal gates + non-empty rationale (still ≥5 chars when trimming whitespace).
 * - `--strict`: rationale required + taxonomy signal (topic OR body_system OR nclex category), stem non-empty,
 *   `correct_answer IS NOT NULL`, same ECG/format/exam rules.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/publish-valid-draft-exam-questions.ts --dry-run
 *   npx tsx scripts/publish-valid-draft-exam-questions.ts --dry-run --json
 *   npx tsx scripts/publish-valid-draft-exam-questions.ts --strict --dry-run --json
 *   npx tsx scripts/publish-valid-draft-exam-questions.ts --require-rationale --dry-run
 *   npx tsx scripts/publish-valid-draft-exam-questions.ts
 */

import { PrismaClient } from "@prisma/client";
import {
  examKeyNormsForPathwayPool,
  examQuestionExamNormInSql,
} from "../src/lib/content-quality/exam-question-exam-normalization";
import {
  EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL,
  EXAM_QUESTION_STATUS_PUBLISHED_SQL,
} from "../src/lib/questions/exam-question-bank-sql";
import {
  buildDraftPublishDryRunJson,
  fetchDraftPublishAggregateRow,
  fetchDraftPublishPrimaryIneligibleReasons,
} from "../src/lib/questions/exam-question-draft-publish-metrics";
import {
  draftPublishWhereSql,
  parseDraftPublishCli,
} from "../src/lib/questions/exam-question-draft-publish";

const prisma = new PrismaClient();

function printLearnerSurfaceWarning(mode: string, emptyRationaleEligible: number): void {
  if (mode !== "minimal" || emptyRationaleEligible <= 0) return;
  console.log("\n" + "=".repeat(72));
  console.log("LEARNER-SURFACE QUALITY WARNING (minimal mode)");
  console.log("=".repeat(72));
  console.log(
    `This dry-run would publish ${emptyRationaleEligible.toLocaleString()} draft row(s) with an EMPTY rationale.`,
  );
  console.log(
    "That can be acceptable for bank normalization / admin inventory, but those rows are NOT suitable for",
  );
  console.log(
    "surfaces that expect teaching rationale quality (e.g. CAT study mode and per-item practice rationales use",
  );
  console.log(
    "`isCompleteCatQuestionRow`, which requires a non-empty rationale — empty rows are filtered out of the",
  );
  console.log(
    "adaptive pool after fetch). Flashcard exam-bank rows still get a generic fallback line when rationale is",
  );
  console.log("short; prefer `--require-rationale` or `--strict` before promoting to learner-heavy flows.");
  console.log("=".repeat(72) + "\n");
}

async function main(): Promise<void> {
  let cli;
  try {
    cli = parseDraftPublishCli(process.argv);
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
    return;
  }

  const { dryRun, mode, json } = cli;
  const publishWhere = draftPublishWhereSql(mode);

  if (json && dryRun) {
    const payload = await buildDraftPublishDryRunJson(prisma, mode);
    console.log(JSON.stringify(payload));
    return;
  }

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

  const agg = await fetchDraftPublishAggregateRow(prisma);
  const td = Number(agg.total_drafts);
  const minEl = Number(agg.minimal_eligible);
  const minReqEl = Number(agg.minimal_require_rationale_eligible);
  const stEl = Number(agg.strict_eligible);
  const emptyRat = Number(agg.minimal_eligible_empty_rationale);
  const shortRat = Number(agg.minimal_eligible_short_rationale_5_49);

  const activeEligible =
    mode === "strict" ? stEl : mode === "minimal_require_rationale" ? minReqEl : minEl;

  console.log("\n=== Draft publish dry-run (all modes compared) ===");
  console.log(`  Total draft rows                          : ${td.toLocaleString()}`);
  console.log(`  Eligible — minimal (default gates)        : ${minEl.toLocaleString()}`);
  console.log(`  Eligible — minimal + --require-rationale   : ${minReqEl.toLocaleString()}`);
  console.log(`  Eligible — --strict                        : ${stEl.toLocaleString()}`);
  console.log("\n--- Active mode ---");
  console.log(`  Mode                                      : ${mode}`);
  console.log(`  Eligible to publish (this run)            : ${activeEligible.toLocaleString()}`);

  console.log("\n--- Draft diagnostics (any mode; may overlap across rows) ---");
  console.log(`  Drafts with stem < 10 chars (minimal gate): ${Number(agg.draft_short_stem_lt10).toLocaleString()}`);
  console.log(
    `  Drafts excluded ECG/video (format or tag) : ${Number(agg.draft_ecg_or_video_format_or_tag).toLocaleString()}`,
  );
  console.log(`  Drafts with invalid exam (not allowlist)  : ${Number(agg.draft_invalid_exam).toLocaleString()}`);
  console.log(
    `  Drafts missing/invalid correct_answer JSON: ${Number(agg.draft_missing_or_invalid_correct_answer).toLocaleString()}`,
  );
  console.log(
    `  Drafts rationale 1–4 chars (placeholder): ${Number(agg.draft_rationale_too_short_when_present_1_4).toLocaleString()}`,
  );
  console.log(
    `  Drafts missing topic AND body_system      : ${Number(agg.draft_missing_topic_or_body).toLocaleString()}`,
  );

  console.log("\n--- Minimal-eligible quality signals ---");
  console.log(`  Eligible (minimal) with empty rationale   : ${emptyRat.toLocaleString()}`);
  console.log(`  Eligible (minimal) with rationale 5–49 ch : ${shortRat.toLocaleString()}  (short/minimal teaching text)`);

  const primary = await fetchDraftPublishPrimaryIneligibleReasons(prisma, mode);
  const ineligible = td - activeEligible;
  console.log(`\n--- Ineligible for active mode (primary reason, non-overlapping) — ${ineligible.toLocaleString()} rows ---`);
  const keys = Object.keys(primary).sort();
  if (keys.length === 0) {
    console.log("  (none — all drafts match active gates or there are zero drafts)");
  } else {
    for (const k of keys) {
      console.log(`  ${k.padEnd(42)} ${Number(primary[k]).toLocaleString()}`);
    }
  }

  printLearnerSurfaceWarning(mode, emptyRat);

  if (mode === "minimal_require_rationale") {
    console.log(
      "\nNote: --require-rationale uses minimal gates plus non-empty rationale (safer middle tier than bare minimal).\n",
    );
  }

  console.log(
    `\n=== Eligible to publish (${mode} gates: draft + quality + exam allowlist + ECG exclusions) ===`,
  );
  console.log(`  Rows           : ${activeEligible.toLocaleString()}`);

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
