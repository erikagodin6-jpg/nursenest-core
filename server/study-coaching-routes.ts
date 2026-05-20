import type { Express } from "express";
import { resolveAuthUser } from "./admin-auth";
import { pool } from "./storage";
import {
  ensureStudyCoachingTables,
  getOrCreateStudentProfile,
  recordQuestionAnswer,
  getTopicMasteryScores,
  calculateReadiness,
  getStudyRecommendations,
  generateCustomPracticeSession,
  generateStudyPlan,
  processSpacedRepetition,
  getDueFlashcards,
  checkExamPrepMode,
  generateCourseFromBlueprint,
  getAdminAggregateAnalytics,
  logStudyTime,
} from "./study-coaching-engine";

export function registerStudyCoachingRoutes(app: Express) {
  ensureStudyCoachingTables().catch(err => console.error("Study coaching tables error:", err));

  app.get("/api/study-coaching/profile", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const profile = await getOrCreateStudentProfile(user.id);
      const examPrepMode = await checkExamPrepMode(user.id);
      res.json({ ...profile, examPrepMode });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/study-coaching/profile", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const { examDate, hoursPerWeek, weeklyGoalHours } = req.body;
      await getOrCreateStudentProfile(user.id);

      const updates: string[] = [];
      const params: any[] = [user.id];
      let paramIdx = 2;

      if (examDate !== undefined) {
        updates.push(`exam_date = $${paramIdx}`);
        params.push(examDate);
        paramIdx++;
      }
      if (hoursPerWeek !== undefined) {
        updates.push(`hours_per_week = $${paramIdx}`);
        params.push(hoursPerWeek);
        paramIdx++;
      }
      if (weeklyGoalHours !== undefined) {
        updates.push(`weekly_goal_hours = $${paramIdx}`);
        params.push(weeklyGoalHours);
        paramIdx++;
      }

      if (updates.length > 0) {
        updates.push("updated_at = NOW()");
        await pool.query(
          `UPDATE student_study_profiles SET ${updates.join(", ")} WHERE user_id = $1`,
          params
        );
      }

      const profile = await getOrCreateStudentProfile(user.id);
      res.json(profile);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/study-coaching/mastery", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const scores = await getTopicMasteryScores(user.id);
      res.json(scores);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/study-coaching/record-answer", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const { topic, subtopic, isCorrect, timeSeconds } = req.body;
      if (!topic || isCorrect === undefined) {
        return res.status(400).json({ error: "Missing required fields: topic, isCorrect" });
      }
      await recordQuestionAnswer(user.id, topic, subtopic || null, isCorrect, timeSeconds || 0);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/study-coaching/readiness", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const readiness = await calculateReadiness(user.id);
      res.json(readiness);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/study-coaching/recommendations", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const recommendations = await getStudyRecommendations(user.id);
      res.json(recommendations);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/study-coaching/practice-session", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const { totalQuestions } = req.body;
      const session = await generateCustomPracticeSession(user.id, totalQuestions || 20);
      res.json(session);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/study-coaching/study-plan", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const { examDate, hoursPerWeek } = req.body;
      const plan = await generateStudyPlan(user.id, examDate || null, hoursPerWeek || 10);
      res.json(plan);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/study-coaching/study-plan", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const result = await pool.query(
        `SELECT * FROM study_plan_schedule WHERE user_id = $1 ORDER BY date ASC`,
        [user.id]
      );
      res.json(result.rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/study-coaching/spaced-repetition/review", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const { cardId, quality } = req.body;
      if (!cardId || quality === undefined) {
        return res.status(400).json({ error: "Missing cardId or quality" });
      }
      const result = await processSpacedRepetition(user.id, cardId, quality);
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/study-coaching/spaced-repetition/due", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const limit = parseInt(req.query.limit as string) || 20;
      const cards = await getDueFlashcards(user.id, limit);
      res.json(cards);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/study-coaching/accuracy-trends", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const days = parseInt(req.query.days as string) || 30;
      const result = await pool.query(
        `SELECT * FROM accuracy_trends WHERE user_id = $1 ORDER BY date DESC LIMIT $2`,
        [user.id, days]
      );
      res.json(result.rows.reverse());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/study-coaching/alerts", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const result = await pool.query(
        `SELECT * FROM weak_area_alerts WHERE user_id = $1 AND dismissed = false ORDER BY created_at DESC`,
        [user.id]
      );
      res.json(result.rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/study-coaching/alerts/:id/dismiss", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      await pool.query(
        `UPDATE weak_area_alerts SET dismissed = true WHERE id = $1 AND user_id = $2`,
        [req.params.id, user.id]
      );
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/study-coaching/milestones", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const result = await pool.query(
        `SELECT * FROM study_milestones WHERE user_id = $1 ORDER BY earned_at DESC`,
        [user.id]
      );
      res.json(result.rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/study-coaching/milestones/:id/seen", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      await pool.query(
        `UPDATE study_milestones SET seen = true WHERE id = $1 AND user_id = $2`,
        [req.params.id, user.id]
      );
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/study-coaching/log-time", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const { minutes } = req.body;
      if (!minutes || minutes <= 0) return res.status(400).json({ error: "Invalid minutes" });
      await logStudyTime(user.id, minutes);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/study-coaching/dashboard", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const [profile, mastery, readiness, recommendations, alerts, milestones, trends] = await Promise.all([
        getOrCreateStudentProfile(user.id),
        getTopicMasteryScores(user.id),
        calculateReadiness(user.id),
        getStudyRecommendations(user.id),
        pool.query(`SELECT * FROM weak_area_alerts WHERE user_id = $1 AND dismissed = false ORDER BY created_at DESC LIMIT 5`, [user.id]),
        pool.query(`SELECT * FROM study_milestones WHERE user_id = $1 ORDER BY earned_at DESC LIMIT 10`, [user.id]),
        pool.query(`SELECT * FROM accuracy_trends WHERE user_id = $1 ORDER BY date DESC LIMIT 30`, [user.id]),
      ]);

      const examPrepMode = await checkExamPrepMode(user.id);

      res.json({
        profile,
        mastery,
        readiness,
        recommendations,
        alerts: alerts.rows,
        milestones: milestones.rows,
        accuracyTrends: trends.rows.reverse(),
        examPrepMode,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/study-coaching/generate-course", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin only" });
      const { blueprintId } = req.body;
      if (!blueprintId) return res.status(400).json({ error: "Missing blueprintId" });
      const course = await generateCourseFromBlueprint(blueprintId);
      res.json(course);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/study-coaching/courses", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const result = await pool.query(`SELECT * FROM generated_courses ORDER BY created_at DESC`);
      res.json(result.rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/study-coaching/courses/:id", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const result = await pool.query(`SELECT * FROM generated_courses WHERE id = $1`, [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: "Course not found" });
      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/study-analytics", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin only" });
      const analytics = await getAdminAggregateAnalytics();
      res.json(analytics);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/study-coaching/blueprints", async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM exam_blueprints WHERE active = true ORDER BY exam_name ASC`);
      res.json(result.rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
