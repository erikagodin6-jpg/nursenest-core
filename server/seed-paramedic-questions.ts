import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { pool } from "./storage";
import { importClientDataAbsolute } from "./client-data-import";

const __dirnameSeedParamedic =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export async function seedParamedicQuestions() {
  let paramedicQuestions: any[];
  try {
    const jsonPath = path.resolve(process.cwd(), "data", "career-questions", "paramedic-questions.json");
    if (existsSync(jsonPath)) {
      const raw = await readFile(jsonPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        paramedicQuestions = parsed;
      } else {
        throw new Error("JSON present but empty/invalid");
      }
    } else {
      throw new Error("JSON file missing");
    }
  } catch (e: any) {
    try {
      const mod = await importClientDataAbsolute(
        path.resolve(__dirnameSeedParamedic, "../client/src/data/career-questions/paramedic-questions"),
      );
      paramedicQuestions = mod.paramedicQuestions;
    } catch (e2: any) {
      console.error("[Paramedic Q-Seed] Failed to load question source:", e2?.message || e?.message);
      return;
    }
  }

  try {
    const existing = await pool.query(
      `SELECT COUNT(*) FROM allied_questions WHERE career_type = 'paramedic'`
    );
    const count = parseInt(existing.rows[0].count);

    if (count >= paramedicQuestions.length) {
      console.log(`[Paramedic Q-Seed] Already ${count} paramedic questions in DB, skipping.`);
      return;
    }

    console.log(`[Paramedic Q-Seed] Seeding ${paramedicQuestions.length} questions (${count} existing)...`);

    let inserted = 0;

    for (const q of paramedicQuestions) {
      try {
        await pool.query(
          `INSERT INTO allied_questions
            (id, career_type, stem, options, correct_answer, rationale_long, blueprint_category,
             subtopic, difficulty, status, learning_objective, cognitive_level, question_type)
           VALUES ($1, 'paramedic', $2, $3, $4, $5, $6, $7, $8, 'published',
                   'Paramedic certification preparation', 'application', 'mcq')
           ON CONFLICT (id) DO NOTHING`,
          [q.id, q.stem, JSON.stringify(q.options), q.correctIndex, q.rationale,
           q.category, q.topic, q.difficulty]
        );
        inserted++;
      } catch (e: any) {
        // skip individual failures
      }
    }

    console.log(`[Paramedic Q-Seed] Done. Inserted ${inserted} paramedic questions.`);
  } catch (e: any) {
    console.error("[Paramedic Q-Seed] Error:", e.message);
  }
}
