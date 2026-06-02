import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

export function registerAnalyticsDashboardRoutes(app: Express) {
  app.get("/api/admin/unified-analytics", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const days = Math.max(1, Math.min(365, Math.floor(Number(req.query.days || 30))));
      const cutoff = `NOW() - INTERVAL '${days} days'`;

      const [
        alliedByProfession,
        alliedByEventType,
        alliedConversions,
        alliedEmailCaptures,
        alliedExamAttempts,
        alliedQuizActivity,
        mltByEventType,
        mltExamAttempts,
        mltQuizActivity,
        emailSignups,
        dailyTrend,
        topPages,
      ] = await Promise.all([
        pool.query(`
          SELECT profession, COUNT(*)::int as total_events,
            COUNT(DISTINCT session_id)::int as unique_sessions,
            COUNT(CASE WHEN event_type = 'page_view' THEN 1 END)::int as page_views,
            COUNT(CASE WHEN event_type = 'quiz_start' THEN 1 END)::int as quiz_starts,
            COUNT(CASE WHEN event_type = 'quiz_complete' THEN 1 END)::int as quiz_completions,
            COUNT(CASE WHEN event_type = 'exam_start' THEN 1 END)::int as exam_starts,
            COUNT(CASE WHEN event_type = 'exam_complete' THEN 1 END)::int as exam_completions,
            COUNT(CASE WHEN event_type = 'mock_exam_attempt' THEN 1 END)::int as mock_exam_attempts,
            COUNT(CASE WHEN event_type = 'practice_question' THEN 1 END)::int as practice_questions,
            COUNT(CASE WHEN event_type = 'conversion' THEN 1 END)::int as conversions,
            COUNT(CASE WHEN event_type = 'email_capture' THEN 1 END)::int as email_captures,
            COUNT(CASE WHEN event_type = 'signup' THEN 1 END)::int as signups,
            COUNT(CASE WHEN event_type = 'upgrade_click' THEN 1 END)::int as upgrade_clicks
          FROM allied_marketing_events
          WHERE created_at > ${cutoff} AND profession IS NOT NULL
          GROUP BY profession ORDER BY total_events DESC
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT event_type, COUNT(*)::int as count
          FROM allied_marketing_events WHERE created_at > ${cutoff}
          GROUP BY event_type ORDER BY count DESC
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT profession, event_type, COUNT(*)::int as count
          FROM allied_marketing_events
          WHERE created_at > ${cutoff} AND event_type IN ('conversion', 'upgrade_click', 'upgrade_prompt_shown')
          GROUP BY profession, event_type ORDER BY count DESC
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT profession, COUNT(*)::int as count
          FROM allied_email_captures WHERE created_at > ${cutoff} AND profession IS NOT NULL
          GROUP BY profession ORDER BY count DESC
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT profession,
            COUNT(CASE WHEN event_type = 'exam_start' THEN 1 END)::int as starts,
            COUNT(CASE WHEN event_type = 'exam_complete' THEN 1 END)::int as completions,
            COUNT(CASE WHEN event_type = 'mock_exam_attempt' THEN 1 END)::int as mock_attempts
          FROM allied_marketing_events
          WHERE created_at > ${cutoff} AND event_type IN ('exam_start', 'exam_complete', 'mock_exam_attempt')
          GROUP BY profession ORDER BY starts DESC
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT profession,
            COUNT(CASE WHEN event_type = 'quiz_start' THEN 1 END)::int as starts,
            COUNT(CASE WHEN event_type = 'quiz_complete' THEN 1 END)::int as completions,
            COUNT(CASE WHEN event_type = 'practice_question' THEN 1 END)::int as questions_answered
          FROM allied_marketing_events
          WHERE created_at > ${cutoff} AND event_type IN ('quiz_start', 'quiz_complete', 'practice_question')
          GROUP BY profession ORDER BY starts DESC
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT event_type, COUNT(*)::int as count
          FROM mlt_analytics_events WHERE created_at > ${cutoff}
          GROUP BY event_type ORDER BY count DESC
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT event_type, COUNT(*)::int as count
          FROM mlt_analytics_events
          WHERE created_at > ${cutoff} AND event_category = 'exam'
          GROUP BY event_type ORDER BY count DESC
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT
            COUNT(CASE WHEN event_category = 'quiz' AND event_action = 'start' THEN 1 END)::int as quiz_starts,
            COUNT(CASE WHEN event_category = 'quiz' AND event_action = 'complete' THEN 1 END)::int as quiz_completions,
            COUNT(CASE WHEN event_category = 'lesson' THEN 1 END)::int as lesson_activity,
            COUNT(CASE WHEN event_category = 'flashcard' THEN 1 END)::int as flashcard_activity
          FROM mlt_analytics_events WHERE created_at > ${cutoff}
        `).catch(() => ({ rows: [{}] })),

        pool.query(`
          SELECT COUNT(*)::int as total FROM email_signups WHERE created_at > ${cutoff}
        `).catch(() => ({ rows: [{ total: 0 }] })),

        pool.query(`
          SELECT DATE(created_at) as day,
            COUNT(*)::int as total_events,
            COUNT(DISTINCT session_id)::int as unique_sessions,
            COUNT(CASE WHEN event_type = 'page_view' THEN 1 END)::int as page_views,
            COUNT(CASE WHEN event_type IN ('conversion', 'upgrade_click', 'signup') THEN 1 END)::int as conversions
          FROM allied_marketing_events WHERE created_at > ${cutoff}
          GROUP BY DATE(created_at) ORDER BY day DESC LIMIT 60
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT page, COUNT(*)::int as views, COUNT(DISTINCT session_id)::int as unique_visitors
          FROM allied_marketing_events
          WHERE created_at > ${cutoff} AND event_type = 'page_view' AND page IS NOT NULL
          GROUP BY page ORDER BY views DESC LIMIT 30
        `).catch(() => ({ rows: [] })),
      ]);

      res.json({
        period: { days },
        professionBreakdown: alliedByProfession.rows,
        eventTypeBreakdown: alliedByEventType.rows,
        conversionFunnel: alliedConversions.rows,
        emailCapturesByProfession: alliedEmailCaptures.rows,
        examActivity: alliedExamAttempts.rows,
        quizActivity: alliedQuizActivity.rows,
        mlt: {
          eventTypes: mltByEventType.rows,
          examActivity: mltExamAttempts.rows,
          quizActivity: mltQuizActivity.rows[0] || {},
        },
        emailSignups: emailSignups.rows[0]?.total || 0,
        dailyTrend: dailyTrend.rows,
        topPages: topPages.rows,
      });
    } catch (err: any) {
      console.error("Unified analytics error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });
}
