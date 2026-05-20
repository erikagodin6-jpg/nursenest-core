import type { Express, Request, Response } from "express";
import { pool } from "./storage";

function mapPage(row: any) {
  return {
    id: row.id,
    pageType: row.page_type,
    exam: row.exam,
    title: row.title,
    slug: row.slug,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    contentHtml: row.content_html,
    tocJson: row.toc_json,
    faqJson: row.faq_json,
    internalLinksJson: row.internal_links_json,
    isPublic: row.is_public,
    canonicalUrl: row.canonical_url,
    lastUpdated: row.last_updated,
  };
}

export function registerNursingContentHubRoutes(app: Express): void {
  app.get("/api/nursing-hub/pages", async (req: Request, res: Response) => {
    try {
      const { pageType, featured } = req.query;
      let query = "SELECT * FROM seo_pages WHERE is_public = true AND language_code = 'en'";
      const params: any[] = [];
      let idx = 1;

      if (pageType) {
        query += ` AND page_type = $${idx++}`;
        params.push(pageType);
      }

      query += " ORDER BY title ASC";

      const result = await pool.query(query, params);
      res.json(result.rows.map(mapPage));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/nursing-hub/pages/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const { pageType } = req.query;

      let query = "SELECT * FROM seo_pages WHERE slug = $1 AND language_code = 'en' AND is_public = true";
      const params: any[] = [slug];

      if (pageType) {
        query += " AND page_type = $2";
        params.push(pageType);
      }

      const result = await pool.query(query, params);
      if (!result.rows[0]) {
        return res.status(404).json({ error: "Page not found" });
      }

      const page = mapPage(result.rows[0]);

      const relatedQuery = `
        SELECT slug, page_type, title, meta_description 
        FROM seo_pages 
        WHERE is_public = true 
          AND language_code = 'en'
          AND page_type IN ('certification', 'specialty', 'study-pathway', 'program-landing', 'topic-hub', 'long-form-guide', 'long-tail')
          AND slug != $1
        ORDER BY RANDOM()
        LIMIT 6
      `;
      const relatedResult = await pool.query(relatedQuery, [slug]);
      const relatedPages = relatedResult.rows.map((r: any) => ({
        slug: r.slug,
        pageType: r.page_type,
        title: r.title,
        description: r.meta_description,
      }));

      res.json({ ...page, relatedPages });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/nursing-hub/all-slugs", async (_req: Request, res: Response) => {
    try {
      const result = await pool.query(
        `SELECT slug, page_type, title FROM seo_pages 
         WHERE is_public = true AND language_code = 'en' 
         AND page_type IN ('certification', 'specialty', 'study-pathway', 'program-landing', 'topic-hub', 'long-form-guide', 'long-tail')
         ORDER BY page_type, title`
      );
      res.json(result.rows.map((r: any) => ({
        slug: r.slug,
        pageType: r.page_type,
        title: r.title,
      })));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
