import pg from "pg";

export async function fixCorrectAnswerData(pool: pg.Pool): Promise<{ stringFixed: number; numberFixed: number; optionsFixed: number; skipped: number }> {
  const stringResult = await pool.query(`
    UPDATE exam_questions
    SET correct_answer = CASE
      WHEN correct_answer::text = '"A"' THEN '[0]'::jsonb
      WHEN correct_answer::text = '"B"' THEN '[1]'::jsonb
      WHEN correct_answer::text = '"C"' THEN '[2]'::jsonb
      WHEN correct_answer::text = '"D"' THEN '[3]'::jsonb
    END
    WHERE jsonb_typeof(correct_answer) = 'string'
      AND correct_answer::text IN ('"A"', '"B"', '"C"', '"D"')
  `);

  const skippedResult = await pool.query(`
    SELECT COUNT(*)::int as cnt FROM exam_questions
    WHERE jsonb_typeof(correct_answer) = 'string'
      AND correct_answer::text NOT IN ('"A"', '"B"', '"C"', '"D"')
  `);
  const skipped = skippedResult.rows[0]?.cnt ?? 0;
  if (skipped > 0) {
    const examples = await pool.query(`
      SELECT id, correct_answer::text FROM exam_questions
      WHERE jsonb_typeof(correct_answer) = 'string'
        AND correct_answer::text NOT IN ('"A"', '"B"', '"C"', '"D"')
      LIMIT 5
    `);
    console.warn(`[Migration] ${skipped} questions have unrecognized string correct_answer values (not A-D), leaving unchanged:`, examples.rows);
  }

  const numberResult = await pool.query(`
    UPDATE exam_questions
    SET correct_answer = jsonb_build_array(correct_answer)
    WHERE jsonb_typeof(correct_answer) = 'number'
  `);

  const optionsResult = await pool.query(`
    UPDATE exam_questions
    SET options = jsonb_build_array(options)
    WHERE jsonb_typeof(options) = 'string'
  `);

  return {
    stringFixed: stringResult.rowCount ?? 0,
    numberFixed: numberResult.rowCount ?? 0,
    optionsFixed: optionsResult.rowCount ?? 0,
    skipped,
  };
}

export async function verifyCorrectAnswerData(pool: pg.Pool): Promise<{ valid: boolean; counts: Record<string, number> }> {
  const result = await pool.query(`
    SELECT jsonb_typeof(correct_answer) as type, COUNT(*)::int as cnt
    FROM exam_questions
    GROUP BY jsonb_typeof(correct_answer)
  `);

  const counts: Record<string, number> = {};
  for (const row of result.rows) {
    counts[row.type] = row.cnt;
  }

  const valid = !counts["string"] && !counts["number"];
  return { valid, counts };
}
