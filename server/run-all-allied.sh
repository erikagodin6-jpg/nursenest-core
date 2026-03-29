#!/usr/bin/env bash
set -Eeuo pipefail

LOG_FILE="/tmp/allied_all.log"
RUNNER="server/run-allied-expansion.ts"

careers=(
  "paramedic"
  "rrt"
  "mlt"
  "radtech"
  "sonography"
)

run_expansion() {
  local career="$1"
  printf '%s: Starting %s...\n' "$(date)" "$career" | tee -a "$LOG_FILE"
  npx tsx "$RUNNER" "$career" 2>&1 | tee -a "$LOG_FILE"
}

echo "=== Starting Allied Health Expansion ===" | tee -a "$LOG_FILE"

for career in "${careers[@]}"; do
  run_expansion "$career"
done

echo "" | tee -a "$LOG_FILE"
echo "=== FINAL SUMMARY REPORT ===" | tee -a "$LOG_FILE"

npx tsx -e '
const pg = require("pg");

const pool = new pg.Pool({
  connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL,
});

async function report() {
  const questionsResult = await pool.query(`
    SELECT career_type, blueprint_category, COUNT(*) AS c
    FROM allied_questions
    WHERE status != '\''rejected'\''
      AND career_type IN ('\''rrt'\'','\''mlt'\'','\''paramedic'\'','\''imaging'\'')
    GROUP BY career_type, blueprint_category
    ORDER BY career_type, c DESC
  `);

  const flashcardsResult = await pool.query(`
    SELECT career_type, COUNT(*) AS c
    FROM flashcard_bank
    WHERE career_type IN ('\''rrt'\'','\''mlt'\'','\''paramedic'\'','\''imaging'\'')
    GROUP BY career_type
  `);

  const questionTotals = {};
  for (const row of questionsResult.rows) {
    questionTotals[row.career_type] =
      (questionTotals[row.career_type] || 0) + Number(row.c);
  }

  const flashcardTotals = {};
  for (const row of flashcardsResult.rows) {
    flashcardTotals[row.career_type] = Number(row.c);
  }

  console.log("Career Type       | Questions | Flashcards | Target | Status");
  console.log("------------------|-----------|------------|--------|--------");

  for (const careerType of ["paramedic", "rrt", "mlt", "imaging"]) {
    const questions = questionTotals[careerType] || 0;
    const flashcards = flashcardTotals[careerType] || 0;
    const target = careerType === "imaging" ? 1000 : 500;
    const status = questions >= target ? "COMPLETE" : "PARTIAL";

    console.log(
      careerType.padEnd(18) +
        "| " + String(questions).padEnd(10) +
        "| " + String(flashcards).padEnd(11) +
        "| " + String(target).padEnd(7) +
        "| " + status
    );
  }

  const totalQuestions = Object.values(questionTotals).reduce((a, b) => a + b, 0);
  const totalFlashcards = Object.values(flashcardTotals).reduce((a, b) => a + b, 0);

  console.log("------------------|-----------|------------|--------|--------");
  console.log(
    "TOTAL".padEnd(18) +
      "| " + String(totalQuestions).padEnd(10) +
      "| " + String(totalFlashcards).padEnd(11) +
      "| 2500   |"
  );

  await pool.end();
}

report().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
' 2>/dev/null | tee -a "$LOG_FILE"

echo "=== ALL DONE ===" | tee -a "$LOG_FILE"