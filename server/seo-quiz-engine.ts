import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { resolveAuthUser } from "./admin-auth";

/* =========================
   HELPERS
========================= */

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function generatePageTitle(topic: string, examType?: string, difficulty?: string): string {
  return [
    topic,
    examType?.toUpperCase(),
    "Practice Questions",
    difficulty && difficulty !== "mixed" ? `(${capitalize(difficulty)})` : null,
  ].filter(Boolean).join(" ");
}

function generateMetaDescription(topic: string, examType?: string, count = 10): string {
  const exam = examType ? ` ${examType.toUpperCase()}` : "";
  return `Practice ${count}+ free ${topic}${exam} questions with detailed explanations and score tracking.`;
}

function sendError(res: Response, error: any) {
  res.status(500).json({ error: error.message || "Internal server error" });
}

/* =========================
   QUERY BUILDERS
========================= */

type PracticeQuizListFilters = {
  topic?: string;
  careerType?: string;
  difficulty?: string;
  limit: number;
  offset: number;
};

function buildPracticeQuizPublishedWhere(filters: PracticeQuizListFilters): { whereSql: string; params: unknown[]; nextIdx: number } {
  const parts = [`status = 'published'`];
  const params: unknown[] = [];
  let i = 1;
  if (filters.topic) {
    parts.push(`topic = $${i++}`);
    params.push(filters.topic);
  }
  if (filters.careerType) {
    parts.push(`career_type = $${i++}`);
    params.push(filters.careerType);
  }
  if (filters.difficulty && filters.difficulty !== "mixed") {
    parts.push(`difficulty = $${i++}`);
    params.push(filters.difficulty);
  }
  return { whereSql: parts.join(" AND "), params, nextIdx: i };
}

function buildPageQuery(filters: PracticeQuizListFilters) {
  const { whereSql, params, nextIdx } = buildPracticeQuizPublishedWhere(filters);
  const query = `SELECT id, slug, title, meta_description, h1, topic, subtopic, body_system, career_type, exam_type, difficulty,
                        question_count, related_page_slugs, keywords, is_auto_generated, status, view_count, created_at, updated_at
                 FROM practice_quiz_pages
                 WHERE ${whereSql}
                 ORDER BY view_count DESC, created_at DESC
                 LIMIT $${nextIdx} OFFSET $${nextIdx + 1}`;
  return { query, params: [...params, filters.limit, filters.offset] };
}

function buildPageCountQuery(filters: PracticeQuizListFilters) {
  const { whereSql, params } = buildPracticeQuizPublishedWhere(filters);
  return {
    query: `SELECT COUNT(*)::int AS total FROM practice_quiz_pages WHERE ${whereSql}`,
    params,
  };
}

/* =========================
   CORE ROUTES
========================= */

export function registerSeoQuizRoutes(app: Express) {

  /* ===== LIST PAGES ===== */

  app.get("/api/seo-quiz/pages", async (req, res) => {
    try {
      const filters: PracticeQuizListFilters = {
        topic: req.query.topic ? String(req.query.topic) : undefined,
        careerType: req.query.careerType ? String(req.query.careerType) : undefined,
        difficulty: req.query.difficulty ? String(req.query.difficulty) : undefined,
        limit: Number(req.query.limit || 50),
        offset: Number(req.query.offset || 0),
      };

      const { query, params } = buildPageQuery(filters);
      const pages = await pool.query(query, params);

      const { query: countQuery, params: countParams } = buildPageCountQuery(filters);
      const total = await pool.query(countQuery, countParams);

      res.json({
        pages: pages.rows,
        total: Number(total.rows[0]?.total ?? 0),
      });

    } catch (e) {
      sendError(res, e);
    }
  });

  /* ===== SINGLE PAGE ===== */

  app.get("/api/seo-quiz/page/:slug", async (req, res) => {
    try {
      const { slug } = req.params;

      const pageRes = await pool.query(
        `UPDATE practice_quiz_pages SET view_count=view_count+1 WHERE slug=$1 RETURNING *`,
        [slug]
      );

      if (!pageRes.rows[0]) {
        return res.status(404).json({ error: "Page not found" });
      }

      const page = pageRes.rows[0];
      const questionIds = page.question_ids || [];

      const qRes = await pool.query(
        `SELECT id, stem, options, correct_answer, rationale, topic, body_system, difficulty, question_type, clinical_pearl
         FROM exam_questions WHERE id=ANY($1) AND status='published'`,
        [questionIds]
      );

      const user = await resolveAuthUser(req as any).catch(() => null);
      const isFree = !user || user.tier === "free";

      const questions = qRes.rows.map((q: any, i: number) => ({
        ...q,
        correctAnswer: isFree && i >= 5 ? undefined : q.correct_answer,
        rationale: isFree && i >= 5 ? undefined : q.rationale,
        locked: isFree && i >= 5,
      }));

      res.json({
        page,
        questions,
        freeLimit: isFree ? 5 : null,
        totalQuestions: questions.length,
      });

    } catch (e) {
      sendError(res, e);
    }
  });

  /* ===== GENERATE SEO PAGES ===== */

  app.post("/api/seo-quiz/generate-pages", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any).catch(() => null);
      if (!user || user.tier !== "admin") {
        return res.status(403).json({ error: "Admin required" });
      }

      const topics = await pool.query(`
        SELECT topic, body_system, tier, career_type, COUNT(*) as count
        FROM exam_questions
        WHERE status='published' AND topic IS NOT NULL
        GROUP BY topic, body_system, tier, career_type
        HAVING COUNT(*) >= 5
      `);

      let created = 0, updated = 0;

      for (const t of topics.rows) {
        const slug = slugify(`${t.topic}-practice-questions`);

        const existing = await pool.query(
          `SELECT id FROM practice_quiz_pages WHERE slug=$1`,
          [slug]
        );

        const questionIds = (await pool.query(
          `SELECT id FROM exam_questions WHERE topic=$1 LIMIT 10`,
          [t.topic]
        )).rows.map((r: any) => r.id);

        const title = generatePageTitle(t.topic, t.tier);
        const meta = generateMetaDescription(t.topic, t.tier, questionIds.length);

        if (existing.rows.length) {
          await pool.query(
            `UPDATE practice_quiz_pages SET question_ids=$1 WHERE slug=$2`,
            [questionIds, slug]
          );
          updated++;
        } else {
          await pool.query(
            `INSERT INTO practice_quiz_pages
             (id, slug, title, meta_description, topic, body_system, career_type, exam_type, question_ids, status)
             VALUES (gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7,$8,'published')`,
            [slug, title, meta, t.topic, t.body_system, t.career_type, t.tier, questionIds]
          );
          created++;
        }
      }

      res.json({ created, updated });

    } catch (e) {
      sendError(res, e);
    }
  });

  /* ===== SITEMAP ===== */

  app.get("/api/seo-quiz/sitemap", async (_req, res) => {
    try {
      const pages = await pool.query(
        `SELECT slug, updated_at FROM practice_quiz_pages WHERE status='published'`
      );

      const base = "https://www.nursenest.ca";

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.rows.map((p: any) => `
  <url>
    <loc>${base}/en/quiz/${p.slug}</loc>
    <lastmod>${new Date(p.updated_at).toISOString().split("T")[0]}</lastmod>
  </url>`).join("")}
</urlset>`;

      res.set("Content-Type", "application/xml").send(xml);

    } catch (e) {
      sendError(res, e);
    }
  });

  /* ===== OFFLINE PACKS ===== */

  app.get("/api/offline/packs", async (_req, res) => {
    try {
      const result = await pool.query(`
        SELECT topic, tier, COUNT(*) as count
        FROM exam_questions
        WHERE status='published'
        GROUP BY topic, tier
        LIMIT 50
      `);

      res.json(result.rows.map((r: any) => ({
        id: slugify(`${r.topic}-${r.tier}`),
        title: `${r.topic} (${r.tier})`,
        count: Number(r.count),
      })));

    } catch (e) {
      sendError(res, e);
    }
  });

}