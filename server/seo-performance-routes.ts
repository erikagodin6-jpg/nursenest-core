import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

interface WeeklyCount {
  week: string;
  count: number;
}

interface ContentGrowthData {
  blogPosts: WeeklyCount[];
  lessons: WeeklyCount[];
  flashcards: WeeklyCount[];
  examQuestions: WeeklyCount[];
  currentWeekSummary: {
    blogPosts: number;
    lessons: number;
    flashcards: number;
    examQuestions: number;
  };
  previousWeekSummary: {
    blogPosts: number;
    lessons: number;
    flashcards: number;
    examQuestions: number;
  };
}

interface SitemapSection {
  section: string;
  urlCount: number;
  status: "healthy" | "low" | "empty";
}

interface ContentCoverageEntry {
  dimension: string;
  value: string;
  questions: number;
  flashcards: number;
  lessons: number;
  blogs: number;
  total: number;
}

const contentGrowthCache: { data: ContentGrowthData | null; builtAt: number } = { data: null, builtAt: 0 };
const sitemapCache: { data: SitemapSection[] | null; builtAt: number } = { data: null, builtAt: 0 };
const coverageCache: { data: any | null; builtAt: number } = { data: null, builtAt: 0 };
const CACHE_TTL = 5 * 60 * 1000;

async function getWeeklyCounts(tableName: string, createdAtCol: string, statusFilter?: string, weeks: number = 12): Promise<WeeklyCount[]> {
  try {
    const statusClause = statusFilter ? ` AND ${statusFilter}` : "";
    const result = await pool.query(
      `SELECT date_trunc('week', ${createdAtCol})::date AS week, COUNT(*)::int AS count
       FROM ${tableName}
       WHERE ${createdAtCol} >= NOW() - INTERVAL '${weeks} weeks'${statusClause}
       GROUP BY week
       ORDER BY week DESC`
    );
    return result.rows.map((r: any) => ({
      week: r.week.toISOString().slice(0, 10),
      count: r.count,
    }));
  } catch (e) {
    console.error(`Weekly counts error for ${tableName}:`, e);
    return [];
  }
}

async function getCurrentAndPreviousWeekCount(tableName: string, createdAtCol: string, statusFilter?: string): Promise<{ current: number; previous: number }> {
  try {
    const statusClause = statusFilter ? ` AND ${statusFilter}` : "";
    const result = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE ${createdAtCol} >= date_trunc('week', NOW()))::int AS current_week,
        COUNT(*) FILTER (WHERE ${createdAtCol} >= date_trunc('week', NOW()) - INTERVAL '1 week' AND ${createdAtCol} < date_trunc('week', NOW()))::int AS previous_week
       FROM ${tableName}
       WHERE ${createdAtCol} >= NOW() - INTERVAL '2 weeks'${statusClause}`
    );
    return {
      current: result.rows[0]?.current_week || 0,
      previous: result.rows[0]?.previous_week || 0,
    };
  } catch {
    return { current: 0, previous: 0 };
  }
}

async function buildContentGrowthData(): Promise<ContentGrowthData> {
  const [blogWeekly, lessonWeekly, fcWeekly, eqWeekly] = await Promise.all([
    getWeeklyCounts("content_items", "created_at", "type IN ('blog', 'blog-post', 'article')"),
    getWeeklyCounts("lessons", "created_at"),
    getWeeklyCounts("deck_flashcards", "created_at"),
    getWeeklyCounts("exam_questions", "created_at"),
  ]);

  const [blogCounts, lessonCounts, fcCounts, eqCounts] = await Promise.all([
    getCurrentAndPreviousWeekCount("content_items", "created_at", "type IN ('blog', 'blog-post', 'article')"),
    getCurrentAndPreviousWeekCount("lessons", "created_at"),
    getCurrentAndPreviousWeekCount("deck_flashcards", "created_at"),
    getCurrentAndPreviousWeekCount("exam_questions", "created_at"),
  ]);

  return {
    blogPosts: blogWeekly,
    lessons: lessonWeekly,
    flashcards: fcWeekly,
    examQuestions: eqWeekly,
    currentWeekSummary: {
      blogPosts: blogCounts.current,
      lessons: lessonCounts.current,
      flashcards: fcCounts.current,
      examQuestions: eqCounts.current,
    },
    previousWeekSummary: {
      blogPosts: blogCounts.previous,
      lessons: lessonCounts.previous,
      flashcards: fcCounts.previous,
      examQuestions: eqCounts.previous,
    },
  };
}

async function buildSitemapAnalysis(): Promise<SitemapSection[]> {
  const sections: SitemapSection[] = [];

  const queries: { section: string; query: string }[] = [
    { section: "Lessons", query: "SELECT COUNT(*)::int AS count FROM lessons WHERE status = 'published'" },
    { section: "Blog Posts", query: "SELECT COUNT(*)::int AS count FROM content_items WHERE type IN ('blog', 'blog-post', 'article') AND status = 'published'" },
    { section: "Flashcard Decks", query: "SELECT COUNT(*)::int AS count FROM flashcard_decks WHERE visibility = 'public' AND slug IS NOT NULL" },
    { section: "Exam Questions (Topics)", query: "SELECT COUNT(DISTINCT topic)::int AS count FROM exam_questions WHERE status = 'published' AND topic IS NOT NULL AND topic != ''" },
    { section: "SEO Content Pages", query: "SELECT COUNT(*)::int AS count FROM seo_pages WHERE is_public = true" },
    { section: "Glossary Terms", query: "SELECT COUNT(*)::int AS count FROM content_items WHERE type = 'glossary' AND status = 'published'" },
    { section: "Specialties & Certifications", query: "SELECT COUNT(*)::int AS count FROM seo_pages WHERE is_public = true AND page_type IN ('certification', 'specialty', 'study-pathway')" },
    { section: "Medical Imaging", query: "SELECT COUNT(*)::int AS count FROM imaging_questions WHERE status = 'published'" },
    { section: "Allied Health Content", query: "SELECT COUNT(*)::int AS count FROM allied_questions WHERE status IN ('approved', 'pending')" },
    { section: "Programmatic SEO", query: "SELECT COUNT(*)::int AS count FROM seo_pages WHERE is_public = true AND page_type = 'programmatic'" },
  ];

  for (const q of queries) {
    try {
      const result = await pool.query(q.query);
      const count = result.rows[0]?.count || 0;
      sections.push({
        section: q.section,
        urlCount: count,
        status: count === 0 ? "empty" : count < 10 ? "low" : "healthy",
      });
    } catch {
      sections.push({ section: q.section, urlCount: 0, status: "empty" });
    }
  }

  return sections;
}

async function buildContentCoverage(): Promise<{
  byBodySystem: ContentCoverageEntry[];
  byTopic: ContentCoverageEntry[];
  byProfession: ContentCoverageEntry[];
  gaps: string[];
}> {
  const byBodySystem: ContentCoverageEntry[] = [];
  const byTopic: ContentCoverageEntry[] = [];
  const byProfession: ContentCoverageEntry[] = [];
  const gaps: string[] = [];

  try {
    const bsResult = await pool.query(
      `SELECT
        COALESCE(body_system, 'Unspecified') AS body_system,
        COUNT(*) FILTER (WHERE TRUE)::int AS questions,
        0 AS flashcards,
        0 AS lessons,
        0 AS blogs
       FROM exam_questions
       WHERE status = 'published'
       GROUP BY body_system
       ORDER BY questions DESC
       LIMIT 30`
    );
    for (const row of bsResult.rows) {
      byBodySystem.push({
        dimension: "Body System",
        value: row.body_system,
        questions: row.questions,
        flashcards: 0,
        lessons: 0,
        blogs: 0,
        total: row.questions,
      });
    }
  } catch {}

  try {
    const fcBySystem = await pool.query(
      `SELECT COALESCE(df.category, 'Unspecified') AS body_system, COUNT(*)::int AS count
       FROM deck_flashcards df
       GROUP BY body_system
       ORDER BY count DESC
       LIMIT 30`
    );
    for (const row of fcBySystem.rows) {
      const existing = byBodySystem.find(e => e.value.toLowerCase() === row.body_system.toLowerCase());
      if (existing) {
        existing.flashcards = row.count;
        existing.total += row.count;
      }
    }
  } catch {}

  try {
    const lessonsBySystem = await pool.query(
      `SELECT COALESCE(body_system, 'Unspecified') AS body_system, COUNT(*)::int AS count
       FROM content_items
       WHERE status = 'published' AND type = 'lesson'
       GROUP BY body_system
       ORDER BY count DESC
       LIMIT 30`
    );
    for (const row of lessonsBySystem.rows) {
      const existing = byBodySystem.find(e => e.value.toLowerCase() === row.body_system.toLowerCase());
      if (existing) {
        existing.lessons = row.count;
        existing.total += row.count;
      } else {
        byBodySystem.push({
          dimension: "Body System",
          value: row.body_system,
          questions: 0,
          flashcards: 0,
          lessons: row.count,
          blogs: 0,
          total: row.count,
        });
      }
    }
  } catch {}

  try {
    const blogsBySystem = await pool.query(
      `SELECT COALESCE(body_system, 'Unspecified') AS body_system, COUNT(*)::int AS count
       FROM content_items
       WHERE status = 'published' AND type IN ('blog', 'blog-post', 'article')
       GROUP BY body_system
       ORDER BY count DESC
       LIMIT 30`
    );
    for (const row of blogsBySystem.rows) {
      const existing = byBodySystem.find(e => e.value.toLowerCase() === row.body_system.toLowerCase());
      if (existing) {
        existing.blogs = row.count;
        existing.total += row.count;
      } else {
        byBodySystem.push({
          dimension: "Body System",
          value: row.body_system,
          questions: 0,
          flashcards: 0,
          lessons: 0,
          blogs: row.count,
          total: row.count,
        });
      }
    }
  } catch {}

  try {
    const topicResult = await pool.query(
      `SELECT COALESCE(topic, 'Unspecified') AS topic, COUNT(*)::int AS questions
       FROM exam_questions
       WHERE status = 'published' AND topic IS NOT NULL AND topic != ''
       GROUP BY topic
       ORDER BY questions DESC
       LIMIT 25`
    );
    for (const row of topicResult.rows) {
      byTopic.push({
        dimension: "Topic",
        value: row.topic,
        questions: row.questions,
        flashcards: 0,
        lessons: 0,
        blogs: 0,
        total: row.questions,
      });
    }
  } catch {}

  try {
    const professionResult = await pool.query(
      `SELECT COALESCE(career_type, 'nursing') AS profession,
        COUNT(*)::int AS questions
       FROM exam_questions
       WHERE status = 'published'
       GROUP BY profession
       ORDER BY questions DESC`
    );
    for (const row of professionResult.rows) {
      byProfession.push({
        dimension: "Profession",
        value: row.profession,
        questions: row.questions,
        flashcards: 0,
        lessons: 0,
        blogs: 0,
        total: row.questions,
      });
    }
  } catch {}

  try {
    const alliedResult = await pool.query(
      `SELECT COALESCE(career_type, 'unknown') AS profession, COUNT(*)::int AS questions
       FROM allied_questions
       WHERE status IN ('approved', 'pending')
       GROUP BY profession
       ORDER BY questions DESC`
    );
    for (const row of alliedResult.rows) {
      const existing = byProfession.find(e => e.value.toLowerCase() === row.profession.toLowerCase());
      if (existing) {
        existing.questions += row.questions;
        existing.total += row.questions;
      } else {
        byProfession.push({
          dimension: "Profession",
          value: row.profession,
          questions: row.questions,
          flashcards: 0,
          lessons: 0,
          blogs: 0,
          total: row.questions,
        });
      }
    }
  } catch {}

  const importantSystems = [
    "Cardiovascular", "Respiratory", "Neurological", "Gastrointestinal",
    "Endocrine", "Renal", "Musculoskeletal", "Hematology",
    "Mental Health", "Maternal", "Pediatric", "Pharmacology",
  ];
  for (const system of importantSystems) {
    const found = byBodySystem.find(e => e.value.toLowerCase().includes(system.toLowerCase()));
    if (!found || found.total < 5) {
      gaps.push(`Low content for body system: ${system} (${found?.total || 0} items)`);
    }
  }

  const importantProfessions = ["nursing", "paramedic", "mlt", "respiratory_therapy"];
  for (const prof of importantProfessions) {
    const found = byProfession.find(e => e.value.toLowerCase() === prof.toLowerCase());
    if (!found || found.total < 10) {
      gaps.push(`Low content for profession: ${prof} (${found?.total || 0} items)`);
    }
  }

  return { byBodySystem, byTopic, byProfession, gaps };
}

async function getInternalSearchMetrics(): Promise<{
  totalPageViews: number;
  pageViewsBySection: { section: string; views: number }[];
  topPages: { page: string; views: number }[];
  weeklyTraffic: { week: string; views: number }[];
}> {
  let totalPageViews = 0;
  let pageViewsBySection: { section: string; views: number }[] = [];
  let topPages: { page: string; views: number }[] = [];
  let weeklyTraffic: { week: string; views: number }[] = [];

  try {
    const totalResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM page_views WHERE created_at >= NOW() - INTERVAL '30 days'`
    );
    totalPageViews = totalResult.rows[0]?.total || 0;
  } catch {}

  try {
    const sectionResult = await pool.query(
      `SELECT COALESCE(platform_section, 'main') AS section, COUNT(*)::int AS views
       FROM page_views
       WHERE created_at >= NOW() - INTERVAL '30 days'
       GROUP BY section
       ORDER BY views DESC
       LIMIT 20`
    );
    pageViewsBySection = sectionResult.rows.map((r: any) => ({ section: r.section, views: r.views }));
  } catch {}

  try {
    const topResult = await pool.query(
      `SELECT page, COUNT(*)::int AS views
       FROM page_views
       WHERE created_at >= NOW() - INTERVAL '30 days'
       GROUP BY page
       ORDER BY views DESC
       LIMIT 20`
    );
    topPages = topResult.rows.map((r: any) => ({ page: r.page, views: r.views }));
  } catch {}

  try {
    const weeklyResult = await pool.query(
      `SELECT date_trunc('week', created_at)::date AS week, COUNT(*)::int AS views
       FROM page_views
       WHERE created_at >= NOW() - INTERVAL '12 weeks'
       GROUP BY week
       ORDER BY week DESC`
    );
    weeklyTraffic = weeklyResult.rows.map((r: any) => ({
      week: r.week.toISOString().slice(0, 10),
      views: r.views,
    }));
  } catch {}

  return { totalPageViews, pageViewsBySection, topPages, weeklyTraffic };
}

export function registerSeoPerformanceRoutes(app: Express) {
  app.get("/api/admin/seo-performance/content-growth", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      if (contentGrowthCache.data && Date.now() - contentGrowthCache.builtAt < CACHE_TTL) {
        return res.json(contentGrowthCache.data);
      }

      const data = await buildContentGrowthData();
      contentGrowthCache.data = data;
      contentGrowthCache.builtAt = Date.now();
      res.json(data);
    } catch (e: any) {
      console.error("Content growth error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/seo-performance/sitemap-analysis", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      if (sitemapCache.data && Date.now() - sitemapCache.builtAt < CACHE_TTL) {
        return res.json({ sections: sitemapCache.data, totalUrls: sitemapCache.data.reduce((s, x) => s + x.urlCount, 0) });
      }

      const sections = await buildSitemapAnalysis();
      sitemapCache.data = sections;
      sitemapCache.builtAt = Date.now();
      res.json({ sections, totalUrls: sections.reduce((s, x) => s + x.urlCount, 0) });
    } catch (e: any) {
      console.error("Sitemap analysis error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/seo-performance/search-metrics", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const hasGSC = !!(process.env.GOOGLE_SEARCH_CONSOLE_KEY || process.env.GSC_CREDENTIALS);
      const metrics = await getInternalSearchMetrics();

      if (hasGSC) {
        res.json({
          source: "google_search_console",
          configured: true,
          message: "Google Search Console credentials detected. Full GSC data integration (impressions, clicks, CTR, top keywords) requires additional setup. Showing internal metrics as fallback.",
          metrics,
        });
      } else {
        res.json({
          source: "internal",
          configured: false,
          setupMessage: "Connect Google Search Console for real search performance data (impressions, clicks, CTR, keywords). Provide GSC API credentials in environment variables.",
          metrics,
        });
      }
    } catch (e: any) {
      console.error("Search metrics error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/seo-performance/content-coverage", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      if (coverageCache.data && Date.now() - coverageCache.builtAt < CACHE_TTL) {
        return res.json(coverageCache.data);
      }

      const data = await buildContentCoverage();
      coverageCache.data = data;
      coverageCache.builtAt = Date.now();
      res.json(data);
    } catch (e: any) {
      console.error("Content coverage error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/seo-performance/refresh", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      contentGrowthCache.data = null;
      contentGrowthCache.builtAt = 0;
      sitemapCache.data = null;
      sitemapCache.builtAt = 0;
      coverageCache.data = null;
      coverageCache.builtAt = 0;

      const [growth, sitemap, coverage] = await Promise.all([
        buildContentGrowthData(),
        buildSitemapAnalysis(),
        buildContentCoverage(),
      ]);

      contentGrowthCache.data = growth;
      contentGrowthCache.builtAt = Date.now();
      sitemapCache.data = sitemap;
      sitemapCache.builtAt = Date.now();
      coverageCache.data = coverage;
      coverageCache.builtAt = Date.now();

      res.json({ success: true, refreshedAt: new Date().toISOString() });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
