import type { Express, Request } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

type TrialSessionRow = {
  id: string;
  user_id?: string | null;
  exam_key: string;
  tier: string;
  status: string;
  total_questions: number;
  questions_answered: number;
  current_index: number;
  questions?: any[] | string | null;
  answers?: Record<string, any> | string | null;
  report?: Record<string, any> | string | null;
  readiness_level?: string | null;
  difficulty_estimate?: number | null;
  completion_time_seconds?: number | null;
  timer_enabled?: boolean | null;
  expires_at?: string | Date | null;
  started_at?: string | Date | null;
  completed_at?: string | Date | null;
};

const MAX_TRIAL_QUESTIONS = 50;
const MAX_SAVE_QUESTIONS_PAYLOAD = 100;

function getClientIp(req: Request): string {
  return String(req.headers["x-forwarded-for"] || req.ip || "unknown")
    .split(",")[0]
    .trim();
}

function mapExamKeyToTier(examKey: string): string {
  const key = examKey.toLowerCase();
  if (key === "rex-pn" || key === "nclex-pn") return "rpn";
  if (key === "nclex-rn") return "rn";
  if (key.startsWith("np-") || key === "aanp" || key === "ancc") return "np";
  return "rpn";
}

function safeParseJson<T>(value: unknown, fallback: T): T {
  if (!value) return fallback;

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error("[Trial] JSON parse failed:", error);
      return fallback;
    }
  }

  return value as T;
}

function normalizeQuestionArray(value: unknown): any[] {
  const parsed = safeParseJson<any[]>(value, []);
  return Array.isArray(parsed) ? parsed : [];
}

function normalizeAnswerMap(value: unknown): Record<string, any> {
  const parsed = safeParseJson<Record<string, any>>(value, {});
  return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
}

function normalizeReport(value: unknown): Record<string, any> | null {
  const parsed = safeParseJson<Record<string, any> | null>(value, null);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  return parsed;
}

function isExpired(expiresAt: unknown): boolean {
  if (!expiresAt) return false;
  const dt = new Date(expiresAt as string | Date);
  return !Number.isNaN(dt.getTime()) && dt < new Date();
}

function buildExpiredSessionResponse(s: TrialSessionRow) {
  return {
    id: s.id,
    examKey: s.exam_key,
    tier: s.tier,
    status: "expired",
    totalQuestions: s.total_questions,
    questionsAnswered: s.questions_answered,
    currentIndex: s.current_index,
    timerEnabled: s.timer_enabled,
    expiresAt: s.expires_at,
    startedAt: s.started_at,
  };
}

export function setupTrialRoutes(app: Express): void {
  app.post("/api/trial/start", async (req, res) => {
    try {
      const { examKey, timerEnabled, deviceFingerprint, userId } = req.body || {};

      if (!examKey || typeof examKey !== "string") {
        return res.status(400).json({ error: "examKey is required" });
      }

      const ip = getClientIp(req);
      const tier = mapExamKeyToTier(examKey);

      const abuseCheck = await pool.query(
        `SELECT id
         FROM trial_sessions
         WHERE exam_key = $1
           AND status = 'completed'
           AND (ip_address = $2 OR ($3::text IS NOT NULL AND device_fingerprint = $3))
           AND started_at > NOW() - INTERVAL '30 days'
         LIMIT 1`,
        [examKey, ip, deviceFingerprint || null]
      );

      if (abuseCheck.rows.length > 0) {
        return res.status(409).json({
          error: "Trial already used for this exam",
          message: "You've already taken a trial for this exam. Upgrade to unlock unlimited practice.",
        });
      }

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const result = await pool.query(
        `INSERT INTO trial_sessions
          (exam_key, tier, status, total_questions, user_id, ip_address, device_fingerprint, timer_enabled, expires_at)
         VALUES
          ($1, $2, 'started', $3, $4, $5, $6, $7, $8)
         RETURNING id, exam_key, tier, total_questions, expires_at`,
        [
          examKey,
          tier,
          MAX_TRIAL_QUESTIONS,
          userId || null,
          ip,
          deviceFingerprint || null,
          Boolean(timerEnabled),
          expiresAt,
        ]
      );

      const session = result.rows[0];

      res.json({
        sessionId: session.id,
        examKey: session.exam_key,
        tier: session.tier,
        totalQuestions: session.total_questions,
        expiresAt: session.expires_at,
      });
    } catch (err) {
      console.error("[Trial] Start error:", err);
      res.status(500).json({ error: "Failed to start trial session" });
    }
  });

  app.post("/api/trial/:sessionId/save-questions", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { questions } = req.body || {};

      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: "questions array is required" });
      }

      if (questions.length > MAX_SAVE_QUESTIONS_PAYLOAD) {
        return res.status(400).json({
          error: `Too many questions submitted. Maximum allowed is ${MAX_SAVE_QUESTIONS_PAYLOAD}.`,
        });
      }

      const check = await pool.query(
        "SELECT id, status FROM trial_sessions WHERE id = $1",
        [sessionId]
      );

      if (!check.rows[0]) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (check.rows[0].status !== "started") {
        return res.status(400).json({ error: "Questions already saved for this session" });
      }

      await pool.query(
        `UPDATE trial_sessions
         SET questions = $1, status = 'in_progress'
         WHERE id = $2`,
        [JSON.stringify(questions), sessionId]
      );

      res.json({
        success: true,
        questionsCount: questions.length,
      });
    } catch (err) {
      console.error("[Trial] Save questions error:", err);
      res.status(500).json({ error: "Failed to save questions" });
    }
  });

  app.post("/api/trial/:sessionId/submit-answer", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { questionIndex, selectedAnswer, timeSpent } = req.body || {};

      if (typeof questionIndex !== "number" || typeof selectedAnswer === "undefined") {
        return res.status(400).json({
          error: "questionIndex (number) and selectedAnswer are required",
        });
      }

      const sessionResult = await pool.query(
        `SELECT id, status, questions, answers, questions_answered, total_questions
         FROM trial_sessions
         WHERE id = $1`,
        [sessionId]
      );

      if (!sessionResult.rows[0]) {
        return res.status(404).json({ error: "Session not found" });
      }

      const s = sessionResult.rows[0] as TrialSessionRow;

      if (s.status !== "in_progress") {
        return res.status(400).json({ error: "Session is not in progress" });
      }

      const questions = normalizeQuestionArray(s.questions);
      const answers = normalizeAnswerMap(s.answers);

      if (questionIndex < 0 || questionIndex >= questions.length) {
        return res.status(400).json({ error: "Invalid question index" });
      }

      const question = questions[questionIndex];
      const isCorrect = Boolean(question && selectedAnswer === question.correct);

      answers[String(questionIndex)] = {
        selected: selectedAnswer,
        timeSpent: typeof timeSpent === "number" ? timeSpent : 0,
        correct: isCorrect,
      };

      const answeredCount = Object.keys(answers).length;
      const newIndex = Math.min(questionIndex + 1, s.total_questions || questions.length);

      await pool.query(
        `UPDATE trial_sessions
         SET answers = $1,
             questions_answered = $2,
             current_index = $3
         WHERE id = $4`,
        [
          JSON.stringify(answers),
          answeredCount,
          newIndex,
          sessionId,
        ]
      );

      res.json({
        questionsAnswered: answeredCount,
        totalQuestions: s.total_questions,
        currentIndex: newIndex,
      });
    } catch (err) {
      console.error("[Trial] Submit answer error:", err);
      res.status(500).json({ error: "Failed to submit answer" });
    }
  });

  app.post("/api/trial/:sessionId/complete", async (req, res) => {
    try {
      const { sessionId } = req.params;

      const sessionResult = await pool.query(
        "SELECT * FROM trial_sessions WHERE id = $1",
        [sessionId]
      );

      if (!sessionResult.rows[0]) {
        return res.status(404).json({ error: "Session not found" });
      }

      const s = sessionResult.rows[0] as TrialSessionRow;

      if (s.status === "completed") {
        return res.json(normalizeReport(s.report) || {});
      }

      const questions = normalizeQuestionArray(s.questions);
      const answers = normalizeAnswerMap(s.answers);

      let totalCorrect = 0;
      let totalIncorrect = 0;
      let totalTimeSpent = 0;
      let fastestTime = Infinity;
      let slowestTime = 0;

      const domainCorrect: Record<string, number> = {};
      const domainTotal: Record<string, number> = {};

      for (const [idx, answer] of Object.entries(answers)) {
        const questionIndex = Number.parseInt(idx, 10);
        const q = questions[questionIndex];
        const bodySystem = q?.bodySystem || "General";

        if (!domainTotal[bodySystem]) domainTotal[bodySystem] = 0;
        if (!domainCorrect[bodySystem]) domainCorrect[bodySystem] = 0;

        domainTotal[bodySystem]++;

        if (answer?.correct) {
          totalCorrect++;
          domainCorrect[bodySystem]++;
        } else {
          totalIncorrect++;
        }

        const t = typeof answer?.timeSpent === "number" ? answer.timeSpent : 0;
        totalTimeSpent += t;

        if (t > 0 && t < fastestTime) fastestTime = t;
        if (t > slowestTime) slowestTime = t;
      }

      if (fastestTime === Infinity) fastestTime = 0;

      const total = totalCorrect + totalIncorrect;
      const score = total > 0 ? totalCorrect / total : 0;
      const percentage = Math.round(score * 100);

      const domainScores: Record<
        string,
        { correct: number; total: number; percentage: number }
      > = {};

      const weakDomains: string[] = [];
      const strongDomains: string[] = [];

      for (const domain of Object.keys(domainTotal)) {
        const correct = domainCorrect[domain] || 0;
        const domainQuestionTotal = domainTotal[domain];
        const pct =
          domainQuestionTotal > 0
            ? Math.round((correct / domainQuestionTotal) * 100)
            : 0;

        domainScores[domain] = {
          correct,
          total: domainQuestionTotal,
          percentage: pct,
        };

        if (pct < 60) weakDomains.push(domain);
        if (pct >= 70) strongDomains.push(domain);
      }

      let difficultyEstimate: number;
      if (score > 0.8) difficultyEstimate = 4;
      else if (score > 0.6) difficultyEstimate = 3;
      else if (score > 0.4) difficultyEstimate = 2;
      else difficultyEstimate = 1;

      let readinessLevel: string;
      if (score >= 0.75) readinessLevel = "Exam Ready";
      else if (score >= 0.55) readinessLevel = "Moderate";
      else if (score >= 0.4) readinessLevel = "Borderline";
      else readinessLevel = "Very Low";

      const avgTimePerQuestion = total > 0 ? Math.round(totalTimeSpent / total) : 0;

      const report = {
        score: totalCorrect,
        percentage,
        domainScores,
        readinessLevel,
        difficultyEstimate,
        totalCorrect,
        totalIncorrect,
        totalQuestions: total,
        avgTimePerQuestion,
        fastestQuestion: fastestTime,
        slowestQuestion: slowestTime,
        completionTimeSeconds: totalTimeSpent,
        weakDomains,
        strongDomains,
      };

      await pool.query(
        `UPDATE trial_sessions
         SET report = $1,
             readiness_level = $2,
             difficulty_estimate = $3,
             completion_time_seconds = $4,
             status = 'completed',
             completed_at = NOW(),
             domain_scores = $5
         WHERE id = $6`,
        [
          JSON.stringify(report),
          readinessLevel,
          difficultyEstimate,
          totalTimeSpent,
          JSON.stringify(domainScores),
          sessionId,
        ]
      );

      res.json(report);
    } catch (err) {
      console.error("[Trial] Complete error:", err);
      res.status(500).json({ error: "Failed to complete trial session" });
    }
  });

  app.get("/api/trial/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;

      const result = await pool.query(
        "SELECT * FROM trial_sessions WHERE id = $1",
        [sessionId]
      );

      if (!result.rows[0]) {
        return res.status(404).json({ error: "Session not found" });
      }

      const s = result.rows[0] as TrialSessionRow;

      if (isExpired(s.expires_at) && s.status !== "completed") {
        return res.json(buildExpiredSessionResponse(s));
      }

      const questions = normalizeQuestionArray(s.questions);
      const answers = normalizeAnswerMap(s.answers);
      const report = normalizeReport(s.report);

      res.json({
        id: s.id,
        userId: s.user_id,
        examKey: s.exam_key,
        tier: s.tier,
        status: s.status,
        totalQuestions: s.total_questions,
        questionsAnswered: s.questions_answered,
        currentIndex: s.current_index,
        questions,
        answers,
        report,
        readinessLevel: s.readiness_level,
        difficultyEstimate: s.difficulty_estimate,
        completionTimeSeconds: s.completion_time_seconds,
        timerEnabled: s.timer_enabled,
        expiresAt: s.expires_at,
        startedAt: s.started_at,
        completedAt: s.completed_at,
      });
    } catch (err) {
      console.error("[Trial] Get session error:", err);
      res.status(500).json({ error: "Failed to get trial session" });
    }
  });

  app.get("/api/admin/trial/analytics", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const statsResult = await pool.query(`
        SELECT
          COUNT(*)::int AS total_trials,
          COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_trials,
          ROUND(
            AVG(
              CASE
                WHEN status = 'completed' AND report IS NOT NULL
                THEN (report->>'percentage')::numeric
                ELSE NULL
              END
            ),
            1
          ) AS average_score,
          COUNT(*) FILTER (WHERE readiness_level = 'Very Low')::int AS very_low,
          COUNT(*) FILTER (WHERE readiness_level = 'Borderline')::int AS borderline,
          COUNT(*) FILTER (WHERE readiness_level = 'Moderate')::int AS moderate,
          COUNT(*) FILTER (WHERE readiness_level = 'Exam Ready')::int AS exam_ready
        FROM trial_sessions
      `);

      const stats = statsResult.rows[0] || {};

      const examBreakdownResult = await pool.query(`
        SELECT
          exam_key,
          COUNT(*)::int AS count,
          COUNT(*) FILTER (WHERE status = 'completed')::int AS completed
        FROM trial_sessions
        GROUP BY exam_key
        ORDER BY count DESC
      `);

      const recentResult = await pool.query(`
        SELECT
          id,
          exam_key,
          tier,
          status,
          readiness_level,
          difficulty_estimate,
          questions_answered,
          total_questions,
          completion_time_seconds,
          started_at,
          completed_at
        FROM trial_sessions
        ORDER BY created_at DESC
        LIMIT 20
      `);

      const completedTrials = stats.completed_trials || 0;

      const readinessDistribution = {
        veryLow: stats.very_low || 0,
        borderline: stats.borderline || 0,
        moderate: stats.moderate || 0,
        examReady: stats.exam_ready || 0,
      };

      const averageReadiness =
        completedTrials > 0
          ? Math.round(
              (
                (readinessDistribution.veryLow * 1 +
                  readinessDistribution.borderline * 2 +
                  readinessDistribution.moderate * 3 +
                  readinessDistribution.examReady * 4) /
                completedTrials
              ) * 10
            ) / 10
          : 0;

      const examKeyBreakdown: Record<string, { total: number; completed: number }> = {};

      for (const row of examBreakdownResult.rows) {
        examKeyBreakdown[row.exam_key] = {
          total: row.count,
          completed: row.completed,
        };
      }

      res.json({
        totalTrials: stats.total_trials || 0,
        completedTrials,
        averageScore: stats.average_score ? Number(stats.average_score) : 0,
        averageReadiness,
        conversionRate: 0,
        readinessDistribution,
        examKeyBreakdown,
        recentTrials: recentResult.rows.map((r: any) => ({
          id: r.id,
          examKey: r.exam_key,
          tier: r.tier,
          status: r.status,
          readinessLevel: r.readiness_level,
          difficultyEstimate: r.difficulty_estimate,
          questionsAnswered: r.questions_answered,
          totalQuestions: r.total_questions,
          completionTimeSeconds: r.completion_time_seconds,
          startedAt: r.started_at,
          completedAt: r.completed_at,
        })),
      });
    } catch (err) {
      console.error("[Trial] Analytics error:", err);
      res.status(500).json({ error: "Failed to get trial analytics" });
    }
  });
}