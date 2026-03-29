import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin, resolveAuthUser } from "./admin-auth";
import { createRateLimiter, abuseEscalationMiddleware, botDetectionMiddleware } from "./abuse-protection";
import {
  transformPharmtechQuestion,
  selectNextDifficulty,
  getAdaptiveQuestion,
  computeCategoryStats,
  detectWeakAreas,
  computeMasteryLevels,
  getStudyRecommendations,
  updateMasteryHistory,
} from "./pharmtech-adaptive-engine";

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

export function registerPharmtechRoutes(app: Express) {
  const contentBrowseLimiter = createRateLimiter("content_browse");
  const examStartLimiter = createRateLimiter("exam_start");

  app.use("/api/pharmtech", abuseEscalationMiddleware, botDetectionMiddleware, contentBrowseLimiter);

  app.get("/api/pharmtech/lessons", async (req, res) => {
    try {
      const cert = (req.query.cert as string || "").toUpperCase();
      let query = `SELECT * FROM pharmtech_lessons WHERE published = true`;
      const params: any[] = [];
      if (cert === "PTCB" || cert === "PEBC") {
        params.push(cert);
        query += ` AND cert_context IN ($${params.length}, 'BOTH')`;
      }
      query += ` ORDER BY sort_order, title`;
      const { rows } = await pool.query(query, params);
      res.json(rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/pharmtech/lessons/:slug", async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM pharmtech_lessons WHERE slug = $1 AND published = true`,
        [req.params.slug]
      );
      if (!rows[0]) return res.status(404).json({ error: "Lesson not found" });
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/pharmtech/flashcard-decks", async (req, res) => {
    try {
      const cert = (req.query.cert as string || "").toUpperCase();
      let query = `SELECT * FROM pharmtech_flashcard_decks WHERE published = true`;
      const params: any[] = [];
      if (cert === "PTCB" || cert === "PEBC") {
        params.push(cert);
        query += ` AND cert_context IN ($${params.length}, 'BOTH')`;
      }
      query += ` ORDER BY sort_order, title`;
      const { rows } = await pool.query(query, params);
      res.json(rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/pharmtech/flashcard-decks/:slug", async (req, res) => {
    try {
      const { rows: deckRows } = await pool.query(
        `SELECT * FROM pharmtech_flashcard_decks WHERE slug = $1 AND published = true`,
        [req.params.slug]
      );
      if (!deckRows[0]) return res.status(404).json({ error: "Deck not found" });
      const deck = snakeToCamel(deckRows[0]);
      const { rows: cardRows } = await pool.query(
        `SELECT * FROM pharmtech_flashcards WHERE deck_id = $1 ORDER BY sort_order`,
        [deck.id]
      );
      res.json({ ...deck, cards: cardRows.map(snakeToCamel) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/pharmtech/questions", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      const isPro = user && (user.tier === "admin" || user.subscription_status === "active" || user.subscriptionStatus === "active");
      const FREE_LIMIT = 10;

      const category = req.query.category as string | undefined;
      const difficulty = req.query.difficulty ? Number(req.query.difficulty) : undefined;
      const rawCert = req.query.cert as string | undefined;
      const cert = rawCert ? rawCert.toUpperCase() : undefined;
      let query = `SELECT * FROM pharmtech_questions WHERE published = true`;
      const params: any[] = [];
      if (category) { params.push(category); query += ` AND category = $${params.length}`; }
      if (difficulty) { params.push(difficulty); query += ` AND difficulty = $${params.length}`; }
      if (cert) { params.push(cert); query += ` AND cert_context IN ($${params.length}, 'BOTH')`; }
      query += ` ORDER BY category, difficulty`;
      if (!isPro) { query += ` LIMIT ${FREE_LIMIT}`; }
      const { rows } = await pool.query(query, params);
      res.json(rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/pharmtech/exams", async (_req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM pharmtech_exams WHERE published = true ORDER BY sort_order, title`
      );
      res.json(rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/pharmtech/exams/:slug", async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM pharmtech_exams WHERE slug = $1 AND published = true`,
        [req.params.slug]
      );
      if (!rows[0]) return res.status(404).json({ error: "Exam not found" });
      const exam = snakeToCamel(rows[0]);
      const qIds = exam.questionIds || [];
      let questions: any[] = [];
      if (qIds.length > 0) {
        const { rows: qRows } = await pool.query(
          `SELECT * FROM pharmtech_questions WHERE id = ANY($1) AND published = true`,
          [qIds]
        );
        const qMap = new Map(qRows.map((r: any) => [r.id, snakeToCamel(r)]));
        questions = qIds.map((id: string) => qMap.get(id)).filter(Boolean);
      }
      res.json({ ...exam, questions });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/pharmtech/exam-attempts", async (req, res) => {
    try {
      const { examId, mode, totalQuestions, userId } = req.body;
      if (!examId || !totalQuestions) return res.status(400).json({ error: "examId and totalQuestions required" });
      const { rows } = await pool.query(
        `INSERT INTO pharmtech_exam_attempts (exam_id, mode, total_questions, user_id, status) VALUES ($1, $2, $3, $4, 'in_progress') RETURNING *`,
        [examId, mode || "timed", totalQuestions, userId || null]
      );
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/pharmtech/exam-attempts/:id", async (req, res) => {
    try {
      const { answers, flagged, score, timeSpentSeconds, status } = req.body;
      const sets: string[] = [];
      const params: any[] = [];
      if (answers !== undefined) { params.push(JSON.stringify(answers)); sets.push(`answers = $${params.length}::jsonb`); }
      if (flagged !== undefined) { params.push(JSON.stringify(flagged)); sets.push(`flagged = $${params.length}::jsonb`); }
      if (score !== undefined) { params.push(score); sets.push(`score = $${params.length}`); }
      if (timeSpentSeconds !== undefined) { params.push(timeSpentSeconds); sets.push(`time_spent_seconds = $${params.length}`); }
      if (status !== undefined) {
        params.push(status); sets.push(`status = $${params.length}`);
        if (status === "completed") sets.push(`completed_at = NOW()`);
      }
      if (sets.length === 0) return res.status(400).json({ error: "No fields to update" });
      params.push(req.params.id);
      const { rows } = await pool.query(
        `UPDATE pharmtech_exam_attempts SET ${sets.join(", ")} WHERE id = $${params.length} RETURNING *`,
        params
      );
      if (!rows[0]) return res.status(404).json({ error: "Attempt not found" });
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/pharmtech/exam-attempts/:id", async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM pharmtech_exam_attempts WHERE id = $1`,
        [req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: "Attempt not found" });
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/pharmtech/exam-attempts/:id/review", async (req, res) => {
    try {
      const { rows: attemptRows } = await pool.query(
        `SELECT * FROM pharmtech_exam_attempts WHERE id = $1`,
        [req.params.id]
      );
      if (!attemptRows[0]) return res.status(404).json({ error: "Attempt not found" });
      const attempt = snakeToCamel(attemptRows[0]);
      if (attempt.status !== "completed") return res.status(400).json({ error: "Exam not yet completed" });

      const { rows: examRows } = await pool.query(
        `SELECT * FROM pharmtech_exams WHERE id = $1`,
        [attempt.examId]
      );
      if (!examRows[0]) return res.status(404).json({ error: "Exam not found" });
      const exam = snakeToCamel(examRows[0]);

      const qIds = exam.questionIds || [];
      let questions: any[] = [];
      if (qIds.length > 0) {
        const { rows: qRows } = await pool.query(
          `SELECT * FROM pharmtech_questions WHERE id = ANY($1)`,
          [qIds]
        );
        const qMap = new Map(qRows.map((r: any) => [r.id, snakeToCamel(r)]));
        questions = qIds.map((id: string) => qMap.get(id)).filter(Boolean);
      }

      const { rows: lessonRows } = await pool.query(
        `SELECT slug, title, category FROM pharmtech_lessons WHERE published = true`
      );
      const lessonMap = Object.fromEntries(lessonRows.map((r: any) => [r.slug, { title: r.title, category: r.category }]));

      res.json({ attempt, exam, questions, lessonMap });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/pharmtech/stats", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { rows } = await pool.query(`
        SELECT
          (SELECT COUNT(*) FROM pharmtech_lessons) as lesson_count,
          (SELECT COUNT(*) FROM pharmtech_flashcard_decks) as deck_count,
          (SELECT COALESCE(SUM(card_count), 0) FROM pharmtech_flashcard_decks) as flashcard_count,
          (SELECT COUNT(*) FROM pharmtech_questions) as question_count,
          (SELECT COUNT(*) FROM pharmtech_exams) as exam_count
      `);
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/pharmtech/lessons", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { rows } = await pool.query(`SELECT * FROM pharmtech_lessons ORDER BY sort_order, title`);
      res.json(rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/pharmtech/lessons", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { slug, externalId, title, category, summary, body, objectives, keyPoints, commonMistakes, relatedDeckSlugs, seoTitle, seoDescription, published, sortOrder } = req.body;
      if (!slug || !title || !category) return res.status(400).json({ error: "slug, title, category required" });
      const { rows } = await pool.query(
        `INSERT INTO pharmtech_lessons (slug, external_id, title, category, summary, body, objectives, key_points, common_mistakes, related_deck_slugs, seo_title, seo_description, published, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, category=EXCLUDED.category, summary=EXCLUDED.summary, body=EXCLUDED.body, objectives=EXCLUDED.objectives, key_points=EXCLUDED.key_points, common_mistakes=EXCLUDED.common_mistakes, related_deck_slugs=EXCLUDED.related_deck_slugs, seo_title=EXCLUDED.seo_title, seo_description=EXCLUDED.seo_description, published=EXCLUDED.published, sort_order=EXCLUDED.sort_order, updated_at=NOW()
         RETURNING *`,
        [slug, externalId || null, title, category, summary || null, body || "", objectives || [], keyPoints || [], commonMistakes || [], relatedDeckSlugs || [], seoTitle || null, seoDescription || null, published !== false, sortOrder || 0]
      );
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/pharmtech/lessons/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { title, category, summary, body, objectives, keyPoints, commonMistakes, relatedDeckSlugs, seoTitle, seoDescription, published, sortOrder } = req.body;
      const { rows } = await pool.query(
        `UPDATE pharmtech_lessons SET title=COALESCE($1,title), category=COALESCE($2,category), summary=COALESCE($3,summary), body=COALESCE($4,body), objectives=COALESCE($5,objectives), key_points=COALESCE($6,key_points), common_mistakes=COALESCE($7,common_mistakes), related_deck_slugs=COALESCE($8,related_deck_slugs), seo_title=$9, seo_description=$10, published=COALESCE($11,published), sort_order=COALESCE($12,sort_order), updated_at=NOW() WHERE id=$13 RETURNING *`,
        [title, category, summary, body, objectives, keyPoints, commonMistakes, relatedDeckSlugs, seoTitle || null, seoDescription || null, published, sortOrder, req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: "Not found" });
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/pharmtech/lessons/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await pool.query(`DELETE FROM pharmtech_lessons WHERE id = $1`, [req.params.id]);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/pharmtech/import/lessons", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const items = req.body.items || req.body;
      if (!Array.isArray(items)) return res.status(400).json({ error: "Expected array of lessons" });
      let created = 0, updated = 0;
      for (const item of items) {
        const result = await pool.query(
          `INSERT INTO pharmtech_lessons (slug, external_id, title, category, summary, body, objectives, key_points, common_mistakes, related_deck_slugs, seo_title, seo_description, published, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
           ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, category=EXCLUDED.category, summary=EXCLUDED.summary, body=EXCLUDED.body, objectives=EXCLUDED.objectives, key_points=EXCLUDED.key_points, common_mistakes=EXCLUDED.common_mistakes, related_deck_slugs=EXCLUDED.related_deck_slugs, seo_title=EXCLUDED.seo_title, seo_description=EXCLUDED.seo_description, published=EXCLUDED.published, sort_order=EXCLUDED.sort_order, updated_at=NOW()
           RETURNING (xmax = 0) as is_insert`,
          [item.slug, item.externalId || null, item.title, item.category, item.summary || null, item.body || "", item.objectives || [], item.keyPoints || [], item.commonMistakes || [], item.relatedDeckSlugs || [], item.seoTitle || null, item.seoDescription || null, item.published !== false, item.sortOrder || 0]
        );
        if (result.rows[0]?.is_insert) created++; else updated++;
      }
      res.json({ ok: true, created, updated, total: items.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/pharmtech/questions", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { rows } = await pool.query(`SELECT * FROM pharmtech_questions ORDER BY category, difficulty`);
      res.json(rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/pharmtech/questions", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { externalId, stem, options, correctIndex, rationale, category, difficulty, lessonSlug, published } = req.body;
      if (!stem || !rationale || !category) return res.status(400).json({ error: "stem, rationale, category required" });
      const { rows } = await pool.query(
        `INSERT INTO pharmtech_questions (external_id, stem, options, correct_index, rationale, category, difficulty, lesson_slug, published)
         VALUES ($1,$2,$3::jsonb,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [externalId || null, stem, JSON.stringify(options || []), correctIndex || 0, rationale, category, difficulty || 2, lessonSlug || null, published !== false]
      );
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/pharmtech/import/questions", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const items = req.body.items || req.body;
      if (!Array.isArray(items)) return res.status(400).json({ error: "Expected array" });
      let created = 0, updated = 0;
      for (const q of items) {
        const eid = q.externalId || q.external_id || null;
        if (eid) {
          const result = await pool.query(
            `INSERT INTO pharmtech_questions (external_id, stem, options, correct_index, rationale, category, difficulty, lesson_slug, published)
             VALUES ($1,$2,$3::jsonb,$4,$5,$6,$7,$8,$9)
             ON CONFLICT (external_id) DO UPDATE SET stem=EXCLUDED.stem, options=EXCLUDED.options, correct_index=EXCLUDED.correct_index, rationale=EXCLUDED.rationale, category=EXCLUDED.category, difficulty=EXCLUDED.difficulty, lesson_slug=EXCLUDED.lesson_slug, published=EXCLUDED.published
             RETURNING (xmax = 0) as is_insert`,
            [eid, q.stem, JSON.stringify(q.options || []), q.correctIndex ?? q.correct_index ?? 0, q.rationale, q.category, q.difficulty || 2, q.lessonSlug || q.lesson_slug || null, q.published !== false]
          );
          if (result.rows[0]?.is_insert) created++; else updated++;
        } else {
          await pool.query(
            `INSERT INTO pharmtech_questions (stem, options, correct_index, rationale, category, difficulty, lesson_slug, published)
             VALUES ($1,$2::jsonb,$3,$4,$5,$6,$7,$8)`,
            [q.stem, JSON.stringify(q.options || []), q.correctIndex ?? q.correct_index ?? 0, q.rationale, q.category, q.difficulty || 2, q.lessonSlug || q.lesson_slug || null, q.published !== false]
          );
          created++;
        }
      }
      res.json({ ok: true, created, updated, total: items.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/pharmtech/questions/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { stem, options, correctIndex, rationale, category, difficulty, lessonSlug, published } = req.body;
      const { rows } = await pool.query(
        `UPDATE pharmtech_questions SET stem=COALESCE($1,stem), options=COALESCE($2::jsonb,options), correct_index=COALESCE($3,correct_index), rationale=COALESCE($4,rationale), category=COALESCE($5,category), difficulty=COALESCE($6,difficulty), lesson_slug=$7, published=COALESCE($8,published) WHERE id=$9 RETURNING *`,
        [stem, options ? JSON.stringify(options) : null, correctIndex, rationale, category, difficulty, lessonSlug || null, published, req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: "Not found" });
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/pharmtech/questions/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await pool.query(`DELETE FROM pharmtech_questions WHERE id = $1`, [req.params.id]);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/pharmtech/flashcard-decks", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { rows } = await pool.query(`SELECT * FROM pharmtech_flashcard_decks ORDER BY sort_order, title`);
      res.json(rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/pharmtech/flashcard-decks", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { slug, externalId, title, description, category, lessonSlug, published, sortOrder } = req.body;
      if (!slug || !title || !category) return res.status(400).json({ error: "slug, title, category required" });
      const { rows } = await pool.query(
        `INSERT INTO pharmtech_flashcard_decks (slug, external_id, title, description, category, lesson_slug, published, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, category=EXCLUDED.category, lesson_slug=EXCLUDED.lesson_slug, published=EXCLUDED.published, sort_order=EXCLUDED.sort_order, updated_at=NOW()
         RETURNING *`,
        [slug, externalId || null, title, description || "", category, lessonSlug || null, published !== false, sortOrder || 0]
      );
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/pharmtech/import/flashcard-decks", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const items = req.body.items || req.body;
      if (!Array.isArray(items)) return res.status(400).json({ error: "Expected array" });
      let created = 0, updated = 0;
      for (const deck of items) {
        const result = await pool.query(
          `INSERT INTO pharmtech_flashcard_decks (slug, external_id, title, description, category, lesson_slug, published, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, category=EXCLUDED.category, lesson_slug=EXCLUDED.lesson_slug, published=EXCLUDED.published, sort_order=EXCLUDED.sort_order, updated_at=NOW()
           RETURNING id, (xmax = 0) as is_insert`,
          [deck.slug, deck.externalId || null, deck.title, deck.description || "", deck.category, deck.lessonSlug || null, deck.published !== false, deck.sortOrder || 0]
        );
        const deckId = result.rows[0].id;
        if (result.rows[0]?.is_insert) created++; else updated++;

        if (deck.cards && Array.isArray(deck.cards)) {
          await pool.query(`DELETE FROM pharmtech_flashcards WHERE deck_id = $1`, [deckId]);
          for (let i = 0; i < deck.cards.length; i++) {
            const card = deck.cards[i];
            await pool.query(
              `INSERT INTO pharmtech_flashcards (deck_id, front, back, sort_order) VALUES ($1,$2,$3,$4)`,
              [deckId, card.front, card.back, i]
            );
          }
          await pool.query(
            `UPDATE pharmtech_flashcard_decks SET card_count = $1 WHERE id = $2`,
            [deck.cards.length, deckId]
          );
        }
      }
      res.json({ ok: true, created, updated, total: items.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/pharmtech/flashcard-decks/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { title, description, category, lessonSlug, published, sortOrder } = req.body;
      const { rows } = await pool.query(
        `UPDATE pharmtech_flashcard_decks SET title=COALESCE($1,title), description=COALESCE($2,description), category=COALESCE($3,category), lesson_slug=$4, published=COALESCE($5,published), sort_order=COALESCE($6,sort_order), updated_at=NOW() WHERE id=$7 RETURNING *`,
        [title, description, category, lessonSlug || null, published, sortOrder, req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: "Not found" });
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/pharmtech/flashcard-decks/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await pool.query(`DELETE FROM pharmtech_flashcards WHERE deck_id = $1`, [req.params.id]);
      await pool.query(`DELETE FROM pharmtech_flashcard_decks WHERE id = $1`, [req.params.id]);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/pharmtech/exams", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { rows } = await pool.query(`SELECT * FROM pharmtech_exams ORDER BY sort_order, title`);
      res.json(rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/pharmtech/exams", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { slug, externalId, title, description, questionIds, timeLimitMinutes, passingScore, published, sortOrder } = req.body;
      if (!slug || !title) return res.status(400).json({ error: "slug, title required" });
      const { rows } = await pool.query(
        `INSERT INTO pharmtech_exams (slug, external_id, title, description, question_ids, time_limit_minutes, passing_score, published, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, question_ids=EXCLUDED.question_ids, time_limit_minutes=EXCLUDED.time_limit_minutes, passing_score=EXCLUDED.passing_score, published=EXCLUDED.published, sort_order=EXCLUDED.sort_order
         RETURNING *`,
        [slug, externalId || null, title, description || "", questionIds || [], timeLimitMinutes || 60, passingScore || 70, published !== false, sortOrder || 0]
      );
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/pharmtech/import/exams", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const items = req.body.items || req.body;
      if (!Array.isArray(items)) return res.status(400).json({ error: "Expected array" });
      let created = 0, updated = 0;
      for (const exam of items) {
        const result = await pool.query(
          `INSERT INTO pharmtech_exams (slug, external_id, title, description, question_ids, time_limit_minutes, passing_score, published, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
           ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, question_ids=EXCLUDED.question_ids, time_limit_minutes=EXCLUDED.time_limit_minutes, passing_score=EXCLUDED.passing_score, published=EXCLUDED.published, sort_order=EXCLUDED.sort_order
           RETURNING (xmax = 0) as is_insert`,
          [exam.slug, exam.externalId || null, exam.title, exam.description || "", exam.questionIds || [], exam.timeLimitMinutes || 60, exam.passingScore || 70, exam.published !== false, exam.sortOrder || 0]
        );
        if (result.rows[0]?.is_insert) created++; else updated++;
      }
      res.json({ ok: true, created, updated, total: items.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/pharmtech/exams/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { title, description, questionIds, timeLimitMinutes, passingScore, published, sortOrder } = req.body;
      const { rows } = await pool.query(
        `UPDATE pharmtech_exams SET title=COALESCE($1,title), description=COALESCE($2,description), question_ids=COALESCE($3,question_ids), time_limit_minutes=COALESCE($4,time_limit_minutes), passing_score=COALESCE($5,passing_score), published=COALESCE($6,published), sort_order=COALESCE($7,sort_order) WHERE id=$8 RETURNING *`,
        [title, description, questionIds, timeLimitMinutes, passingScore, published, sortOrder, req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: "Not found" });
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/pharmtech/exams/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await pool.query(`DELETE FROM pharmtech_exams WHERE id = $1`, [req.params.id]);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/pharmtech/adaptive/start", async (req, res) => {
    try {
      const { settings } = req.body;
      const user = await resolveAuthUser(req);
      const userId = user?.id || null;

      const startDifficulty = Math.max(1, Math.min(5, Number(settings?.startDifficulty) || 3));
      const certContext = settings?.certContext ? String(settings.certContext).toUpperCase() : undefined;

      const { rows } = await pool.query(
        `INSERT INTO pharmtech_adaptive_sessions (user_id, settings, status, current_difficulty)
         VALUES ($1, $2, 'active', $3) RETURNING *`,
        [userId, JSON.stringify(settings || {}), startDifficulty]
      );

      const session = snakeToCamel(rows[0]);

      const question = await getAdaptiveQuestion(session.id, session.currentDifficulty, [], [], null, certContext);
      if (!question) {
        return res.status(500).json({ error: "No questions available. Please add published questions first." });
      }

      res.json({ session, question });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/pharmtech/adaptive/:sessionId/answer", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { questionId, selectedAnswer, responseTimeMs } = req.body;

      const { rows: sessionRows } = await pool.query(
        `SELECT * FROM pharmtech_adaptive_sessions WHERE id = $1`,
        [sessionId]
      );
      if (!sessionRows[0]) return res.status(404).json({ error: "Session not found" });
      const session = sessionRows[0];

      if (session.status !== "active") {
        return res.status(400).json({ error: "Session is not active" });
      }

      const { rows: qRows } = await pool.query(
        `SELECT * FROM pharmtech_questions WHERE id = $1`,
        [questionId]
      );
      if (!qRows[0]) return res.status(404).json({ error: "Question not found" });
      const q = qRows[0];

      const correctLetter = ["A", "B", "C", "D"][q.correct_index] || "A";
      const isCorrect = selectedAnswer === correctLetter;

      const responses = Array.isArray(session.responses) ? session.responses : [];
      const newResponse = {
        questionId,
        selectedAnswer,
        correctAnswer: correctLetter,
        isCorrect,
        responseTimeMs: responseTimeMs || 0,
        category: q.category,
        difficulty: q.difficulty,
        difficultyLabel: q.difficulty <= 2 ? "easy" : q.difficulty >= 4 ? "hard" : "medium",
      };
      responses.push(newResponse);

      const totalAnswered = responses.length;
      const correctCount = responses.filter((r: any) => r.isCorrect).length;
      const score = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

      const newDifficulty = selectNextDifficulty(session.current_difficulty, isCorrect);
      const categoryStats = computeCategoryStats(responses);
      const settings = session.settings || {};
      const weakThreshold = settings.weakAreaThreshold || 70;
      const weakAreas = detectWeakAreas(categoryStats, weakThreshold);
      const masteryLevels = computeMasteryLevels(categoryStats);

      const diffProgression = Array.isArray(session.difficulty_progression) ? session.difficulty_progression : [];
      diffProgression.push({ index: totalAnswered - 1, difficulty: newDifficulty, correct: isCorrect });

      const usedIds = responses.map((r: any) => r.questionId);

      await pool.query(
        `UPDATE pharmtech_adaptive_sessions SET
          responses = $1::jsonb,
          total_answered = $2,
          correct_count = $3,
          current_difficulty = $4,
          category_stats = $5::jsonb,
          mastery_levels = $6::jsonb,
          weak_areas = $7::jsonb,
          difficulty_progression = $8::jsonb
        WHERE id = $9`,
        [
          JSON.stringify(responses),
          totalAnswered,
          correctCount,
          newDifficulty,
          JSON.stringify(categoryStats),
          JSON.stringify(masteryLevels),
          JSON.stringify(weakAreas),
          JSON.stringify(diffProgression),
          sessionId,
        ]
      );

      const sessionSettings = session.settings ? (typeof session.settings === 'string' ? JSON.parse(session.settings) : session.settings) : {};
      const sessionCertContext = sessionSettings?.certContext ? String(sessionSettings.certContext).toUpperCase() : undefined;
      const nextQuestion = await getAdaptiveQuestion(sessionId, newDifficulty, usedIds, weakAreas, null, sessionCertContext);

      res.json({
        isCorrect,
        correctAnswer: correctLetter,
        rationale: q.rationale || "",
        score,
        correctCount,
        totalAnswered,
        currentDifficulty: newDifficulty,
        nextQuestion,
        hasMoreQuestions: !!nextQuestion,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/pharmtech/adaptive/:sessionId/end", async (req, res) => {
    try {
      const { sessionId } = req.params;

      const { rows } = await pool.query(
        `UPDATE pharmtech_adaptive_sessions SET status = 'completed', completed_at = NOW()
         WHERE id = $1 AND status = 'active' RETURNING *`,
        [sessionId]
      );
      if (!rows[0]) return res.status(404).json({ error: "Session not found or already completed" });

      const session = rows[0];
      const responses = Array.isArray(session.responses) ? session.responses : [];
      const categoryStats = computeCategoryStats(responses);
      const weakAreas = detectWeakAreas(categoryStats, (session.settings as any)?.weakAreaThreshold || 70);
      const masteryLevels = computeMasteryLevels(categoryStats);
      const recommendations = await getStudyRecommendations(weakAreas);

      await updateMasteryHistory(session.user_id, sessionId, categoryStats);

      res.json({
        session: snakeToCamel(session),
        analytics: {
          totalAnswered: session.total_answered,
          correctCount: session.correct_count,
          score: session.total_answered > 0 ? Math.round((session.correct_count / session.total_answered) * 100) : 0,
          categoryStats,
          masteryLevels,
          weakAreas,
          difficultyProgression: session.difficulty_progression || [],
          recommendations,
        },
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/pharmtech/adaptive/:sessionId", async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM pharmtech_adaptive_sessions WHERE id = $1`,
        [req.params.sessionId]
      );
      if (!rows[0]) return res.status(404).json({ error: "Session not found" });

      const session = rows[0];
      const responses = Array.isArray(session.responses) ? session.responses : [];
      const categoryStats = computeCategoryStats(responses);
      const weakAreas = detectWeakAreas(categoryStats, (session.settings as any)?.weakAreaThreshold || 70);
      const masteryLevels = computeMasteryLevels(categoryStats);
      const recommendations = await getStudyRecommendations(weakAreas);

      res.json({
        session: snakeToCamel(session),
        analytics: {
          totalAnswered: session.total_answered,
          correctCount: session.correct_count,
          score: session.total_answered > 0 ? Math.round((session.correct_count / session.total_answered) * 100) : 0,
          categoryStats,
          masteryLevels,
          weakAreas,
          difficultyProgression: session.difficulty_progression || [],
          recommendations,
        },
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/pharmtech/mastery", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      const userId = user?.id || null;

      const { rows: sessions } = await pool.query(
        `SELECT * FROM pharmtech_adaptive_sessions WHERE status = 'completed' ${userId ? `AND user_id = $1` : ''} ORDER BY completed_at DESC LIMIT 20`,
        userId ? [userId] : []
      );

      const allResponses: any[] = [];
      for (const s of sessions) {
        const responses = Array.isArray(s.responses) ? s.responses : [];
        allResponses.push(...responses);
      }

      const categoryStats = computeCategoryStats(allResponses);
      const masteryLevels = computeMasteryLevels(categoryStats);
      const weakAreas = detectWeakAreas(categoryStats);

      const allCategories = await pool.query(
        `SELECT DISTINCT category FROM pharmtech_questions WHERE published = true ORDER BY category`
      );
      const categories = allCategories.rows.map((r: any) => r.category);

      const fullMastery: Record<string, { level: string; accuracy: number; total: number; correct: number }> = {};
      for (const cat of categories) {
        if (categoryStats[cat]) {
          fullMastery[cat] = {
            level: masteryLevels[cat]?.level || "Beginner",
            accuracy: categoryStats[cat].accuracy,
            total: categoryStats[cat].total,
            correct: categoryStats[cat].correct,
          };
        } else {
          fullMastery[cat] = { level: "Beginner", accuracy: 0, total: 0, correct: 0 };
        }
      }

      res.json({
        mastery: fullMastery,
        weakAreas,
        totalSessions: sessions.length,
        totalQuestionsAnswered: allResponses.length,
        overallAccuracy: allResponses.length > 0 ? Math.round((allResponses.filter((r: any) => r.isCorrect).length / allResponses.length) * 100) : 0,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  const PHARMTECH_CATEGORIES = [
    "Pharmacology & Drug Classifications",
    "Dosage Calculations",
    "Pharmacy Law & Regulations",
    "Sterile & Non-Sterile Compounding",
    "Prescription Processing",
    "Patient Safety & Quality Assurance",
  ];


  function generatePharmtechSchedule(config: {
    examDate: string | null;
    daysPerWeek: number;
    minutesPerSession: number;
    pace: string;
    learningStyle: string;
    weakAreas: string[];
  }) {
    const now = new Date();
    let totalWeeks: number;

    if (config.examDate) {
      const exam = new Date(config.examDate);
      const diffMs = exam.getTime() - now.getTime();
      totalWeeks = Math.max(1, Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000)));
    } else {
      totalWeeks = config.pace === "intensive" ? 2 : config.pace === "light" ? 8 : 4;
    }

    totalWeeks = Math.min(totalWeeks, 12);

    const foundationWeeks = Math.max(1, Math.floor(totalWeeks * 0.15));
    const mockExamWeeks = Math.max(1, Math.floor(totalWeeks * 0.15));
    const finalReviewWeeks = Math.max(1, Math.floor(totalWeeks * 0.1));
    const weakAreaWeeks = config.weakAreas.length > 0 ? Math.max(1, Math.floor(totalWeeks * 0.2)) : 0;
    const coreWeeks = Math.max(1, totalWeeks - foundationWeeks - mockExamWeeks - finalReviewWeeks - weakAreaWeeks);

    const tasks: any[] = [];
    let weekNum = 1;
    let sortOrder = 0;

    function addTask(week: number, day: number, phase: string, taskType: string, title: string, category: string, linkUrl: string, minutes: number, desc?: string) {
      tasks.push({
        weekNum: week,
        dayNum: day,
        phase,
        taskType,
        title,
        description: desc || null,
        category,
        linkUrl,
        estimatedMinutes: minutes,
        sortOrder: sortOrder++,
      });
    }

    function getTasksForStyle(style: string, category: string, phase: string, week: number, day: number, minutes: number) {
      if (style === "flashcards") {
        addTask(week, day, phase, "flashcards", `Review ${category} flashcards`, category, `/pharmacy-technician/flashcards`, Math.floor(minutes * 0.6));
        addTask(week, day, phase, "lesson", `Read ${category} lesson`, category, `/pharmacy-technician/lessons`, Math.floor(minutes * 0.4));
      } else if (style === "questions") {
        addTask(week, day, phase, "practice", `Practice ${category} questions`, category, `/pharmacy-technician/practice-questions?category=${encodeURIComponent(category)}`, Math.floor(minutes * 0.6));
        addTask(week, day, phase, "lesson", `Review ${category} lesson`, category, `/pharmacy-technician/lessons`, Math.floor(minutes * 0.4));
      } else if (style === "lessons") {
        addTask(week, day, phase, "lesson", `Study ${category} lesson`, category, `/pharmacy-technician/lessons`, Math.floor(minutes * 0.6));
        addTask(week, day, phase, "flashcards", `Review ${category} flashcards`, category, `/pharmacy-technician/flashcards`, Math.floor(minutes * 0.4));
      } else {
        addTask(week, day, phase, "lesson", `Study ${category} lesson`, category, `/pharmacy-technician/lessons`, Math.floor(minutes * 0.35));
        addTask(week, day, phase, "flashcards", `Review ${category} flashcards`, category, `/pharmacy-technician/flashcards`, Math.floor(minutes * 0.3));
        addTask(week, day, phase, "practice", `Practice ${category} questions`, category, `/pharmacy-technician/practice-questions?category=${encodeURIComponent(category)}`, Math.floor(minutes * 0.35));
      }
    }

    for (let w = 0; w < foundationWeeks; w++) {
      for (let d = 1; d <= config.daysPerWeek; d++) {
        const catIdx = ((w * config.daysPerWeek) + d - 1) % PHARMTECH_CATEGORIES.length;
        const cat = PHARMTECH_CATEGORIES[catIdx];
        addTask(weekNum, d, "foundation", "lesson", `Foundation: ${cat} overview`, cat, `/pharmacy-technician/lessons`, Math.floor(config.minutesPerSession * 0.6), "Build foundational understanding of key concepts");
        addTask(weekNum, d, "foundation", "flashcards", `Foundation: ${cat} key terms`, cat, `/pharmacy-technician/flashcards`, Math.floor(config.minutesPerSession * 0.4), "Learn essential vocabulary and definitions");
      }
      weekNum++;
    }

    for (let w = 0; w < coreWeeks; w++) {
      for (let d = 1; d <= config.daysPerWeek; d++) {
        const catIdx = ((w * config.daysPerWeek) + d - 1) % PHARMTECH_CATEGORIES.length;
        const cat = PHARMTECH_CATEGORIES[catIdx];
        getTasksForStyle(config.learningStyle, cat, "core", weekNum, d, config.minutesPerSession);
      }
      weekNum++;
    }

    if (weakAreaWeeks > 0 && config.weakAreas.length > 0) {
      for (let w = 0; w < weakAreaWeeks; w++) {
        for (let d = 1; d <= config.daysPerWeek; d++) {
          const cat = config.weakAreas[(w * config.daysPerWeek + d - 1) % config.weakAreas.length];
          addTask(weekNum, d, "weak-area", "lesson", `Reinforce: ${cat}`, cat, `/pharmacy-technician/lessons`, Math.floor(config.minutesPerSession * 0.3), "Focus on weak area concepts");
          addTask(weekNum, d, "weak-area", "practice", `Targeted practice: ${cat}`, cat, `/pharmacy-technician/practice-questions?category=${encodeURIComponent(cat)}`, Math.floor(config.minutesPerSession * 0.4), "Practice questions targeting weak areas");
          addTask(weekNum, d, "weak-area", "flashcards", `Reinforce flashcards: ${cat}`, cat, `/pharmacy-technician/flashcards`, Math.floor(config.minutesPerSession * 0.3), "Review flashcards for weak areas");
        }
        weekNum++;
      }
    }

    for (let w = 0; w < mockExamWeeks; w++) {
      for (let d = 1; d <= config.daysPerWeek; d++) {
        if (d <= 2) {
          addTask(weekNum, d, "mock-exam", "exam", `Full-length practice exam`, "All Categories", `/pharmacy-technician/exams`, config.minutesPerSession, "Simulate real exam conditions");
        } else {
          const reviewCat = PHARMTECH_CATEGORIES[(w * config.daysPerWeek + d) % PHARMTECH_CATEGORIES.length];
          addTask(weekNum, d, "mock-exam", "review", `Review exam results & weak spots`, reviewCat, `/pharmacy-technician/practice-questions`, Math.floor(config.minutesPerSession * 0.5), "Analyze mistakes from practice exam");
          addTask(weekNum, d, "mock-exam", "practice", `Targeted remediation: ${reviewCat}`, reviewCat, `/pharmacy-technician/practice-questions?category=${encodeURIComponent(reviewCat)}`, Math.floor(config.minutesPerSession * 0.5), "Practice weak areas from exam");
        }
      }
      weekNum++;
    }

    for (let w = 0; w < finalReviewWeeks; w++) {
      for (let d = 1; d <= config.daysPerWeek; d++) {
        const cat = PHARMTECH_CATEGORIES[d % PHARMTECH_CATEGORIES.length];
        addTask(weekNum, d, "final-review", "flashcards", `Final review: ${cat} flashcards`, cat, `/pharmacy-technician/flashcards`, Math.floor(config.minutesPerSession * 0.4), "Quick review of high-yield concepts");
        addTask(weekNum, d, "final-review", "practice", `Final practice: ${cat}`, cat, `/pharmacy-technician/practice-questions?category=${encodeURIComponent(cat)}`, Math.floor(config.minutesPerSession * 0.6), "Final round of practice questions");
      }
      weekNum++;
    }

    return { tasks, totalWeeks: weekNum - 1 };
  }

  app.post("/api/pharmtech/study-plans", async (req, res) => {
    try {
      const { userId, examDate, daysPerWeek, minutesPerSession, pace, learningStyle, weakAreas, useAdaptiveResults, presetType } = req.body;

      const config = {
        examDate: examDate || null,
        daysPerWeek: daysPerWeek || 5,
        minutesPerSession: minutesPerSession || 30,
        pace: pace || "balanced",
        learningStyle: learningStyle || "mixed",
        weakAreas: weakAreas || [],
      };

      const { tasks, totalWeeks } = generatePharmtechSchedule(config);

      if (userId) {
        await pool.query(
          `UPDATE pharmtech_study_plans SET is_active = false, updated_at = NOW() WHERE user_id = $1 AND is_active = true`,
          [userId]
        );
      }

      const { rows: planRows } = await pool.query(
        `INSERT INTO pharmtech_study_plans (user_id, exam_date, days_per_week, minutes_per_session, pace, learning_style, weak_areas, use_adaptive_results, preset_type, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true) RETURNING *`,
        [userId || null, examDate ? new Date(examDate) : null, config.daysPerWeek, config.minutesPerSession, config.pace, config.learningStyle, JSON.stringify(config.weakAreas), useAdaptiveResults || false, presetType || null]
      );
      const plan = planRows[0];

      for (const task of tasks) {
        await pool.query(
          `INSERT INTO pharmtech_study_plan_tasks (plan_id, week_num, day_num, phase, task_type, title, description, category, link_url, estimated_minutes, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [plan.id, task.weekNum, task.dayNum, task.phase, task.taskType, task.title, task.description, task.category, task.linkUrl, task.estimatedMinutes, task.sortOrder]
        );
      }

      const { rows: taskRows } = await pool.query(
        `SELECT * FROM pharmtech_study_plan_tasks WHERE plan_id = $1 ORDER BY sort_order`,
        [plan.id]
      );

      res.json({ ...snakeToCamel(plan), tasks: taskRows.map(snakeToCamel), totalWeeks });
    } catch (e: any) {
      console.error("[PharmtechStudyPlan] Create error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/pharmtech/study-plans/:planId", async (req, res) => {
    try {
      const { rows: planRows } = await pool.query(
        `SELECT * FROM pharmtech_study_plans WHERE id = $1`,
        [req.params.planId]
      );
      if (!planRows[0]) return res.status(404).json({ error: "Plan not found" });

      const { rows: taskRows } = await pool.query(
        `SELECT * FROM pharmtech_study_plan_tasks WHERE plan_id = $1 ORDER BY week_num, day_num, sort_order`,
        [req.params.planId]
      );

      const totalTasks = taskRows.length;
      const completedTasks = taskRows.filter((t: any) => t.completed).length;
      const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      if (progressPercent !== planRows[0].progress_percent) {
        await pool.query(`UPDATE pharmtech_study_plans SET progress_percent = $1, updated_at = NOW() WHERE id = $2`, [progressPercent, req.params.planId]);
      }

      res.json({ ...snakeToCamel(planRows[0]), progressPercent, totalTasks, completedTasks, tasks: taskRows.map(snakeToCamel) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/pharmtech/study-plans/user/:userId", async (req, res) => {
    try {
      const { rows: planRows } = await pool.query(
        `SELECT * FROM pharmtech_study_plans WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC LIMIT 1`,
        [req.params.userId]
      );
      if (!planRows[0]) return res.json(null);

      const { rows: taskRows } = await pool.query(
        `SELECT * FROM pharmtech_study_plan_tasks WHERE plan_id = $1 ORDER BY week_num, day_num, sort_order`,
        [planRows[0].id]
      );

      const totalTasks = taskRows.length;
      const completedTasks = taskRows.filter((t: any) => t.completed).length;
      const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      res.json({ ...snakeToCamel(planRows[0]), progressPercent, totalTasks, completedTasks, tasks: taskRows.map(snakeToCamel) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/pharmtech/study-plan-tasks/:taskId", async (req, res) => {
    try {
      const { completed, skipped, rescheduledTo } = req.body;
      const sets: string[] = [];
      const params: any[] = [];

      if (completed !== undefined) {
        params.push(completed); sets.push(`completed = $${params.length}`);
        if (completed) sets.push(`completed_at = NOW()`);
        else sets.push(`completed_at = NULL`);
      }
      if (skipped !== undefined) { params.push(skipped); sets.push(`skipped = $${params.length}`); }
      if (rescheduledTo !== undefined) { params.push(rescheduledTo); sets.push(`rescheduled_to = $${params.length}`); }

      if (sets.length === 0) return res.status(400).json({ error: "No fields to update" });

      params.push(req.params.taskId);
      const { rows } = await pool.query(
        `UPDATE pharmtech_study_plan_tasks SET ${sets.join(", ")} WHERE id = $${params.length} RETURNING *`,
        params
      );
      if (!rows[0]) return res.status(404).json({ error: "Task not found" });

      const planId = rows[0].plan_id;
      const { rows: allTasks } = await pool.query(
        `SELECT completed FROM pharmtech_study_plan_tasks WHERE plan_id = $1`,
        [planId]
      );
      const total = allTasks.length;
      const done = allTasks.filter((t: any) => t.completed).length;
      const progress = total > 0 ? Math.round((done / total) * 100) : 0;
      await pool.query(`UPDATE pharmtech_study_plans SET progress_percent = $1, updated_at = NOW() WHERE id = $2`, [progress, planId]);

      res.json({ task: snakeToCamel(rows[0]), progressPercent: progress, totalTasks: total, completedTasks: done });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/pharmtech/study-plans/:planId/refresh", async (req, res) => {
    try {
      const { rows: planRows } = await pool.query(
        `SELECT * FROM pharmtech_study_plans WHERE id = $1`,
        [req.params.planId]
      );
      if (!planRows[0]) return res.status(404).json({ error: "Plan not found" });
      const plan = planRows[0];

      await pool.query(`DELETE FROM pharmtech_study_plan_tasks WHERE plan_id = $1 AND completed = false`, [plan.id]);

      const weakAreas = typeof plan.weak_areas === "string" ? JSON.parse(plan.weak_areas) : (plan.weak_areas || []);
      const config = {
        examDate: plan.exam_date ? plan.exam_date.toISOString() : null,
        daysPerWeek: plan.days_per_week || 5,
        minutesPerSession: plan.minutes_per_session || 30,
        pace: plan.pace || "balanced",
        learningStyle: plan.learning_style || "mixed",
        weakAreas,
      };

      const { tasks: newTasks } = generatePharmtechSchedule(config);

      const { rows: existingTasks } = await pool.query(
        `SELECT week_num, day_num, sort_order FROM pharmtech_study_plan_tasks WHERE plan_id = $1`,
        [plan.id]
      );
      const existingKeys = new Set(existingTasks.map((t: any) => `${t.week_num}-${t.day_num}-${t.sort_order}`));

      for (const task of newTasks) {
        const key = `${task.weekNum}-${task.dayNum}-${task.sortOrder}`;
        if (!existingKeys.has(key)) {
          await pool.query(
            `INSERT INTO pharmtech_study_plan_tasks (plan_id, week_num, day_num, phase, task_type, title, description, category, link_url, estimated_minutes, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [plan.id, task.weekNum, task.dayNum, task.phase, task.taskType, task.title, task.description, task.category, task.linkUrl, task.estimatedMinutes, task.sortOrder]
          );
        }
      }

      await pool.query(`UPDATE pharmtech_study_plans SET updated_at = NOW() WHERE id = $1`, [plan.id]);

      const { rows: allTasks } = await pool.query(
        `SELECT * FROM pharmtech_study_plan_tasks WHERE plan_id = $1 ORDER BY week_num, day_num, sort_order`,
        [plan.id]
      );

      const totalT = allTasks.length;
      const completedT = allTasks.filter((t: any) => t.completed).length;
      const prog = totalT > 0 ? Math.round((completedT / totalT) * 100) : 0;

      res.json({ ...snakeToCamel(plan), progressPercent: prog, totalTasks: totalT, completedTasks: completedT, tasks: allTasks.map(snakeToCamel) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/pharmtech/adaptive-history", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      const userId = user?.id || null;

      const { rows } = await pool.query(
        `SELECT id, status, total_answered, correct_count, current_difficulty, category_stats, mastery_levels, weak_areas, started_at, completed_at
         FROM pharmtech_adaptive_sessions
         WHERE status = 'completed' ${userId ? `AND user_id = $1` : ''}
         ORDER BY completed_at DESC LIMIT 20`,
        userId ? [userId] : []
      );

      res.json(rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/pharmtech/study-plans", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { rows } = await pool.query(`
        SELECT sp.*,
          (SELECT COUNT(*) FROM pharmtech_study_plan_tasks WHERE plan_id = sp.id) as task_count,
          (SELECT COUNT(*) FROM pharmtech_study_plan_tasks WHERE plan_id = sp.id AND completed = true) as completed_count
        FROM pharmtech_study_plans sp
        ORDER BY sp.created_at DESC
        LIMIT 100
      `);
      res.json(rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/pharmtech/study-plans/analytics", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { rows } = await pool.query(`
        SELECT
          COUNT(*)::int as total_plans,
          COUNT(*) FILTER (WHERE is_active = true)::int as active_plans,
          COUNT(*) FILTER (WHERE progress_percent >= 100)::int as completed_plans,
          ROUND(AVG(progress_percent), 1) as avg_progress,
          COUNT(DISTINCT user_id)::int as unique_users,
          COUNT(*) FILTER (WHERE pace = 'light')::int as light_count,
          COUNT(*) FILTER (WHERE pace = 'balanced')::int as balanced_count,
          COUNT(*) FILTER (WHERE pace = 'intensive')::int as intensive_count,
          COUNT(*) FILTER (WHERE preset_type IS NOT NULL)::int as preset_count
        FROM pharmtech_study_plans
      `);
      res.json(snakeToCamel(rows[0] || {}));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/pharmtech/stats", async (_req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT
          (SELECT COUNT(*) FROM pharmtech_lessons WHERE published = true) as lesson_count,
          (SELECT COUNT(*) FROM pharmtech_flashcard_decks WHERE published = true) as deck_count,
          (SELECT COALESCE(SUM(card_count), 0) FROM pharmtech_flashcard_decks WHERE published = true) as flashcard_count,
          (SELECT COUNT(*) FROM pharmtech_questions WHERE published = true) as question_count,
          (SELECT COUNT(*) FROM pharmtech_exams WHERE published = true) as exam_count
      `);
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
