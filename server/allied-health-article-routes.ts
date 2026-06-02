import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

function mapArticle(row: any) {
  return {
    id: row.id,
    clusterId: row.cluster_id,
    type: row.type,
    status: row.status,
    title: row.title,
    slug: row.slug,
    targetKeyword: row.target_keyword,
    searchIntent: row.search_intent,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    outlineJson: row.outline_json,
    contentMd: row.content_md,
    wordCount: row.word_count,
    readingLevel: row.reading_level,
    canonicalUrl: row.canonical_url,
    publishedAt: row.published_at,
    siteContext: row.site_context,
    careerTrack: row.career_track,
    examName: row.exam_name,
    primaryCategory: row.primary_category,
    secondaryCategory: row.secondary_category,
    gatingLevel: row.gating_level,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function registerAlliedHealthArticleRoutes(app: Express): void {
  app.get("/api/allied-health/articles", async (req: Request, res: Response) => {
    try {
      const { profession, status, limit = "50" } = req.query;

      let query = "SELECT * FROM seo_articles WHERE site_context = 'allied'";
      const params: any[] = [];
      let idx = 1;

      if (profession) {
        query += ` AND career_track = $${idx++}`;
        params.push(profession);
      }
      if (status) {
        query += ` AND status = $${idx++}`;
        params.push(status);
      } else {
        query += " AND status = 'published'";
      }

      query += ` ORDER BY published_at DESC NULLS LAST, created_at DESC LIMIT $${idx++}`;
      params.push(Math.min(parseInt(String(limit)) || 50, 200));

      const r = await pool.query(query, params);
      res.json(r.rows.map(mapArticle));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/allied-health/articles/by-slug/:profession/:articleSlug", async (req: Request, res: Response) => {
    try {
      const { profession, articleSlug } = req.params;
      const fullSlug = `${profession}/${articleSlug}`;

      const r = await pool.query(
        "SELECT * FROM seo_articles WHERE slug = $1 AND site_context = 'allied' AND status = 'published'",
        [fullSlug]
      );

      if (!r.rows[0]) {
        return res.status(404).json({ error: "Article not found" });
      }

      const article = mapArticle(r.rows[0]);

      const relatedRes = await pool.query(
        `SELECT sa.id, sa.title, sa.slug, sa.meta_description, sa.career_track
         FROM seo_internal_links sil
         JOIN seo_articles sa ON sil.to_article_id = sa.id
         WHERE sil.from_article_id = $1 AND sa.status = 'published'
         LIMIT 6`,
        [r.rows[0].id]
      );

      const related = relatedRes.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        metaDescription: row.meta_description,
        careerTrack: row.career_track,
      }));

      res.json({ article, relatedArticles: related });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/allied-health/articles/by-profession/:profession", async (req: Request, res: Response) => {
    try {
      const { profession } = req.params;

      const r = await pool.query(
        `SELECT id, title, slug, meta_description, career_track, primary_category, published_at, word_count
         FROM seo_articles
         WHERE career_track = $1 AND site_context = 'allied' AND status = 'published'
         ORDER BY published_at DESC NULLS LAST, created_at DESC
         LIMIT 50`,
        [profession]
      );

      res.json(r.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        metaDescription: row.meta_description,
        careerTrack: row.career_track,
        primaryCategory: row.primary_category,
        publishedAt: row.published_at,
        wordCount: row.word_count,
      })));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/allied-health/articles", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { profession, status, limit = "100" } = req.query;

      let query = "SELECT * FROM seo_articles WHERE site_context = 'allied'";
      const params: any[] = [];
      let idx = 1;

      if (profession) {
        query += ` AND career_track = $${idx++}`;
        params.push(profession);
      }
      if (status) {
        query += ` AND status = $${idx++}`;
        params.push(status);
      }

      query += ` ORDER BY created_at DESC LIMIT $${idx++}`;
      params.push(Math.min(parseInt(String(limit)) || 100, 500));

      const r = await pool.query(query, params);
      res.json(r.rows.map(mapArticle));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/allied-health/articles", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { title, slug, metaTitle, metaDescription, contentMd, careerTrack, primaryCategory, status, targetKeyword } = req.body;

      if (!title || !slug || !careerTrack) {
        return res.status(400).json({ error: "title, slug, and careerTrack are required" });
      }

      const fullSlug = `${careerTrack}/${slug}`;
      const wordCount = (contentMd || "").split(/\s+/).filter(Boolean).length;

      let clusterId: string | null = null;
      const clusterRes = await pool.query(
        "SELECT id FROM seo_clusters WHERE career_track = $1 AND site_context = 'allied' LIMIT 1",
        [careerTrack]
      );
      if (clusterRes.rows[0]) {
        clusterId = clusterRes.rows[0].id;
      } else {
        const newCluster = await pool.query(
          `INSERT INTO seo_clusters (keyword, pillar_slug, site_context, career_track, status)
           VALUES ($1, $2, 'allied', $3, 'draft') RETURNING id`,
          [`${careerTrack} Articles`, `${careerTrack}/hub`, careerTrack]
        );
        clusterId = newCluster.rows[0].id;
      }

      const r = await pool.query(
        `INSERT INTO seo_articles (cluster_id, type, status, title, slug, target_keyword, search_intent, meta_title, meta_description, content_md, word_count, site_context, career_track, primary_category, gating_level, canonical_url)
         VALUES ($1, 'support', $2, $3, $4, $5, 'informational', $6, $7, $8, $9, 'allied', $10, $11, 'public', $12)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           meta_title = EXCLUDED.meta_title,
           meta_description = EXCLUDED.meta_description,
           content_md = EXCLUDED.content_md,
           word_count = EXCLUDED.word_count,
           primary_category = EXCLUDED.primary_category,
           status = EXCLUDED.status,
           target_keyword = EXCLUDED.target_keyword,
           updated_at = NOW()
         RETURNING *`,
        [
          clusterId,
          status || "draft",
          title,
          fullSlug,
          targetKeyword || title,
          metaTitle || title,
          metaDescription || "",
          contentMd || "",
          wordCount,
          careerTrack,
          primaryCategory || "General",
          `/allied-health/${careerTrack}/${slug}`,
        ]
      );

      if (status === "published" && r.rows[0]) {
        await pool.query(
          "UPDATE seo_articles SET published_at = COALESCE(published_at, NOW()) WHERE id = $1",
          [r.rows[0].id]
        );
      }

      res.json(mapArticle(r.rows[0]));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/allied-health/articles/:id", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { id } = req.params;
      const { title, metaTitle, metaDescription, contentMd, primaryCategory, status, targetKeyword } = req.body;

      const wordCount = (contentMd || "").split(/\s+/).filter(Boolean).length;

      const r = await pool.query(
        `UPDATE seo_articles SET
           title = COALESCE($1, title),
           meta_title = COALESCE($2, meta_title),
           meta_description = COALESCE($3, meta_description),
           content_md = COALESCE($4, content_md),
           word_count = $5,
           primary_category = COALESCE($6, primary_category),
           status = COALESCE($7, status),
           target_keyword = COALESCE($8, target_keyword),
           published_at = CASE WHEN $7 = 'published' THEN COALESCE(published_at, NOW()) ELSE published_at END,
           updated_at = NOW()
         WHERE id = $9 AND site_context = 'allied'
         RETURNING *`,
        [title, metaTitle, metaDescription, contentMd, wordCount, primaryCategory, status, targetKeyword, id]
      );

      if (!r.rows[0]) {
        return res.status(404).json({ error: "Article not found" });
      }

      res.json(mapArticle(r.rows[0]));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/allied-health/articles/:id/publish", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { id } = req.params;
      const r = await pool.query(
        `UPDATE seo_articles SET status = 'published', published_at = COALESCE(published_at, NOW()), updated_at = NOW()
         WHERE id = $1 AND site_context = 'allied' RETURNING *`,
        [id]
      );
      if (!r.rows[0]) return res.status(404).json({ error: "Article not found" });

      computeInternalLinksAsync(r.rows[0].id);

      res.json(mapArticle(r.rows[0]));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/allied-health/articles/generate", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { title, slug, careerTrack, targetKeyword, primaryCategory } = req.body;

      if (!title || !slug || !careerTrack) {
        return res.status(400).json({ error: "title, slug, and careerTrack are required" });
      }

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      const professionLabels: Record<string, string> = {
        "respiratory-therapy": "Respiratory Therapy (RRT/NBRC TMC/CSE/CBRC)",
        "medical-laboratory-technologist": "Medical Laboratory Technologist (MLT/ASCP/CSMLS)",
        "paramedic": "Paramedic / Emergency Medical Services (NREMT/COPR)",
        "radiologic-technologist": "Radiologic Technologist (ARRT/CAMRT)",
        "diagnostic-sonography": "Diagnostic Medical Sonography (ARDMS/RDMS)",
        "cardiac-sonographer": "Cardiac Sonographer / Echocardiographer (ARDMS RDCS/CCI RCS)",
        "occupational-therapy-assistant": "Occupational Therapy Assistant (NBCOT COTA)",
        "physiotherapy-assistant": "Physical Therapy Assistant (NPTE-PTA/FSBPT)",
        "pharmacy-technician": "Pharmacy Technician (PTCB/ExCPT/PEBC)",
        "surgical-technologist": "Surgical Technologist (NBSTSA CST)",
      };

      const professionLabel = professionLabels[careerTrack] || careerTrack;

      const systemPrompt = `You are a senior allied health educator and SEO content specialist creating comprehensive, high-quality articles for NurseNest's allied health content hub.

Write articles that are:
- 1500-2500 words in length
- Educational, authoritative, and SEO-optimized
- Written for students and professionals in the ${professionLabel} field
- Structured with clear H2 and H3 headings
- Including practical, actionable information

Your article MUST include:
1. An engaging introduction that hooks the reader
2. Well-structured body with H2 sections and H3 subsections
3. Practical tips, clinical pearls, or actionable advice
4. Relevant statistics or data points when appropriate
5. A conclusion with next steps or call-to-action
6. Internal linking opportunities (suggest related topics)

FORMAT: Return valid JSON with these fields:
{
  "metaTitle": "SEO title (60 chars max)",
  "metaDescription": "Meta description (155 chars max)",
  "content": "Full article in Markdown format with ## and ### headings",
  "wordCount": 0,
  "suggestedRelatedTopics": ["topic1", "topic2", "topic3"]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Write a comprehensive article for the ${professionLabel} profession.

Title: ${title}
Target SEO Keyword: ${targetKeyword || title}
Category: ${primaryCategory || "General"}

The article should be thorough, well-researched, and provide genuine value to readers interested in this topic. Include specific details, examples, and actionable advice relevant to the ${professionLabel} field.`
          }
        ],
        temperature: 0.7,
        max_tokens: 8000,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No content returned from AI generation");

      const parsed = JSON.parse(content);

      res.json({
        metaTitle: parsed.metaTitle || title,
        metaDescription: parsed.metaDescription || "",
        contentMd: parsed.content || "",
        wordCount: parsed.wordCount || (parsed.content || "").split(/\s+/).filter(Boolean).length,
        suggestedRelatedTopics: parsed.suggestedRelatedTopics || [],
      });
    } catch (err: any) {
      console.error("[Allied Health Article Gen] Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/allied-health/articles/:id", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { id } = req.params;
      const r = await pool.query(
        "DELETE FROM seo_articles WHERE id = $1 AND site_context = 'allied' RETURNING id",
        [id]
      );
      if (!r.rows[0]) return res.status(404).json({ error: "Article not found" });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/allied-health/sitemap-urls", async (_req: Request, res: Response) => {
    try {
      const r = await pool.query(
        `SELECT slug, career_track, updated_at FROM seo_articles
         WHERE site_context = 'allied' AND status = 'published'
         ORDER BY updated_at DESC`
      );
      const urls = r.rows.map((row: any) => ({
        loc: `/allied-health/${row.slug}`,
        lastmod: row.updated_at?.toISOString?.() || new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      }));

      urls.unshift({
        loc: "/allied-health",
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.9,
      });

      const professions = [
        "respiratory-therapy", "medical-laboratory-technologist", "paramedic",
        "radiologic-technologist", "diagnostic-sonography", "cardiac-sonographer",
        "occupational-therapy-assistant", "physiotherapy-assistant", "pharmacy-technician",
        "surgical-technologist"
      ];

      for (const prof of professions) {
        urls.push({
          loc: `/allied-health/${prof}`,
          lastmod: new Date().toISOString(),
          changefreq: "weekly",
          priority: 0.8,
        });
      }

      res.json(urls);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}

async function computeInternalLinksAsync(articleId: string) {
  try {
    const articleRes = await pool.query("SELECT * FROM seo_articles WHERE id = $1", [articleId]);
    const article = articleRes.rows[0];
    if (!article) return;

    const allArticles = await pool.query(
      "SELECT id, title, slug, target_keyword, career_track FROM seo_articles WHERE site_context = 'allied' AND status = 'published' AND id != $1",
      [articleId]
    );

    const keywords = (article.target_keyword || "").toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);

    for (const candidate of allArticles.rows) {
      const candidateTitle = (candidate.title || "").toLowerCase();
      const candidateKeyword = (candidate.target_keyword || "").toLowerCase();

      let matchScore = 0;
      for (const kw of keywords) {
        if (candidateTitle.includes(kw)) matchScore += 2;
        if (candidateKeyword.includes(kw)) matchScore += 3;
      }
      if (article.career_track && candidate.career_track === article.career_track) matchScore += 2;

      if (matchScore >= 3) {
        await pool.query(
          `INSERT INTO seo_internal_links (from_article_id, to_article_id, anchor_text, reason, placement)
           VALUES ($1, $2, $3, $4, 'body')
           ON CONFLICT DO NOTHING`,
          [article.id, candidate.id, candidate.title, `Allied health keyword match: ${matchScore}`]
        );
      }
    }
  } catch (err: any) {
    console.error("[Allied Health Links]", err.message);
  }
}
