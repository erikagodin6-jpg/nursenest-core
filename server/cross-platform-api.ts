import { Router } from "express";
import { pool } from "./storage";
import { resolveAuthUser } from "./admin-auth";
import { resolveEntitlementSync, checkEntitlement } from "./entitlements";
import { emitStructuredLog } from "./log-sink";
import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

const router = Router();

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

async function requireAuth(req: Request, res: Response): Promise<any | null> {
  const user = await resolveAuthUser(req as any);
  if (!user) {
    res.status(401).json({ error: "Authentication required", code: "AUTH_REQUIRED" });
    return null;
  }
  return user;
}

async function logAnalyticsEvent(
  userId: string,
  eventType: string,
  eventData: any = {},
  sessionId?: string,
  platform?: string
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO analytics_events (id, user_id, event_type, event_data, session_id, platform, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())`,
      [userId, eventType, JSON.stringify(eventData), sessionId || null, platform || "web"]
    );
  } catch (e: any) {
    console.error("[Analytics] Failed to log event:", e.message);
  }
}

async function recordQuestionHistory(
  userId: string,
  questionId: string,
  selectedAnswer: number | null,
  wasCorrect: boolean,
  sourceType: string,
  sourceId?: string,
  sessionId?: string,
  timeSpent?: number
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO unified_question_history (id, user_id, question_id, selected_answer, was_correct, session_id, source_type, source_id, time_spent, answered_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [userId, questionId, selectedAnswer, wasCorrect, sessionId || null, sourceType, sourceId || null, timeSpent || null]
    );
  } catch (e: any) {
    console.error("[QuestionHistory] Failed to record:", e.message);
  }
}

router.get("/api/v1/test-banks", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { role, country, exam } = req.query;

    let query = `SELECT * FROM test_bank_collections WHERE status = 'active'`;
    const params: any[] = [];
    let idx = 1;

    if (role) {
      query += ` AND role = $${idx}`;
      params.push(role);
      idx++;
    }
    if (country) {
      query += ` AND country = $${idx}`;
      params.push(country);
      idx++;
    }
    if (exam) {
      query += ` AND exam_type = $${idx}`;
      params.push(exam);
      idx++;
    }

    query += ` ORDER BY sort_order ASC, name ASC`;

    const result = await pool.query(query, params);

    const progressResult = await pool.query(
      `SELECT collection_id, questions_attempted, questions_correct FROM test_bank_progress WHERE user_id = $1`,
      [user.id]
    );
    const progressMap = new Map(progressResult.rows.map((r: any) => [r.collection_id, r]));

    const collections = result.rows.map((row: any) => {
      const entitlement = resolveEntitlementSync(user, "feature", "qbank");
      const isLocked = row.tier !== "free" && !entitlement.hasAccess;
      const progress = progressMap.get(row.id);

      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        role: row.role,
        country: row.country,
        examType: row.exam_type,
        tier: row.tier,
        questionCount: row.question_count,
        categories: row.categories,
        isLocked,
        progress: progress ? {
          questionsAttempted: progress.questions_attempted || 0,
          questionsCorrect: progress.questions_correct || 0,
          percentComplete: row.question_count > 0
            ? Math.round(((progress.questions_attempted || 0) / row.question_count) * 100)
            : 0,
        } : {
          questionsAttempted: 0,
          questionsCorrect: 0,
          percentComplete: 0,
        },
      };
    });

    res.json({ collections });
  } catch (e: any) {
    console.error("[TestBanks] Error:", e.message);
    res.status(500).json({ error: "Failed to fetch test banks" });
  }
});

router.get("/api/v1/test-banks/:id", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM test_bank_collections WHERE id = $1 AND status = 'active'`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Test bank not found" });
    }

    const bank = result.rows[0];
    const entitlement = resolveEntitlementSync(user, "feature", "qbank");
    const isLocked = bank.tier !== "free" && !entitlement.hasAccess;

    const progress = await pool.query(
      `SELECT * FROM test_bank_progress WHERE user_id = $1 AND collection_id = $2`,
      [user.id, id]
    );

    res.json({
      id: bank.id,
      name: bank.name,
      slug: bank.slug,
      description: bank.description,
      role: bank.role,
      country: bank.country,
      examType: bank.exam_type,
      tier: bank.tier,
      questionCount: bank.question_count,
      categories: bank.categories,
      metadata: bank.metadata,
      isLocked,
      entitlement: {
        hasAccess: entitlement.hasAccess,
        accessSource: entitlement.accessSource,
        reason: entitlement.accessDecisionReason,
      },
      progress: progress.rows[0] ? {
        questionsAttempted: progress.rows[0].questions_attempted || 0,
        questionsCorrect: progress.rows[0].questions_correct || 0,
        lastQuestionId: progress.rows[0].last_question_id,
        lastAccessedAt: progress.rows[0].last_accessed_at,
      } : null,
    });
  } catch (e: any) {
    console.error("[TestBanks] Detail error:", e.message);
    res.status(500).json({ error: "Failed to fetch test bank" });
  }
});

router.get("/api/v1/test-banks/:id/questions", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { id } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const offset = parseInt(req.query.offset as string) || 0;
    const category = req.query.category as string;

    const bankResult = await pool.query(
      `SELECT * FROM test_bank_collections WHERE id = $1 AND status = 'active'`,
      [id]
    );
    if (bankResult.rows.length === 0) {
      return res.status(404).json({ error: "Test bank not found" });
    }

    const bank = bankResult.rows[0];
    const entitlement = resolveEntitlementSync(user, "feature", "qbank");

    if (bank.tier !== "free" && !entitlement.hasAccess) {
      return res.status(403).json({
        error: "Premium access required",
        isLocked: true,
        requiredTier: bank.tier,
      });
    }

    let query = `SELECT id, stem, options, body_system, topic, difficulty, question_type
                 FROM exam_questions
                 WHERE status = 'published' AND exam_type = $1`;
    const params: any[] = [bank.exam_type || "rpn"];
    let idx = 2;

    if (category) {
      query += ` AND body_system = $${idx}`;
      params.push(category);
      idx++;
    }

    query += ` ORDER BY id LIMIT $${idx} OFFSET $${idx + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    await logAnalyticsEvent(user.id, "test_bank_started", {
      bankId: id,
      bankName: bank.name,
      questionCount: result.rows.length,
    });

    res.json({
      questions: result.rows.map((q: any) => ({
        id: q.id,
        stem: q.stem,
        options: (() => { try { return typeof q.options === "string" ? JSON.parse(q.options) : q.options; } catch { return []; } })(),
        bodySystem: q.body_system,
        topic: q.topic,
        difficulty: q.difficulty,
        questionType: q.question_type,
      })),
      total: result.rows.length,
      limit,
      offset,
    });
  } catch (e: any) {
    console.error("[TestBanks] Questions error:", e.message);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

const answerSchema = z.object({
  questionId: z.string().min(1),
  selectedAnswer: z.number().int().min(0).max(9),
  timeSpent: z.number().int().min(0).max(3600).optional(),
});

router.post("/api/v1/test-banks/:id/answer", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { id } = req.params;
    const parsed = answerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    }
    const { questionId, selectedAnswer, timeSpent } = parsed.data;

    const bankResult = await pool.query(
      `SELECT * FROM test_bank_collections WHERE id = $1 AND status = 'active'`,
      [id]
    );
    if (bankResult.rows.length === 0) {
      return res.status(404).json({ error: "Test bank not found" });
    }
    const bank = bankResult.rows[0];
    const entitlement = resolveEntitlementSync(user, "feature", "qbank");
    if (bank.tier !== "free" && !entitlement.hasAccess) {
      return res.status(403).json({ error: "Premium access required", isLocked: true });
    }

    const qResult = await pool.query(
      `SELECT id, correct_answer, rationale, correct_answer_explanation, distractor_rationales, clinical_pearl, body_system, tier
       FROM exam_questions WHERE id = $1 AND status = 'published'`,
      [questionId]
    );

    if (qResult.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    const question = qResult.rows[0];
    let correctAnswer = question.correct_answer;
    if (typeof correctAnswer === "string") {
      try { correctAnswer = JSON.parse(correctAnswer); } catch {}
    }
    const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    if (typeof correctAnswer === "string") {
      const mapped = letterMap[correctAnswer.toUpperCase()];
      if (mapped !== undefined) correctAnswer = [mapped];
    }
    if (typeof correctAnswer === "number") correctAnswer = [correctAnswer];
    if (!Array.isArray(correctAnswer)) correctAnswer = [0];

    const isCorrect = correctAnswer.includes(selectedAnswer);

    await recordQuestionHistory(
      user.id, questionId, selectedAnswer, isCorrect,
      "test_bank", id, undefined, timeSpent
    );

    await pool.query(
      `INSERT INTO test_bank_progress (id, user_id, collection_id, questions_attempted, questions_correct, last_question_id, last_accessed_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, 1, $3, $4, NOW(), NOW())
       ON CONFLICT (user_id, collection_id) DO UPDATE SET
         questions_attempted = test_bank_progress.questions_attempted + 1,
         questions_correct = test_bank_progress.questions_correct + $3,
         last_question_id = $4,
         last_accessed_at = NOW(),
         updated_at = NOW()`,
      [user.id, id, isCorrect ? 1 : 0, questionId]
    );

    await logAnalyticsEvent(user.id, "question_answered", {
      questionId,
      sourceType: "test_bank",
      sourceId: id,
      isCorrect,
      timeSpent,
    });

    let distractorRationales = question.distractor_rationales;
    if (typeof distractorRationales === "string") {
      try { distractorRationales = JSON.parse(distractorRationales); } catch { distractorRationales = null; }
    }

    res.json({
      correct: isCorrect,
      correctAnswer,
      rationale: question.rationale,
      correctAnswerExplanation: question.correct_answer_explanation || null,
      distractorRationales: distractorRationales || null,
      clinicalPearl: question.clinical_pearl || null,
      bodySystem: question.body_system,
    });
  } catch (e: any) {
    console.error("[TestBanks] Answer error:", e.message);
    res.status(500).json({ error: "Failed to process answer" });
  }
});

router.get("/api/v1/test-banks/:id/progress", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { id } = req.params;
    const progress = await pool.query(
      `SELECT * FROM test_bank_progress WHERE user_id = $1 AND collection_id = $2`,
      [user.id, id]
    );

    const history = await pool.query(
      `SELECT question_id, was_correct, answered_at FROM unified_question_history
       WHERE user_id = $1 AND source_type = 'test_bank' AND source_id = $2
       ORDER BY answered_at DESC LIMIT 50`,
      [user.id, id]
    );

    res.json({
      progress: progress.rows[0] ? snakeToCamel(progress.rows[0]) : null,
      recentHistory: history.rows.map((r: any) => snakeToCamel(r)),
    });
  } catch (e: any) {
    console.error("[TestBanks] Progress error:", e.message);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

router.post("/api/v1/cat-exams/start", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const entitlement = resolveEntitlementSync(user, "feature", "cat_exams");
    if (!entitlement.hasAccess) {
      return res.status(403).json({
        error: "CAT exam access requires premium subscription",
        isLocked: true,
        entitlement: {
          hasAccess: false,
          accessSource: entitlement.accessSource,
          reason: entitlement.accessDecisionReason,
        },
      });
    }

    const { tier, questionCount, blueprintCode } = req.body;
    const examTier = tier || user.tier || "rpn";
    const maxQuestions = Math.min(questionCount || 150, 200);

    const sessionId = `cat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const attemptResult = await pool.query(
      `INSERT INTO mock_exam_attempts (id, user_id, tier, total_questions, status, exam_type, career_type, cat_state, blueprint_code, started_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 'in_progress', 'cat', $4, $5, $6, NOW())
       RETURNING *`,
      [
        user.id,
        examTier,
        maxQuestions,
        user.career_type || user.careerType || "nursing",
        JSON.stringify({
          sessionId,
          currentAbility: 0,
          standardError: 1.0,
          questionsSeen: [],
          abilityTrajectory: [],
          stabilityIndex: 0,
          isPaused: false,
        }),
        blueprintCode || null,
      ]
    );

    const attempt = attemptResult.rows[0];

    const questionsResult = await pool.query(
      `SELECT id, stem, options, body_system, topic, difficulty, question_type
       FROM exam_questions
       WHERE tier = $1 AND status = 'published'
       ORDER BY md5(id::text || $2::text)
       LIMIT 1`,
      [examTier, Date.now().toString()]
    );

    await logAnalyticsEvent(user.id, "cat_started", {
      attemptId: attempt.id,
      sessionId,
      tier: examTier,
      maxQuestions,
    }, sessionId);

    const firstQuestion = questionsResult.rows[0];

    res.json({
      attemptId: attempt.id,
      sessionId,
      status: "in_progress",
      currentQuestion: firstQuestion ? {
        id: firstQuestion.id,
        stem: firstQuestion.stem,
        options: (() => { try { return typeof firstQuestion.options === "string" ? JSON.parse(firstQuestion.options) : firstQuestion.options; } catch { return []; } })(),
        bodySystem: firstQuestion.body_system,
        topic: firstQuestion.topic,
        difficulty: firstQuestion.difficulty,
        questionType: firstQuestion.question_type,
      } : null,
      questionNumber: 1,
      maxQuestions,
      catState: {
        currentAbility: 0,
        standardError: 1.0,
        questionCount: 0,
      },
    });
  } catch (e: any) {
    console.error("[CATExams] Start error:", e.message);
    res.status(500).json({ error: "Failed to start CAT exam" });
  }
});

router.get("/api/v1/cat-exams/:attemptId", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { attemptId } = req.params;
    const result = await pool.query(
      `SELECT * FROM mock_exam_attempts WHERE id = $1 AND user_id = $2 AND exam_type = 'cat'`,
      [attemptId, user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "CAT exam session not found" });
    }

    const attempt = result.rows[0];
    const catState = attempt.cat_state || {};

    res.json({
      attemptId: attempt.id,
      sessionId: catState.sessionId,
      status: attempt.status,
      tier: attempt.tier,
      totalQuestions: attempt.total_questions,
      questionsAnswered: (catState.questionsSeen || []).length,
      catState: {
        currentAbility: catState.currentAbility || 0,
        standardError: catState.standardError || 1.0,
        questionCount: (catState.questionsSeen || []).length,
        isPaused: catState.isPaused || false,
      },
      score: attempt.score,
      startedAt: attempt.started_at,
      completedAt: attempt.completed_at,
    });
  } catch (e: any) {
    console.error("[CATExams] Get error:", e.message);
    res.status(500).json({ error: "Failed to get CAT exam" });
  }
});

router.post("/api/v1/cat-exams/:attemptId/answer", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { attemptId } = req.params;
    const parsed = answerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    }
    const { questionId, selectedAnswer, timeSpent } = parsed.data;

    const attemptResult = await pool.query(
      `SELECT * FROM mock_exam_attempts WHERE id = $1 AND user_id = $2 AND exam_type = 'cat' AND status = 'in_progress'`,
      [attemptId, user.id]
    );

    if (attemptResult.rows.length === 0) {
      return res.status(404).json({ error: "Active CAT exam session not found" });
    }

    const attempt = attemptResult.rows[0];
    const catState = attempt.cat_state || {};

    if ((catState.questionsSeen || []).includes(questionId)) {
      return res.status(409).json({ error: "Question already answered in this session" });
    }

    const qResult = await pool.query(
      `SELECT id, correct_answer, rationale, body_system, difficulty FROM exam_questions WHERE id = $1`,
      [questionId]
    );

    if (qResult.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    const question = qResult.rows[0];
    let correctAnswer = question.correct_answer;
    if (typeof correctAnswer === "string") {
      try { correctAnswer = JSON.parse(correctAnswer); } catch {}
    }
    const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    if (typeof correctAnswer === "string") {
      const mapped = letterMap[correctAnswer.toUpperCase()];
      if (mapped !== undefined) correctAnswer = [mapped];
    }
    if (typeof correctAnswer === "number") correctAnswer = [correctAnswer];
    if (!Array.isArray(correctAnswer)) correctAnswer = [0];

    const isCorrect = correctAnswer.includes(selectedAnswer);

    const difficulty = question.difficulty || 2;
    const prevAbility = catState.currentAbility || 0;
    const questionCount = (catState.questionsSeen || []).length + 1;
    const stepSize = Math.max(0.1, 1.0 / Math.sqrt(questionCount));
    const newAbility = isCorrect
      ? prevAbility + stepSize * (1 - 1 / (1 + Math.exp(-1.7 * (prevAbility - difficulty))))
      : prevAbility - stepSize * (1 / (1 + Math.exp(-1.7 * (prevAbility - difficulty))));
    const newSE = Math.max(0.2, (catState.standardError || 1.0) * 0.95);

    const updatedCatState = {
      ...catState,
      currentAbility: Math.round(newAbility * 1000) / 1000,
      standardError: Math.round(newSE * 1000) / 1000,
      questionsSeen: [...(catState.questionsSeen || []), questionId],
      abilityTrajectory: [...(catState.abilityTrajectory || []), newAbility],
    };

    const answers = attempt.answers || {};
    answers[questionId] = { selectedAnswer, isCorrect, timeSpent };

    const shouldStop = questionCount >= attempt.total_questions || (questionCount >= 85 && newSE < 0.33);

    if (shouldStop) {
      await pool.query(
        `UPDATE mock_exam_attempts SET status = 'completed', cat_state = $1, answers = $2, score = $3, completed_at = NOW()
         WHERE id = $4`,
        [JSON.stringify(updatedCatState), JSON.stringify(answers), Math.round(((catState.abilityTrajectory || []).filter((_: any, i: number) => {
          const seen = (catState.questionsSeen || []);
          return answers[seen[i]]?.isCorrect;
        }).length / Math.max(questionCount, 1)) * 100), attemptId]
      );

      await logAnalyticsEvent(user.id, "cat_completed", {
        attemptId,
        finalAbility: newAbility,
        questionsAnswered: questionCount,
      }, catState.sessionId);
    } else {
      await pool.query(
        `UPDATE mock_exam_attempts SET cat_state = $1, answers = $2 WHERE id = $3`,
        [JSON.stringify(updatedCatState), JSON.stringify(answers), attemptId]
      );
    }

    await recordQuestionHistory(
      user.id, questionId, selectedAnswer, isCorrect,
      "cat_exam", attemptId, catState.sessionId, timeSpent
    );

    await logAnalyticsEvent(user.id, "question_answered", {
      questionId, sourceType: "cat_exam", sourceId: attemptId, isCorrect, timeSpent,
    }, catState.sessionId);

    let nextQuestion = null;
    if (!shouldStop) {
      const seenIds = updatedCatState.questionsSeen;
      const placeholders = seenIds.map((_: string, i: number) => `$${i + 3}`).join(",");
      const nextResult = await pool.query(
        `SELECT id, stem, options, body_system, topic, difficulty, question_type
         FROM exam_questions
         WHERE tier = $1 AND status = 'published'
         ${seenIds.length > 0 ? `AND id NOT IN (${placeholders})` : ""}
         ORDER BY ABS(difficulty - $2) ASC, RANDOM()
         LIMIT 1`,
        [attempt.tier, newAbility, ...seenIds]
      );

      if (nextResult.rows[0]) {
        const nq = nextResult.rows[0];
        nextQuestion = {
          id: nq.id,
          stem: nq.stem,
          options: typeof nq.options === "string" ? JSON.parse(nq.options) : nq.options,
          bodySystem: nq.body_system,
          topic: nq.topic,
          difficulty: nq.difficulty,
          questionType: nq.question_type,
        };
      }
    }

    res.json({
      correct: isCorrect,
      correctAnswer,
      rationale: question.rationale,
      isComplete: shouldStop,
      nextQuestion,
      questionNumber: questionCount + 1,
      catState: {
        currentAbility: updatedCatState.currentAbility,
        standardError: updatedCatState.standardError,
        questionCount,
      },
    });
  } catch (e: any) {
    console.error("[CATExams] Answer error:", e.message);
    res.status(500).json({ error: "Failed to process answer" });
  }
});

router.post("/api/v1/cat-exams/:attemptId/pause", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { attemptId } = req.params;
    const result = await pool.query(
      `SELECT * FROM mock_exam_attempts WHERE id = $1 AND user_id = $2 AND exam_type = 'cat' AND status = 'in_progress'`,
      [attemptId, user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Active CAT session not found" });
    }

    const catState = result.rows[0].cat_state || {};
    catState.isPaused = true;
    catState.pausedAt = new Date().toISOString();

    await pool.query(
      `UPDATE mock_exam_attempts SET cat_state = $1, status = 'paused' WHERE id = $2`,
      [JSON.stringify(catState), attemptId]
    );

    await logAnalyticsEvent(user.id, "cat_paused", { attemptId }, catState.sessionId);

    res.json({ success: true, status: "paused" });
  } catch (e: any) {
    console.error("[CATExams] Pause error:", e.message);
    res.status(500).json({ error: "Failed to pause session" });
  }
});

router.post("/api/v1/cat-exams/:attemptId/resume", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { attemptId } = req.params;
    const result = await pool.query(
      `SELECT * FROM mock_exam_attempts WHERE id = $1 AND user_id = $2 AND exam_type = 'cat' AND status = 'paused'`,
      [attemptId, user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Paused CAT session not found" });
    }

    const attempt = result.rows[0];
    const catState = attempt.cat_state || {};
    catState.isPaused = false;
    catState.resumedAt = new Date().toISOString();

    await pool.query(
      `UPDATE mock_exam_attempts SET cat_state = $1, status = 'in_progress' WHERE id = $2`,
      [JSON.stringify(catState), attemptId]
    );

    const seenIds = catState.questionsSeen || [];
    const placeholders = seenIds.map((_: string, i: number) => `$${i + 3}`).join(",");
    const nextResult = await pool.query(
      `SELECT id, stem, options, body_system, topic, difficulty, question_type
       FROM exam_questions
       WHERE tier = $1 AND status = 'published'
       ${seenIds.length > 0 ? `AND id NOT IN (${placeholders})` : ""}
       ORDER BY ABS(difficulty - $2) ASC, RANDOM()
       LIMIT 1`,
      [attempt.tier, catState.currentAbility || 0, ...seenIds]
    );

    await logAnalyticsEvent(user.id, "cat_resumed", { attemptId }, catState.sessionId);

    const nq = nextResult.rows[0];
    res.json({
      success: true,
      status: "in_progress",
      currentQuestion: nq ? {
        id: nq.id,
        stem: nq.stem,
        options: typeof nq.options === "string" ? JSON.parse(nq.options) : nq.options,
        bodySystem: nq.body_system,
        topic: nq.topic,
        difficulty: nq.difficulty,
        questionType: nq.question_type,
      } : null,
      questionNumber: seenIds.length + 1,
      catState: {
        currentAbility: catState.currentAbility || 0,
        standardError: catState.standardError || 1.0,
        questionCount: seenIds.length,
      },
    });
  } catch (e: any) {
    console.error("[CATExams] Resume error:", e.message);
    res.status(500).json({ error: "Failed to resume session" });
  }
});

router.get("/api/v1/cat-exams/:attemptId/results", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { attemptId } = req.params;
    const result = await pool.query(
      `SELECT * FROM mock_exam_attempts WHERE id = $1 AND user_id = $2 AND exam_type = 'cat' AND status = 'completed'`,
      [attemptId, user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Completed CAT exam not found" });
    }

    const attempt = result.rows[0];
    const catState = attempt.cat_state || {};
    const answers = attempt.answers || {};
    const questionsSeen = catState.questionsSeen || [];

    let correctCount = 0;
    for (const qId of questionsSeen) {
      if (answers[qId]?.isCorrect) correctCount++;
    }

    res.json({
      attemptId: attempt.id,
      status: "completed",
      score: attempt.score,
      totalQuestions: questionsSeen.length,
      correctCount,
      finalAbility: catState.currentAbility,
      standardError: catState.standardError,
      abilityTrajectory: catState.abilityTrajectory || [],
      startedAt: attempt.started_at,
      completedAt: attempt.completed_at,
      report: attempt.report,
    });
  } catch (e: any) {
    console.error("[CATExams] Results error:", e.message);
    res.status(500).json({ error: "Failed to get results" });
  }
});

router.get("/api/v1/mock-exams", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const entitlement = resolveEntitlementSync(user, "feature", "mock_exams");

    let definitionsResult;
    try {
      definitionsResult = await pool.query(
        `SELECT id, title, description, specialty, question_count, time_limit_minutes, tier, status
         FROM mock_exam_definitions WHERE status = 'active' ORDER BY title ASC`
      );
    } catch {
      definitionsResult = { rows: [] };
    }

    const exams = definitionsResult.rows.map((d: any) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      specialty: d.specialty,
      questionCount: d.question_count,
      timeLimitMinutes: d.time_limit_minutes,
      tier: d.tier,
      isLocked: d.tier !== "free" && !entitlement.hasAccess,
    }));

    res.json({ exams });
  } catch (e: any) {
    console.error("[MockExams] List error:", e.message);
    res.status(500).json({ error: "Failed to list mock exams" });
  }
});

router.get("/api/v1/mock-exams/:id", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM mock_exam_attempts WHERE id = $1 AND user_id = $2`,
      [id, user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mock exam not found" });
    }

    const attempt = result.rows[0];
    res.json({
      id: attempt.id,
      status: attempt.status,
      tier: attempt.tier,
      totalQuestions: attempt.total_questions,
      score: attempt.score,
      timeSpent: attempt.time_spent,
      examType: attempt.exam_type,
      careerType: attempt.career_type,
      reviewUnlocked: attempt.review_unlocked,
      timerState: attempt.timer_state,
      startedAt: attempt.started_at,
      completedAt: attempt.completed_at,
      questions: attempt.status === "completed" && attempt.review_unlocked ? attempt.questions : undefined,
      answers: attempt.status === "completed" && attempt.review_unlocked ? attempt.answers : undefined,
      report: attempt.status === "completed" ? attempt.report : undefined,
    });
  } catch (e: any) {
    console.error("[MockExams] Detail error:", e.message);
    res.status(500).json({ error: "Failed to get mock exam" });
  }
});

router.post("/api/v1/mock-exams/start", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const entitlement = resolveEntitlementSync(user, "feature", "mock_exams");
    if (!entitlement.hasAccess) {
      return res.status(403).json({
        error: "Mock exam access requires premium subscription",
        isLocked: true,
      });
    }

    const { tier, questionCount, timed, examMode } = req.body;
    const examTier = tier || user.tier || "rpn";
    const numQuestions = Math.min(questionCount || 75, 200);
    const isTimed = timed !== false;

    const questionsResult = await pool.query(
      `WITH candidate_ids AS (
         SELECT id FROM exam_questions
         WHERE tier = $1 AND status = 'published'
         ORDER BY md5(id::text || $2::text)
         LIMIT $3
       )
       SELECT eq.id, eq.stem, eq.options, eq.body_system, eq.topic, eq.difficulty, eq.question_type, eq.correct_answer, eq.rationale
       FROM exam_questions eq
       JOIN candidate_ids c ON eq.id = c.id`,
      [examTier, Date.now().toString(), numQuestions]
    );

    const questions = questionsResult.rows.map((q: any) => ({
      id: q.id,
      stem: q.stem,
      options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
      bodySystem: q.body_system,
      topic: q.topic,
      difficulty: q.difficulty,
      questionType: q.question_type,
    }));

    const attemptResult = await pool.query(
      `INSERT INTO mock_exam_attempts (id, user_id, tier, total_questions, status, exam_type, career_type, questions, timer_state, started_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 'in_progress', $4, $5, $6, $7, NOW())
       RETURNING *`,
      [
        user.id,
        examTier,
        numQuestions,
        examMode || "practice",
        user.career_type || user.careerType || "nursing",
        JSON.stringify(questionsResult.rows.map((q: any) => q.id)),
        JSON.stringify({ isTimed, startedAt: new Date().toISOString(), timeLimit: isTimed ? numQuestions * 90 : null }),
      ]
    );

    const attempt = attemptResult.rows[0];

    await logAnalyticsEvent(user.id, "mock_started", {
      attemptId: attempt.id,
      tier: examTier,
      questionCount: numQuestions,
      timed: isTimed,
      examMode: examMode || "practice",
    });

    res.json({
      attemptId: attempt.id,
      status: "in_progress",
      questions,
      totalQuestions: numQuestions,
      timerState: {
        isTimed,
        timeLimit: isTimed ? numQuestions * 90 : null,
      },
    });
  } catch (e: any) {
    console.error("[MockExams] Start error:", e.message);
    res.status(500).json({ error: "Failed to start mock exam" });
  }
});

router.post("/api/v1/mock-exams/:id/answer", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { id } = req.params;
    const parsed = answerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    }
    const { questionId, selectedAnswer, timeSpent } = parsed.data;

    const attemptResult = await pool.query(
      `SELECT * FROM mock_exam_attempts WHERE id = $1 AND user_id = $2 AND status = 'in_progress'`,
      [id, user.id]
    );

    if (attemptResult.rows.length === 0) {
      return res.status(404).json({ error: "Active mock exam not found" });
    }

    const attempt = attemptResult.rows[0];
    const questionIds = attempt.questions || [];
    if (Array.isArray(questionIds) && questionIds.length > 0 && !questionIds.includes(questionId)) {
      return res.status(400).json({ error: "Question does not belong to this exam session" });
    }

    const answers = attempt.answers || {};

    if (answers[questionId]) {
      return res.status(409).json({ error: "Question already answered" });
    }

    const qResult = await pool.query(
      `SELECT correct_answer FROM exam_questions WHERE id = $1`,
      [questionId]
    );

    if (qResult.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    let correctAnswer = qResult.rows[0].correct_answer;
    if (typeof correctAnswer === "string") {
      try { correctAnswer = JSON.parse(correctAnswer); } catch {}
    }
    const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    if (typeof correctAnswer === "string") {
      const mapped = letterMap[correctAnswer.toUpperCase()];
      if (mapped !== undefined) correctAnswer = [mapped];
    }
    if (typeof correctAnswer === "number") correctAnswer = [correctAnswer];
    if (!Array.isArray(correctAnswer)) correctAnswer = [0];

    const isCorrect = correctAnswer.includes(selectedAnswer);
    answers[questionId] = { selectedAnswer, isCorrect, timeSpent };

    await pool.query(
      `UPDATE mock_exam_attempts SET answers = $1, time_spent = COALESCE(time_spent, 0) + $2 WHERE id = $3`,
      [JSON.stringify(answers), timeSpent || 0, id]
    );

    await recordQuestionHistory(
      user.id, questionId, selectedAnswer, isCorrect,
      "mock_exam", id, undefined, timeSpent
    );

    await logAnalyticsEvent(user.id, "question_answered", {
      questionId, sourceType: "mock_exam", sourceId: id, isCorrect,
    });

    res.json({ recorded: true, questionId });
  } catch (e: any) {
    console.error("[MockExams] Answer error:", e.message);
    res.status(500).json({ error: "Failed to record answer" });
  }
});

router.post("/api/v1/mock-exams/:id/complete", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { id } = req.params;
    const attemptResult = await pool.query(
      `SELECT * FROM mock_exam_attempts WHERE id = $1 AND user_id = $2 AND status = 'in_progress'`,
      [id, user.id]
    );

    if (attemptResult.rows.length === 0) {
      return res.status(404).json({ error: "Active mock exam not found" });
    }

    const attempt = attemptResult.rows[0];
    const answers = attempt.answers || {};
    const questionIds = attempt.questions || [];

    let correctCount = 0;
    let totalAnswered = 0;
    for (const [, val] of Object.entries(answers)) {
      totalAnswered++;
      if ((val as any).isCorrect) correctCount++;
    }

    const score = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

    const report = {
      score,
      totalQuestions: questionIds.length,
      totalAnswered,
      correctCount,
      incorrectCount: totalAnswered - correctCount,
      skippedCount: questionIds.length - totalAnswered,
      passPrediction: score >= 65 ? "likely_pass" : score >= 50 ? "borderline" : "needs_improvement",
    };

    await pool.query(
      `UPDATE mock_exam_attempts SET status = 'completed', score = $1, report = $2, review_unlocked = true, completed_at = NOW()
       WHERE id = $3`,
      [score, JSON.stringify(report), id]
    );

    await logAnalyticsEvent(user.id, "mock_submitted", {
      attemptId: id,
      score,
      totalAnswered,
      correctCount,
    });

    res.json({
      attemptId: id,
      status: "completed",
      score,
      report,
    });
  } catch (e: any) {
    console.error("[MockExams] Complete error:", e.message);
    res.status(500).json({ error: "Failed to complete mock exam" });
  }
});

router.post("/api/v1/mock-exams/:id/save-progress", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { id } = req.params;
    const { answers, flaggedQuestions, currentQuestionIndex, timerState } = req.body;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "answers object is required" });
    }

    const attemptResult = await pool.query(
      `SELECT * FROM mock_exam_attempts WHERE id = $1 AND user_id = $2 AND status = 'in_progress'`,
      [id, user.id]
    );

    if (attemptResult.rows.length === 0) {
      return res.status(404).json({ error: "Active mock exam not found" });
    }

    const attempt = attemptResult.rows[0];
    const existingAnswers = attempt.answers || {};
    const mergedAnswers = { ...existingAnswers, ...answers };

    const newAnswerIds = Object.keys(answers).filter(qId => !existingAnswers[qId]);
    for (const qId of newAnswerIds) {
      const ans = answers[qId];
      if (ans && typeof ans.selectedAnswer === "number") {
        const qResult = await pool.query(
          `SELECT correct_answer FROM exam_questions WHERE id = $1`,
          [qId]
        );
        if (qResult.rows.length > 0) {
          let correctAnswer = qResult.rows[0].correct_answer;
          if (typeof correctAnswer === "string") {
            try { correctAnswer = JSON.parse(correctAnswer); } catch {}
          }
          const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
          if (typeof correctAnswer === "string") {
            const mapped = letterMap[correctAnswer.toUpperCase()];
            if (mapped !== undefined) correctAnswer = [mapped];
          }
          if (typeof correctAnswer === "number") correctAnswer = [correctAnswer];
          if (!Array.isArray(correctAnswer)) correctAnswer = [0];

          const isCorrect = correctAnswer.includes(ans.selectedAnswer);
          mergedAnswers[qId] = { ...ans, isCorrect };

          await recordQuestionHistory(
            user.id, qId, ans.selectedAnswer, isCorrect,
            "mock_exam", id, undefined, ans.timeSpent
          );
        }
      }
    }

    const totalTime = Object.values(mergedAnswers).reduce((s: number, a: any) => s + ((a as any).timeSpent || 0), 0);

    const updateFields: string[] = [
      `answers = $1`,
      `time_spent = $2`,
    ];
    const updateParams: any[] = [JSON.stringify(mergedAnswers), Math.round(totalTime)];
    let pIdx = 3;

    if (flaggedQuestions !== undefined) {
      updateFields.push(`flagged = $${pIdx}`);
      updateParams.push(JSON.stringify(flaggedQuestions));
      pIdx++;
    }

    if (timerState !== undefined) {
      updateFields.push(`timer_state = $${pIdx}`);
      updateParams.push(JSON.stringify(timerState));
      pIdx++;
    }

    updateParams.push(id, user.id);

    await pool.query(
      `UPDATE mock_exam_attempts SET ${updateFields.join(", ")} WHERE id = $${pIdx} AND user_id = $${pIdx + 1}`,
      updateParams
    );

    await logAnalyticsEvent(user.id, "mock_progress_saved", {
      attemptId: id,
      answeredCount: Object.keys(mergedAnswers).length,
      totalQuestions: attempt.total_questions,
      currentQuestionIndex,
    });

    res.json({
      success: true,
      answeredCount: Object.keys(mergedAnswers).length,
      totalQuestions: attempt.total_questions,
    });
  } catch (e: any) {
    console.error("[MockExams] Save progress error:", e.message);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

router.get("/api/v1/mock-exams/history", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const result = await pool.query(
      `SELECT id, tier, total_questions, status, score, time_spent, exam_type, career_type, review_unlocked, started_at, completed_at
       FROM mock_exam_attempts
       WHERE user_id = $1
       ORDER BY started_at DESC
       LIMIT $2`,
      [user.id, limit]
    );

    res.json({
      attempts: result.rows.map((r: any) => snakeToCamel(r)),
    });
  } catch (e: any) {
    console.error("[MockExams] History error:", e.message);
    res.status(500).json({ error: "Failed to get history" });
  }
});

router.get("/api/v1/lessons", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { role, country, exam, category } = req.query;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    let query = `SELECT id, title, slug, type, category, body_system, tier, status, summary, tags
                 FROM content_items WHERE status = 'published' AND type = 'lesson'`;
    const params: any[] = [];
    let idx = 1;

    if (category) {
      query += ` AND category = $${idx}`;
      params.push(category);
      idx++;
    }

    if (role) {
      query += ` AND (tier = $${idx} OR tier = 'free')`;
      params.push(role);
      idx++;
    }

    if (exam) {
      query += ` AND (tags::text ILIKE '%' || $${idx} || '%' OR category ILIKE '%' || $${idx} || '%')`;
      params.push(exam);
      idx++;
    }

    query += ` ORDER BY title ASC LIMIT $${idx} OFFSET $${idx + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    const progressResult = await pool.query(
      `SELECT lesson_id, completed FROM user_progress WHERE user_id = $1`,
      [user.id]
    );
    const progressMap = new Map(progressResult.rows.map((r: any) => [r.lesson_id, r.completed]));

    let bookmarkResult;
    try {
      bookmarkResult = await pool.query(
        `SELECT lesson_id FROM lesson_bookmarks WHERE user_id = $1`,
        [user.id]
      );
    } catch {
      bookmarkResult = { rows: [] };
    }
    const bookmarkedSet = new Set(bookmarkResult.rows.map((r: any) => r.lesson_id));

    const lessons = result.rows.map((row: any) => {
      const entitlement = resolveEntitlementSync(user, "feature", "lessons_free");
      const isLocked = row.tier !== "free" && !checkEntitlement(user, "qbank");

      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        category: row.category,
        bodySystem: row.body_system,
        tier: row.tier,
        summary: row.summary,
        tags: row.tags,
        isLocked,
        completed: progressMap.get(row.slug) === "true" || progressMap.get(row.id) === "true",
        isBookmarked: bookmarkedSet.has(row.id) || bookmarkedSet.has(row.slug),
      };
    });

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM content_items WHERE status = 'published' AND type = 'lesson'`
    );

    res.json({
      lessons,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset,
    });
  } catch (e: any) {
    console.error("[Lessons] List error:", e.message);
    res.status(500).json({ error: "Failed to list lessons" });
  }
});

router.get("/api/v1/lessons/:idOrSlug", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { idOrSlug } = req.params;

    const result = await pool.query(
      `SELECT * FROM content_items WHERE (id = $1 OR slug = $1) AND status = 'published' AND type = 'lesson' LIMIT 1`,
      [idOrSlug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const lesson = result.rows[0];
    const isLocked = lesson.tier !== "free" && !checkEntitlement(user, "qbank");

    const progressResult = await pool.query(
      `SELECT * FROM user_progress WHERE user_id = $1 AND (lesson_id = $2 OR lesson_id = $3) LIMIT 1`,
      [user.id, lesson.id, lesson.slug]
    );

    let isBookmarked = false;
    try {
      const bmResult = await pool.query(
        `SELECT id FROM lesson_bookmarks WHERE user_id = $1 AND (lesson_id = $2 OR lesson_id = $3) LIMIT 1`,
        [user.id, lesson.id, lesson.slug]
      );
      isBookmarked = bmResult.rows.length > 0;
    } catch {}

    await logAnalyticsEvent(user.id, "lesson_viewed", {
      lessonId: lesson.id,
      lessonSlug: lesson.slug,
      lessonTitle: lesson.title,
    });

    res.json({
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      category: lesson.category,
      bodySystem: lesson.body_system,
      tier: lesson.tier,
      summary: lesson.summary,
      content: isLocked ? null : lesson.content,
      tags: lesson.tags,
      isLocked,
      entitlement: {
        hasAccess: !isLocked,
        requiredTier: lesson.tier,
      },
      progress: progressResult.rows[0] ? {
        completed: progressResult.rows[0].completed === "true",
        preTestScore: progressResult.rows[0].pre_test_score,
        postTestScore: progressResult.rows[0].post_test_score,
        lastAccessed: progressResult.rows[0].last_accessed,
      } : null,
      isBookmarked,
    });
  } catch (e: any) {
    console.error("[Lessons] Detail error:", e.message);
    res.status(500).json({ error: "Failed to get lesson" });
  }
});

router.post("/api/v1/lessons/:idOrSlug/progress", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { idOrSlug } = req.params;
    const { completed, preTestScore, postTestScore } = req.body;

    const lessonResult = await pool.query(
      `SELECT id, slug FROM content_items WHERE (id = $1 OR slug = $1) AND type = 'lesson' LIMIT 1`,
      [idOrSlug]
    );

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const lesson = lessonResult.rows[0];
    const lessonId = lesson.slug || lesson.id;

    const existing = await pool.query(
      `SELECT id FROM user_progress WHERE user_id = $1 AND lesson_id = $2`,
      [user.id, lessonId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE user_progress SET completed = $1, pre_test_score = COALESCE($2, pre_test_score), post_test_score = COALESCE($3, post_test_score), last_accessed = NOW()
         WHERE user_id = $4 AND lesson_id = $5`,
        [completed ? "true" : "false", preTestScore, postTestScore, user.id, lessonId]
      );
    } else {
      await pool.query(
        `INSERT INTO user_progress (id, user_id, lesson_id, completed, pre_test_score, post_test_score, last_accessed)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())`,
        [user.id, lessonId, completed ? "true" : "false", preTestScore || null, postTestScore || null]
      );
    }

    if (completed) {
      await logAnalyticsEvent(user.id, "lesson_completed", {
        lessonId: lesson.id,
        lessonSlug: lesson.slug,
      });
    }

    res.json({ success: true, lessonId, completed: !!completed });
  } catch (e: any) {
    console.error("[Lessons] Progress error:", e.message);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

router.post("/api/v1/lessons/:idOrSlug/bookmark", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const { idOrSlug } = req.params;

    const lessonResult = await pool.query(
      `SELECT id, slug FROM content_items WHERE (id = $1 OR slug = $1) AND type = 'lesson' LIMIT 1`,
      [idOrSlug]
    );

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const lesson = lessonResult.rows[0];
    const lessonId = lesson.id;

    const existing = await pool.query(
      `SELECT id FROM lesson_bookmarks WHERE user_id = $1 AND lesson_id = $2`,
      [user.id, lessonId]
    );

    let isBookmarked: boolean;
    if (existing.rows.length > 0) {
      await pool.query(
        `DELETE FROM lesson_bookmarks WHERE user_id = $1 AND lesson_id = $2`,
        [user.id, lessonId]
      );
      isBookmarked = false;
    } else {
      await pool.query(
        `INSERT INTO lesson_bookmarks (id, user_id, lesson_id, created_at)
         VALUES (gen_random_uuid(), $1, $2, NOW())
         ON CONFLICT (user_id, lesson_id) DO NOTHING`,
        [user.id, lessonId]
      );
      isBookmarked = true;
    }

    await logAnalyticsEvent(user.id, "bookmark_toggled", {
      lessonId: lesson.id,
      lessonSlug: lesson.slug,
      isBookmarked,
    });

    res.json({ success: true, isBookmarked });
  } catch (e: any) {
    console.error("[Lessons] Bookmark error:", e.message);
    res.status(500).json({ error: "Failed to toggle bookmark" });
  }
});

router.get("/api/v1/dashboard/summary", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const userId = user.id;
    const userTier = user.tier || "free";
    const isPremium = checkEntitlement(user, "qbank");

    const [
      recentActivityResult,
      activityLogResult,
      inProgressCatResult,
      catSessionsResult,
      inProgressMockResult,
      mockSessionProgressResult,
      lessonProgressResult,
      testBankProgressResult,
      questionHistoryResult,
      streakResult,
      bookmarksResult,
      mockHistoryResult,
      resumeStateResult,
      categoryBreakdownResult,
    ] = await Promise.all([
      pool.query(
        `SELECT event_type, event_data, platform, created_at FROM analytics_events
         WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
        [userId]
      ).catch(() => ({ rows: [] })),

      pool.query(
        `SELECT event_type, entity_id, entity_type, metadata, created_at FROM user_activity_log
         WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
        [userId]
      ).catch(() => ({ rows: [] })),

      pool.query(
        `SELECT id, tier, total_questions, cat_state, started_at FROM mock_exam_attempts
         WHERE user_id = $1 AND exam_type = 'cat' AND status IN ('in_progress', 'paused')
         ORDER BY started_at DESC LIMIT 3`,
        [userId]
      ).catch(() => ({ rows: [] })),

      pool.query(
        `SELECT id, status, start_time, last_active_at, total_questions, correct_count, time_spent_seconds, exam_type, tier, question_sequence
         FROM cat_sessions
         WHERE user_id = $1 AND status IN ('in_progress', 'paused')
         ORDER BY last_active_at DESC LIMIT 3`,
        [userId]
      ).catch(() => ({ rows: [] })),

      pool.query(
        `SELECT id, tier, total_questions, exam_type, started_at FROM mock_exam_attempts
         WHERE user_id = $1 AND exam_type != 'cat' AND status = 'in_progress'
         ORDER BY started_at DESC LIMIT 3`,
        [userId]
      ).catch(() => ({ rows: [] })),

      pool.query(
        `SELECT mesp.attempt_id, mesp.current_question_index, mesp.answered_count, mesp.time_remaining, mesp.status, mesp.last_active_at,
                mea.tier, mea.total_questions, mea.exam_type
         FROM mock_exam_session_progress mesp
         JOIN mock_exam_attempts mea ON mesp.attempt_id = mea.id
         WHERE mesp.user_id = $1 AND mesp.status = 'in_progress'
         ORDER BY mesp.last_active_at DESC LIMIT 3`,
        [userId]
      ).catch(() => ({ rows: [] })),

      pool.query(
        `SELECT lesson_id, completed, completion_percent, last_accessed FROM user_progress
         WHERE user_id = $1 ORDER BY last_accessed DESC LIMIT 20`,
        [userId]
      ).catch(() => ({ rows: [] })),

      pool.query(
        `SELECT tbp.*, tbc.name as collection_name FROM test_bank_progress tbp
         LEFT JOIN test_bank_collections tbc ON tbp.collection_id = tbc.id
         WHERE tbp.user_id = $1 ORDER BY tbp.last_accessed_at DESC LIMIT 10`,
        [userId]
      ).catch(() => ({ rows: [] })),

      pool.query(
        `SELECT source_type, COUNT(*) as total, SUM(CASE WHEN was_correct THEN 1 ELSE 0 END) as correct
         FROM unified_question_history WHERE user_id = $1
         GROUP BY source_type`,
        [userId]
      ).catch(() => ({ rows: [] })),

      pool.query(
        `SELECT * FROM qotd_streaks WHERE user_id = $1`,
        [userId]
      ).catch(() => ({ rows: [] })),

      pool.query(
        `SELECT lb.lesson_id, ci.title, ci.slug FROM lesson_bookmarks lb
         LEFT JOIN content_items ci ON lb.lesson_id = ci.id
         WHERE lb.user_id = $1 ORDER BY lb.created_at DESC LIMIT 5`,
        [userId]
      ).catch(() => ({ rows: [] })),

      pool.query(
        `SELECT id, tier, score, exam_type, completed_at FROM mock_exam_attempts
         WHERE user_id = $1 AND status = 'completed'
         ORDER BY completed_at DESC LIMIT 10`,
        [userId]
      ).catch(() => ({ rows: [] })),

      pool.query(
        `SELECT last_cat_session_id, last_mock_session_id, last_test_bank_id, last_lesson_id, recommended_next_action
         FROM dashboard_resume_state WHERE user_id = $1`,
        [userId]
      ).catch(() => ({ rows: [] })),

      pool.query(
        `SELECT
           COALESCE(mea.tier, 'general') as category,
           COUNT(*) as total,
           SUM(CASE WHEN uqh.was_correct THEN 1 ELSE 0 END) as correct
         FROM unified_question_history uqh
         LEFT JOIN mock_exam_attempts mea ON uqh.source_id = mea.id
         WHERE uqh.user_id = $1
         GROUP BY COALESCE(mea.tier, 'general')`,
        [userId]
      ).catch(() => ({ rows: [] })),
    ]);

    const completedLessons = lessonProgressResult.rows.filter((r: any) => r.completed === true || r.completed === "true").length;
    const totalLessonsAccessed = lessonProgressResult.rows.length;
    const inProgressLessons = lessonProgressResult.rows.filter((r: any) => r.completed !== true && r.completed !== "true").length;

    const lastLesson = lessonProgressResult.rows[0];
    const lastInProgressLesson = lessonProgressResult.rows.find((r: any) => r.completed !== true && r.completed !== "true");
    const lastTestBank = testBankProgressResult.rows[0];

    const questionStats: Record<string, { total: number; correct: number }> = {};
    let totalQuestionsAnswered = 0;
    let totalQuestionsCorrect = 0;
    for (const row of questionHistoryResult.rows) {
      const total = parseInt(row.total) || 0;
      const correct = parseInt(row.correct) || 0;
      questionStats[row.source_type] = { total, correct };
      totalQuestionsAnswered += total;
      totalQuestionsCorrect += correct;
    }
    const overallAccuracy = totalQuestionsAnswered > 0
      ? Math.round((totalQuestionsCorrect / totalQuestionsAnswered) * 100)
      : 0;

    const mockCompleted = mockHistoryResult.rows.length;
    const avgMockScore = mockCompleted > 0
      ? Math.round(mockHistoryResult.rows.reduce((s: number, r: any) => s + (r.score || 0), 0) / mockCompleted)
      : 0;
    const bestMockScore = mockCompleted > 0
      ? Math.max(...mockHistoryResult.rows.map((r: any) => r.score || 0))
      : 0;

    const streak = streakResult.rows[0];
    const resumeState = resumeStateResult.rows[0];

    const mergedActivity: any[] = [];
    for (const r of activityLogResult.rows) {
      mergedActivity.push({
        eventType: r.event_type,
        entityId: r.entity_id,
        entityType: r.entity_type,
        metadata: r.metadata,
        source: "activity_log",
        createdAt: r.created_at,
      });
    }
    for (const r of recentActivityResult.rows) {
      mergedActivity.push({
        eventType: r.event_type,
        eventData: r.event_data,
        platform: r.platform,
        source: "analytics",
        createdAt: r.created_at,
      });
    }
    mergedActivity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const recentActivity = mergedActivity.slice(0, 20);

    const continueWhereYouLeftOff: any[] = [];

    for (const cat of catSessionsResult.rows) {
      continueWhereYouLeftOff.push({
        type: "cat_session",
        id: cat.id,
        title: `CAT Exam${cat.tier ? ` (${cat.tier.toUpperCase()})` : ""}`,
        progress: `${Array.isArray(cat.question_sequence) ? cat.question_sequence.length : (cat.correct_count || 0)}/${cat.total_questions || 0} questions`,
        timeSpent: cat.time_spent_seconds,
        lastAccessed: cat.last_active_at,
        isPaused: cat.status === "paused",
        resumePath: "/mock-exams",
      });
    }

    for (const cat of inProgressCatResult.rows) {
      const catState = cat.cat_state || {};
      const alreadyTracked = continueWhereYouLeftOff.some(
        (item) => item.id === cat.id
      );
      if (!alreadyTracked) {
        continueWhereYouLeftOff.push({
          type: "cat_exam",
          id: cat.id,
          title: `CAT Exam (${cat.tier?.toUpperCase()})`,
          progress: `${(catState.questionsSeen || []).length}/${cat.total_questions} questions`,
          lastAccessed: cat.started_at,
          isPaused: catState.isPaused || false,
          resumePath: "/mock-exams",
        });
      }
    }

    for (const sp of mockSessionProgressResult.rows) {
      continueWhereYouLeftOff.push({
        type: "mock_exam",
        id: sp.attempt_id,
        title: `Mock Exam (${sp.tier?.toUpperCase()})`,
        progress: `Q${(sp.current_question_index || 0) + 1} · ${sp.answered_count || 0} answered`,
        timeRemaining: sp.time_remaining,
        lastAccessed: sp.last_active_at,
        resumePath: "/mock-exams",
      });
    }

    for (const mock of inProgressMockResult.rows) {
      const alreadyTracked = continueWhereYouLeftOff.some((item) => item.id === mock.id);
      if (!alreadyTracked) {
        continueWhereYouLeftOff.push({
          type: "mock_exam",
          id: mock.id,
          title: `Mock Exam (${mock.tier?.toUpperCase()})`,
          lastAccessed: mock.started_at,
          resumePath: "/mock-exams",
        });
      }
    }

    if (lastInProgressLesson) {
      continueWhereYouLeftOff.push({
        type: "lesson",
        id: lastInProgressLesson.lesson_id,
        title: `Continue lesson: ${lastInProgressLesson.lesson_id}`,
        progress: `${lastInProgressLesson.completion_percent || 0}% complete`,
        lastAccessed: lastInProgressLesson.last_accessed,
        completed: false,
        resumePath: `/lessons/${lastInProgressLesson.lesson_id}`,
      });
    } else if (lastLesson && lastLesson.completed !== true && lastLesson.completed !== "true") {
      continueWhereYouLeftOff.push({
        type: "lesson",
        id: lastLesson.lesson_id,
        title: `Continue lesson: ${lastLesson.lesson_id}`,
        lastAccessed: lastLesson.last_accessed,
        completed: false,
        resumePath: `/lessons/${lastLesson.lesson_id}`,
      });
    }

    if (lastTestBank) {
      continueWhereYouLeftOff.push({
        type: "test_bank",
        id: lastTestBank.collection_id,
        title: `Test Bank: ${lastTestBank.collection_name || "Questions"}`,
        progress: `${lastTestBank.questions_attempted || 0} questions attempted`,
        lastAccessed: lastTestBank.last_accessed_at,
        resumePath: "/test-bank",
      });
    }

    continueWhereYouLeftOff.sort((a, b) => {
      const dateA = new Date(a.lastAccessed || 0).getTime();
      const dateB = new Date(b.lastAccessed || 0).getTime();
      return dateB - dateA;
    });

    const weakCategories = categoryBreakdownResult.rows
      .map((r: any) => ({
        category: r.category,
        total: parseInt(r.total) || 0,
        correct: parseInt(r.correct) || 0,
        accuracy: (parseInt(r.total) || 0) > 0
          ? Math.round(((parseInt(r.correct) || 0) / (parseInt(r.total) || 0)) * 100)
          : 0,
      }))
      .filter((c: any) => c.total >= 3)
      .sort((a: any, b: any) => a.accuracy - b.accuracy);

    const isNewUser = totalQuestionsAnswered === 0 && completedLessons === 0 && mockCompleted === 0;

    let recommendedNextAction: { action: string; description: string; path: string; priority: string };

    if (inProgressCatResult.rows.length > 0 || catSessionsResult.rows.length > 0) {
      recommendedNextAction = {
        action: "Resume CAT Exam",
        description: "You have an in-progress CAT exam waiting. Complete it to get your adaptive score.",
        path: "/mock-exams",
        priority: "high",
      };
    } else if (inProgressMockResult.rows.length > 0 || mockSessionProgressResult.rows.length > 0) {
      recommendedNextAction = {
        action: "Complete Mock Exam",
        description: "Finish your in-progress mock exam to see your results.",
        path: "/mock-exams",
        priority: "high",
      };
    } else if (isNewUser) {
      recommendedNextAction = {
        action: "Start Your First Lesson",
        description: "Begin your study journey by exploring a lesson topic.",
        path: "/lessons",
        priority: "medium",
      };
    } else if (completedLessons < 5) {
      recommendedNextAction = {
        action: "Build Your Foundation",
        description: `You've completed ${completedLessons} lesson${completedLessons !== 1 ? "s" : ""}. Study a few more to build a strong foundation.`,
        path: "/lessons",
        priority: "medium",
      };
    } else if (weakCategories.length > 0 && weakCategories[0].accuracy < 50) {
      const weakest = weakCategories[0];
      recommendedNextAction = {
        action: `Focus on ${weakest.category}`,
        description: `Your ${weakest.category} accuracy is ${weakest.accuracy}%. Practice more questions in this area.`,
        path: "/test-bank",
        priority: "high",
      };
    } else if (!isPremium) {
      recommendedNextAction = {
        action: "Upgrade Your Plan",
        description: "Unlock premium practice questions, CAT exams, and full mock exams.",
        path: "/pricing",
        priority: "low",
      };
    } else if (avgMockScore > 0 && avgMockScore < 65) {
      recommendedNextAction = {
        action: "Review Weak Areas",
        description: `Your average mock score is ${avgMockScore}%. Review your weak topics to improve.`,
        path: "/test-bank",
        priority: "high",
      };
    } else if (mockCompleted === 0 && isPremium) {
      recommendedNextAction = {
        action: "Take Your First Mock Exam",
        description: "Test your knowledge with a full-length practice exam.",
        path: "/mock-exams",
        priority: "medium",
      };
    } else if (streak && !streak.last_answer_date) {
      recommendedNextAction = {
        action: "Answer Today's Question",
        description: "Start a daily study streak with the Question of the Day.",
        path: "/question-of-the-day",
        priority: "medium",
      };
    } else {
      recommendedNextAction = {
        action: "Take a Practice Exam",
        description: "Continue building your readiness with another practice session.",
        path: "/mock-exams",
        priority: "medium",
      };
    }

    const lockedSections: string[] = [];
    const unlockedSections: string[] = ["lessons_free", "question_of_the_day", "flashcards_basic"];

    if (isPremium) {
      unlockedSections.push(
        "test_banks", "cat_exams", "mock_exams", "flashcards_unlimited",
        "study_coach", "pass_probability", "adaptive_engine", "reports"
      );
    } else {
      lockedSections.push(
        "test_banks_premium", "cat_exams", "unlimited_mock_exams",
        "study_coach", "pass_probability", "adaptive_engine", "reports"
      );
    }

    const hasNewGrad = checkEntitlement(user, "newgrad");
    const hasCertPrep = checkEntitlement(user, "certification_prep");
    if (hasNewGrad) unlockedSections.push("new_grad_toolkit");
    else lockedSections.push("new_grad_toolkit");
    if (hasCertPrep) unlockedSections.push("certification_prep");
    else lockedSections.push("certification_prep");

    res.set("Cache-Control", "private, max-age=60, stale-while-revalidate=120");

    res.json({
      user: {
        id: userId,
        displayName: user.display_name || user.displayName || user.username,
        tier: userTier,
        role: user.role,
        country: user.country,
        examTrack: user.exam_track || user.examTrack,
        exam: user.exam,
        isPremium,
        studyGoal: user.study_goal || user.studyGoal,
        dailyStudyTime: user.daily_study_time || user.dailyStudyTime,
      },
      isNewUser,
      recentActivity,
      continueWhereYouLeftOff,
      progress: {
        lessons: {
          completed: completedLessons,
          inProgress: inProgressLessons,
          accessed: totalLessonsAccessed,
        },
        testBanks: testBankProgressResult.rows.map((r: any) => ({
          collectionId: r.collection_id,
          collectionName: r.collection_name,
          questionsAttempted: r.questions_attempted,
          questionsCorrect: r.questions_correct,
          completionRate: (r.questions_attempted || 0) > 0
            ? Math.round(((r.questions_correct || 0) / r.questions_attempted) * 100)
            : 0,
        })),
        questionHistory: questionStats,
        overallStats: {
          totalQuestionsAnswered,
          totalQuestionsCorrect,
          overallAccuracy,
        },
        mockExams: {
          completed: mockCompleted,
          avgScore: avgMockScore,
          bestScore: bestMockScore,
          recentScores: mockHistoryResult.rows.map((r: any) => ({
            id: r.id,
            score: r.score,
            examType: r.exam_type,
            completedAt: r.completed_at,
          })),
        },
        weakCategories: weakCategories.slice(0, 5),
      },
      catExamState: {
        inProgress: [
          ...catSessionsResult.rows.map((r: any) => ({
            id: r.id,
            source: "cat_sessions",
            tier: r.tier,
            questionsAnswered: Array.isArray(r.question_sequence) ? r.question_sequence.length : (r.correct_count || 0),
            totalQuestions: r.total_questions || 0,
            timeSpent: r.time_spent_seconds,
            isPaused: r.status === "paused",
            lastActiveAt: r.last_active_at,
            startedAt: r.start_time,
          })),
          ...inProgressCatResult.rows.map((r: any) => ({
            id: r.id,
            source: "mock_exam_attempts",
            tier: r.tier,
            questionsAnswered: ((r.cat_state || {}).questionsSeen || []).length,
            totalQuestions: r.total_questions,
            isPaused: (r.cat_state || {}).isPaused || false,
            startedAt: r.started_at,
          })),
        ],
      },
      mockExamState: {
        inProgress: [
          ...mockSessionProgressResult.rows.map((r: any) => ({
            attemptId: r.attempt_id,
            tier: r.tier,
            totalQuestions: r.total_questions,
            examType: r.exam_type,
            currentQuestionIndex: r.current_question_index,
            answeredCount: r.answered_count,
            timeRemaining: r.time_remaining,
            lastActiveAt: r.last_active_at,
            source: "session_progress",
          })),
          ...inProgressMockResult.rows
            .filter((r: any) => !mockSessionProgressResult.rows.some((sp: any) => sp.attempt_id === r.id))
            .map((r: any) => ({
              attemptId: r.id,
              tier: r.tier,
              totalQuestions: r.total_questions,
              examType: r.exam_type,
              startedAt: r.started_at,
              source: "mock_exam_attempts",
            })),
        ],
      },
      streak: streak ? {
        currentStreak: streak.current_streak,
        longestStreak: streak.longest_streak,
        totalAnswered: streak.total_answered,
        totalCorrect: streak.total_correct,
        lastAnswerDate: streak.last_answer_date,
      } : { currentStreak: 0, longestStreak: 0, totalAnswered: 0, totalCorrect: 0, lastAnswerDate: null },
      bookmarks: bookmarksResult.rows.map((r: any) => ({
        lessonId: r.lesson_id,
        title: r.title,
        slug: r.slug,
      })),
      recommendedNextAction,
      resumeState: resumeState ? {
        lastCatSessionId: resumeState.last_cat_session_id,
        lastMockSessionId: resumeState.last_mock_session_id,
        lastTestBankId: resumeState.last_test_bank_id,
        lastLessonId: resumeState.last_lesson_id,
      } : null,
      sections: {
        locked: lockedSections,
        unlocked: unlockedSections,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    const msg = e?.message || String(e);
    emitStructuredLog(
      {
        level: "error",
        type: "dashboard_summary_failure",
        route: "GET /api/v1/dashboard/summary",
        message: msg,
      },
      "error",
    );
    console.error("[Dashboard] Summary error:", msg);
    res.status(500).json({
      error: "Failed to generate dashboard summary",
      code: "DASHBOARD_SUMMARY_ERROR",
    });
  }
});

router.get("/api/dashboard/summary", (req, res, next) => {
  req.url = "/api/v1/dashboard/summary";
  (router as typeof router & { handle: (req: Request, res: Response, next: NextFunction) => void }).handle(
    req,
    res,
    next,
  );
});

const analyticsEventSchema = z.object({
  eventType: z.string().min(1).max(100),
  eventData: z.record(z.unknown()).optional().default({}),
  sessionId: z.string().max(200).optional(),
  platform: z.enum(["web", "ios", "android"]).optional().default("web"),
});

router.post("/api/v1/analytics/events", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const parsed = analyticsEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    }
    const { eventType, eventData, sessionId, platform } = parsed.data;

    await logAnalyticsEvent(user.id, eventType, eventData, sessionId, platform);
    res.json({ success: true });
  } catch (e: any) {
    console.error("[Analytics] Event error:", e.message);
    res.status(500).json({ error: "Failed to log event" });
  }
});

router.get("/api/v1/question-history", async (req, res) => {
  try {
    const user = await requireAuth(req, res);
    if (!user) return;

    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const sourceType = req.query.sourceType as string;

    let query = `SELECT * FROM unified_question_history WHERE user_id = $1`;
    const params: any[] = [user.id];
    let idx = 2;

    if (sourceType) {
      query += ` AND source_type = $${idx}`;
      params.push(sourceType);
      idx++;
    }

    query += ` ORDER BY answered_at DESC LIMIT $${idx}`;
    params.push(limit);

    const result = await pool.query(query, params);

    res.json({
      history: result.rows.map((r: any) => snakeToCamel(r)),
    });
  } catch (e: any) {
    console.error("[QuestionHistory] Error:", e.message);
    res.status(500).json({ error: "Failed to get question history" });
  }
});

export function registerCrossPlatformApiRoutes(app: any) {
  pool.query(`
    CREATE TABLE IF NOT EXISTS test_bank_collections (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      role TEXT NOT NULL,
      country TEXT NOT NULL,
      exam_type TEXT NOT NULL,
      tier TEXT DEFAULT 'free',
      question_count INTEGER DEFAULT 0,
      categories JSONB DEFAULT '[]'::jsonb,
      metadata JSONB DEFAULT '{}'::jsonb,
      status TEXT DEFAULT 'active',
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS test_bank_collections_role_country_idx ON test_bank_collections(role, country);
  `).catch(() => {});

  pool.query(`
    CREATE TABLE IF NOT EXISTS unified_question_history (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      question_id VARCHAR NOT NULL,
      selected_answer INTEGER,
      was_correct BOOLEAN NOT NULL,
      session_id VARCHAR,
      source_type TEXT NOT NULL,
      source_id VARCHAR,
      time_spent INTEGER,
      answered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS unified_question_history_user_idx ON unified_question_history(user_id);
    CREATE INDEX IF NOT EXISTS unified_question_history_session_idx ON unified_question_history(session_id);
    CREATE INDEX IF NOT EXISTS unified_question_history_source_idx ON unified_question_history(user_id, source_type);
  `).catch(() => {});

  pool.query(`
    CREATE TABLE IF NOT EXISTS lesson_bookmarks (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      lesson_id VARCHAR NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      UNIQUE(user_id, lesson_id)
    );
  `).catch(() => {});

  pool.query(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      event_type TEXT NOT NULL,
      event_data JSONB DEFAULT '{}'::jsonb,
      session_id VARCHAR,
      platform TEXT DEFAULT 'web',
      device_info JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS analytics_events_user_idx ON analytics_events(user_id);
    CREATE INDEX IF NOT EXISTS analytics_events_type_idx ON analytics_events(event_type);
    CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON analytics_events(created_at);
  `).catch(() => {});

  pool.query(`
    CREATE TABLE IF NOT EXISTS test_bank_progress (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      collection_id VARCHAR NOT NULL,
      questions_attempted INTEGER DEFAULT 0,
      questions_correct INTEGER DEFAULT 0,
      last_question_id VARCHAR,
      last_accessed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      UNIQUE(user_id, collection_id)
    );
  `).catch(() => {});

  app.use(router);
}
