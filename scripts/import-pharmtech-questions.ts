import pg from "pg";
import mammoth from "mammoth";
import * as fs from "fs";
import * as path from "path";

const pool = new pg.Pool({ connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL });

const CATEGORY_MAP: Record<string, string> = {
  "Pharmacokinetics": "drug-classification",
  "Pharmacology": "drug-classification",
  "Controlled Substances": "controlled-substances",
  "Medication Safety": "medication-safety",
  "Medication Storage": "inventory-and-storage",
  "Pharmacy Law": "pharmacy-law-and-ethics",
  "Pharmacy Law and Ethics": "pharmacy-law-and-ethics",
  "Calculations": "dosage-calculations",
  "Dosage Calculations": "dosage-calculations",
  "Compounding": "sterile-compounding",
  "Sterile Compounding": "sterile-compounding",
  "Nonsterile Compounding": "nonsterile-compounding",
  "Prescription Processing": "prescription-processing",
  "Sig Codes": "sig-codes-and-abbreviations",
  "Inventory": "inventory-and-storage",
  "Inventory and Storage": "inventory-and-storage",
  "Drug Classification": "drug-classification",
  "Top 200 Drugs": "top-200-drugs",
  "Pharmacy Tech Foundations": "pharmacy-tech-foundations",
  "Quality Assurance": "quality-assurance",
  "Workflow": "pharmacy-tech-foundations",
};

const DIFFICULTY_MAP: Record<string, number> = {
  "easy": 1,
  "medium": 2,
  "hard": 3,
};

const LESSON_SLUG_MAP: Record<string, string> = {
  "pharmacy-law-and-ethics": "pharmacy-law-and-ethics-basics",
  "medication-safety": "medication-safety-principles",
  "sig-codes-and-abbreviations": "prescription-terminology-and-sig-codes",
  "dosage-calculations": "dosage-calculations-fundamentals",
  "drug-classification": "drug-class-foundations-for-pharmacy-technicians",
  "top-200-drugs": "top-200-drugs-overview",
  "sterile-compounding": "sterile-and-nonsterile-compounding-basics",
  "nonsterile-compounding": "sterile-and-nonsterile-compounding-basics",
  "inventory-and-storage": "inventory-storage-and-medication-handling",
  "controlled-substances": "controlled-substances-and-dea-schedules",
  "pharmacy-tech-foundations": "introduction-to-pharmacy-technician-practice",
  "prescription-processing": "prescription-terminology-and-sig-codes",
  "quality-assurance": "medication-safety-principles",
};

function correctAnswerToIndex(answer: string): number {
  const map: Record<string, number> = { "A": 0, "B": 1, "C": 2, "D": 3 };
  return map[answer.toUpperCase()] ?? 0;
}

function parseStandardQuestions(text: string): any[] {
  const questions: any[] = [];
  const regex = /\{\s*"external_id"\s*:\s*"pharmtech_cat_\d+"[\s\S]*?"published"\s*:\s*true\s*\}/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    try {
      let cleaned = match[0]
        .replace(/\u201c/g, '"').replace(/\u201d/g, '"')
        .replace(/\u2018/g, "'").replace(/\u2019/g, "'");
      const q = JSON.parse(cleaned);
      questions.push(q);
    } catch (e) {
      try {
        let cleaned = match[0]
          .replace(/\u201c/g, '"').replace(/\u201d/g, '"')
          .replace(/\u2018/g, "'").replace(/\u2019/g, "'")
          .replace(/[\n\r\t]/g, " ")
          .replace(/\s+/g, " ");
        const q = JSON.parse(cleaned);
        questions.push(q);
      } catch (e2) {
        console.error(`Failed to parse standard question: ${match[0].substring(0, 80)}...`);
      }
    }
  }
  return questions;
}

function parseCATQuestions(text: string): any[] {
  const questions: any[] = [];
  const regex = /\{\s*"id"\s*:\s*"pharm_cat_\d+"[\s\S]*?"difficulty"\s*:\s*"[^"]*"\s*\}/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    try {
      let cleaned = match[0]
        .replace(/\u201c/g, '"').replace(/\u201d/g, '"')
        .replace(/\u2018/g, "'").replace(/\u2019/g, "'");
      const q = JSON.parse(cleaned);
      questions.push(q);
    } catch (e) {
      try {
        let cleaned = match[0]
          .replace(/\u201c/g, '"').replace(/\u201d/g, '"')
          .replace(/\u2018/g, "'").replace(/\u2019/g, "'")
          .replace(/[\n\r\t]/g, " ")
          .replace(/\s+/g, " ");
        const q = JSON.parse(cleaned);
        questions.push(q);
      } catch (e2) {
        console.error(`Failed to parse CAT question: ${match[0].substring(0, 80)}...`);
      }
    }
  }
  return questions;
}

async function importStandardQuestions(questions: any[]): Promise<{ created: number; skipped: number; failed: number }> {
  let created = 0, skipped = 0, failed = 0;
  
  for (const q of questions) {
    try {
      const externalId = q.external_id;
      const options = [
        q.option_a || "",
        q.option_b || "",
        q.option_c || "",
        q.option_d || "",
      ];
      const correctIndex = correctAnswerToIndex(q.correct_answer || "A");
      const category = q.category || "pharmacy-tech-foundations";
      const difficulty = DIFFICULTY_MAP[q.difficulty] || 2;
      const lessonSlug = q.lesson_slug || LESSON_SLUG_MAP[category] || null;

      const result = await pool.query(
        `INSERT INTO pharmtech_questions (external_id, stem, options, correct_index, rationale, category, difficulty, lesson_slug, published)
         VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (external_id) DO NOTHING
         RETURNING id`,
        [
          externalId,
          q.stem,
          JSON.stringify(options),
          correctIndex,
          q.rationale || "",
          category,
          difficulty,
          lessonSlug,
          true,
        ]
      );
      
      if (result.rows.length > 0) {
        created++;
      } else {
        skipped++;
      }
    } catch (e: any) {
      failed++;
      console.error(`Failed to import ${q.external_id}: ${e.message}`);
    }
  }
  
  return { created, skipped, failed };
}

async function importCATQuestions(questions: any[]): Promise<{ created: number; skipped: number; failed: number }> {
  let created = 0, skipped = 0, failed = 0;
  
  for (const q of questions) {
    try {
      const externalId = q.id;
      const options = q.options;
      const optionsArray = [
        options?.A || options?.a || "",
        options?.B || options?.b || "",
        options?.C || options?.c || "",
        options?.D || options?.d || "",
      ];
      const correctIndex = correctAnswerToIndex(q.correct_answer || "A");
      const rawCategory = q.category || "Pharmacy Tech Foundations";
      const category = CATEGORY_MAP[rawCategory] || rawCategory.toLowerCase().replace(/\s+/g, "-");
      const difficulty = DIFFICULTY_MAP[q.difficulty] || 2;
      const lessonSlug = LESSON_SLUG_MAP[category] || null;
      const stem = q.question || q.stem || "";

      const result = await pool.query(
        `INSERT INTO pharmtech_questions (external_id, stem, options, correct_index, rationale, category, difficulty, lesson_slug, published)
         VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (external_id) DO NOTHING
         RETURNING id`,
        [
          externalId,
          stem,
          JSON.stringify(optionsArray),
          correctIndex,
          q.rationale || "",
          category,
          difficulty,
          lessonSlug,
          true,
        ]
      );
      
      if (result.rows.length > 0) {
        created++;
      } else {
        skipped++;
      }
    } catch (e: any) {
      failed++;
      console.error(`Failed to import ${q.id}: ${e.message}`);
    }
  }
  
  return { created, skipped, failed };
}

async function verifyImport() {
  const countResult = await pool.query("SELECT COUNT(*) as total FROM pharmtech_questions");
  console.log(`\nTotal questions in database: ${countResult.rows[0].total}`);

  const categoryResult = await pool.query(
    "SELECT category, COUNT(*) as cnt FROM pharmtech_questions GROUP BY category ORDER BY cnt DESC"
  );
  console.log("\nQuestions by category:");
  for (const row of categoryResult.rows) {
    console.log(`  ${row.category}: ${row.cnt}`);
  }

  const difficultyResult = await pool.query(
    "SELECT difficulty, COUNT(*) as cnt FROM pharmtech_questions GROUP BY difficulty ORDER BY difficulty"
  );
  console.log("\nQuestions by difficulty:");
  for (const row of difficultyResult.rows) {
    const label = row.difficulty === 1 ? "easy" : row.difficulty === 2 ? "medium" : "hard";
    console.log(`  ${label} (${row.difficulty}): ${row.cnt}`);
  }

  const answerResult = await pool.query(
    "SELECT correct_index, COUNT(*) as cnt FROM pharmtech_questions GROUP BY correct_index ORDER BY correct_index"
  );
  console.log("\nAnswer distribution:");
  const labels = ["A", "B", "C", "D"];
  for (const row of answerResult.rows) {
    console.log(`  ${labels[row.correct_index] || row.correct_index}: ${row.cnt}`);
  }

  const noRationale = await pool.query(
    "SELECT COUNT(*) as cnt FROM pharmtech_questions WHERE rationale IS NULL OR rationale = ''"
  );
  console.log(`\nQuestions missing rationale: ${noRationale.rows[0].cnt}`);

  const noLesson = await pool.query(
    "SELECT COUNT(*) as cnt FROM pharmtech_questions WHERE lesson_slug IS NULL OR lesson_slug = ''"
  );
  console.log(`Questions missing lesson_slug: ${noLesson.rows[0].cnt}`);

  const dupStems = await pool.query(
    "SELECT stem, COUNT(*) as cnt FROM pharmtech_questions GROUP BY stem HAVING COUNT(*) > 1 LIMIT 10"
  );
  if (dupStems.rows.length > 0) {
    console.log(`\nDuplicate stems found: ${dupStems.rows.length}`);
    for (const row of dupStems.rows) {
      console.log(`  "${row.stem.substring(0, 60)}..." (${row.cnt} copies)`);
    }
  } else {
    console.log("\nNo duplicate stems found");
  }
}

async function main() {
  console.log("=== Pharmacy Technician Questions Import ===\n");
  
  const docxPath = path.resolve("attached_assets/pharmtechquestions_1773276150961.docx");
  console.log("Extracting text from docx using mammoth...");
  const result = await mammoth.extractRawText({ path: docxPath });
  const text = result.value;
  console.log(`Extracted ${text.length} characters of text`);
  if (result.messages.length > 0) {
    console.log(`Mammoth warnings: ${result.messages.length}`);
  }

  console.log("\n--- Parsing Standard Format Questions (pharmtech_cat_0001 - 0300) ---");
  const standardQuestions = parseStandardQuestions(text);
  console.log(`Found ${standardQuestions.length} standard-format questions`);

  console.log("\n--- Parsing CAT Format Questions (pharm_cat_151 - 380) ---");
  const catQuestions = parseCATQuestions(text);
  console.log(`Found ${catQuestions.length} CAT-format questions`);

  console.log(`\nTotal questions to import: ${standardQuestions.length + catQuestions.length}`);

  if (standardQuestions.length === 0 && catQuestions.length === 0) {
    console.error("No questions found! Aborting.");
    await pool.end();
    process.exit(1);
  }

  console.log("\n--- Importing Standard Questions ---");
  const stdResult = await importStandardQuestions(standardQuestions);
  console.log(`Standard: created=${stdResult.created}, skipped=${stdResult.skipped}, failed=${stdResult.failed}`);

  console.log("\n--- Importing CAT Questions ---");
  const catResult = await importCATQuestions(catQuestions);
  console.log(`CAT: created=${catResult.created}, skipped=${catResult.skipped}, failed=${catResult.failed}`);

  console.log("\n=== Import Summary ===");
  console.log(`Total created: ${stdResult.created + catResult.created}`);
  console.log(`Total skipped (duplicates): ${stdResult.skipped + catResult.skipped}`);
  console.log(`Total failed: ${stdResult.failed + catResult.failed}`);

  console.log("\n=== Verification ===");
  await verifyImport();

  await pool.end();
  console.log("\n=== Import Complete ===");
}

main().catch((e) => {
  console.error("Import failed:", e);
  pool.end();
  process.exit(1);
});
