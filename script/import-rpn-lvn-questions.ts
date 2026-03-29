import { pool } from "../server/storage";
import crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function hashStem(stem: string): string {
  return crypto.createHash("sha256").update(stem.trim().toLowerCase()).digest("hex").substring(0, 32);
}

function difficultyToInt(d: string): number {
  switch (d.toLowerCase()) {
    case "easy": return 1;
    case "moderate":
    case "medium": return 3;
    case "hard": return 5;
    default: return 3;
  }
}

interface MCQRaw {
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

interface BowtieRaw {
  question_type: string;
  scenario: string;
  condition_options: string[];
  action_options: string[];
  monitor_options: string[];
  correct_condition: string;
  correct_action: string;
  correct_monitor: string;
  rationale: string;
  category: string;
  difficulty: string;
  exam: string;
  country: string;
  client_needs: string;
  topic: string;
  status: string;
}

const VALID_CORRECT_ANSWERS = ["A", "B", "C", "D"];
const VALID_DIFFICULTIES = ["easy", "moderate", "hard"];
const VALID_EXAM_TYPES = ["NCLEX-PN", "REx-PN"];

const VALID_COUNTRIES = ["US", "CA", "Canada", "Both"];

function normalizeCountry(country: string): string | null {
  if (country === "Canada" || country === "CA") return "CA";
  if (country === "US") return "US";
  if (country === "Both") return null;
  return null;
}

function resolveCountryForExam(country: string, exam: string): string {
  const norm = normalizeCountry(country);
  if (norm) return norm;
  return exam === "NCLEX-PN" ? "US" : "CA";
}

function isValidExam(exam: string): boolean {
  return VALID_EXAM_TYPES.includes(exam);
}

function extractTextFromDocx(docxPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    import("mammoth").then((mammoth) => {
      mammoth.extractRawText({ path: docxPath }).then(
        (result: { value: string }) => resolve(result.value),
        (err: Error) => reject(err)
      );
    });
  });
}

function parseJsonArraysFromText(text: string): { mcq: MCQRaw[]; bowtie: BowtieRaw[] } {
  const lines = text.split("\n");
  const topLevelStarts: number[] = [];
  lines.forEach((l, i) => {
    if (l.trim() === "[") topLevelStarts.push(i);
  });

  const allMCQ: MCQRaw[] = [];
  const allBowtie: BowtieRaw[] = [];

  for (const startIdx of topLevelStarts) {
    let depth = 0;
    let endIdx = -1;
    for (let i = startIdx; i < lines.length; i++) {
      for (const ch of lines[i]) {
        if (ch === "[") depth++;
        if (ch === "]") {
          depth--;
          if (depth === 0) {
            endIdx = i;
            break;
          }
        }
      }
      if (endIdx >= 0) break;
    }

    if (endIdx < 0) continue;

    const blockLines = lines.slice(startIdx, endIdx + 1);
    const lastLine = blockLines[blockLines.length - 1];
    const closingIdx = lastLine.lastIndexOf("]");
    blockLines[blockLines.length - 1] = lastLine.substring(0, closingIdx + 1);

    let block = blockLines.join("\n");
    block = block
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/,\s*\]/g, "]")
      .replace(/,\s*\}/g, "}");

    try {
      const arr = JSON.parse(block);
      if (Array.isArray(arr) && arr.length > 0) {
        const first = arr[0];
        if (first.scenario && first.condition_options) {
          allBowtie.push(...arr);
        } else if (first.question) {
          allMCQ.push(...arr);
        }
      }
    } catch {
      // Skip unparseable blocks
    }
  }

  return { mcq: allMCQ, bowtie: allBowtie };
}

async function importMCQQuestions(questions: MCQRaw[]): Promise<{ inserted: number; skipped: number; duplicates: number; validationErrors: number }> {
  let inserted = 0;
  let skipped = 0;
  let duplicates = 0;
  let validationErrors = 0;

  const existingQBRes = await pool.query("SELECT LOWER(TRIM(question)) as q FROM question_bank");
  const existingQuestions = new Set(existingQBRes.rows.map((r: any) => r.q));

  const existingExamRes = await pool.query("SELECT LOWER(TRIM(stem)) as q FROM exam_questions WHERE stem IS NOT NULL");
  const existingExamStems = new Set(existingExamRes.rows.map((r: any) => r.q));

  const seenInBatch = new Set<string>();

  for (const q of questions) {
    const normalized = q.question.trim().toLowerCase();

    if (seenInBatch.has(normalized)) {
      duplicates++;
      continue;
    }

    if (existingQuestions.has(normalized) || existingExamStems.has(normalized)) {
      duplicates++;
      continue;
    }

    if (!q.question?.trim() || !q.option_a?.trim() || !q.option_b?.trim() ||
        !q.option_c?.trim() || !q.option_d?.trim() || !q.rationale?.trim()) {
      validationErrors++;
      continue;
    }

    const correctAnswer = String(q.correct_answer || "").toUpperCase().trim();
    if (!VALID_CORRECT_ANSWERS.includes(correctAnswer)) {
      validationErrors++;
      continue;
    }

    const difficulty = (q.difficulty || "").toLowerCase().trim();
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      validationErrors++;
      continue;
    }

    const exam = (q.exam || "").trim();
    if (!isValidExam(exam)) {
      validationErrors++;
      continue;
    }

    const country = resolveCountryForExam(q.country || "", exam);

    seenInBatch.add(normalized);

    try {
      await pool.query(
        `INSERT INTO question_bank (question, option_a, option_b, option_c, option_d, correct_answer, rationale, category, difficulty, exam_type, country, question_type, client_needs, topic, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          q.question.trim(),
          q.option_a.trim(),
          q.option_b.trim(),
          q.option_c.trim(),
          q.option_d.trim(),
          correctAnswer,
          q.rationale.trim(),
          q.category?.trim() || "General",
          difficulty,
          exam,
          country,
          "MCQ",
          q.client_needs?.trim() || "Physiological Integrity",
          q.topic?.trim() || "General",
          "active",
        ]
      );
      inserted++;
      existingQuestions.add(normalized);
    } catch (err: any) {
      console.error(`  MCQ insert error: ${err.message.substring(0, 150)}`);
      skipped++;
    }
  }

  return { inserted, skipped, duplicates, validationErrors };
}

async function importBowtieQuestions(questions: BowtieRaw[]): Promise<{ inserted: number; skipped: number; duplicates: number; validationErrors: number }> {
  let inserted = 0;
  let skipped = 0;
  let duplicates = 0;
  let validationErrors = 0;

  const existingRes = await pool.query("SELECT stem_hash FROM exam_questions WHERE question_type = 'bowtie'");
  const existingHashes = new Set(existingRes.rows.map((r: any) => r.stem_hash));

  const seenInBatch = new Set<string>();

  for (const q of questions) {
    if (!q.scenario?.trim() || !q.rationale?.trim()) {
      validationErrors++;
      continue;
    }

    if (!q.condition_options?.length || !q.action_options?.length || !q.monitor_options?.length) {
      validationErrors++;
      continue;
    }

    if (!q.correct_condition || !q.correct_action || !q.correct_monitor) {
      validationErrors++;
      continue;
    }

    const difficulty = (q.difficulty || "").toLowerCase().trim();
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      validationErrors++;
      continue;
    }

    const exam = (q.exam || "").trim();
    if (!isValidExam(exam)) {
      validationErrors++;
      continue;
    }

    const stemHash = hashStem(q.scenario);

    if (seenInBatch.has(stemHash) || existingHashes.has(stemHash)) {
      duplicates++;
      continue;
    }

    seenInBatch.add(stemHash);

    const country = resolveCountryForExam(q.country || "", exam);

    const centerCorrectIdx = q.condition_options.indexOf(q.correct_condition);
    const rightCorrectIdx = q.action_options.indexOf(q.correct_action);
    const leftCorrectIdx = q.monitor_options.indexOf(q.correct_monitor);

    const options = JSON.stringify({
      centerOptions: q.condition_options,
      leftFindings: q.monitor_options,
      rightActions: q.action_options,
    });

    const correctAnswer = JSON.stringify({
      centerCorrect: centerCorrectIdx,
      leftCorrect: [leftCorrectIdx],
      leftSelectCount: 1,
      rightCorrect: [rightCorrectIdx],
      rightSelectCount: 1,
    });

    const tier = "rpn";
    const regionScope = country === "US" ? "US" : country === "CA" ? "CA" : "BOTH";

    try {
      await pool.query(
        `INSERT INTO exam_questions (tier, exam, question_type, status, stem, scenario, options, correct_answer, rationale, body_system, topic, difficulty, stem_hash, region_scope, career_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          tier,
          exam,
          "bowtie",
          "published",
          q.scenario.trim(),
          q.scenario.trim(),
          options,
          correctAnswer,
          q.rationale.trim(),
          q.category?.trim() || "General",
          q.topic?.trim() || "General",
          difficultyToInt(q.difficulty || "moderate"),
          stemHash,
          regionScope,
          "nursing",
        ]
      );
      inserted++;
      existingHashes.add(stemHash);
    } catch (err: any) {
      console.error(`  Bowtie insert error: ${err.message.substring(0, 150)}`);
      skipped++;
    }
  }

  return { inserted, skipped, duplicates, validationErrors };
}

async function main() {
  console.log("=== RPN/LVN Question Import ===\n");

  const docxPath = path.join(__dirname, "../attached_assets/RPNquestions_1773276030311.docx");
  if (!fs.existsSync(docxPath)) {
    console.error("Error: .docx file not found at", docxPath);
    process.exit(1);
  }

  console.log("Extracting text from .docx file...");
  const rawText = await extractTextFromDocx(docxPath);
  console.log(`Extracted ${rawText.length} characters, ${rawText.split("\n").length} lines\n`);

  console.log("Parsing JSON arrays from extracted text...");
  const { mcq, bowtie } = parseJsonArraysFromText(rawText);
  console.log(`Parsed ${mcq.length} MCQ questions and ${bowtie.length} bowtie questions`);
  console.log(`Total parsed: ${mcq.length + bowtie.length}\n`);

  console.log("--- Importing MCQ Questions into question_bank ---");
  const mcqResult = await importMCQQuestions(mcq);
  console.log(`MCQ Results:`);
  console.log(`  Inserted: ${mcqResult.inserted}`);
  console.log(`  Duplicates skipped: ${mcqResult.duplicates}`);
  console.log(`  Validation errors: ${mcqResult.validationErrors}`);
  console.log(`  Other skipped: ${mcqResult.skipped}\n`);

  console.log("--- Importing Bowtie Questions into exam_questions ---");
  const bowtieResult = await importBowtieQuestions(bowtie);
  console.log(`Bowtie Results:`);
  console.log(`  Inserted: ${bowtieResult.inserted}`);
  console.log(`  Duplicates skipped: ${bowtieResult.duplicates}`);
  console.log(`  Validation errors: ${bowtieResult.validationErrors}`);
  console.log(`  Other skipped: ${bowtieResult.skipped}\n`);

  const totalInserted = mcqResult.inserted + bowtieResult.inserted;
  const totalDuplicates = mcqResult.duplicates + bowtieResult.duplicates;
  const totalValidationErrors = mcqResult.validationErrors + bowtieResult.validationErrors;
  const totalSkipped = mcqResult.skipped + bowtieResult.skipped;

  console.log("=== IMPORT SUMMARY ===");
  console.log(`Total parsed: ${mcq.length + bowtie.length}`);
  console.log(`  MCQ parsed: ${mcq.length}`);
  console.log(`  Bowtie parsed: ${bowtie.length}`);
  console.log(`Total inserted: ${totalInserted}`);
  console.log(`Total duplicates skipped: ${totalDuplicates}`);
  console.log(`Total validation errors: ${totalValidationErrors}`);
  console.log(`Total other skipped: ${totalSkipped}`);

  const qbCount = await pool.query("SELECT COUNT(*)::int as cnt FROM question_bank");
  console.log(`\nQuestion bank total: ${qbCount.rows[0].cnt}`);

  const bowtieDbCount = await pool.query("SELECT COUNT(*)::int as cnt FROM exam_questions WHERE question_type = 'bowtie' AND tier = 'rpn'");
  console.log(`Exam questions (RPN bowtie) total: ${bowtieDbCount.rows[0].cnt}`);

  await pool.end();
}

main().catch((e) => {
  console.error("Import failed:", e);
  process.exit(1);
});
