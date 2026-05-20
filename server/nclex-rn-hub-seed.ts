import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
async function loadNclexRnHubPages() {
  const { ALL_NCLEX_RN_HUB_PAGES } = await import("./data/nclex-rn-hub-content");
  return ALL_NCLEX_RN_HUB_PAGES;
}

export function registerNclexRnHubSeedRoutes(app: Express): void {
  app.post("/api/admin/nclex-rn-hub/seed", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const dryRun = req.query.dryRun === "true";
      const pages = await loadNclexRnHubPages();
      let created = 0;
      let skipped = 0;
      let updated = 0;
      const errors: string[] = [];

      for (const page of pages) {
        try {
          const existing = await pool.query(
            "SELECT id FROM seo_hub_pages WHERE slug = $1",
            [page.slug]
          );

          if (existing.rows.length > 0) {
            if (req.query.overwrite === "true" && !dryRun) {
              await pool.query(
                `UPDATE seo_hub_pages SET
                  tier = $1, page_type = $2, title = $3, meta_title = $4,
                  meta_description = $5, meta_keywords = $6, h1 = $7,
                  content_sections = $8, faq_items = $9, internal_links = $10,
                  parent_hub = $11, related_slugs = $12, status = 'published',
                  medically_reviewed_by = $13, medically_reviewed_at = NOW(),
                  last_updated_date = $14, "references" = $15,
                  structured_data_type = $16, published_at = COALESCE(published_at, NOW()),
                  updated_at = NOW()
                WHERE slug = $17`,
                [
                  page.tier, page.pageType, page.title, page.metaTitle,
                  page.metaDescription, page.metaKeywords, page.h1,
                  JSON.stringify(page.contentSections), JSON.stringify(page.faqItems),
                  JSON.stringify(page.internalLinks), page.parentHub, page.relatedSlugs,
                  page.medicallyReviewedBy, new Date().toISOString().split("T")[0],
                  JSON.stringify(page.references), page.structuredDataType, page.slug,
                ]
              );
              updated++;
            } else {
              skipped++;
            }
            continue;
          }

          if (!dryRun) {
            await pool.query(
              `INSERT INTO seo_hub_pages (
                tier, page_type, slug, title, meta_title, meta_description,
                meta_keywords, h1, content_sections, faq_items, internal_links,
                parent_hub, related_slugs, language, status, medically_reviewed_by,
                medically_reviewed_at, last_updated_date, "references",
                structured_data_type, published_at
              ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
              [
                page.tier, page.pageType, page.slug, page.title, page.metaTitle,
                page.metaDescription, page.metaKeywords, page.h1,
                JSON.stringify(page.contentSections), JSON.stringify(page.faqItems),
                JSON.stringify(page.internalLinks), page.parentHub, page.relatedSlugs,
                "en", "published", page.medicallyReviewedBy, new Date(),
                new Date().toISOString().split("T")[0], JSON.stringify(page.references),
                page.structuredDataType, new Date(),
              ]
            );
          }
          created++;
        } catch (e: any) {
          errors.push(`${page.slug}: ${e.message}`);
        }
      }

      res.json({
        success: true,
        dryRun,
        total: pages.length,
        created,
        skipped,
        updated,
        errors,
      });
    } catch (e: any) {
      console.error("[NCLEX-RN Hub Seed] Error:", e.message);
      res.status(500).json({ error: "Seed failed", message: e.message });
    }
  });

  app.get("/api/admin/nclex-rn-hub/status", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return res.status(401).json({ error: "Unauthorized" });
    try {
      const result = await pool.query(
        `SELECT page_type, COUNT(*)::int as count, COUNT(*) FILTER (WHERE status = 'published')::int as published
         FROM seo_hub_pages WHERE tier = 'nclex-rn' GROUP BY page_type ORDER BY count DESC`
      );
      const total = await pool.query(
        `SELECT COUNT(*)::int as total FROM seo_hub_pages WHERE tier = 'nclex-rn'`
      );
      res.json({
        totalPages: total.rows[0]?.total || 0,
        expectedPages: (await loadNclexRnHubPages()).length,
        byType: result.rows,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
