import type { Express } from "express";
import { pool } from "./storage";
import { resolveAuthUser, requireAnyPaidTier } from "./admin-auth";
import { requireEntitlement, isActiveTester } from "./entitlements";
import {
  allowedNursingExamQuestionTiersForUser,
  practiceSessionIncludeAlliedPool,
  practiceSessionIncludeNursingPool,
} from "./paywall-tier-rules";
import { createRateLimiter, abuseEscalationMiddleware, botDetectionMiddleware, antiScrapingHeaders } from "./abuse-protection";
import {
  updateAbilityEstimate,
  createInitialAbility,
  selectNextQuestion,
  type QuestionCandidate,
} from "./mlt-adaptive-engine";
import { DEFAULT_CAT_PARAMS } from "../shared/mlt-exam-types";
import { premiumDegradationMiddleware, getDegradation, attachDegradationToResponse, logDegradedAccess } from "./premium-degradation";

function getMemoryAwareLimit(requestedLimit: number, maxLimit: number): number {
  let limitMB = 0;
  try { const mm = require("./memory-monitor"); if (typeof mm.getDetectedMemoryLimitMB === "function") limitMB = mm.getDetectedMemoryLimitMB(); } catch {}
  if (limitMB <= 0) limitMB = 2048;
  const rssMB = process.memoryUsage().rss / (1024 * 1024);
  const cap = rssMB > limitMB * 0.85 ? Math.ceil(maxLimit * 0.5) : rssMB > limitMB * 0.75 ? Math.ceil(maxLimit * 0.75) : maxLimit;
  return Math.max(1, Math.min(requestedLimit, cap));
}

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

const STREAK_MILESTONES: Record<number, string> = {
  3: "3-day streak! You're building momentum!",
  5: "5 days strong! Consistency is key to exam success!",
  7: "One week streak! You're on fire!",
  14: "Two weeks of daily study! Your dedication is paying off!",
  30: "30-day streak! You're an unstoppable study machine!",
  60: "60-day streak! Elite-level commitment!",
  90: "90-day streak! You've made studying a lifestyle!",
};

function getStreakMotivation(streak: number): string {
  if (STREAK_MILESTONES[streak]) return STREAK_MILESTONES[streak];
  if (streak >= 90) return `${streak}-day streak! Incredible dedication!`;
  if (streak >= 30) return `${streak}-day streak! Keep going strong!`;
  if (streak >= 7) return `${streak}-day streak! Great consistency!`;
  if (streak >= 3) return `${streak}-day streak! Nice work!`;
  if (streak === 1) return "Great start! Come back tomorrow to build your streak!";
  return "Start studying today to begin your streak!";
}

async function updateStudyStreak(userId: string): Promise<{ currentStreak: number; longestStreak: number; motivation: string }> {
  const today = new Date().toISOString().split("T")[0];

  const profileResult = await pool.query(
    `SELECT current_streak, longest_streak, last_study_date FROM student_study_profiles WHERE user_id = $1`,
    [userId]
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let lastStudyDate: string | null = null;

  if (profileResult.rows.length > 0) {
    const p = profileResult.rows[0];
    currentStreak = p.current_streak || 0;
    longestStreak = p.longest_streak || 0;
    lastStudyDate = p.last_study_date;
  }

  if (lastStudyDate === today) {
    return { currentStreak, longestStreak, motivation: getStreakMotivation(currentStreak) };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastStudyDate === yesterdayStr) {
    currentStreak += 1;
  } else {
    currentStreak = 1;
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  if (profileResult.rows.length > 0) {
    await pool.query(
      `UPDATE student_study_profiles SET current_streak = $1, longest_streak = $2, last_study_date = $3, updated_at = NOW() WHERE user_id = $4`,
      [currentStreak, longestStreak, today, userId]
    );
  } else {
    await pool.query(
      `INSERT INTO student_study_profiles (id, user_id, current_streak, longest_streak, last_study_date, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())`,
      [userId, currentStreak, longestStreak, today]
    );
  }

  await pool.query(
    `INSERT INTO user_stats (id, user_id, study_streak, last_study_date, updated_at)
     VALUES (gen_random_uuid(), $1, $2, $3, NOW())
     ON CONFLICT (user_id) DO UPDATE SET study_streak = $2, last_study_date = $3, updated_at = NOW()`,
    [userId, currentStreak, today]
  );

  return { currentStreak, longestStreak, motivation: getStreakMotivation(currentStreak) };
}

export function registerPremiumStudyRoutes(app: Express) {
  const examStartLimiter = createRateLimiter("exam_start");
  const examInteractionLimiter = createRateLimiter("exam_interaction");
  const contentBrowseLimiter = createRateLimiter("content_browse");

  const premiumDegMiddleware = premiumDegradationMiddleware();
  const autoAttachDegradation = (req: any, res: any, next: any) => {
    premiumDegMiddleware(req, res, () => {
      attachDegradationToResponse(res, req);
      next();
    });
  };

  app.use("/api/practice-sessions", abuseEscalationMiddleware, botDetectionMiddleware, autoAttachDegradation);
  app.use("/api/adaptive", abuseEscalationMiddleware, botDetectionMiddleware, autoAttachDegradation);
  app.use("/api/bookmarks", abuseEscalationMiddleware, botDetectionMiddleware, contentBrowseLimiter, autoAttachDegradation);
  app.use("/api/exam-readiness-enhanced", autoAttachDegradation);
  app.use("/api/weak-areas-enhanced", autoAttachDegradation);
  app.use("/api/mock-exams", autoAttachDegradation);

  // ─── Question Bookmark API ───

  app.post("/api/bookmarks/:questionId", requireAnyPaidTier(), async (req: any, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { questionId } = req.params;
      const { questionSource } = req.body;

      if (!questionSource || !["exam_questions", "allied_questions"].includes(questionSource)) {
        return res.status(400).json({ error: "questionSource must be 'exam_questions' or 'allied_questions'" });
      }

      const existing = await pool.query(
        `SELECT id FROM question_bookmarks WHERE user_id = $1 AND question_id = $2 AND question_source = $3`,
        [user.id, questionId, questionSource]
      );

      if (existing.rows.length > 0) {
        return res.json({ bookmarked: true, id: existing.rows[0].id });
      }

      const result = await pool.query(
        `INSERT INTO question_bookmarks (id, user_id, question_id, question_source, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, NOW()) RETURNING *`,
        [user.id, questionId, questionSource]
      );

      res.json({ bookmarked: true, ...snakeToCamel(result.rows[0]) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/bookmarks/:questionId", requireAnyPaidTier(), async (req: any, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { questionId } = req.params;
      const questionSource = req.query.questionSource || req.body?.questionSource;

      let query = `DELETE FROM question_bookmarks WHERE user_id = $1 AND question_id = $2`;
      const params: any[] = [user.id, questionId];

      if (questionSource) {
        query += ` AND question_source = $3`;
        params.push(questionSource);
      }

      await pool.query(query, params);
      res.json({ bookmarked: false });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/bookmarks", requireAnyPaidTier(), async (req: any, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { profession, topic, difficulty, source } = req.query;
      let bookmarkQuery = `SELECT qb.* FROM question_bookmarks qb WHERE qb.user_id = $1`;
      const params: any[] = [user.id];
      let idx = 2;

      if (source) {
        bookmarkQuery += ` AND qb.question_source = $${idx++}`;
        params.push(source);
      }

      bookmarkQuery += ` ORDER BY qb.created_at DESC`;

      const bookmarks = await pool.query(bookmarkQuery, params);
      const results: any[] = [];

      const examIds = bookmarks.rows.filter((bm: any) => bm.question_source === "exam_questions").map((bm: any) => bm.question_id);
      const alliedIds = bookmarks.rows.filter((bm: any) => bm.question_source === "allied_questions").map((bm: any) => bm.question_id);

      const questionMap = new Map<string, any>();

      if (examIds.length > 0) {
        const eq = await pool.query(
          `SELECT id, stem, options, body_system, topic, difficulty, question_type, career_type, subtopic, blueprint_category
           FROM exam_questions WHERE id = ANY($1)`,
          [examIds]
        );
        for (const row of eq.rows) questionMap.set(row.id, snakeToCamel(row));
      }

      if (alliedIds.length > 0) {
        const aq = await pool.query(
          `SELECT id, stem, options, body_system, topic, difficulty, question_type, career_type, subtopic, blueprint_category
           FROM allied_questions WHERE id = ANY($1)`,
          [alliedIds]
        );
        for (const row of aq.rows) questionMap.set(row.id, snakeToCamel(row));
      }

      for (const bm of bookmarks.rows) {
        const questionData = questionMap.get(bm.question_id);
        if (!questionData) continue;

        if (profession) {
          const careerType = questionData.careerType || "";
          if (!careerType.toLowerCase().includes((profession as string).toLowerCase())) continue;
        }
        if (topic) {
          const qTopic = questionData.topic || questionData.blueprintCategory || questionData.subtopic || "";
          if (!qTopic.toLowerCase().includes((topic as string).toLowerCase())) continue;
        }
        if (difficulty) {
          const qDiff = questionData.difficulty;
          if (String(qDiff) !== String(difficulty)) continue;
        }

        results.push({
          bookmark: snakeToCamel(bm),
          question: questionData,
        });
      }

      const degradation = getDegradation(req);
      const response: any = { bookmarks: results, total: results.length };
      if (degradation.degradedMode) {
        response.degradedMode = true;
        response.degradationReason = degradation.degradationReason;
        logDegradedAccess(user.id, "/api/bookmarks", degradation.degradationReason || "memory_pressure", degradation.memoryLevel || "unknown");
      }
      res.json(response);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ─── Custom Practice Session API ───

  app.post("/api/practice-sessions", examStartLimiter, requireAnyPaidTier(), async (req: any, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const psDeg = getDegradation(req);
      if (psDeg.degradedMode) {
        logDegradedAccess(user.id, "/api/practice-sessions", psDeg.degradationReason || "memory_pressure", psDeg.memoryLevel || "unknown");
      }

      const {
        topics,
        difficultyMin,
        difficultyMax,
        incorrectOnly,
        bookmarkedOnly,
        profession,
        questionCount = 20,
      } = req.body;

      const limit = getMemoryAwareLimit(Math.max(questionCount, 5), 100);
      let questions: any[] = [];

      const userTierLc = String(user.tier || "free").toLowerCase();
      const tester = isActiveTester(user);

      if (bookmarkedOnly) {
        const bmResult = await pool.query(
          `SELECT question_id, question_source FROM question_bookmarks WHERE user_id = $1`,
          [user.id]
        );
        for (const bm of bmResult.rows) {
          const table = bm.question_source === "exam_questions" ? "exam_questions" : "allied_questions";
          const q = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [bm.question_id]);
          if (q.rows.length > 0) {
            questions.push({ ...q.rows[0], _source: bm.question_source });
          }
        }
        const nursingAllowed = tester ? null : allowedNursingExamQuestionTiersForUser(user.tier || "free");
        questions = questions.filter((q: any) => {
          if (q._source === "allied_questions") {
            return tester || practiceSessionIncludeAlliedPool(userTierLc);
          }
          if (q._source === "exam_questions") {
            if (tester || nursingAllowed === null) return true;
            if (!nursingAllowed.length) return false;
            const qt = String(q.tier || "").toLowerCase();
            return nursingAllowed.map((t) => t.toLowerCase()).includes(qt);
          }
          return false;
        });
      } else {
        let examQs: any[] = [];
        let alliedQs: any[] = [];
        const baseFilters = {
          topics,
          difficultyMin,
          difficultyMax,
          incorrectOnly,
          profession,
          userId: user.id,
          limit: limit * 2,
        };
        if (tester || practiceSessionIncludeNursingPool(userTierLc)) {
          const nursingTierFilter = tester ? null : allowedNursingExamQuestionTiersForUser(user.tier || "free");
          examQs = await buildQuestionQuery("exam_questions", {
            ...baseFilters,
            nursingTierFilter,
          });
        }
        if (tester || practiceSessionIncludeAlliedPool(userTierLc)) {
          alliedQs = await buildQuestionQuery("allied_questions", baseFilters);
        }
        questions = [
          ...examQs.map((q: any) => ({ ...q, _source: "exam_questions" })),
          ...alliedQs.map((q: any) => ({ ...q, _source: "allied_questions" })),
        ];
      }

      if (profession) {
        questions = questions.filter((q: any) => {
          const ct = (q.career_type || q.careerType || "nursing").toLowerCase();
          return ct.includes(profession.toLowerCase());
        });
      }

      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
      questions = questions.slice(0, limit);

      const questionIds = questions.map((q: any) => q.id);
      const questionData = questions.map((q: any) => ({
        id: q.id,
        source: q._source,
        stem: q.stem,
        options: q.options,
        difficulty: q.difficulty,
        topic: q.topic || q.blueprint_category || q.subtopic || "",
        bodySystem: q.body_system || q.blueprint_category || "",
      }));

      const result = await pool.query(
        `INSERT INTO custom_practice_sessions (id, user_id, status, total_questions, questions, created_at)
         VALUES (gen_random_uuid(), $1, 'in_progress', $2, $3, NOW()) RETURNING *`,
        [user.id, questions.length, JSON.stringify(questionData)]
      );

      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/practice-sessions/:id", requireAnyPaidTier(), async (req: any, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const result = await pool.query(
        `SELECT * FROM custom_practice_sessions WHERE id = $1 AND user_id = $2`,
        [req.params.id, user.id]
      );

      if (result.rows.length === 0) return res.status(404).json({ error: "Session not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/practice-sessions/:id/answer", requireAnyPaidTier(), async (req: any, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { questionId, selectedAnswer, responseTimeMs } = req.body;
      if (!questionId || selectedAnswer === undefined) {
        return res.status(400).json({ error: "questionId and selectedAnswer required" });
      }

      const sessionResult = await pool.query(
        `SELECT * FROM custom_practice_sessions WHERE id = $1 AND user_id = $2`,
        [req.params.id, user.id]
      );
      if (sessionResult.rows.length === 0) return res.status(404).json({ error: "Session not found" });
      const session = sessionResult.rows[0];

      if (session.status !== "in_progress") {
        return res.status(400).json({ error: "Session is already completed" });
      }

      const questions = session.questions || [];
      const questionMeta = questions.find((q: any) => q.id === questionId);
      if (!questionMeta) return res.status(404).json({ error: "Question not in session" });

      let correctAnswer: any;
      let rationale: string = "";
      const table = questionMeta.source === "exam_questions" ? "exam_questions" : "allied_questions";
      const qResult = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [questionId]);
      if (qResult.rows.length > 0) {
        const qRow = qResult.rows[0];
        if (table === "exam_questions") {
          correctAnswer = qRow.correct_answer;
          rationale = qRow.rationale || "";
        } else {
          correctAnswer = qRow.correct_answer;
          rationale = qRow.rationale_long || "";
        }
      }

      const isCorrect = JSON.stringify(selectedAnswer) === JSON.stringify(correctAnswer);

      await updateStudyStreak(String(user.id));

      res.json({
        isCorrect,
        correctAnswer,
        rationale,
        questionId,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/practice-sessions/:id/complete", requireAnyPaidTier(), async (req: any, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { score, answers } = req.body;

      const sessionResult = await pool.query(
        `SELECT * FROM custom_practice_sessions WHERE id = $1 AND user_id = $2`,
        [req.params.id, user.id]
      );
      if (sessionResult.rows.length === 0) return res.status(404).json({ error: "Session not found" });

      await pool.query(
        `UPDATE custom_practice_sessions SET status = 'completed', score = $1, completed_at = NOW() WHERE id = $2`,
        [score || 0, req.params.id]
      );

      await updateStudyStreak(String(user.id));

      res.json({ success: true, status: "completed" });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ─── Unified Adaptive Question Selection ───

  app.post("/api/adaptive/next-question", examInteractionLimiter, requireEntitlement("adaptive_engine"), async (req: any, res) => {
    try {
      const user = req.authUser;

      const adaptiveDeg = getDegradation(req);
      if (adaptiveDeg.degradedMode) {
        logDegradedAccess(user?.id || "unknown", "/api/adaptive/next-question", adaptiveDeg.degradationReason || "memory_pressure", adaptiveDeg.memoryLevel || "unknown");
      }

      const { professionType, currentAbility, usedQuestionIds, sessionState } = req.body;

      if (!professionType) {
        return res.status(400).json({ error: "professionType required" });
      }

      const theta = currentAbility?.theta ?? 0;
      const ability = currentAbility || createInitialAbility();

      let candidateQuery = "";
      const params: any[] = [];
      let idx = 1;

      const profLower = professionType.toLowerCase();
      const isNursing = ["nursing", "rpn", "rn", "np", "nclex", "rex-pn", "lvn"].some(t => profLower.includes(t));

      if (isNursing) {
        candidateQuery = `SELECT id, topic, body_system, difficulty, subtopic FROM exam_questions WHERE status = 'published'`;
        if (usedQuestionIds?.length > 0) {
          candidateQuery += ` AND id != ALL($${idx++})`;
          params.push(usedQuestionIds);
        }
        candidateQuery += ` ORDER BY RANDOM() LIMIT 200`;
      } else {
        candidateQuery = `SELECT id, blueprint_category, difficulty, subtopic FROM allied_questions WHERE status = 'active'`;
        candidateQuery += ` AND career_type ILIKE $${idx++}`;
        params.push(`%${professionType}%`);
        if (usedQuestionIds?.length > 0) {
          candidateQuery += ` AND id != ALL($${idx++})`;
          params.push(usedQuestionIds);
        }
        candidateQuery += ` ORDER BY RANDOM() LIMIT 200`;
      }

      const candidateResult = await pool.query(candidateQuery, params);

      if (candidateResult.rows.length === 0) {
        return res.json({ question: null, message: "No more questions available" });
      }

      const DIFFICULTY_LABELS: Record<number, string> = { 1: "easy", 2: "easy", 3: "medium", 4: "hard", 5: "hard" };

      const candidates: QuestionCandidate[] = candidateResult.rows.map((r: any) => ({
        id: r.id,
        category: r.blueprint_category || r.body_system || r.topic || "General",
        difficulty: DIFFICULTY_LABELS[r.difficulty] || "medium",
        difficultyNum: r.difficulty || 3,
        topic: r.subtopic || r.topic || "",
        hasImage: false,
        exposureCount: 0,
      }));

      const state = {
        sessionId: "adaptive-" + Date.now(),
        mode: "adaptive_practice" as any,
        country: "US" as const,
        currentIndex: (usedQuestionIds || []).length,
        totalQuestions: 100,
        timeLimit: 120,
        startedAt: new Date().toISOString(),
        ability,
        responses: sessionState?.responses || [],
        questionIds: usedQuestionIds || [],
        flaggedIds: [],
        coverageAchieved: sessionState?.coverageAchieved || {},
        weakAreaMap: sessionState?.weakAreaMap || {},
        strongAreaMap: sessionState?.strongAreaMap || {},
        stabilityScore: 1.0,
        completed: false,
      };

      const catParams = { ...DEFAULT_CAT_PARAMS };
      const selected = selectNextQuestion(candidates, state, catParams);

      if (!selected) {
        return res.json({ question: null, message: "No suitable question found" });
      }

      const table = isNursing ? "exam_questions" : "allied_questions";
      const fullQ = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [selected.id]);

      if (fullQ.rows.length === 0) {
        return res.json({ question: null, message: "Question data not found" });
      }

      const row = fullQ.rows[0];
      let questionPayload: any;

      if (isNursing) {
        const opts = row.options || [];
        questionPayload = {
          id: row.id,
          stem: row.stem,
          options: opts,
          difficulty: row.difficulty,
          topic: row.topic || row.body_system || "",
          bodySystem: row.body_system || "",
          questionType: row.question_type,
          source: "exam_questions",
        };
      } else {
        const opts = row.options || [];
        const ANSWER_LETTERS = ["A", "B", "C", "D"];
        questionPayload = {
          id: row.id,
          stem: row.stem,
          options: opts,
          difficulty: row.difficulty,
          topic: row.subtopic || row.blueprint_category || "",
          category: row.blueprint_category || "",
          correctAnswerIndex: row.correct_answer,
          source: "allied_questions",
        };
      }

      res.json({
        question: questionPayload,
        adaptiveInfo: {
          currentAbility: ability.theta,
          questionDifficulty: selected.difficultyNum,
          category: selected.category,
        },
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ─── Enhanced Streak API ───

  app.get("/api/user-stats/:userId/streak", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });
      if (String(user.id) !== req.params.userId && (user as any).tier !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }

      const profileResult = await pool.query(
        `SELECT current_streak, longest_streak, last_study_date FROM student_study_profiles WHERE user_id = $1`,
        [req.params.userId]
      );

      let currentStreak = 0;
      let longestStreak = 0;
      let lastStudyDate: string | null = null;

      if (profileResult.rows.length > 0) {
        const p = profileResult.rows[0];
        currentStreak = p.current_streak || 0;
        longestStreak = p.longest_streak || 0;
        lastStudyDate = p.last_study_date;
      }

      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastStudyDate && lastStudyDate !== today && lastStudyDate !== yesterdayStr) {
        currentStreak = 0;
      }

      res.json({
        currentStreak,
        longestStreak,
        lastStudyDate,
        motivation: getStreakMotivation(currentStreak),
        isActiveToday: lastStudyDate === today,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/study-activity", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { activityType } = req.body;
      if (!activityType || !["question_answered", "flashcard_reviewed", "lesson_completed"].includes(activityType)) {
        return res.status(400).json({ error: "activityType must be 'question_answered', 'flashcard_reviewed', or 'lesson_completed'" });
      }

      const streakData = await updateStudyStreak(String(user.id));

      res.json({
        ...streakData,
        activityType,
        recorded: true,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ─── Enhanced Exam Readiness ───

  app.get("/api/exam-readiness-enhanced/:userId", requireAnyPaidTier(), async (req: any, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const readinessDeg = getDegradation(req);
      if (readinessDeg.degradedMode) {
        logDegradedAccess(user.id, "/api/exam-readiness-enhanced", readinessDeg.degradationReason || "memory_pressure", readinessDeg.memoryLevel || "unknown");
      }

      if (String(user.id) !== req.params.userId && (user as any).tier !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }
      const userId = req.params.userId;

      const statsResult = await pool.query(`SELECT * FROM user_stats WHERE user_id = $1`, [userId]);
      const s = statsResult.rows[0];
      const totalAnswered = s?.total_questions_answered || 0;
      const totalCorrect = s?.total_correct || 0;
      const questionAccuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

      const mockExamResult = await pool.query(
        `SELECT score FROM mock_exam_attempts WHERE user_id = $1 AND status = 'completed' AND score IS NOT NULL ORDER BY completed_at DESC LIMIT 5`,
        [userId]
      );
      const mockScores = mockExamResult.rows.map((r: any) => r.score);
      const avgMockScore = mockScores.length > 0
        ? mockScores.reduce((a: number, b: number) => a + b, 0) / mockScores.length
        : 0;

      const topicResult = await pool.query(
        `SELECT DISTINCT body_system FROM confidence_ratings WHERE user_id = $1 AND body_system IS NOT NULL AND body_system != ''`,
        [userId]
      );
      const totalTopicResult = await pool.query(
        `SELECT COUNT(DISTINCT body_system) as total FROM exam_questions WHERE body_system IS NOT NULL AND body_system != '' AND status = 'published'`
      );
      const coveredTopics = topicResult.rows.length;
      const totalTopics = parseInt(totalTopicResult.rows[0]?.total || "20");
      const topicCoverage = totalTopics > 0 ? Math.min(100, (coveredTopics / totalTopics) * 100) : 0;

      const profileResult = await pool.query(
        `SELECT current_streak FROM student_study_profiles WHERE user_id = $1`,
        [userId]
      );
      const currentStreak = profileResult.rows[0]?.current_streak || 0;
      const streakScore = Math.min(100, currentStreak * 5);

      const readiness = Math.round(
        questionAccuracy * 0.4 +
        avgMockScore * 0.3 +
        topicCoverage * 0.2 +
        streakScore * 0.1
      );

      const suggestions: string[] = [];

      if (avgMockScore < 60 && mockScores.length > 0) {
        suggestions.push("Your mock exam scores are below passing — take more practice exams to build stamina");
      }
      if (mockScores.length === 0) {
        suggestions.push("Take a mock exam to get a realistic assessment of your readiness");
      }

      const weakResult = await pool.query(
        `SELECT body_system, ROUND(100.0 * SUM(CASE WHEN was_correct THEN 1 ELSE 0 END) / COUNT(*), 1) as accuracy
         FROM confidence_ratings WHERE user_id = $1 AND body_system IS NOT NULL AND body_system != ''
         GROUP BY body_system HAVING COUNT(*) >= 3
         ORDER BY accuracy ASC LIMIT 3`,
        [userId]
      );
      for (const row of weakResult.rows) {
        suggestions.push(`Focus on ${row.body_system} — your weakest domain at ${row.accuracy}% accuracy`);
      }

      if (topicCoverage < 50) {
        suggestions.push("Broaden your study — you've only covered " + Math.round(topicCoverage) + "% of topics");
      }
      if (currentStreak === 0) {
        suggestions.push("Build a daily study habit — consistent practice improves retention");
      }

      res.json({
        readiness: Math.min(100, Math.max(0, readiness)),
        breakdown: {
          questionAccuracy: Math.round(questionAccuracy),
          mockExamAverage: Math.round(avgMockScore),
          topicCoverage: Math.round(topicCoverage),
          studyConsistency: Math.round(streakScore),
        },
        weights: {
          questionAccuracy: 0.4,
          mockExamScore: 0.3,
          topicCoverage: 0.2,
          studyConsistency: 0.1,
        },
        totalAnswered,
        totalCorrect,
        mockExamsCompleted: mockScores.length,
        streak: currentStreak,
        suggestions,
      });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to compute enhanced exam readiness" });
    }
  });

  // ─── Enhanced Weak Areas ───

  app.get("/api/weak-areas-enhanced/:userId", requireAnyPaidTier(), async (req: any, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });
      if (String(user.id) !== req.params.userId && (user as any).tier !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }
      const userId = req.params.userId;
      const result = await pool.query(
        `SELECT body_system, topic,
          COUNT(*) as total,
          SUM(CASE WHEN was_correct THEN 1 ELSE 0 END) as correct,
          ROUND(100.0 * SUM(CASE WHEN was_correct THEN 1 ELSE 0 END) / COUNT(*), 1) as accuracy,
          SUM(CASE WHEN confidence = 'guessing' THEN 1 ELSE 0 END) as guessing_count
        FROM confidence_ratings
        WHERE user_id = $1
        GROUP BY body_system, topic
        HAVING COUNT(*) >= 3 AND ROUND(100.0 * SUM(CASE WHEN was_correct THEN 1 ELSE 0 END) / COUNT(*), 1) < 70
        ORDER BY accuracy ASC
        LIMIT 10`,
        [userId]
      );

      const weakTopics = result.rows.map((row: any) => ({
        bodySystem: row.body_system,
        topic: row.topic,
        total: parseInt(row.total),
        correct: parseInt(row.correct),
        accuracy: parseFloat(row.accuracy),
        guessingCount: parseInt(row.guessing_count),
        practiceAction: {
          label: "Practice Weak Topic",
          endpoint: "/api/practice-sessions",
          method: "POST",
          payload: {
            topics: [row.topic || row.body_system].filter(Boolean),
            difficultyMin: 1,
            difficultyMax: 5,
            questionCount: 20,
          },
        },
      }));

      res.json({
        weakTopics,
        total: weakTopics.length,
        recommendation: weakTopics.length > 0
          ? `Focus on ${weakTopics[0].bodySystem || weakTopics[0].topic} — your lowest accuracy area at ${weakTopics[0].accuracy}%`
          : "Great work! No significantly weak areas detected.",
      });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to fetch enhanced weak areas" });
    }
  });

  // ─── Enhanced Mock Exam Report ───

  app.post("/api/mock-exams/:attemptId/detailed-report", requireAnyPaidTier(), async (req: any, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { attemptId } = req.params;

      const attemptResult = await pool.query(
        `SELECT id, user_id, questions, status, report, exam_type, blueprint_code, answers, flagged, score, started_at, completed_at
         FROM mock_exam_attempts WHERE id = $1`,
        [attemptId]
      );
      if (attemptResult.rows.length === 0) return res.status(404).json({ error: "Exam attempt not found" });

      const attempt = attemptResult.rows[0];
      if (attempt.user_id !== String(user.id) && (user as any).tier !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }

      if (attempt.status !== "completed") {
        return res.status(400).json({ error: "Exam not yet completed" });
      }

      const rawQuestions = attempt.questions || [];
      let questions: any[] = rawQuestions;
      const isIdOnlyFormat = rawQuestions.length > 0 && typeof rawQuestions[0] === "string";
      if (isIdOnlyFormat) {
        const questionIds = rawQuestions.filter((id: any) => typeof id === "string" && id.length > 0);
        if (questionIds.length > 0) {
          const placeholders = questionIds.map((_: any, i: number) => `$${i + 1}`).join(",");
          const qResult = await pool.query(
            `SELECT id, stem, body_system, topic, category, options, correct_answer FROM exam_questions WHERE id IN (${placeholders})`,
            questionIds
          );
          const qMap = new Map(qResult.rows.map((q: any) => [q.id, q]));
          questions = questionIds.map((qId: string) => {
            const q = qMap.get(qId);
            return q ? { id: q.id, question: q.stem, bodySystem: q.body_system || "General", category: q.category, topic: q.topic, options: q.options, correct: Array.isArray(q.correct_answer) ? q.correct_answer[0] : 0 } : { id: qId, bodySystem: "General" };
          });
        }
      }
      const answers = attempt.answers || {};
      const flaggedIds = attempt.flagged || [];

      const domainBreakdown: Record<string, { total: number; correct: number; percentage: number; avgTimeMs: number }> = {};
      let totalTimeMs = 0;
      let totalQuestions = 0;
      let totalCorrect = 0;
      const questionDetails: any[] = [];

      for (const q of questions) {
        const qId = q.id || q.questionId;
        const answer = answers[qId];
        const domain = q.bodySystem || q.category || q.topic || "General";
        const isCorrect = answer?.isCorrect ?? false;
        const timeMs = answer?.responseTimeMs || answer?.timeSpent || 0;

        if (!domainBreakdown[domain]) {
          domainBreakdown[domain] = { total: 0, correct: 0, percentage: 0, avgTimeMs: 0 };
        }
        domainBreakdown[domain].total++;
        if (isCorrect) domainBreakdown[domain].correct++;
        domainBreakdown[domain].avgTimeMs += timeMs;

        totalTimeMs += timeMs;
        totalQuestions++;
        if (isCorrect) totalCorrect++;

        questionDetails.push({
          questionId: qId,
          domain,
          isCorrect,
          timeMs,
          flagged: flaggedIds.includes(qId),
          difficulty: q.difficulty,
        });
      }

      for (const domain of Object.keys(domainBreakdown)) {
        const d = domainBreakdown[domain];
        d.percentage = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
        d.avgTimeMs = d.total > 0 ? Math.round(d.avgTimeMs / d.total) : 0;
      }

      const avgTimePerQuestion = totalQuestions > 0 ? Math.round(totalTimeMs / totalQuestions) : 0;
      const score = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      const flaggedSummary = questionDetails.filter(q => q.flagged);

      const previousResult = await pool.query(
        `SELECT id, score, time_spent, completed_at FROM mock_exam_attempts
         WHERE user_id = $1 AND status = 'completed' AND id != $2
         ORDER BY completed_at DESC LIMIT 1`,
        [user.id, attemptId]
      );

      let comparison: any = null;
      if (previousResult.rows.length > 0) {
        const prev = previousResult.rows[0];
        comparison = {
          previousAttemptId: prev.id,
          previousScore: prev.score,
          scoreDelta: score - (prev.score || 0),
          previousTimeSpent: prev.time_spent,
          timeDelta: (attempt.time_spent || 0) - (prev.time_spent || 0),
          improved: score > (prev.score || 0),
        };
      }

      const passThreshold = 65;
      const passed = score >= passThreshold;

      await updateStudyStreak(String(user.id));

      res.json({
        attemptId,
        score,
        totalQuestions,
        totalCorrect,
        passed,
        passThreshold,
        avgTimePerQuestion,
        totalTimeMs,
        domainBreakdown,
        flaggedSummary: {
          count: flaggedSummary.length,
          questions: flaggedSummary,
        },
        comparison,
        questionDetails,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}

async function buildQuestionQuery(
  table: string,
  filters: {
    topics?: string[];
    difficultyMin?: number;
    difficultyMax?: number;
    incorrectOnly?: boolean;
    profession?: string;
    userId?: string;
    limit?: number;
    /** Nursing pool only: `null` = no tier predicate (admin/tester); `[]` = no rows; else `tier = ANY(...)` */
    nursingTierFilter?: string[] | null;
  }
): Promise<any[]> {
  const isExam = table === "exam_questions";
  if (isExam && filters.nursingTierFilter !== undefined && filters.nursingTierFilter !== null) {
    if (filters.nursingTierFilter.length === 0) return [];
  }
  const statusField = isExam ? "status = 'published'" : "status = 'active'";
  let query = `SELECT * FROM ${table} WHERE ${statusField}`;
  const params: any[] = [];
  let idx = 1;

  if (isExam && filters.nursingTierFilter && filters.nursingTierFilter.length > 0) {
    query += ` AND tier = ANY($${idx++})`;
    params.push(filters.nursingTierFilter);
  }

  if (filters.topics && filters.topics.length > 0) {
    if (isExam) {
      query += ` AND (topic = ANY($${idx}) OR body_system = ANY($${idx}))`;
    } else {
      query += ` AND (blueprint_category = ANY($${idx}) OR subtopic = ANY($${idx}))`;
    }
    params.push(filters.topics);
    idx++;
  }

  if (filters.difficultyMin !== undefined) {
    query += ` AND difficulty >= $${idx++}`;
    params.push(filters.difficultyMin);
  }
  if (filters.difficultyMax !== undefined) {
    query += ` AND difficulty <= $${idx++}`;
    params.push(filters.difficultyMax);
  }

  if (filters.profession && !isExam) {
    query += ` AND career_type ILIKE $${idx++}`;
    params.push(`%${filters.profession}%`);
  }

  if (filters.incorrectOnly && filters.userId) {
    query += ` AND id IN (SELECT DISTINCT question_id FROM confidence_ratings WHERE user_id = $${idx++} AND was_correct = false)`;
    params.push(filters.userId);
  }

  query += ` ORDER BY RANDOM() LIMIT $${idx++}`;
  params.push(filters.limit || 40);

  const result = await pool.query(query, params);
  return result.rows;
}
