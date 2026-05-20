import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import { validateSeoHubPage } from "../shared/seo-hub-validation";

/**
 * ------------------------------
 * HELPERS
 * ------------------------------
 */

function safeJson(value: any, fallback: any = []) {
  if (!value) return fallback;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapPage(row: any) {
  return {
    id: row.id,
    tier: row.tier,
    pageType: row.page_type,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    metaKeywords: row.meta_keywords || [],
    h1: row.h1,
    contentSections: safeJson(row.content_sections),
    faqItems: safeJson(row.faq_items),
    internalLinks: safeJson(row.internal_links),
    parentHub: row.parent_hub,
    relatedSlugs: row.related_slugs || [],
    language: row.language,
    status: row.status,
    medicallyReviewedBy: row.medically_reviewed_by,
    medicallyReviewedAt: row.medically_reviewed_at,
    lastUpdatedDate: row.last_updated_date,
    references: safeJson(row.references),
    practiceQuestionIds: row.practice_question_ids || [],
    structuredDataType: row.structured_data_type,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function safeLimit(val: any, def = 50, max = 200) {
  const n = parseInt(val);
  if (isNaN(n)) return def;
  return Math.min(n, max);
}

function normalizeSlug(input: any): string {
  if (!input) return "";
  if (Array.isArray(input)) return input.join("/");
  return String(input).replace(/^\/+|\/+$/g, "");
}

/**
 * ------------------------------
 * RELATED + SIBLING
 * ------------------------------
 */

async function getRelatedPages(page: any) {
  const out: any[] = [];

  try {
    if (page.related_slugs?.length) {
      const r = await pool.query(
        `SELECT slug, title, page_type 
         FROM seo_hub_pages 
         WHERE slug = ANY($1) AND status='published'`,
        [page.related_slugs]
      );

      for (const row of r.rows) {
        out.push({
          title: row.title,
          href: `/${row.slug}`,
          type: row.page_type,
        });
      }
    }

    if (out.length < 6) {
      const exclude = out.map(x => x.href.replace("/", ""));

      const r = await pool.query(
        `SELECT slug, title, page_type
         FROM seo_hub_pages
         WHERE tier=$1 AND slug != $2 AND status='published'
         AND slug != ALL($3)
         ORDER BY RANDOM()
         LIMIT $4`,
        [page.tier, page.slug, exclude.length ? exclude : [""], 6 - out.length]
      );

      for (const row of r.rows) {
        out.push({
          title: row.title,
          href: `/${row.slug}`,
          type: row.page_type,
        });
      }
    }
  } catch {}

  return out;
}

async function getSiblingPages(page: any) {
  try {
    const r = await pool.query(
      `SELECT slug, title, page_type
       FROM seo_hub_pages
       WHERE tier=$1 AND page_type=$2 AND slug != $3 AND status='published'
       ORDER BY title ASC LIMIT 8`,
      [page.tier, page.page_type, page.slug]
    );

    return r.rows.map((x: any) => ({
      title: x.title,
      href: `/${x.slug}`,
      type: x.page_type,
    }));
  } catch {
    return [];
  }
}

/**
 * ------------------------------
 * ROUTES
 * ------------------------------
 */

export function registerSeoHubRoutes(app: Express): void {

  /**
   * GET PAGE
   */
  app.get("/api/seo-hub/page/{*slug}", async (req, res) => {
    try {
      const slug = normalizeSlug((req.params as any).slug);

      const r = await pool.query(
        `SELECT * FROM seo_hub_pages WHERE slug=$1 AND status='published'`,
        [slug]
      );

      if (!r.rows[0]) {
        return res.status(404).json({ error: "Page not found" });
      }

      const page = r.rows[0];

      res.json({
        ...mapPage(page),
        relatedPages: await getRelatedPages(page),
        siblingPages: await getSiblingPages(page),
      });

    } catch (e: any) {
      console.error("[SeoHub] Fetch error:", e.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * LIST
   */
  app.get("/api/seo-hub/pages", async (req, res) => {
    try {
      const limit = safeLimit(req.query.limit);

      const filters: string[] = [];
      const params: any[] = [];
      let i = 1;

      if (req.query.tier) {
        filters.push(`tier = $${i++}`);
        params.push(req.query.tier);
      }

      if (req.query.pageType) {
        filters.push(`page_type = $${i++}`);
        params.push(req.query.pageType);
      }

      if (req.query.status) {
        filters.push(`status = $${i++}`);
        params.push(req.query.status);
      }

      const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

      // Omit large JSON blobs on list; mapPage fills missing keys via safeJson → [].
      const r = await pool.query(
        `SELECT id, tier, page_type, slug, title, meta_title, meta_description, meta_keywords, h1,
                parent_hub, related_slugs, language, status, medically_reviewed_by, medically_reviewed_at,
                last_updated_date, structured_data_type, published_at, created_at, updated_at, source_version
         FROM seo_hub_pages ${where}
         ORDER BY title ASC
         LIMIT $${i}`,
        [...params, limit],
      );

      res.json(r.rows.map(mapPage));

    } catch (e: any) {
      console.error("[SeoHub] List error:", e.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * SLUGS
   */
  app.get("/api/seo-hub/slugs", async (_req, res) => {
    try {
      const r = await pool.query(
        `SELECT slug, tier, page_type 
         FROM seo_hub_pages 
         WHERE status='published'
         ORDER BY slug`
      );

      res.json(r.rows.map((x: any) => ({
        slug: x.slug,
        tier: x.tier,
        pageType: x.page_type,
      })));

    } catch (e: any) {
      console.error("[SeoHub] Slugs error:", e.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * CREATE
   */
  app.post("/api/admin/seo-hub/pages", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const body = req.body;

      if (body.status === "published") {
        const v = validateSeoHubPage(body);
        if (!v.valid) {
          return res.status(400).json({ error: "Validation failed", errors: v.errors });
        }
      }

      const dupSlug = await pool.query(
        `SELECT id FROM seo_hub_pages WHERE slug=$1`,
        [body.slug]
      );

      if (dupSlug.rows.length) {
        return res.status(400).json({ error: "Duplicate slug" });
      }

      const r = await pool.query(
        `INSERT INTO seo_hub_pages (
          tier,page_type,slug,title,meta_title,meta_description,
          meta_keywords,h1,content_sections,faq_items,internal_links,
          parent_hub,related_slugs,language,status,
          medically_reviewed_by,medically_reviewed_at,last_updated_date,
          "references",practice_question_ids,structured_data_type,published_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
        RETURNING *`,
        [
          body.tier, body.pageType, body.slug, body.title,
          body.metaTitle, body.metaDescription,
          body.metaKeywords || [],
          body.h1,
          JSON.stringify(body.contentSections || []),
          JSON.stringify(body.faqItems || []),
          JSON.stringify(body.internalLinks || []),
          body.parentHub,
          body.relatedSlugs || [],
          body.language || "en",
          body.status || "draft",
          body.medicallyReviewedBy,
          body.medicallyReviewedAt || null,
          body.lastUpdatedDate,
          JSON.stringify(body.references || []),
          body.practiceQuestionIds || [],
          body.structuredDataType || "Article",
          body.status === "published" ? new Date() : null,
        ]
      );

      res.json(mapPage(r.rows[0]));

    } catch (e: any) {
      console.error("[SeoHub] Create error:", e.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * UPDATE + DELETE + STATS (unchanged behavior)
   * → left identical but cleaned structure internally
   */

  app.put("/api/admin/seo-hub/pages/:id", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const body = req.body;

      const existing = await pool.query(
        `SELECT * FROM seo_hub_pages WHERE id=$1`,
        [id]
      );

      if (!existing.rows[0]) {
        return res.status(404).json({ error: "Page not found" });
      }

      const wasPublished = existing.rows[0].status === "published";

      const publishedAt =
        body.status === "published" && !wasPublished
          ? new Date()
          : existing.rows[0].published_at;

      const r = await pool.query(
        `UPDATE seo_hub_pages SET
          tier=$1,page_type=$2,slug=$3,title=$4,
          meta_title=$5,meta_description=$6,
          meta_keywords=$7,h1=$8,
          content_sections=$9,faq_items=$10,internal_links=$11,
          parent_hub=$12,related_slugs=$13,language=$14,status=$15,
          medically_reviewed_by=$16,medically_reviewed_at=$17,
          last_updated_date=$18,"references"=$19,
          practice_question_ids=$20,structured_data_type=$21,
          published_at=$22,updated_at=NOW()
        WHERE id=$23 RETURNING *`,
        [
          body.tier, body.pageType, body.slug, body.title,
          body.metaTitle, body.metaDescription,
          body.metaKeywords || [],
          body.h1,
          JSON.stringify(body.contentSections || []),
          JSON.stringify(body.faqItems || []),
          JSON.stringify(body.internalLinks || []),
          body.parentHub,
          body.relatedSlugs || [],
          body.language || "en",
          body.status || "draft",
          body.medicallyReviewedBy,
          body.medicallyReviewedAt || null,
          body.lastUpdatedDate,
          JSON.stringify(body.references || []),
          body.practiceQuestionIds || [],
          body.structuredDataType || "Article",
          publishedAt,
          id,
        ]
      );

      res.json(mapPage(r.rows[0]));

    } catch (e: any) {
      console.error("[SeoHub] Update error:", e.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/seo-hub/pages/:id", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    await pool.query(`DELETE FROM seo_hub_pages WHERE id=$1`, [req.params.id]);
    res.json({ success: true });
  });

  app.get("/api/admin/seo-hub/stats", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const totals = await pool.query(`
      SELECT COUNT(*) total_pages,
             COUNT(*) FILTER (WHERE status='published') published_pages,
             COUNT(*) FILTER (WHERE status='draft') draft_pages
      FROM seo_hub_pages
    `);

    res.json(totals.rows[0]);
  });
}