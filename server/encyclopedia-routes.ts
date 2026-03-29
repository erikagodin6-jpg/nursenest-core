import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { routeParamString } from "./route-params";
import { requireAdmin } from "./admin-auth";
import { analyzeAndPopulateCrossLinks, getCrossLinksForEntry, getCrossLinkStats } from "./encyclopedia-cross-linker";
import { createRateLimiter, abuseEscalationMiddleware, botDetectionMiddleware } from "./abuse-protection";

let encColCache: { crossLinkCol: string; categoryCol: string; keywordsCol: string; faqCol: string; mechanismCol: string } | null = null;
async function getEncColumns(): Promise<typeof encColCache> {
  if (encColCache) return encColCache;
  const r = await pool.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'encyclopedia_entries'`
  );
  const cols = new Set(r.rows.map((row: any) => row.column_name));
  encColCache = {
    crossLinkCol: cols.has('cross_profession_links') ? 'cross_profession_links' : 'cross_links',
    categoryCol: cols.has('category') ? 'category' : 'domain',
    keywordsCol: cols.has('seo_keywords') ? 'seo_keywords' : 'keywords',
    faqCol: cols.has('faq_json') ? 'faq_json' : 'faq',
    mechanismCol: cols.has('mechanism_physiology') ? 'mechanism_physiology' : 'mechanism',
  };
  return encColCache;
}

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

export function registerEncyclopediaRoutes(app: Express): void {
  const contentBrowseLimiter = createRateLimiter("content_browse");
  const searchLimiter = createRateLimiter("search");

  app.use("/api/encyclopedia", abuseEscalationMiddleware, botDetectionMiddleware, contentBrowseLimiter);

  app.get("/api/encyclopedia", searchLimiter, async (req, res) => {
    try {
      const { profession, domain, category, search, limit, offset } = req.query;
      const params: any[] = [];
      const conditions: string[] = ["status = 'published'"];
      let idx = 1;

      if (profession) {
        conditions.push(`profession = $${idx++}`);
        params.push(profession);
      }
      if (domain || category) {
        conditions.push(`category = $${idx++}`);
        params.push(domain || category);
      }
      if (search) {
        conditions.push(`(title ILIKE $${idx} OR overview ILIKE $${idx})`);
        params.push(`%${search}%`);
        idx++;
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const lim = Math.min(Number(limit) || 50, 200);
      const off = Number(offset) || 0;

      const countResult = await pool.query(`SELECT COUNT(*)::int AS total FROM encyclopedia_entries ${where}`, params);
      const total = countResult.rows[0]?.total || 0;

      const result = await pool.query(
        `SELECT id, profession, category, title, slug, overview, seo_title, seo_description, seo_keywords, created_at
         FROM encyclopedia_entries ${where}
         ORDER BY profession, category, title
         LIMIT ${lim} OFFSET ${off}`,
        params
      );

      const entries = result.rows.map((row: any) => {
        const camel = snakeToCamel(row);
        camel.domain = camel.category;
        return camel;
      });

      res.json({ entries, total, limit: lim, offset: off });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/encyclopedia/professions", async (_req, res) => {
    try {
      const result = await pool.query(
        `SELECT profession, COUNT(*)::int AS count,
          array_agg(DISTINCT category) AS domains
         FROM encyclopedia_entries WHERE status = 'published'
         GROUP BY profession ORDER BY profession`
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/encyclopedia/domains/:profession", async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT category AS domain, COUNT(*)::int AS count
         FROM encyclopedia_entries WHERE profession = $1 AND status = 'published'
         GROUP BY category ORDER BY category`,
        [req.params.profession]
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/encyclopedia/cross-links/:slug", async (req, res) => {
    try {
      const ec = await getEncColumns();
      const entry = await pool.query(
        `SELECT id, ${ec!.crossLinkCol} AS cross_links_data FROM encyclopedia_entries WHERE slug = $1 AND status = 'published'`,
        [req.params.slug]
      );
      if (entry.rows.length === 0) {
        return res.status(404).json({ error: "Entry not found" });
      }

      const dbLinks = await getCrossLinksForEntry(entry.rows[0].id);
      if (dbLinks.length > 0) {
        return res.json({ linked: dbLinks });
      }

      const crossLinks = entry.rows[0].cross_links_data || [];
      if (crossLinks.length === 0) {
        return res.json({ linked: [] });
      }
      const slugs = crossLinks.map((l: any) => l.slug);
      const linked = await pool.query(
        `SELECT id, profession, title, slug, ${ec!.categoryCol} AS domain, overview
         FROM encyclopedia_entries WHERE slug = ANY($1) AND status = 'published'`,
        [slugs]
      );
      res.json({ linked: linked.rows.map(snakeToCamel) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/encyclopedia/stats/summary", async (_req, res) => {
    try {
      const ec = await getEncColumns();
      const professionCounts = await pool.query(
        `SELECT profession, COUNT(*)::int AS count FROM encyclopedia_entries WHERE status = 'published' GROUP BY profession ORDER BY profession`
      );
      const domainCounts = await pool.query(
        `SELECT profession, ${ec!.categoryCol} AS domain, COUNT(*)::int AS count FROM encyclopedia_entries WHERE status = 'published' GROUP BY profession, ${ec!.categoryCol} ORDER BY profession, ${ec!.categoryCol}`
      );
      const crossLinkCount = await pool.query(
        `SELECT COUNT(*)::int AS total FROM encyclopedia_entries WHERE status = 'published' AND ${ec!.crossLinkCol} IS NOT NULL AND ${ec!.crossLinkCol}::text != '[]'`
      );
      const totalCount = await pool.query(
        `SELECT COUNT(*)::int AS total FROM encyclopedia_entries WHERE status = 'published'`
      );

      let crossLinkTableStats = { totalLinks: 0, uniqueLinkedEntries: 0 };
      try {
        const clStats = await getCrossLinkStats();
        crossLinkTableStats = clStats;
      } catch (_e) {}

      res.json({
        totalEntries: totalCount.rows[0]?.total || 0,
        entriesWithCrossLinks: crossLinkCount.rows[0]?.total || 0,
        crossLinkGraph: crossLinkTableStats,
        byProfession: professionCounts.rows.map(snakeToCamel),
        byDomain: domainCounts.rows.map(snakeToCamel),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/encyclopedia/:profession/:slug", async (req: Request, res: Response) => {
    try {
      const profession = routeParamString(req.params.profession);
      const slug = routeParamString(req.params.slug);
      const fullSlug = `${profession}-${slug}`;
      const result = await pool.query(
        `SELECT * FROM encyclopedia_entries WHERE slug = $1 AND status = 'published'`,
        [fullSlug]
      );
      let row = result.rows[0];
      let matchedSlug = fullSlug;
      if (!row) {
        const directResult = await pool.query(
          `SELECT * FROM encyclopedia_entries WHERE profession = $1 AND slug = $2 AND status = 'published'`,
          [profession, slug]
        );
        if (!directResult.rows[0]) {
          return res.status(404).json({ error: "Entry not found" });
        }
        row = directResult.rows[0];
        matchedSlug = slug;
      }
      const entry = snakeToCamel(row);
      entry.domain = entry.category;
      entry.keywords = entry.seoKeywords;
      entry.mechanism = entry.mechanismPhysiology;
      entry.faq = entry.faqJson;
      entry.crossLinks = entry.crossProfessionLinks;

      const relatedResult = await pool.query(
        `SELECT id, slug, title, category AS domain FROM encyclopedia_entries
         WHERE profession = $1 AND category = $2 AND slug != $3 AND status = 'published'
         ORDER BY title LIMIT 6`,
        [profession, row.category, matchedSlug]
      );
      entry.relatedEntries = relatedResult.rows.map(snakeToCamel);

      const crossLinks = entry.crossProfessionLinks || [];
      if (Array.isArray(crossLinks) && crossLinks.length > 0) {
        const crossSlugs = crossLinks.map((cl: any) => cl.slug).filter(Boolean);
        if (crossSlugs.length > 0) {
          const crossResult = await pool.query(
            `SELECT id, profession, slug, title, seo_description FROM encyclopedia_entries
             WHERE status = 'published' AND slug = ANY($1) AND profession != $2
             LIMIT 10`,
            [crossSlugs, profession]
          );
          entry.crossProfessionTopics = crossResult.rows.map(snakeToCamel);
        }
      }

      if (!entry.crossProfessionTopics || entry.crossProfessionTopics.length === 0) {
        try {
          const dbCrossLinks = await getCrossLinksForEntry(row.id);
          if (dbCrossLinks.length > 0) {
            entry.crossProfessionTopics = dbCrossLinks;
            entry.crossProfessionLinks = dbCrossLinks.map((cl: any) => ({
              profession: cl.profession,
              slug: cl.slug,
              title: cl.title,
            }));
          }
        } catch (_e) {}
      }

      res.json(entry);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/encyclopedia/:slug", async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM encyclopedia_entries WHERE slug = $1 AND status = 'published'`,
        [req.params.slug]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Entry not found" });
      }
      const entry = snakeToCamel(result.rows[0]);
      entry.domain = entry.category;
      entry.keywords = entry.seoKeywords;
      entry.mechanism = entry.mechanismPhysiology;
      entry.faq = entry.faqJson;
      entry.crossLinks = entry.crossProfessionLinks;
      res.json(entry);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/encyclopedia/stats", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const result = await pool.query(`
        SELECT profession,
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'published')::int AS published,
          COUNT(DISTINCT category)::int AS domains
        FROM encyclopedia_entries
        GROUP BY profession
        ORDER BY profession
      `);
      const totals = await pool.query(`
        SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'published')::int AS published,
          COUNT(DISTINCT profession)::int AS professions,
          COUNT(DISTINCT category)::int AS domains
        FROM encyclopedia_entries
      `);
      res.json({
        byProfession: result.rows.map(snakeToCamel),
        totals: snakeToCamel(totals.rows[0]),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/encyclopedia/entries", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { profession, domain, category, status, limit = "100" } = req.query;
      let query = `SELECT * FROM encyclopedia_entries WHERE 1=1`;
      const params: any[] = [];
      let idx = 1;
      if (profession) { query += ` AND profession = $${idx++}`; params.push(profession); }
      if (domain || category) { query += ` AND category = $${idx++}`; params.push(domain || category); }
      if (status) { query += ` AND status = $${idx++}`; params.push(status); }
      query += ` ORDER BY profession, category, title LIMIT $${idx++}`;
      params.push(Math.min(parseInt(String(limit)) || 100, 500));
      const result = await pool.query(query, params);
      res.json(result.rows.map(snakeToCamel));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/encyclopedia/entries/:id", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { id } = req.params;
      await pool.query(`DELETE FROM encyclopedia_entries WHERE id = $1`, [id]);
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/encyclopedia/cross-links/analyze", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const result = await analyzeAndPopulateCrossLinks();
      res.json({
        ok: true,
        totalLinks: result.totalLinks,
        entriesUpdated: result.entriesUpdated,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/encyclopedia/cross-links/stats", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const stats = await getCrossLinkStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/encyclopedia/cross-links/:entryId", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const links = await getCrossLinksForEntry(routeParamString(req.params.entryId));
      res.json({ links });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
