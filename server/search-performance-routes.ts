import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

const EXTERNAL_FETCH_TIMEOUT_MS = Math.min(
  Math.max(parseInt(process.env.EXTERNAL_FETCH_TIMEOUT_MS || "25000", 10), 5000),
  120_000,
);

function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  return fetch(url, {
    ...init,
    signal: AbortSignal.timeout(EXTERNAL_FETCH_TIMEOUT_MS),
  });
}

export async function getInternalSearchMetrics() {
  const [
    indexedPagesResult,
    pageViewsResult,
    topPagesResult,
    seoContentResult,
  ] = await Promise.all([
    pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM seo_pages WHERE is_public = true) +
        (SELECT COUNT(*)::int FROM seo_articles WHERE status = 'published') +
        (SELECT COUNT(*)::int FROM content_items WHERE status = 'published') +
        (SELECT COUNT(*)::int FROM programmatic_seo_pages) +
        (SELECT COUNT(*)::int FROM encyclopedia_entries)
        as total_indexed
    `).catch(() => ({ rows: [{ total_indexed: 0 }] })),
    pool.query(`
      SELECT
        COALESCE(SUM(view_count), 0)::int as total_views,
        COUNT(DISTINCT path)::int as unique_pages
      FROM page_views
      WHERE viewed_at >= NOW() - INTERVAL '30 days'
    `).catch(() => ({ rows: [{ total_views: 0, unique_pages: 0 }] })),
    pool.query(`
      SELECT path, SUM(view_count)::int as views
      FROM page_views
      WHERE viewed_at >= NOW() - INTERVAL '30 days'
      GROUP BY path
      ORDER BY views DESC
      LIMIT 20
    `).catch(() => ({ rows: [] })),
    pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE type = 'blog' AND status = 'published')::int as published_blogs,
        COUNT(*) FILTER (WHERE type = 'lesson' AND status = 'published')::int as published_lessons
      FROM content_items
    `).catch(() => ({ rows: [{ published_blogs: 0, published_lessons: 0 }] })),
  ]);

  const totalViews = Number(pageViewsResult.rows[0]?.total_views || 0);
  const uniquePages = Number(pageViewsResult.rows[0]?.unique_pages || 0);
  const estimatedCtr = uniquePages > 0 ? Math.min((totalViews / (uniquePages * 100)) * 100, 100) : 0;

  return {
    indexedPages: Number(indexedPagesResult.rows[0]?.total_indexed || 0),
    totalImpressions: totalViews * 10,
    totalClicks: totalViews,
    averageCtr: Math.round(estimatedCtr * 100) / 100,
    averagePosition: 0,
    topKeywords: [],
    topPages: topPagesResult.rows.map((r: any) => ({
      page: r.path,
      clicks: Number(r.views),
      impressions: Number(r.views) * 10,
      ctr: 10,
      position: 0,
    })),
    dataSource: "internal" as const,
    seoContent: {
      publishedBlogs: Number(seoContentResult.rows[0]?.published_blogs || 0),
      publishedLessons: Number(seoContentResult.rows[0]?.published_lessons || 0),
    },
  };
}

export async function tryGoogleSearchConsole(): Promise<any | null> {
  const serviceAccountKey = process.env.GOOGLE_SEARCH_CONSOLE_KEY;
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;

  if (!serviceAccountKey || !siteUrl) return null;

  try {
    let keyData: any;
    try {
      keyData = JSON.parse(serviceAccountKey);
    } catch {
      return null;
    }

    const jwt = await createGscJwt(keyData);
    if (!jwt) return null;

    const tokenRes = await fetchWithTimeout("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!tokenRes.ok) return null;
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 28 * 86400000).toISOString().split("T")[0];

    const [queryRes, pageRes] = await Promise.all([
      fetchWithTimeout(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate, endDate,
          dimensions: ["query"],
          rowLimit: 25,
          dataState: "final",
        }),
      }).catch(() => null),
      fetchWithTimeout(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate, endDate,
          dimensions: ["page"],
          rowLimit: 20,
          dataState: "final",
        }),
      }).catch(() => null),
    ]);

    if (!queryRes || !queryRes.ok || !pageRes || !pageRes.ok) {
      console.error("[SearchPerformance] GSC API returned non-OK response, falling back to internal");
      return null;
    }

    const queryData = await queryRes.json().catch(() => ({ rows: [] }));
    const pageData = await pageRes.json().catch(() => ({ rows: [] }));

    if (!queryData.rows && !pageData.rows) {
      console.error("[SearchPerformance] GSC returned no valid data, falling back to internal");
      return null;
    }

    const totalClicks = (queryData.rows || []).reduce((s: number, r: any) => s + (r.clicks || 0), 0);
    const totalImpressions = (queryData.rows || []).reduce((s: number, r: any) => s + (r.impressions || 0), 0);

    const indexedResult = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM seo_pages WHERE is_public = true) +
        (SELECT COUNT(*)::int FROM seo_articles WHERE status = 'published') +
        (SELECT COUNT(*)::int FROM content_items WHERE status = 'published') +
        (SELECT COUNT(*)::int FROM programmatic_seo_pages) +
        (SELECT COUNT(*)::int FROM encyclopedia_entries)
        as total_indexed
    `).catch(() => ({ rows: [{ total_indexed: 0 }] }));

    return {
      indexedPages: Number(indexedResult.rows[0]?.total_indexed || 0),
      totalClicks,
      totalImpressions,
      averageCtr: totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0,
      averagePosition: queryData.rows?.length > 0
        ? Math.round((queryData.rows.reduce((s: number, r: any) => s + (r.position || 0), 0) / queryData.rows.length) * 10) / 10
        : 0,
      topKeywords: (queryData.rows || []).slice(0, 25).map((r: any) => ({
        keyword: r.keys?.[0] || "",
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: Math.round((r.ctr || 0) * 10000) / 100,
        position: Math.round((r.position || 0) * 10) / 10,
      })),
      topPages: (pageData.rows || []).slice(0, 20).map((r: any) => ({
        page: r.keys?.[0] || "",
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: Math.round((r.ctr || 0) * 10000) / 100,
        position: Math.round((r.position || 0) * 10) / 10,
      })),
      dataSource: "google_search_console" as const,
    };
  } catch (err) {
    console.error("[SearchPerformance] GSC error:", err);
    return null;
  }
}

async function createGscJwt(keyData: any): Promise<string | null> {
  try {
    const crypto = await import("crypto");
    const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
    const now = Math.floor(Date.now() / 1000);
    const payload = Buffer.from(JSON.stringify({
      iss: keyData.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })).toString("base64url");

    const signable = `${header}.${payload}`;
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(signable);
    const signature = sign.sign(keyData.private_key, "base64url");

    return `${signable}.${signature}`;
  } catch {
    return null;
  }
}

export function registerSearchPerformanceRoutes(app: Express) {
  app.get("/api/admin/search-performance", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const gscData = await tryGoogleSearchConsole();
      const internalData = await getInternalSearchMetrics();

      if (gscData) {
        res.json({
          ...gscData,
          indexedPages: internalData.indexedPages,
          seoContent: internalData.seoContent,
          gscConnected: true,
        });
      } else {
        res.json({
          ...internalData,
          gscConnected: false,
        });
      }
    } catch (e: any) {
      console.error("[SearchPerformance] Error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/search-performance/history", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const limit = Math.max(1, Math.min(90, Number(req.query.limit || 30)));
      const result = await pool.query(
        `SELECT * FROM search_performance_snapshots ORDER BY snapshot_date DESC LIMIT $1`,
        [limit]
      ).catch(() => ({ rows: [] }));

      const snapshots = result.rows.map((r: any) => ({
        id: r.id,
        snapshotDate: r.snapshot_date,
        indexedPages: Number(r.indexed_pages),
        totalImpressions: Number(r.total_impressions),
        totalClicks: Number(r.total_clicks),
        averageCtr: Number(r.average_ctr),
        averagePosition: Number(r.average_position),
        topKeywordsJson: r.top_keywords_json,
        topPagesJson: r.top_pages_json,
        dataSource: r.data_source,
        createdAt: r.created_at,
      }));

      res.json({ snapshots });
    } catch (e: any) {
      console.error("[SearchPerformance] History error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/search-performance/snapshot", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const gscData = await tryGoogleSearchConsole();
      const internalData = await getInternalSearchMetrics();
      const data = gscData || internalData;
      const source = gscData ? "google_search_console" : "internal";

      const result = await pool.query(
        `INSERT INTO search_performance_snapshots
         (id, snapshot_date, indexed_pages, total_impressions, total_clicks,
          average_ctr, average_position, top_keywords_json, top_pages_json, data_source, created_at)
         VALUES (gen_random_uuid(), NOW(), $1, $2, $3, $4, $5, $6, $7, $8, NOW())
         RETURNING *`,
        [
          internalData.indexedPages,
          data.totalImpressions || 0,
          data.totalClicks || 0,
          data.averageCtr || 0,
          data.averagePosition || 0,
          JSON.stringify(data.topKeywords || []),
          JSON.stringify(data.topPages || []),
          source,
        ]
      );

      res.json({ snapshot: result.rows[0] });
    } catch (e: any) {
      console.error("[SearchPerformance] Snapshot error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/search-performance/status", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const hasGscKey = !!process.env.GOOGLE_SEARCH_CONSOLE_KEY;
    const hasSiteUrl = !!process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;

    res.json({
      gscConfigured: hasGscKey && hasSiteUrl,
      gscKeySet: hasGscKey,
      siteUrlSet: hasSiteUrl,
      siteUrl: hasSiteUrl ? process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL : null,
    });
  });
}
