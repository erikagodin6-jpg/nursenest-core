import { Router } from "express";
import { pool } from "./storage";
import { resolveAuthUser } from "./admin-auth";

const router = Router();

/* =========================
   AUTH
========================= */

async function requireAuth(req: any, res: any) {
  const user = await resolveAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return user;
}

/* =========================
   LIST BANKS
========================= */

router.get("/api/test-banks", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const result = await pool.query(
      `SELECT id, name, slug, description, tier, question_count
       FROM test_bank_collections
       WHERE status='active'
       ORDER BY sort_order ASC`
    );

    res.json({ collections: result.rows });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   QUESTIONS (FAST + PAGINATED)
========================= */

router.get("/api/test-banks/:bankId/questions", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const offset = Number(req.query.offset) || 0;

    const result = await pool.query(
      `SELECT id, stem, options, difficulty
       FROM exam_questions
       WHERE status='published'
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      questions: result.rows,
      limit,
      offset,
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ANSWER (MINIMAL WRITES)
========================= */

router.post("/api/test-banks/:bankId/answer", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { questionId, selectedAnswer } = req.body;

    const q = await pool.query(
      `SELECT correct_answer FROM exam_questions WHERE id=$1`,
      [questionId]
    );

    if (!q.rows.length) {
      return res.status(404).json({ error: "Question not found" });
    }

    const correctAnswer = q.rows[0].correct_answer;
    const isCorrect = correctAnswer === selectedAnswer;

    // only ONE write
    await pool.query(
      `INSERT INTO unified_question_history (user_id, question_id, was_correct)
       VALUES ($1,$2,$3)`,
      [user.id, questionId, isCorrect]
    );

    res.json({
      correct: isCorrect,
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   PROGRESS (LIGHTWEIGHT)
========================= */

router.get("/api/test-banks/:bankId/progress", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const result = await pool.query(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN was_correct THEN 1 ELSE 0 END) AS correct
       FROM unified_question_history
       WHERE user_id=$1`,
      [user.id]
    );

    const total = Number(result.rows[0].total || 0);
    const correct = Number(result.rows[0].correct || 0);

    res.json({
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export function registerTestBankRoutes(app: any) {
  app.use(router);
}

export function registerTestBankApiRoutes(app: any) {
  registerTestBankRoutes(app);
}