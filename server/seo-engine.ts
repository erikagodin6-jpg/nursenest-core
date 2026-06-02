import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import { routeParamString } from "./route-params";
import { generateNursingPage, generateAlliedHealthPage } from "./content-generators";

/**
 * ------------------------------
 * Helpers
 * ------------------------------
 */

function buildWhere(filters: Record<string, any>) {
  const conditions: string[] = [];
  const params: any[] = [];
  let idx = 1;

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) continue;
    conditions.push(`${key} = $${idx++}`);
    params.push(value);
  }

  return {
    where: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
    nextIndex: idx,
  };
}

function safeInt(val: any, def = 50, max = 200) {
  const n = parseInt(val);
  if (isNaN(n)) return def;
  return Math.min(n, max);
}

/**
 * ------------------------------
 * Internal Linking
 * ------------------------------
 */
async function computeInternalLinks(articleId: string, siteContext: string) {
  const articleRes = await pool.query("SELECT * FROM seo_articles WHERE id = $1", [articleId]);
  const article = articleRes.rows[0];
  if (!article) return 0;

  const all = await pool.query(
    `SELECT id, title, target_keyword, career_track
     FROM seo_articles
     WHERE site_context = $1 AND status = 'published' AND id != $2`,
    [siteContext, articleId]
  );

  let created = 0;
  const keywords = (article.target_keyword || "").toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);

  for (const c of all.rows) {
    let score = 0;
    const t = (c.title || "").toLowerCase();
    const kw = (c.target_keyword || "").toLowerCase();

    for (const k of keywords) {
      if (t.includes(k)) score += 2;
      if (kw.includes(k)) score += 3;
    }

    if (c.career_track === article.career_track) score++;

    if (score >= 3) {
      const res = await pool.query(
        `INSERT INTO seo_internal_links
         (from_article_id, to_article_id, anchor_text, reason, placement)
         VALUES ($1,$2,$3,$4,'body')
         ON CONFLICT DO NOTHING`,
        [article.id, c.id, c.title, `score:${score}`]
      );

      if (res.rowCount) created++;
    }
  }

  return created;
}

/**
 * ------------------------------
 * Routes
 * ------------------------------
 */

export function setupSeoEngineRoutes(app: Express) {

  /**
   * ------------------------------
   * CLUSTERS
   * ------------------------------
   */

  app.get("/api/admin/seo/clusters", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { where, params } = buildWhere({
        site_context: req.query.siteContext || "nursing",
        career_track: req.query.careerTrack,
        status: req.query.status,
      });

      const r = await pool.query(
        `SELECT * FROM seo_clusters ${where} ORDER BY created_at DESC`,
        params
      );

      res.json(r.rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/seo/clusters", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { keyword, pillarSlug, siteContext, careerTrack } = req.body;

      if (!keyword || !pillarSlug) {
        return res.status(400).json({ error: "keyword + pillarSlug required" });
      }

      const r = await pool.query(
        `INSERT INTO seo_clusters (keyword, pillar_slug, site_context, career_track, status)
         VALUES ($1,$2,$3,$4,'draft') RETURNING *`,
        [keyword, pillarSlug, siteContext || "nursing", careerTrack || null]
      );

      res.json(r.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  /**
   * ------------------------------
   * ARTICLES
   * ------------------------------
   */

  app.get("/api/admin/seo/articles", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { where, params } = buildWhere({
        site_context: req.query.siteContext,
        career_track: req.query.careerTrack,
        cluster_id: req.query.clusterId,
        status: req.query.status,
        type: req.query.type,
      });

      const limit = safeInt(req.query.limit);

      const r = await pool.query(
        `SELECT * FROM seo_articles ${where} ORDER BY created_at DESC LIMIT $${params.length + 1}`,
        [...params, limit]
      );

      res.json(r.rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/seo/articles", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { clusterId, title, slug, targetKeyword, siteContext, careerTrack } = req.body;

      if (!clusterId || !title || !slug) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const r = await pool.query(
        `INSERT INTO seo_articles
         (cluster_id, type, title, slug, target_keyword, site_context, career_track, status)
         VALUES ($1,'support',$2,$3,$4,$5,$6,'draft')
         RETURNING *`,
        [clusterId, title, slug, targetKeyword, siteContext || "nursing", careerTrack || null]
      );

      res.json(r.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  /**
   * ------------------------------
   * ARTICLE STATUS
   * ------------------------------
   */

  app.post("/api/admin/seo/articles/:id/status", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const id = routeParamString(req.params.id);
      const { status } = req.body;

      if (!status) return res.status(400).json({ error: "status required" });

      const r = await pool.query(
        `UPDATE seo_articles
         SET status = $1,
             published_at = ${status === "published" ? "NOW()" : "published_at"},
             updated_at = NOW()
         WHERE id = $2 RETURNING *`,
        [status, id]
      );

      if (!r.rows[0]) return res.status(404).json({ error: "Not found" });

      if (status === "published") {
        computeInternalLinks(id, r.rows[0].site_context).catch(() => {});
      }

      res.json(r.rows[0]);

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  /**
   * ------------------------------
   * QC CHECK
   * ------------------------------
   */

  app.post("/api/admin/seo/qc", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { articleId } = req.body;

      const r = await pool.query("SELECT * FROM seo_articles WHERE id = $1", [articleId]);
      const article = r.rows[0];

      const errors: string[] = [];

      if (!article) {
        errors.push("Article not found");
      } else {
        if (article.type === "support" && article.word_count < 1200) {
          errors.push("Word count too low");
        }
        if (article.type === "pillar" && article.word_count < 2500) {
          errors.push("Pillar too short");
        }
      }

      res.json({
        passed: errors.length === 0,
        errors,
      });

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  /**
   * ------------------------------
   * BULK GENERATION (SIMPLIFIED)
   * ------------------------------
   */

  app.post("/api/admin/seo/bulk-generate", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { keywords, clusterId } = req.body;

      if (!Array.isArray(keywords) || keywords.length === 0) {
        return res.status(400).json({ error: "keywords required" });
      }

      const results = [];

      for (const keyword of keywords) {
        const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const r = await pool.query(
          `INSERT INTO seo_articles
           (cluster_id, type, title, slug, target_keyword, status)
           VALUES ($1,'support',$2,$3,$2,'draft')
           ON CONFLICT (slug) DO NOTHING
           RETURNING id`,
          [clusterId, keyword, slug]
        );

        results.push({
          keyword,
          created: !!r.rows[0],
        });
      }

      res.json({ results });

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

}