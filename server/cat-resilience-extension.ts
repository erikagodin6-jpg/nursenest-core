/**
 * Phase 4 — CAT Exam Resilience Extension
 * Extends existing CAT resilience to cover new_grad and all tiers.
 * Provides a unified resilience CAT launch surface with "Temporary resilience mode" banner.
 */

import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { addAlert } from "./platform-resilience";

export const ALL_CAT_TIERS = ["rpn", "rn", "np", "allied", "new_grad"] as const;
export type CatTier = (typeof ALL_CAT_TIERS)[number];

interface ResilienceCATSession {
  sessionId: string;
  userId: string;
  tier: CatTier;
  questions: any[];
  startedAt: string;
  mode: "resilience";
  banner: string;
}

const RESILIENCE_BANNER = "Temporary resilience mode active. Your session will be saved and your full analytics will sync when service is restored.";

export async function ensureCATResilienceExtensionTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cat_resilience_sessions (
        session_id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id varchar NOT NULL,
        tier text NOT NULL,
        questions jsonb NOT NULL DEFAULT '[]'::jsonb,
        answers jsonb NOT NULL DEFAULT '{}'::jsonb,
        score numeric,
        started_at timestamptz NOT NULL DEFAULT NOW(),
        completed_at timestamptz,
        mode text NOT NULL DEFAULT 'resilience',
        synced_to_main boolean NOT NULL DEFAULT false
      );
      CREATE INDEX IF NOT EXISTS idx_cat_resilience_user ON cat_resilience_sessions(user_id, started_at DESC);
      CREATE INDEX IF NOT EXISTS idx_cat_resilience_unsynced ON cat_resilience_sessions(synced_to_main, completed_at);
    `);
  } catch (e: any) {
    console.error("[CATResilienceExt] Table init error:", e.message);
  }
}

async function fetchNewGradQuestions(limit = 150): Promise<any[]> {
  try {
    const { rows } = await pool.query(
      `SELECT id, stem, options, correct_answer, body_system, topic, difficulty, question_type, tier
       FROM exam_questions
       WHERE (tier = 'new_grad' OR tier = 'rn')
         AND is_published = true
         AND correct_answer IS NOT NULL
       ORDER BY id
       LIMIT $1`,
      [limit]
    );
    return rows;
  } catch {
    return [];
  }
}

export async function ensureNewGradResilienceBank(): Promise<{ count: number; ok: boolean }> {
  try {
    const questions = await fetchNewGradQuestions(150);
    if (questions.length < 25) {
      addAlert("warning", "cat_resilience", "New Grad CAT Bank Low", `Only ${questions.length} questions available for new_grad resilience bank.`, "cat-resilience-extension");
      return { count: questions.length, ok: false };
    }

    await pool.query(
      `INSERT INTO cat_emergency_fallback_banks (tier, version, generated_at, checksum, questions, question_count)
       VALUES ('new_grad', $1, NOW(), $2, $3, $4)
       ON CONFLICT (tier) DO UPDATE SET
         version = EXCLUDED.version,
         generated_at = NOW(),
         checksum = EXCLUDED.checksum,
         questions = EXCLUDED.questions,
         question_count = EXCLUDED.question_count`,
      [
        Date.now(),
        `ng_${questions.length}`,
        JSON.stringify(questions),
        questions.length,
      ]
    );

    return { count: questions.length, ok: true };
  } catch (e: any) {
    console.error("[CATResilienceExt] New grad bank error:", e.message);
    return { count: 0, ok: false };
  }
}

async function getResilienceQuestions(tier: CatTier): Promise<any[]> {
  try {
    const { rows } = await pool.query(
      `SELECT questions FROM cat_emergency_fallback_banks WHERE tier = $1`,
      [tier]
    );
    if (rows.length && rows[0].questions) {
      const qs = typeof rows[0].questions === "string" ? JSON.parse(rows[0].questions) : rows[0].questions;
      return shuffle(qs).slice(0, 75); // serve 75 for a resilience session
    }
    return [];
  } catch {
    return [];
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function computeResilienceScore(answers: Record<string, string>, questions: any[]): number {
  let correct = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correct_answer) correct++;
  }
  return questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
}

export function registerCATResilienceExtensionRoutes(app: Express): void {
  // Launch a resilience CAT session
  app.post("/api/cat/resilience-launch", async (req: Request, res: Response) => {
    const { userId, tier } = req.body;
    if (!userId || !tier) return res.status(400).json({ error: "userId and tier required" });
    if (!ALL_CAT_TIERS.includes(tier as CatTier)) return res.status(400).json({ error: "invalid tier" });

    const questions = await getResilienceQuestions(tier as CatTier);
    if (!questions.length) {
      return res.status(503).json({ error: "resilience_bank_empty", message: "Resilience pool not yet available for this tier." });
    }

    try {
      const { rows } = await pool.query(
        `INSERT INTO cat_resilience_sessions (user_id, tier, questions, mode)
         VALUES ($1, $2, $3, 'resilience') RETURNING session_id`,
        [userId, tier, JSON.stringify(questions)]
      );
      const session: ResilienceCATSession = {
        sessionId: rows[0].session_id,
        userId,
        tier: tier as CatTier,
        questions: questions.map(({ correct_answer: _, ...q }) => q),
        startedAt: new Date().toISOString(),
        mode: "resilience",
        banner: RESILIENCE_BANNER,
      };
      return res.json({ ok: true, session });
    } catch (e: any) {
      return res.status(500).json({ error: "session_create_failed", message: e.message });
    }
  });

  // Submit resilience CAT answers
  app.post("/api/cat/resilience-submit", async (req: Request, res: Response) => {
    const { sessionId, answers } = req.body;
    if (!sessionId || !answers) return res.status(400).json({ error: "sessionId and answers required" });

    try {
      const { rows } = await pool.query(
        `SELECT session_id, user_id, tier, questions FROM cat_resilience_sessions WHERE session_id = $1`,
        [sessionId]
      );
      if (!rows.length) return res.status(404).json({ error: "session_not_found" });

      const session = rows[0];
      const questions = typeof session.questions === "string" ? JSON.parse(session.questions) : session.questions;
      const score = computeResilienceScore(answers, questions);

      await pool.query(
        `UPDATE cat_resilience_sessions SET answers = $1, score = $2, completed_at = NOW() WHERE session_id = $3`,
        [JSON.stringify(answers), score, sessionId]
      );

      return res.json({
        ok: true,
        sessionId,
        score,
        tier: session.tier,
        message: RESILIENCE_BANNER,
        remediationTopics: questions
          .filter((q: any) => answers[q.id] !== q.correct_answer)
          .map((q: any) => q.topic)
          .filter(Boolean)
          .slice(0, 10),
      });
    } catch (e: any) {
      return res.status(500).json({ error: "submit_failed", message: e.message });
    }
  });

  // Status of all tier banks
  app.get("/api/cat/resilience-status", async (_req: Request, res: Response) => {
    try {
      const { rows } = await pool.query(
        `SELECT tier, question_count, generated_at, version FROM cat_emergency_fallback_banks`
      );
      const status: Record<string, any> = {};
      for (const tier of ALL_CAT_TIERS) {
        const row = rows.find((r: any) => r.tier === tier);
        status[tier] = row
          ? { available: row.question_count >= 25, count: row.question_count, generatedAt: row.generated_at }
          : { available: false, count: 0, generatedAt: null };
      }
      return res.json({ ok: true, tiers: status });
    } catch {
      return res.json({ ok: false, tiers: {} });
    }
  });
}
