import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

function getWeekBounds(weeksAgo: number = 0): { start: Date; end: Date } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset - weeksAgo * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
}

async function computeWeeklyContentCounts(start: Date, end: Date) {
  const startStr = start.toISOString();
  const endStr = end.toISOString();

  const [lessons, blogs, flashcards, examQuestions, seoArticles] = await Promise.all([
    pool.query(
      `SELECT COUNT(*)::int as count FROM content_items WHERE type = 'lesson' AND created_at >= $1 AND created_at <= $2`,
      [startStr, endStr]
    ).catch(() => ({ rows: [{ count: 0 }] })),
    pool.query(
      `SELECT COUNT(*)::int as count FROM content_items WHERE type = 'blog' AND created_at >= $1 AND created_at <= $2`,
      [startStr, endStr]
    ).catch(() => ({ rows: [{ count: 0 }] })),
    pool.query(
      `SELECT COUNT(*)::int as count FROM flashcard_bank WHERE created_at >= $1 AND created_at <= $2`,
      [startStr, endStr]
    ).catch(() => ({ rows: [{ count: 0 }] })),
    pool.query(
      `SELECT COUNT(*)::int as count FROM exam_questions WHERE created_at >= $1 AND created_at <= $2`,
      [startStr, endStr]
    ).catch(() => ({ rows: [{ count: 0 }] })),
    pool.query(
      `SELECT COUNT(*)::int as count FROM seo_articles WHERE created_at >= $1 AND created_at <= $2`,
      [startStr, endStr]
    ).catch(() => ({ rows: [{ count: 0 }] })),
  ]);

  return {
    lessonsCreated: Number(lessons.rows[0]?.count || 0),
    blogPostsCreated: Number(blogs.rows[0]?.count || 0),
    flashcardsCreated: Number(flashcards.rows[0]?.count || 0),
    examQuestionsCreated: Number(examQuestions.rows[0]?.count || 0),
    seoArticlesCreated: Number(seoArticles.rows[0]?.count || 0),
  };
}

export function registerWeeklyReportRoutes(app: Express) {
  app.get("/api/admin/weekly-reports", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const weeks = Math.max(1, Math.min(52, Number(req.query.weeks || 12)));

      const existingReports = await pool.query(
        `SELECT * FROM content_weekly_reports ORDER BY week_start DESC LIMIT $1`,
        [weeks]
      ).catch(() => ({ rows: [] }));

      const reports = existingReports.rows.map((r: any) => ({
        id: r.id,
        weekStart: r.week_start,
        weekEnd: r.week_end,
        lessonsCreated: Number(r.lessons_created),
        blogPostsCreated: Number(r.blog_posts_created),
        flashcardsCreated: Number(r.flashcards_created),
        examQuestionsCreated: Number(r.exam_questions_created),
        seoArticlesCreated: Number(r.seo_articles_created),
        totalContentCreated: Number(r.total_content_created),
        previousWeekTotal: Number(r.previous_week_total || 0),
        weekOverWeekChange: Number(r.week_over_week_change || 0),
        breakdownJson: r.breakdown_json,
        createdAt: r.created_at,
      }));

      res.json({ reports, count: reports.length });
    } catch (e: any) {
      console.error("[WeeklyReports] Error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/weekly-reports/current", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { start, end } = getWeekBounds(0);
      const counts = await computeWeeklyContentCounts(start, end);
      const total = counts.lessonsCreated + counts.blogPostsCreated +
        counts.flashcardsCreated + counts.examQuestionsCreated + counts.seoArticlesCreated;

      const prevWeek = getWeekBounds(1);
      const prevCounts = await computeWeeklyContentCounts(prevWeek.start, prevWeek.end);
      const prevTotal = prevCounts.lessonsCreated + prevCounts.blogPostsCreated +
        prevCounts.flashcardsCreated + prevCounts.examQuestionsCreated + prevCounts.seoArticlesCreated;

      const wowChange = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : (total > 0 ? 100 : 0);

      res.json({
        weekStart: start.toISOString(),
        weekEnd: end.toISOString(),
        ...counts,
        totalContentCreated: total,
        previousWeekTotal: prevTotal,
        weekOverWeekChange: Math.round(wowChange * 10) / 10,
        previousWeek: prevCounts,
      });
    } catch (e: any) {
      console.error("[WeeklyReports] Current week error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/weekly-reports/generate", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const weeksToGenerate = Math.max(1, Math.min(26, Number(req.body.weeks || 12)));
      const generated: any[] = [];

      for (let w = weeksToGenerate - 1; w >= 0; w--) {
        const { start, end } = getWeekBounds(w);

        const existing = await pool.query(
          `SELECT id FROM content_weekly_reports WHERE week_start = $1`,
          [start.toISOString()]
        ).catch(() => ({ rows: [] }));

        if (existing.rows.length > 0) continue;

        const counts = await computeWeeklyContentCounts(start, end);
        const total = counts.lessonsCreated + counts.blogPostsCreated +
          counts.flashcardsCreated + counts.examQuestionsCreated + counts.seoArticlesCreated;

        const prevWeek = getWeekBounds(w + 1);
        const prevCounts = await computeWeeklyContentCounts(prevWeek.start, prevWeek.end);
        const prevTotal = prevCounts.lessonsCreated + prevCounts.blogPostsCreated +
          prevCounts.flashcardsCreated + prevCounts.examQuestionsCreated + prevCounts.seoArticlesCreated;

        const wowChange = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : (total > 0 ? 100 : 0);

        const result = await pool.query(
          `INSERT INTO content_weekly_reports
           (id, week_start, week_end, lessons_created, blog_posts_created, flashcards_created,
            exam_questions_created, seo_articles_created, total_content_created,
            previous_week_total, week_over_week_change, breakdown_json, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
           RETURNING *`,
          [
            start.toISOString(), end.toISOString(),
            counts.lessonsCreated, counts.blogPostsCreated, counts.flashcardsCreated,
            counts.examQuestionsCreated, counts.seoArticlesCreated, total,
            prevTotal, Math.round(wowChange * 10) / 10,
            JSON.stringify({ ...counts, previousWeek: prevCounts }),
          ]
        );

        generated.push(result.rows[0]);
      }

      res.json({ generated: generated.length, reports: generated });
    } catch (e: any) {
      console.error("[WeeklyReports] Generate error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/content-velocity", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const days = Math.max(1, Math.min(90, Number(req.query.days || 30)));
      const cutoff = new Date(Date.now() - days * 86400000).toISOString();

      const [dailyContent, dailyQuestions, dailyFlashcards, dailySeoArticles] = await Promise.all([
        pool.query(
          `SELECT DATE(created_at) as day, type, COUNT(*)::int as count
           FROM content_items WHERE created_at >= $1
           GROUP BY DATE(created_at), type ORDER BY day`,
          [cutoff]
        ).catch(() => ({ rows: [] })),
        pool.query(
          `SELECT DATE(created_at) as day, COUNT(*)::int as count
           FROM exam_questions WHERE created_at >= $1
           GROUP BY DATE(created_at) ORDER BY day`,
          [cutoff]
        ).catch(() => ({ rows: [] })),
        pool.query(
          `SELECT DATE(created_at) as day, COUNT(*)::int as count
           FROM flashcard_bank WHERE created_at >= $1
           GROUP BY DATE(created_at) ORDER BY day`,
          [cutoff]
        ).catch(() => ({ rows: [] })),
        pool.query(
          `SELECT DATE(created_at) as day, COUNT(*)::int as count
           FROM seo_articles WHERE created_at >= $1
           GROUP BY DATE(created_at) ORDER BY day`,
          [cutoff]
        ).catch(() => ({ rows: [] })),
      ]);

      const dailyMap: Record<string, any> = {};
      for (const row of dailyContent.rows) {
        const d = row.day?.toISOString?.()?.slice(0, 10) || String(row.day);
        if (!dailyMap[d]) dailyMap[d] = { date: d, lessons: 0, blogs: 0, flashcards: 0, examQuestions: 0, seoArticles: 0 };
        if (row.type === "lesson") dailyMap[d].lessons = Number(row.count);
        else if (row.type === "blog") dailyMap[d].blogs = Number(row.count);
      }
      for (const row of dailyQuestions.rows) {
        const d = row.day?.toISOString?.()?.slice(0, 10) || String(row.day);
        if (!dailyMap[d]) dailyMap[d] = { date: d, lessons: 0, blogs: 0, flashcards: 0, examQuestions: 0, seoArticles: 0 };
        dailyMap[d].examQuestions = Number(row.count);
      }
      for (const row of dailyFlashcards.rows) {
        const d = row.day?.toISOString?.()?.slice(0, 10) || String(row.day);
        if (!dailyMap[d]) dailyMap[d] = { date: d, lessons: 0, blogs: 0, flashcards: 0, examQuestions: 0, seoArticles: 0 };
        dailyMap[d].flashcards = Number(row.count);
      }
      for (const row of dailySeoArticles.rows) {
        const d = row.day?.toISOString?.()?.slice(0, 10) || String(row.day);
        if (!dailyMap[d]) dailyMap[d] = { date: d, lessons: 0, blogs: 0, flashcards: 0, examQuestions: 0, seoArticles: 0 };
        dailyMap[d].seoArticles = Number(row.count);
      }

      const dailyData = Object.values(dailyMap).sort((a: any, b: any) => a.date.localeCompare(b.date));

      res.json({ days, dailyData });
    } catch (e: any) {
      console.error("[ContentVelocity] Error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });
}
