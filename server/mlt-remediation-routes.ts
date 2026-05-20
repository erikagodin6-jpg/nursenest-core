import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin, resolveAuthUser } from "./admin-auth";
import {
  findRemediationContent,
  getDashboardRecommendations,
  trackRemediationClick,
  getRemediationAnalytics,
  DEFAULT_RELEVANCE_WEIGHTS,
} from "./mlt-remediation-engine";

async function ensureRemediationTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mlt_content_links (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id VARCHAR NOT NULL,
        primary_lesson_id VARCHAR,
        related_lesson_ids JSONB DEFAULT '[]'::jsonb,
        primary_deck_id VARCHAR,
        related_deck_ids JSONB DEFAULT '[]'::jsonb,
        remediation_lesson_id VARCHAR,
        remediation_deck_id VARCHAR,
        auto_link_score INTEGER DEFAULT 0,
        manually_curated BOOLEAN DEFAULT false,
        curated_by VARCHAR,
        curated_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mlt_remediation_analytics (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        question_id VARCHAR NOT NULL,
        content_type TEXT NOT NULL,
        content_id VARCHAR NOT NULL,
        action TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_mlt_content_links_question ON mlt_content_links(question_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_mlt_remediation_analytics_user ON mlt_remediation_analytics(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_mlt_remediation_analytics_question ON mlt_remediation_analytics(question_id)`);
  } catch (e: any) {
    console.error("Failed to create remediation tables:", e.message);
  }
}

export function registerMltRemediationRoutes(app: Express) {
  ensureRemediationTables();

  app.get("/api/mlt/remediation/dashboard/recommendations", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const result = await getDashboardRecommendations(user.id);
      res.json(result);
    } catch (e: any) {
      console.error("MLT dashboard recommendations error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/mlt/remediation/track", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { questionId, contentType, contentId, action } = req.body;
      if (!questionId || !contentType || !contentId || !action) {
        return res.status(400).json({ error: "questionId, contentType, contentId, and action are required" });
      }

      await trackRemediationClick(user.id, questionId, contentType, contentId, action);
      res.json({ ok: true });
    } catch (e: any) {
      console.error("MLT remediation track error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/mlt/remediation/wrong-answers", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const sessionsResult = await pool.query(
        `SELECT response_history FROM mlt_exam_sessions
         WHERE user_id = $1 AND status = 'completed'
         ORDER BY completed_at DESC LIMIT 10`,
        [user.id]
      );

      const wrongAnswerIds: Set<string> = new Set();
      const wrongAnswerDetails: any[] = [];

      for (const session of sessionsResult.rows) {
        const responses = typeof session.response_history === "string"
          ? JSON.parse(session.response_history)
          : (session.response_history || []);

        for (const r of responses) {
          if (!r.isCorrect && r.questionId && !wrongAnswerIds.has(r.questionId)) {
            wrongAnswerIds.add(r.questionId);
            wrongAnswerDetails.push({
              questionId: r.questionId,
              selectedAnswer: r.selectedAnswer,
              category: r.category,
              difficulty: r.difficulty,
            });
          }
        }
      }

      const enrichedWrongAnswers = [];
      for (const wa of wrongAnswerDetails.slice(0, 20)) {
        const qResult = await pool.query(
          `SELECT id, stem, blueprint_category, subtopic, difficulty, correct_answer, options, rationale_long
           FROM allied_questions WHERE id = $1`,
          [wa.questionId]
        );

        if (qResult.rows[0]) {
          const q = qResult.rows[0];
          const ANSWER_LETTERS = ["A", "B", "C", "D"];
          enrichedWrongAnswers.push({
            questionId: q.id,
            stem: q.stem,
            discipline: q.blueprint_category,
            subtopic: q.subtopic,
            difficulty: q.difficulty,
            selectedAnswer: wa.selectedAnswer,
            correctAnswer: ANSWER_LETTERS[q.correct_answer] || "A",
            rationale: q.rationale_long,
          });
        }
      }

      res.json({
        wrongAnswers: enrichedWrongAnswers,
        totalWrongAnswers: wrongAnswerIds.size,
      });
    } catch (e: any) {
      console.error("MLT wrong answers error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/mlt/remediation/:questionId", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { questionId } = req.params;
      const result = await findRemediationContent(questionId);
      res.json(result);
    } catch (e: any) {
      console.error("MLT remediation lookup error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/mlt/content-links/:questionId", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { questionId } = req.params;
      const {
        primaryLessonId,
        relatedLessonIds,
        primaryDeckId,
        relatedDeckIds,
        remediationLessonId,
        remediationDeckId,
      } = req.body;

      const existing = await pool.query(
        `SELECT id FROM mlt_content_links WHERE question_id = $1`,
        [questionId]
      );

      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE mlt_content_links SET
            primary_lesson_id = $1,
            related_lesson_ids = $2,
            primary_deck_id = $3,
            related_deck_ids = $4,
            remediation_lesson_id = $5,
            remediation_deck_id = $6,
            manually_curated = true,
            curated_by = $7,
            curated_at = NOW(),
            updated_at = NOW()
          WHERE question_id = $8`,
          [
            primaryLessonId || null,
            JSON.stringify(relatedLessonIds || []),
            primaryDeckId || null,
            JSON.stringify(relatedDeckIds || []),
            remediationLessonId || null,
            remediationDeckId || null,
            (admin as any).id || "admin",
            questionId,
          ]
        );
      } else {
        await pool.query(
          `INSERT INTO mlt_content_links
           (id, question_id, primary_lesson_id, related_lesson_ids, primary_deck_id, related_deck_ids,
            remediation_lesson_id, remediation_deck_id, auto_link_score, manually_curated, curated_by, curated_at, created_at, updated_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 100, true, $8, NOW(), NOW(), NOW())`,
          [
            questionId,
            primaryLessonId || null,
            JSON.stringify(relatedLessonIds || []),
            primaryDeckId || null,
            JSON.stringify(relatedDeckIds || []),
            remediationLessonId || null,
            remediationDeckId || null,
            (admin as any).id || "admin",
          ]
        );
      }

      res.json({ ok: true, questionId, manuallyCurated: true });
    } catch (e: any) {
      console.error("MLT content links update error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/content-links", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { page = "1", limit = "50", manuallyCurated } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      let where = "";
      const params: any[] = [];
      let idx = 1;

      if (manuallyCurated === "true") {
        where = `WHERE cl.manually_curated = true`;
      }

      const countResult = await pool.query(
        `SELECT COUNT(*)::int as total FROM mlt_content_links cl ${where}`,
        params
      );

      const dataResult = await pool.query(
        `SELECT cl.*, q.stem, q.blueprint_category, q.subtopic
         FROM mlt_content_links cl
         LEFT JOIN allied_questions q ON cl.question_id = q.id
         ${where}
         ORDER BY cl.updated_at DESC
         LIMIT $${idx++} OFFSET $${idx++}`,
        [...params, parseInt(limit as string), offset]
      );

      res.json({
        links: dataResult.rows,
        total: countResult.rows[0]?.total || 0,
        page: parseInt(page as string),
        totalPages: Math.ceil((countResult.rows[0]?.total || 0) / parseInt(limit as string)),
      });
    } catch (e: any) {
      console.error("MLT content links list error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/content-links/:questionId", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { questionId } = req.params;
      const result = await pool.query(
        `SELECT cl.*, q.stem, q.blueprint_category, q.subtopic
         FROM mlt_content_links cl
         LEFT JOIN allied_questions q ON cl.question_id = q.id
         WHERE cl.question_id = $1`,
        [questionId]
      );

      if (result.rows.length === 0) {
        const autoResult = await findRemediationContent(questionId);
        return res.json({
          autoLinked: true,
          ...autoResult,
          questionId,
        });
      }

      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/mlt/content-links/:questionId", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      await pool.query(
        `DELETE FROM mlt_content_links WHERE question_id = $1`,
        [req.params.questionId]
      );

      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/remediation/analytics", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const analytics = await getRemediationAnalytics();

      const linksStats = await pool.query(
        `SELECT
          COUNT(*)::int as total_links,
          COUNT(*) FILTER (WHERE manually_curated = true)::int as manual_links,
          COUNT(*) FILTER (WHERE manually_curated = false)::int as auto_links,
          ROUND(AVG(auto_link_score), 1) as avg_link_score
         FROM mlt_content_links`
      );

      res.json({
        ...analytics,
        contentLinks: linksStats.rows[0] || { total_links: 0, manual_links: 0, auto_links: 0, avg_link_score: 0 },
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/lessons-list", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        `SELECT l.id, l.title, l.slug, m.domain as discipline
         FROM allied_lessons l
         LEFT JOIN allied_modules m ON l.module_id = m.id
         WHERE l.career_type = 'mlt'
         ORDER BY m.domain, l.order_index`
      );

      res.json({ lessons: result.rows });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/decks-list", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        `SELECT id, title, description, career_type
         FROM flashcard_decks
         WHERE career_type = 'mlt' OR title ILIKE '%mlt%'
         ORDER BY title`
      );

      res.json({ decks: result.rows });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
