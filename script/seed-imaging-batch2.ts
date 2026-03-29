import pg from "pg";
import { ARRT_BATCH2 } from "./seed-imaging-batch2-arrt";
import { CAMRT_BATCH2 } from "./seed-imaging-batch2-camrt";

const pool = new pg.Pool({ connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    const { rows: [{ count: existingCount }] } = await client.query("SELECT count(*) as count FROM imaging_questions");
    console.log(`Existing imaging questions: ${existingCount}`);

    const existingResult = await client.query("SELECT question, country FROM imaging_questions");
    const existingSet = new Set(existingResult.rows.map((r: any) => `${r.question}|||${r.country}`));
    console.log(`Built deduplication index with ${existingSet.size} entries`);

    const allQuestions = [...ARRT_BATCH2, ...CAMRT_BATCH2];
    console.log(`Batch 2 total questions to insert: ${allQuestions.length}`);
    console.log(`  ARRT (USA): ${ARRT_BATCH2.length}`);
    console.log(`  CAMRT (Canada): ${CAMRT_BATCH2.length}`);

    let created = 0;
    let skipped = 0;

    for (const q of allQuestions) {
      const key = `${q.question}|||${q.country}`;
      if (existingSet.has(key)) {
        skipped++;
        continue;
      }

      await client.query(
        `INSERT INTO imaging_questions 
          (question, option_a, option_b, option_c, option_d, correct_answer, rationale,
           category, topic, difficulty, country, body_part, modality, exam, exam_domain, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'published')`,
        [
          q.question, q.optionA, q.optionB, q.optionC, q.optionD,
          q.correctAnswer, q.rationale, q.category, q.topic,
          q.difficulty, q.country, q.bodyPart || null, q.modality || null,
          q.exam || null, q.examDomain || null,
        ]
      );
      created++;
      existingSet.add(key);
    }

    const { rows: [{ count: finalCount }] } = await client.query(
      "SELECT count(*) as count FROM imaging_questions WHERE status='published'"
    );

    const { rows: countryBreakdown } = await client.query(
      "SELECT country, count(*) as count FROM imaging_questions WHERE status='published' GROUP BY country ORDER BY country"
    );

    const { rows: domainBreakdown } = await client.query(
      "SELECT exam_domain, country, count(*) as count FROM imaging_questions WHERE status='published' AND exam_domain IS NOT NULL GROUP BY exam_domain, country ORDER BY country, exam_domain"
    );

    console.log(`\n=== Batch 2 Seed Results ===`);
    console.log(`Skipped (duplicates): ${skipped}`);
    console.log(`Created: ${created}`);
    console.log(`Total published imaging questions: ${finalCount}`);
    console.log(`\nBy country:`);
    for (const row of countryBreakdown) {
      console.log(`  ${row.country}: ${row.count}`);
    }
    console.log(`\nBy exam domain:`);
    for (const row of domainBreakdown) {
      console.log(`  ${row.country} - ${row.exam_domain}: ${row.count}`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => { console.error(err); process.exit(1); });
