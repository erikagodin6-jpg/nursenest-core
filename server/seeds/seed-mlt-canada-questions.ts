import { pool } from "../storage";
import { mltCanadaQuestions } from "./mlt-canada-questions-data";

const CANADA_BLUEPRINT_TAGS = [
  "Safe Work Practices",
  "Data and Specimen Collection",
  "Analytical Processes",
  "Interpretation and Reporting",
  "Quality Management",
  "Critical Thinking",
  "Communication",
];

async function seedMltCanadaQuestions() {
  console.log(`\n=== MLT Canada Question Seeder ===`);
  console.log(`Total questions to seed: ${mltCanadaQuestions.length}`);

  const disciplineCounts: Record<string, number> = {};
  const difficultyCounts: Record<number, number> = {};
  const cognitiveCounts: Record<string, number> = {};
  const blueprintCounts: Record<string, number> = {};

  for (const q of mltCanadaQuestions) {
    disciplineCounts[q.blueprintCategory] = (disciplineCounts[q.blueprintCategory] || 0) + 1;
    difficultyCounts[q.difficulty] = (difficultyCounts[q.difficulty] || 0) + 1;
    cognitiveCounts[q.cognitiveLevel] = (cognitiveCounts[q.cognitiveLevel] || 0) + 1;
    blueprintCounts[q.canadaBlueprint] = (blueprintCounts[q.canadaBlueprint] || 0) + 1;
  }

  console.log("\nDiscipline distribution:");
  for (const [d, c] of Object.entries(disciplineCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${d}: ${c} (${((c / mltCanadaQuestions.length) * 100).toFixed(1)}%)`);
  }

  console.log("\nDifficulty distribution:");
  for (const [d, c] of Object.entries(difficultyCounts).sort((a, b) => Number(a[0]) - Number(b[0]))) {
    console.log(`  Level ${d}: ${c} (${((c / mltCanadaQuestions.length) * 100).toFixed(1)}%)`);
  }

  console.log("\nCognitive level distribution:");
  for (const [d, c] of Object.entries(cognitiveCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${d}: ${c} (${((c / mltCanadaQuestions.length) * 100).toFixed(1)}%)`);
  }

  console.log("\nCanada Blueprint distribution:");
  for (const [d, c] of Object.entries(blueprintCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${d}: ${c} (${((c / mltCanadaQuestions.length) * 100).toFixed(1)}%)`);
  }

  console.log("\n--- Step 1: Archive existing placeholder questions ---");
  const archiveResult = await pool.query(
    `UPDATE allied_questions SET status = 'archived' WHERE career_type = 'mlt' AND status != 'archived'`
  );
  console.log(`Archived ${archiveResult.rowCount} existing questions`);

  console.log("\n--- Step 2: Insert new Canada MLT questions ---");
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < mltCanadaQuestions.length; i++) {
    const q = mltCanadaQuestions[i];
    try {
      await pool.query(
        `INSERT INTO allied_questions (
          id, career_type, stem, options, correct_answer, rationale_long,
          learning_objective, blueprint_category, subtopic, difficulty,
          cognitive_level, question_type, status, created_at
        ) VALUES (
          gen_random_uuid(), 'mlt', $1, $2, $3, $4, $5, $6, $7, $8, $9, 'mcq', 'active', NOW()
        )`,
        [
          q.stem,
          JSON.stringify(q.options),
          q.correctAnswer,
          q.rationaleLong,
          q.rationaleShort,
          q.blueprintCategory,
          `${q.subtopic} | ${q.canadaBlueprint} | canada | csmls_mlt`,
          q.difficulty,
          q.cognitiveLevel,
        ]
      );
      inserted++;
    } catch (err: any) {
      errors++;
      console.error(`Error inserting question ${i + 1}: ${err.message}`);
    }
  }

  console.log(`\nInserted: ${inserted}`);
  console.log(`Errors: ${errors}`);

  console.log("\n--- Step 3: Also insert into mlt_questions table (if it exists) ---");
  let mltInserted = 0;
  let mltErrors = 0;

  const tableCheck = await pool.query(
    `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'mlt_questions')`
  );
  const mltTableExists = tableCheck.rows[0].exists;

  if (mltTableExists) {
    for (let i = 0; i < mltCanadaQuestions.length; i++) {
      const q = mltCanadaQuestions[i];
      const difficultyLabel = q.difficulty <= 2 ? "foundational" : q.difficulty === 3 ? "intermediate" : q.difficulty === 4 ? "advanced" : "expert";

      try {
        await pool.query(
          `INSERT INTO mlt_questions (
            id, country_track, exam_track, discipline, subdiscipline,
            blueprint_category, difficulty, cognitive_level, stem, options,
            correct_answer, rationale, distractor_rationales, tags,
            adaptive_eligible, exam_eligible, status, created_at, updated_at
          ) VALUES (
            gen_random_uuid(), 'canada', 'csmls', $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, true, true, 'published', NOW(), NOW()
          )`,
          [
            q.blueprintCategory,
            q.subtopic,
            q.canadaBlueprint,
            difficultyLabel,
            q.cognitiveLevel,
            q.stem,
            JSON.stringify(q.options.map((text, idx) => ({ text, key: String.fromCharCode(65 + idx) }))),
            String.fromCharCode(65 + q.correctAnswer),
            q.rationaleLong,
            JSON.stringify({}),
            JSON.stringify([q.topic, q.canadaBlueprint, "canada", "csmls_mlt"]),
          ]
        );
        mltInserted++;
      } catch (err: any) {
        mltErrors++;
        if (mltErrors <= 3) {
          console.error(`Error inserting mlt_question ${i + 1}: ${err.message}`);
        }
      }
    }
  } else {
    console.log("  mlt_questions table does not exist, skipping.");
  }

  console.log(`\nmlt_questions inserted: ${mltInserted}`);
  console.log(`mlt_questions errors: ${mltErrors}`);

  console.log("\n--- Step 4: Verify counts ---");
  const activeCount = await pool.query(
    `SELECT COUNT(*) FROM allied_questions WHERE career_type = 'mlt' AND status = 'active'`
  );
  console.log(`Active allied_questions (MLT): ${activeCount.rows[0].count}`);

  if (mltTableExists) {
    const mltCount = await pool.query(
      `SELECT COUNT(*) FROM mlt_questions WHERE country_track = 'canada' AND status = 'published'`
    );
    console.log(`Published mlt_questions (Canada): ${mltCount.rows[0].count}`);
  } else {
    console.log(`mlt_questions table does not exist, skipping verification.`);
  }

  console.log("\n=== Seeding complete! ===\n");
}

seedMltCanadaQuestions()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
