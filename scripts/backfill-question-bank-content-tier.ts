/**
 * Deterministic backfill: NCLEX-PN / REx-PN → content_tier = rpn (product rule).
 * Rows with other exam_type values remain NULL and require manual mapping before learner access.
 *
 * Run: npx tsx scripts/backfill-question-bank-content-tier.ts
 */
import { pool } from "../server/storage";

async function main() {
  const beforeNull = await pool.query<{ c: string }>(
    `SELECT COUNT(*)::text AS c FROM question_bank WHERE content_tier IS NULL`,
  );
  const pnNull = await pool.query<{ c: string }>(
    `SELECT COUNT(*)::text AS c FROM question_bank WHERE content_tier IS NULL AND exam_type IN ('NCLEX-PN', 'REx-PN')`,
  );
  const ambiguous = await pool.query<{ id: string; exam_type: string; country: string }>(
    `SELECT id, exam_type, country FROM question_bank WHERE content_tier IS NULL AND exam_type NOT IN ('NCLEX-PN', 'REx-PN')`,
  );

  const update = await pool.query(
    `UPDATE question_bank SET content_tier = 'rpn', updated_at = NOW()
     WHERE content_tier IS NULL AND exam_type IN ('NCLEX-PN', 'REx-PN')`,
  );

  const after = await pool.query<{ c: string }>(
    `SELECT COUNT(*)::text AS c FROM question_bank WHERE content_tier IS NULL`,
  );

  const report = {
    questionBankRowsTotalNullBefore: Number(beforeNull.rows[0]?.c || 0),
    confidentPnExamRowsUpdated: Number(pnNull.rows[0]?.c || 0),
    rowsStillNullAfter: Number(after.rows[0]?.c || 0),
    ambiguousRowsSkipped: ambiguous.rows.length,
    ambiguousSample: ambiguous.rows.slice(0, 50),
    rowCountFromUpdate: update.rowCount,
  };

  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
