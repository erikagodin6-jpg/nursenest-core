/**
 * Phase 15 — Analytics Resilience
 * Nightly analytics snapshot engine.
 *
 * Generates and caches per-user analytics so dashboards never show blank state.
 * When the live analytics pipeline is unavailable, the last known report is served.
 */

import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { resolveAuthUser } from "./admin-auth";
import { addAlert } from "./platform-resilience";

export interface AnalyticsSnapshot {
  userId: string;
  tier: string;
  studyStreakDays: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  overallAccuracy: number;
  weakTopics: string[];
  strongTopics: string[];
  lessonsCompleted: number;
  flashcardsReviewed: number;
  catSessionsCompleted: number;
  lastCatScore: number | null;
  readinessScore: number;
  studyHoursThisWeek: number;
  reportCard: Record<string, any>;
  generatedAt: string;
  isStale: boolean;
}

export async function ensureAnalyticsSnapshotTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_snapshots (
        user_id varchar PRIMARY KEY,
        tier text NOT NULL DEFAULT 'free',
        study_streak_days integer NOT NULL DEFAULT 0,
        total_questions_answered integer NOT NULL DEFAULT 0,
        total_correct integer NOT NULL DEFAULT 0,
        overall_accuracy numeric NOT NULL DEFAULT 0,
        weak_topics text[] NOT NULL DEFAULT '{}'::text[],
        strong_topics text[] NOT NULL DEFAULT '{}'::text[],
        lessons_completed integer NOT NULL DEFAULT 0,
        flashcards_reviewed integer NOT NULL DEFAULT 0,
        cat_sessions_completed integer NOT NULL DEFAULT 0,
        last_cat_score numeric,
        readiness_score numeric NOT NULL DEFAULT 0,
        study_hours_this_week numeric NOT NULL DEFAULT 0,
        report_card jsonb NOT NULL DEFAULT '{}'::jsonb,
        generated_at timestamptz NOT NULL DEFAULT NOW(),
        valid_until timestamptz NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_stale ON analytics_snapshots(valid_until);
    `);
  } catch (e: any) {
    console.error("[AnalyticsSnapshot] Table init error:", e.message);
  }
}

export async function generateAnalyticsSnapshot(userId: string, tier: string = "rn"): Promise<AnalyticsSnapshot | null> {
  try {
    // Question stats
    const { rows: qStats } = await pool.query(
      `SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_correct = true) as correct
       FROM user_question_history WHERE user_id = $1`,
      [userId]
    ).catch(() => ({ rows: [{ total: 0, correct: 0 }] }));

    const total = parseInt(qStats[0]?.total || "0");
    const correct = parseInt(qStats[0]?.correct || "0");
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Weak/strong topics
    const { rows: topicStats } = await pool.query(
      `SELECT COALESCE(q.topic, 'General') as topic,
              COUNT(*) FILTER (WHERE h.is_correct = true)::float / NULLIF(COUNT(*), 0) as accuracy
       FROM user_question_history h
       LEFT JOIN exam_questions q ON q.id = h.question_id
       WHERE h.user_id = $1
       GROUP BY q.topic ORDER BY accuracy ASC`,
      [userId]
    ).catch(() => ({ rows: [] }));

    const weakTopics = topicStats.filter((r: any) => parseFloat(r.accuracy || "0") < 0.6).map((r: any) => r.topic).slice(0, 5);
    const strongTopics = topicStats.filter((r: any) => parseFloat(r.accuracy || "0") >= 0.8).map((r: any) => r.topic).slice(0, 5);

    // Lesson completion
    const { rows: lessonStats } = await pool.query(
      `SELECT COUNT(*) as count FROM user_lesson_progress WHERE user_id = $1 AND completed = true`,
      [userId]
    ).catch(() => ({ rows: [{ count: 0 }] }));

    // CAT sessions
    const { rows: catStats } = await pool.query(
      `SELECT COUNT(*) as sessions, MAX(score) as last_score FROM cat_sessions WHERE user_id = $1 AND completed = true`,
      [userId]
    ).catch(() => ({ rows: [{ sessions: 0, last_score: null }] }));

    // Study streak
    const { rows: streakRows } = await pool.query(
      `SELECT COUNT(DISTINCT DATE(answered_at)) as streak_days
       FROM user_question_history
       WHERE user_id = $1 AND answered_at > NOW() - INTERVAL '30 days'`,
      [userId]
    ).catch(() => ({ rows: [{ streak_days: 0 }] }));

    const snapshot: AnalyticsSnapshot = {
      userId,
      tier,
      studyStreakDays: parseInt(streakRows[0]?.streak_days || "0"),
      totalQuestionsAnswered: total,
      totalCorrect: correct,
      overallAccuracy: accuracy,
      weakTopics,
      strongTopics,
      lessonsCompleted: parseInt(lessonStats[0]?.count || "0"),
      flashcardsReviewed: 0,
      catSessionsCompleted: parseInt(catStats[0]?.sessions || "0"),
      lastCatScore: catStats[0]?.last_score ? parseFloat(catStats[0].last_score) : null,
      readinessScore: accuracy >= 85 ? 90 : Math.round(accuracy * 0.9),
      studyHoursThisWeek: 0,
      reportCard: {
        accuracy,
        weakTopics,
        strongTopics,
        lessonsCompleted: parseInt(lessonStats[0]?.count || "0"),
        catSessions: parseInt(catStats[0]?.sessions || "0"),
        generated: new Date().toISOString(),
      },
      generatedAt: new Date().toISOString(),
      isStale: false,
    };

    await pool.query(
      `INSERT INTO analytics_snapshots
         (user_id, tier, study_streak_days, total_questions_answered, total_correct, overall_accuracy,
          weak_topics, strong_topics, lessons_completed, flashcards_reviewed, cat_sessions_completed,
          last_cat_score, readiness_score, study_hours_this_week, report_card, generated_at, valid_until)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,NOW(),$16)
       ON CONFLICT (user_id) DO UPDATE SET
         tier=$2, study_streak_days=$3, total_questions_answered=$4, total_correct=$5, overall_accuracy=$6,
         weak_topics=$7, strong_topics=$8, lessons_completed=$9, flashcards_reviewed=$10,
         cat_sessions_completed=$11, last_cat_score=$12, readiness_score=$13, study_hours_this_week=$14,
         report_card=$15, generated_at=NOW(), valid_until=$16`,
      [
        userId, tier, snapshot.studyStreakDays, total, correct, accuracy,
        weakTopics, strongTopics, snapshot.lessonsCompleted, 0, snapshot.catSessionsCompleted,
        snapshot.lastCatScore, snapshot.readinessScore, 0, JSON.stringify(snapshot.reportCard),
        new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
      ]
    );

    return snapshot;
  } catch (e: any) {
    console.error("[AnalyticsSnapshot] Generate error:", e.message);
    return null;
  }
}

export async function getAnalyticsSnapshot(userId: string): Promise<AnalyticsSnapshot | null> {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM analytics_snapshots WHERE user_id = $1`,
      [userId]
    );
    if (!rows.length) return null;
    const r = rows[0];
    return {
      userId: r.user_id,
      tier: r.tier,
      studyStreakDays: r.study_streak_days,
      totalQuestionsAnswered: r.total_questions_answered,
      totalCorrect: r.total_correct,
      overallAccuracy: parseFloat(r.overall_accuracy || "0"),
      weakTopics: r.weak_topics || [],
      strongTopics: r.strong_topics || [],
      lessonsCompleted: r.lessons_completed,
      flashcardsReviewed: r.flashcards_reviewed,
      catSessionsCompleted: r.cat_sessions_completed,
      lastCatScore: r.last_cat_score ? parseFloat(r.last_cat_score) : null,
      readinessScore: parseFloat(r.readiness_score || "0"),
      studyHoursThisWeek: parseFloat(r.study_hours_this_week || "0"),
      reportCard: r.report_card || {},
      generatedAt: r.generated_at.toISOString(),
      isStale: new Date(r.valid_until).getTime() < Date.now(),
    };
  } catch {
    return null;
  }
}

export async function runNightlyAnalyticsSnapshots(): Promise<{ refreshed: number; errors: number }> {
  let refreshed = 0;
  let errors = 0;
  try {
    const { rows: users } = await pool.query(
      `SELECT id, COALESCE(tier, 'rn') as tier FROM users WHERE created_at > NOW() - INTERVAL '1 year' LIMIT 5000`
    ).catch(() => ({ rows: [] }));

    const BATCH = 20;
    for (let i = 0; i < users.length; i += BATCH) {
      await Promise.allSettled(
        users.slice(i, i + BATCH).map(async (u: any) => {
          const snap = await generateAnalyticsSnapshot(u.id, u.tier);
          if (snap) refreshed++; else errors++;
        })
      );
      await new Promise((r) => setTimeout(r, 300));
    }
  } catch (e: any) {
    addAlert("warning", "analytics_snapshot", "Nightly Analytics Snapshot Failed", e.message, "analytics-snapshot-engine");
  }
  return { refreshed, errors };
}

export function registerAnalyticsSnapshotRoutes(app: Express): void {
  app.get("/api/analytics/snapshot", async (req: Request, res: Response) => {
    const authUser = await resolveAuthUser(req).catch(() => null);
    if (!authUser) return res.status(401).json({ error: "unauthorized" });

    let snapshot = await getAnalyticsSnapshot(authUser.id);
    if (!snapshot) {
      snapshot = await generateAnalyticsSnapshot(authUser.id, (authUser as any).tier || "rn");
    }
    if (!snapshot) return res.status(503).json({ error: "analytics_unavailable" });

    return res.json({ ok: true, snapshot });
  });
}
