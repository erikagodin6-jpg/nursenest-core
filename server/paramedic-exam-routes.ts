import type { Express } from "express";
import { pool } from "./storage";
import { resolveAuthUser } from "./admin-auth";
import { createRateLimiter, abuseEscalationMiddleware, botDetectionMiddleware } from "./abuse-protection";

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = snakeToCamel(value);
  }
  return result;
}

const EXAM_BLUEPRINTS: Record<string, Record<string, { min: number; max: number }>> = {
  nremt: {
    "Airway Management": { min: 0.18, max: 0.22 },
    "Cardiology/ECG": { min: 0.18, max: 0.22 },
    "Trauma Management": { min: 0.14, max: 0.18 },
    "Medical Emergencies": { min: 0.12, max: 0.16 },
    "OB Emergencies": { min: 0.04, max: 0.06 },
    "Pediatric Emergencies": { min: 0.04, max: 0.06 },
    "Operations/EMS Systems": { min: 0.10, max: 0.14 },
    "Pharmacology": { min: 0.06, max: 0.10 },
    "ACLS/PALS Protocols": { min: 0.04, max: 0.06 },
    "Environmental Emergencies": { min: 0.02, max: 0.04 },
  },
  "copr-pcp": {
    "Airway Management": { min: 0.15, max: 0.20 },
    "Trauma Management": { min: 0.15, max: 0.20 },
    "Medical Emergencies": { min: 0.15, max: 0.20 },
    "Operations/EMS Systems": { min: 0.12, max: 0.16 },
    "Pharmacology": { min: 0.10, max: 0.14 },
    "Cardiology/ECG": { min: 0.08, max: 0.12 },
    "Environmental Emergencies": { min: 0.04, max: 0.06 },
    "OB Emergencies": { min: 0.04, max: 0.06 },
    "Pediatric Emergencies": { min: 0.06, max: 0.08 },
    "ACLS/PALS Protocols": { min: 0.02, max: 0.04 },
  },
  "copr-acp": {
    "Cardiology/ECG": { min: 0.20, max: 0.25 },
    "ACLS/PALS Protocols": { min: 0.12, max: 0.16 },
    "Pharmacology": { min: 0.12, max: 0.16 },
    "Airway Management": { min: 0.10, max: 0.14 },
    "Medical Emergencies": { min: 0.10, max: 0.14 },
    "Trauma Management": { min: 0.10, max: 0.14 },
    "Pediatric Emergencies": { min: 0.06, max: 0.08 },
    "OB Emergencies": { min: 0.04, max: 0.06 },
    "Operations/EMS Systems": { min: 0.04, max: 0.06 },
    "Environmental Emergencies": { min: 0.02, max: 0.04 },
  },
};

interface QuestionRow {
  id: string;
  stem: string;
  options: string[];
  correct_answer: number;
  rationale_long: string;
  blueprint_category: string;
  subtopic: string;
  difficulty: number;
}

async function selectBlueprintQuestions(
  examType: string,
  totalQuestions: number,
  excludeIds: string[] = []
): Promise<string[]> {
  const blueprint = EXAM_BLUEPRINTS[examType] || EXAM_BLUEPRINTS["nremt"];
  const selectedIds: string[] = [];

  for (const [category, range] of Object.entries(blueprint)) {
    const targetCount = Math.round(((range.min + range.max) / 2) * totalQuestions);
    if (targetCount <= 0) continue;

    const result = await pool.query(
      `SELECT id FROM allied_questions
       WHERE career_type = 'paramedic' AND blueprint_category = $1
         AND status = 'published' AND id != ALL($2::text[])
       ORDER BY RANDOM() LIMIT $3`,
      [category, [...excludeIds, ...selectedIds], targetCount]
    );
    selectedIds.push(...result.rows.map((r: any) => r.id));
  }

  if (selectedIds.length < totalQuestions) {
    const fill = await pool.query(
      `SELECT id FROM allied_questions
       WHERE career_type = 'paramedic' AND status = 'published'
         AND id != ALL($1::text[])
       ORDER BY RANDOM() LIMIT $2`,
      [selectedIds, totalQuestions - selectedIds.length]
    );
    selectedIds.push(...fill.rows.map((r: any) => r.id));
  }

  for (let i = selectedIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selectedIds[i], selectedIds[j]] = [selectedIds[j], selectedIds[i]];
  }

  return selectedIds.slice(0, totalQuestions);
}

async function selectDrillQuestions(
  topic: string,
  totalQuestions: number
): Promise<string[]> {
  const result = await pool.query(
    `SELECT id FROM allied_questions
     WHERE career_type = 'paramedic' AND blueprint_category = $1
       AND status = 'published'
     ORDER BY RANDOM() LIMIT $2`,
    [topic, totalQuestions]
  );
  return result.rows.map((r: any) => r.id);
}

async function selectAdaptiveQuestion(
  abilityEstimate: number,
  excludeIds: string[]
): Promise<string | null> {
  const targetDiff = Math.round(Math.max(1, Math.min(5, (abilityEstimate + 3) * (5 / 6) + 1)));
  const result = await pool.query(
    `SELECT id FROM allied_questions
     WHERE career_type = 'paramedic' AND status = 'published'
       AND id != ALL($1::text[])
     ORDER BY ABS(difficulty - $2), RANDOM()
     LIMIT 1`,
    [excludeIds, targetDiff]
  );
  return result.rows.length ? result.rows[0].id : null;
}

async function getQuestionsForSession(questionIds: string[]): Promise<any[]> {
  if (!questionIds.length) return [];
  const result = await pool.query(
    `SELECT id, stem, options, correct_answer, rationale_long, blueprint_category, subtopic, difficulty
     FROM allied_questions WHERE id = ANY($1::text[])`,
    [questionIds]
  );
  const byId = new Map(result.rows.map((r: any) => [r.id, r]));
  return questionIds.map(id => {
    const q = byId.get(id);
    if (!q) return null;
    return {
      id: q.id,
      stem: q.stem,
      options: q.options,
      category: q.blueprint_category,
      topic: q.subtopic,
      difficulty: q.difficulty,
    };
  }).filter(Boolean);
}

async function getQuestionsWithAnswers(questionIds: string[]): Promise<any[]> {
  if (!questionIds.length) return [];
  const result = await pool.query(
    `SELECT id, stem, options, correct_answer, rationale_long, blueprint_category, subtopic, difficulty
     FROM allied_questions WHERE id = ANY($1::text[])`,
    [questionIds]
  );
  const byId = new Map(result.rows.map((r: any) => [r.id, r]));
  return questionIds.map(id => {
    const q = byId.get(id);
    if (!q) return null;
    return {
      id: q.id,
      stem: q.stem,
      options: q.options,
      correctIndex: q.correct_answer,
      rationale: q.rationale_long,
      category: q.blueprint_category,
      topic: q.subtopic,
      difficulty: q.difficulty,
    };
  }).filter(Boolean);
}

function computeScore(
  questions: { id: string; correctIndex: number; category: string }[],
  answers: Record<string, { selectedIndex: number; timeSpent: number }>
) {
  let correct = 0;
  const domainStats: Record<string, { correct: number; total: number }> = {};

  for (const q of questions) {
    const ans = answers[q.id];
    const isCorrect = ans && ans.selectedIndex === q.correctIndex;
    if (isCorrect) correct++;

    if (!domainStats[q.category]) domainStats[q.category] = { correct: 0, total: 0 };
    domainStats[q.category].total++;
    if (isCorrect) domainStats[q.category].correct++;
  }

  const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
  const domainBreakdown = Object.entries(domainStats).map(([domain, stats]) => ({
    domain,
    correct: stats.correct,
    total: stats.total,
    percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));

  return { score, correctCount: correct, domainBreakdown };
}

async function computeCorrectRate(
  questionIds: string[],
  answers: { selectedIndex: number }[]
): Promise<number> {
  if (!questionIds.length || !answers.length) return 0;
  const result = await pool.query(
    `SELECT id, correct_answer FROM allied_questions WHERE id = ANY($1::text[])`,
    [questionIds]
  );
  const correctMap = new Map(result.rows.map((r: any) => [r.id, r.correct_answer]));
  let correct = 0;
  const len = Math.min(questionIds.length, answers.length);
  for (let i = 0; i < len; i++) {
    const correctAns = correctMap.get(questionIds[i]);
    if (correctAns !== undefined && answers[i]?.selectedIndex === correctAns) correct++;
  }
  return len > 0 ? correct / len : 0;
}

export function registerParamedicExamRoutes(app: Express) {
  const examStartLimiter = createRateLimiter("exam_start");
  const examInteractionLimiter = createRateLimiter("exam_interaction");

  app.use("/api/paramedic/exam-sessions", abuseEscalationMiddleware, botDetectionMiddleware);

  app.post("/api/paramedic/exam-sessions", examStartLimiter, async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { mode, examType, totalQuestions, timeLimit, drillTopic } = req.body;
      if (!mode || !examType || !totalQuestions) {
        return res.status(400).json({ error: "Missing required fields: mode, examType, totalQuestions" });
      }

      const validModes = ["practice", "exam", "adaptive", "drill"];
      if (!validModes.includes(mode)) {
        return res.status(400).json({ error: `Invalid mode. Must be one of: ${validModes.join(", ")}` });
      }

      if (mode === "drill" && !drillTopic) {
        return res.status(400).json({ error: "Drill mode requires a drillTopic" });
      }

      if (totalQuestions < 1 || totalQuestions > 200) {
        return res.status(400).json({ error: "totalQuestions must be between 1 and 200" });
      }

      let questionIds: string[];

      if (mode === "drill" && drillTopic) {
        questionIds = await selectDrillQuestions(drillTopic, totalQuestions);
      } else if (mode === "adaptive") {
        const firstQ = await selectAdaptiveQuestion(0, []);
        questionIds = firstQ ? [firstQ] : [];
      } else {
        questionIds = await selectBlueprintQuestions(examType, totalQuestions);
      }

      if (!questionIds.length) {
        return res.status(400).json({ error: "No questions available for this configuration" });
      }

      const result = await pool.query(
        `INSERT INTO paramedic_exam_sessions
          (id, user_id, content_domain, mode, exam_type, total_questions, time_limit, status, current_index,
           question_ids, drill_topic, started_at)
         VALUES (gen_random_uuid(), $1, 'paramedic', $2, $3, $4, $5, 'in_progress', 0, $6, $7, NOW())
         RETURNING *`,
        [user.id, mode, examType, totalQuestions, timeLimit || null,
         JSON.stringify(questionIds), drillTopic || null]
      );

      const session = snakeToCamel(result.rows[0]);
      const questions = await getQuestionsForSession(questionIds);
      res.json({ ...session, questions });
    } catch (e: any) {
      console.error("Create paramedic exam session error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/paramedic/exam-sessions/:id", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const result = await pool.query(
        `SELECT * FROM paramedic_exam_sessions WHERE id = $1 AND user_id = $2 AND content_domain = 'paramedic'`,
        [req.params.id, user.id]
      );

      if (!result.rows.length) return res.status(404).json({ error: "Session not found" });
      const session = snakeToCamel(result.rows[0]);
      const questionIds: string[] = result.rows[0].question_ids || [];

      if (session.status === "completed") {
        const questions = await getQuestionsWithAnswers(questionIds);
        res.json({ ...session, questions });
      } else {
        const questions = await getQuestionsForSession(questionIds);
        res.json({ ...session, questions });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/paramedic/exam-sessions/:id/answer", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { questionId, selectedIndex, timeSpent } = req.body;
      if (questionId === undefined || selectedIndex === undefined) {
        return res.status(400).json({ error: "Missing questionId or selectedIndex" });
      }

      const session = await pool.query(
        `SELECT * FROM paramedic_exam_sessions WHERE id = $1 AND user_id = $2 AND status = 'in_progress'`,
        [req.params.id, user.id]
      );
      if (!session.rows.length) return res.status(404).json({ error: "Active session not found" });

      const questionIds: string[] = session.rows[0].question_ids || [];
      if (!questionIds.includes(questionId)) {
        return res.status(400).json({ error: "Question not part of this session" });
      }

      const qResult = await pool.query(
        `SELECT correct_answer, rationale_long FROM allied_questions WHERE id = $1`,
        [questionId]
      );
      if (!qResult.rows.length) return res.status(400).json({ error: "Question not found" });

      const correctIndex = qResult.rows[0].correct_answer;
      const isCorrect = selectedIndex === correctIndex;

      const answers = session.rows[0].answers || {};
      answers[questionId] = { selectedIndex, timeSpent: timeSpent || 0 };

      await pool.query(
        `UPDATE paramedic_exam_sessions SET answers = $1 WHERE id = $2 AND user_id = $3`,
        [JSON.stringify(answers), req.params.id, user.id]
      );

      const mode = session.rows[0].mode;
      const responseData: any = { ok: true };

      if (mode === "practice" || mode === "drill") {
        responseData.isCorrect = isCorrect;
        responseData.correctIndex = correctIndex;
        responseData.rationale = qResult.rows[0].rationale_long;
      } else if (mode === "adaptive") {
        responseData.isCorrect = isCorrect;
      }

      res.json(responseData);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/paramedic/exam-sessions/:id/flag", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { questionId } = req.body;
      if (!questionId) return res.status(400).json({ error: "Missing questionId" });

      const session = await pool.query(
        `SELECT flagged_ids FROM paramedic_exam_sessions WHERE id = $1 AND user_id = $2`,
        [req.params.id, user.id]
      );
      if (!session.rows.length) return res.status(404).json({ error: "Session not found" });

      const flagged: string[] = session.rows[0].flagged_ids || [];
      const idx = flagged.indexOf(questionId);
      if (idx >= 0) flagged.splice(idx, 1);
      else flagged.push(questionId);

      await pool.query(
        `UPDATE paramedic_exam_sessions SET flagged_ids = $1 WHERE id = $2 AND user_id = $3`,
        [JSON.stringify(flagged), req.params.id, user.id]
      );

      res.json({ flaggedIds: flagged });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/paramedic/exam-sessions/:id/navigate", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { currentIndex } = req.body;
      if (currentIndex === undefined) return res.status(400).json({ error: "Missing currentIndex" });

      await pool.query(
        `UPDATE paramedic_exam_sessions SET current_index = $1 WHERE id = $2 AND user_id = $3`,
        [currentIndex, req.params.id, user.id]
      );

      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/paramedic/exam-sessions/:id/next-adaptive", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { abilityEstimate } = req.body;

      const session = await pool.query(
        `SELECT * FROM paramedic_exam_sessions WHERE id = $1 AND user_id = $2 AND status = 'in_progress' AND mode = 'adaptive'`,
        [req.params.id, user.id]
      );
      if (!session.rows.length) return res.status(404).json({ error: "Adaptive session not found" });

      const questionIds: string[] = session.rows[0].question_ids || [];
      const maxQ = session.rows[0].total_questions;

      if (questionIds.length >= maxQ) {
        return res.json({ done: true });
      }

      const sessionAnswers = session.rows[0].answers || {};
      const answeredCount = Object.keys(sessionAnswers).length;
      const ability = abilityEstimate ?? session.rows[0].ability_estimate ?? 0;

      if (answeredCount >= 30) {
        const answerEntries = Object.values(sessionAnswers) as { selectedIndex: number }[];
        const recentAnswers = answerEntries.slice(-10);
        const allAnswers = answerEntries;

        const recentIds = questionIds.slice(-10);
        const allIds = questionIds;

        const recentCorrectRate = await computeCorrectRate(recentIds, recentAnswers);
        const overallCorrectRate = await computeCorrectRate(allIds, allAnswers);
        const rateStable = Math.abs(recentCorrectRate - overallCorrectRate) < 0.1;

        if (rateStable) {
          return res.json({ done: true });
        }
      }

      const nextId = await selectAdaptiveQuestion(ability, questionIds);
      if (!nextId) return res.json({ done: true });

      questionIds.push(nextId);

      await pool.query(
        `UPDATE paramedic_exam_sessions SET question_ids = $1, ability_estimate = $2 WHERE id = $3 AND user_id = $4`,
        [JSON.stringify(questionIds), ability, req.params.id, user.id]
      );

      const questions = await getQuestionsForSession([nextId]);
      res.json({ done: false, question: questions[0], questionIds });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/paramedic/exam-sessions/:id/adaptive", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { abilityEstimate, drillStreak, drillBestStreak } = req.body;

      const updates: string[] = [];
      const values: any[] = [];
      let paramIdx = 1;

      if (abilityEstimate !== undefined) {
        updates.push(`ability_estimate = $${paramIdx++}`);
        values.push(abilityEstimate);
      }
      if (drillStreak !== undefined) {
        updates.push(`drill_streak = $${paramIdx++}`);
        values.push(drillStreak);
      }
      if (drillBestStreak !== undefined) {
        updates.push(`drill_best_streak = $${paramIdx++}`);
        values.push(drillBestStreak);
      }

      if (updates.length === 0) return res.json({ ok: true });

      values.push(req.params.id, user.id);
      await pool.query(
        `UPDATE paramedic_exam_sessions SET ${updates.join(", ")} WHERE id = $${paramIdx++} AND user_id = $${paramIdx}`,
        values
      );

      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/paramedic/exam-sessions/:id/complete", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const session = await pool.query(
        `SELECT * FROM paramedic_exam_sessions WHERE id = $1 AND user_id = $2 AND content_domain = 'paramedic' AND status = 'in_progress'`,
        [req.params.id, user.id]
      );
      if (!session.rows.length) return res.status(404).json({ error: "Session not found" });

      const questionIds: string[] = session.rows[0].question_ids || [];
      const answers: Record<string, { selectedIndex: number; timeSpent: number }> = session.rows[0].answers || {};

      const questions = await getQuestionsWithAnswers(questionIds);
      const { score, correctCount, domainBreakdown } = computeScore(questions, answers);

      const domainScores: Record<string, { correct: number; total: number }> = {};
      for (const d of domainBreakdown) {
        domainScores[d.domain] = { correct: d.correct, total: d.total };
      }

      const missedQuestions = questions
        .filter(q => {
          const ans = answers[q.id];
          return !ans || ans.selectedIndex !== q.correctIndex;
        })
        .map(q => ({
          id: q.id,
          stem: q.stem,
          options: q.options,
          correctIndex: q.correctIndex,
          selectedIndex: answers[q.id]?.selectedIndex ?? -1,
          rationale: q.rationale,
          category: q.category,
        }));

      const totalTimeSeconds = Object.values(answers).reduce((sum, a) => sum + (a.timeSpent || 0), 0);
      const avgTimePerQuestion = questions.length > 0 ? Math.round(totalTimeSeconds / questions.length) : 0;
      const examTypeStr = session.rows[0].exam_type;
      const passingScore = examTypeStr === "copr-acp" ? 65 : 70;
      const passed = score >= passingScore;
      const mode = session.rows[0].mode;

      const report = {
        scorePercent: score,
        passed,
        passingScore,
        totalQuestions: questions.length,
        correctCount,
        domainScores,
        missedQuestions,
        avgTimePerQuestion,
        totalTimeSeconds,
        abilityEstimate: mode === "adaptive" ? (session.rows[0].ability_estimate || 0) : undefined,
        drillStreak: mode === "drill" ? (session.rows[0].drill_best_streak || 0) : undefined,
      };

      const updateResult = await pool.query(
        `UPDATE paramedic_exam_sessions
         SET status = 'completed', score = $1, correct_count = $2, report = $3, completed_at = NOW()
         WHERE id = $4 AND user_id = $5 AND content_domain = 'paramedic'
         RETURNING *`,
        [score, correctCount, JSON.stringify(report), req.params.id, user.id]
      );

      if (!updateResult.rows.length) return res.status(404).json({ error: "Session not found" });
      res.json(snakeToCamel(updateResult.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/paramedic/exam-sessions/:id/results", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const result = await pool.query(
        `SELECT * FROM paramedic_exam_sessions WHERE id = $1 AND user_id = $2 AND content_domain = 'paramedic'`,
        [req.params.id, user.id]
      );

      if (!result.rows.length) return res.status(404).json({ error: "Session not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/paramedic/exam-history", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const result = await pool.query(
        `SELECT id, mode, exam_type, total_questions, score, correct_count, status,
                drill_topic, drill_streak, drill_best_streak, started_at, completed_at
         FROM paramedic_exam_sessions
         WHERE user_id = $1 AND content_domain = 'paramedic'
         ORDER BY started_at DESC
         LIMIT 50`,
        [user.id]
      );

      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/paramedic/exam-categories", async (_req, res) => {
    try {
      const result = await pool.query(
        `SELECT blueprint_category, COUNT(*) as count
         FROM allied_questions
         WHERE career_type = 'paramedic' AND status = 'published'
         GROUP BY blueprint_category
         ORDER BY blueprint_category`
      );
      res.json(result.rows.map((r: any) => ({
        category: r.blueprint_category,
        count: parseInt(r.count),
      })));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
