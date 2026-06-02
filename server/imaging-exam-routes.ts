import type { Express } from "express";
import { pool } from "./storage";
import { resolveAuthUser, requireAdmin } from "./admin-auth";
import { createRateLimiter, abuseEscalationMiddleware, botDetectionMiddleware } from "./abuse-protection";
import {
  adjustDifficulty,
  selectNextQuestion,
  generateExamReport,
  getDefaultWeights,
  EXAM_LENGTH_OPTIONS,
  type ImagingCandidateQuestion,
} from "./imaging-exam-engine";

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

export function registerImagingExamRoutes(app: Express) {
  const examStartLimiter = createRateLimiter("exam_start");
  const examInteractionLimiter = createRateLimiter("exam_interaction");

  app.use("/api/imaging/exam-sessions", abuseEscalationMiddleware, botDetectionMiddleware);

  app.post("/api/imaging/exam-sessions", examStartLimiter, async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { country = "canada", examType, mode = "adaptive", examLength = 50 } = req.body;
      const et = examType || (country === "usa" ? "arrt" : "camrt");

      const validLengths = EXAM_LENGTH_OPTIONS.map(o => o.value);
      const length = validLengths.includes(examLength) ? examLength : 50;
      const timeDef = EXAM_LENGTH_OPTIONS.find(o => o.value === length);
      const timeLimit = timeDef ? timeDef.time * 60 : length * 90;

      let configRow: any = null;
      try {
        const cfgResult = await pool.query(
          `SELECT * FROM imaging_exam_config WHERE country = $1 AND exam_type = $2 LIMIT 1`,
          [country, et]
        );
        configRow = cfgResult.rows[0] ? snakeToCamel(cfgResult.rows[0]) : null;
      } catch {}

      const allowBackNav = configRow?.allowBackNavigation ?? true;
      const gracePeriod = configRow?.gracePeriodMinutes ?? 5;

      const result = await pool.query(
        `INSERT INTO imaging_exam_sessions
          (id, user_id, country, exam_type, mode, exam_length, total_questions, time_limit,
           allow_back_navigation, grace_period_minutes, status, started_at, last_activity_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $5, $6, $7, $8, 'in_progress', NOW(), NOW())
         RETURNING *`,
        [user.id, country, et, mode, length, timeLimit, allowBackNav, gracePeriod]
      );

      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      console.error("Create imaging exam session error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/exam-sessions/:id", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const result = await pool.query(
        `SELECT * FROM imaging_exam_sessions WHERE id = $1 AND user_id = $2`,
        [req.params.id, user.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Session not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/exam-sessions/user/me", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const result = await pool.query(
        `SELECT * FROM imaging_exam_sessions WHERE user_id = $1 ORDER BY started_at DESC LIMIT 50`,
        [user.id]
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/exam-sessions/:id/next-question", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const sessionResult = await pool.query(
        `SELECT * FROM imaging_exam_sessions WHERE id = $1 AND user_id = $2`,
        [req.params.id, user.id]
      );
      if (sessionResult.rows.length === 0) return res.status(404).json({ error: "Session not found" });
      const session = snakeToCamel(sessionResult.rows[0]);

      if (session.status !== "in_progress") {
        return res.status(400).json({ error: "Exam session is not in progress" });
      }

      const answeredIds: string[] = session.questionIds || [];
      if (answeredIds.length >= session.totalQuestions) {
        return res.json({ done: true, message: "All questions answered" });
      }

      let configRow: any = null;
      try {
        const cfgResult = await pool.query(
          `SELECT * FROM imaging_exam_config WHERE country = $1 AND exam_type = $2 LIMIT 1`,
          [session.country, session.examType]
        );
        configRow = cfgResult.rows[0] ? snakeToCamel(cfgResult.rows[0]) : null;
      } catch {}

      const topicWeights = configRow?.topicWeights || getDefaultWeights(session.examType);
      const imageQPct = configRow?.imageQuestionPercentage || 20;
      const sensitivity = configRow?.difficultySensitivity || 0.5;
      const cooldownDays = configRow?.questionReuseCooldownDays || 7;

      const qResult = await pool.query(
        `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer, rationale,
                modality, body_part, category, difficulty, topic
         FROM imaging_questions
         WHERE country = $1 AND status = 'published'`,
        [session.country]
      );

      const recentResult = await pool.query(
        `SELECT question_id, MAX(started_at) as last_seen
         FROM imaging_exam_attempt_questions aq
         JOIN imaging_exam_attempts a ON a.id = aq.attempt_id
         WHERE a.user_id = $1
         GROUP BY question_id`,
        [user.id]
      );
      const recentMap = new Map<string, Date>();
      for (const row of recentResult.rows) {
        recentMap.set(row.question_id, new Date(row.last_seen));
      }

      const candidates: ImagingCandidateQuestion[] = qResult.rows.map((r: any) => ({
        id: r.id,
        difficulty: r.difficulty || 2,
        category: r.category || r.topic || "Other",
        topic: r.topic || r.category || "Other",
        modality: r.modality,
        bodyPart: r.body_part,
        hasImage: false,
        lastSeenByUser: recentMap.get(r.id) || null,
      }));

      const answeredSet = new Set(answeredIds);
      const categoryBreakdown: Record<string, number> = session.categoryBreakdown || {};
      const questionMeta: Array<{ topic: string }> = session.questionMeta || [];
      const recentTopics = questionMeta.map(m => m.topic || "Other");

      const imageQAnswered = (session.questionMeta || []).filter((m: any) => m.hasImage).length;

      const selected = selectNextQuestion(
        candidates,
        session.currentDifficulty || 3,
        categoryBreakdown,
        answeredIds.length,
        answeredSet,
        topicWeights,
        recentTopics,
        imageQPct,
        imageQAnswered,
        cooldownDays
      );

      if (!selected) {
        return res.json({ done: true, message: "No more questions available" });
      }

      const fullQ = qResult.rows.find((r: any) => r.id === selected.id);
      if (!fullQ) return res.json({ done: true });

      const updatedQuestionIds = [...answeredIds];
      if (!updatedQuestionIds.includes(String(selected.id))) {
        updatedQuestionIds.push(String(selected.id));
        await pool.query(
          `UPDATE imaging_exam_sessions SET question_ids = $1, last_activity_at = NOW() WHERE id = $2`,
          [JSON.stringify(updatedQuestionIds), req.params.id]
        );
      }

      const questionData: any = {
        id: fullQ.id,
        question: fullQ.question,
        options: [fullQ.option_a, fullQ.option_b, fullQ.option_c, fullQ.option_d].filter(Boolean),
        questionType: fullQ.question_type || "single_best_answer",
        category: fullQ.category,
        topic: fullQ.topic,
        modality: fullQ.modality,
        bodyPart: fullQ.body_part,
        difficulty: fullQ.difficulty,
        imageUrl: fullQ.image_url || null,
        questionIndex: answeredIds.length,
      };

      if (session.mode === "practice") {
        questionData.rationale = fullQ.rationale;
        questionData.correctAnswer = fullQ.correct_answer;
      }

      res.json({ done: false, question: questionData });
    } catch (e: any) {
      console.error("Next question error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/imaging/exam-sessions/:id/answer", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { questionId, answer, timeSpent = 0 } = req.body;
      if (!questionId || !answer) return res.status(400).json({ error: "questionId and answer required" });

      const sessionResult = await pool.query(
        `SELECT * FROM imaging_exam_sessions WHERE id = $1 AND user_id = $2`,
        [req.params.id, user.id]
      );
      if (sessionResult.rows.length === 0) return res.status(404).json({ error: "Session not found" });
      const session = snakeToCamel(sessionResult.rows[0]);

      if (session.status !== "in_progress") {
        return res.status(400).json({ error: "Session not in progress" });
      }

      const sessionQuestionIds: string[] = session.questionIds || [];
      if (!sessionQuestionIds.includes(String(questionId))) {
        return res.status(400).json({ error: "Question not part of this exam session" });
      }

      const existingAnswers: Record<string, any> = session.answers || {};
      if (existingAnswers[String(questionId)]) {
        return res.status(400).json({ error: "Question already answered" });
      }

      const qResult = await pool.query(
        `SELECT correct_answer, category, topic, difficulty FROM imaging_questions WHERE id = $1`,
        [questionId]
      );
      if (qResult.rows.length === 0) return res.status(404).json({ error: "Question not found" });
      const q = qResult.rows[0];

      const isCorrect = answer.toUpperCase() === q.correct_answer.toUpperCase();

      const questionIds: string[] = [...(session.questionIds || [])];
      if (!questionIds.includes(questionId)) questionIds.push(questionId);

      const answers: Record<string, any> = { ...(session.answers || {}) };
      answers[questionId] = { answer, isCorrect, timeSpent };

      const flaggedIds: string[] = session.flaggedIds || [];

      const questionMeta: any[] = [...(session.questionMeta || [])];
      if (!questionMeta.find((m: any) => m.id === questionId)) {
        questionMeta.push({
          id: questionId,
          category: q.category,
          topic: q.topic,
          difficulty: q.difficulty,
          hasImage: false,
          isCorrect,
          timeSpent,
        });
      }

      const categoryBreakdown: Record<string, number> = { ...(session.categoryBreakdown || {}) };
      const cat = q.category || q.topic || "Other";
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;

      let configRow: any = null;
      try {
        const cfgResult = await pool.query(
          `SELECT * FROM imaging_exam_config WHERE country = $1 AND exam_type = $2 LIMIT 1`,
          [session.country, session.examType]
        );
        configRow = cfgResult.rows[0] ? snakeToCamel(cfgResult.rows[0]) : null;
      } catch {}

      const sensitivity = configRow?.difficultySensitivity || 0.5;
      const newDifficulty = adjustDifficulty(session.currentDifficulty || 3, isCorrect, sensitivity);
      const diffHistory: number[] = [...(session.difficultyHistory || []), newDifficulty];
      const correctCount = (session.correctCount || 0) + (isCorrect ? 1 : 0);
      const totalTime = (session.timeSpent || 0) + timeSpent;

      await pool.query(
        `UPDATE imaging_exam_sessions SET
          question_ids = $1, answers = $2, flagged_ids = $3, question_meta = $4,
          category_breakdown = $5, current_difficulty = $6, difficulty_history = $7,
          correct_count = $8, time_spent = $9, current_index = $10,
          last_activity_at = NOW()
         WHERE id = $11`,
        [
          JSON.stringify(questionIds), JSON.stringify(answers), JSON.stringify(flaggedIds),
          JSON.stringify(questionMeta), JSON.stringify(categoryBreakdown),
          newDifficulty, JSON.stringify(diffHistory), correctCount, totalTime,
          questionIds.length, req.params.id,
        ]
      );

      const responseData: any = {
        isCorrect,
        newDifficulty,
        questionsAnswered: questionIds.length,
        totalQuestions: session.totalQuestions,
      };

      if (session.mode === "practice") {
        const fullQ = await pool.query(`SELECT rationale, correct_answer FROM imaging_questions WHERE id = $1`, [questionId]);
        if (fullQ.rows[0]) {
          responseData.rationale = fullQ.rows[0].rationale;
          responseData.correctAnswer = fullQ.rows[0].correct_answer;
        }
      }

      res.json(responseData);
    } catch (e: any) {
      console.error("Answer error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/imaging/exam-sessions/:id/flag", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { questionId } = req.body;
      const sessionResult = await pool.query(
        `SELECT flagged_ids FROM imaging_exam_sessions WHERE id = $1 AND user_id = $2`,
        [req.params.id, user.id]
      );
      if (sessionResult.rows.length === 0) return res.status(404).json({ error: "Session not found" });

      const flagged: string[] = sessionResult.rows[0].flagged_ids || [];
      const idx = flagged.indexOf(questionId);
      if (idx >= 0) flagged.splice(idx, 1);
      else flagged.push(questionId);

      await pool.query(
        `UPDATE imaging_exam_sessions SET flagged_ids = $1, last_activity_at = NOW() WHERE id = $2`,
        [JSON.stringify(flagged), req.params.id]
      );

      res.json({ flagged });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/imaging/exam-sessions/:id/save", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { timeSpent, currentIndex } = req.body;
      const updates: string[] = ["last_activity_at = NOW()"];
      const params: any[] = [];
      let paramIdx = 1;

      if (timeSpent !== undefined) {
        updates.push(`time_spent = $${paramIdx++}`);
        params.push(timeSpent);
      }
      if (currentIndex !== undefined) {
        updates.push(`current_index = $${paramIdx++}`);
        params.push(currentIndex);
      }

      params.push(req.params.id);
      params.push(user.id);

      await pool.query(
        `UPDATE imaging_exam_sessions SET ${updates.join(", ")} WHERE id = $${paramIdx++} AND user_id = $${paramIdx}`,
        params
      );

      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/imaging/exam-sessions/:id/submit", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const sessionResult = await pool.query(
        `SELECT * FROM imaging_exam_sessions WHERE id = $1 AND user_id = $2`,
        [req.params.id, user.id]
      );
      if (sessionResult.rows.length === 0) return res.status(404).json({ error: "Session not found" });
      const session = snakeToCamel(sessionResult.rows[0]);

      if (session.status !== "in_progress") {
        return res.status(400).json({ error: "Session already completed" });
      }

      const questionMeta: any[] = session.questionMeta || [];
      const answers: Record<string, any> = session.answers || {};
      const totalTimeSpent = req.body.timeSpent || session.timeSpent || 0;
      const allQuestionIds: string[] = session.questionIds || [];

      const answeredIds = new Set(questionMeta.map((m: any) => String(m.id)));
      const unansweredIds = allQuestionIds.filter(id => !answeredIds.has(String(id)));

      let unansweredMeta: any[] = [];
      if (unansweredIds.length > 0) {
        const unansweredResult = await pool.query(
          `SELECT id, category, topic, difficulty FROM imaging_questions WHERE id = ANY($1)`,
          [unansweredIds]
        );
        unansweredMeta = unansweredResult.rows.map(r => ({
          id: r.id,
          category: r.category || r.topic || "Other",
          difficulty: r.difficulty || 3,
          hasImage: false,
          isCorrect: false,
          timeSpent: 0,
        }));
      }

      const allMeta = [...questionMeta, ...unansweredMeta];

      const reportQuestions = allMeta.map((m: any) => ({
        id: m.id,
        category: m.category || "Other",
        difficulty: m.difficulty || 3,
        hasImage: m.hasImage || false,
        userAnswer: answers[m.id]?.answer || null,
        isCorrect: answers[m.id]?.isCorrect || false,
        timeSpent: answers[m.id]?.timeSpent || 0,
      }));

      const report = generateExamReport(
        reportQuestions,
        session.abilityEstimate || 0,
        totalTimeSpent,
        session.country
      );

      await pool.query(
        `UPDATE imaging_exam_sessions SET
          status = 'completed', score = $1, correct_count = $2, time_spent = $3,
          report = $4, completed_at = NOW(), last_activity_at = NOW()
         WHERE id = $5`,
        [report.scorePercent, report.correctCount, totalTimeSpent, JSON.stringify(report), req.params.id]
      );

      res.json({ report });
    } catch (e: any) {
      console.error("Submit error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/exam-sessions/:id/report", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const result = await pool.query(
        `SELECT report, score, correct_count, total_questions, time_spent, country, exam_type, mode, started_at, completed_at
         FROM imaging_exam_sessions WHERE id = $1 AND user_id = $2`,
        [req.params.id, user.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Session not found" });

      const row = snakeToCamel(result.rows[0]);
      res.json(row);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/exam-config/:country/:examType", async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM imaging_exam_config WHERE country = $1 AND exam_type = $2 LIMIT 1`,
        [req.params.country, req.params.examType]
      );
      if (result.rows.length === 0) {
        return res.json({
          country: req.params.country,
          examType: req.params.examType,
          maxExamLength: 200,
          defaultTimePerQuestion: 90,
          allowBackNavigation: true,
          imageQuestionPercentage: 20,
          topicWeights: getDefaultWeights(req.params.examType),
          difficultySensitivity: 0.5,
          questionReuseCooldownDays: 7,
          gracePeriodMinutes: 5,
        });
      }
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/imaging/exam-config/:country/:examType", async (req, res) => {
    try {
      const admin = await requireAdmin(req as any, res);
      if (!admin) return;

      const { country, examType } = req.params;
      const {
        maxExamLength, defaultTimePerQuestion, allowBackNavigation,
        imageQuestionPercentage, topicWeights, difficultySensitivity,
        questionReuseCooldownDays, gracePeriodMinutes
      } = req.body;

      const existing = await pool.query(
        `SELECT id FROM imaging_exam_config WHERE country = $1 AND exam_type = $2`,
        [country, examType]
      );

      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE imaging_exam_config SET
            max_exam_length = COALESCE($1, max_exam_length),
            default_time_per_question = COALESCE($2, default_time_per_question),
            allow_back_navigation = COALESCE($3, allow_back_navigation),
            image_question_percentage = COALESCE($4, image_question_percentage),
            topic_weights = COALESCE($5, topic_weights),
            difficulty_sensitivity = COALESCE($6, difficulty_sensitivity),
            question_reuse_cooldown_days = COALESCE($7, question_reuse_cooldown_days),
            grace_period_minutes = COALESCE($8, grace_period_minutes),
            updated_at = NOW()
           WHERE country = $9 AND exam_type = $10`,
          [maxExamLength, defaultTimePerQuestion, allowBackNavigation,
           imageQuestionPercentage, topicWeights ? JSON.stringify(topicWeights) : null,
           difficultySensitivity, questionReuseCooldownDays, gracePeriodMinutes,
           country, examType]
        );
      } else {
        await pool.query(
          `INSERT INTO imaging_exam_config
            (id, country, exam_type, max_exam_length, default_time_per_question,
             allow_back_navigation, image_question_percentage, topic_weights,
             difficulty_sensitivity, question_reuse_cooldown_days, grace_period_minutes, updated_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
          [country, examType, maxExamLength || 200, defaultTimePerQuestion || 90,
           allowBackNavigation ?? true, imageQuestionPercentage || 20,
           JSON.stringify(topicWeights || getDefaultWeights(examType)),
           difficultySensitivity || 0.5, questionReuseCooldownDays || 7,
           gracePeriodMinutes || 5]
        );
      }

      const result = await pool.query(
        `SELECT * FROM imaging_exam_config WHERE country = $1 AND exam_type = $2`,
        [country, examType]
      );
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/exam-sessions/:id/resume", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const result = await pool.query(
        `SELECT * FROM imaging_exam_sessions WHERE id = $1 AND user_id = $2 AND status = 'in_progress'`,
        [req.params.id, user.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "No active session found" });

      const session = snakeToCamel(result.rows[0]);

      if (session.mode === "mock" && session.gracePeriodMinutes) {
        const lastActivity = new Date(session.lastActivityAt).getTime();
        const elapsed = (Date.now() - lastActivity) / 60000;
        if (elapsed > session.gracePeriodMinutes) {
          await pool.query(
            `UPDATE imaging_exam_sessions SET status = 'expired' WHERE id = $1`,
            [req.params.id]
          );
          return res.status(410).json({ error: "Session expired due to inactivity" });
        }
      }

      await pool.query(
        `UPDATE imaging_exam_sessions SET last_activity_at = NOW() WHERE id = $1`,
        [req.params.id]
      );

      res.json(session);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
