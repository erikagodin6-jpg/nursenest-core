import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin, resolveAuthUser } from "./admin-auth";
import { insertImagingSeoPageSchema, insertImagingBlogArticleSchema } from "@shared/schema";

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    result[camelKey] = snakeToCamel(value);
  }
  return result;
}

export function registerImagingSeoRoutes(app: Express) {

  app.get("/api/imaging-seo/pages", async (req, res) => {
    try {
      const { country, pageType, topic, status, limit, offset } = req.query;
      let where = "WHERE 1=1";
      const params: any[] = [];
      let idx = 1;

      if (country) { where += ` AND country = $${idx++}`; params.push(country); }
      if (pageType) { where += ` AND page_type = $${idx++}`; params.push(pageType); }
      if (topic) { where += ` AND topic = $${idx++}`; params.push(topic); }
      if (status) { where += ` AND status = $${idx++}`; params.push(status); }

      const countResult = await pool.query(`SELECT COUNT(*)::int AS total FROM imaging_seo_pages ${where}`, params);
      const total = countResult.rows[0]?.total || 0;

      const limitVal = Math.min(parseInt(String(limit || "50")), 200);
      const offsetVal = parseInt(String(offset || "0"));

      const result = await pool.query(
        `SELECT * FROM imaging_seo_pages ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
        [...params, limitVal, offsetVal]
      );

      res.json({ pages: result.rows.map(snakeToCamel), total });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging-seo/pages/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const { country } = req.query;
      let query = "SELECT * FROM imaging_seo_pages WHERE slug = $1 AND status = 'published'";
      const params: any[] = [slug];
      if (country) {
        query += " AND country = $2";
        params.push(country);
      }
      const result = await pool.query(query, params);
      if (result.rows.length === 0) return res.status(404).json({ error: "Page not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/imaging-seo/pages", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = insertImagingSeoPageSchema.parse(req.body);
      const result = await pool.query(
        `INSERT INTO imaging_seo_pages (id, slug, country, page_type, topic, subtopic, exam_type, title, meta_title, meta_description, intro_html, content_html, faq_json, internal_links_json, cta_json, sample_questions_json, tags, primary_keyword, secondary_keywords, schema_markup_json, status, published_at, last_reviewed_at, next_review_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
         RETURNING *`,
        [parsed.slug, parsed.country, parsed.pageType, parsed.topic || null, parsed.subtopic || null, parsed.examType || null, parsed.title, parsed.metaTitle || null, parsed.metaDescription || null, parsed.introHtml || null, parsed.contentHtml || null, JSON.stringify(parsed.faqJson || []), JSON.stringify(parsed.internalLinksJson || []), JSON.stringify(parsed.ctaJson || {}), JSON.stringify(parsed.sampleQuestionsJson || []), parsed.tags || [], parsed.primaryKeyword || null, parsed.secondaryKeywords || [], parsed.schemaMarkupJson ? JSON.stringify(parsed.schemaMarkupJson) : null, parsed.status || "draft", parsed.publishedAt || null, parsed.lastReviewedAt || null, parsed.nextReviewAt || null]
      );
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put("/api/imaging-seo/pages/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { id } = req.params;
      const fields = req.body;
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;

      const fieldMap: Record<string, string> = {
        slug: "slug", country: "country", pageType: "page_type", topic: "topic", subtopic: "subtopic",
        examType: "exam_type", title: "title", metaTitle: "meta_title", metaDescription: "meta_description",
        introHtml: "intro_html", contentHtml: "content_html", faqJson: "faq_json",
        internalLinksJson: "internal_links_json", ctaJson: "cta_json", sampleQuestionsJson: "sample_questions_json",
        tags: "tags", primaryKeyword: "primary_keyword", secondaryKeywords: "secondary_keywords",
        schemaMarkupJson: "schema_markup_json", status: "status", publishedAt: "published_at",
        lastReviewedAt: "last_reviewed_at", nextReviewAt: "next_review_at",
      };

      for (const [camel, snake] of Object.entries(fieldMap)) {
        if (fields[camel] !== undefined) {
          const val = ["faqJson", "internalLinksJson", "ctaJson", "sampleQuestionsJson", "schemaMarkupJson"].includes(camel) ? JSON.stringify(fields[camel]) : fields[camel];
          sets.push(`${snake} = $${idx++}`);
          params.push(val);
        }
      }

      if (sets.length === 0) return res.status(400).json({ error: "No fields to update" });
      sets.push(`updated_at = NOW()`);
      params.push(id);

      const result = await pool.query(
        `UPDATE imaging_seo_pages SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`, params
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/imaging-seo/pages/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await pool.query("DELETE FROM imaging_seo_pages WHERE id = $1", [req.params.id]);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging-seo/blog", async (req, res) => {
    try {
      const { country, articleType, category, status, limit, offset } = req.query;
      let where = "WHERE 1=1";
      const params: any[] = [];
      let idx = 1;

      if (country) { where += ` AND country = $${idx++}`; params.push(country); }
      if (articleType) { where += ` AND article_type = $${idx++}`; params.push(articleType); }
      if (category) { where += ` AND category = $${idx++}`; params.push(category); }
      if (status) { where += ` AND status = $${idx++}`; params.push(status); }

      const countResult = await pool.query(`SELECT COUNT(*)::int AS total FROM imaging_blog_articles ${where}`, params);
      const total = countResult.rows[0]?.total || 0;

      const limitVal = Math.min(parseInt(String(limit || "50")), 200);
      const offsetVal = parseInt(String(offset || "0"));

      const result = await pool.query(
        `SELECT * FROM imaging_blog_articles ${where} ORDER BY published_at DESC NULLS LAST, created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
        [...params, limitVal, offsetVal]
      );

      res.json({ articles: result.rows.map(snakeToCamel), total });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging-seo/blog/:slug", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM imaging_blog_articles WHERE slug = $1 AND status = 'published'", [req.params.slug]);
      if (result.rows.length === 0) return res.status(404).json({ error: "Article not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/imaging-seo/blog", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = insertImagingBlogArticleSchema.parse(req.body);
      const result = await pool.query(
        `INSERT INTO imaging_blog_articles (id, slug, country, article_type, category, title, meta_title, meta_description, summary, content_html, tags, primary_keyword, secondary_keywords, related_seo_page_slugs, related_article_slugs, schema_markup_json, read_time_minutes, status, published_at, last_reviewed_at, next_review_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
         RETURNING *`,
        [parsed.slug, parsed.country, parsed.articleType, parsed.category || null, parsed.title, parsed.metaTitle || null, parsed.metaDescription || null, parsed.summary || null, parsed.contentHtml || null, parsed.tags || [], parsed.primaryKeyword || null, parsed.secondaryKeywords || [], parsed.relatedSeoPageSlugs || [], parsed.relatedArticleSlugs || [], parsed.schemaMarkupJson ? JSON.stringify(parsed.schemaMarkupJson) : null, parsed.readTimeMinutes || 5, parsed.status || "draft", parsed.publishedAt || null, parsed.lastReviewedAt || null, parsed.nextReviewAt || null]
      );
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put("/api/imaging-seo/blog/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { id } = req.params;
      const fields = req.body;
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;

      const fieldMap: Record<string, string> = {
        slug: "slug", country: "country", articleType: "article_type", category: "category",
        title: "title", metaTitle: "meta_title", metaDescription: "meta_description",
        summary: "summary", contentHtml: "content_html", tags: "tags",
        primaryKeyword: "primary_keyword", secondaryKeywords: "secondary_keywords",
        relatedSeoPageSlugs: "related_seo_page_slugs", relatedArticleSlugs: "related_article_slugs",
        schemaMarkupJson: "schema_markup_json", readTimeMinutes: "read_time_minutes",
        status: "status", publishedAt: "published_at",
        lastReviewedAt: "last_reviewed_at", nextReviewAt: "next_review_at",
      };

      for (const [camel, snake] of Object.entries(fieldMap)) {
        if (fields[camel] !== undefined) {
          const val = camel === "schemaMarkupJson" ? JSON.stringify(fields[camel]) : fields[camel];
          sets.push(`${snake} = $${idx++}`);
          params.push(val);
        }
      }

      if (sets.length === 0) return res.status(400).json({ error: "No fields to update" });
      sets.push(`updated_at = NOW()`);
      params.push(id);

      const result = await pool.query(
        `UPDATE imaging_blog_articles SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`, params
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/imaging-seo/blog/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await pool.query("DELETE FROM imaging_blog_articles WHERE id = $1", [req.params.id]);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging-seo/internal-links", async (req, res) => {
    try {
      const { country, pageType, topic, tags, limit } = req.query;
      let where = "WHERE status = 'published'";
      const params: any[] = [];
      let idx = 1;

      if (country) { where += ` AND country = $${idx++}`; params.push(country); }
      if (pageType) { where += ` AND page_type = $${idx++}`; params.push(pageType); }
      if (topic) { where += ` AND topic = $${idx++}`; params.push(topic); }
      if (tags) {
        const tagArr = String(tags).split(",");
        where += ` AND tags && $${idx++}`;
        params.push(tagArr);
      }

      const limitVal = Math.min(parseInt(String(limit || "10")), 50);

      const seoPages = await pool.query(
        `SELECT slug, title, page_type, topic, country, tags FROM imaging_seo_pages ${where} ORDER BY published_at DESC NULLS LAST LIMIT $${idx++}`,
        [...params, limitVal]
      );

      let blogWhere = "WHERE status = 'published'";
      const blogParams: any[] = [];
      let blogIdx = 1;
      if (country) { blogWhere += ` AND country = $${blogIdx++}`; blogParams.push(country); }
      if (tags) {
        const tagArr = String(tags).split(",");
        blogWhere += ` AND tags && $${blogIdx++}`;
        blogParams.push(tagArr);
      }

      const blogArticles = await pool.query(
        `SELECT slug, title, article_type, category, country, tags FROM imaging_blog_articles ${blogWhere} ORDER BY published_at DESC NULLS LAST LIMIT $${blogIdx++}`,
        [...blogParams, limitVal]
      );

      const positioningEntries = await pool.query(
        `SELECT slug, projection_name, body_part, body_region, country FROM imaging_positioning_entries WHERE status = 'published'${country ? ` AND country = $1` : ""} LIMIT $${country ? "2" : "1"}`,
        country ? [country, limitVal] : [limitVal]
      );

      const physicsTopics = await pool.query(
        `SELECT id, title, category, modality FROM imaging_physics_topics WHERE status = 'published' LIMIT $1`,
        [limitVal]
      );

      res.json({
        seoPages: seoPages.rows.map(snakeToCamel),
        blogArticles: blogArticles.rows.map(snakeToCamel),
        positioningEntries: positioningEntries.rows.map(snakeToCamel),
        physicsTopics: physicsTopics.rows.map(snakeToCamel),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging-seo/freshness", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const stalePages = await pool.query(
        `SELECT id, slug, title, country, page_type, updated_at, last_reviewed_at, next_review_at
         FROM imaging_seo_pages
         WHERE status = 'published' AND (next_review_at IS NOT NULL AND next_review_at <= NOW())
         ORDER BY next_review_at ASC LIMIT 50`
      );

      const staleArticles = await pool.query(
        `SELECT id, slug, title, country, article_type, updated_at, last_reviewed_at, next_review_at
         FROM imaging_blog_articles
         WHERE status = 'published' AND (next_review_at IS NOT NULL AND next_review_at <= NOW())
         ORDER BY next_review_at ASC LIMIT 50`
      );

      const stats = await pool.query(`
        SELECT
          (SELECT COUNT(*)::int FROM imaging_seo_pages WHERE status = 'published') AS published_pages,
          (SELECT COUNT(*)::int FROM imaging_seo_pages WHERE status = 'draft') AS draft_pages,
          (SELECT COUNT(*)::int FROM imaging_blog_articles WHERE status = 'published') AS published_articles,
          (SELECT COUNT(*)::int FROM imaging_blog_articles WHERE status = 'draft') AS draft_articles,
          (SELECT COUNT(*)::int FROM imaging_seo_pages WHERE status = 'published' AND next_review_at IS NOT NULL AND next_review_at <= NOW()) AS stale_pages,
          (SELECT COUNT(*)::int FROM imaging_blog_articles WHERE status = 'published' AND next_review_at IS NOT NULL AND next_review_at <= NOW()) AS stale_articles
      `);

      res.json({
        stats: snakeToCamel(stats.rows[0]),
        stalePages: stalePages.rows.map(snakeToCamel),
        staleArticles: staleArticles.rows.map(snakeToCamel),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging-seo/sitemap-data", async (_req, res) => {
    try {
      const seoPages = await pool.query(
        `SELECT slug, country, page_type, updated_at FROM imaging_seo_pages WHERE status = 'published' ORDER BY updated_at DESC`
      );
      const blogArticles = await pool.query(
        `SELECT slug, country, updated_at FROM imaging_blog_articles WHERE status = 'published' ORDER BY updated_at DESC`
      );
      const positioning = await pool.query(
        `SELECT slug, country, updated_at FROM imaging_positioning_entries WHERE status = 'published' ORDER BY updated_at DESC`
      );
      const physics = await pool.query(
        `SELECT id, title, updated_at FROM imaging_physics_topics WHERE status = 'published' ORDER BY updated_at DESC`
      );

      res.json({
        seoPages: seoPages.rows.map(snakeToCamel),
        blogArticles: blogArticles.rows.map(snakeToCamel),
        positioning: positioning.rows.map(snakeToCamel),
        physics: physics.rows.map(snakeToCamel),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging-seo/discovery/:country", async (req, res) => {
    try {
      const { country } = req.params;

      const popularPages = await pool.query(
        `SELECT slug, title, page_type, topic, tags FROM imaging_seo_pages
         WHERE country = $1 AND status = 'published'
         ORDER BY published_at DESC LIMIT 6`,
        [country]
      );

      const beginnerPages = await pool.query(
        `SELECT slug, title, page_type, topic, tags FROM imaging_seo_pages
         WHERE country = $1 AND status = 'published' AND (tags @> ARRAY['beginner'] OR page_type = 'study-guide')
         ORDER BY published_at DESC LIMIT 6`,
        [country]
      );

      const latestArticles = await pool.query(
        `SELECT slug, title, article_type, category, summary, read_time_minutes FROM imaging_blog_articles
         WHERE country = $1 AND status = 'published'
         ORDER BY published_at DESC LIMIT 6`,
        [country]
      );

      const examPrepPages = await pool.query(
        `SELECT slug, title, page_type, topic FROM imaging_seo_pages
         WHERE country = $1 AND status = 'published' AND page_type IN ('practice-questions', 'exam-prep')
         ORDER BY published_at DESC LIMIT 6`,
        [country]
      );

      const positioningCount = await pool.query(
        `SELECT COUNT(*)::int AS count FROM imaging_positioning_entries WHERE country = $1 AND status = 'published'`,
        [country]
      );

      const questionCount = await pool.query(
        `SELECT COUNT(*)::int AS count FROM imaging_questions WHERE country = $1 AND status = 'published'`,
        [country]
      );

      const flashcardCount = await pool.query(
        `SELECT COUNT(*)::int AS count FROM imaging_flashcards WHERE status = 'published'`
      );

      res.json({
        popularTopics: popularPages.rows.map(snakeToCamel),
        beginnerResources: beginnerPages.rows.map(snakeToCamel),
        latestArticles: latestArticles.rows.map(snakeToCamel),
        examReadiness: examPrepPages.rows.map(snakeToCamel),
        stats: {
          positioningGuides: positioningCount.rows[0]?.count || 0,
          practiceQuestions: questionCount.rows[0]?.count || 0,
          flashcards: flashcardCount.rows[0]?.count || 0,
        },
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
