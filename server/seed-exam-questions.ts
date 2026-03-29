import fs from "fs";
import path from "path";
import { gunzipSync } from "zlib";
import { fileURLToPath } from "url";
import type { Pool } from "pg";

const __filename_esm = typeof __filename !== "undefined" ? __filename : fileURLToPath(import.meta.url);
const __dirname_esm = path.dirname(__filename_esm);

interface SeedQuestion {
  tier: string;
  exam: string;
  question_type: string;
  stem: string;
  options: any;
  correct_answer: any;
  rationale: string;
  difficulty: number;
  body_system: string | null;
  topic: string | null;
  subtopic: string | null;
  region_scope: string | null;
  career_type: string | null;
  stem_hash: string;
  scenario: string | null;
  exhibit_data: any;
  clinical_pearl: string | null;
  exam_strategy: string | null;
  memory_hook: string | null;
  framework_used: string | null;
  clinical_trap: string | null;
  distractor_rationales: any;
}

export async function seedExamQuestions(pool: Pool): Promise<void> {
  const existingCount = await pool.query("SELECT COUNT(*)::int AS cnt FROM exam_questions");
  const dbCount = existingCount.rows[0].cnt;
  if (dbCount >= 8224) {
    console.log(`[ExamSeed] Fast-path: ${dbCount} questions in DB (>= seed file size), skipping`);
    return;
  }

  const basePaths = [
    path.resolve(__dirname_esm, "seed-data/exam-questions"),
    path.resolve(process.cwd(), "dist/seed-data/exam-questions"),
    path.resolve(process.cwd(), "server/seed-data/exam-questions"),
  ];
  let seedPath = "";
  for (const base of basePaths) {
    if (fs.existsSync(base + ".json.gz")) { seedPath = base + ".json.gz"; break; }
    if (fs.existsSync(base + ".json")) { seedPath = base + ".json"; break; }
  }
  if (!seedPath) {
    console.log("[ExamSeed] No seed file found. Searched:", basePaths.map(b => b + ".json{.gz,}").join(", "));
    return;
  }
  console.log("[ExamSeed] Found seed file at:", seedPath);
  const dbHost = (process.env.DATABASE_URL || "").replace(/\/\/.*@/, "//***@").split("/")[2] || "unknown";
  console.log(`[ExamSeed] Target database: ${dbHost}`);
  console.log(`[ExamSeed] Already ${dbCount} questions in DB, checking for new questions...`);

  const raw = seedPath.endsWith(".gz")
    ? gunzipSync(fs.readFileSync(seedPath)).toString("utf-8")
    : fs.readFileSync(seedPath, "utf-8");
  const questions: SeedQuestion[] = JSON.parse(raw);
  console.log(`[ExamSeed] Loaded ${questions.length} questions from seed file`);

  const existingHashes = await pool.query("SELECT stem_hash, exam FROM exam_questions");
  const existingSet = new Set<string>();
  for (const row of existingHashes.rows) {
    existingSet.add(`${row.stem_hash}_${row.exam}`);
  }

  const seedSeen = new Set<string>();
  const toInsert = questions.filter(q => {
    const key = `${q.stem_hash}_${q.exam}`;
    if (existingSet.has(key) || seedSeen.has(key)) return false;
    seedSeen.add(key);
    return true;
  });

  if (toInsert.length === 0) {
    console.log("[ExamSeed] All questions already exist, nothing to insert");
    return;
  }

  console.log(`[ExamSeed] Inserting ${toInsert.length} new questions...`);

  const BATCH_SIZE = 100;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const q of batch) {
        try {
          await client.query(
            `INSERT INTO exam_questions (
              tier, exam, question_type, status, published_at, stem, options, correct_answer,
              rationale, difficulty, body_system, topic, subtopic, region_scope, career_type,
              stem_hash, scenario, exhibit_data, clinical_pearl, exam_strategy, memory_hook,
              framework_used, clinical_trap, distractor_rationales
            ) VALUES ($1, $2, $3, 'published', NOW(), $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)`,
            [
              q.tier,
              q.exam,
              q.question_type,
              q.stem,
              typeof q.options === "string" ? q.options : JSON.stringify(q.options),
              typeof q.correct_answer === "string" ? q.correct_answer : JSON.stringify(q.correct_answer),
              q.rationale,
              q.difficulty,
              q.body_system,
              q.topic,
              q.subtopic,
              q.region_scope,
              q.career_type || "nursing",
              q.stem_hash,
              q.scenario,
              q.exhibit_data ? (typeof q.exhibit_data === "string" ? q.exhibit_data : JSON.stringify(q.exhibit_data)) : null,
              q.clinical_pearl,
              q.exam_strategy,
              q.memory_hook,
              q.framework_used,
              q.clinical_trap,
              q.distractor_rationales ? (typeof q.distractor_rationales === "string" ? q.distractor_rationales : JSON.stringify(q.distractor_rationales)) : null,
            ]
          );
          inserted++;
        } catch (err: any) {
          errors++;
          if (errors <= 5) {
            console.error(`[ExamSeed] Insert error: ${err.message.substring(0, 200)}`);
          }
        }
      }
      await client.query("COMMIT");
    } catch (txErr: any) {
      await client.query("ROLLBACK");
      console.error(`[ExamSeed] Batch error: ${txErr.message.substring(0, 200)}`);
      errors += batch.length;
    } finally {
      client.release();
    }
  }

  console.log(`[ExamSeed] Complete: ${inserted} inserted, ${errors} errors`);
}
