/**
 * Phase 7 — Daily Question Resilience
 * Pre-generates a 30-day question queue per user.
 * If email delivery fails, the question remains available in-app.
 * If the scheduler fails, the next queued question is served.
 */

import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { resolveAuthUser } from "./admin-auth";

const QUEUE_DAYS = 30;

export async function ensureDailyQuestionQueueTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS daily_question_queue (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id varchar NOT NULL,
        question_id varchar NOT NULL,
        scheduled_date date NOT NULL,
        delivered_via text[] NOT NULL DEFAULT '{}'::text[],
        viewed_at timestamptz,
        answered_at timestamptz,
        is_correct boolean,
        created_at timestamptz NOT NULL DEFAULT NOW()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_q_user_date ON daily_question_queue(user_id, scheduled_date);
      CREATE INDEX IF NOT EXISTS idx_daily_q_user ON daily_question_queue(user_id, scheduled_date);
      CREATE INDEX IF NOT EXISTS idx_daily_q_undelivered ON daily_question_queue(scheduled_date) WHERE viewed_at IS NULL;
    `);
  } catch (e: any) {
    console.error("[DailyQuestionQueue] Table init error:", e.message);
  }
}

export async function generateQueueForUser(userId: string, tier: string = "rn"): Promise<number> {
  try {
    // Check how many days already queued
    const { rows: existing } = await pool.query(
      `SELECT scheduled_date FROM daily_question_queue
       WHERE user_id = $1 AND scheduled_date >= CURRENT_DATE
       ORDER BY scheduled_date`,
      [userId]
    );

    const existingDates = new Set(existing.map((r: any) => r.scheduled_date.toISOString().slice(0, 10)));
    const needed: string[] = [];
    for (let i = 0; i < QUEUE_DAYS; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const ds = d.toISOString().slice(0, 10);
      if (!existingDates.has(ds)) needed.push(ds);
    }

    if (!needed.length) return 0;

    // Pull questions not yet in the queue for this user
    const { rows: questions } = await pool.query(
      `SELECT id FROM exam_questions
       WHERE (tier = $1 OR tier = 'rn')
         AND is_published = true
         AND id NOT IN (
           SELECT question_id FROM daily_question_queue WHERE user_id = $2
         )
       ORDER BY id
       LIMIT $3`,
      [tier, userId, needed.length]
    );

    let inserted = 0;
    for (let i = 0; i < Math.min(needed.length, questions.length); i++) {
      try {
        await pool.query(
          `INSERT INTO daily_question_queue (user_id, question_id, scheduled_date)
           VALUES ($1, $2, $3)
           ON CONFLICT (user_id, scheduled_date) DO NOTHING`,
          [userId, questions[i].id, needed[i]]
        );
        inserted++;
      } catch {}
    }

    return inserted;
  } catch (e: any) {
    console.error("[DailyQuestionQueue] Generate error:", e.message);
    return 0;
  }
}

export async function getTodaysDailyQuestion(userId: string): Promise<any | null> {
  try {
    const { rows } = await pool.query(
      `SELECT dq.id as queue_id, dq.scheduled_date, dq.viewed_at,
              q.id, q.stem, q.options, q.correct_answer, q.rationale, q.topic, q.body_system, q.difficulty
       FROM daily_question_queue dq
       JOIN exam_questions q ON q.id = dq.question_id
       WHERE dq.user_id = $1 AND dq.scheduled_date <= CURRENT_DATE AND dq.viewed_at IS NULL
       ORDER BY dq.scheduled_date ASC
       LIMIT 1`,
      [userId]
    );

    if (!rows.length) {
      // No pre-queued question — serve a random one
      const { rows: fallback } = await pool.query(
        `SELECT id, stem, options, correct_answer, rationale, topic, body_system, difficulty
         FROM exam_questions WHERE is_published = true ORDER BY id LIMIT 1`
      );
      return fallback[0] ? { ...fallback[0], fallback: true } : null;
    }

    await pool.query(
      `UPDATE daily_question_queue SET viewed_at = NOW() WHERE id = $1`,
      [rows[0].queue_id]
    );

    return rows[0];
  } catch {
    return null;
  }
}

export function registerDailyQuestionRoutes(app: Express): void {
  app.get("/api/daily-question", async (req: Request, res: Response) => {
    const authUser = await resolveAuthUser(req).catch(() => null);
    if (!authUser) return res.status(401).json({ error: "unauthorized" });

    // Ensure queue exists
    await generateQueueForUser(authUser.id, (authUser as any).tier || "rn").catch(() => {});

    const question = await getTodaysDailyQuestion(authUser.id);
    if (!question) return res.status(404).json({ error: "no_question_available" });

    return res.json({ ok: true, question });
  });

  app.post("/api/daily-question/:queueId/answer", async (req: Request, res: Response) => {
    const authUser = await resolveAuthUser(req).catch(() => null);
    if (!authUser) return res.status(401).json({ error: "unauthorized" });

    const { isCorrect } = req.body;
    try {
      await pool.query(
        `UPDATE daily_question_queue SET answered_at = NOW(), is_correct = $1 WHERE id = $2 AND user_id = $3`,
        [!!isCorrect, req.params.queueId, authUser.id]
      );
      return res.json({ ok: true });
    } catch {
      return res.status(500).json({ error: "update_failed" });
    }
  });

  // Admin: bulk generate queues
  app.post("/api/admin/daily-question-queue/generate", async (_req: Request, res: Response) => {
    try {
      const { rows: users } = await pool.query(
        `SELECT id, COALESCE(tier, 'rn') as tier FROM users WHERE created_at > NOW() - INTERVAL '1 year' LIMIT 1000`
      );
      let total = 0;
      for (const user of users) {
        const n = await generateQueueForUser(user.id, user.tier).catch(() => 0);
        total += n;
      }
      return res.json({ ok: true, generated: total });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });
}
