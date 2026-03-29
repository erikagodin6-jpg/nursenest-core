import { Router } from "express";
import { pool } from "./storage";
import { resolveAuthUser } from "./admin-auth";
import { resolveEntitlementSync } from "./entitlements";
import { selectNextItem } from "./cat-engine";

const router = Router();

/* =========================
   HELPERS
========================= */

async function requireAuth(req: any, res: any) {
  const user = await resolveAuthUser(req).catch(() => null);
  if (!user) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }
  return user;
}

function safeParseOptions(options: any) {
  try {
    return typeof options === "string" ? JSON.parse(options) : options;
  } catch {
    return [];
  }
}

function parseCorrectAnswer(raw: any): number[] {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === "number") return [parsed];
  } catch {}
  return [0];
}

/* =========================
   QUESTION SELECTOR
========================= */

async function selectNextQuestion(
  tier: string,
  seenIds: string[],
  ability: number
) {
  const result = await pool.query(
    `SELECT id, stem, options, difficulty, body_system, topic, question_type, correct_answer
     FROM exam_questions
     WHERE tier=$1 AND status='published'
       AND difficulty IS NOT NULL
       AND correct_answer IS NOT NULL
       AND (is_adaptive_eligible=true OR is_adaptive_eligible IS NULL)
       ${seenIds.length ? "AND id != ALL($2)" : ""}
     ORDER BY ABS(difficulty - $3), RANDOM()
     LIMIT 20`,
    seenIds.length ? [tier, seenIds, ability] : [tier, ability]
  );

  return result.rows[0] || null;
}

/* =========================
   START CAT
========================= */

router.post("/api/cat/start", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const entitlement = resolveEntitlementSync(user, "feature", "cat_exams");
    if (!entitlement.hasAccess) {
      return res.status(403).json({ error: "Premium required" });
    }

    const tier = req.body.tier || user.tier || "rpn";
    const maxQuestions = req.body.questionCount || 150;

    const state = {
      ability: 0,
      se: 1,
      seen: [],
      responses: [],
    };

    const attempt = await pool.query(
      `INSERT INTO mock_exam_attempts
       (id, user_id, tier, total_questions, status, exam_type, cat_state)
       VALUES (gen_random_uuid(), $1, $2, $3, 'in_progress', 'cat', $4)
       RETURNING id`,
      [user.id, tier, maxQuestions, JSON.stringify(state)]
    );

    const nextQ = await selectNextQuestion(tier, [], 0);

    res.json({
      attemptId: attempt.rows[0].id,
      question: {
        id: nextQ.id,
        stem: nextQ.stem,
        options: safeParseOptions(nextQ.options),
        difficulty: nextQ.difficulty,
        topic: nextQ.topic,
      },
    });

  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

/* =========================
   ANSWER
========================= */

router.post("/api/cat/:id/answer", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { questionId, selectedAnswer } = req.body;

    const attempt = await pool.query(
      `SELECT * FROM mock_exam_attempts WHERE id=$1 AND user_id=$2`,
      [req.params.id, user.id]
    );

    if (!attempt.rows[0]) {
      return res.status(404).json({ error: "Session not found" });
    }

    const state = attempt.rows[0].cat_state || {};
    const q = await pool.query(
      `SELECT difficulty, correct_answer FROM exam_questions WHERE id=$1`,
      [questionId]
    );

    const correct = parseCorrectAnswer(q.rows[0].correct_answer);
    const isCorrect = correct.includes(selectedAnswer);

    // SIMPLE IRT UPDATE
    const ability = state.ability || 0;
    const difficulty = q.rows[0].difficulty || 3;

    const p = 1 / (1 + Math.exp(-(ability - difficulty)));
    const newAbility = isCorrect
      ? ability + 0.5 * (1 - p)
      : ability - 0.5 * p;

    state.ability = newAbility;
    state.se = Math.max(0.2, (state.se || 1) * 0.95);
    state.seen = [...(state.seen || []), questionId];

    await pool.query(
      `UPDATE mock_exam_attempts SET cat_state=$1 WHERE id=$2`,
      [JSON.stringify(state), req.params.id]
    );

    const nextQ = await selectNextQuestion(
      attempt.rows[0].tier,
      state.seen,
      newAbility
    );

    res.json({
      correct: isCorrect,
      ability: newAbility,
      nextQuestion: nextQ
        ? {
            id: nextQ.id,
            stem: nextQ.stem,
            options: safeParseOptions(nextQ.options),
          }
        : null,
    });

  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export function registerCatRoutes(app: any) {
  app.use(router);
}

/** Admin analytics: lightweight published-question counts per tier. */
export async function buildCATPool(tier: string): Promise<{ diagnostics: Record<string, unknown> }> {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS c FROM exam_questions WHERE tier = $1 AND status = 'published'`,
    [tier],
  );
  const c = result.rows[0]?.c ?? 0;
  return {
    diagnostics: {
      tier,
      publishedQuestionCount: c,
      ok: c > 0,
    },
  };
}

export function registerCatSessionApiRoutes(app: any) {
  registerCatRoutes(app);
}
