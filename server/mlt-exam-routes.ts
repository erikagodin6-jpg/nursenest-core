import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin, resolveAuthUser } from "./admin-auth";
import { createRateLimiter, abuseEscalationMiddleware, botDetectionMiddleware } from "./abuse-protection";
import {
  createInitialAbility,
  updateAbilityEstimate,
  detectRapidGuessing,
  calculateStability,
  shouldStopCAT,
  selectNextQuestion,
  computeWeakStrongAreas,
  generateExamReport,
  simulateCAT,
  type QuestionCandidate,
} from "./mlt-adaptive-engine";
import { findRemediationContent } from "./mlt-remediation-engine";
import {
  DEFAULT_CAT_PARAMS,
  CANADA_EXAM_CONFIG,
  SIMULATION_PROFILES,
  type ExamSessionState,
  type QuestionResponse,
  type CATParameters,
  type MltExamMode,
} from "../shared/mlt-exam-types";

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

const DIFFICULTY_LABELS: Record<number, string> = { 1: "easy", 2: "easy", 3: "medium", 4: "hard", 5: "hard" };
const ANSWER_LETTERS = ["A", "B", "C", "D"];

function transformQuestion(row: any): any {
  const options = row.options || [];
  return {
    id: row.id,
    question: row.stem || "",
    optionA: options[0]?.text || options[0] || "",
    optionB: options[1]?.text || options[1] || "",
    optionC: options[2]?.text || options[2] || "",
    optionD: options[3]?.text || options[3] || "",
    category: row.blueprint_category || row.subtopic || "General",
    difficulty: DIFFICULTY_LABELS[row.difficulty] || "medium",
    difficultyNum: row.difficulty || 3,
    topic: row.subtopic || row.blueprint_category || "",
    correctAnswer: ANSWER_LETTERS[row.correct_answer] || "A",
    rationale: row.rationale_long || "",
  };
}

async function getSessionQuestions(country: string, filters: { topics?: string[]; difficulties?: string[]; limit?: number }): Promise<any[]> {
  let query = `SELECT * FROM allied_questions WHERE career_type ILIKE '%mlt%' AND status = 'active'`;
  const params: any[] = [];
  let idx = 1;

  if (filters.topics && filters.topics.length > 0) {
    query += ` AND blueprint_category = ANY($${idx})`;
    params.push(filters.topics);
    idx++;
  }

  if (filters.difficulties && filters.difficulties.length > 0) {
    const diffNums = filters.difficulties.map((d: string) => {
      if (d === "easy") return [1, 2];
      if (d === "hard") return [4, 5];
      return [3];
    }).flat();
    query += ` AND difficulty = ANY($${idx})`;
    params.push(diffNums);
    idx++;
  }

  query += ` ORDER BY RANDOM()`;

  if (filters.limit) {
    query += ` LIMIT $${idx}`;
    params.push(filters.limit);
  }

  const result = await pool.query(query, params);
  return result.rows.map(transformQuestion);
}

async function getCandidateQuestions(country: string, usedIds: string[]): Promise<QuestionCandidate[]> {
  let query = `SELECT id, blueprint_category, difficulty, subtopic FROM allied_questions WHERE career_type ILIKE '%mlt%' AND status = 'active'`;
  const params: any[] = [];
  let idx = 1;

  if (usedIds.length > 0) {
    query += ` AND id != ALL($${idx})`;
    params.push(usedIds);
    idx++;
  }

  query += ` ORDER BY RANDOM() LIMIT 200`;
  const result = await pool.query(query, params);

  return result.rows.map((r: any) => ({
    id: r.id,
    category: r.blueprint_category || "General",
    difficulty: DIFFICULTY_LABELS[r.difficulty] || "medium",
    difficultyNum: r.difficulty || 3,
    topic: r.subtopic || "",
    hasImage: false,
    exposureCount: 0,
  }));
}

export function registerMltExamRoutes(app: Express) {
  const examStartLimiter = createRateLimiter("exam_start");
  const examInteractionLimiter = createRateLimiter("exam_interaction");

  app.use("/api/mlt/exam", abuseEscalationMiddleware, botDetectionMiddleware);

  app.post("/api/mlt/exam/start", examStartLimiter, async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { mode, country, subMode, practiceMode, topics, difficulties, totalQuestions, timeLimit, noBacktracking } = req.body;

      if (!mode || !country) {
        return res.status(400).json({ error: "mode and country are required" });
      }

      let qCount = totalQuestions || 20;
      let tLimit = timeLimit || 60;
      let catParams: CATParameters | null = null;

      if (mode === "canada_realistic") {
        qCount = CANADA_EXAM_CONFIG.totalQuestions;
        tLimit = CANADA_EXAM_CONFIG.timeLimit;
      } else if (mode === "usa_cat") {
        const settingsResult = await pool.query(`SELECT * FROM mlt_cat_settings LIMIT 1`);
        if (settingsResult.rows.length > 0) {
          const s = snakeToCamel(settingsResult.rows[0]) as any;
          catParams = {
            minQuestions: s.minQuestions || DEFAULT_CAT_PARAMS.minQuestions,
            maxQuestions: s.maxQuestions || DEFAULT_CAT_PARAMS.maxQuestions,
            timeLimit: s.timeLimit || DEFAULT_CAT_PARAMS.timeLimit,
            stabilityThreshold: s.stabilityThreshold || DEFAULT_CAT_PARAMS.stabilityThreshold,
            exposureMax: s.exposureMax || DEFAULT_CAT_PARAMS.exposureMax,
            contentTargets: s.contentTargets || DEFAULT_CAT_PARAMS.contentTargets,
            abilityCapPerQuestion: s.abilityCapPerQuestion || DEFAULT_CAT_PARAMS.abilityCapPerQuestion,
            rapidGuessThresholdMs: s.rapidGuessThresholdMs || DEFAULT_CAT_PARAMS.rapidGuessThresholdMs,
            noBacktracking: s.noBacktracking ?? DEFAULT_CAT_PARAMS.noBacktracking,
          };
        } else {
          catParams = { ...DEFAULT_CAT_PARAMS };
        }
        if (noBacktracking !== undefined) catParams.noBacktracking = noBacktracking;
        qCount = catParams.maxQuestions;
        tLimit = catParams.timeLimit;
      } else if (mode === "adaptive_practice") {
        qCount = totalQuestions || 20;
        tLimit = timeLimit || 30;
      }

      const questions = await getSessionQuestions(country, {
        topics,
        difficulties,
        limit: Math.min(qCount * 3, 500),
      });

      if (questions.length === 0) {
        return res.status(400).json({ error: "No questions available for the selected criteria. MLT questions need to be added to the question bank first." });
      }

      const selectedIds = questions.slice(0, qCount).map((q: any) => q.id);

      const result = await pool.query(
        `INSERT INTO mlt_exam_sessions (id, user_id, mode, country, sub_mode, practice_mode, total_questions, time_limit, status, ability_estimate, ability_history, response_history, question_ids, flagged_ids, coverage_achieved, weak_area_map, strong_area_map, stability_score, cat_params, topics, current_index, started_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'in_progress', 0, '[]'::jsonb, '[]'::jsonb, $8, '[]'::jsonb, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, 1, $9, $10, 0, NOW())
         RETURNING *`,
        [
          user.id,
          mode,
          country,
          subMode || null,
          practiceMode || null,
          qCount,
          tLimit,
          JSON.stringify(selectedIds),
          catParams ? JSON.stringify(catParams) : null,
          JSON.stringify(topics || []),
        ]
      );

      const session = snakeToCamel(result.rows[0]);
      const firstQ = questions[0];

      res.json({
        session,
        question: firstQ ? {
          id: firstQ.id,
          question: firstQ.question,
          optionA: firstQ.optionA,
          optionB: firstQ.optionB,
          optionC: firstQ.optionC,
          optionD: firstQ.optionD,
          category: firstQ.category,
          difficulty: firstQ.difficulty,
          topic: firstQ.topic,
        } : null,
        totalAvailable: questions.length,
      });
    } catch (e: any) {
      console.error("MLT exam start error:", e);
      const isColumnError = e.message?.includes("column") && e.message?.includes("does not exist");
      if (isColumnError) {
        console.error("[MLT Exam] Schema drift detected:", e.message);
        res.status(500).json({
          error: "Unable to create exam session due to a database configuration issue. Please retry shortly.",
          code: "SCHEMA_DRIFT",
        });
      } else {
        res.status(500).json({ error: "Unable to start exam session. Please try again." });
      }
    }
  });

  app.post("/api/mlt/exam/:sessionId/answer", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { sessionId } = req.params;
      const { questionId, selectedAnswer, responseTimeMs, flagged } = req.body;

      const sessionResult = await pool.query(
        `SELECT * FROM mlt_exam_sessions WHERE id = $1 AND user_id = $2`,
        [sessionId, user.id]
      );

      if (sessionResult.rows.length === 0) {
        return res.status(404).json({ error: "Session not found" });
      }

      const session = snakeToCamel(sessionResult.rows[0]);

      if (session.status !== "in_progress") {
        return res.status(400).json({ error: "Session is already completed" });
      }

      const qResult = await pool.query(`SELECT * FROM allied_questions WHERE id = $1`, [questionId]);
      if (qResult.rows.length === 0) {
        return res.status(404).json({ error: "Question not found" });
      }
      const question = transformQuestion(qResult.rows[0]);

      const isCorrect = selectedAnswer === question.correctAnswer;

      const response: QuestionResponse = {
        questionId,
        selectedAnswer,
        isCorrect,
        responseTimeMs: responseTimeMs || 30000,
        difficulty: question.difficulty,
        category: question.category,
        flagged,
      };

      const responseHistory = [...(session.responseHistory || []), response];
      const questionIds = session.questionIds || [];
      let flaggedIds = session.flaggedIds || [];
      if (flagged) {
        flaggedIds = [...new Set([...flaggedIds, questionId])];
      }

      const diffNum = question.difficultyNum || 3;

      const catParams: CATParameters = session.catParams || DEFAULT_CAT_PARAMS;
      const prevAbility = {
        theta: session.abilityEstimate || 0,
        standardError: 1.0,
        confidence: responseHistory.length / 40,
        history: session.abilityHistory || [0],
      };

      const newAbility = updateAbilityEstimate(prevAbility, isCorrect, diffNum, responseTimeMs || 30000, catParams);

      const coverageAchieved = { ...(session.coverageAchieved || {}) };
      coverageAchieved[question.category] = (coverageAchieved[question.category] || 0) + 1;

      const { weakAreas, strongAreas } = computeWeakStrongAreas(responseHistory);

      const stabilityScore = calculateStability(newAbility.history);
      const currentIndex = (session.currentIndex || 0) + 1;

      let status = "in_progress";
      let nextQuestion: any = null;
      let completed = false;

      if (session.mode === "usa_cat") {
        const state: ExamSessionState = {
          sessionId,
          mode: session.mode,
          country: session.country,
          currentIndex,
          totalQuestions: session.totalQuestions,
          timeLimit: session.timeLimit,
          startedAt: session.startedAt,
          ability: newAbility,
          responses: responseHistory,
          questionIds,
          flaggedIds,
          coverageAchieved,
          weakAreaMap: weakAreas,
          strongAreaMap: strongAreas,
          stabilityScore,
          completed: false,
        };

        const stopCheck = shouldStopCAT(state, catParams);
        if (stopCheck.stop) {
          status = "completed";
          completed = true;
        } else {
          const candidates = await getCandidateQuestions(session.country, questionIds);
          const nextCandidate = selectNextQuestion(candidates, state, catParams);
          if (nextCandidate) {
            const nextQResult = await pool.query(`SELECT * FROM allied_questions WHERE id = $1`, [nextCandidate.id]);
            if (nextQResult.rows.length > 0) {
              const nq = transformQuestion(nextQResult.rows[0]);
              nextQuestion = {
                id: nq.id,
                question: nq.question,
                optionA: nq.optionA,
                optionB: nq.optionB,
                optionC: nq.optionC,
                optionD: nq.optionD,
                category: nq.category,
                difficulty: nq.difficulty,
                topic: nq.topic,
              };
              if (!questionIds.includes(nextCandidate.id)) {
                questionIds.push(nextCandidate.id);
              }
            }
          } else {
            status = "completed";
            completed = true;
          }
        }
      } else {
        if (currentIndex >= session.totalQuestions || currentIndex >= questionIds.length) {
          status = "completed";
          completed = true;
        } else {
          const nextQId = questionIds[currentIndex];
          if (nextQId) {
            const nextQResult = await pool.query(`SELECT * FROM allied_questions WHERE id = $1`, [nextQId]);
            if (nextQResult.rows.length > 0) {
              const nq = transformQuestion(nextQResult.rows[0]);
              nextQuestion = {
                id: nq.id,
                question: nq.question,
                optionA: nq.optionA,
                optionB: nq.optionB,
                optionC: nq.optionC,
                optionD: nq.optionD,
                category: nq.category,
                difficulty: nq.difficulty,
                topic: nq.topic,
              };
            }
          }
        }
      }

      const correctCount = responseHistory.filter((r: QuestionResponse) => r.isCorrect).length;
      const score = responseHistory.length > 0 ? Math.round((correctCount / responseHistory.length) * 100) : 0;

      let report = null;
      if (completed) {
        const finalState: ExamSessionState = {
          sessionId,
          mode: session.mode as MltExamMode,
          country: session.country,
          currentIndex,
          totalQuestions: session.totalQuestions,
          timeLimit: session.timeLimit,
          startedAt: session.startedAt,
          ability: newAbility,
          responses: responseHistory,
          questionIds,
          flaggedIds,
          coverageAchieved,
          weakAreaMap: weakAreas,
          strongAreaMap: strongAreas,
          stabilityScore,
          completed: true,
        };
        report = generateExamReport(finalState);
      }

      await pool.query(
        `UPDATE mlt_exam_sessions SET
          status = $1, score = $2, correct_count = $3,
          ability_estimate = $4, ability_history = $5,
          response_history = $6, question_ids = $7,
          flagged_ids = $8, coverage_achieved = $9,
          weak_area_map = $10, strong_area_map = $11,
          stability_score = $12, current_index = $13,
          report = $14,
          completed_at = $15
        WHERE id = $16`,
        [
          status,
          score,
          correctCount,
          newAbility.theta,
          JSON.stringify(newAbility.history),
          JSON.stringify(responseHistory),
          JSON.stringify(questionIds),
          JSON.stringify(flaggedIds),
          JSON.stringify(coverageAchieved),
          JSON.stringify(weakAreas),
          JSON.stringify(strongAreas),
          stabilityScore,
          currentIndex,
          report ? JSON.stringify(report) : null,
          completed ? new Date() : null,
          sessionId,
        ]
      );

      const antiGaming = detectRapidGuessing(responseHistory, catParams.rapidGuessThresholdMs);

      let remediation = undefined;
      if (!isCorrect && (session.practiceMode === "tutor" || completed)) {
        try {
          const remResult = await findRemediationContent(questionId);
          if (remResult.bestLesson || remResult.bestDeck || remResult.relatedQuestions.length > 0) {
            remediation = {
              bestLesson: remResult.bestLesson,
              bestDeck: remResult.bestDeck,
              relatedQuestions: remResult.relatedQuestions.slice(0, 3),
              autoLinkScore: remResult.autoLinkScore,
              manuallyCurated: remResult.manuallyCurated,
            };
          }
        } catch (remErr: any) {
          console.error("Remediation lookup failed (non-fatal):", remErr.message);
        }
      }

      res.json({
        isCorrect,
        correctAnswer: question.correctAnswer,
        rationale: session.practiceMode === "tutor" || completed ? question.rationale : undefined,
        currentIndex,
        totalQuestions: session.totalQuestions,
        score,
        correctCount,
        abilityEstimate: newAbility.theta,
        status,
        completed,
        nextQuestion,
        report,
        antiGamingFlags: antiGaming.length > 0 ? antiGaming : undefined,
        remediation,
      });
    } catch (e: any) {
      console.error("MLT exam answer error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/mlt/exam/:sessionId/flag", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { sessionId } = req.params;
      const { questionId, flagged } = req.body;

      const sessionResult = await pool.query(
        `SELECT flagged_ids FROM mlt_exam_sessions WHERE id = $1 AND user_id = $2`,
        [sessionId, user.id]
      );

      if (sessionResult.rows.length === 0) {
        return res.status(404).json({ error: "Session not found" });
      }

      let flaggedIds: string[] = sessionResult.rows[0].flagged_ids || [];
      if (flagged) {
        flaggedIds = [...new Set([...flaggedIds, questionId])];
      } else {
        flaggedIds = flaggedIds.filter((id: string) => id !== questionId);
      }

      await pool.query(
        `UPDATE mlt_exam_sessions SET flagged_ids = $1 WHERE id = $2`,
        [JSON.stringify(flaggedIds), sessionId]
      );

      res.json({ flaggedIds });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/mlt/exam/:sessionId", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { sessionId } = req.params;
      const result = await pool.query(
        `SELECT * FROM mlt_exam_sessions WHERE id = $1 AND user_id = $2`,
        [sessionId, user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Session not found" });
      }

      const session = snakeToCamel(result.rows[0]);

      let currentQuestion = null;
      if (session.status === "in_progress" && session.questionIds && session.questionIds.length > 0) {
        const qId = session.questionIds[session.currentIndex || 0];
        if (qId) {
          const qResult = await pool.query(`SELECT * FROM allied_questions WHERE id = $1`, [qId]);
          if (qResult.rows.length > 0) {
            const q = transformQuestion(qResult.rows[0]);
            currentQuestion = {
              id: q.id,
              question: q.question,
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
              category: q.category,
              difficulty: q.difficulty,
              topic: q.topic,
            };
          }
        }
      }

      res.json({ session, currentQuestion });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/mlt/exam/:sessionId/question/:index", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { sessionId, index } = req.params;
      const idx = parseInt(index);

      const result = await pool.query(
        `SELECT * FROM mlt_exam_sessions WHERE id = $1 AND user_id = $2`,
        [sessionId, user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Session not found" });
      }

      const session = snakeToCamel(result.rows[0]);
      const questionIds = session.questionIds || [];

      if (idx < 0 || idx >= questionIds.length) {
        return res.status(400).json({ error: "Invalid question index" });
      }

      const qId = questionIds[idx];
      const qResult = await pool.query(`SELECT * FROM allied_questions WHERE id = $1`, [qId]);

      if (qResult.rows.length === 0) {
        return res.status(404).json({ error: "Question not found" });
      }

      const q = transformQuestion(qResult.rows[0]);
      const responses = session.responseHistory || [];
      const previousResponse = responses.find((r: any) => r.questionId === qId);

      res.json({
        question: {
          id: q.id,
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          category: q.category,
          difficulty: q.difficulty,
          topic: q.topic,
        },
        previousAnswer: previousResponse?.selectedAnswer || null,
        isFlagged: (session.flaggedIds || []).includes(qId),
        index: idx,
        total: questionIds.length,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/mlt/exam/:sessionId/complete", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { sessionId } = req.params;
      const result = await pool.query(
        `SELECT * FROM mlt_exam_sessions WHERE id = $1 AND user_id = $2`,
        [sessionId, user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Session not found" });
      }

      const session = snakeToCamel(result.rows[0]);
      if (session.status === "completed") {
        return res.json({ report: session.report });
      }

      const responseHistory: QuestionResponse[] = session.responseHistory || [];
      const correctCount = responseHistory.filter((r) => r.isCorrect).length;
      const score = responseHistory.length > 0 ? Math.round((correctCount / responseHistory.length) * 100) : 0;

      const ability = createInitialAbility();
      ability.theta = session.abilityEstimate || 0;
      ability.history = session.abilityHistory || [0];

      const finalState: ExamSessionState = {
        sessionId,
        mode: session.mode as MltExamMode,
        country: session.country,
        currentIndex: session.currentIndex || 0,
        totalQuestions: session.totalQuestions,
        timeLimit: session.timeLimit,
        startedAt: session.startedAt,
        ability,
        responses: responseHistory,
        questionIds: session.questionIds || [],
        flaggedIds: session.flaggedIds || [],
        coverageAchieved: session.coverageAchieved || {},
        weakAreaMap: session.weakAreaMap || {},
        strongAreaMap: session.strongAreaMap || {},
        stabilityScore: session.stabilityScore || 1,
        completed: true,
      };

      const report = generateExamReport(finalState);

      await pool.query(
        `UPDATE mlt_exam_sessions SET status = 'completed', score = $1, correct_count = $2, report = $3, completed_at = NOW() WHERE id = $4`,
        [score, correctCount, JSON.stringify(report), sessionId]
      );

      res.json({ report });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/mlt/exam/history/:userId", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { userId } = req.params;
      if (user.id !== userId && user.tier !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const result = await pool.query(
        `SELECT id, mode, country, sub_mode, practice_mode, total_questions, score, correct_count, ability_estimate, status, started_at, completed_at
         FROM mlt_exam_sessions WHERE user_id = $1 ORDER BY started_at DESC LIMIT 50`,
        [userId]
      );

      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/mlt/admin/cat-settings", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(`SELECT * FROM mlt_cat_settings ORDER BY updated_at DESC LIMIT 1`);
      if (result.rows.length === 0) {
        return res.json(DEFAULT_CAT_PARAMS);
      }
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/mlt/admin/cat-settings", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { minQuestions, maxQuestions, timeLimit, stabilityThreshold, exposureMax, contentTargets, abilityCapPerQuestion, rapidGuessThresholdMs, noBacktracking } = req.body;

      const existing = await pool.query(`SELECT id FROM mlt_cat_settings LIMIT 1`);

      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE mlt_cat_settings SET
            min_questions = $1, max_questions = $2, time_limit = $3,
            stability_threshold = $4, exposure_max = $5, content_targets = $6,
            ability_cap_per_question = $7, rapid_guess_threshold_ms = $8,
            no_backtracking = $9, updated_at = NOW()
          WHERE id = $10`,
          [minQuestions, maxQuestions, timeLimit, stabilityThreshold, exposureMax, JSON.stringify(contentTargets), abilityCapPerQuestion, rapidGuessThresholdMs, noBacktracking, existing.rows[0].id]
        );
      } else {
        await pool.query(
          `INSERT INTO mlt_cat_settings (min_questions, max_questions, time_limit, stability_threshold, exposure_max, content_targets, ability_cap_per_question, rapid_guess_threshold_ms, no_backtracking, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
          [minQuestions, maxQuestions, timeLimit, stabilityThreshold, exposureMax, JSON.stringify(contentTargets), abilityCapPerQuestion, rapidGuessThresholdMs, noBacktracking]
        );
      }

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/mlt/admin/cat-simulate", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { profileType, catParams } = req.body;
      const profile = SIMULATION_PROFILES[profileType as keyof typeof SIMULATION_PROFILES];

      if (!profile) {
        return res.status(400).json({ error: "Invalid profile type. Use: strong, average, weak" });
      }

      const qResult = await pool.query(
        `SELECT id, blueprint_category as category, difficulty, subtopic as topic FROM allied_questions WHERE career_type ILIKE '%mlt%' AND status = 'active' ORDER BY RANDOM() LIMIT 500`
      );

      const questions: QuestionCandidate[] = qResult.rows.map((r: any) => ({
        id: r.id,
        category: r.category || "General",
        difficulty: DIFFICULTY_LABELS[r.difficulty] || "medium",
        difficultyNum: r.difficulty || 3,
        topic: r.topic || "",
        hasImage: false,
        exposureCount: 0,
      }));

      if (questions.length === 0) {
        return res.json({
          profile: profileType,
          questionsUsed: 0,
          finalAbility: 0,
          stoppedReason: "no_questions_available",
          totalCorrect: 0,
          totalIncorrect: 0,
          overallScore: 0,
          categoryBreakdown: {},
          note: "No MLT questions available in the question bank. Add questions with career_type='mlt' first.",
        });
      }

      const params: CATParameters = catParams || DEFAULT_CAT_PARAMS;
      const simResult = simulateCAT(profile, questions, params);

      res.json({
        profile: profileType,
        questionsUsed: simResult.questionsUsed,
        finalAbility: Math.round(simResult.finalAbility * 100) / 100,
        stoppedReason: simResult.stoppedReason,
        totalCorrect: simResult.totalCorrect,
        totalIncorrect: simResult.totalIncorrect,
        overallScore: Math.round(simResult.overallScore * 100),
        categoryBreakdown: simResult.categoryBreakdown,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/mlt/admin/cat-categories", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        `SELECT DISTINCT blueprint_category FROM allied_questions WHERE career_type ILIKE '%mlt%' AND status = 'active' ORDER BY blueprint_category`
      );
      res.json(result.rows.map((r: any) => r.blueprint_category).filter(Boolean));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
