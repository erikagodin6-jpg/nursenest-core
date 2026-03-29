import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { fileURLToPath } from "url";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({ connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL });

interface RawQuestion {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  rationale: string;
  category: string;
  difficulty: string;
  exam: string;
  country: string;
  question_type: string;
  client_needs: string;
  topic: string;
  status: string;
}

const examToTier: Record<string, string> = {
  "NCLEX-PN": "rpn", "REx-PN": "rpn", "NCLEX-RN": "rn", "AANP": "np", "ANCC": "np"
};
const countryToRegion: Record<string, string> = { US: "US", Canada: "CAN" };
const difficultyMap: Record<string, number> = { easy: 2, moderate: 3, hard: 4 };
const answerMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

async function main() {
  const filePath = path.join(__dirname, "../attached_assets/Pasted-Also-build-these-app-behaviors-1-Exam-mode-randomize-qu_1773240666679.txt");
  const raw = fs.readFileSync(filePath, "utf-8");

  const allQuestions: RawQuestion[] = [];
  const seenStems = new Set<string>();

  function addQuestion(q: RawQuestion) {
    if (!q.question || !q.option_a) return;
    const norm = q.question.trim().toLowerCase().replace(/\s+/g, " ");
    if (seenStems.has(norm)) return;
    seenStems.add(norm);
    allQuestions.push(q);
  }

  const jsonStart = raw.indexOf("{");
  if (jsonStart === -1) {
    console.error("No JSON found in file");
    process.exit(1);
  }

  const jsonPortion = raw.substring(jsonStart);

  let depth = 0;
  let batchEnd = -1;
  for (let i = 0; i < jsonPortion.length; i++) {
    if (jsonPortion[i] === "{") depth++;
    else if (jsonPortion[i] === "}") {
      depth--;
      if (depth === 0) { batchEnd = i + 1; break; }
    }
  }

  if (batchEnd > 0) {
    const batchStr = jsonPortion.substring(0, batchEnd);
    try {
      const batchData = JSON.parse(batchStr);
      for (const [key, arr] of Object.entries(batchData)) {
        if (Array.isArray(arr)) {
          for (const q of arr) addQuestion(q);
        }
      }
      console.log(`Parsed ${allQuestions.length} questions from batch-keyed format`);
    } catch (e: any) {
      console.log("Batch parse failed:", e.message.substring(0, 100));
    }
  }

  const remainder = batchEnd > 0 ? jsonPortion.substring(batchEnd) : jsonPortion;
  const bracketPositions: number[] = [];
  for (let i = 0; i < remainder.length; i++) {
    if (remainder[i] === "[") bracketPositions.push(i);
  }

  for (const start of bracketPositions) {
    let d = 0;
    let end = -1;
    for (let i = start; i < remainder.length; i++) {
      if (remainder[i] === "[") d++;
      else if (remainder[i] === "]") {
        d--;
        if (d === 0) { end = i + 1; break; }
      }
    }
    if (end > start) {
      try {
        const arr = JSON.parse(remainder.substring(start, end));
        if (Array.isArray(arr)) {
          for (const q of arr) addQuestion(q);
        }
      } catch {}
    }
  }

  console.log(`Total questions to import: ${allQuestions.length}`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const q of allQuestions) {
    const stemNorm = q.question.trim().toLowerCase().replace(/\s+/g, " ");
    const stemHash = crypto.createHash("md5").update(stemNorm).digest("hex");
    const answer = (q.correct_answer || "A").toUpperCase();

    try {
      const existing = await pool.query(`SELECT id FROM exam_questions WHERE stem_hash = $1`, [stemHash]);
      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }

      await pool.query(
        `INSERT INTO exam_questions (tier, exam, question_type, status, published_at, stem, options, correct_answer, rationale, difficulty, body_system, topic, subtopic, region_scope, career_type, stem_hash)
         VALUES ($1, $2, $3, 'published', NOW(), $4, $5, $6, $7, $8, $9, $10, $11, $12, 'nursing', $13)`,
        [
          examToTier[q.exam] || "rpn",
          q.exam || "NCLEX-PN",
          (q.question_type || "standard").toLowerCase().replace(/_/g, " "),
          q.question.trim(),
          JSON.stringify([q.option_a.trim(), q.option_b.trim(), q.option_c.trim(), q.option_d.trim()]),
          JSON.stringify(answerMap[answer] ?? 0),
          q.rationale?.trim() || "",
          difficultyMap[q.difficulty?.toLowerCase()] || 3,
          q.category || null,
          q.client_needs || null,
          q.topic || null,
          countryToRegion[q.country] || "BOTH",
          stemHash,
        ]
      );
      inserted++;
    } catch (e: any) {
      console.error(`Error inserting question: ${e.message}`);
      errors++;
    }
  }

  console.log(`\nImport complete:`);
  console.log(`  Inserted: ${inserted}`);
  console.log(`  Skipped (duplicates): ${skipped}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Total processed: ${allQuestions.length}`);

  await pool.end();
}

main().catch(e => {
  console.error("Import failed:", e);
  process.exit(1);
});
