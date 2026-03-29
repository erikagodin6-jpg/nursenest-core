import fs from "fs";
import path from "path";
import crypto from "crypto";
import { pool } from "./storage";

/**
 * ------------------------------
 * CONSTANTS
 * ------------------------------
 */

const DIFFICULTY_MAP: Record<string, number> = { easy: 2, moderate: 3, hard: 4 };
const ANSWER_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };

const EXAM_TO_TIER: Record<string, string> = {
  "NCLEX-PN": "rpn",
  "REx-PN": "rpn",
  "NCLEX-RN": "rn",
  "AANP": "np",
  "ANCC": "np",
  PN: "rpn",
};

const COUNTRY_TO_REGION: Record<string, string> = {
  US: "US",
  Canada: "CAN",
  Both: "BOTH",
};

/**
 * ------------------------------
 * HELPERS
 * ------------------------------
 */

function stemHash(text: string): string {
  return crypto
    .createHash("md5")
    .update(text.trim().toLowerCase().replace(/\s+/g, " "))
    .digest("hex");
}

function normalizeExam(raw: string): string[] {
  if (!raw) return ["NCLEX-PN"];
  if (raw === "PN") return ["NCLEX-PN", "REx-PN"];
  return raw.includes("|") ? raw.split("|").map(s => s.trim()) : [raw.trim()];
}

function normalizeCountry(raw: string): string[] {
  if (!raw) return ["US"];
  if (raw === "Both") return ["US", "Canada"];
  return raw.includes("|") ? raw.split("|").map(s => s.trim()) : [raw.trim()];
}

function normalizeQuestionType(raw: string): string {
  if (!raw) return "standard";
  return raw.toLowerCase().split("|")[0].replace(/_/g, " ").trim();
}

/**
 * ------------------------------
 * SAFE PARSING
 * ------------------------------
 */

function safeJsonParse(content: string): any[] {
  try {
    return JSON.parse(content);
  } catch {
    try {
      return JSON.parse(`[${content.replace(/,\s*$/, "")}]`);
    } catch {
      return [];
    }
  }
}

/**
 * ------------------------------
 * QUESTION PARSERS
 * ------------------------------
 */

function parseStandard(q: any, exam: string, country: string) {
  if (!q.question || !q.option_a || !q.option_b || !q.option_c || !q.option_d) return null;

  const options = [
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.option_e,
    q.option_f,
  ].filter(Boolean).map((o: string) => o.trim());

  let correct: number[] = [];

  if (Array.isArray(q.correct_answer)) {
    correct = q.correct_answer.map((a: string) => ANSWER_INDEX[a]);
  } else {
    const idx = ANSWER_INDEX[q.correct_answer];
    if (idx !== undefined) correct = [idx];
  }

  if (!correct.length) return null;

  return {
    stem: q.question.trim(),
    options,
    correctAnswer: correct,
    rationale: q.rationale || "",
    difficulty: DIFFICULTY_MAP[q.difficulty] || 3,
    bodySystem: q.category || null,
    topic: q.client_needs || null,
    subtopic: q.topic || null,
    questionType: normalizeQuestionType(q.question_type),
    exam,
    tier: EXAM_TO_TIER[exam] || "rpn",
    regionScope: COUNTRY_TO_REGION[country] || "BOTH",
    stemHashVal: stemHash(q.question),
    scenario: null,
    exhibitData: null,
  };
}

function parseBowtie(q: any, exam: string, country: string) {
  if (!q.scenario || !q.condition_options) return null;

  const options = [
    ...q.condition_options,
    ...q.action_options,
    ...q.monitor_options,
  ];

  const correct = [];

  const condIdx = q.condition_options.indexOf(q.correct_condition);
  const actIdx = q.action_options.indexOf(q.correct_action);
  const monIdx = q.monitor_options.indexOf(q.correct_monitor);

  if (condIdx >= 0) correct.push(condIdx);
  if (actIdx >= 0) correct.push(q.condition_options.length + actIdx);
  if (monIdx >= 0)
    correct.push(q.condition_options.length + q.action_options.length + monIdx);

  return {
    stem: `Bowtie: ${q.scenario}`,
    options,
    correctAnswer: correct,
    rationale: q.rationale || "",
    difficulty: DIFFICULTY_MAP[q.difficulty] || 3,
    bodySystem: q.category || null,
    topic: q.client_needs || null,
    subtopic: q.topic || null,
    questionType: "bowtie",
    exam,
    tier: EXAM_TO_TIER[exam] || "rpn",
    regionScope: COUNTRY_TO_REGION[country] || "BOTH",
    stemHashVal: stemHash(q.scenario),
    scenario: q.scenario,
    exhibitData: q,
  };
}

/**
 * ------------------------------
 * MAIN SEED FUNCTION
 * ------------------------------
 */

export async function seedQuestions() {
  const filePath = path.resolve("attached_assets/questions.txt");

  if (!fs.existsSync(filePath)) {
    return { error: "File not found", total: 0, processed: 0, inserted: 0, skipped: 0, errors: 0 };
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const raw = safeJsonParse(content);

  const parsed: any[] = [];
  const seen = new Set<string>();

  for (const q of raw) {
    const exams = normalizeExam(q.exam);
    const countries = normalizeCountry(q.country);

    for (let i = 0; i < exams.length; i++) {
      const exam = exams[i];
      const country = countries[i] || countries[0];

      const obj = q.condition_options
        ? parseBowtie(q, exam, country)
        : parseStandard(q, exam, country);

      if (!obj) continue;

      const key = `${obj.stemHashVal}_${obj.exam}`;
      if (seen.has(key)) continue;

      seen.add(key);
      parsed.push(obj);
    }
  }

  let inserted = 0;
  let skipped = 0;

  for (const q of parsed) {
    try {
      await pool.query(
        `INSERT INTO exam_questions (
          tier, exam, question_type, status, published_at,
          stem, options, correct_answer, rationale, difficulty,
          body_system, topic, subtopic, region_scope, career_type,
          stem_hash, scenario, exhibit_data
        )
        VALUES ($1,$2,$3,'published',NOW(),$4,$5,$6,$7,$8,$9,$10,$11,$12,'nursing',$13,$14,$15)
        ON CONFLICT (stem_hash, exam) DO NOTHING`,
        [
          q.tier,
          q.exam,
          q.questionType,
          q.stem,
          JSON.stringify(q.options),
          JSON.stringify(q.correctAnswer),
          q.rationale,
          q.difficulty,
          q.bodySystem,
          q.topic,
          q.subtopic,
          q.regionScope,
          q.stemHashVal,
          q.scenario,
          q.exhibitData ? JSON.stringify(q.exhibitData) : null,
        ]
      );

      inserted++;
    } catch {
      skipped++;
    }
  }

  return {
    total: raw.length,
    processed: parsed.length,
    inserted,
    skipped,
    /** Rows that failed insert (same counter as `skipped` in this implementation). */
    errors: skipped,
  };
}