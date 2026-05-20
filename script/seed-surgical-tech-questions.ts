import pg from "pg";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Pool = pg.Pool;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function hash(s: string): string {
  return crypto.createHash("md5").update(s.toLowerCase().trim()).digest("hex");
}

async function seedSurgicalTechQuestions() {
  console.log("[SeedSurgicalTech] Starting surgical technologist question seeding...");

  const jsonPath = path.join(__dirname, "../tmp-st-questions.json");
  let questions: any[];

  try {
    const data = fs.readFileSync(jsonPath, "utf8");
    questions = JSON.parse(data);
  } catch {
    console.log("[SeedSurgicalTech] JSON file not found at", jsonPath);
    throw new Error("tmp-st-questions.json not found");
  }

  console.log(`[SeedSurgicalTech] Loaded ${questions.length} questions`);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existing = await client.query(
      "SELECT stem_hash FROM exam_questions WHERE career_type = 'surgicalTechnologist'"
    );
    const existingHashes = new Set(existing.rows.map((r: any) => r.stem_hash));
    console.log(`[SeedSurgicalTech] Found ${existingHashes.size} existing questions`);

    let inserted = 0;
    let skipped = 0;
    const batchSize = 50;

    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      const values: any[] = [];
      const placeholders: string[] = [];
      let paramIdx = 1;

      for (const q of batch) {
        const stemHash = hash(q.stem);
        if (existingHashes.has(stemHash)) {
          skipped++;
          continue;
        }
        existingHashes.add(stemHash);

        const tier = "surgicalTechnologist";
        const exam = "CST";
        const questionType = q.questionType || "multiple_choice";
        const status = "published";
        const options = JSON.stringify(q.options);
        const correctAnswer = JSON.stringify([q.correctIndex]);
        const regionScope = q.regionScope || "BOTH";
        const bodySystem = q.category;
        const topic = q.topic;
        const subtopic = q.topic;
        const difficulty = q.difficulty;
        const rationale = q.rationale;

        placeholders.push(
          `(gen_random_uuid(), $${paramIdx}, $${paramIdx+1}, $${paramIdx+2}, $${paramIdx+3}, $${paramIdx+4}, $${paramIdx+5}, $${paramIdx+6}, $${paramIdx+7}, $${paramIdx+8}, $${paramIdx+9}, $${paramIdx+10}, $${paramIdx+11}, $${paramIdx+12}, $${paramIdx+13}, $${paramIdx+14}, NOW(), NOW())`
        );
        values.push(tier, exam, questionType, status, q.stem, options, correctAnswer, rationale, difficulty, bodySystem, topic, subtopic, regionScope, stemHash, "surgicalTechnologist");
        paramIdx += 15;
      }

      if (placeholders.length > 0) {
        await client.query(
          `INSERT INTO exam_questions (id, tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, body_system, topic, subtopic, region_scope, stem_hash, career_type, created_at, updated_at)
           VALUES ${placeholders.join(", ")}
          `,
          values
        );
        inserted += placeholders.length;
      }
    }

    await client.query("COMMIT");
    console.log(`[SeedSurgicalTech] Inserted ${inserted} new questions, skipped ${skipped} duplicates`);
    console.log("[SeedSurgicalTech] Done!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[SeedSurgicalTech] Error:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seedSurgicalTechQuestions().catch(console.error);
